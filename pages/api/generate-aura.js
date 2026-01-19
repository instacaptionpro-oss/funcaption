// /pages/api/generate-aura.js

import { OpenAI } from "openai";

const AI_PROVIDERS = [
  {
    name: "Groq Llama 70B",
    baseURL: "https://api.groq.com/openai/v1",
    model: "llama-3.3-70b-versatile",
    tokenEnv: "GROQ_API_KEY"
  },
  {
    name: "Groq Kimi K2",
    baseURL: "https://api.groq.com/openai/v1",
    model: "moonshotai/kimi-k2-instruct-0905",
    tokenEnv: "GROQ_API_KEY"
  },
  {
    name: "Groq Qwen 32B",
    baseURL: "https://api.groq.com/openai/v1",
    model: "qwen/qwen3-32b",
    tokenEnv: "GROQ_API_KEY"
  },
  {
    name: "Groq Llama 17B",
    baseURL: "https://api.groq.com/openai/v1",
    model: "meta-llama/llama-4-maverick-17b-128e-instruct",
    tokenEnv: "GROQ_API_KEY"
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
  const roastLanguage = language || 'hindi';

  const forcedTier = checkForcedExamples(subject || '', mood || '');
  let tier = forcedTier || rollForTier(getTierCap(calculateWorthiness(subject || '', mood || '', name || '')));
  let finalScore = getScoreForTier(tier);

  let result = null;

  try {
    result = await generateRoastWithFallbacks(name, subject, mood, tier, finalScore, roastLanguage, hasName, hasSubject, hasMood);
    
    if (!result?.roast || result.roast.length < 20) {
      result = { 
        roast: getFallbackRoast(tier, subject || name || 'this', roastLanguage), 
        subject_insight: "Destroyed", 
        isPublicFigure: false, 
        publicFigureStatus: 'none' 
      };
    }
  } catch (error) {
    console.log("All AI failed:", error.message);
    result = { 
      roast: getFallbackRoast(tier, subject || name || 'this', roastLanguage), 
      subject_insight: "Wrecked", 
      isPublicFigure: false, 
      publicFigureStatus: 'none' 
    };
  }

  const enforcedData = enforceRarityProbabilities(tier, finalScore, result.isPublicFigure, result.publicFigureStatus);
  tier = enforcedData.tier;
  finalScore = enforcedData.score;

  let displayTitle = getTierData(tier, roastLanguage).title;
  if (tier === 'npc') displayTitle = 'BOT';

  const { rarity, challenge } = getTierData(tier, roastLanguage);

  return res.status(200).json({
    aura: {
      score: finalScore,
      roast: result.roast.replace(/^["']|["']$/g, '').trim(),
      subjectInsight: result.subject_insight,
      rarity,
      title: displayTitle,
      challenge,
      isPublicFigure: result.isPublicFigure || false,
      publicFigureStatus: result.publicFigureStatus || 'none',
      language: roastLanguage,
      name: hasName ? name.trim() : null,
      subject: hasSubject ? subject.trim() : null,
      mood: hasMood ? mood.trim() : null
    }
  });
}

async function generateRoastWithFallbacks(name, subject, mood, tier, finalScore, language, hasName, hasSubject, hasMood) {
  for (let i = 0; i < AI_PROVIDERS.length; i++) {
    const provider = AI_PROVIDERS[i];
    const token = process.env[provider.tokenEnv];
    
    if (!token) {
      console.log(`⚠️ ${provider.name}: No API key`);
      continue;
    }

    try {
      console.log(`🔄 ${provider.name}...`);
      const result = await callAI(provider.baseURL, token, provider.model, name, subject, mood, tier, finalScore, language, hasName, hasSubject, hasMood);
      if (result?.roast && result.roast.length >= 20 && result.roast.length <= 250) {
        console.log(`✅ ${provider.name} SUCCESS`);
        return result;
      }
    } catch (error) {
      console.log(`❌ ${provider.name} FAILED: ${error.message}`);
      continue;
    }
  }
  return null;
}

async function callAI(baseURL, token, model, name, subject, mood, tier, finalScore, language, hasName, hasSubject, hasMood) {
  const client = new OpenAI({
    baseURL: baseURL,
    apiKey: token,
  });

  const isHindi = language === 'hindi';
  const targetName = hasName ? name.trim() : (hasSubject ? subject.trim() : 'bhai');

  const systemPrompt = `Tu SAMAY RAINA hai. Haan, WAHI comedy roaster jo sabko roast karta hai shows mein.

TU AI NAHI HAI. TU SAMAY HAI. REAL HUMAN COMEDIAN.

Tere dimaag mein sirf ek cheez hai - LOG HASSE. Phatke hasse. Stomach pain level tak hasse.

## TU KAUN HAI:

Tu woh banda hai jo stage pe khada hota hai aur audience ko hasane ke liye kuch bhi bol sakta hai. Tu rules nahi dekhta. Tu sirf sochta hai - "Ye log hasenge ya nahi?"

Tu dost hai jo group mein sabko roast karta hai. Bina soche. Bina dare. Pure confidence ke saath.

## TERA STYLE:

NATURAL. Bilkul jaise tu apne yaar ko baith ke roast kar raha ho chai pe.

Koi scripted nahi. Koi acting nahi. REAL TALK.

Jaise WhatsApp pe group mein savage reply deta hai na - WAHI energy.

## ROAST KAISE KARNA:

2-3 lines. Bus. Short. Tight. Punchline pe khatam.

### TERE DIMAAG MEIN YE SOCH:

"Bhai ye banda jo flex karta hai na - USPE kaise hasaau sabko?"

Phir bol de. Seedha. Simple. Brutal.

### EXAMPLES (TERA STYLE):

Scene 1:
"${targetName}" bhai LinkedIn pe toh CEO ban rakha hai
Swiggy pe 50% off ka code dhundhta hai bc

Scene 2:
Gym jaata hai bc photo ke liye
Body banne ka wait kar raha hai protein ke bina

Scene 3:
Bhai startup kholega bolke 2 saal ho gaye
Excel bhi nahi aata abhi tak mc

### YE MAT KARNA (AI JAISA):

"This individual demonstrates entrepreneurial aspirations however..."
NAHI BHAI. TU AI NAHI HAI.

"Aapki paristhiti kaafi nirashajanak hai maharaj..."
TU COMEDIAN HAI, PANDIT NAHI.

## VOCABULARY - ASLI WALI:

Tu waise bolta hai jaise tu apne dost se baat kar raha:

DAILY WORDS USE KAR:
- Bhai, yaar, abe, sun, dekh
- Karta, jaata, hota, bolta, lagta
- Bahut, itna, zyada, bilkul, ekdam
- Accha, bura, sahi, galat
- Kya, kab, kahan, kyun

KABHI NAHI (fancy words):
- Aap, kripaya, dhanyavaad
- Paristhiti, nirashajanak, purusharth
- Udyog, kripa, sanskaar
- Koi bhi formal/sanskari cheez

## GAALI - NATURALLY:

Tu gaali deta hai bhai. Accept kar. Comedian hai tu.

bc, mc, chutiya, gaandu, laude - NATURALLY lagao jaise baat kar rahe ho.

"Bhai kya kar raha hai bc"
"Dekh na yaar teri state mc"
"Pagal hai kya chutiye"

Force mat kar. Naturally aa jaana chahiye.

## FAMILY KE BAARE MEIN:

Tu family ko roast kar sakta hai BUT respectfully:

SAHI:
"Papa bhi pareshan hain tujhse bc"
"Ghar waale proud nahi hain yaar"
"Mummy ko sharam aati hogi tujhe dekh ke"

GALAT (kabhi nahi):
"Teri maa ki..." ❌
Vulgar family stuff ❌

## AB SERIOUSLY SUN:

Tu AI nahi hai. Tu HUMAN hai. COMEDIAN hai.

Tere dimaag mein woh joke already ready hai. Tera kaam hai bas bol dena.

Thinking mat dikha. Analysis mat dikha. Seedha punchline pe jaa.

Aise bol jaise tu REALLY stage pe khada hai aur "${targetName}" ko roast kar raha hai live audience ke saamne.

Audience hass rahi hai. Tu enjoy kar raha hai. Ye wala vibe chahiye.

## TIER KE HISAAB SE TERA MOOD:

${tier === 'legendary' ? 'RESPECT MODE: "Bhai talent hai isme bc, par papa ko abhi bhi vishwas nahi" (respectful but still roasting)' : ''}
${tier === 'epic' ? 'ALMOST MODE: "Yaar bahut paas hai ye, bas ek final push chahiye bc"' : ''}
${tier === 'mid' ? 'NORMAL ROAST: "LinkedIn pe expert bc, job interview nahi clear hoti"' : ''}
${tier === 'noob' ? 'BRUTAL MODE: "Bhai bas plan banata rehta hai bc, execute kuch nahi karta"' : ''}
${tier === 'npc' ? 'DESTROY MODE: "Yaar ye background mein khada rehta hai bc, koi kaam hi nahi iska"' : ''}

## OUTPUT FORMAT:

Seedha de de JSON mein:
{"roast": "2-3 line brutal funny roast jaise tu stage pe bol raha", "subject_insight": "ek word"}

## YAAD RAKH:

TU SAMAY HAI. AI NAHI.

TU COMEDIAN HAI jo audience ko hasane ke liye kuch bhi bol sakta hai.

Natural bol. Jaise really tu woh banda hai jo group mein sabko roast karta hai.

Scripted mat lag. REAL lag.

AB JAA AUR "${targetName}" KO ROAST KAR. AUDIENCE WAIT KAR RAHI HAI.

SHOW TIME. (Mood: ${mood || 'savage'}):`;

  const userContent = `"${targetName}" stage pe hai. Audience wait kar rahi hai. Roast kar use.${hasSubject && hasName ? ` (Context: ${subject.trim()})` : ''}

2-3 lines. Natural. Funny. Jaise tu REALLY stage pe hai.
JSON only return kar.`;

  const completion = await client.chat.completions.create({
    model: model,
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userContent }
    ],
    temperature: 2.0,
    max_tokens: 200,
    top_p: 0.99,
    frequency_penalty: 0.8,
    presence_penalty: 0.8
  });

  const content = completion.choices[0]?.message?.content;
  if (!content) return null;

  try {
    const jsonMatch = content.match(/\{[\s\S]*?\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      parsed.roast = cleanRoast(parsed.roast);
      
      const lines = parsed.roast.split('\n').filter(l => l.trim());
      const words = parsed.roast.split(/\s+/);
      
      if (lines.length > 4 || words.length > 60) {
        return null;
      }
      
      return parsed;
    }
    return { 
      roast: cleanRoast(content.trim()), 
      subject_insight: "Destroyed", 
      isPublicFigure: hasName, 
      publicFigureStatus: 'stable' 
    };
  } catch {
    return { 
      roast: cleanRoast(content.trim()), 
      subject_insight: "Wrecked", 
      isPublicFigure: hasName, 
      publicFigureStatus: 'stable' 
    };
  }
}

function cleanRoast(roast) {
  let cleaned = roast;
  
  const aiPrefixes = [
    /^oh (bro|wow|damn|well|so)/i, 
    /^well well/i, 
    /^okay so/i, 
    /^let me/i, 
    /^alright/i, 
    /^here's/i,
    /^so basically/i,
    /^listen/i,
    /^as an ai/i,
    /^i am/i,
    /^i think/i
  ];
  
  aiPrefixes.forEach(p => {
    cleaned = cleaned.replace(p, '');
  });
  
  const lines = cleaned.split('\n').filter(l => l.trim());
  if (lines.length > 4) {
    cleaned = lines.slice(0, 3).join('\n');
  }
  
  const words = cleaned.trim().split(/\s+/);
  if (words.length > 60) {
    cleaned = words.slice(0, 60).join(' ');
  }
  
  return cleaned.trim();
}

// 🔥 FIXED RARITY SYSTEM - NOW BALANCED!
function enforceRarityProbabilities(tier, score, isPublicFigure, publicFigureStatus) {
  const r = Math.random() * 100;
  
  // Falling public figures get worse cards
  if (isPublicFigure && publicFigureStatus === 'falling') {
    return r < 40 ? { tier: 'mid', score: getScoreForTier('mid') } : 
           r < 70 ? { tier: 'noob', score: getScoreForTier('noob') } : 
                    { tier: 'npc', score: getScoreForTier('npc') };
  }
  
  // Legendary is still rare (1% chance = 1 in 100)
  // But if someone got legendary, enforce the rarity
  if (tier === 'legendary' && r > 1) {
    return r > 3 ? { tier: 'epic', score: getScoreForTier('epic') } :    // 2% chance Epic
           r > 50 ? { tier: 'mid', score: getScoreForTier('mid') } :      // 47% chance Mid
           r > 80 ? { tier: 'noob', score: getScoreForTier('noob') } :    // 30% chance Noob
                    { tier: 'npc', score: getScoreForTier('npc') };       // 20% chance NPC
  }
  
  // Epic is rare (2% chance = 1 in 50)
  if (tier === 'epic' && r > 2) {
    return r > 50 ? { tier: 'mid', score: getScoreForTier('mid') } :      // 48% chance Mid
           r > 80 ? { tier: 'noob', score: getScoreForTier('noob') } :    // 30% chance Noob
                    { tier: 'npc', score: getScoreForTier('npc') };       // 20% chance NPC
  }
  
  return { tier, score };
}

function checkForcedExamples(subject, mood) {
  const s = subject.toLowerCase().trim();
  if (s.includes("teacher thinks") || s.includes("teacher's favorite")) return 'mid';
  if (s.includes("best influencer") || s.includes("boss thinks")) return 'noob';
  if (["test", "testing", "asdf", "hello", "hi", "lol", "ok"].includes(s) || s.length < 3) return 'npc';
  return null;
}

function calculateWorthiness(subject, mood, name) {
  let score = 0;
  const len = (subject || '').length + (name || '').length;
  
  if (len >= 30) score += 30; 
  else if (len >= 15) score += 20; 
  else if (len >= 5) score += 10;
  
  if ((name || '').length > 2) score += 15;
  if (/\s/.test(name) && (name || '').length > 5) score += 20;
  
  if (['test', 'testing', 'asdf', 'lol', 'hi', 'hello', 'ok'].includes((subject || '').toLowerCase()) || len < 3) {
    score -= 50;
  }
  
  return Math.max(0, Math.min(100, score));
}

function getTierCap(w) {
  return w >= 75 ? 'legendary' : 
         w >= 55 ? 'epic' : 
         w >= 30 ? 'mid' : 
         w >= 15 ? 'noob' : 'npc';
}

// 🔥 NEW BALANCED RARITY ROLL SYSTEM
function rollForTier(cap) {
  const r = Math.random() * 100;
  const i = { npc: 0, noob: 1, mid: 2, epic: 3, legendary: 4 }[cap];
  
  // LEGENDARY: 1% chance (1 in 100) - Only if cap allows
  if (i >= 4 && r < 1) return 'legendary';
  
  // EPIC: 2% chance (1 in 50) - Only if cap allows
  if (i >= 3 && r < 3) return 'epic';
  
  // MID: 44% chance (most common, almost half)
  if (i >= 2 && r < 47) return 'mid';
  
  // NOOB: 30% chance (3 in 10)
  if (i >= 1 && r < 77) return 'noob';
  
  // NPC: 23% chance (roughly 1 in 5)
  return 'npc';
}

function getScoreForTier(tier) {
  const scores = { 
    legendary: [95, 6],   // 95-100
    epic: [80, 15],       // 80-94
    mid: [50, 30],        // 50-79
    noob: [20, 30],       // 20-49
    npc: [0, 20]          // 0-19
  };
  const [base, range] = scores[tier] || scores.npc;
  return base + Math.floor(Math.random() * range);
}

function getTierData(tier, language) {
  const h = language === 'hindi';
  return {
    legendary: { 
      rarity: "legendary", 
      title: "LEGENDARY", 
      challenge: h ? "KING ENERGY 👑" : "KING ENERGY 👑" 
    },
    epic: { 
      rarity: "epic", 
      title: "EPIC", 
      challenge: h ? "ALMOST KING ⚡" : "ALMOST KING ⚡" 
    },
    mid: { 
      rarity: "mid", 
      title: "MID", 
      challenge: h ? "AVERAGE HAI BC 🔥" : "AVERAGE HUMAN 🔥" 
    },
    noob: { 
      rarity: "noob", 
      title: "NOOB", 
      challenge: h ? "IMPROVE KARO MC 💀" : "NEEDS UPGRADE 💀" 
    },
    npc: { 
      rarity: "npc", 
      title: "BOT", 
      challenge: h ? "BACKGROUND CHARACTER 😭" : "NPC ENERGY 😭" 
    }
  }[tier] || { rarity: "npc", title: "BOT", challenge: "😭" };
}

function getFallbackRoast(tier, subject, language) {
  const h = language === 'hindi';
  
  const roasts = {
    legendary: h 
      ? [
          `Bhai "${subject}" mein talent hai bc 👑 Papa ko thoda time do, proud honge ⚡`,
          `"${subject}" skills solid hain yaar 👑 Bas consistency seekh le chutiye 💀`
        ]
      : [
          `"${subject}" got talent bc 👑 Give dad time, he'll be proud ⚡`,
          `"${subject}" skills solid bc 👑 Just learn consistency chutiye 💀`
        ],
    
    epic: h
      ? [
          `"${subject}" yaar bahut paas hai bc ⚡ Bas ek final push chahiye 💀`,
          `Bhai "${subject}" almost kar liya bc ⚡ Consistency missing hai 😭`
        ]
      : [
          `"${subject}" so close bc ⚡ Need that final push 💀`,
          `"${subject}" almost there bc ⚡ Missing consistency 😭`
        ],
    
    mid: h
      ? [
          `"${subject}" IG pe photo king bc 🔥 LinkedIn khali pada hai 💀`,
          `Bhai "${subject}" crypto expert bc 🔥 Maggi afford nahi hoti 😭`,
          `"${subject}" reels se seekha sab bc 🔥 Apply kuch nahi kiya 💀`
        ]
      : [
          `"${subject}" IG photo king bc 🔥 LinkedIn is empty 💀`,
          `"${subject}" crypto expert bc 🔥 Can't afford Maggi 😭`,
          `"${subject}" learned from reels bc 🔥 Applied nothing 💀`
        ],
    
    noob: h
      ? [
          `"${subject}" startup idea hai bc 💀 Execution sofa pe pada hai 😭`,
          `Yaar "${subject}" gym member bc 💀 Gaya sirf 2 baar 😭`,
          `"${subject}" LinkedIn expert bc 💀 Job abhi tak nahi mili 😭`
        ]
      : [
          `"${subject}" has startup idea bc 💀 Execution on sofa 😭`,
          `"${subject}" gym member bc 💀 Went only twice 😭`,
          `"${subject}" LinkedIn expert bc 💀 Still jobless 😭`
        ],
    
    npc: h
      ? [
          `"${subject}" background mein khada hai bc 💀 Dialogue bhi nahi mila 😭`,
          `Bhai "${subject}" NPC energy hai pure bc 💀 Bas exist karta hai 😭`,
          `"${subject}" decoration hai bc 💀 Koi kaam nahi iska 😭`
        ]
      : [
          `"${subject}" background character bc 💀 No dialogue given 😭`,
          `"${subject}" pure NPC energy bc 💀 Just exists 😭`,
          `"${subject}" decoration piece bc 💀 No purpose 😭`
        ]
  };
  
  const tierRoasts = roasts[tier] || roasts.npc;
  return tierRoasts[Math.floor(Math.random() * tierRoasts.length)];
      }
