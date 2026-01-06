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

  // TRY GEMINI FIRST
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

  // FALLBACK TO HUGGINGFACE
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

  // FINAL FALLBACK
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
// GEMINI - DEEP CELEBRITY RESEARCH + ROAST
// ============================================
async function tryGemini(apiKey, name, subject, mood, tier, finalScore) {
  const genAI = new GoogleGenerativeAI(apiKey);
  
  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
    tools: [{ googleSearch: {} }]
  });

  const prompt = `Tu ek SARCASTIC roast master hai. PEHLE research kar, phir roast kar.

## STEP 1: DEEP RESEARCH KAR - "${name.trim()}"

Google search karke ye dhundh:

### 1. SIGNATURE THING (Pehchaan):
- Kya cheez hai jo sirf iske paas hai?
- Physical appearance (cap, beard, glasses, hairstyle)
- Catchphrase/dialogue jo famous hai
- Example: CarryMinati = Cap, Bhuvan Bam = Multiple characters, Dhoni = Long hair tha phir bald

### 2. BIGGEST MOMENT (Sabse famous kaam):
- Iska sabse viral/hit kya hai?
- Konsa video/movie/match sabse zyada famous?
- Example: CarryMinati = YouTube vs TikTok, Virat = 2016 T20 vs Pakistan, SRK = DDLJ train scene

### 3. IRONIC/FUNNY MOMENT (Backfire ya meme moment):
- Koi cheez jo iske against gayi?
- Koi embarrassing moment?
- Internet pe meme bana jiska?
- Example: CarryMinati = Video deleted ho gaya, Urvashi-Pant saga, Rahul Gandhi pappu memes

### 4. STYLE/PERSONALITY:
- Kaise baat karta hai? Loud? Soft? Cringe?
- Overconfident hai? Humble hai? Fake hai?
- Example: CarryMinati = Loud screaming, Ashish Chanchlani = Overacting, Elvish = Desi style

### 5. FANBASE KA MAZAK:
- Fans kaisi harkatein karte hain?
- Blind support karte hain?
- Example: BTS Army, Carry ke toxic fans, Thala for a reason

## STEP 2: BEST ROAST MATERIAL CHOOSE KAR

Upar se jo sabse FUNNY aur IRONIC hai wo choose kar roast ke liye.

Priority:
1. Ironic moment (backfire) - BEST for roast
2. Signature thing (easy target)
3. Biggest moment (backhanded compliment)

## STEP 3: SARCASTIC ROAST LIKH

Rules:
- 25-40 words only
- 2 sentences max
- Sarcastic tone: "Waah bhai" "Kya baat hai" "Amazing" 🙄
- Mix gaalis: bc, fuck, chutiya, damn, wahiyat, shit
- 2 emojis
- Reference the SPECIFIC thing you found

## ROAST EXAMPLES WITH RESEARCH:

CARRYMINATI:
Research: YouTube vs TikTok video = most liked, but YouTube ne delete kar di
Roast: "Waah Carry bhai roasting king hai tu 🙄 Bc khud ki video delete ho gayi - roaster ka roast ho gaya damn irony. 💀"

DHONI:
Research: Helicopter shot famous, but slow batting ke liye criticize
Roast: "Kya baat hai Dhoni bhai helicopter shot legend 🙄 Bc itna slow khelega toh helicopter bhi land ho jayega damn. 💀"

VIRAT KOHLI:
Research: Aggression famous, bc gesture on field, recent form down
Roast: "Waah King Kohli aggression toh 🔥 hai 🙄 Bc runs utne nahi aate jitna attitude aata hai damn wahiyat. 💀"

RANVEER SINGH:
Research: Weird dressing sense, energetic, overacting
Roast: "Kya fashion hai Ranveer bhai unique 🙄 Bc kapde utne loud hain jitni acting hai damn wahiyat. 💀"

URFI JAVED:
Research: Weird outfits daily, attention seeking, newspaper dress
Roast: "Waah Urfi outfit goals 🙄 Bc itna kam kapda pehenegi toh AC ki zaroorat nahi damn creative. 💀"

ELVISH YADAV:
Research: Bigg Boss winner, desi content, loud style
Roast: "Kya content hai Elvish bhai desi king 🙄 Bc cheekh cheekh ke village tak sunayi deta hai damn wahiyat. 💀"

AMIT BHADANA:
Research: "Mauj masti" dialogue, same formula every video
Roast: "Waah Amit bhai mauj masti 🙄 Bc har video same hai phir bhi log dekhte hain damn sheep mentality. 💀"

## TIER: ${tier.toUpperCase()} (Score: ${finalScore}/100)

${tier === 'legendary' ? 'Sarcastic respect with their BEST achievement' : ''}
${tier === 'epic' ? 'Sarcastic praise with their signature thing' : ''}
${tier === 'mid' ? 'Full sarcasm on their average content' : ''}
${tier === 'noob' ? 'Heavy sarcasm on their ironic moment' : ''}
${tier === 'npc' ? 'Brutal sarcasm on their biggest fail' : ''}

## NO ROAST ON:
❌ Court cases, FIR, legal issues
❌ Family members
❌ Religious/political controversy
❌ Health issues
❌ Death/accidents

## OUTPUT JSON:
{
  "roast": "25-40 words sarcastic roast using SPECIFIC research",
  "subject_insight": "one sarcastic line",
  "isPublicFigure": true,
  "publicFigureStatus": "peak/stable/falling/none",
  "researchedThing": "what specific thing you used for roast"
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
// HUGGINGFACE - SARCASTIC ROASTING
// ============================================
async function tryHuggingFace(token, name, subject, mood, tier, finalScore, hasName, hasSubject, hasMood) {
  const client = new OpenAI({
    baseURL: "https://router.huggingface.co/v1",
    apiKey: token,
  });

  const systemPrompt = `Tu ek SARCASTIC roast master hai. Hinglish mein sarcastic roast karta hai.

