// /pages/api/generate-aura.js

import { OpenAI } from "openai";

// ============================================
// AI PROVIDERS - ORDERED BY PRIORITY
// ============================================
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

// ============================================
// MAIN HANDLER
// ============================================
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

  try {
    result = await generateRoastWithFallbacks(name, subject, mood, tier, finalScore, roastLanguage, hasName, hasSubject, hasMood);
    
    if (!result?.roast || result.roast.length < 30) {
      result = { 
        roast: getFallbackRoast(tier, subject || name || 'this', roastLanguage), 
        subject_insight: "Facts.", 
        isPublicFigure: false, 
        publicFigureStatus: 'none' 
      };
    }
  } catch (error) {
    console.log("All AI failed:", error.message);
    result = { 
      roast: getFallbackRoast(tier, subject || name || 'this', roastLanguage), 
      subject_insight: "Truth.", 
      isPublicFigure: false, 
      publicFigureStatus: 'none' 
    };
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
// TRY ALL PROVIDERS UNTIL ONE WORKS
// ============================================
async function generateRoastWithFallbacks(name, subject, mood, tier, finalScore, language, hasName, hasSubject, hasMood) {
  
  for (let i = 0; i < AI_PROVIDERS.length; i++) {
    const provider = AI_PROVIDERS[i];
    const token = process.env[provider.tokenEnv];
    
    if (!token) {
      console.log(`⏭️ Skipping ${provider.name}: No token`);
      continue;
    }

    try {
      console.log(`🔄 Trying ${provider.name}...`);
      
      const result = await callAI(
        provider.baseURL,
        token,
        provider.model,
        name, subject, mood, tier, finalScore, language, hasName, hasSubject, hasMood
      );
      
      if (result?.roast && result.roast.length > 30) {
        console.log(`✅ ${provider.name} SUCCESS`);
        return result;
      }
      
    } catch (error) {
      console.log(`❌ ${provider.name} FAILED: ${error.message}`);
      continue;
    }
  }

  console.log("💀 All providers failed, using fallback");
  return null;
}

// ============================================
// AI CALLER
// ============================================
async function callAI(baseURL, token, model, name, subject, mood, tier, finalScore, language, hasName, hasSubject, hasMood) {
  const client = new OpenAI({
    baseURL: baseURL,
    apiKey: token,
  });

  const isHindi = language === 'hindi';
  const targetName = hasName ? name.trim() : (hasSubject ? subject.trim() : 'bro');

  const systemPrompt = `You're a savage roast comedian. Smart roasts, natural language.

## GOLDEN RULES:

1. Find ONE truth about the person and attack that
2. Observe don't insult: "You're the type who..." not just "You suck"
3. Write 3-4 lines (40-70 words)
4. Bad words flow NATURALLY anywhere - not just at end

## BAD WORDS USAGE:

WRONG ❌: "You're boring. You suck bc" (only at end)
WRONG ❌: "Bc mc chutiya saale" (only bad words)
RIGHT ✅: "Bhai what the fuck is this career? Tu itna irrelevant hai ki bc koi dhundh nahi pata. Log tujhe ignore karte hai damn, sad life 💀"

Bad words = 2-4 total, spread naturally like real friends talk.

${isHindi ? `
## HINDI STYLE:

Use anywhere naturally: bc, mc, chutiya, saala, damn, fuck, shit

EXAMPLES:

"Abe saale Bantai ke itne beefs hai ki butcher shop khol le 💀 Independent rapper hai bc kyunki koi sign nahi karna chahta. Teri rap sunke damn lagta hai beats ne bhi resign de diya, torture hai ye 🔥"

"Bhai what the fuck is this content? 💀 Tu influencer hai ya unemployment ka poster? Sirf teri mummy follow karti hai bc wo bhi majboori mein. Followers se zyada cockroach hai mere ghar mein saale 😭"

"Abe chutiya tu woh type hai jisko log group mein add toh karte hai but mute kar dete hai 💀 Tera phone damn sirf OTP ke liye bajta hai. Itna dry hai tu bc ki Sahara bhi ro de 🔥"

"Yaar tu itna forgettable hai ki bc tera naam likhte likhte bhool gaya 💀 God ne tujhe banate waqt alt+tab kar diya damn. Existence hai teri but kisi ko farak nahi padta saale 😭"
` : `
## ENGLISH STYLE:

Use anywhere naturally: damn, fuck, shit, dumbass, stupid, trash, bro, yaar

EXAMPLES:

"Bro what the fuck is Bantai's career at this point? 💀 Has so many damn beefs he should open a meat shop. Independent rapper because nobody wants to sign this dude, even autotune said fuck this 🔥"

"Who the hell told you you're an influencer? 💀 Only your mom follows you bro and she mutes your damn stories. Your content is so trash that watching paint dry is better entertainment shit 😭"

"Dude you're the type of guy people add to groups but immediately fucking mute 💀 Your phone only rings for OTPs damn, real friends are just a dream. So dry that deserts feel bad for your boring ass 🔥"

"Bro you're so damn forgettable I forgot your name while typing this shit 💀 God was making you and got distracted, hit alt+tab. You exist but nobody gives a fuck honestly 😭"
`}

## POWER LINES (use sometimes):

${isHindi ? `
- "Tu bad hai? Main tera baap hoon"
- "Meri ek line teri career se heavy hai bc"
- "Teri music sunne se behtar main chup rahun damn"
` : `
- "You think you're bad? I'm your dad"
- "My one line hits harder than your whole damn career"
- "I'd rather sit in silence than listen to your shit"
`}

## TIER: ${tier.toUpperCase()}
${tier === 'legendary' ? 'Backhanded respect - talented but find the flaw' : ''}
${tier === 'epic' ? 'Almost great - so close yet so far' : ''}
${tier === 'mid' ? 'Average nobody - make them feel invisible' : ''}
${tier === 'noob' ? 'Below average - stack their failures' : ''}
${tier === 'npc' ? 'Irrelevant - question their existence' : ''}

## FORMAT:
- 40-70 words (3-4 lines)
- Bad words spread naturally (2-4 total)
- Smart roast + savage
- 1-2 emojis (💀 😭 🔥)

## OUTPUT (JSON only):
{"roast": "3-4 line natural roast", "subject_insight": "truth found", "isPublicFigure": true/false, "publicFigureStatus": "peak/stable/falling/none"}`;

  const userContent = `Roast: ${targetName}${hasSubject && hasName ? ` (${subject.trim()})` : ''}${hasMood ? ` | Mood: ${mood}` : ''}

3-4 lines. Bad words spread naturally, not just at end. Smart + savage.
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

// ============================================
// HELPERS
// ============================================
function cleanRoast(roast) {
  let cleaned = roast;
  [/^oh (bro|wow|damn|well|so)/i, /^well well/i, /^okay so/i, /^let me/i, /^alright/i].forEach(p => {
    cleaned = cleaned.replace(p, '');
  });
  const words = cleaned.trim().split(/\s+/);
  if (words.length > 85) {
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
      ? [
          `"${subject}" damn bhai tu talented hai 💀 But sun meri ek line teri puri career se heavy hai bc. Respect tujhe but ego kam kar thoda, legendary banne mein abhi time hai 🔥`,
          `"${subject}" saale talent toh hai tujhme 💀 But what the fuck itna attitude kyun? Meri ek line mein zyada weight hai bc teri discography se. Almost king hai tu, almost 🔥`
        ]
      : [
          `"${subject}" damn bro you're talented 💀 But listen my one line hits harder than your whole fucking career. Respect to you but lower that ego, not legendary yet shit 🔥`,
          `"${subject}" dude you got talent no doubt 💀 But what the fuck is with the attitude? My one damn line weighs more than your discography. Almost king, almost 🔥`
        ],
    epic: h
      ? [
          `"${subject}" saale tu almost kuch tha yaar 💀 Itna paas aake what the fuck ruk gaya? Potential hai but bc execution zero. Almost mein hi marr jayega tu damn 😭`,
          `"${subject}" bhai dekh talent hai tujhme 💀 But damn har baar finish line pe trip ho jaata hai. Itna close aake fuck up karna bhi skill hai bc 😭`
        ]
      : [
          `"${subject}" dude you were almost something 💀 Got so damn close then stopped, what the fuck happened? Got potential but zero execution. Die in almost zone shit 😭`,
          `"${subject}" bro look you got talent 💀 But damn you trip at the finish line every time. Getting so close and fucking up is also a skill honestly 😭`
        ],
    mid: h
      ? [
          `"${subject}" bhai what the fuck is this existence? 💀 Tu woh type hai jisko log 'haan bro' bolke ignore karte hai bc. Phone sirf OTP ke liye bajta hai damn. Itna invisible ki Google bhi dhundh nahi pata saale 😭`,
          `"${subject}" abe yaar teri personality itni dry hai damn 💀 Rajasthan bhi jealous hai bc. Tu exist karta hai but kisi ko farak nahi padta. Background mein blur face hai tu saale 🔥`
        ]
      : [
          `"${subject}" bro what the fuck is this existence? 💀 You're the type people say 'yeah bro' to and completely damn forget. Phone only rings for OTPs. So invisible even Google can't find you shit 😭`,
          `"${subject}" dude your personality is so damn dry 💀 Deserts are jealous of you honestly. You exist but nobody gives a fuck bro. Just a blur face in the background shit 🔥`
        ],
    noob: h
      ? [
          `"${subject}" abe chutiya tu itna forgettable hai 💀 Bc tera naam likhte likhte bhool gaya damn. Log tujhse baat sirf isliye karte hai kyunki group mein hai. Nikal de kisi ko yaad nahi aayega saale 😭`,
          `"${subject}" bhai tera potential toh hai shayad 💀 Bas what the fuck kisi ne dekha nahi bc. Tu woh loading screen hai damn jo kabhi complete nahi hoti. Buffer pe atka hai permanently saale 🔥`
        ]
      : [
          `"${subject}" dude you're so damn forgettable 💀 I forgot your fucking name while typing this shit. People talk to you only because you're in the group. Leave and nobody notices bro 😭`,
          `"${subject}" bro you got potential maybe 💀 But what the fuck nobody has seen it damn. You're that loading screen that never completes. Stuck on buffer permanently shit 🔥`
        ],
    npc: h
      ? [
          `"${subject}" bc tu exist bhi karta hai? 💀 Google ko bhi nahi pata saale. Tu woh NPC hai damn jisko skip karta hoon. Teri life loading screen hai jo buffer pe atki hai bc, koi farak nahi padta 😭`,
          `"${subject}" abe what the fuck tujhe dekhne se behtar wall ghoorun 💀 Kam se kam wo reply nahi karti bc. Tera existence damn literally waste of space hai. Oxygen bhi barbaad ho rahi tujhpe saale 🔥`
        ]
      : [
          `"${subject}" bro do you even fucking exist? 💀 Google doesn't know either damn. You're that NPC whose dialogue I always skip. Your life is a loading screen stuck on buffer shit, nobody cares 😭`,
          `"${subject}" dude what the fuck I'd rather stare at a wall 💀 At least it doesn't give boring replies like you damn. Your existence is literally a waste of space bro. Even oxygen is wasted on you shit 🔥`
        ]
  };
  
  const tierRoasts = roasts[tier] || roasts.npc;
  return tierRoasts[Math.floor(Math.random() * tierRoasts.length)];
      }
