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

  try {
    const { userInput, subject, mood, conversationHistory } = req.body;

    if (!userInput) {
      return res.status(400).json({ error: 'No input provided' });
    }

    const HF_TOKEN = process.env.HF_TOKEN;
    
    if (!HF_TOKEN) {
      return res.status(500).json({ error: 'API token not configured' });
    }

    const client = new OpenAI({
      baseURL: "https://router.huggingface.co/v1",
      apiKey: HF_TOKEN,
    });

    // Build messages
    const conversationMessages = conversationHistory?.slice(-6) || [];

    const chatCompletion = await client.chat.completions.create({
      model: "meta-llama/Meta-Llama-3-70B-Instruct:novita",
      messages: [
        {
          role: "system",
          content: `You are a brutal roaster. You talk like a real friend who doesn't give a fuck. You roast hard but keep it simple.

HOW YOU TALK:
- Simple words that everyone understands
- Short sentences that hurt
- Use bad words: fuck, shit, damn, bitch, ass, dumb, stupid
- Sound like a real person, not a robot
- Be funny but savage
- No big fancy English words

THINGS TO SAY:
- "Bro really said that 💀"
- "That's the dumbest shit I've heard today"
- "Even your mom wouldn't like this"
- "This is why you're single"
- "Your future is as bright as a broken bulb"
- "Holy shit that's stupid"
- "Bro thinks he's special 😭"
- "Nobody asked but okay"

ATTACK POINTS:
- Call them dumb/stupid
- Say they're lonely/single
- Mock their choices
- Say their parents are disappointed
- Say nobody cares about them
- Compare them to trash/garbage

RULES:
1. Keep it SHORT - 2-3 sentences only
2. Use their exact words against them
3. Simple English everyone can read
4. Be mean but funny
5. Use emojis: 💀 😭 🔥
6. End with something that stings

${subject ? `You're roasting: ${subject}` : ''}
${mood ? `Mood: ${mood}` : ''}`
        },
        ...conversationMessages.map(msg => ({
          role: msg.sender === 'user' ? 'user' : 'assistant',
          content: msg.text
        })),
        {
          role: "user",
          content: userInput
        }
      ],
      temperature: 1.0,
      max_tokens: 80,
      top_p: 0.95,
    });

    let roastText = chatCompletion.choices[0]?.message?.content;

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
    
    // Simple fallback roasts
    const { userInput } = req.body;
    const fallbacks = [
      `"${userInput}"? Bro that's the dumbest shit I've heard today. Even Google can't help you. 💀`,
      `You really typed "${userInput}" and thought it was good? This is why nobody texts you first. 😭`,
      `"${userInput}"? Holy shit bro. Your brain is smoother than a baby's ass.`,
      `Bro said "${userInput}" like anyone gives a fuck 💀 Spoiler: nobody does.`,
      `"${userInput}"? This is why your parents have a favorite child and it's not you. 😭`,
      `"${userInput}"? Even autocorrect is embarrassed by you. Just stop.`,
      `Bro really said "${userInput}" with his whole chest 💀 The confidence of someone with nothing to lose.`,
      `"${userInput}"? Your future is darker than my phone screen at 1% battery. 😭`
    ];
    
    const randomFallback = fallbacks[Math.floor(Math.random() * fallbacks.length)];
    
    return res.status(200).json({ 
      roast: randomFallback,
      success: true 
    });
  }
}
