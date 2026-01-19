// /pages/api/generate-aura.js

import { OpenAI } from "openai";

const AI_PROVIDERS = [
  {
    name: "Groq",
    baseURL: "https://router.huggingface.co/v1",
    model: "meta-llama/Llama-3.3-70B-Instruct:groq",
    tokenEnv: "HF_TOKEN"
  },
  {
    name: "Together",
    baseURL: "https://router.huggingface.co/v1",
    model: "meta-llama/Meta-Llama-3-70B-Instruct:together",
    tokenEnv: "HF_TOKEN"
  },
  {
    name: "Hyperbolic",
    baseURL: "https://api.hyperbolic.xyz/v1",
    model: "meta-llama/Llama-3.3-70B-Instruct",
    tokenEnv: "HYPERBOLIC_TOKEN"
  },
  {
    name: "Novita",
    baseURL: "https://router.huggingface.co/v1",
    model: "meta-llama/Meta-Llama-3-70B-Instruct:novita",
    tokenEnv: "HF_TOKEN"
  },
  {
    name: "HuggingFace",
    baseURL: "https://router.huggingface.co/v1",
    model: "meta-llama/Meta-Llama-3-70B-Instruct",
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
        subject_insight: "L + Ratio + No Aura", 
        isPublicFigure: false, 
        publicFigureStatus: 'none' 
      };
    }
  } catch (error) {
    console.log("All AI failed:", error.message);
    result = { 
      roast: getFallbackRoast(tier, subject || name || 'this', roastLanguage), 
      subject_insight: "NPC Energy Detected", 
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
    
    if (!token) continue;

    try {
      console.log(`🔄 Trying ${provider.name}...`);
      const result = await callAI(provider.baseURL, token, provider.model, name, subject, mood, tier, finalScore, language, hasName, hasSubject, hasMood);
      if (result?.roast && result.roast.length >= 20 && result.roast.length <= 200) {
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

  const systemPrompt = `Tu ek brutal Indian roaster hai. Style = Carryminati + Samay Raina + Indian meme culture. FULL SAVAGE MODE.

## 🔥 CORE RULES:

### ROAST THE USER BRUTALLY:
✅ ANY bad words on the USER
✅ Destroy their existence
✅ Mock everything about them
✅ Use bc, mc, chutiya, gaandu, laude, bhosdike, saale, tatti, madarchod, bhenchod
✅ Be SAVAGE, BRUTAL, NO MERCY on the USER

### FAMILY REFERENCES (Respectful but Funny):
✅ "Papa disappointed hain" (fine)
✅ "Mummy proud nahi hai" (fine)
✅ "Family WhatsApp mein muted" (fine)
✅ "Relatives se introduce nahi karte" (fine)
✅ "Papa ka paisa waste" (fine)

❌ NEVER say bad words TO/ABOUT family:
❌ NO "baap ki chut" 
❌ NO "maa ki chut"
❌ NO "baap chod ke gaya"
❌ NO "fatherless"
❌ NO "maa ka bhosda"
❌ NO sexual/vulgar words about parents

**RIGHT WAY:**
"Abe chutiye tu papa ka disappointment hai bc" ✅
(roasting USER, mentioning family respectfully)

**WRONG WAY:**
"Teri maa ki chut" ❌
(bad words ON family - NEVER)

## 🎯 MULTI-ANGLE ROASTING:

Pick 2-3 angles randomly from:

**1. SOCIAL MEDIA CRINGE:**
- IG pe 47 selfies, real life mein kuch nahi
- LinkedIn expert but unemployed
- Fake flexing, rented car wali photo
- Story pe motivational quotes but khud failure
- Reels dekh ke expert ban gaya

**2. CAREER/AMBITION:**
- Entrepreneur bolta hai but ghar pe baitha
- Startup idea hai but execution nahi
- Resume mein jhoot, interview mein pakda gaya
- Job chhod di, "passion follow karunga" bc ab ghar pe hai
- LinkedIn pe CEO, reality mein intern

**3. GYM/APPEARANCE:**
- Gym join kiya 5 baar, gaya 2 baar
- Protein shake post karta hai but chicken afford nahi
- Skip leg day regular
- Gym selfie > actual workout
- Bulk kar raha hai ya mota ho raha hai confusion

**4. DATING/RIZZ:**
- No bitches energy
- DMs mein "hey" bhejta hai, block ho jaata hai
- Sigma male content dekh ke expert
- Crush ko propose kiya, block kar diya
- Dating app pe right swipe, left milta hai

**5. INTELLIGENCE:**
- Dumb takes expert
- Twitter pe gyan, real life mein kuch nahi
- Podcast sunta hai, khud kuch karta nahi
- Books ke summary dekh ke intellectual
- ChatGPT se assignment, khud dumb

**6. HOBBIES/TRENDS:**
- Crypto bro but broke
- NFT trader but scam hogaya
- Podcast listener but kuch apply nahi karta
- Anime dekh ke Japanese seekhne wala
- Finance influencer dekh ke stocks kharid liye, loss mein

**7. PERSONALITY:**
- NPC energy
- Main character banna chahta hai, background mein hai
- Confidence zyada, aukaat kam
- Delusional about skills
- Victim card khelta hai always

**8. FAMILY (Mild Disappointment):**
- Papa disappointed but still supporting
- Mummy relatives ko explain nahi kar paati
- Family WhatsApp pe muted
- Ghar walon ko expectation nahi rahi
- Papa ka investment but zero return

## 📝 ROAST STRUCTURE:

**LENGTH: 20-35 words (2-3 lines MAX)**

**FORMAT:**
Line 1: [Angle 1] + bc/mc
Line 2: [Angle 2] + chutiya/gaandu
Line 3: [Optional: Mild family reference OR emoji punchline]

**EXAMPLES (GOOD):**

LEGENDARY:
"Abe bhai talent toh hai tera bc 👑 Bas consistency naam ki cheez nahi mc. Papa ko abhi bhi vishwas nahi chutiye 💀"
↑ Personality + Career + Family (respectful)

EPIC:
"Gym selfie expert hai tu bc ⚡ Protein afford nahi hota chutiye. LinkedIn pe CEO, Swiggy pe discount code dhundhta mc 😭"
↑ Gym + Social media + Career

MID:
"Bhai 47 reels dekh ke entrepreneur ban gaya bc 🔥 Papa ka wifi waste kar raha gaandu. Real life mein kuch ukhaada nahi mc 💀"
↑ Social media + Career + Family (respectful)

NOOB:
"Abe saale crypto expert banta hai but Maggi afford nahi bc 💀 IG story pe Lambo, reality mein bus pass chutiye 😭"
↑ Hobbies + Fake flexing

NPC:
"Bhai tu background character hai life ka bc 💀 Simulation mein bhi glitch hai tu gaandu. Exist karta hai ya decoration mc? 😭"
↑ Personality + Existence

## 🚫 ABSOLUTE BANS:

❌ Bad words about parents/family members
❌ Sexual content about family
❌ "Fatherless" jokes
❌ "Baap chod ke gaya" type
❌ Death wishes to anyone
❌ Roasts longer than 35 words

## ✅ MUST DO:

✅ Roast USER brutally (unlimited bad words)
✅ Combine 2-3 angles (never single topic)
✅ Indian meme references
✅ Hinglish style${isHindi ? '' : ' with Hindi gaali'}
✅ 2-3 lines maximum
✅ End with 💀 😭 🔥 or similar

## TIER: ${tier.toUpperCase()}
${tier === 'legendary' ? '→ Respectful savage. "Talent hai but papa ko vishwas nahi bc"' : ''}
${tier === 'epic' ? '→ Almost there roast. "Itna paas hai but consistency nahi mc"' : ''}
${tier === 'mid' ? '→ Average destroyer. Multi-angle brutal. "IG expert, real life failure bc"' : ''}
${tier === 'noob' ? '→ Heavy roast. "Crypto bro but broke + gym membership waste mc"' : ''}
${tier === 'npc' ? '→ Complete destruction. "NPC energy + background character + exist hi kyun bc"' : ''}

## OUTPUT (JSON ONLY):
{"roast": "20-35 word brutal multi-angle roast", "subject_insight": "one savage line"}

Remember: 
- Destroy the USER with any language ✅
- Respect family in mentions ✅
- Multi-angle always ✅
- 20-35 words only ✅`;

  const userContent = `Roast: ${targetName}${hasSubject && hasName ? ` (Context: ${subject.trim()})` : ''}${hasMood ? ` | Mood: ${mood}` : ''}

Brutal Indian meme style roast likh. Multi-angle use kar.
Bad words USER pe unlimited, family respectfully mention kar.
20-35 words only. 2-3 lines.
${isHindi ? 'Hinglish with bc mc chutiya.' : 'English with Hindi gaali.'}
JSON only output.`;

  const completion = await client.chat.completions.create({
    model: model,
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userContent }
    ],
    temperature: 1.2,
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
      
      // Validate length
      const wordCount = parsed.roast.split(/\s+/).length;
      if (wordCount < 10 || wordCount > 45) {
        return null; // Reject if too short or too long
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
      subject_insight: "L + Ratio", 
      isPublicFigure: hasName, 
      publicFigureStatus: 'stable' 
    };
  }
}

function cleanRoast(roast) {
  let cleaned = roast;
  
  // Remove AI meta commentary
  [
    /^oh (bro|wow|damn|well|so)/i, 
    /^well well/i, 
    /^okay so/i, 
    /^let me/i, 
    /^alright/i, 
    /^here's/i,
    /^so basically/i
  ].forEach(p => {
    cleaned = cleaned.replace(p, '');
  });
  
  // Limit to roughly 2-3 sentences
  const sentences = cleaned.match(/[^.!?]+[.!?]+/g) || [cleaned];
  if (sentences.length > 3) {
    cleaned = sentences.slice(0, 3).join(' ');
  }
  
  // Hard word limit
  const words = cleaned.trim().split(/\s+/);
  if (words.length > 45) {
    cleaned = words.slice(0, 45).join(' ') + '...';
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
      challenge: h ? "ALMOST THERE ⚡" : "ALMOST KING ⚡" 
    },
    mid: { 
      rarity: "mid", 
      title: "MID", 
      challenge: h ? "AVERAGE BHAI 🔥" : "AVERAGE HUMAN 🔥" 
    },
    noob: { 
      rarity: "noob", 
      title: "NOOB", 
      challenge: h ? "WORK NEEDED 💀" : "NEEDS UPGRADE 💀" 
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
          `Abe "${subject}" respect hai tujhe bc 👑 Talent genuine hai chutiye. Papa ko abhi bhi pura vishwas nahi but tu prove kar raha mc 💀`,
          `"${subject}" skills toh hain tere bc 👑 Consistency aur chaiye gaandu. Papa proud honge ek din mc, keep going chutiye ⚡`
        ]
      : [
          `"${subject}" respect where due bc 👑 Talent is real chutiye. Dad doesn't fully believe yet but you're proving it mc 💀`,
          `"${subject}" you got skills bc 👑 Need more consistency gaandu. Dad will be proud someday mc ⚡`
        ],
    
    epic: h
      ? [
          `"${subject}" bhai itna paas hai tu bc ⚡ Bas last push chaiye chutiye. Gym bhi jaata story bhi daalta but gains kahan gaandu? Papa waiting mc 💀`,
          `Abe "${subject}" LinkedIn pe expert, real life mein almost there bc ⚡ Papa ko lagta hai ab hoga, disappoint mat karna chutiye 😭`
        ]
      : [
          `"${subject}" so close bro bc ⚡ Need that final push chutiye. Gym posts daily but gains missing gaandu? Dad's waiting mc 💀`,
          `"${subject}" LinkedIn expert, reality almost there bc ⚡ Dad thinks you'll make it, don't disappoint chutiye 😭`
        ],
    
    mid: h
      ? [
          `Abe "${subject}" IG pe 47 selfies, LinkedIn pe kuch nahi bc 🔥 Papa ka wifi waste kar raha gaandu. Relatives puche toh mummy topic change karti mc 💀`,
          `"${subject}" crypto expert banta hai but Maggi afford nahi bc 🔥 Gym membership liya 3 mahine pehle, gaya 2 baar chutiye. Papa disappointed mc 😭`,
          `Bhai "${subject}" reels dekh ke expert ban gaya bc 🔥 Real life mein kuch ukhaada nahi gaandu. Family WhatsApp pe muted hai tu mc 💀`
        ]
      : [
          `"${subject}" 47 IG selfies, LinkedIn empty bc 🔥 Wasting dad's wifi gaandu. Mom changes topic when relatives ask mc 💀`,
          `"${subject}" crypto expert but can't afford Maggi bc 🔥 Gym membership 3 months ago, went twice chutiye. Dad disappointed mc 😭`,
          `"${subject}" reels expert now bc 🔥 Real life achievement zero gaandu. Family WhatsApp muted mc 💀`
        ],
    
    noob: h
      ? [
          `"${subject}" bhai tu exist kyun karta hai bc 💀 LinkedIn blank, IG pe memes share karta gaandu. Papa ne invest kiya, return kahan mc? 😭`,
          `Abe "${subject}" startup idea hai but execution nahi bc 💀 Swiggy discount code expert hai chutiye. Mummy relatives ko explain nahi kar paati mc 😭`,
          `"${subject}" gym selfie > actual workout bc 💀 Protein shake post karta but chicken afford nahi gaandu. Papa ka investment waste mc 😭`
        ]
      : [
          `"${subject}" why exist bc 💀 LinkedIn blank, IG just memes gaandu. Dad invested, where's return mc? 😭`,
          `"${subject}" startup idea but no execution bc 💀 Swiggy discount expert chutiye. Mom can't explain you to relatives mc 😭`,
          `"${subject}" gym selfie > workout bc 💀 Protein posts but can't afford chicken gaandu. Dad's money wasted mc 😭`
        ],
    
    npc: h
      ? [
          `"${subject}" background character energy hai teri bc 💀 Main quest skip kar diya life ne gaandu. Papa sochte hain kya galti hui mc? 😭`,
          `Abe "${subject}" NPC coded hai tu bc 💀 Simulation mein bhi glitch chutiye. Exist karta hai ya decoration gaandu? Mummy ko bhi sharam mc 😭`,
          `"${subject}" bhai dialogue bhi nahi hai tere paas bc 💀 Side character bhi nahi, background blur hai tu gaandu. Family tree mein error mc 😭`
        ]
      : [
          `"${subject}" background character energy bc 💀 Life skipped your main quest gaandu. Dad wonders what went wrong mc? 😭`,
          `"${subject}" NPC coded bc 💀 Even simulation glitches chutiye. You exist or decoration gaandu? Mom's embarrassed mc 😭`,
          `"${subject}" no dialogue assigned bc 💀 Not even side character, background blur gaandu. Family tree error mc 😭`
        ]
  };
  
  const tierRoasts = roasts[tier] || roasts.npc;
  return tierRoasts[Math.floor(Math.random() * tierRoasts.length)];
}

module.exports = handler;
