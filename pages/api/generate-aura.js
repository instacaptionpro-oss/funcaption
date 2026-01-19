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
        subject_insight: "L + Ratio", 
        isPublicFigure: false, 
        publicFigureStatus: 'none' 
      };
    }
  } catch (error) {
    console.log("All AI failed:", error.message);
    result = { 
      roast: getFallbackRoast(tier, subject || name || 'this', roastLanguage), 
      subject_insight: "NPC Energy", 
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
      console.log(`⚠️ ${provider.name}: No API key found`);
      continue;
    }

    try {
      console.log(`🔄 Trying ${provider.name}...`);
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

  const systemPrompt = `You are a BRUTAL Indian standup comedian. Mix of Samay Raina + Carryminati + Indian meme culture.

## 🎯 ONE GOAL: MAKE THEM LAUGH OUT LOUD 😂

NOT just roast. FUNNY + CREATIVE + MEMORABLE roast.

## 🔥 ROAST RULES (STRICT):

### LENGTH: 2-3 LINES ONLY
- Line 1: Setup/Observation
- Line 2: Brutal punchline
- Line 3 (optional): Emoji finisher

### HUMOR FORMULA:

**SETUP + TWIST = LAUGH**

Good example:
"${targetName}" LinkedIn pe entrepreneur hai bc 💀
Reality mein Swiggy discount code dhundhta rehta mc 😭

Perfect example (1 line banger):
"${targetName}" ko lagta hai IG story views se naukri mil jayegi bc 💀

Bad example (TOO LONG):
"This person claims to be successful but actually they spend all day watching motivational videos..."
❌ BORING, NOT FUNNY

## 🎭 COMEDY TECHNIQUES:

1. **CONTRAST**: What they show vs reality
   "Gym selfie expert hai bc but protein afford nahi 💀"

2. **EXAGGERATION**: Make it absurd
   "Bhai teri LinkedIn profile itni jhoothi hai NASA doubt mein pad gaya bc 🚀"

3. **RELATABLE STEREOTYPES**: Indian culture
   "LinkedIn thought leader, ghar pe wifi chor chutiye 😭"

4. **UNEXPECTED TWIST**: Normal → Brutal
   "Career goals bade hain bc but Excel nahi aata mc 💀"

## 📝 FORMATS (Pick one):

**Format A: Observation + Reality**
"[Target] does X but actually [brutal truth] bc/mc 💀"

**Format B: Comparison**
"[Target] thinks they're X, reality Y hai chutiye 😭"

**Format C: Direct Hit**
"Bhai [brutal observation] bc, [punchline] mc 💀"

## 🚫 DON'T:
❌ Long paragraphs
❌ Boring observations
❌ Generic insults
❌ Explanations

## ✅ DO:
✅ Short setup
✅ Brutal punchline
✅ MUST be funny
✅ Use: bc, mc, chutiya, gaandu, laude
✅ End with: 💀 😭 🔥 😂

## 🎪 MULTI-ANGLE ROASTING:

Combine 2 topics:
- Social media (IG flex, LinkedIn lies)
- Career (jobless, fake startup)
- Gym (no gains, skip leg day)
- Money (broke but flexing)
- Dating (no rizz)
- Intelligence (NPC energy)

Example combo:
"Gym + Money": "Supplement post karta bc but Maggi afford nahi 💀"

## FAMILY ROASTS (Respectful):
✅ "Papa disappointed hain bc"
✅ "Mummy proud nahi hai"
❌ NEVER: "Teri maa ki..." (NO sexual/vulgar about family)

## TIER TONE:
${tier === 'legendary' ? 'Respectful: "Talent hai but papa ko vishwas nahi bc 👑"' : ''}
${tier === 'epic' ? 'Almost: "Paas hai but consistency missing mc ⚡"' : ''}
${tier === 'mid' ? 'Average: "LinkedIn expert, real mein jobless bc 🔥"' : ''}
${tier === 'noob' ? 'Brutal: "Idea hai but execution zero mc 💀"' : ''}
${tier === 'npc' ? 'Destruction: "Background character energy bc 😭"' : ''}

## LANGUAGE:
${isHindi ? 'HINGLISH: 70% Hindi + 30% English + bc/mc gaali' : 'ENGLISH + Hindi gaali: "Bro you're unemployed bc 💀"'}

## OUTPUT (JSON ONLY):
{"roast": "2-3 line funny brutal roast", "subject_insight": "one word"}

ROAST "${targetName}" NOW (Mood: ${mood || 'savage'}):`;

  const userContent = `Create a HILARIOUS 2-3 line roast for: ${targetName}${hasSubject && hasName ? ` (${subject.trim()})` : ''}

Make it FUNNY and CREATIVE. ${isHindi ? 'Hinglish + bc/mc.' : 'English + Hindi gaali.'}
JSON only.`;

  const completion = await client.chat.completions.create({
    model: model,
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userContent }
    ],
    temperature: 1.3,
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
  
  [
    /^oh (bro|wow|damn|well|so)/i, 
    /^well well/i, 
    /^okay so/i, 
    /^let me/i, 
    /^alright/i, 
    /^here's/i,
    /^so basically/i,
    /^listen/i
  ].forEach(p => {
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

function enforceRarityProbabilities(tier, score, isPublicFigure, publicFigureStatus) {
  const r = Math.random() * 100;
  
  if (isPublicFigure && publicFigureStatus === 'falling') {
    return r < 50 ? { tier: 'mid', score: getScoreForTier('mid') } : 
           r < 80 ? { tier: 'noob', score: getScoreForTier('noob') } : 
                    { tier: 'npc', score: getScoreForTier('npc') };
  }
  
  if (tier === 'legendary' && r > 10) {
    return r > 70 ? { tier: 'epic', score: getScoreForTier('epic') } : 
           r > 40 ? { tier: 'mid', score: getScoreForTier('mid') } : 
                    { tier: 'noob', score: getScoreForTier('noob') };
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
  
  if (len >= 30) score += 25; 
  else if (len >= 15) score += 15; 
  else if (len >= 5) score += 8;
  
  if ((name || '').length > 2) score += 10;
  if (/\s/.test(name) && (name || '').length > 5) score += 15;
  
  if (['test', 'testing', 'asdf', 'lol', 'hi', 'hello', 'ok'].includes((subject || '').toLowerCase()) || len < 3) {
    score -= 40;
  }
  
  return Math.max(0, Math.min(100, score));
}

function getTierCap(w) {
  return w >= 80 ? 'legendary' : 
         w >= 60 ? 'epic' : 
         w >= 40 ? 'mid' : 
         w >= 20 ? 'noob' : 'npc';
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
  const scores = { 
    legendary: [95, 6], 
    epic: [80, 15], 
    mid: [50, 30], 
    noob: [25, 25], 
    npc: [0, 25] 
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
          `"${subject}" talented hai bhai bc 👑 Papa ko time do, proud honge mc ⚡`,
          `Bhai "${subject}" skills solid hain bc 👑 Consistency seekh le bas chutiye 💀`
        ]
      : [
          `"${subject}" got talent bc 👑 Give dad time, he'll be proud mc ⚡`,
          `"${subject}" skills are solid bc 👑 Just learn consistency chutiye 💀`
        ],
    
    epic: h
      ? [
          `"${subject}" almost kar liya bc ⚡ Bas last push chaiye chutiye 💀`,
          `Abe "${subject}" paas hai bc ⚡ Consistency missing hai gaandu 😭`
        ]
      : [
          `"${subject}" almost made it bc ⚡ Need that final push chutiye 💀`,
          `"${subject}" so close bc ⚡ Consistency missing gaandu 😭`
        ],
    
    mid: h
      ? [
          `"${subject}" IG pe selfie king bc 🔥 LinkedIn blank hai mc 💀`,
          `Abe "${subject}" crypto expert but Maggi afford nahi bc 🔥 Reality check chutiye 😭`,
          `"${subject}" reels dekh ke sikh gaya bc 🔥 Apply kuch nahi kiya mc 💀`
        ]
      : [
          `"${subject}" IG selfie king bc 🔥 LinkedIn is blank mc 💀`,
          `"${subject}" crypto expert but can't afford Maggi bc 🔥 Reality check chutiye 😭`,
          `"${subject}" learned from reels bc 🔥 Applied nothing mc 💀`
        ],
    
    noob: h
      ? [
          `"${subject}" startup idea hai bc 💀 Execution sofa pe pada hai mc 😭`,
          `Abe "${subject}" gym member bc 💀 Gaya toh 2 baar chutiye 😭`,
          `"${subject}" LinkedIn expert bc 💀 Job nahi mili abhi tak mc 😭`
        ]
      : [
          `"${subject}" has startup idea bc 💀 Execution still on sofa mc 😭`,
          `"${subject}" gym member bc 💀 Went only twice chutiye 😭`,
          `"${subject}" LinkedIn expert bc 💀 Still jobless mc 😭`
        ],
    
    npc: h
      ? [
          `"${subject}" background character hai bc 💀 Dialogue bhi nahi mila mc 😭`,
          `Abe "${subject}" NPC energy pure hai bc 💀 Exist karta hai bas chutiye 😭`,
          `"${subject}" decoration piece hai bc 💀 Purpose nahi mila mc 😭`
        ]
      : [
          `"${subject}" is background character bc 💀 Didn't even get dialogue mc 😭`,
          `"${subject}" pure NPC energy bc 💀 Just exists chutiye 😭`,
          `"${subject}" decoration piece bc 💀 No purpose found mc 😭`
        ]
  };
  
  const tierRoasts = roasts[tier] || roasts.npc;
  return tierRoasts[Math.floor(Math.random() * tierRoasts.length)];
                                                                                                          }
