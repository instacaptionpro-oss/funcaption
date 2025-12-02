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

  let premiumCaption = null;

  // PREMIUM CAPTION → HuggingFace
  try {
    if (HF_API_KEY && MODEL) {
      const extraDetails = cleanDetails
        ? `Reel details: ${cleanDetails}\n`
        : "";

      const prompt = `
You are a caption writer for Indian Instagram creators.

Generate exactly 1 Instagram caption.

Subject: ${subject}
Mood: ${mood}
Region: ${region}
${extraDetails}
Rules:
- Make it emotional, deep, and stylish.
- 2–3 lines maximum.
- Include relevant, modern hashtags on the last line.
- Do NOT just repeat the subject or details word-by-word.
- Make it feel like a premium caption built to hack Instagram's algorithm.
- Return ONLY the caption text, nothing else.
      `;

      const response = await fetch(HF_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${HF_API_KEY}`,
        },
        body: JSON.stringify({
          model: MODEL,
          messages: [{ role: "user", content: prompt }],
          max_tokens: 180,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const text = data?.choices?.[0]?.message?.content || "";
        if (text && text.trim().length > 10) {
          premiumCaption = text.trim();
        }
      } else {
        console.log("HF non-ok response:", await response.text());
      }
    }
  } catch (err) {
    console.error("Premium caption failed", err);
  }

  // Build base line
  const baseLine = cleanDetails
    ? `${subject} — ${cleanDetails}`
    : subject;

  // FALLBACK CAPTIONS
  const fallback1 = `${baseLine}.\n${mood} vibes hit different.\n\n#${mood} #viral #instagram`;
  const fallback2 = `${baseLine} speaks louder than words.\n${mood} energy.\n\n#${mood} #trending #creators`;

  const variants = [
    {
      caption: premiumCaption || fallback1,
      premium: true,
    },
    {
      caption: fallback1,
      premium: false,
    },
    {
      caption: fallback2,
      premium: false,
    },
  ];

  return res.status(200).json({ variants });
}
