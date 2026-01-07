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

  const hasName = name && name.trim().length > 0;
  const hasSubject = subject && subject.trim().length > 0;
  const hasMood = mood && mood.trim().length > 0;
  const roastLanguage = language || 'english'; // Default English

  const forcedTier = checkForcedExamples(subject || '', mood || '');
  let tier, finalScore;
  
  if (forcedTier) {
    tier = forcedTier;
    finalScore = getScoreForTier(tier);
  } else {
    const worthiness = calculateWorthiness(subject || '', mood || '', name || '');
    const tierCap = getTierCap(worthiness);
    tier = rollForTier(tierCap);
    finalScore = getScoreForTier(tier);
  }

  let result = null;
  let isPublicFigure = false;
  let publicFigureStatus = 'none';

  const HF_TOKEN = process.env.HF_TOKEN;

  if (!HF_TOKEN) {
    return res.status(500).json({ error: "API token not configured" });
  }

  try {
    result = await generateRoastWithLlama(HF_TOKEN, name, subject, mood, tier, finalScore, roastLanguage, hasName, hasSubject, hasMood);
    
    if (result) {
      isPublicFigure = result.isPublicFigure || false;
      publicFigureStatus = result.publicFigureStatus || 'none';
    }

    if (!result || !result.roast || result.roast.length < 20) {
      result = {
        roast: getFallbackRoast(tier, subject || name || 'this', roastLanguage),
        subject_insight: roastLanguage === 'hindi' ? "Waah bhai waah..." : "Well well well...",
        isPublicFigure: false,
        publicFigureStatus: 'none'
      };
    }

  } catch (error) {
    console.log("Error:", error.message);
    result = {
      roast: getFallbackRoast(tier, subject || name || 'this', roastLanguage),
      subject_insight: roastLanguage === 'hindi' ? "Kya baat hai..." : "Interesting...",
      isPublicFigure: false,
      publicFigureStatus: 'none'
    };
  }

  const enforcedData = enforceRarityProbabilities(tier, finalScore, isPublicFigure, publicFigureStatus);
  tier = enforcedData.tier;
  finalScore = enforcedData.score;
  
  const { rarity, title, challenge } = getTierData(tier, roastLanguage);

  return res.status(200).json({
    aura: {
      score: finalScore,
      roast: result.roast.replace(/^["']|["']$/g, '').trim(),
      subjectInsight: result.subject_insight || (roastLanguage === 'hindi' ? "Kya baat hai..." : "Interesting..."),
      rarity,
      title,
      challenge,
      isPublicFigure,
      publicFigureStatus,
      language: roastLanguage,
      name: hasName ? name.trim() : null,
      subject: hasSubject ? subject.trim() : null,
      mood: hasMood ? mood.trim() : null
    }
  });
}

// ============================================
// LLAMA - RESEARCH + ROAST IN ONE
// ============================================
async function generateRoastWithLlama(token, name, subject, mood, tier, finalScore, language, hasName, hasSubject, hasMood) {
  const client = new OpenAI({
    baseURL: "https://router.huggingface.co/v1",
    apiKey: token,
  });

  const isHindi = language === 'hindi';

  const systemPrompt = `You are a savage roast comedian with deep knowledge of celebrities and pop culture.

## YOUR JOB:
${hasName ? `
### STEP 1: DEEP RESEARCH "${name.trim()}"
Think about this person and find:
1. WHO ARE THEY? (YouTuber/Actor/Cricketer/Singer/Influencer)
2. MOST FAMOUS FOR? (Their biggest hit/viral moment/achievement)
   - CarryMinati = YouTube vs TikTok video (got deleted by YouTube - ironic!)
   - Dhoni = Helicopter shot, 2011 World Cup winning six
   - Virat = Aggression, chasing records, 2016 T20 vs Pakistan
   - SRK = DDLJ, arms open pose, romance king
   - Salman = Shirtless scenes, Being Human, bhai persona
3. SIGNATURE THING? (Look/Style/Dialogue/Catchphrase)
   - CarryMinati = Cap, loud screaming, "Toh kaise hai aap log"
   - Dhoni = Captain Cool, calm, long hair earlier
   - Ranveer = Weird colorful clothes, high energy
4. FUNNY/IRONIC THING? (Something to roast - NOT legal issues)
   - CarryMinati = Roaster got roasted by YouTube (video deleted)
   - Dhoni = "Thala for a reason" meme, slow batting
   - Virat = Attitude > Average recently

### STEP 2: USE RESEARCH TO ROAST
` : '### ROAST BASED ON SUBJECT/MOOD'}

## LANGUAGE: ${isHindi ? 'HINDI (Hinglish with Hindi bad words)' : 'ENGLISH (Simple English with English bad words)'}

${isHindi ? `
## HINDI ROAST STYLE:
- Hinglish = Hindi + English mix
- Sarcastic: "Waah bhai" "Kya baat hai" "Amazing yaar" 🙄
- Bad words naturally: bc, mc, chutiya, gadha, bewakoof, wahiyat, damn, fuck
- Example: "Waah Carry bhai YouTube vs TikTok itna hit tha ki YouTube ne khud delete kar diya bc 🙄 Roaster ka roast ho gaya damn. 💀"
` : `
## ENGLISH ROAST STYLE:
- Simple English everyone understands
- Sarcastic: "Oh wow" "Amazing" "So talented" 🙄
- Bad words naturally: fuck, shit, damn, bitch, ass, dumb, pathetic, trash
- Example: "Oh wow Carry bhai made YouTube vs TikTok so viral that YouTube deleted it themselves damn 🙄 The roaster got roasted, ironic as fuck. 💀"
`}

## ROAST FORMULA:
[Sarcastic opener] + [SPECIFIC fact about them] + [Funny punchline with bad word naturally]

## RULES:
- 25-40 words MAX
- 2 sentences only
- Bad words as SEASONING, not main dish
- Reference their SPECIFIC famous thing
- 2 emojis (use 🙄 for sarcasm)
- NO legal issues/court cases/family attacks

## TIER: ${tier.toUpperCase()} (Score: ${finalScore}/100)

${tier === 'legendary' ? 'Backhanded respect - acknowledge achievement but still roast' : ''}
${tier === 'epic' ? 'Good but humble them - find flaw in their famous thing' : ''}
${tier === 'mid' ? 'Roast as overrated/average' : ''}
${tier === 'noob' ? 'Use ironic moment against them hard' : ''}
${tier === 'npc' ? 'Full destruction mode' : ''}

## EXAMPLES:

${isHindi ? `
CARRYMINATI (Hindi):
"Waah Carry bhai YouTube vs TikTok itna viral tha ki YouTube ne delete kar diya bc 🙄 Roaster ka roast - irony ki dukan damn. 💀"

DHONI (Hindi):
"Helicopter shot toh legend hai but match mein itna slow khelta hai ki helicopter land ho jaaye bc 🙄 Captain Cool nahi Slow damn. 💀"

VIRAT (Hindi):
"King Kohli aggression 🔥 hai but runs utne nahi jitna attitude hai bc 🙄 Average < Ego damn. 💀"

MID PERSON (Hindi):
"Bhai tu itna average hai ki Excel sheet bhi bore ho jaaye bc 🙄 Personality 404 damn. 🔥"
` : `
CARRYMINATI (English):
"Oh wow Carry made YouTube vs TikTok so viral that YouTube deleted it damn 🙄 The roaster got roasted - ironic as fuck. 💀"

DHONI (English):
"Helicopter shot is legendary but bro plays so slow the helicopter would land by then damn 🙄 Captain Cool? Captain Slow shit. 💀"

VIRAT (English):
"King Kohli's aggression is 🔥 but runs are less than attitude these days damn 🙄 Average < Ego pathetic. 💀"

MID PERSON (English):
"Bro you're so average that even Excel sheets find you boring damn 🙄 Personality not found fuck. 🔥"
`}

## OUTPUT JSON ONLY:
{
  "roast": "25-40 words ${isHindi ? 'Hindi/Hinglish' : 'English'} roast using specific facts",
  "subject_insight": "one ${isHindi ? 'Hindi' : 'English'} sarcastic line",
  "isPublicFigure": true/false,
  "publicFigureStatus": "peak/stable/falling/none"
}`;

  const userContent = `${hasName ? `Name: ${name.trim()}` : ''} ${hasSubject ? `Subject: ${subject.trim()}` : ''} ${hasMood ? `Mood: ${mood}` : ''} | Tier: ${tier.toUpperCase()} | Language: ${isHindi ? 'HINDI' : 'ENGLISH'}

${hasName ? `RESEARCH "${name.trim()}" first - find their most famous thing, signature style, and ironic moment. Then make a specific roast about it.` : 'Make a creative roast.'}

${isHindi ? 'Roast in HINDI/Hinglish with Hindi bad words (bc, chutiya, wahiyat)' : 'Roast in ENGLISH with English bad words (fuck, damn, shit)'}. Be sarcastic. 25-40 words only.`;

  const completion = await client.chat.completions.create({
    model: "meta-llama/Meta-Llama-3-70B-Instruct:novita",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userContent }
    ],
    temperature: 1.0,
    max_tokens: 200
  });

  const content = completion.choices[0]?.message?.content;
  if (!content) return null;

  try {
    const jsonMatch = content.match(/\{[\s\S]*?\}/);
    return jsonMatch ? JSON.parse(jsonMatch[0]) : { 
      roast: content.trim(), 
      subject_insight: isHindi ? "Waah bc..." : "Damn...", 
      isPublicFigure: hasName, 
      publicFigureStatus: 'stable' 
    };
  } catch {
    return { 
      roast: content.trim(), 
      subject_insight: isHindi ? "Kya baat hai..." : "Interesting...", 
      isPublicFigure: hasName, 
      publicFigureStatus: 'stable' 
    };
  }
}

