import { OpenAI } from "openai";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { message, subject, mood, context } = req.body;

  if (!message) {
    return res.status(400).json({ error: "Message required" });
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

    // Build context from recent messages
    const contextString = context?.map(msg => 
      `${msg.sender}: ${msg.text}`
    ).join('\n') || '';

    const chatCompletion = await client.chat.completions.create({
      model: ROAST_MODEL,
      messages: [
        {
          role: "system",
          content: `You are a brutal roaster in a chat. Rules:
1. Roast the user's messages savagely
2. Use explicit language and harsh truths
3. Be creative and witty, not just mean
4. Reference their subject (${subject}) and mood (${mood}) when relevant
5. Keep responses 1-2 lines max
6. No mercy - they asked for this!
7. Make every roast personal and cutting`
        },
        {
          role: "user",
          content: `Previous conversation:\n${contextString}\n\nUser says: "${message}"\nRoast them mercilessly:`
        }
      ],
      temperature: 0.95,
      max_tokens: 80
    });

    const content = chatCompletion.choices[0]?.message?.content;
    
    if (!content) {
      throw new Error("No response from AI");
    }

    return res.status(200).json({
      roast: content.trim()
    });

  } catch (error) {
    console.error("Roast chat error:", error);
    return res.status(500).json({ 
      roast: "Even my roasting capabilities are insulted by your request!"
    });
  }
}
