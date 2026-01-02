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
    const HF_TOKEN = process.env.HF_TOKEN;
    const ROAST_MODEL = process.env.ROAST_MODEL || "meta-llama/Llama-3.3-70B-Instruct:groq";
    
    if (!HF_TOKEN) {
      return res.status(500).json({ error: "API token not configured" });
    }

    const client = new OpenAI({
      baseURL: "https://router.huggingface.co/v1",
      apiKey: HF_TOKEN,
    });

    // DETERMINE TARGET SCORE RANGE BASED ON EXAMPLE SUBJECTS
    let targetRange = "random";
    if (subject === "My inconsistent workout routine" && mood === "funny") {
      targetRange = "mid"; // 75-89
    } else if (subject === "My breakthrough business idea" && mood === "fire") {
      targetRange = "epic"; // 90-100
    }

    // CUSTOM PROMPT FOR SPECIFIC TIERS
    let systemPrompt = `You are a brutally honest roaster. Generate ONLY JSON:
{
  "score": number (0-100),
  "roast": "harsh, witty roast (2-3 lines max, can use bad words)",
  "subject_insight": "1-line insight about the subject"
}
Rules:
1. Be savage but creative
2. Use explicit language when appropriate
3. No censorship - be brutally honest
4. Make it sting but be witty`;

    // ADD TIER-SPECIFIC INSTRUCTIONS
    if (targetRange === "mid") {
      systemPrompt += `\n5. IMPORTANT: Generate a score between 75-89 for MID tier`;
    } else if (targetRange === "epic") {
      systemPrompt += `\n5. IMPORTANT: Generate a score between 90-100 for EPIC/LEGENDARY tier`;
    }

    const chatCompletion = await client.chat.completions.create({
      model: ROAST_MODEL,
      messages: [
        {
          role: "system",
          content: systemPrompt
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
    
    // FORCE SCORE INTO CORRECT RANGE IF NEEDED
    let finalScore = result.score;
    if (targetRange === "mid" && (finalScore < 75 || finalScore > 89)) {
      finalScore = 75 + Math.floor(Math.random() * 15); // 75-89
    } else if (targetRange === "epic" && (finalScore < 90 || finalScore > 100)) {
      finalScore = 90 + Math.floor(Math.random() * 11); // 90-100
    }
    
    // Determine rarity based on FINAL score
    let rarity, title, challenge;
    if (finalScore >= 95) {
      rarity = "legendary";
      title = "LEGENDARY";
      challenge = "DARE TO MATCH MY SCORE? TRY IT, LOSERS.";
    } else if (finalScore >= 90) {
      rarity = "epic";
      title = "EPIC";
      challenge = "DARE TO MATCH MY SCORE? TRY IT, LOSERS.";
    } else if (finalScore >= 75) {
      rarity = "mid";
      title = "MID";
      challenge = "FUTURE SO DARK THAT EVEN GOOGLE MAPS CANT FIND IT.";
    } else if (finalScore >= 40) {
      rarity = "noob";
      title = "NOOB";
      challenge = "FUTURE SO DARK THAT EVEN GOOGLE MAPS CANT FIND IT.";
    } else {
      rarity = "npc";
      title = "NPC";
      challenge = "FUTURE SO DARK THAT EVEN GOOGLE MAPS CANT FIND IT.";
    }

    return res.status(200).json({
      aura: {
        score: finalScore,
        roast: result.roast,
        subjectInsight: result.subject_insight,
        rarity,
        title,
        challenge
      }
    });

  } catch (error) {
    console.error("Aura generation error:", error);
    // Fallback with proper tier targeting
    let randomScore;
    if (subject === "My inconsistent workout routine" && mood === "funny") {
      randomScore = 75 + Math.floor(Math.random() * 15); // 75-89 for Mid
    } else if (subject === "My breakthrough business idea" && mood === "fire") {
      randomScore = 90 + Math.floor(Math.random() * 11); // 90-100 for Epic
    } else {
      randomScore = Math.floor(Math.random() * 101);
    }
    
    let rarity, title, challenge;
    if (randomScore >= 95) {
      rarity = "legendary";
      title = "LEGENDARY";
      challenge = "DARE TO MATCH MY SCORE? TRY IT, LOSERS.";
    } else if (randomScore >= 90) {
      rarity = "epic";
      title = "EPIC";
      challenge = "DARE TO MATCH MY SCORE? TRY IT, LOSERS.";
    } else if (randomScore >= 75) {
      rarity = "mid";
      title = "MID";
      challenge = "FUTURE SO DARK THAT EVEN GOOGLE MAPS CANT FIND IT.";
    } else if (randomScore >= 40) {
      rarity = "noob";
      title = "NOOB";
      challenge = "FUTURE SO DARK THAT EVEN GOOGLE MAPS CANT FIND IT.";
    } else {
      rarity = "npc";
      title = "NPC";
      challenge = "FUTURE SO DARK THAT EVEN GOOGLE MAPS CANT FIND IT.";
    }
    
    return res.status(200).json({ 
      aura: {
        score: randomScore,
        roast: "Your energy is so weak, even ghosts avoid you.",
        subjectInsight: "Interesting choice, very telling...",
        rarity,
        title,
        challenge
      }
    });
  }
}
