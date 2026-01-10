// /pages/api/generate-aura.js

import { OpenAI } from "openai";

// ============================================
// MULTIPLE AI PROVIDERS - ADD MORE AS NEEDED
// ============================================
const AI_PROVIDERS = [
  {
    name: "Groq",
    baseURL: "https://router.huggingface.co/v1",
    model: "meta-llama/Llama-3.3-70B-Instruct:groq",
    tokenEnv: "HF_TOKEN"
  },
  {
    name: "Hyperbolic",
    baseURL: "https://api.hyperbolic.xyz/v1",
    model: "meta-llama/Llama-3.3-70B-Instruct",
    tokenEnv: "HYPERBOLIC_TOKEN"
  },
  {
    name: "HuggingFace",
    baseURL: "https://router.huggingface.co/v1",
    model: "meta-llama/Meta-Llama-3-70B-Instruct",
    tokenEnv: "HF_TOKEN"
  },
  {
    name: "Novita",
    baseURL: "https://router.huggingface.co/v1",
    model: "meta-llama/Meta-Llama-3-70B-Instruct:novita",
    tokenEnv: "HF_TOKEN"
  }
];

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { name, subject, mood, language } = req.body;

  if (!subject && !mood && !name) {
    return res.status(400).json({ error: "Provide at least name, subject, or mood" });
  }

  const hasName = name?.trim().length > 0;
  const hasSubject = subject?.trim().length > 0;
  const hasMood = mood?.trim().length > 0;
  const roastLanguage = language || 'english';

  const forcedTier = checkForcedExamples(subject || '', mood || '');
  let tier = forcedTier || rollForTier(getTierCap(calculateWorthiness(subject || '', mood || '', name || '')));
  let finalScore = getScoreForTier(tier);

  let result = null;

  try {
    result = await generateRoastWithFallbacks(name, subject, mood, tier, finalScore, roastLanguage, hasName, hasSubject, hasMood);
    
    if (!result?.roast || result.roast.length < 30) {
      result = { 
        roast: getFallbackRoast(tier, subject || name || 'this', roastLanguage), 
        subject_insight: "Facts.", 
        isPublicFigure: false, 
        publicFigureStatus: 'none' 
      };
    }
  } catch (error) {
    console.log("All AI failed:", error.message);
    result = { 
      roast: getFallbackRoast(tier, subject || name || 'this', roastLanguage), 
      subject_insight: "Truth.", 
      isPublicFigure: false, 
      publicFigureStatus: 'none' 
    };
  }

  const enforcedData = enforceRarityProbabilities(tier, finalScore, result.isPublicFigure, result.publicFigureStatus);
  tier = enforcedData.tier;
  finalScore = enforcedData.score;

  const { rarity, title, challenge } = getTierData(tier, roastLanguage);

  return res.status(200).json({
    aura: {
      score: finalScore,
      roast: result.roast.replace(/^["']|["']$/g, '').trim(),
      subjectInsight: result.subject_insight,
      rarity, title, challenge,
      isPublicFigure: result.isPublicFigure || false,
      publicFigureStatus: result.publicFigureStatus || 'none',
      language: roastLanguage,
      name: hasName ? name.trim() : null,
      subject: hasSubject ? subject.trim() : null,
      mood: hasMood ? mood.trim() : null
    }
  });
}

// ============================================
// TRY ALL PROVIDERS UNTIL ONE WORKS
// ============================================
async function generateRoastWithFallbacks(name, subject, mood, tier, finalScore, language, hasName, hasSubject, hasMood) {
  
  for (let i = 0; i < AI_PROVIDERS.length; i++) {
    const provider = AI_PROVIDERS[i];
    const token = process.env[provider.tokenEnv];
    
    // Skip if token not configured
    if (!token) {
      console.log(`⏭️ Skipping ${provider.name}: No token configured`);
      continue;
    }

    try {
      console.log(`🔄 Trying ${provider.name}...`);
      
      const result = await callAI(
        provider.baseURL,
        token,
        provider.model,
        name, subject, mood, tier, finalScore, language, hasName, hasSubject, hasMood
      );
      
      if (result?.roast && result.roast.length > 30) {
        console.log(`✅ ${provider.name} SUCCESS`);
        return result;
      }
      
    } catch (error) {
      console.log(`❌ ${provider.name} FAILED: ${error.message}`);
      
      // If rate limited, try next provider immediately
      if (error.message.includes('rate') || error.message.includes('limit') || error.message.includes('429')) {
        console.log(`⚠️ ${provider.name} rate limited, trying next...`);
        continue;
      }
    }
  }

  // All providers failed
  console.log("💀 All AI providers failed, using fallback");
  return null;
}

// ============================================
// SINGLE AI CALL
// ============================================
async function callAI(baseURL, token, model, name, subject, mood, tier, finalScore, language, hasName, hasSubject, hasMood) {
  const client = new OpenAI({
    baseURL: baseURL,
    apiKey: token,
  });

  const isHindi = language === 'hindi';
  const targetName = hasName ? name.trim() : (hasSubject ? subject.trim() : 'bro');

  const systemPrompt = `You're a savage roast comedian. Smart roasts with natural language.

## RULES:
1. Find ONE truth about the person and attack that
2. Observe don't insult directly: "You're the type who..." not just "You suck"
3. Write 3-4 lines (40-70 words)
4. Bad words flow NATURALLY - beginning, middle, end - wherever fits

${isHindi ? `
## HINDI STYLE:
Use naturally anywhere: bc, mc, chutiya, saala, damn, fuck, shit

EXAMPLES:
"Abe saale Bantai ke itne beefs hai ki butcher shop khol le 💀 Independent rapper hai kyunki koi sign nahi karna chahta isko bc. Teri rap sunke lagta hai beats ne bhi resign de diya, music nahi torture hai ye 🔥"

"Bhai what the fuck is this content? 💀 Tu influencer hai ya unemployment ka poster child? Sirf teri mummy follow karti hai bc. Followers se zyada toh mere ghar mein cockroach hai saale 😭"
` : `
## ENGLISH STYLE:
Use naturally anywhere: damn, fuck, shit, dumbass, stupid, trash

EXAMPLES:
"Bro what the fuck is Bantai's career at this point? 💀 Has so many beefs he should open a damn meat shop. Independent rapper because nobody wants to sign this dude, even autotune gave up 🔥"

"Who the hell told you you're an influencer? 💀 Only your mom follows you and she mutes your stories. Your content is so trash that watching paint dry feels like damn entertainment 😭"
`}

## TIER: ${tier.toUpperCase()}

## FORMAT:
- 40-70 words (3-4 lines)
- Bad words spread naturally (2-4 total)
- Smart + savage
- 1-2 emojis (💀 😭 🔥)

## OUTPUT (JSON only):
{"roast": "3-4 line roast", "subject_insight": "truth found", "isPublicFigure": true/false, "publicFigureStatus": "peak/stable/falling/none"}`;

  const userContent = `Roast: ${targetName}${hasSubject && hasName ? ` (${subject.trim()})` : ''}${hasMood ? ` | Mood: ${mood}` : ''}

3-4 lines. Bad words natural. ${isHindi ? 'Hinglish.' : 'Simple English.'} JSON only.`;

  const completion = await client.chat.completions.create({
    model: model,
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userContent }
    ],
    temperature: 1.0,
    max_tokens: 250,
    top_p: 0.95
  });

  const content = completion.choices[0]?.message?.content;
  if (!content) return null;

  try {
    const jsonMatch = content.match(/\{[\s\S]*?\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      parsed.roast = cleanRoast(parsed.roast);
      return parsed;
    }
    return { roast: cleanRoast(content.trim()), subject_insight: "Truth.", isPublicFigure: hasName, publicFigureStatus: 'stable' };
  } catch {
    return { roast: cleanRoast(content.trim()), subject_insight: "Facts.", isPublicFigure: hasName, publicFigureStatus: 'stable' };
  }
}

