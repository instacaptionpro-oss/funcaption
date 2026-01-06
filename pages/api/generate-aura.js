// /pages/api/generate-aura.js

import { GoogleGenerativeAI } from "@google/generative-ai";
import { OpenAI } from "openai";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { name, subject, mood } = req.body;

  if (!subject && !mood && !name) {
    return res.status(400).json({ error: "Provide at least name, subject, or mood" });
  }

  const hasName = name && name.trim().length > 0;
  const hasSubject = subject && subject.trim().length > 0;
  const hasMood = mood && mood.trim().length > 0;

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

  const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
  
  if (GEMINI_API_KEY && hasName) {
    try {
      result = await tryGemini(GEMINI_API_KEY, name, subject, mood, tier, finalScore);
      if (result && result.roast && result.roast.length > 20) {
        isPublicFigure = result.isPublicFigure || false;
        publicFigureStatus = result.publicFigureStatus || 'none';
      } else {
        result = null;
      }
    } catch (error) {
      console.log("Gemini failed:", error.message);
      result = null;
    }
  }

  if (!result) {
    const HF_TOKEN = process.env.HF_TOKEN;
    
    if (HF_TOKEN) {
      try {
        result = await tryHuggingFace(HF_TOKEN, name, subject, mood, tier, finalScore, hasName, hasSubject, hasMood);
        if (result && result.roast && result.roast.length > 20) {
          isPublicFigure = result.isPublicFigure || false;
          publicFigureStatus = result.publicFigureStatus || 'none';
        } else {
          result = null;
        }
      } catch (error) {
        console.log("HuggingFace failed:", error.message);
        result = null;
      }
    }
  }

  if (!result) {
    result = {
      roast: getFallbackRoast(tier, subject || name || 'ye'),
      subject_insight: "Waah bhai waah...",
      isPublicFigure: false,
      publicFigureStatus: 'none'
    };
  }

  const enforcedData = enforceRarityProbabilities(tier, finalScore, isPublicFigure, publicFigureStatus);
  tier = enforcedData.tier;
  finalScore = enforcedData.score;
  
  const { rarity, title, challenge } = getTierData(tier);

  return res.status(200).json({
    aura: {
      score: finalScore,
      roast: result.roast.replace(/^["']|["']$/g, '').trim(),
      subjectInsight: result.subject_insight || "Kya baat hai...",
      rarity,
      title,
      challenge,
      isPublicFigure,
      publicFigureStatus,
      name: hasName ? name.trim() : null,
      subject: hasSubject ? subject.trim() : null,
      mood: hasMood ? mood.trim() : null
    }
  });
}

// ============================================
// GEMINI - CREATIVE ROAST WITH RESEARCH
// ============================================
async function tryGemini(apiKey, name, subject, mood, tier, finalScore) {
  const genAI = new GoogleGenerativeAI(apiKey);
  
  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
    tools: [{ googleSearch: {} }]
  });

  const prompt = `Tu ek CREATIVE roast comedian hai. Tujhe FUNNY roast banana hai, bad words sirf masala hai.

## IMPORTANT - YE SAMAJH:

❌ WRONG WAY (sirf gaali):
"Bc tu chutiya hai. Fuck wahiyat. Damn loser."
- Ye roast nahi hai, ye sirf gaaliyan hain

✅ RIGHT WAY (creative roast with gaali as masala):
"Carry bhai YouTube vs TikTok banaya, itna viral hua ki YouTube ne khud delete kar diya bc 🙄 Roaster ka roast - irony ki dukan khul gayi damn"
- Ye actual roast hai jisme gaali naturally fit ho rahi hai

## STEP 1: RESEARCH "${name.trim()}"

Google search kar:
1. Ye famous kyun hai? (YouTuber, Actor, Cricketer, etc.)
2. Sabse famous kaam? (Hit video, movie, match)
3. Signature style? (Cap, dialogue, look, way of talking)
4. Koi funny/ironic moment? (Backfire, meme, embarrassing)
5. Fans kaise hain? (Toxic, blind, funny)

## STEP 2: CREATIVE ROAST BANAO

ROAST FORMULA:
[Sarcastic opener] + [Specific fact about them] + [Funny twist/punchline with gaali]

## GAALI = SEASONING (not main dish):
Bad words naturally daalo jaise friends mein baat karte ho:
- "bhai itna viral hua bc ki..."
- "YouTube ne delete kar diya damn..."
- "irony ki dukan khul gayi yaar fuck..."
- "fans bhi pagal hain chutiye..."

## EXAMPLES - RIGHT WAY:

CARRYMINATI:
"Waah Carry bhai YouTube vs TikTok itna hit tha ki YouTube ne delete karke khud roast kar diya bc 🙄 Roaster roasted - irony ki dukan damn. 💀"

DHONI:
"Bhai helicopter shot toh legendary hai but match mein itna slow khelta hai ki helicopter bhi land ho jaaye bc 🙄 Captain Cool nahi Captain Slow bol damn. 💀"

VIRAT KOHLI:
"King Kohli bhai aggression toh 🔥 hai but runs utne nahi aate jitni baar bat ghuma ke pose deta hai bc 🙄 Attitude > Average damn. 💀"

RANVEER SINGH:
"Bhai acting toh zabardast hai but kapde itne loud hain ki dialogue sunai nahi dete bc 🙄 Fashion icon? Confusion icon bol damn. 💀"

SHAH RUKH KHAN:
"SRK bhai arms kholke romance 30 saal se but bc ab 50+ mein bhi wahi pose 🙄 Pathaan hit hai but innovation kab damn. 💀"

SALMAN KHAN:
"Bhai shirt utaarta hai toh hit but acting kabhi try ki bc? 🙄 Being Human likhta hai but being actor try kar damn. 💀"

## ROAST RULES:
- 25-40 words
- 2 sentences max  
- CREATIVE roast pehle, gaali naturally beech mein
- Specific fact use kar (research se)
- 2 emojis
- Sarcastic "Waah" "Kya baat hai" tone

## TIER: ${tier.toUpperCase()}

## NO ROAST ON:
❌ Court cases, legal issues
❌ Family
❌ Religion/Politics
❌ Health

## OUTPUT JSON:
{
  "roast": "creative roast with gaali as natural seasoning",
  "subject_insight": "funny one liner",
  "isPublicFigure": true,
  "publicFigureStatus": "peak/stable/falling/none"
}`;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  const content = response.text();

  if (!content) return null;

  try {
    const jsonMatch = content.match(/\{[\s\S]*?\}/);
    return jsonMatch ? JSON.parse(jsonMatch[0]) : { roast: content.trim(), subject_insight: "Waah bc...", isPublicFigure: true, publicFigureStatus: 'stable' };
  } catch {
    return { roast: content.trim(), subject_insight: "Kya baat hai...", isPublicFigure: true, publicFigureStatus: 'stable' };
  }
}