// ============================================
// HELPER FUNCTIONS
// ============================================

function enforceRarityProbabilities(tier, score, isPublicFigure, publicFigureStatus) {
  const r = Math.random() * 100;
  
  if (isPublicFigure && publicFigureStatus === 'falling') {
    if (r < 50) return { tier: 'mid', score: getScoreForTier('mid') };
    if (r < 80) return { tier: 'noob', score: getScoreForTier('noob') };
    return { tier: 'npc', score: getScoreForTier('npc') };
  }
  
  if (tier === 'legendary' && r > 10) {
    if (r > 70) return { tier: 'epic', score: getScoreForTier('epic') };
    if (r > 40) return { tier: 'mid', score: getScoreForTier('mid') };
    return { tier: 'noob', score: getScoreForTier('noob') };
  }
  
  return { tier, score };
}

function checkForcedExamples(subject, mood) {
  const s = (subject || '').toLowerCase().trim();
  const m = (mood || '').toLowerCase().trim();

  if (s.includes("teacher thinks he")) return 'mid';
  if (s.includes("best influencer")) return 'noob';
  if (s.includes("teacher's favorite")) return 'mid';
  if (s.includes("boss thinks he")) return 'noob';
  if (s.includes("office politics") || s.includes("ass kissing")) return 'npc';
  if (s.includes("workout routine") && m === "funny") return 'mid';
  if (s.includes("cooking skills") && m === "funny") return 'noob';
  if (["test", "testing", "asdf", "hello", "hi"].includes(s) || s.length < 3) return 'npc';

  return null;
}

