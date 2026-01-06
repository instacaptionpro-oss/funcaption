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

  // ============================================
  // TRY GEMINI FIRST (for famous people research)
  // ============================================
  const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
  
  if (GEMINI_API_KEY && hasName) {
    try {
      result = await tryGemini(GEMINI_API_KEY, name, subject, mood, tier, finalScore, hasName, hasSubject, hasMood);
      if (result && result.roast && result.roast.length > 30) {
        isPublicFigure = result.isPublicFigure || false;
        publicFigureStatus = result.publicFigureStatus || 'none';
      } else {
        result = null; // Force fallback if roast too short
      }
    } catch (error) {
      console.log("Gemini failed:", error.message);
      result = null;
    }
  }

  // ============================================
  // FALLBACK TO HUGGINGFACE
  // ============================================
  if (!result) {
    const HF_TOKEN = process.env.HF_TOKEN;
    
    if (HF_TOKEN) {
      try {
        result = await tryHuggingFace(HF_TOKEN, name, subject, mood, tier, finalScore, hasName, hasSubject, hasMood);
        if (result && result.roast && result.roast.length > 30) {
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

  // ============================================
  // FINAL FALLBACK
  // ============================================
  if (!result) {
    result = {
      roast: getFallbackRoast(tier, subject || name || 'ye'),
      subject_insight: "Kya hi bole yaar...",
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
      subjectInsight: result.subject_insight || "Bahut kuch bolta hai...",
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
// GEMINI - CELEBRITY RESEARCH + ROAST
// ============================================
async function tryGemini(apiKey, name, subject, mood, tier, finalScore, hasName, hasSubject, hasMood) {
  const genAI = new GoogleGenerativeAI(apiKey);
  
  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
    tools: [{ googleSearch: {} }]
  });

  const prompt = `Tu ek savage roast comedian hai jo Hinglish mein roast karta hai (Hindi + English mixed).

## TERA KAAM:
NAME DIYA HAI: "${name.trim()}"

1. PEHLE GOOGLE SEARCH KAR aur dhundh:
   - Ye famous kyun hai? (YouTube, Acting, Singing, Cricket, etc.)
   - Iska BEST MOMENT kya hai? (Biggest hit, famous dialogue, signature style)
   - Isko kis cheez ke liye log jaante hain?
   - Iska content style kaisa hai?
   - Iska personality trait kya hai?

2. ROAST SIRF INPE KAR (positive/neutral things):
   ✅ Unka famous content/work
   ✅ Unka signature style/dialogue
   ✅ Unka best achievement (backhanded compliment)
   ✅ Unki personality/ego
   ✅ Unke fans
   ✅ Unka way of talking/dressing
   
3. ROAST MAT KAR:
   ❌ Court cases, controversies, scandals
   ❌ Family/relationships
   ❌ Political/religious

## LANGUAGE STYLE:
Hinglish = Hindi + English naturally mixed

GAALIYAN DONO USE KAR:
- Hindi: bc, mc, chutiya, gadha, bewakoof, nalayak, wahiyat, bakwas, gandu, bhosdike, madarchod, behenchod
- English: fuck, shit, damn, bitch, ass, dumb, stupid, pathetic, trash, loser, idiot

Example mixing: "Bc tera content itna repetitive hai ki fuck yaar boring ho gaya. Chutiya jaisi same video har baar."

## ROAST FORMAT:
- 2-3 FULL sentences (not just one line)
- 40-60 words
- Mix Hindi + English gaaliyan naturally
- 2-3 emojis
- Reference their ACTUAL famous work/moment

## TIER: ${tier.toUpperCase()} (Score: ${finalScore}/100)

${tier === 'legendary' ? 'Respect de but backhanded compliment with gaali. Example: "Bc tune actually kar dikhaya, respect hai tere liye damn."' : ''}
${tier === 'epic' ? 'Good hai but humble kar. Example: "Theek hai yaar accha hai tu but itna bhi special nahi hai bc."' : ''}
${tier === 'mid' ? 'Average bc. Roast hard. Example: "Bhai tu mid hai fucking average jaise bland khana."' : ''}
${tier === 'noob' ? 'Below average. Destroy. Example: "Teri life mein potential dhundhna bc impossible hai chutiya."' : ''}
${tier === 'npc' ? 'Bekar hai. Full gaali. Example: "Bc tu hai hi nahi madarchod loading screen jaisa wahiyat."' : ''}

## EXAMPLE ROASTS:

For Carry Minati:
"Bc Carry bhai roasting king toh hai but har video mein same formula - loud = funny? 💀 Itni cheekh ke bolega toh mic bhi suicide kar lega. Content accha hai but thoda variety la yaar damn."

For Dhoni:
"Bhai helicopter shot toh legendary hai but bc itna slow batting karta hai ki audience so jaati hai. 😭 Captain Cool? Bhai itna cool ki match bhi thanda kar deta hai. Respect hai but fuck yaar thoda fast khel."

For Shah Rukh:
"Bc SRK ki acting toh iconic hai but har movie mein arms failake romance? 💀 Bhai 50+ ki umar mein bhi wahi pose. Pathaan hit hai but chutiya jaisi overacting kam kar thodi."

## OUTPUT JSON ONLY:
{
  "roast": "2-3 sentence Hinglish roast with Hindi+English gaalis about their FAMOUS work",
  "subject_insight": "one savage line with gaali",
  "isPublicFigure": true,
  "publicFigureStatus": "peak/stable/falling/none",
  "famousFor": "what they are known for"
}`;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  const content = response.text();

  if (!content) return null;

  try {
    const jsonMatch = content.match(/\{[\s\S]*?\}/);
    return jsonMatch ? JSON.parse(jsonMatch[0]) : { roast: content.trim(), subject_insight: "Damn bc...", isPublicFigure: true, publicFigureStatus: 'stable' };
  } catch {
    return { roast: content.trim(), subject_insight: "Yikes bc...", isPublicFigure: true, publicFigureStatus: 'stable' };
  }
}

// ============================================
// HUGGINGFACE - GENERAL ROASTING
// ============================================
async function tryHuggingFace(token, name, subject, mood, tier, finalScore, hasName, hasSubject, hasMood) {
  const client = new OpenAI({
    baseURL: "https://router.huggingface.co/v1",
    apiKey: token,
  });

  const systemPrompt = `Tu ek savage roast master hai. Hinglish mein roast karta hai - Hindi aur English dono mix karke.

## IMPORTANT - GAALIYAN:
Tu Hindi aur English DONO gaaliyan use karta hai naturally jaise friends baat karte hain:

HINDI GAALIS: bc, mc, chutiya, gadha, bewakoof, nalayak, wahiyat, bakwas, gandu, bhosdike, behenchod, madarchod, saala, kamina
ENGLISH GAALIS: fuck, shit, damn, bitch, ass, dumb, stupid, pathetic, trash, loser, idiot, asshole, bastard

Mix karke use kar:
- "Bc tera content shit hai yaar"
- "Fuck yaar tu chutiya hai"  
- "Damn bhai itna wahiyat kaise ho sakta hai"
- "Stupid gadha saala"

## ROAST RULES:
- 2-3 FULL sentences likho (minimum 40 words)
- Dono language ki gaaliyan mix karo
- 2-3 emojis
- Creative aur brutal
- Family pe zyada mat jao

## TIER: ${tier.toUpperCase()} (Score: ${finalScore}/100)

${tier === 'legendary' ? 'LEGENDARY: Respect with backhanded gaali. "Bc tu actually goated hai damn respect yaar but ego thoda kam kar."' : ''}
${tier === 'epic' ? 'EPIC: Good but humble with gaali. "Theek hai bhai accha hai tu fuck but legendary nahi hai abhi chutiya."' : ''}
${tier === 'mid' ? 'MID: Average roast with full gaali. "Bc tu mid hai yaar fucking average. Na idhar ka na udhar ka wahiyat existence."' : ''}
${tier === 'noob' ? 'NOOB: Below average destruction. "Shit yaar teri life mein potential nahi hai bc. Chutiya jaisa chal raha hai sab."' : ''}
${tier === 'npc' ? 'NPC: Full destruction mode. "Bc tu exist bhi karta hai? Madarchod loading screen jaisa hai tu. Wahiyat shit existence."' : ''}

## EXAMPLE ROASTS:

MID Example:
"Bc tera vibe itna average hai ki room temperature water bhi interesting lagta hai tere saamne. 🔥 Damn yaar tu woh banda hai jisko party mein koi yaad nahi rakhta. Fucking mid existence hai teri chutiya."

NOOB Example:  
"Shit yaar tujhe dekh ke lagta hai potential tera GPS bhi nahi dhundh sakta. 💀 Bc itna below average hai tu ki even autocorrect ne haath khade kar diye. Wahiyat loser saala."

NPC Example:
"Madarchod tu hai bhi ya nahi? 😭 Bc loading screen jaisa existence hai tera jisko koi skip karna chahta hai. Fuck yaar itna irrelevant banda nahi dekha maine. Chutiya wahiyat trash."

## OUTPUT FORMAT:
Write 2-3 full sentences with mixed Hindi+English gaalis. Be savage and creative.

OUTPUT JSON:
{
  "roast": "2-3 sentence roast with Hindi+English gaalis mixed",
  "subject_insight": "one line savage with gaali",
  "isPublicFigure": false,
  "publicFigureStatus": "none"
}`;

  const userContent = `${hasName ? `Name: ${name.trim()}` : ''} ${hasSubject ? `Subject: ${subject.trim()}` : ''} ${hasMood ? `Mood: ${mood}` : ''} | Tier: ${tier.toUpperCase()}

IMPORTANT: 
1. Write 2-3 FULL sentences (not one line)
2. Mix Hindi gaalis (bc, mc, chutiya) AND English gaalis (fuck, shit, damn)
3. Be savage and creative
4. Minimum 40 words

Hinglish mein roast kar with mixed gaaliyan. GO HARD.`;

  const completion = await client.chat.completions.create({
    model: "meta-llama/Meta-Llama-3-70B-Instruct:novita",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userContent }
    ],
    temperature: 1.0,
    max_tokens: 250
  });

  const content = completion.choices[0]?.message?.content;
  if (!content) return null;

  try {
    const jsonMatch = content.match(/\{[\s\S]*?\}/);
    return jsonMatch ? JSON.parse(jsonMatch[0]) : { roast: content.trim(), subject_insight: "Damn bc...", isPublicFigure: false, publicFigureStatus: 'none' };
  } catch {
    return { roast: content.trim(), subject_insight: "Shit yaar...", isPublicFigure: false, publicFigureStatus: 'none' };
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
    legendary: { rarity: "legendary", title: "LEGENDARY", challenge: "BC TU STANDARD HAI. BAKIYON KI AUKAAT NAHI. 👑" },
    epic: { rarity: "epic", title: "EPIC", challenge: "ALMOST GODLIKE BHAI. FUCK THODA AUR GRIND KAR. ⚡" },
    mid: { rarity: "mid", title: "MID", challenge: "AVERAGE AF BC. NA GHAR KA NA GHAAT KA. 🔥" },
    noob: { rarity: "noob", title: "NOOB", challenge: "SHIT YAAR POTENTIAL NOT FOUND. GPS BHI CONFUSED. 💀" },
    npc: { rarity: "npc", title: "NPC", challenge: "BC TU HAI HI NAHI. WAHIYAT EXISTENCE. FUCK. 😭" }
  };
  return data[tier] || data.npc;
}

function getFallbackRoast(tier, subject) {
  const roasts = {
    legendary: `Bc "${subject}" ko Legendary mila? Holy shit yaar tu actually goated hai. Damn respect tere liye chutiya. But ego thoda kam kar saale. 👑`,
    epic: `"${subject}" got Epic? Fuck yaar tu valid hai bc. Most logon se better hai but Legendary? Abhi door hai bhai wahiyat. ⚡`,
    mid: `"${subject}"? Bc tu mid hai yaar fucking average. Na accha na bura, bus hai jaise bland khana. Shit existence chutiya. 🔥`,
    noob: `"${subject}" got Noob? 💀 Shit yaar teri life mein potential dhundhna bc impossible hai. Wahiyat loser saala gadha.`,
    npc: `"${subject}"? Bc tune kya likha ye? 😭 Madarchod tu loading screen hai jisko koi dekhta nahi. Fuck wahiyat existence chutiya trash.`
  };
  return roasts[tier] || roasts.npc;
      }