function cleanRoast(roast) {
  let cleaned = roast;
  [/^oh (bro|wow|damn|well|so)/i, /^well well/i, /^okay so/i, /^let me/i, /^alright/i].forEach(p => {
    cleaned = cleaned.replace(p, '');
  });
  const words = cleaned.trim().split(/\s+/);
  if (words.length > 85) {
    const sentences = cleaned.match(/[^.!?]+[.!?]+/g) || [cleaned];
    cleaned = sentences.slice(0, 4).join(' ');
  }
  return cleaned.trim();
}

function enforceRarityProbabilities(tier, score, isPublicFigure, publicFigureStatus) {
  const r = Math.random() * 100;
  if (isPublicFigure && publicFigureStatus === 'falling') {
    return r < 50 ? { tier: 'mid', score: getScoreForTier('mid') } : r < 80 ? { tier: 'noob', score: getScoreForTier('noob') } : { tier: 'npc', score: getScoreForTier('npc') };
  }
  if (tier === 'legendary' && r > 10) {
    return r > 70 ? { tier: 'epic', score: getScoreForTier('epic') } : r > 40 ? { tier: 'mid', score: getScoreForTier('mid') } : { tier: 'noob', score: getScoreForTier('noob') };
  }
  return { tier, score };
}

function checkForcedExamples(subject, mood) {
  const s = subject.toLowerCase().trim();
  if (s.includes("teacher thinks") || s.includes("teacher's favorite")) return 'mid';
  if (s.includes("best influencer") || s.includes("boss thinks")) return 'noob';
  if (["test", "testing", "asdf", "hello", "hi"].includes(s) || s.length < 3) return 'npc';
  return null;
}

