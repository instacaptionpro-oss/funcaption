import fs from "fs";
import path from "path";

const analyticsPath = path.join(process.cwd(), "data", "analytics.json");

function updateAnalytics() {
  try {
    const raw = fs.readFileSync(analyticsPath, "utf8");
    const data = JSON.parse(raw);

    const today = new Date().toISOString().slice(0, 10);

    data.total_requests += 1;
    data.by_day[today] = (data.by_day[today] || 0) + 1;

    fs.writeFileSync(analyticsPath, JSON.stringify(data, null, 2));
  } catch (err) {
    console.error("Analytics update failed:", err);
  }
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { subject, mood, region, details, feedback } = req.body;

  if (!subject || !mood) {
    return res.status(400).json({ error: "Subject and mood required" });
  }

  const HF_API_KEY = process.env.HUGGINGFACE_API_KEY;
  const MODEL = process.env.HUGGINGFACE_MODEL;
  const HF_URL = "https://router.huggingface.co/v1/chat/completions";

  // Clean extras
  const cleanDetails =
    typeof details === "string" && details.trim().length > 0
      ? details.trim()
      : null;

  const cleanFeedback =
    typeof feedback === "string" && feedback.trim().length > 0
      ? feedback.trim()
      : null;

  if (cleanFeedback) {
    console.log("User feedback:", cleanFeedback);
  }

  let shortCaption = null;
  let longCaption = null;
  let regionalCaption = null;

  // Generate captions using HuggingFace
  try {
    if (HF_API_KEY && MODEL) {
      const extraDetails = cleanDetails
        ? `Reel details: ${cleanDetails}\n`
        : "";

      // Short Caption Prompt
      const shortPrompt = `
You are a caption writer for Indian Instagram creators.

Generate exactly 1 SHORT Instagram caption (1-2 lines max).

Subject: ${subject}
Mood: ${mood}
Region: ${region}
${extraDetails}
Rules:
- Make it punchy, impactful, and catchy
- 1-2 lines maximum
- Include 3-5 relevant, modern hashtags
- Do NOT just repeat the subject or details word-by-word
- Make it feel like a viral caption built to hack Instagram's algorithm
- Return ONLY the caption text, nothing else.
      `;

      // Long Caption Prompt
      const longPrompt = `
You are a caption writer for Indian Instagram creators.

Generate exactly 1 LONG Instagram caption (3-4 lines).

Subject: ${subject}
Mood: ${mood}
Region: ${region}
${extraDetails}
Rules:
- Make it emotional, deep, and storytelling
- 3-4 lines maximum
- Include 5-8 relevant, modern hashtags
- Do NOT just repeat the subject or details word-by-word
- Make it feel like a premium caption built to hack Instagram's algorithm
- Return ONLY the caption text, nothing else.
      `;

      // Regional Caption Prompt (if region is specified)
      let regionalPrompt = null;
      if (region && region !== "none") {
        regionalPrompt = `
You are a caption writer for Indian Instagram creators.

Generate exactly 1 Instagram caption in the specified regional language AND English.

Subject: ${subject}
Mood: ${mood}
Region: ${region}
${extraDetails}
Rules:
- Write primarily in the regional language associated with: ${region}
- Include English translation if helpful
- Make it culturally relevant and authentic
- 2-3 lines maximum
- Include 3-5 relevant hashtags in English
- Return ONLY the caption text, nothing else.
        `;
      }

      // Fetch short caption
      const shortResponse = await fetch(HF_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${HF_API_KEY}`,
        },
        body: JSON.stringify({
          model: MODEL,
          messages: [{ role: "user", content: shortPrompt }],
          max_tokens: 150,
        }),
      });

      if (shortResponse.ok) {
        const data = await shortResponse.json();
        const text = data?.choices?.[0]?.message?.content || "";
        if (text && text.trim().length > 10) {
          shortCaption = text.trim();
        }
      }

      // Fetch long caption
      const longResponse = await fetch(HF_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${HF_API_KEY}`,
        },
        body: JSON.stringify({
          model: MODEL,
          messages: [{ role: "user", content: longPrompt }],
          max_tokens: 200,
        }),
      });

      if (longResponse.ok) {
        const data = await longResponse.json();
        const text = data?.choices?.[0]?.message?.content || "";
        if (text && text.trim().length > 10) {
          longCaption = text.trim();
        }
      }

      // Fetch regional caption (if applicable)
      if (regionalPrompt) {
        const regionalResponse = await fetch(HF_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${HF_API_KEY}`,
          },
          body: JSON.stringify({
            model: MODEL,
            messages: [{ role: "user", content: regionalPrompt }],
            max_tokens: 180,
          }),
        });

        if (regionalResponse.ok) {
          const data = await regionalResponse.json();
          const text = data?.choices?.[0]?.message?.content || "";
          if (text && text.trim().length > 10) {
            regionalCaption = text.trim();
          }
        }
      }
    }
  } catch (err) {
    console.error("Caption generation failed", err);
  }

  // Build base line for fallbacks
  const baseLine = cleanDetails
    ? `${subject} — ${cleanDetails}`
    : subject;

  // Fallback captions
  const fallbackShort = `${baseLine}.\n${mood} energy 🔥\n\n#${mood} #viral #instagram #indiancreator`;
  const fallbackLong = `${baseLine} speaks louder than words.\nThis ${mood} moment defines everything.\nFeel the vibe, share the energy.\n\n#${mood} #trending #creators #indiancontent #viral`;

  // Regional fallback
  const regionalFallback = region && region !== "none" 
    ? `${baseLine} (${region} style)\n${mood} vibes only 🌟\n\n#${mood} #${region} #localcreator`
    : fallbackShort;

  const variants = [
    {
      caption: longCaption || fallbackLong,
      type: "long",
      label: "Story Mode",
      premium: true
    },
    {
      caption: shortCaption || fallbackShort,
      type: "short",
      label: "Quick Fire",
      premium: false
    },
    {
      caption: regionalCaption || regionalFallback,
      type: "regional",
      label: region && region !== "none" ? `${region.charAt(0).toUpperCase() + region.slice(1)} Style` : "Regional",
      premium: false,
      regionLabel: region && region !== "none" ? region : null
    }
  ];

  // Update analytics
  updateAnalytics();

  return res.status(200).json({ variants });
}
