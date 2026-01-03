// /pages/api/roast-chat.js

import { OpenAI } from "openai";

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  console.log("🔥 ROAST CHAT API HIT!");

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed. Use POST.' });
  }

  try {
    const { userInput, subject, mood, conversationHistory } = req.body;

    console.log("📝 User Input:", userInput);

    if (!userInput) {
      return res.status(400).json({ error: 'No input provided' });
    }

    const HF_TOKEN = process.env.HF_TOKEN;
    
    if (!HF_TOKEN) {
      console.error("❌ HF_TOKEN not found!");
      return res.status(500).json({ error: 'API token not configured' });
    }

    // ============================================
    // OPENAI CLIENT WITH HUGGINGFACE ROUTER
    // ============================================
    const client = new OpenAI({
      baseURL: "https://router.huggingface.co/v1",
      apiKey: HF_TOKEN,
    });

    console.log("🤖 Calling AI...");
    const startTime = Date.now();

    // Build conversation messages
    const conversationMessages = conversationHistory?.slice(-6) || [];
    const messages = [
      {
        role: "system",
        content: `You are a brutal roast master. SHORT & SAVAGE responses only.

RULES:
- 2-3 sentences MAX (no essays!)
- Use profanity freely (fuck, shit, damn, bitch)
- Reference their EXACT words
- Be creative & devastating
- Sound human, not like an AI
- Make them laugh AND cry

EXAMPLES:
- "Bro said that like it meant something 💀 Even your WiFi disconnects from you."
- "Holy fuck, that's the dumbest thing I've heard today. Your brain's smoother than a bowling ball."
- "Imagine typing that and hitting send. The audacity of the untalented."

${subject ? `Target: ${subject}` : ''}
${mood ? `Mood: ${mood}` : ''}

Output: Just the roast. Nothing else. SHORT.`
      },
      ...conversationMessages.map(msg => ({
        role: msg.sender === 'user' ? 'user' : 'assistant',
        content: msg.text
      })),
      {
        role: "user",
        content: userInput
      }
    ];

    const chatCompletion = await client.chat.completions.create({
      model: "meta-llama/Meta-Llama-3-70B-Instruct:novita",
      messages: messages,
      temperature: 1.0,
      max_tokens: 80,
      top_p: 0.95,
    });

    const elapsed = Date.now() - startTime;
    console.log(`⏱️ Response time: ${elapsed}ms`);

    let roastText = chatCompletion.choices[0]?.message?.content;

    if (!roastText) {
      throw new Error("No response from AI");
    }

    // Clean up response
    roastText = roastText
      .replace(/^["']|["']$/g, '')     // Remove quotes
      .replace(/\n\n+/g, ' ')          // Remove double newlines
      .replace(/\s+/g, ' ')            // Normalize spaces
      .trim()
      .slice(0, 280);                  // Cap length

    console.log("✅ Roast:", roastText.substring(0, 50) + "...");

    return res.status(200).json({ 
      roast: roastText,
      success: true 
    });

  } catch (error) {
    console.error("❌ Roast Chat Error:", error.message);
    
    return res.status(500).json({ 
      error: 'Failed to generate roast',
      details: error.message 
    });
  }
  }
