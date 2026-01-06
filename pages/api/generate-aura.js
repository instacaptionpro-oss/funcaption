// /pages/api/generate-aura.js

import { GoogleGenerativeAI } from "@google/generative-ai";
import { OpenAI } from "openai";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { name, subject, mood } = req.body;

  if (!subject && !mood && !name) {
    return res.status(400).json({ error: "Provide at least name, subject, or mood" });
  }

  const hasName = name && name.trim().length > 0;
  const hasSubject = subject && subject.trim().length > 0;
  const hasMood = mood && mood.trim().length > 0;

  const forcedTier = checkForcedExamples(subject || '', mood || '');
  let tier, finalScore;
  
  if (forcedTier) {
    tier = forcedTier;
    finalScore = getScoreForTier(tier);
  } else {
    const worthiness = calculateWorthiness(subject || '', mood || '', name || '');
    const tierCap = getTierCap(worthiness);
    tier = rollForTier(tierCap);
    finalScore = getScoreForTier(tier);
  }

  let result = null;
  let isPublicFigure = false;
  let publicFigureStatus = 'none';

  // TRY GEMINI FIRST
  const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
  
  if (GEMINI_API_KEY && hasName) {
    try {
      result = await tryGemini(GEMINI_API_KEY, name, subject, mood, tier, finalScore, hasName, hasSubject, hasMood);
      if (result && result.roast && result.roast.length > 20) {
        isPublicFigure = result.isPublicFigure || false;
        publicFigureStatus = result.publicFigureStatus || 'none';
      } else {
        result = null;
      }
    } catch (error) {
      console.log("Gemini failed:", error.message);
      result = null;
    }
  }

  // FALLBACK TO HUGGINGFACE
  if (!result) {
    const HF_TOKEN = process.env.HF_TOKEN;
    
    if (HF_TOKEN) {
      try {
        result = await tryHuggingFace(HF_TOKEN, name, subject, mood, tier, finalScore, hasName, hasSubject, hasMood);
        if (result && result.roast && result.roast.length > 20) {
          isPublicFigure = result.isPublicFigure || false;
          publicFigureStatus = result.publicFigureStatus || 'none';
        } else {
          result = null;
        }
      } catch (error) {
        console.log("HuggingFace failed:", error.message);
        result = null;
      }
    }
  }

  // FINAL FALLBACK
  if (!result) {
    result = {
      roast: getFallbackRoast(tier, subject || name || 'ye'),
      subject_insight: "Waah bhai waah...",
      isPublicFigure: false,
      publicFigureStatus: 'none'
    };
  }

  const enforcedData = enforceRarityProbabilities(tier, finalScore, isPublicFigure, publicFigureStatus);
  tier = enforcedData.tier;
  finalScore = enforcedData.score;
  
  const { rarity, title, challenge } = getTierData(tier);

  return res.status(200).json({
    aura: {
      score: finalScore,
      roast: result.roast.replace(/^["']|["']$/g, '').trim(),
      subjectInsight: result.subject_insight || "Kya baat hai...",
      rarity,
      title,
      challenge,
      isPublicFigure,
      publicFigureStatus,
      name: hasName ? name.trim() : null,
      subject: hasSubject ? subject.trim() : null,
      mood: hasMood ? mood.trim() : null
    }
  });
}

// ============================================
// GEMINI - SARCASTIC CELEBRITY ROAST
// ============================================
async function tryGemini(apiKey, name, subject, mood, tier, finalScore, hasName, hasSubject, hasMood) {
  const genAI = new GoogleGenerativeAI(apiKey);
  
  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
    tools: [{ googleSearch: {} }]
  });

  const prompt = `Tu ek SARCASTIC roast master hai. Hinglish mein sarcastic roast karta hai.

## SARCASM STYLE:
- Fake praise jo actually insult ho
- "Waah bhai" "Kya baat hai" "Amazing yaar" type sarcasm
- Taunt maarke roast kar
- Indirect insults with sweet tone
- Eye roll energy 🙄

## CELEBRITY: "${name.trim()}"

GOOGLE SEARCH KAR:
- Ye famous kyun hai?
- Iska best work/hit kya hai?
- Signature style kya hai?
- NO controversies/court cases

## GAALIYAN MIX KAR:
Hindi: bc, mc, chutiya, gadha, bewakoof, wahiyat, bakwas
English: fuck, shit, damn, bitch, pathetic, dumb

## ROAST LENGTH:
- 25-40 words (MEDIUM length)
- 2 sentences max
- 2 emojis

## SARCASTIC ROAST EXAMPLES:

"Waah ${name.trim()} bhai waah, content toh amazing hai tera 🙄 Bc har video same hai but fans ko kya pata chutiya log. Damn creativity toh overflow ho rahi hai yaar. 💀"

"Kya acting hai yaar, Oscar deserve karta hai tu 🙄 Bc itni overacting karta hai ki cringe bhi cringe ho jaata hai. Waah talent. 💀"

"Amazing bhai, itna original content 🙄 Bc copy paste karke bhi itna famous, respect hai damn. Wahiyat effort but kaam chal gaya. 💀"

## TIER: ${tier.toUpperCase()}

${tier === 'legendary' ? 'Sarcastic respect: "Waah bc actually accha hai, fuck kya karun gaali du ya respect 🙄👑"' : ''}
${tier === 'epic' ? 'Sarcastic praise: "Kya baat hai almost famous, thoda aur try kar bhai 🙄⚡"' : ''}
${tier === 'mid' ? 'Full sarcasm: "Amazing yaar kitna average hai tu, damn inspiration 🙄🔥"' : ''}
${tier === 'noob' ? 'Heavy sarcasm: "Waah talent dekho, bc itna below average bhi koi hota hai 🙄💀"' : ''}
${tier === 'npc' ? 'Brutal sarcasm: "Kya existence hai yaar, truly wahiyat masterpiece 🙄😭"' : ''}

OUTPUT JSON:
{
  "roast": "25-40 words sarcastic Hinglish roast",
  "subject_insight": "one sarcastic line",
  "isPublicFigure": true,
  "publicFigureStatus": "peak/stable/falling/none"
}`;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  const content = response.text();

  if (!content) return null;

  try {
    const jsonMatch = content.match(/\{[\s\S]*?\}/);
    return jsonMatch ? JSON.parse(jsonMatch[0]) : { roast: content.trim(), subject_insight: "Waah bc...", isPublicFigure: true, publicFigureStatus: 'stable' };
  } catch {
    return { roast: content.trim(), subject_insight: "Kya baat hai...", isPublicFigure: true, publicFigureStatus: 'stable' };
  }
}

