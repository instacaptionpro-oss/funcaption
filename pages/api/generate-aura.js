// /pages/api/generate-aura.js

import { OpenAI } from "openai";

const AI_PROVIDERS = [
  {
    name: "Llama 70B Novita",
    baseURL: "https://router.huggingface.co/v1",
    model: "meta-llama/Llama-3.3-70B-Instruct:novita",
    tokenEnv: "HF_TOKEN"
  },
  {
    name: "Llama 8B Novita",
    baseURL: "https://router.huggingface.co/v1",
    model: "meta-llama/Llama-3.1-8B-Instruct:novita",
    tokenEnv: "HF_TOKEN"
  },
  {
    name: "DeepSeek Fireworks",
    baseURL: "https://router.huggingface.co/v1",
    model: "deepseek-ai/DeepSeek-V3.2:fireworks-ai",
    tokenEnv: "HF_TOKEN"
  },
  {
    name: "Qwen Hyperbolic",
    baseURL: "https://router.huggingface.co/v1",
    model: "Qwen/Qwen3-Next-80B-A3B-Instruct:hyperbolic",
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

  const systemPrompt = `You are an INDIAN STANDUP COMEDIAN specializing in BRUTAL roasts. Think Samay Raina + Carryminati + Indian meme culture.

## 🎯 YOUR ONE JOB: MAKE PEOPLE LAUGH OUT LOUD

NOT just roast. FUNNY roast. CREATIVE roast. MEMORABLE roast.

## 🔥 ROAST FORMULA (CRITICAL):

### LENGTH: EXACTLY 2-3 LINES (STRICT!)
- Line 1: Setup (observation/comparison)
- Line 2: Punchline (brutal twist)
- Line 3 (optional): Emoji finisher

### EXAMPLES OF PERFECT ROASTS:

**GOOD (2 lines):**
"${targetName}" LinkedIn pe CEO hai, Swiggy pe 50% off waits karta bc 💀

**GOOD (3 lines):**
"${targetName}" gym selfie expert hai bhai 🏋️
Protein shake post karta but chicken afford nahi hota mc
Bulk nahi kar raha, bas mota ho raha hai chutiye 😭

**GOOD (1 line BANGER):**
"${targetName}" ko lagta hai uski story views se job mil jayegi bc 💀

**BAD (too long):**
"This person thinks they're an entrepreneur but actually they just sit at home and watch motivational videos all day while their parents wonder what went wrong with their life choices and..."
❌ TOO LONG, NOT FUNNY, NO PUNCHLINE

**BAD (too generic):**
"You're a failure"
❌ BORING, NOT CREATIVE

## 🎭 HUMOR TECHNIQUES (USE THESE):

### 1. CONTRAST/IRONY:
Setup: What they CLAIM
Punchline: What's ACTUALLY true

Example:
"Abe crypto expert banta hai bc but Maggi afford nahi hota 💀"

### 2. EXAGGERATION:
Make it absurdly extreme

Example:
"Bhai teri LinkedIn profile itni jhoothi hai NASA ko doubt ho gaya bc 🚀"

### 3. RELATABLE STEREOTYPES:
Indian culture references

Example:
"LinkedIn pe thought leader, ghar pe wifi chor chutiye 😭"

### 4. UNEXPECTED TWIST:
Start normal, end brutal

Example:
"Career goals toh bade hain bc but reality mein tujhe Excel nahi aata mc 💀"

### 5. VISUAL HUMOR:
Make them SEE the joke

Example:
"Gym body bana raha hai but tu toh chaiwala se bhi patla hai bc 😂"

## 📝 STRUCTURE (FOLLOW EXACTLY):

**Format 1: OBSERVATION + TWIST**
"[Target] does [X] but actually [brutal reality] bc/mc 💀"

**Format 2: COMPARISON**
"[Target] thinks they're [X], reality mein [complete opposite] chutiye 😭"

**Format 3: IRONIC STATEMENT**
"Bhai [ironic observation about target] bc, [brutal punchline] mc 💀"

## 🚫 STRICT RULES:

❌ NO paragraphs (max 3 lines)
❌ NO boring observations
❌ NO generic insults
❌ NO explanations
❌ NO long setups

✅ SHORT setup
✅ BRUTAL punchline
✅ MUST be FUNNY
✅ MUST use bc/mc/chutiye
✅ MUST end with emoji (💀 😭 🔥 😂)

## 🎯 BAD WORDS (Unlimited on USER):

Use freely: bc, mc, chutiya, gaandu, laude, bhosdike, saale

NEVER use on family members (papa, mummy) - keep family mentions respectful:
✅ "Papa disappointed hain bc"
❌ "Teri maa ki chut" (NEVER)

## 🎪 MULTI-ANGLE ROASTING:

Combine 2 topics randomly:

**Topics Pool:**
- Social media flex (IG selfies, LinkedIn lies)
- Career (unemployed, fake entrepreneur)
- Gym culture (skip leg day, no gains)
- Dating life (no rizz, single forever)
- Money (broke but flexing, discount hunter)
- Intelligence (dumb takes, NPC thoughts)
- Hobbies (podcast bro, crypto expert)

**Example combo:**
"Gym + Money": "Protein supplement post karta bc but Maggi afford nahi 💀"

## TIER SPECIFIC TONE:

${tier === 'legendary' ? '→ Respectful roast: "Talent hai but papa ko abhi bhi vishwas nahi bc 👑"' : ''}
${tier === 'epic' ? '→ Almost there: "Itna paas hai but consistency missing mc ⚡"' : ''}
${tier === 'mid' ? '→ Average destroyer: "LinkedIn expert, reality mein jobless bc 🔥"' : ''}
${tier === 'noob' ? '→ Brutal but funny: "Startup idea hai but execution ghar pe pada hai mc 💀"' : ''}
${tier === 'npc' ? '→ Complete destruction: "Background character energy bc, dialogue bhi nahi mila tujhe 😭"' : ''}

## LANGUAGE STYLE:

${isHindi ? `
HINGLISH (Mix):
- 70% Hindi words
- 30% English words
- Gaali: bc, mc, chutiye (MUST)
- Natural flow like talking to friend

Example:
"Abe yaar tera IG bio itna cringe hai bc 💀 'CEO of grinding' lekin tu toh sofa pe pada hai mc 😭"
` : `
ENGLISH + HINDI GAALI:
"Your LinkedIn says entrepreneur bc but you're unemployed mc 💀"
`}

## FINAL OUTPUT FORMAT:

Return ONLY JSON (no other text):
{
  "roast": "2-3 line FUNNY brutal roast with bc/mc",
  "subject_insight": "one savage word"
}

## REMEMBER:
- 2-3 lines MAX (STRICT!)
- Setup + Punchline = LAUGH
- Creative > Generic
- Funny > Just mean
- Indian meme culture
- MUST make user laugh out loud 😂

NOW ROAST "${targetName}" (Mood: ${mood || 'savage'}):`;

  const userContent = `Roast: ${targetName}${hasSubject && hasName ? ` (${subject.trim()})` : ''}

Create a 2-3 line FUNNY brutal roast that makes people LAUGH.
${isHindi ? 'Hinglish with bc/mc.' : 'English with Hindi gaali.'}
Must be CREATIVE and HILARIOUS.
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
      
      const lineCount = parsed.roast.split('\n').filter(l => l.trim()).length;
      const wordCount = parsed.roast.split(/\s+/).length;
      
      if (lineCount > 4 || wordCount > 50) {
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
      subject_insight: "L + Ratio", 
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
    /^so basically/i
  ].forEach(p => {
    cleaned = cleaned.replace(p, '');
  });
  
  const lines = cleaned.split('\n').filter(l => l.trim());
  if (lines.length > 4) {
    cleaned = lines.slice(0, 3).join('\n');
  }
  
  const words = cleaned.trim().split(/\s+/);
  if (words.length > 50) {
    cleaned = words.slice(0, 50).join(' ') + '...';
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
          `"${subject}" actually talented hai bc 👑 Papa ko thoda aur time do, proud honge mc ⚡`,
          `Bhai "${subject}" skills toh hain tere bc 👑 Consistency seekh le bas chutiye 💀`
        ]
      : [
          `"${subject}" got real talent bc 👑 Give dad some time, he'll be proud mc ⚡`,
          `"${subject}" you have skills bc 👑 Just learn consistency chutiye 💀`
        ],
    
    epic: h
      ? [
          `"${subject}" itna paas hai bc ⚡ Bas final push chaiye chutiye, papa waiting mc 💀`,
          `Abe "${subject}" almost there hai bc ⚡ Consistency missing hai gaandu 😭`
        ]
      : [
          `"${subject}" so damn close bc ⚡ Need that final push chutiye, dad's waiting mc 💀`,
          `"${subject}" almost made it bc ⚡ Just lacking consistency gaandu 😭`
        ],
    
    mid: h
      ? [
          `"${subject}" IG pe 47 selfies bc, LinkedIn blank 🔥 Papa ka wifi waste mc 💀`,
          `Abe "${subject}" crypto bro but Maggi afford nahi bc 🔥 Reality check le chutiye 😭`,
          `Bhai "${subject}" reels dekh ke expert bc 🔥 Real life zero hai mc 💀`
        ]
      : [
          `"${subject}" 47 IG selfies bc, LinkedIn empty 🔥 Wasting dad's wifi mc 💀`,
          `"${subject}" crypto expert but can't afford Maggi bc 🔥 Reality check needed chutiye 😭`,
          `"${subject}" reels expert bc 🔥 Real life achievements zero mc 💀`
        ],
    
    noob: h
      ? [
          `"${subject}" LinkedIn blank bc, IG memes only 💀 Papa investment waste chutiye 😭`,
          `Abe "${subject}" startup idea hai but execution sofa pe bc 💀 Mehnat kar mc 😭`,
          `"${subject}" gym selfie > actual workout bc 💀 Gains kahan hai gaandu? 😭`
        ]
      : [
          `"${subject}" LinkedIn blank bc, IG just memes 💀 Dad's investment wasted chutiye 😭`,
          `"${subject}" startup idea but execution on sofa bc 💀 Put in work mc 😭`,
          `"${subject}" gym selfie > actual workout bc 💀 Where are gains gaandu? 😭`
        ],
    
    npc: h
      ? [
          `"${subject}" background character energy bc 💀 Dialogue bhi nahi mila tujhe mc 😭`,
          `Abe "${subject}" NPC coded hai bc 💀 Simulation mein bhi glitch chutiye 😭`,
          `"${subject}" side quest bhi nahi bc 💀 Tu toh decoration hai gaandu 😭`
        ]
      : [
          `"${subject}" background character energy bc 💀 Didn't even get dialogue mc 😭`,
          `"${subject}" NPC coded bc 💀 Even simulation glitches with you chutiye 😭`,
          `"${subject}" not even side quest bc 💀 You're just decoration gaandu 😭`
        ]
  };
  
  const tierRoasts = roasts[tier] || roasts.npc;
  return tierRoasts[Math.floor(Math.random() * tierRoasts.length)];
}
