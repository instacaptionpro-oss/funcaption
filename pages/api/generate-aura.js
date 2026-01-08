// /pages/api/generate-aura.js

import { OpenAI } from "openai";

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
  const HF_TOKEN = process.env.HF_TOKEN;

  if (!HF_TOKEN) {
    return res.status(500).json({ error: "API token not configured" });
  }

  try {
    result = await generateRoast(HF_TOKEN, name, subject, mood, tier, finalScore, roastLanguage, hasName, hasSubject, hasMood);
    
    if (!result?.roast || result.roast.length < 30) {
      result = { roast: getFallbackRoast(tier, subject || name || 'this', roastLanguage), subject_insight: "Interesting...", isPublicFigure: false, publicFigureStatus: 'none' };
    }
  } catch (error) {
    console.log("Error:", error.message);
    result = { roast: getFallbackRoast(tier, subject || name || 'this', roastLanguage), subject_insight: "Hmm...", isPublicFigure: false, publicFigureStatus: 'none' };
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
// AI MODELS CONFIG
// ============================================
const AI_MODELS = {
  primary: "meta-llama/Llama-3.3-70B-Instruct:groq",    // Fast, try first
  backup: "meta-llama/Meta-Llama-3-70B-Instruct"         // Fallback when primary fails
};

// ============================================
// MAIN ROAST GENERATOR WITH FALLBACK
// ============================================
async function generateRoast(token, name, subject, mood, tier, finalScore, language, hasName, hasSubject, hasMood) {
  
  // Try PRIMARY model first
  try {
    console.log("Trying PRIMARY model:", AI_MODELS.primary);
    const result = await callAI(token, AI_MODELS.primary, name, subject, mood, tier, finalScore, language, hasName, hasSubject, hasMood);
    if (result?.roast) {
      console.log("PRIMARY model success ✅");
      return result;
    }
  } catch (error) {
    console.log("PRIMARY model failed:", error.message);
  }

  // Try BACKUP model if primary fails
  try {
    console.log("Trying BACKUP model:", AI_MODELS.backup);
    const result = await callAI(token, AI_MODELS.backup, name, subject, mood, tier, finalScore, language, hasName, hasSubject, hasMood);
    if (result?.roast) {
      console.log("BACKUP model success ✅");
      return result;
    }
  } catch (error) {
    console.log("BACKUP model failed:", error.message);
  }

  // Both failed, return null (will use fallback roast)
  console.log("All models failed, using fallback roast");
  return null;
}

// ============================================
// AI CALLER FUNCTION
// ============================================
async function callAI(token, model, name, subject, mood, tier, finalScore, language, hasName, hasSubject, hasMood) {
  const client = new OpenAI({
    baseURL: "https://router.huggingface.co/v1",
    apiKey: token,
  });

  const isHindi = language === 'hindi';
  const targetName = hasName ? name.trim() : (hasSubject ? subject.trim() : 'bro');

  const systemPrompt = `You are a roast comedian for INDIAN audience. Output ONLY JSON with the roast.

## LANGUAGE STYLE:

${isHindi ? `
### HINDI/HINGLISH:
- Mix Hindi + English like Indians talk
- Sarcasm: "Waah bhai", "Kya baat hai", "Bohot hard" 🙄
- Bad words: bc, mc, chutiya (only 1-2, at punchline)
- Example: "Waah bhai itna talent hai ki talent bhi sharma jaaye 🙄 God was busy that day bc. 💀"
` : `
### SIMPLE ENGLISH (For Indians):
- Use SIMPLE words Indians use daily
- Mix "bro", "yaar", "bhai" naturally  
- Sarcasm: "Oh wow", "So nice", "Very good" 🙄
- Bad words: damn, shit, fuck (only 1-2, at punchline)
- NO fancy/difficult English words

#### EXAMPLES:
- "Oh wow so talented 🙄 Talent left the chat when you joined bro. Sad life damn. 💀"
- "Bro thinks he's main character 🙄 You're not even in the movie damn. Background extra vibes. 💀"
`}

## ROAST RULES:
- 35-50 words only (2-3 sentences)
- Sarcasm → reality check → punchline
- 1-2 bad words MAX (at the end)
- Use 🙄 for sarcasm, end with 💀 or 🔥

## TIER: ${tier.toUpperCase()}
${tier === 'legendary' ? '→ Respect but still roast' : tier === 'epic' ? '→ Almost great, find flaw' : tier === 'mid' ? '→ Average, nothing special' : tier === 'noob' ? '→ Below average' : '→ Full destroy'}

## OUTPUT (ONLY JSON):
{"roast": "35-50 word roast", "subject_insight": "short line", "isPublicFigure": true/false, "publicFigureStatus": "peak/stable/falling/none"}`;

  const userContent = `Roast: ${targetName}${hasSubject && hasName ? ` (${subject.trim()})` : ''}${hasMood ? ` | Mood: ${mood}` : ''}

${isHindi ? 'Hindi/Hinglish' : 'SIMPLE English'}. Only output JSON.`;

  const completion = await client.chat.completions.create({
    model: model,
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userContent }
    ],
    temperature: 0.9,
    max_tokens: 200
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
    return { roast: cleanRoast(content.trim()), subject_insight: "Damn...", isPublicFigure: hasName, publicFigureStatus: 'stable' };
  } catch {
    return { roast: cleanRoast(content.trim()), subject_insight: "Interesting...", isPublicFigure: hasName, publicFigureStatus: 'stable' };
  }
}