function calculateWorthiness(subject, mood, name) {
  let score = 0;
  const s = (subject || '').toLowerCase();
  const n = (name || '').toLowerCase();
  const len = (subject || '').length + (name || '').length;

  if (len >= 30) score += 25;
  else if (len >= 15) score += 15;
  else if (len >= 5) score += 8;

  if (n.length > 2) score += 10;
  if (/\s/.test(n) && n.length > 5) score += 15;

  const trash = ['test', 'testing', 'asdf', 'lol', 'lmao', 'hi', 'hello'];
  if (trash.includes(s) || len < 3) score -= 40;

  if (/terrible|awful|obsession|addiction|fear|pathetic|embarrassing/i.test(subject)) score += 15;
  if (/instagram|tiktok|youtube|twitter/i.test(subject)) score += 6;

  return Math.max(0, Math.min(100, score));
}

function getTierCap(w) {
  if (w >= 80) return 'legendary';
  if (w >= 60) return 'epic';
  if (w >= 40) return 'mid';
  if (w >= 20) return 'noob';
  return 'npc';
}

function rollForTier(cap) {
  const r = Math.random() * 100;
  const caps = { npc: 0, noob: 1, mid: 2, epic: 3, legendary: 4 };
  const i = caps[cap];

  if (i >= 4 && r < 1) return 'legendary';
  if (i >= 3 && r < 6) return 'epic';
  if (i >= 2 && r < 45) return 'mid';
  if (i >= 1 && r < 80) return 'noob';
  return 'npc';
}

