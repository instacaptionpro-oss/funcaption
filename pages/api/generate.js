import OpenAI from 'openai';

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { subject, mood, region, details, feedback } = req.body;

  if (!subject || !mood) {
    return res.status(400).json({ error: "Subject and mood required" });
  }

  const HF_TOKEN = process.env.HF_TOKEN;
  
  if (!HF_TOKEN) {
    return res.status(500).json({ error: "Server configuration error" });
  }

  // Clean extras
  const cleanDetails =
    typeof details === "string" && details.trim().length > 0
      ? details.trim()
      : null;

  const cleanFeedback =
    typeof feedback === "string" && feedback.trim().length > 0
      : null;

  if (cleanFeedback) {
    console.log("User feedback:", cleanFeedback);
  }

  let shortCaption = null;
  let longCaption = null;
  let regionalCaption = null;

  // Generate captions using DeepSeek model
  try {
    const client = new OpenAI({
      baseURL: "https://router.huggingface.co/v1",
      apiKey: HF_TOKEN,
    });

    if (HF_TOKEN) {
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

      // Fetch short caption with timeout
      const shortResponse = await Promise.race([
        client.chat.completions.create({
          model: "deepseek-ai/DeepSeek-R1-Distill-Qwen-14B:novita",
          messages: [{ role: "user", content: shortPrompt }],
          max_tokens: 150,
          temperature: 0.7,
        }),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Timeout')), 15000)
        )
      ]);

      if (shortResponse && shortResponse.choices && shortResponse.choices[0]) {
        const text = shortResponse.choices[0].message.content || "";
        if (text && text.trim().length > 10) {
          shortCaption = text.trim();
        }
      }

      // Fetch long caption with timeout
      const longResponse = await Promise.race([
        client.chat.completions.create({
          model: "deepseek-ai/DeepSeek-R1-Distill-Qwen-14B:novita",
          messages: [{ role: "user", content: longPrompt }],
          max_tokens: 200,
          temperature: 0.7,
        }),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Timeout')), 15000)
        )
      ]);

      if (longResponse && longResponse.choices && longResponse.choices[0]) {
        const text = longResponse.choices[0].message.content || "";
        if (text && text.trim().length > 10) {
          longCaption = text.trim();
        }
      }

      // Fetch regional caption (if applicable) with timeout
      if (regionalPrompt) {
        const regionalResponse = await Promise.race([
          client.chat.completions.create({
            model: "deepseek-ai/DeepSeek-R1-Distill-Qwen-14B:novita",
            messages: [{ role: "user", content: regionalPrompt }],
            max_tokens: 180,
            temperature: 0.7,
          }),
          new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Timeout')), 15000)
          )
        ]);

        if (regionalResponse && regionalResponse.choices && regionalResponse.choices[0]) {
          const text = regionalResponse.choices[0].message.content || "";
          if (text && text.trim().length > 10) {
            regionalCaption = text.trim();
          }
        }
      }
    }
  } catch (err) {
    console.error("Caption generation failed:", err.message);
    // Don't return error to user, continue with fallbacks
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

  // TRY to log the event to Firebase (but don't block if it fails)
  try {
    if (process.env.FIREBASE_PROJECT_ID) {
      const { db } = await import('../../lib/firebase-admin');
      await db.collection('captionEvents').add({
        subject: subject?.slice(0, 120) || '',
        mood,
        region,
        premiumUsed: true,
        model: "deepseek-ai/DeepSeek-R1-Distill-Qwen-14B:novita",
        createdAt: new Date(),
      }).catch(console.error);
    }
  } catch (e) {
    console.error('Firebase logging failed (continuing anyway):', e);
  }

  return res.status(200).json({ variants });
}
