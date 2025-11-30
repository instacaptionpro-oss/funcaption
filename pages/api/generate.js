export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { subject, mood, region } = req.body;

  if (!subject || !mood) {
    return res.status(400).json({ error: "Subject and mood required" });
  }

  const HF_API_KEY = process.env.HUGGINGFACE_API_KEY;
  const MODEL = process.env.HUGGINGFACE_MODEL;
  const HF_URL = "https://router.huggingface.co/v1/chat/completions";

  let premiumCaption = null;

  // PREMIUM CAPTION → HuggingFace
  try {
    if (HF_API_KEY && MODEL) {
      const prompt = `
Generate 1 Instagram caption.

Subject: ${subject}
Mood: ${mood}
Region: ${region}

Rules:
- Make it emotional, deep, stylish.
- 2–3 lines maximum.
- Include relevant hashtags.
- Do NOT repeat user inputs exactly.
- Make it feel premium.
      `;

      const response = await fetch(HF_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${HF_API_KEY}`
        },
        body: JSON.stringify({
          model: MODEL,
          messages: [{ role: "user", content: prompt }],
          max_tokens: 150
        })
      });

      if (response.ok) {
        const data = await response.json();
        const text = data?.choices?.[0]?.message?.content || "";

        if (text.length > 10) {
          premiumCaption = text.trim();
        }
      } else {
        console.log("HF non-ok response:", await response.text());
      }
    }
  } catch (err) {
    console.error("Premium caption failed", err);
  }

  // FALLBACK CAPTIONS (2 normal captions)
  const fallback1 = `${subject}.\n${mood} vibes hit different.\n\n#${mood} #viral #instagram`;
  const fallback2 = `${subject} speaks louder than words.\n${mood} energy.\n\n#${mood} #trending #creators`;

  const variants = [
    {
      caption: premiumCaption || fallback1,
      premium: true
    },
    {
      caption: fallback1,
      premium: false
    },
    {
      caption: fallback2,
      premium: false
    }
  ];

  return res.status(200).json({ variants });
}
