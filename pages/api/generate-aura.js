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

  // Determine tier first
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

  // ============================================
  // TRY GEMINI FIRST (with Google Search)
  // ============================================
  const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
  
  if (GEMINI_API_KEY && hasName) {
    try {
      result = await tryGemini(GEMINI_API_KEY, name, subject, mood, tier, finalScore, hasName, hasSubject, hasMood);
      if (result) {
        isPublicFigure = result.isPublicFigure || false;
        publicFigureStatus = result.publicFigureStatus || 'none';
      }
    } catch (error) {
      console.log("Gemini failed, trying HuggingFace:", error.message);
      result = null;
    }
  }

  // ============================================
  // FALLBACK TO HUGGINGFACE
  // ============================================
  if (!result) {
    const HF_TOKEN = process.env.HF_TOKEN;
    
    if (HF_TOKEN) {
      try {
        result = await tryHuggingFace(HF_TOKEN, name, subject, mood, tier, finalScore, hasName, hasSubject, hasMood);
        if (result) {
          isPublicFigure = result.isPublicFigure || false;
          publicFigureStatus = result.publicFigureStatus || 'none';
        }
      } catch (error) {
        console.log("HuggingFace failed:", error.message);
        result = null;
      }
    }
  }

  // ============================================
  // FINAL FALLBACK
  // ============================================
  if (!result) {
    result = {
      roast: getFallbackRoast(tier, subject || name || 'ye'),
      subject_insight: "Kya hi bole...",
      isPublicFigure: false,
      publicFigureStatus: 'none'
    };
  }

  // Enforce rarity
  const enforcedData = enforceRarityProbabilities(tier, finalScore, isPublicFigure, publicFigureStatus);
  tier = enforcedData.tier;
  finalScore = enforcedData.score;
  
  const { rarity, title, challenge } = getTierData(tier);

  return res.status(200).json({
    aura: {
      score: finalScore,
      roast: result.roast.replace(/^["']|["']$/g, '').trim(),
      subjectInsight: result.subject_insight || "Bahut kuch bolta hai...",
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
// GEMINI WITH GOOGLE SEARCH
// ============================================
async function tryGemini(apiKey, name, subject, mood, tier, finalScore, hasName, hasSubject, hasMood) {
  const genAI = new GoogleGenerativeAI(apiKey);
  
  // Use gemini-1.5-flash (more stable, higher limits)
  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
    tools: [{ googleSearch: {} }]
  });

  const prompt = `Tu savage roast master hai. Hinglish mein roast kar.

${hasName ? `NAME: "${name.trim()}" - Google search kar, unka kaam/content/personality dekh.` : ''}
${hasSubject ? `SUBJECT: "${subject.trim()}"` : ''}
${hasMood ? `MOOD: ${mood}` : ''}
TIER: ${tier.toUpperCase()} (Score: ${finalScore}/100)

RULES:
- Hinglish (Hindi + English mix)
- 40-50 words MAX, 2-3 sentences
- Gaaliyan naturally: bc, mc, chutiya, fuck, shit, damn
- 2-3 emojis
- Roast on: content, personality, work, style, ego
- NO controversy/scandal/legal issues/family

${tier === 'legendary' ? 'Respect de but backhanded compliment.' : ''}
${tier === 'epic' ? 'Good hai but humble kar.' : ''}
${tier === 'mid' ? 'Average bc. Roast mediocrity.' : ''}
${tier === 'noob' ? 'Below average. Destroy.' : ''}
${tier === 'npc' ? 'Bekar hai. No mercy.' : ''}

OUTPUT JSON ONLY:
{"roast": "hinglish roast", "subject_insight": "one line", "isPublicFigure": true/false, "publicFigureStatus": "peak/stable/falling/none"}`;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  const content = response.text();

  if (!content) return null;

  try {
    const jsonMatch = content.match(/\{[\s\S]*?\}/);
    return jsonMatch ? JSON.parse(jsonMatch[0]) : { roast: content.trim(), subject_insight: "Damn...", isPublicFigure: false, publicFigureStatus: 'none' };
  } catch {
    return { roast: content.trim(), subject_insight: "Yikes...", isPublicFigure: false, publicFigureStatus: 'none' };
  }
}

// ============================================
// HUGGINGFACE FALLBACK
// ============================================
async function tryHuggingFace(token, name, subject, mood, tier, finalScore, hasName, hasSubject, hasMood) {
  const client = new OpenAI({
    baseURL: "https://router.huggingface.co/v1",
    apiKey: token,
  });

  const systemPrompt = `Tu savage roast master hai. Hinglish mein roast kar.

LANGUAGE: Hindi + English mix naturally. Gaaliyan normal baat jaisi: bc, mc, chutiya, gadha, fuck, shit, damn, bitch.

RULES:
- 40-50 words MAX
- 2-3 sentences
- 2-3 emojis
- NO controversy/family attacks

TIER: ${tier.toUpperCase()} (Score: ${finalScore}/100)

${tier === 'legendary' ? 'Respect but backhanded.' : ''}
${tier === 'epic' ? 'Good but humble.' : ''}
${tier === 'mid' ? 'Average bc.' : ''}
${tier === 'noob' ? 'Below average. Destroy.' : ''}
${tier === 'npc' ? 'Bekar. No mercy.' : ''}

OUTPUT JSON: {"roast": "...", "subject_insight": "...", "isPublicFigure": false, "publicFigureStatus": "none"}`;

  const userContent = `${hasName ? `Name: ${name.trim()}` : ''} ${hasSubject ? `Subject: ${subject.trim()}` : ''} ${hasMood ? `Mood: ${mood}` : ''} | Tier: ${tier.toUpperCase()}

Hinglish mein roast kar. Gaaliyan naturally use kar.`;

  const completion = await client.chat.completions.create({
    model: "meta-llama/Meta-Llama-3-70B-Instruct:novita",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userContent }
    ],
    temperature: 1.0,
    max_tokens: 180
  });

  const content = completion.choices[0]?.message?.content;
  if (!content) return null;

  try {
    const jsonMatch = content.match(/\{[\s\S]*?\}/);
    return jsonMatch ? JSON.parse(jsonMatch[0]) : { roast: content.trim(), subject_insight: "Damn...", isPublicFigure: false, publicFigureStatus: 'none' };
  } catch {
    return { roast: content.trim(), subject_insight: "Yikes...", isPublicFigure: false, publicFigureStatus: 'none' };
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
    legendary: { rarity: "legendary", title: "LEGENDARY", challenge: "TU STANDARD HAI BC. 👑" },
    epic: { rarity: "epic", title: "EPIC", challenge: "ALMOST GODLIKE BHAI. ⚡" },
    mid: { rarity: "mid", title: "MID", challenge: "AVERAGE AF. NA IDHAR NA UDHAR. 🔥" },
    noob: { rarity: "noob", title: "NOOB", challenge: "POTENTIAL NOT FOUND BC. 💀" },
    npc: { rarity: "npc", title: "NPC", challenge: "TU HAI HI NAHI. WAHIYAT. 😭" }
  };
  return data[tier] || data.npc;
}

function getFallbackRoast(tier, subject) {
  const roasts = {
    legendary: `"${subject}" ko Legendary? Bc tu actually goated hai yaar. Respect. 👑`,
    epic: `"${subject}" got Epic? Bhai tu valid hai. Legendary nahi but accha hai. ⚡`,
    mid: `"${subject}"? Tu mid hai bc. Na accha na bura, bus hai. 🔥`,
    noob: `"${subject}" got Noob? 💀 Teri life mein potential dhundhna mushkil hai bc.`,
    npc: `"${subject}"? Tune kya likha ye? 😭 Tu loading screen hai bc jisko koi dekhta nahi.`
  };
  return roasts[tier] || roasts.npc;
}