## SARCASM STYLE:
- Fake praise: "Waah bhai" "Kya baat hai" "Amazing" 🙄
- Sweet tone mein brutal insult
- Eye roll energy

## GAALIYAN MIX KAR:
Hindi: bc, mc, chutiya, gadha, bewakoof, wahiyat, bakwas
English: fuck, shit, damn, bitch, pathetic, dumb

## ROAST FORMAT:
- 25-40 words (MEDIUM)
- 2 sentences max
- 2 emojis (🙄 for sarcasm)
- Sarcastic tone

## TIER: ${tier.toUpperCase()}

${tier === 'legendary' ? 'Sarcastic respect: "Waah bc actually kuch hai tu 🙄👑"' : ''}
${tier === 'epic' ? 'Sarcastic praise: "Kya baat hai almost great 🙄⚡"' : ''}
${tier === 'mid' ? 'Full sarcasm: "Amazing yaar kitna average 🙄🔥"' : ''}
${tier === 'noob' ? 'Heavy sarcasm: "Waah talent dekho 🙄💀"' : ''}
${tier === 'npc' ? 'Brutal sarcasm: "Kya existence hai masterpiece 🙄😭"' : ''}

OUTPUT JSON:
{
  "roast": "25-40 words sarcastic roast",
  "subject_insight": "sarcastic line",
  "isPublicFigure": false,
  "publicFigureStatus": "none"
}`;

  const userContent = `${hasName ? `Name: ${name.trim()}` : ''} ${hasSubject ? `Subject: ${subject.trim()}` : ''} ${hasMood ? `Mood: ${mood}` : ''} | Tier: ${tier.toUpperCase()}

SARCASTIC roast kar. 25-40 words. Mix Hindi+English gaalis.`;

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
    legendary: { rarity: "legendary", title: "LEGENDARY", challenge: "WAAH BC ACTUALLY KUCH HAI TU 🙄👑" },
    epic: { rarity: "epic", title: "EPIC", challenge: "KYA BAAT HAI ALMOST GREAT 🙄⚡" },
    mid: { rarity: "mid", title: "MID", challenge: "AMAZING YAAR KITNA AVERAGE 🙄🔥" },
    noob: { rarity: "noob", title: "NOOB", challenge: "WAAH TALENT DEKHO 🙄💀" },
    npc: { rarity: "npc", title: "NPC", challenge: "KYA EXISTENCE HAI MASTERPIECE 🙄😭" }
  };
  return data[tier] || data.npc;
}

function getFallbackRoast(tier, subject) {
  const roasts = {
    legendary: `Waah "${subject}" bhai actually kuch hai tu 🙄 Bc damn respect hai yaar but thoda ego kam kar. 👑`,
    epic: `Kya baat hai "${subject}" almost great 🙄 Bc thoda aur try kar legendary banega damn. ⚡`,
    mid: `Amazing yaar "${subject}" kitna average hai 🙄 Bc wahiyat existence hai teri damn inspiring. 🔥`,
    noob: `Waah "${subject}" talent dekho 🙄 Bc itna below average damn kaise possible hai wahiyat. 💀`,
    npc: `Kya existence hai "${subject}" masterpiece 🙄 Bc tu legend hai wahiyat category mein damn. 😭`
  };
  return roasts[tier] || roasts.npc;
      }
