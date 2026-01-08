// /pages/api/generate-aura.js

import { OpenAI } from "openai";

// ============================================
// AI MODELS CONFIG
// ============================================
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
      result = { roast: getFallbackRoast(tier, subject || name || 'this', roastLanguage), subject_insight: "Finished.", isPublicFigure: false, publicFigureStatus: 'none' };
    }
  } catch (error) {
    console.log("Error:", error.message);
    result = { roast: getFallbackRoast(tier, subject || name || 'this', roastLanguage), subject_insight: "Done.", isPublicFigure: false, publicFigureStatus: 'none' };
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
// MAIN ROAST GENERATOR WITH FALLBACK
// ============================================
async function generateRoast(token, name, subject, mood, tier, finalScore, language, hasName, hasSubject, hasMood) {
  
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

  return null;
}

// ============================================
// AI CALLER - DOMINANT POWERFUL ROASTS
// ============================================
async function callAI(token, model, name, subject, mood, tier, finalScore, language, hasName, hasSubject, hasMood) {
  const client = new OpenAI({
    baseURL: "https://router.huggingface.co/v1",
    apiKey: token,
  });

  const isHindi = language === 'hindi';
  const targetName = hasName ? name.trim() : (hasSubject ? subject.trim() : 'bro');

  const systemPrompt = `You are the most SAVAGE roaster. You don't just roast - you DESTROY. You are SUPERIOR. The target is BELOW you. Make them feel small.

## YOUR PERSONALITY:
- You are DOMINANT, not friendly
- You look DOWN on the target
- You are the KING, they are nothing
- Your words HURT and DESTROY
- You make them question their existence

## ROAST TECHNIQUES:

### 1. POWER STATEMENTS (I am superior):
${isHindi ? `
- "Tu bad hai? Main tera baap hoon"
- "Tu star hai? Main tera asmaan hoon"
- "Tu number 1? Bhai tu list mein bhi nahi hai"
- "Meri ek line teri puri career se heavy hai"
` : `
- "You think you're bad? I'm your dad"
- "You think you're a star? I'm your whole sky"
- "You're number 1? Bro you're not even on the list"
- "My one line hits harder than your whole career"
`}

### 2. PREFERENCE ROASTS (I'd rather X than Y):
${isHindi ? `
- "Teri music sunne se behtar hai main silence enjoy karun"
- "Tujhe dekhne se acha hai main andha ho jaaun"
- "Tere saath time spend karne se acha hai main bore hoke mar jaaun"
- "Teri movie dekhne se behtar hai main wall ko ghoorun"
` : `
- "I'd rather listen to silence than your music"
- "I'd rather go blind than see your face"
- "I'd rather die of boredom than spend time with you"
- "I'd rather stare at a wall than watch your content"
`}

### 3. COMPARISON DESTRUCTION:
${isHindi ? `
- "Tu rapper hai? Meri khaasi bhi tujhse better flow karti hai"
- "Tu actor hai? Mera furniture tera se zyada expressions deta hai"
- "Tu influencer hai? Meri shadow tera se zyada influence karti hai"
` : `
- "You're a rapper? My cough has better flow than you"
- "You're an actor? My furniture has more expressions"
- "You're an influencer? My shadow has more influence"
`}

### 4. EXISTENCE DENIAL:
${isHindi ? `
- "Tu exist karta hai ye baat tujhe bata dun? Google ko bhi nahi pata"
- "Teri relevance itni kam hai ki cancel bhi nahi ho sakta tu"
- "Tu itna irrelevant hai ki hate bhi nahi milta tujhe"
` : `
- "You exist? Should I tell you? Even Google doesn't know"
- "You're so irrelevant you can't even get cancelled"
- "You're so small that you don't even get hate"
`}

### 5. CAREER/TALENT DESTRUCTION:
${isHindi ? `
- "Tera career toh woh hai jo launch hone se pehle crash ho gaya"
- "Talent? Bhai tune galat line mein spelling mistake ki hai"
- "Tu retire ho ja, kisi ko pata bhi nahi chalega"
` : `
- "Your career crashed before it even launched"
- "Talent? Bro you misspelled 'failure'"
- "Retire today, nobody will even notice"
`}

## CELEBRITY SPECIFIC ROASTS:

### EMIWAY BANTAI:
${isHindi ? `
- "Bantai music sunne se acha main deaf ho jaaun, kam se kam sukoon toh milega"
- "Tera rap sunke lagta hai lyrics generator bhi cringe karta hoga"
- "Tu independent hai kyunki koi sign nahi karna chahta tujhe bc"
` : `
- "I'd rather go deaf than listen to Bantai's music, at least I'll have peace"
- "Your rap makes me think even the lyrics generator cringes"
- "You're independent because nobody wants to sign you"
`}

### YOUTUBERS:
${isHindi ? `
- "Tera content dekhne se behtar hai main apna time waste karun kuch aur karke"
- "Tu creator hai? Bhai tu toh views ka bhikari hai"
- "Tera subscriber count fake lagta hai, real log tujhe nahi dekhte"
` : `
- "I'd rather waste my time doing nothing than watch your content"
- "You're a creator? Bro you're a beggar for views"
- "Your subscriber count looks fake, real people don't watch you"
`}

## RULES:
- 30-50 words (2-3 powerful sentences)
- Sound DOMINANT and SUPERIOR
- Make target feel SMALL and WORTHLESS
- Use rhymes when possible
- Bad words for IMPACT: bc, mc, damn, fuck (1-2 max)
- NO parent attacks, NO death wishes
- End with 💀 or 🔥
- Be BRUTAL but CREATIVE

## NEVER:
- Sound friendly
- Give compliments
- Start with "Oh bro" or "Oh wow"
- Be generic
- Attack family/parents

## TIER: ${tier.toUpperCase()}
${tier === 'legendary' ? 'They are good BUT you are still better. Backhanded respect.' : ''}
${tier === 'epic' ? 'They are almost good. Remind them they are NOT there yet.' : ''}
${tier === 'mid' ? 'They are average. Make them feel like nobody.' : ''}
${tier === 'noob' ? 'They are trash. Full destruction mode.' : ''}
${tier === 'npc' ? 'They dont exist. Question their existence.' : ''}

## OUTPUT (JSON only):
{"roast": "dominant 30-50 word roast", "subject_insight": "short killer line", "isPublicFigure": true/false, "publicFigureStatus": "peak/stable/falling/none"}`;

  const userContent = `Destroy: ${targetName}${hasSubject && hasName ? ` (${subject.trim()})` : ''}${hasMood ? ` | Mood: ${mood}` : ''}

Make them feel SMALL. You are SUPERIOR. DESTROY their confidence.
${isHindi ? 'Hindi/Hinglish' : 'Simple English'}.

Be BRUTAL. Be DOMINANT. No mercy. JSON only.`;

  const completion = await client.chat.completions.create({
    model: model,
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userContent }
    ],
    temperature: 1.1,
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
    return { roast: cleanRoast(content.trim()), subject_insight: "Finished.", isPublicFigure: hasName, publicFigureStatus: 'stable' };
  } catch {
    return { roast: cleanRoast(content.trim()), subject_insight: "Done.", isPublicFigure: hasName, publicFigureStatus: 'stable' };
  }
}