// ============================================
// HUGGINGFACE - SARCASTIC ROASTING
// ============================================
async function tryHuggingFace(token, name, subject, mood, tier, finalScore, hasName, hasSubject, hasMood) {
  const client = new OpenAI({
    baseURL: "https://router.huggingface.co/v1",
    apiKey: token,
  });

  const systemPrompt = `Tu ek SARCASTIC roast master hai. Hinglish mein sarcastic taunt maarta hai.

## SARCASM KAISE KARNA HAI:
- Fake tareef jo actually insult ho
- "Waah bhai" "Kya baat hai" "Amazing" "Bohot accha" use kar sarcastically
- Sweet tone mein brutal insult
- Eye roll energy with 🙄
- Indirect taunt maaro

## SARCASM EXAMPLES:
- "Waah bhai waah, kitna talented hai tu 🙄"
- "Kya baat hai yaar, amazing existence 🙄"  
- "Bohot accha hai tu, truly inspiring 🙄"
- "Damn bhai respect, kitna unique hai 🙄"

## GAALIYAN (Mix both):
Hindi: bc, mc, chutiya, gadha, bewakoof, wahiyat, bakwas, gandu
English: fuck, shit, damn, bitch, pathetic, dumb, trash, loser

## ROAST FORMAT:
- 25-40 words only (MEDIUM)
- 2 sentences max
- 2 emojis (use 🙄 for sarcasm)
- Sarcastic tone throughout

## TIER: ${tier.toUpperCase()}

${tier === 'legendary' ? 'Sarcastic respect: "Waah bc tu toh actually kuch hai, damn kya karun insult bhi nahi kar sakta 🙄 Fuck respect yaar. 👑"' : ''}
${tier === 'epic' ? 'Sarcastic praise: "Kya baat hai bhai almost great hai tu 🙄 Bc thoda aur try kar legendary ban jayega wahiyat. ⚡"' : ''}
${tier === 'mid' ? 'Full sarcasm: "Amazing yaar tu toh bohot special hai 🙄 Bc itna average existence damn inspiring hai chutiya. 🔥"' : ''}
${tier === 'noob' ? 'Heavy sarcasm: "Waah talent dekho yaar 🙄 Bc itna below average bhi koi hota hai, fuck truly wahiyat. 💀"' : ''}
${tier === 'npc' ? 'Brutal sarcasm: "Kya existence hai bhai masterpiece 🙄 Bc tu toh legend hai wahiyat category mein damn. 😭"' : ''}

OUTPUT JSON:
{
  "roast": "25-40 words sarcastic roast with mixed gaalis",
  "subject_insight": "sarcastic one liner",
  "isPublicFigure": false,
  "publicFigureStatus": "none"
}`;

  const userContent = `${hasName ? `Name: ${name.trim()}` : ''} ${hasSubject ? `Subject: ${subject.trim()}` : ''} ${hasMood ? `Mood: ${mood}` : ''} | Tier: ${tier.toUpperCase()}

SARCASTIC roast kar. Fake praise with real insult. 25-40 words. Mix Hindi+English gaalis. Use 🙄 emoji.`;

  const completion = await client.chat.completions.create({
    model: "meta-llama/Meta-Llama-3-70B-Instruct:novita",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userContent }
    ],
    temperature: 1.0,
    max_tokens: 150
  });

  const content = completion.choices[0]?.message?.content;
  if (!content) return null;

  try {
    const jsonMatch = content.match(/\{[\s\S]*?\}/);
    return jsonMatch ? JSON.parse(jsonMatch[0]) : { roast: content.trim(), subject_insight: "Waah bc...", isPublicFigure: false, publicFigureStatus: 'none' };
  } catch {
    return { roast: content.trim(), subject_insight: "Kya baat hai...", isPublicFigure: false, publicFigureStatus: 'none' };
  }
}

