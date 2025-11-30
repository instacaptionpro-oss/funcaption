export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { subject, mood, region } = req.body;

  if (!subject || !mood) {
    return res.status(400).json({ error: "Subject and mood required" });
  }

  const HF_URL = "https://router.huggingface.co/v1/chat/completions";

  const prompt = `Write 1 premium Instagram caption.
Subject: ${subject}
Mood: ${mood}
Region: ${region || "none"}
Rules:
- Make it stylish, modern, emotional
- 2–3 lines
- Include hashtags
- Do NOT repeat user input
- Caption only, no explanations`;

  let premiumCaption = null;

  try {
    const hfRes = await fetch(HF_URL, {
      method: "POST",
      headers: {
        "Authorization": Bearer ${process.env.HF_TOKEN},
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: process.env.HF_MODEL,
        messages: [
          { role: "user", content: prompt }
        ]
      })
    });

    const data = await hfRes.json();

    if (hfRes.ok) {
      premiumCaption =
        data.choices?.[0]?.message?.content?.trim() || null;
    } else {
      console.log("HF Error:", data);
    }
  } catch (err) {
    console.log("HF API failed:", err);
  }

  // fallback captions
  const fallback1 = ${subject}\n${mood} energy hits different.\n\n#${mood} #trending;
  const fallback2 = ${subject} — in the mood.\n\n#${mood}Life #vibes;

  const finalOutput = [
    { caption: premiumCaption || fallback1, premium: true },
    { caption: fallback1, premium: false },
    { caption: fallback2, premium: false }
  ];

  return res.status(200).json({ variants: finalOutput });
}
