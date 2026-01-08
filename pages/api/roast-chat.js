// /pages/api/roast-chat.js

import { OpenAI } from "openai";

// ============================================
// AI MODELS CONFIG
// ============================================
const AI_MODELS = {
  primary: "meta-llama/Llama-3.3-70B-Instruct:groq",    // Fast, try first
  backup: "meta-llama/Meta-Llama-3-70B-Instruct"         // Fallback when primary fails
};

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
  let userInput, subject, mood, conversationHistory, language;
  
  try {
    const body = req.body;
    userInput = body?.userInput;
    subject = body?.subject;
    mood = body?.mood;
    conversationHistory = body?.conversationHistory;
    language = body?.language || 'english';
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

    const systemPrompt = buildSystemPrompt(subject, mood, language);

    // Try PRIMARY model first, then BACKUP
    let roastText = await tryModels(HF_TOKEN, systemPrompt, historyMessages, userInput);

    if (!roastText) {
      throw new Error("All models failed");
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
    
    // Return fallback roast
    const randomFallback = getFallbackRoast(userInput, language);
    
    return res.status(200).json({ 
      roast: randomFallback,
      success: true 
    });
  }
}

// ============================================
// TRY MODELS WITH FALLBACK
// ============================================
async function tryModels(token, systemPrompt, historyMessages, userInput) {
  
  // Try PRIMARY model first
  try {
    console.log("Trying PRIMARY model:", AI_MODELS.primary);
    const result = await callAI(token, AI_MODELS.primary, systemPrompt, historyMessages, userInput);
    if (result) {
      console.log("PRIMARY model success ✅");
      return result;
    }
  } catch (error) {
    console.log("PRIMARY model failed:", error.message);
  }

  // Try BACKUP model
  try {
    console.log("Trying BACKUP model:", AI_MODELS.backup);
    const result = await callAI(token, AI_MODELS.backup, systemPrompt, historyMessages, userInput);
    if (result) {
      console.log("BACKUP model success ✅");
      return result;
    }
  } catch (error) {
    console.log("BACKUP model failed:", error.message);
  }

  return null;
}

// ============================================
// AI CALLER FUNCTION
// ============================================
async function callAI(token, model, systemPrompt, historyMessages, userInput) {
  const client = new OpenAI({
    baseURL: "https://router.huggingface.co/v1",
    apiKey: token,
  });

  const chatCompletion = await client.chat.completions.create({
    model: model,
    messages: [
      { role: "system", content: systemPrompt },
      ...historyMessages,
      { role: "user", content: String(userInput) }
    ],
    temperature: 1.0,
    max_tokens: 100,
    top_p: 0.95,
  });

  return chatCompletion.choices?.[0]?.message?.content || null;
}

// ============================================
// SYSTEM PROMPT BUILDER
// ============================================
function buildSystemPrompt(subject, mood, language) {
  const isHindi = language === 'hindi';

  if (isHindi) {
    return `Tu ek savage roaster hai. Tu real friend jaisa baat karta hai jo gaali deta hai pyaar se. Short aur savage.

TERA STYLE:
- Simple Hinglish (Hindi + English mix)
- Chhoti sentences jo dil pe lage
- Bad words: bc, mc, chutiya, gadha, bewakoof, damn, fuck
- Real person jaisa bol, robot mat ban
- Funny but savage

EXAMPLES:
- "Bhai tune ye sach mein bola? 💀"
- "Ye aaj ka sabse wahiyat message hai bc"
- "Isliye tu single hai bhai"
- "Kisi ne nahi pucha but okay"
- "Holy shit kitna stupid hai tu"
- "Teri mummy bhi ye nahi pasand karti"

ATTACKS:
- Usko bewakoof/gadha bol
- Bol ki wo akela hai/single hai
- Uski choices ka mazak uda
- Bol ki parents disappointed hai
- Kachre se compare kar

RULES:
1. 2-3 sentences ONLY
2. Uske words use kar against him
3. Simple Hinglish
4. Mean but funny
5. Emojis: 💀 😭 🔥

${subject ? `Target: ${subject}` : ''}
${mood ? `Mood: ${mood}` : ''}`;
  }

  return `You're a brutal roaster. You talk like a real Indian friend who doesn't give a fuck. Short and savage.

HOW YOU TALK:
- Simple English that Indians use daily
- Mix "bro", "yaar", "bhai" naturally
- Short sentences that hit hard
- Bad words: fuck, shit, damn, bitch, ass, dumb, stupid (1-2 only)
- Sound like real person, not robot
- Funny but savage

EXAMPLES:
- "Bro really said that 💀"
- "That's the dumbest shit I've heard today yaar"
- "This is why you're single bro"
- "Nobody asked but okay"
- "Holy shit that's stupid"
- "Even your mom wouldn't like this bhai"

ATTACKS:
- Call them dumb/stupid
- Say they're lonely/single
- Mock their choices
- Say parents are disappointed
- Compare to trash

RULES:
1. 2-3 sentences ONLY
2. Use their exact words against them
3. Simple English (NO difficult words)
4. Be mean but funny
5. Use emojis: 💀 😭 🔥

${subject ? `Target: ${subject}` : ''}
${mood ? `Mood: ${mood}` : ''}`;
}

// ============================================
// FALLBACK ROASTS
// ============================================
function getFallbackRoast(userInput, language) {
  const shortInput = userInput.length > 30 ? userInput.slice(0, 30) + '...' : userInput;
  const isHindi = language === 'hindi';

  if (isHindi) {
    const hindiRoasts = [
      `"${shortInput}"? Bhai ye aaj ka sabse wahiyat message hai bc. Tera brain smooth hai bilkul bowling ball jaisa. 💀`,
      `Tu sach mein "${shortInput}" type kiya puri himmat se? Isliye tujhe koi pyaar nahi karta bhai. 😭`,
      `"${shortInput}"? Holy shit bhai delusion strong hai. Tera confidence IQ se zyada hai bc. 💀`,
      `Bhai bola "${shortInput}" jaise kisi ko farak padta hai 💀 Spoiler: kisi ko nahi padta.`,
      `"${shortInput}"? Isliye teri ex ne upgrade kiya bhai. Tu 'before' photo hai. 😭`,
      `"${shortInput}"? Autocorrect bhi sharma gaya tere se bc.`,
      `"${shortInput}"? Bhai audacity dekho 💀 Tu different nahi hai, tu wrong built hai.`,
      `"${shortInput}"? Tera future teri browser history se bhi dark hai bhai. 😭`
    ];
    return hindiRoasts[Math.floor(Math.random() * hindiRoasts.length)];
  }

  const englishRoasts = [
    `"${shortInput}"? Bro that's the dumbest shit I've heard today. Your brain is smoother than a bowling ball. 💀`,
    `You really typed "${shortInput}" with your whole chest? This is why nobody loves you bro. 😭`,
    `"${shortInput}"? Holy shit the delusion is strong yaar. Your confidence is higher than your IQ. 💀`,
    `Bro said "${shortInput}" like anyone gives a fuck 💀 Spoiler: nobody does.`,
    `"${shortInput}"? This is why your ex upgraded bro. You're the 'before' photo. 😭`,
    `"${shortInput}"? Even autocorrect is embarrassed by your dumbass bhai.`,
    `"${shortInput}"? Bro the audacity 💀 You're not built different, you're just built wrong.`,
    `"${shortInput}"? Your future is darker than your browser history yaar. 😭`
  ];
  
  return englishRoasts[Math.floor(Math.random() * englishRoasts.length)];
    }
