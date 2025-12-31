import { OpenAI } from "openai";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { subject, mood } = req.body;

  if (!subject || !mood) {
    return res.status(400).json({ error: "Subject and mood required" });
  }

  try {
    const HF_TOKEN = process.env.HF_TOKEN || process.env.HUGGINGFACE_API_KEY;
    if (!HF_TOKEN) {
      return res.status(500).json({ error: "API token not configured" });
    }

    const client = new OpenAI({
      baseURL: "https://router.huggingface.co/v1",
      apiKey: HF_TOKEN,
    });

    // Generate score and roast in one call
    const chatCompletion = await client.chat.completions.create({
      model: "meta-llama/Llama-3.3-70B-Instruct:groq",
      messages: [
        {
          role: "system",
          content: `You are a brutally honest roaster. Generate ONLY JSON:
{
  "score": number (0-100),
  "roast": "harsh, witty roast (2-3 lines max, can use bad words)",
  "subject_insight": "1-line insight about the subject"
}
Rules:
1. Be savage but creative
2. Use explicit language when appropriate
3. No censorship - be brutally honest
4. Make it sting but be witty`
        },
        {
          role: "user",
          content: `Subject: ${subject}, Mood: ${mood}. Generate brutal assessment.`
        }
      ],
      temperature: 0.9,
      max_tokens: 120
    });

    const content = chatCompletion.choices[0]?.message?.content;
    if (!content) {
      throw new Error("No response from AI");
    }

    // Extract JSON
    const jsonMatch = content.match(/\{[^{}]*\}/);
    if (!jsonMatch) {
      throw new Error("Invalid AI response format");
    }

    const result = JSON.parse(jsonMatch[0]);
    
    // Determine rarity based on score
    let rarity, title, challenge;
    if (result.score >= 95) {
      rarity = "legendary";
      title = "LEGENDARY";
      challenge = "CHASE ME IF YOU CAN, LOSERS";
    } else if (result.score >= 90) {
      rarity = "epic";
      title = "EPIC";
      challenge = "CHASE ME IF YOU CAN, LOSERS";
    } else if (result.score >= 75) {
      rarity = "mid";
      title = "MID";
      challenge = "THE WORST TYPE OF PEOPLE - THEY DON'T KNOW IF THEY'RE WINNING OR LOSING";
    } else if (result.score >= 40) {
      rarity = "noob";
      title = "NOOB";
      challenge = "YOUR AURA IS SO DARK THAT GOOGLE MAPS CAN'T FIND IT";
    } else {
      rarity = "npc";
      title = "NPC";
      challenge = "YOUR AURA IS SO DARK THAT GOOGLE MAPS CAN'T FIND IT";
    }

    return res.status(200).json({
      aura: {
        score: result.score,
        roast: result.roast,
        subjectInsight: result.subject_insight,
        rarity,
        title,
        challenge
      }
    });

  } catch (error) {
    console.error("Aura generation error:", error);
    return res.status(500).json({ 
      error: "Failed to generate aura card",
      fallback: {
        score: Math.floor(Math.random() * 60),
        roast: "Your energy is so weak, even ghosts avoid you.",
        subjectInsight: "Interesting choice, very telling...",
        rarity: "npc",
        title: "NPC",
        challenge: "YOUR AURA IS SO DARK THAT GOOGLE MAPS CAN'T FIND IT"
      }
    });
  }
}