// ============================================
// CLEAN ROAST
// ============================================
function cleanRoast(roast) {
  let cleaned = roast;
  
  const boringStarts = [
    /^oh (bro|wow|damn|well|so)/i,
    /^well well/i,
    /^so you think/i,
    /^damn bro/i,
    /^okay so/i,
    /^let me/i,
  ];
  
  boringStarts.forEach(p => {
    cleaned = cleaned.replace(p, '');
  });
  
  const words = cleaned.trim().split(/\s+/);
  if (words.length > 60) {
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
    legendary: { rarity: "legendary", title: "LEGENDARY", challenge: h ? "TU ALAG HAI. RESPECT. 👑" : "YOU'RE DIFFERENT. RESPECT. 👑" },
    epic: { rarity: "epic", title: "EPIC", challenge: h ? "ALMOST KUCH THA TU ⚡" : "ALMOST SOMETHING ⚡" },
    mid: { rarity: "mid", title: "MID", challenge: h ? "NOBODY CARES 🔥" : "NOBODY CARES 🔥" },
    noob: { rarity: "noob", title: "NOOB", challenge: h ? "TU HAI KON? 💀" : "WHO ARE YOU? 💀" },
    npc: { rarity: "npc", title: "NPC", challenge: h ? "EXIST BHI KARTA HAI? 😭" : "DO YOU EXIST? 😭" }
  };
  return data[tier] || data.npc;
}