// ============================================
// HELPERS
// ============================================
function cleanRoast(roast) {
  let cleaned = roast;
  [/^(okay|alright|so|let me|here's|based on)/i, /^(step \d|first|the person)/i].forEach(p => {
    cleaned = cleaned.replace(p, '');
  });
  const words = cleaned.trim().split(/\s+/);
  if (words.length > 70) {
    const sentences = cleaned.match(/[^.!?]+[.!?]+/g) || [cleaned];
    cleaned = sentences.slice(0, 3).join(' ');
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
  if (s.includes("office politics") || s.includes("ass kissing")) return 'npc';
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
  if (/terrible|awful|obsession|pathetic|embarrassing/i.test(subject)) score += 15;
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
  const data = {
    legendary: { rarity: "legendary", title: "LEGENDARY", challenge: h ? "GOATED HAI TU BC 👑" : "BRO YOU'RE GOATED 👑" },
    epic: { rarity: "epic", title: "EPIC", challenge: h ? "ALMOST LEGEND BHAI ⚡" : "ALMOST LEGEND BRO ⚡" },
    mid: { rarity: "mid", title: "MID", challenge: h ? "AVERAGE HAI BC 🔥" : "SO AVERAGE BRO 🔥" },
    noob: { rarity: "noob", title: "NOOB", challenge: h ? "POTENTIAL GAYAB 💀" : "NO POTENTIAL BRO 💀" },
    npc: { rarity: "npc", title: "NPC", challenge: h ? "EXIST KARTA HAI? 😭" : "DO YOU EVEN EXIST? 😭" }
  };
  return data[tier] || data.npc;
}

function getFallbackRoast(tier, subject, language) {
  const h = language === 'hindi';
  const roasts = {
    legendary: h ? `Waah "${subject}" bhai goated hai 🙄 Gaali dene ka mann nahi bc. Respect. 👑` : `Oh wow "${subject}" you're actually good bro 🙄 Can't roast you damn. Respect. 👑`,
    epic: h ? `"${subject}" almost legend hai 🙄 Thoda aur try kar bc. ⚡` : `"${subject}" almost legend bro 🙄 Little more push damn. ⚡`,
    mid: h ? `"${subject}" itna average ki Excel bore ho jaaye 🙄 Personality 404 bc. 🔥` : `"${subject}" so average bro 🙄 Personality not found damn. 🔥`,
    noob: h ? `"${subject}" ka potential WiFi in basement jaisa 🙄 No signal bc. 💀` : `"${subject}" potential like WiFi in basement bro 🙄 No signal damn. 💀`,
    npc: h ? `"${subject}" exist karta hai ya loading screen 🙄 Skip button bc. 😭` : `"${subject}" do you exist bro or just loading 🙄 Skip button damn. 😭`
  };
  return roasts[tier] || roasts.npc;
        }