// ============================================
// HUGGINGFACE - CREATIVE ROASTING
// ============================================
async function tryHuggingFace(token, name, subject, mood, tier, finalScore, hasName, hasSubject, hasMood) {
  const client = new OpenAI({
    baseURL: "https://router.huggingface.co/v1",
    apiKey: token,
  });

  const systemPrompt = `Tu ek CREATIVE roast comedian hai. Funny roast banana hai, gaali sirf masala hai.

## SAMAJH LE:

❌ GALAT (sirf gaali):
"Bc chutiya hai tu. Fuck. Wahiyat loser."

✅ SAHI (creative roast + gaali naturally):
"Bhai itna average hai tu ki room temperature water bhi exciting lagta hai tere saamne bc 🙄 Personality ki jagah placeholder daal diya damn"

## ROAST FORMULA:
[Funny observation] + [Specific detail] + [Punchline with gaali naturally]

## GAALI AS SEASONING:
- "itna boring hai bc ki..."
- "average hai damn..."  
- "personality nahi hai yaar fuck..."
- "wahiyat existence bc..."

## EXAMPLES:

MID TIER:
"Bhai tu itna average hai ki Excel sheet mein bhi grey cell jaisa dikhta hai bc 🙄 Personality? Error 404 damn. 🔥"

NOOB TIER:
"Tera potential dhundhna is like WiFi in basement bc 🙄 Signal nahi milega kabhi bhi damn wahiyat. 💀"

NPC TIER:
"Bhai tu exist bhi karta hai ya loading screen hai bc 🙄 Skip button dhoondh raha hai sab damn. 😭"

## RULES:
- 25-40 words
- 2 sentences
- Creative roast FIRST, gaali naturally beech mein
- Sarcastic tone: "Waah" "Kya baat hai" 🙄
- 2 emojis

## TIER: ${tier.toUpperCase()}

OUTPUT JSON:
{
  "roast": "creative roast with natural gaali",
  "subject_insight": "funny line",
  "isPublicFigure": false,
  "publicFigureStatus": "none"
}`;

  const userContent = `${hasName ? `Name: ${name.trim()}` : ''} ${hasSubject ? `Subject: ${subject.trim()}` : ''} ${hasMood ? `Mood: ${mood}` : ''} | Tier: ${tier.toUpperCase()}

CREATIVE roast bana. Gaali sirf masala ki tarah use kar, main dish nahi. Funny hona chahiye.`;

  const completion = await client.chat.completions.create({
    model: "meta-llama/Meta-Llama-3-70B-Instruct:novita",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userContent }
    ],
    temperature: 1.0,
    max_tokens: 150
  });

  const content = completion.choices[0]?.message?.content;
  if (!content) return null;

  try {
    const jsonMatch = content.match(/\{[\s\S]*?\}/);
    return jsonMatch ? JSON.parse(jsonMatch[0]) : { roast: content.trim(), subject_insight: "Waah bc...", isPublicFigure: false, publicFigureStatus: 'none' };
  } catch {
    return { roast: content.trim(), subject_insight: "Kya baat hai...", isPublicFigure: false, publicFigureStatus: 'none' };
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

function getTierData(tier) {
  const data = {
    legendary: { rarity: "legendary", title: "LEGENDARY", challenge: "GOATED HAI TU BC RESPECT 👑" },
    epic: { rarity: "epic", title: "EPIC", challenge: "ALMOST LEGEND BHAI DAMN ⚡" },
    mid: { rarity: "mid", title: "MID", challenge: "AVERAGE KA BAAP HAI TU BC 🔥" },
    noob: { rarity: "noob", title: "NOOB", challenge: "POTENTIAL GAYAB HAI DAMN 💀" },
    npc: { rarity: "npc", title: "NPC", challenge: "EXIST BHI KARTA HAI BC? 😭" }
  };
  return data[tier] || data.npc;
}

function getFallbackRoast(tier, subject) {
  const roasts = {
    legendary: `Waah "${subject}" bhai actually goated hai tu bc 🙄 Gaali dene ka mann nahi kar raha damn respect. 👑`,
    epic: `"${subject}" almost legend hai bhai 🙄 Thoda aur grind kar bc legendary ban jayega damn. ⚡`,
    mid: `Bhai "${subject}" itna average hai ki Excel sheet bhi bore ho jaaye bc 🙄 Personality 404 damn. 🔥`,
    noob: `"${subject}" ka potential dhundhna WiFi in basement jaisa hai bc 🙄 Signal nahi milega damn. 💀`,
    npc: `Bhai "${subject}" exist bhi karta hai ya sirf loading screen hai bc 🙄 Skip button chahiye damn. 😭`
  };
  return roasts[tier] || roasts.npc;
                }
