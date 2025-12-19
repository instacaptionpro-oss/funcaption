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

  const { subject, mood, details, feedback } = req.body;

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

  // Generate captions using HuggingFace
  try {
    if (HF_API_KEY && MODEL) {
      const extraDetails = cleanDetails
        ? `Reel details: ${cleanDetails}\n`
        : "";

      // Short Caption Prompt (GenZ focused)
      const shortPrompt = `
You are a viral caption writer for Indian GenZ Instagram creators.

Generate exactly 1 SHORT Instagram caption (1-2 lines max).

Subject: ${subject}
Mood: ${mood}
${extraDetails}
Rules:
- Write for GenZ audience (18-25 years old)
- Use trendy, modern language that GenZ relates to
- Make it punchy, impactful, and scroll-stopping
- 1-2 lines maximum
- Can include English, Hinglish, or trendy slang
- Include 3-5 relevant, modern hashtags
- Do NOT just repeat the subject or details word-by-word
- Make it feel like a viral caption built to hack Instagram's algorithm
- Think: what would make a GenZ stop scrolling and feel "this is SO me"
- Return ONLY the caption text, nothing else.
      `;

      // Long Caption Prompt (GenZ focused)
      const longPrompt = `
You are a viral caption writer for Indian GenZ Instagram creators.

Generate exactly 1 LONG Instagram caption (3-4 lines).

Subject: ${subject}
Mood: ${mood}
${extraDetails}
Rules:
- Write for GenZ audience (18-25 years old)
- Make it emotional, deep, and storytelling
- Use language that hits different for GenZ
- 3-4 lines maximum
- Can include English, Hinglish, or trendy expressions
- Include 5-8 relevant, modern hashtags
- Do NOT just repeat the subject or details word-by-word
- Make it feel like a premium caption that speaks to GenZ soul
- Think: captions that get saved and shared
- Return ONLY the caption text, nothing else.
      `;

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
    }
  } catch (err) {
    console.error("Caption generation failed", err);
  }

  // Build base line for fallbacks
  const baseLine = cleanDetails
    ? `${subject} — ${cleanDetails}`
    : subject;

  // Fallback captions (GenZ style)
  const fallbackShort = `${baseLine}.\n${mood} energy only 🔥\n\n#${mood} #viral #genz #reels #trending`;
  const fallbackLong = `${baseLine} hits different fr.\nThis ${mood} moment > everything else.\nIykyk 🤷‍♂️\n\n#${mood} #trending #genz #viral #reelsinstagram #relatable`;

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
    }
  ];

  // Update analytics
  updateAnalytics();

  return res.status(200).json({ variants });
}