function calculateWorthiness(subject, mood, name) {
  let score = 0;
  const len = (subject || '').length + (name || '').length;
  if (len >= 30) score += 25; else if (len >= 15) score += 15; else if (len >= 5) score += 8;
  if ((name || '').length > 2) score += 10;
  if (/\s/.test(name) && (name || '').length > 5) score += 15;
  if (['test', 'testing', 'asdf', 'lol', 'hi', 'hello'].includes((subject || '').toLowerCase()) || len < 3) score -= 40;
  return Math.max(0, Math.min(100, score));
}

function getTierCap(w) {
  return w >= 80 ? 'legendary' : w >= 60 ? 'epic' : w >= 40 ? 'mid' : w >= 20 ? 'noob' : 'npc';
}

function rollForTier(cap) {
  const r = Math.random() * 100;
  const i = { npc: 0, noob: 1, mid: 2, epic: 3, legendary: 4 }[cap];
  if (i >= 4 && r < 1) return 'legendary';
  if (i >= 3 && r < 6) return 'epic';
  if (i >= 2 && r < 45) return 'mid';
  if (i >= 1 && r < 80) return 'noob';
  return 'npc';
}

function getScoreForTier(tier) {
  const scores = { legendary: [95, 6], epic: [80, 15], mid: [50, 30], noob: [25, 25], npc: [0, 25] };
  const [base, range] = scores[tier] || scores.npc;
  return base + Math.floor(Math.random() * range);
}

function getTierData(tier, language) {
  const h = language === 'hindi';
  return {
    legendary: { rarity: "legendary", title: "LEGENDARY", challenge: h ? "RESPECT HAI 👑" : "RESPECT 👑" },
    epic: { rarity: "epic", title: "EPIC", challenge: h ? "ALMOST BHAI ⚡" : "ALMOST THERE ⚡" },
    mid: { rarity: "mid", title: "MID", challenge: h ? "KON HAI TU? 🔥" : "WHO ARE YOU? 🔥" },
    noob: { rarity: "noob", title: "NOOB", challenge: h ? "SAD LIFE 💀" : "SAD LIFE 💀" },
    npc: { rarity: "npc", title: "NPC", challenge: h ? "EXIST BHI KARTA HAI? 😭" : "DO YOU EXIST? 😭" }
  }[tier] || { rarity: "npc", title: "NPC", challenge: "😭" };
}

function getFallbackRoast(tier, subject, language) {
  const h = language === 'hindi';
  
  const roasts = {
    legendary: h 
      ? [`"${subject}" damn bhai tu talented hai 💀 But meri ek line teri puri career se heavy hai bc. Respect tujhe but ego kam kar, legendary banne mein time hai 🔥`]
      : [`"${subject}" damn bro you're talented 💀 But my one line hits harder than your whole fucking career. Respect but lower that ego, not legendary yet 🔥`],
    epic: h
      ? [`"${subject}" saale tu almost kuch tha 💀 Itna paas aake what the fuck ruk gaya? Potential hai but execution zero bc. Almost mein hi marr jayega 😭`]
      : [`"${subject}" dude you were almost something 💀 Got so damn close then stopped, what happened? Got potential but zero execution. Die in almost zone shit 😭`],
    mid: h
      ? [`"${subject}" bhai what the fuck is this existence? 💀 Tu woh type hai jisko log ignore karte hai bc. Phone sirf OTP ke liye bajta hai. Itna invisible ki Google bhi nahi dhundh pata 😭`]
      : [`"${subject}" bro what the fuck is this existence? 💀 You're the type people ignore damn. Phone only rings for OTPs. So invisible Google can't find you shit 😭`],
    noob: h
      ? [`"${subject}" abe chutiya tu itna forgettable hai ki bc naam likhte likhte bhool gaya 💀 Log tujhse baat karte hai kyunki group mein hai. Nikal de kisi ko yaad nahi aayega 😭`]
      : [`"${subject}" dude you're so damn forgettable I forgot your name typing this 💀 People talk to you because you're in the group. Leave and nobody fucking notices 😭`],
    npc: h
      ? [`"${subject}" bc tu exist bhi karta hai? Google ko nahi pata 💀 Tu woh NPC hai jisko skip karta hoon saale. Teri life loading screen hai jo buffer pe atki hai 😭`]
      : [`"${subject}" bro do you fucking exist? Google doesn't know 💀 You're that NPC I skip damn. Your life is a loading screen stuck on buffer shit 😭`]
  };
  
  const tierRoasts = roasts[tier] || roasts.npc;
  return tierRoasts[Math.floor(Math.random() * tierRoasts.length)];
      }