function getFallbackRoast(tier, subject, language) {
  const h = language === 'hindi';
  
  const roasts = {
    legendary: h 
      ? [
          `"${subject}" tu acha hai, but main tera baap hoon 💀 Seekh aur aa phir baat karte hai bc`,
          `Respect "${subject}" tujhe, but meri ek line teri puri career se heavy hai 🔥`,
        ]
      : [
          `"${subject}" you're good, but I'm your dad 💀 Learn more and then we'll talk`,
          `Respect to "${subject}", but my one line hits harder than your whole career 🔥`,
        ],
    epic: h
      ? [
          `"${subject}" tu almost kuch tha 💀 Almost mein hi reh gaya, final step pe haar gaya bc`,
          `"${subject}" itni mehnat ki tune, result zero hai 🔥 Sad life bro`,
        ]
      : [
          `"${subject}" you were almost something 💀 Almost doesn't count, you failed at the last step`,
          `"${subject}" worked so hard, result is still zero 🔥 Tragic`,
        ],
    mid: h
      ? [
          `"${subject}" tu hai kaun? Google pe bhi result nahi aata tera 💀 Irrelevant bc`,
          `"${subject}" teri relevance itni kam hai ki hate bhi nahi milta tujhe 🔥 Nobody cares`,
          `Mujhe "${subject}" ki music sunne se behtar lagta hai silence enjoy karna 💀 At least sukoon milta hai`,
        ]
      : [
          `"${subject}" who are you? Even Google has no results 💀 Irrelevant`,
          `"${subject}" you're so irrelevant you don't even get hate 🔥 Nobody cares`,
          `I'd rather enjoy silence than listen to "${subject}" 💀 At least there's peace`,
        ],
    noob: h
      ? [
          `"${subject}" tu exist karta hai? Mujhe toh pata nahi tha 💀 Aur kisi ko bhi nahi pata bc`,
          `"${subject}" tera career woh hai jo launch hone se pehle crash ho gaya 🔥 RIP`,
          `"${subject}" tu retire ho ja aaj, kisi ko farak nahi padega 💀 Test karle`,
        ]
      : [
          `"${subject}" you exist? I didn't know 💀 And neither does anyone else`,
          `"${subject}" your career crashed before it even launched 🔥 RIP`,
          `"${subject}" retire today, nobody will notice 💀 Test it`,
        ],
    npc: h
      ? [
          `"${subject}" tu toh woh NPC hai jisko main skip karta hoon 💀 Waste of time bc`,
          `"${subject}" tujhe dekhne se acha main andha ho jaaun 🔥 Kam se kam sukoon milega`,
          `"${subject}" teri puri existence ek loading screen hai jo kabhi complete nahi hoti 💀`,
        ]
      : [
          `"${subject}" you're that NPC I always skip 💀 Waste of time`,
          `I'd rather go blind than look at "${subject}" 🔥 At least there's peace`,
          `"${subject}" your entire existence is a loading screen that never completes 💀`,
        ]
  };
  
  const tierRoasts = roasts[tier] || roasts.npc;
  return tierRoasts[Math.floor(Math.random() * tierRoasts.length)];
      }