function getScoreForTier(tier) {
  switch(tier) {
    case 'legendary': return 95 + Math.floor(Math.random() * 6);
    case 'epic': return 80 + Math.floor(Math.random() * 15);
    case 'mid': return 50 + Math.floor(Math.random() * 30);
    case 'noob': return 25 + Math.floor(Math.random() * 25);
    default: return Math.floor(Math.random() * 25);
  }
}

function getTierData(tier, language) {
  const isHindi = language === 'hindi';
  
  const data = {
    legendary: { 
      rarity: "legendary", 
      title: "LEGENDARY", 
      challenge: isHindi ? "GOATED HAI TU BC 👑" : "YOU'RE GOATED DAMN 👑"
    },
    epic: { 
      rarity: "epic", 
      title: "EPIC", 
      challenge: isHindi ? "ALMOST LEGEND BHAI ⚡" : "ALMOST LEGENDARY SHIT ⚡"
    },
    mid: { 
      rarity: "mid", 
      title: "MID", 
      challenge: isHindi ? "AVERAGE HAI BC 🔥" : "AVERAGE AS FUCK 🔥"
    },
    noob: { 
      rarity: "noob", 
      title: "NOOB", 
      challenge: isHindi ? "POTENTIAL GAYAB 💀" : "POTENTIAL NOT FOUND 💀"
    },
    npc: { 
      rarity: "npc", 
      title: "NPC", 
      challenge: isHindi ? "EXIST KARTA HAI BC? 😭" : "DO YOU EVEN EXIST? 😭"
    }
  };
  return data[tier] || data.npc;
}

function getFallbackRoast(tier, subject, language) {
  const isHindi = language === 'hindi';
  
  const roasts = {
    legendary: isHindi 
      ? `Waah "${subject}" bhai goated hai tu bc 🙄 Gaali dene ka mann nahi damn respect. 👑`
      : `Oh wow "${subject}" you're actually goated damn 🙄 Can't even insult you shit respect. 👑`,
    epic: isHindi
      ? `"${subject}" almost legend hai 🙄 Thoda aur try kar bc damn. ⚡`
      : `"${subject}" almost legendary 🙄 Try a bit harder damn shit. ⚡`,
    mid: isHindi
      ? `Bhai "${subject}" itna average hai ki Excel sheet bore ho jaaye bc 🙄 Personality 404 damn. 🔥`
      : `Bro "${subject}" so average that Excel sheets find you boring damn 🙄 Personality 404 fuck. 🔥`,
    noob: isHindi
      ? `"${subject}" ka potential WiFi in basement jaisa bc 🙄 Signal nahi milega damn. 💀`
      : `"${subject}" potential is like WiFi in basement damn 🙄 No signal ever shit. 💀`,
    npc: isHindi
      ? `"${subject}" exist bhi karta hai ya loading screen hai bc 🙄 Skip button damn. 😭`
      : `"${subject}" do you exist or are you a loading screen damn 🙄 Everyone wants to skip shit. 😭`
  };
  return roasts[tier] || roasts.npc;
                                                 }