// ============================================
// HELPER FUNCTIONS
// ============================================

function enforceRarityProbabilities(tier, score, isPublicFigure, publicFigureStatus) {
  const r = Math.random() * 100;
  
  if (isPublicFigure && publicFigureStatus === 'falling') {
    if (r < 50) return { tier: 'mid', score: getScoreForTier('mid') };
    if (r < 80) return { tier: 'noob', score: getScoreForTier('noob') };
    return { tier: 'npc', score: getScoreForTier('npc') };
  }
  
  if (tier === 'legendary' && r > 10) {
    if (r > 70) return { tier: 'epic', score: getScoreForTier('epic') };
    if (r > 40) return { tier: 'mid', score: getScoreForTier('mid') };
    return { tier: 'noob', score: getScoreForTier('noob') };
  }
  
  return { tier, score };
}

function checkForcedExamples(subject, mood) {
  const s = (subject || '').toLowerCase().trim();
  const m = (mood || '').toLowerCase().trim();

  if (s.includes("teacher thinks he")) return 'mid';
  if (s.includes("best influencer")) return 'noob';
  if (s.includes("teacher's favorite")) return 'mid';
  if (s.includes("boss thinks he")) return 'noob';
  if (s.includes("office politics") || s.includes("ass kissing")) return 'npc';
  if (s.includes("workout routine") && m === "funny") return 'mid';
  if (s.includes("cooking skills") && m === "funny") return 'noob';
  if (["test", "testing", "asdf", "hello", "hi"].includes(s) || s.length < 3) return 'npc';

  return null;
}

