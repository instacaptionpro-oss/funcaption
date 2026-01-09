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

async function callAI(token, model, name, subject, mood, tier, finalScore, language, hasName, hasSubject, hasMood) {
  const client = new OpenAI({
    baseURL: "https://router.huggingface.co/v1",
    apiKey: token,
  });

  const isHindi = language === 'hindi';
  const targetName = hasName ? name.trim() : (hasSubject ? subject.trim() : 'bro');

  const systemPrompt = `You're a savage roast comedian. Smart roasts, not random insults.

## RULES:

1. Find ONE truth about the person
2. Observe don't insult: "You're the type who..." not "You suck"
3. Write 3-4 lines (40-70 words) - not too short, not too long

## ROAST STRUCTURE:

Line 1: Opening observation (hook them)
Line 2: Twist the knife (make it worse)
Line 3: Another angle or comparison
Line 4: Kill shot with bad word

${isHindi ? `
## HINDI STYLE:
- Hinglish mix naturally
- Bad words at end: bc, chutiya (1-2 only)
- Sound like Delhi friend roasting

EXAMPLES:

"Bantai ke itne beefs hai ki meat shop khol le 💀 Independent hai kyunki koi sign nahi karna chahta tujhe. Teri rap sunne se behtar main silence enjoy karun, wo bhi better sound karti hai bc 🔥"

"Bhai tu woh type hai jisko log 'haan bro' bolke ignore karte hai 💀 Tera phone sirf OTP ke liye bajta hai, real calls toh sapne mein bhi nahi. Group photo mein crop hone wala pehla banda tu hai bc 😭"

"Tu influencer hai? Sirf teri mummy influenced hai 💀 Followers fake, engagement fake, bas tera ego real hai. Content dekhne se better hai wall ghoorna, kam se kam wo bore nahi karti damn 🔥"
` : `
## ENGLISH STYLE:
- Simple English + bro/yaar mix
- Bad words at end: damn, shit, fuck (1-2 only)
- Sound like Indian friend roasting

EXAMPLES:

"Bantai has so many beefs he should open a meat shop 💀 You're independent because nobody wants to sign you bro. I'd rather enjoy silence than your music, at least that doesn't hurt my ears damn 🔥"

"You're the type of guy people say 'yeah bro' to and completely forget 💀 Your phone only rings for OTPs, real calls are just a dream. You're always first to get cropped from group photos damn 😭"

"You're an influencer? Only your mom is influenced bro 💀 Followers fake, engagement fake, only your ego is real. I'd rather watch paint dry than your content, less boring honestly shit 🔥"
`}

## TIER: ${tier.toUpperCase()}
${tier === 'legendary' ? 'Backhanded respect - good but find that one flaw' : ''}
${tier === 'epic' ? 'Almost great - roast the gap' : ''}
${tier === 'mid' ? 'Average - make them feel invisible' : ''}
${tier === 'noob' ? 'Below average - stack their failures' : ''}
${tier === 'npc' ? 'Irrelevant - question their existence' : ''}

## FORMAT:
- 40-70 words (3-4 lines)
- Readable, enjoyable length
- 1-2 emojis (💀 😭 🔥)
- Bad word at the end for impact

## OUTPUT (JSON only):
{"roast": "3-4 line roast here", "subject_insight": "truth you found", "isPublicFigure": true/false, "publicFigureStatus": "peak/stable/falling/none"}`;

  const userContent = `Roast: ${targetName}${hasSubject && hasName ? ` (${subject.trim()})` : ''}${hasMood ? ` | Mood: ${mood}` : ''}

3-4 lines. Not too long, not too short. Make it enjoyable to read.
${isHindi ? 'Hinglish.' : 'Simple English.'}
JSON only.`;

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
  if (words.length > 80) {
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
      ? [`"${subject}" tu acha hai no doubt 💀 But meri ek line teri career se heavy hai. Talent hai tujhme, bas thoda aur mehnat kar. Abhi toh sirf almost legendary hai tu bc 🔥`]
      : [`"${subject}" you're good no doubt 💀 But my one line hits harder than your career bro. You got talent, just need more work. Right now you're just almost legendary damn 🔥`],
    epic: h
      ? [`"${subject}" tu almost kuch tha bhai 💀 Itna paas aake ruk gaya, finish line dekh ke dar gaya kya? Potential hai but execution zero hai. Almost mein hi marr jayega tu bc 😭`]
      : [`"${subject}" you were almost something bro 💀 Got so close then stopped, scared of the finish line? Got potential but zero execution. You'll die in the 'almost' zone damn 😭`],
    mid: h
      ? [
          `"${subject}" tu woh hai jisko log 'haan bro' bolke ignore karte hai 💀 Tera phone sirf OTP ke liye bajta hai, calls toh sapne mein bhi nahi. Group photo mein sabse pehle crop hone wala tu hai bc 😭`,
          `"${subject}" teri personality itni dry hai ki Rajasthan jealous hai 💀 Tu exist karta hai but kisi ko farak nahi padta. Background mein blur face hai tu bas, notice nahi karta koi damn 🔥`,
        ]
      : [
          `"${subject}" you're the type people say 'yeah bro' to and forget 💀 Your phone only rings for OTPs, real calls are just dreams. Always first to get cropped from group photos damn 😭`,
          `"${subject}" your personality is so dry Rajasthan is jealous 💀 You exist but nobody cares honestly. You're just a blur face in the background, nobody notices you bro shit 🔥`,
        ],
    noob: h
      ? [
          `"${subject}" tu itna forgettable hai ki tera naam bhool gaya likhte likhte 💀 Log tujhse baat karte hai kyunki tu pehle se group mein hai. Nikal de toh kisi ko yaad bhi nahi aayega tu bc 😭`,
          `"${subject}" tera potential toh hai bhai, bas kisi ne dekha nahi 💀 Shayad exist hi nahi karta wo. Tu woh loading screen hai jo kabhi complete nahi hoti damn 🔥`,
        ]
      : [
          `"${subject}" you're so forgettable I forgot your name while typing 💀 People only talk to you because you're already in the group. Remove yourself and nobody will even notice bro damn 😭`,
          `"${subject}" you got potential bro, nobody has seen it though 💀 Maybe it doesn't exist at all. You're that loading screen that never completes shit 🔥`,
        ],
    npc: h
      ? [
          `"${subject}" tu exist bhi karta hai? Google ko bhi nahi pata 💀 Tu woh NPC hai jisko main dialogue skip karta hoon. Teri puri life ek loading screen hai jo buffer pe atki hai bc 😭`,
          `"${subject}" tujhe dekhne se behtar main wall ghoorun 💀 Kam se kam wo reply nahi karti, tu toh boring reply bhi karta hai. Tera existence ek waste of space hai honestly bc 🔥`,
        ]
      : [
          `"${subject}" do you even exist? Google doesn't know either 💀 You're that NPC whose dialogue I always skip. Your whole life is a loading screen stuck on buffer damn 😭`,
          `"${subject}" I'd rather stare at a wall than look at you 💀 At least the wall doesn't give boring replies like you do. Your existence is literally a waste of space bro shit 🔥`,
        ]
  };
  
  const tierRoasts = roasts[tier] || roasts.npc;
  return tierRoasts[Math.floor(Math.random() * tierRoasts.length)];
  }
