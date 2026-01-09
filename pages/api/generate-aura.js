// /pages/api/generate-aura.js

import { OpenAI } from "openai";

const AI_MODELS = {
  primary: "meta-llama/Llama-3.3-70B-Instruct:groq",
  backup: "meta-llama/Meta-Llama-3-70B-Instruct"
};

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
      result = { roast: getFallbackRoast(tier, subject || name || 'this', roastLanguage), subject_insight: "Facts.", isPublicFigure: false, publicFigureStatus: 'none' };
    }
  } catch (error) {
    console.log("Error:", error.message);
    result = { roast: getFallbackRoast(tier, subject || name || 'this', roastLanguage), subject_insight: "Truth.", isPublicFigure: false, publicFigureStatus: 'none' };
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

async function generateRoast(token, name, subject, mood, tier, finalScore, language, hasName, hasSubject, hasMood) {
  
  try {
    const result = await callAI(token, AI_MODELS.primary, name, subject, mood, tier, finalScore, language, hasName, hasSubject, hasMood);
    if (result?.roast) return result;
  } catch (error) {
    console.log("PRIMARY failed:", error.message);
  }

  try {
    const result = await callAI(token, AI_MODELS.backup, name, subject, mood, tier, finalScore, language, hasName, hasSubject, hasMood);
    if (result?.roast) return result;
  } catch (error) {
    console.log("BACKUP failed:", error.message);
  }

  return null;
}

// ============================================
// CORE ROAST ENGINE
// ============================================
async function callAI(token, model, name, subject, mood, tier, finalScore, language, hasName, hasSubject, hasMood) {
  const client = new OpenAI({
    baseURL: "https://router.huggingface.co/v1",
    apiKey: token,
  });

  const isHindi = language === 'hindi';
  const targetName = hasName ? name.trim() : (hasSubject ? subject.trim() : 'bro');

  const systemPrompt = `You're a savage roast comedian. Your roasts are SMART, not random insults.

## 3 GOLDEN RULES:

### RULE 1: Find ONE truth
Don't throw random insults. Find ONE specific thing about the person and attack THAT.
- Celebrity? Attack their famous work/moment
- Random person? Attack universal relatable things

### RULE 2: Observe, don't insult directly
BAD: "Tu bekaar hai" / "You suck"
GOOD: "Tu woh type hai jo..." / "You're the kind of guy who..."

### RULE 3: Simple words, hard punch
Write like you're talking to a friend. Short sentences. Simple words. But the meaning should HURT.

---

## HOW TO BUILD A ROAST:

### Step 1: Pick ONE truth
Example for Emiway: "He has beef with everyone"
Example for random: "He's boring"

### Step 2: Make an observation about it
"Emiway ke itne beefs hai ki..."
"You're so boring that..."

### Step 3: Exaggerate to make it funny
"...usse butcher shop kholni chahiye"
"...even your alarm gives up on you"

---

${isHindi ? `
## HINDI STYLE:
- Hinglish natural mix
- Simple words
- Bad words at END only: bc, mc, chutiya (1-2 max)
- Sound like Delhi friend roasting

GOOD HINDI ROASTS:
- "Bantai ke itne beefs hai, meat shop khol le seedha 💀"
- "Tera content dekhne se better hai main wall ko ghoorun, kam se kam wo reply nahi karta bc 😭"
- "Tu woh banda hai jisko log seen karke chhod dete hai, reply ka toh sawaal hi nahi 🔥"
- "Bhai tu itna forgettable hai ki tera naam bhi bhool gaya main likhte likhte 💀"
` : `
## ENGLISH STYLE:
- Simple English + bro/yaar naturally
- Short punchy sentences
- Bad words at END only: damn, shit, fuck (1-2 max)
- Sound like Indian friend roasting in English

GOOD ENGLISH ROASTS:
- "Bantai has so many beefs he should just open a meat shop at this point 💀"
- "I'd rather stare at a wall than watch your content, at least the wall doesn't reply back damn 😭"
- "You're the type of guy people leave on seen, reply isn't even a question bro 🔥"  
- "Bro you're so forgettable I forgot your name while typing this 💀"
`}

---

## MAKE IT POWERFUL:

### Dominance lines (use sometimes):
${isHindi ? `
- "Tu bad hai? Main tera baap hoon"
- "Meri ek line teri puri career se heavy"
- "Tu list mein bhi nahi hai bhai"
` : `
- "You think you're bad? I'm your dad"
- "My one line hits harder than your whole career"
- "You're not even on the list bro"
`}

### Preference roasts (hit hard):
${isHindi ? `
- "Teri music sunne se behtar main chup rahun"
- "Tere saath time spend karne se acha main bore ho jaun"
` : `
- "I'd rather sit in silence than listen to your music"
- "I'd rather be bored alone than spend time with you"
`}

---

## TIER: ${tier.toUpperCase()}
${tier === 'legendary' ? 'They are good. Find that ONE flaw and poke it.' : ''}
${tier === 'epic' ? 'Almost good. Roast the gap between them and greatness.' : ''}
${tier === 'mid' ? 'Average. Make them feel invisible.' : ''}
${tier === 'noob' ? 'Below average. Their failures are the joke.' : ''}
${tier === 'npc' ? 'Irrelevant. Question if they even exist.' : ''}

---

## FORMAT:
- 25-45 words
- 2 sentences max
- Observation + Punchline
- 1 emoji at end (💀 😭 🔥)
- 1-2 bad words MAX, at the end

## OUTPUT (JSON):
{"roast": "your roast here", "subject_insight": "the one truth you found", "isPublicFigure": true/false, "publicFigureStatus": "peak/stable/falling/none"}`;

  const userContent = `Roast: ${targetName}${hasSubject && hasName ? ` (${subject.trim()})` : ''}${hasMood ? ` | Mood: ${mood}` : ''}

Find ONE truth. Make ONE observation. Deliver ONE punchline.
${isHindi ? 'Hinglish.' : 'Simple English.'}
JSON only.`;

  const completion = await client.chat.completions.create({
    model: model,
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userContent }
    ],
    temperature: 1.0,
    max_tokens: 200,
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
  if (words.length > 55) {
    const sentences = cleaned.match(/[^.!?]+[.!?]+/g) || [cleaned];
    cleaned = sentences.slice(0, 2).join(' ');
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
    npc: { rarity: "npc", title: "NPC", challenge: h ? "EXIST KARTA HAI? 😭" : "DO YOU EXIST? 😭" }
  }[tier] || { rarity: "npc", title: "NPC", challenge: "😭" };
}

function getFallbackRoast(tier, subject, language) {
  const h = language === 'hindi';
  
  const roasts = {
    legendary: h 
      ? [`"${subject}" tu acha hai, but meri ek line teri career se heavy hai 💀`]
      : [`"${subject}" you're good, but my one line hits harder than your career 💀`],
    epic: h
      ? [`"${subject}" tu almost kuch tha, almost mein hi reh gaya 😭`]
      : [`"${subject}" you were almost something, got stuck at almost 😭`],
    mid: h
      ? [
          `"${subject}" tu woh hai jisko log seen karke chhod dete hai 💀`,
          `"${subject}" tera phone sirf OTP ke liye bajta hai 😭`,
        ]
      : [
          `"${subject}" you're the type people leave on seen 💀`,
          `"${subject}" your phone only rings for OTPs damn 😭`,
        ],
    noob: h
      ? [
          `"${subject}" tu itna forgettable hai ki tera naam bhool gaya likhte likhte 💀`,
          `"${subject}" log tujhse baat karte hai kyunki tu pehle se group mein hai 😭`,
        ]
      : [
          `"${subject}" you're so forgettable I forgot your name while typing 💀`,
          `"${subject}" people only talk to you because you're already in the group 😭`,
        ],
    npc: h
      ? [
          `"${subject}" tu exist karta hai? Google ko bhi nahi pata 💀`,
          `"${subject}" tu woh NPC hai jisko main skip karta hoon 😭`,
        ]
      : [
          `"${subject}" do you exist? Even Google doesn't know 💀`,
          `"${subject}" you're that NPC everyone skips damn 😭`,
        ]
  };
  
  const tierRoasts = roasts[tier] || roasts.npc;
  return tierRoasts[Math.floor(Math.random() * tierRoasts.length)];
}
