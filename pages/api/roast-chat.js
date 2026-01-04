// /pages/api/roast-chat.js

import { OpenAI } from "openai";

export default async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Get body safely
  let userInput, subject, mood, conversationHistory;
  
  try {
    const body = req.body;
    userInput = body?.userInput;
    subject = body?.subject;
    mood = body?.mood;
    conversationHistory = body?.conversationHistory;
  } catch (e) {
    console.error("Body parse error:", e);
    return res.status(400).json({ error: 'Invalid request body' });
  }

  if (!userInput || typeof userInput !== 'string') {
    return res.status(400).json({ error: 'No input provided' });
  }

  const HF_TOKEN = process.env.HF_TOKEN;
  
  if (!HF_TOKEN) {
    console.error("HF_TOKEN missing");
    return res.status(500).json({ error: 'API token not configured' });
  }

  try {
    const client = new OpenAI({
      baseURL: "https://router.huggingface.co/v1",
      apiKey: HF_TOKEN,
    });

    // Build messages safely
    const historyMessages = [];
    if (Array.isArray(conversationHistory)) {
      conversationHistory.slice(-6).forEach(msg => {
        if (msg && msg.text && msg.sender) {
          historyMessages.push({
            role: msg.sender === 'user' ? 'user' : 'assistant',
            content: String(msg.text)
          });
        }
      });
    }

    const chatCompletion = await client.chat.completions.create({
      model: "meta-llama/Meta-Llama-3-70B-Instruct:novita",
      messages: [
        {
          role: "system",
          content: `You're a brutal roaster. You talk like a real friend who doesn't give a fuck. Short and savage.

HOW YOU TALK:
- Simple words everyone understands
- Short sentences that hurt
- Bad words: fuck, shit, damn, bitch, ass, dumb, stupid
- Sound like real person, not robot
- Funny but savage

THINGS TO SAY:
- "Bro really said that 💀"
- "That's the dumbest shit I've heard today"
- "This is why you're single"
- "Nobody asked but okay"
- "Holy shit that's stupid"
- "Even your mom wouldn't like this"

ATTACKS:
- Call them dumb/stupid
- Say they're lonely/single
- Mock their choices
- Say parents are disappointed
- Compare to trash

RULES:
1. 2-3 sentences ONLY
2. Use their exact words against them
3. Simple English
4. Be mean but funny
5. Use emojis: 💀 😭 🔥

${subject ? `Target: ${subject}` : ''}
${mood ? `Mood: ${mood}` : ''}`
        },
        ...historyMessages,
        {
          role: "user",
          content: String(userInput)
        }
      ],
      temperature: 1.0,
      max_tokens: 80,
      top_p: 0.95,
    });

    let roastText = chatCompletion.choices?.[0]?.message?.content;

    if (!roastText) {
      throw new Error("No response from AI");
    }

    // Clean up
    roastText = roastText
      .replace(/^["']|["']$/g, '')
      .replace(/\n\n+/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
      .slice(0, 280);

    return res.status(200).json({ 
      roast: roastText,
      success: true 
    });

  } catch (error) {
    console.error("Roast Chat Error:", error.message);
    
    // Return fallback roast instead of error
    const fallbacks = [
      `"${userInput}"? Bro that's the dumbest shit I've heard today. Your brain is smoother than a bowling ball. 💀`,
      `You really typed "${userInput}" with your whole chest? This is why nobody loves you bro. 😭`,
      `"${userInput}"? Holy shit the delusion is strong. Your confidence is higher than your IQ.`,
      `Bro said "${userInput}" like anyone gives a fuck 💀 Spoiler: nobody does.`,
      `"${userInput}"? This is why your ex upgraded bro. You're the 'before' photo. 😭`,
      `"${userInput}"? Even autocorrect is embarrassed by your dumbass.`,
      `"${userInput}"? Bro the audacity 💀 You're not built different, you're just built wrong.`,
      `"${userInput}"? Your future is darker than your browser history. 😭`
    ];
    
    const randomFallback = fallbacks[Math.floor(Math.random() * fallbacks.length)];
    
    return res.status(200).json({ 
      roast: randomFallback,
      success: true 
    });
  }
  }
