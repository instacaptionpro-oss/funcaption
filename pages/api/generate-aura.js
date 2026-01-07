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
    result = await generateRoastWithLlama(HF_TOKEN, name, subject, mood, tier, finalScore, roastLanguage, hasName, hasSubject, hasMood);
    
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
// MAIN ROAST GENERATOR - SIMPLE ENGLISH
// ============================================
async function generateRoastWithLlama(token, name, subject, mood, tier, finalScore, language, hasName, hasSubject, hasMood) {
  const client = new OpenAI({
    baseURL: "https://router.huggingface.co/v1",
    apiKey: token,
  });

  const isHindi = language === 'hindi';
  const targetName = hasName ? name.trim() : (hasSubject ? subject.trim() : 'bro');

  const systemPrompt = `You are a roast comedian for INDIAN audience. Output ONLY JSON with the roast.

## IMPORTANT - LANGUAGE STYLE:

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
- Write like Indians speak English

#### WRONG ❌ (Too hard):
"Your mediocrity transcends conventional boundaries of human incompetence"

#### RIGHT ✅ (Simple):
"Bro you're so average that even average people feel better about themselves 🙄 Thanks for the confidence boost damn. 💀"

#### MORE EXAMPLES (Simple English):
- "Oh wow so talented 🙄 Talent left the chat when you joined bro. Sad life damn. 💀"
- "Very hardworking yaar 🙄 Too bad hard work can't fix no talent shit. 💀"  
- "Bro thinks he's main character 🙄 You're not even in the movie damn. Background extra vibes. 💀"
`}

## ROAST RULES:
- 35-50 words only (2-3 sentences)
- Start with sarcasm → then reality check → end with punchline
- 1-2 bad words MAX (at the end)
- Use 🙄 for sarcasm, end with 💀 or 🔥
- Keep it SIMPLE and FUNNY

## TIER: ${tier.toUpperCase()}
${tier === 'legendary' ? '→ Respect but still roast' : ''}
${tier === 'epic' ? '→ Almost great, find one flaw' : ''}
${tier === 'mid' ? '→ Average, nothing special' : ''}
${tier === 'noob' ? '→ Below average, use failures' : ''}
${tier === 'npc' ? '→ Full destroy mode' : ''}

## OUTPUT (ONLY JSON, NO EXPLANATION):
{"roast": "simple 35-50 word roast", "subject_insight": "short sarcastic line", "isPublicFigure": true/false, "publicFigureStatus": "peak/stable/falling/none"}`;

  const userContent = `Roast: ${targetName}${hasSubject && hasName ? ` (${subject.trim()})` : ''}${hasMood ? ` | Mood: ${mood}` : ''}

Remember: ${isHindi ? 'Hindi/Hinglish' : 'SIMPLE English for Indians - no difficult words'}. Only output JSON.`;

  const completion = await client.chat.completions.create({
    model: "meta-llama/Meta-Llama-3-70B-Instruct",
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

// Clean any extra stuff from roast
function cleanRoast(roast) {
  const patterns = [
    /^(okay|alright|so|let me|here's|based on|research shows|looking at|analyzing)/i,
    /^(step \d|first|the person|this person|they are)/i,
  ];
  
  let cleaned = roast;
  patterns.forEach(p => {
    cleaned = cleaned.replace(p, '');
  });
  
  const words = cleaned.trim().split(/\s+/);
  if (words.length > 70) {
    const sentences = cleaned.match(/[^.!?]+[.!?]+/g) || [cleaned];
    cleaned = sentences.slice(0, 3).join(' ');
  }
  
  return cleaned.trim();
}

// ============================================
// HELPERS
// ============================================
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
    legendary: h 
      ? `Waah "${subject}" bhai goated hai 🙄 Itna talent ki gaali dene ka mann nahi bc. Respect. 👑` 
      : `Oh wow "${subject}" you're actually good bro 🙄 Can't even roast you properly damn. Respect. 👑`,
    epic: h
      ? `"${subject}" almost legend hai 🙄 Thoda aur try kar bc, almost hatao. ⚡`
      : `"${subject}" almost legend bro 🙄 Just a little more push and you'll make it damn. Almost there. ⚡`,
    mid: h
      ? `Bhai "${subject}" itna average ki Excel bore ho jaaye 🙄 Personality 404 bc. 🔥`
      : `Bro "${subject}" so average that even boring people find you boring 🙄 Personality not found damn. 🔥`,
    noob: h
      ? `"${subject}" ka potential WiFi in basement jaisa 🙄 Signal nahi milega bc. 💀`
      : `"${subject}" your potential is like WiFi in basement bro 🙄 No signal ever damn. Sad life. 💀`,
    npc: h
      ? `"${subject}" exist karta hai ya loading screen hai 🙄 Skip button bc. 😭`
      : `"${subject}" do you exist or are you just loading screen bro 🙄 Everyone wants to skip you damn. 😭`
  };
  return roasts[tier] || roasts.npc;
                                         }
