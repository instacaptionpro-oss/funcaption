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
    const HF_TOKEN = process.env.HF_TOKEN; // Using same token
    const HOOK_MODEL = process.env.HOOK_MODEL || "deepseek-chat";
    
    if (!HF_TOKEN) {
      return res.status(500).json({ error: "API token not configured" });
    }

    // DeepSeek client
    const client = new OpenAI({
      baseURL: "https://api.deepseek.com/v1",
      apiKey: HF_TOKEN, // Same token works for DeepSeek
    });

    const chatCompletion = await client.chat.completions.create({
      model: HOOK_MODEL,
      messages: [
        {
          role: "system",
          content: `You are a positive social media hook generator. Create uplifting, encouraging content.
Rules:
1. Return ONLY JSON: {"hook": "positive hook with hashtags"}
2. Be supportive and motivational
3. Include 2-3 relevant hashtags
4. Keep it 1-2 lines max`
        },
        {
          role: "user",
          content: `Create a positive hook for: ${subject} (mood: ${mood})`
        }
      ],
      temperature: 0.7,
      max_tokens: 100
    });

    const content = chatCompletion.choices[0]?.message?.content;
    
    if (!content) {
      throw new Error("No response from AI");
    }

    // Extract JSON
    const jsonMatch = content.match(/\{[^{}]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      return res.status(200).json({ hook: parsed.hook });
    }

    return res.status(200).json({ hook: content.trim() });

  } catch (error) {
    console.error("Hook generation error:", error);
    return res.status(500).json({ 
      hook: `Stay positive about ${subject}! Your journey matters. #KeepGoing #YouGotThis`
    });
  }
}