function calculateWorthiness(subject, mood, name) {
  let score = 0;
  const s = (subject || '').toLowerCase();
  const n = (name || '').toLowerCase();
  const len = (subject || '').length + (name || '').length;

  if (len >= 30) score += 25;
  else if (len >= 15) score += 15;
  else if (len >= 5) score += 8;

  if (n.length > 2) score += 10;
  if (/\s/.test(n) && n.length > 5) score += 15;

  const trash = ['test', 'testing', 'asdf', 'lol', 'lmao', 'hi', 'hello'];
  if (trash.includes(s) || len < 3) score -= 40;

  if (/terrible|awful|obsession|addiction|fear|pathetic|embarrassing/i.test(subject)) score += 15;
  if (/instagram|tiktok|youtube|twitter/i.test(subject)) score += 6;

  return Math.max(0, Math.min(100, score));
}

function getTierCap(w) {
  if (w >= 80) return 'legendary';
  if (w >= 60) return 'epic';
  if (w >= 40) return 'mid';
  if (w >= 20) return 'noob';
  return 'npc';
}

function rollForTier(cap) {
  const r = Math.random() * 100;
  const caps = { npc: 0, noob: 1, mid: 2, epic: 3, legendary: 4 };
  const i = caps[cap];

  if (i >= 4 && r < 1) return 'legendary';
  if (i >= 3 && r < 6) return 'epic';
  if (i >= 2 && r < 45) return 'mid';
  if (i >= 1 && r < 80) return 'noob';
  return 'npc';
}

function getScoreForTier(tier) {
  switch(tier) {
    case 'legendary': return 95 + Math.floor(Math.random() * 6);
    case 'epic': return 80 + Math.floor(Math.random() * 15);
    case 'mid': return 50 + Math.floor(Math.random() * 30);
    case 'noob': return 25 + Math.floor(Math.random() * 25);
    default: return Math.floor(Math.random() * 25);
  }
}

function getTierData(tier) {
  const data = {
    legendary: { rarity: "legendary", title: "LEGENDARY", challenge: "WAAH BC TU TOH SACH MEIN KUCH HAI 🙄👑" },
    epic: { rarity: "epic", title: "EPIC", challenge: "KYA BAAT HAI ALMOST GREAT 🙄⚡" },
    mid: { rarity: "mid", title: "MID", challenge: "AMAZING YAAR KITNA AVERAGE 🙄🔥" },
    noob: { rarity: "noob", title: "NOOB", challenge: "BOHOT ACCHA POTENTIAL NAHI HAI 🙄💀" },
    npc: { rarity: "npc", title: "NPC", challenge: "TRULY INSPIRING WAHIYAT EXISTENCE 🙄😭" }
  };
  return data[tier] || data.npc;
}

function getFallbackRoast(tier, subject) {
  const roasts = {
    legendary: `Waah "${subject}" bhai waah, tu toh actually kuch hai 🙄 Bc damn kya karun insult du ya respect, fuck confused hun. 👑`,
    epic: `Kya baat hai "${subject}" almost great hai tu 🙄 Bc thoda aur try kar legendary ban jayega damn wahiyat. ⚡`,
    mid: `Amazing yaar "${subject}" kitna special hai tu 🙄 Bc itna average existence fuck truly inspiring chutiya. 🔥`,
    noob: `Waah "${subject}" talent dekho yaar 🙄 Bc itna below average damn kaise possible hai wahiyat. 💀`,
    npc: `Kya existence hai "${subject}" bhai masterpiece 🙄 Bc tu legend hai wahiyat category mein fuck damn. 😭`
  };
  return roasts[tier] || roasts.npc;
    }
