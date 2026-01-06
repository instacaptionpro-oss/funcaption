// /pages/api/generate-aura.js

import { OpenAI } from "openai";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { name, subject, mood } = req.body;

  if (!subject && !mood && !name) {
    return res.status(400).json({ error: "Provide at least name, subject, or mood" });
  }

  try {
    const HF_TOKEN = process.env.HF_TOKEN;
    if (!HF_TOKEN) return res.status(500).json({ error: "API token not configured" });

    const client = new OpenAI({
      baseURL: "https://router.huggingface.co/v1",
      apiKey: HF_TOKEN,
    });

    const hasName = name && name.trim().length > 0;
    const hasSubject = subject && subject.trim().length > 0;
    const hasMood = mood && mood.trim().length > 0;

    const forcedTier = checkForcedExamples(subject || '', mood || '');
    let tier, finalScore, isPublicFigure = false, publicFigureStatus = 'none';
    
    if (forcedTier) {
      tier = forcedTier;
      finalScore = getScoreForTier(tier);
    } else {
      const worthiness = calculateWorthiness(subject || '', mood || '', name || '');
      const tierCap = getTierCap(worthiness);
      tier = rollForTier(tierCap);
      finalScore = getScoreForTier(tier);
    }

    const { rarity, title, challenge } = getTierData(tier);

    // ============================================
    // HINGLISH ROAST PROMPT
    // ============================================
    const systemPrompt = `Tu ek savage roast master hai. Tu Hinglish mein baat karta hai - Hindi + English mix, just like real Indian friends talk.

LANGUAGE STYLE:
- Mix Hindi and English naturally (Hinglish)
- Some sentences pure Hindi, some pure English, some mixed
- Use Hindi gaalis and English swear words both
- Talk like urban Indian youth

GAALIS/SWEAR WORDS TO USE NATURALLY:
Hindi: bhai, yaar, bc, mc, chutiya, gadha, bewakoof, nalayak, wahiyat, bakwas, gandu, bkl
English: fuck, shit, damn, bitch, ass, dumb, stupid, pathetic, trash, loser

IMPORTANT RULES:
- Maximum 40-50 words only
- 2-3 sentences max
- Be brutal and creative
- Use 2-3 emojis
- Don't go too much on family/parents

TIER: ${tier.toUpperCase()} (Score: ${finalScore}/100)

${tier === 'legendary' ? 'Respect de but thoda roast bhi kar.' : ''}
${tier === 'epic' ? 'Achi hai but humble kar isko.' : ''}
${tier === 'mid' ? 'Average hai bc. Mediocrity roast kar.' : ''}
${tier === 'noob' ? 'Below average loser hai. Destroy kar.' : ''}
${tier === 'npc' ? 'Bilkul bekar hai. No mercy.' : ''}

${hasName ? `Name: "${name.trim()}" - Agar famous hai toh specific facts use kar.` : ''}

EXAMPLE ROASTS (for style reference):

NPC Example:
"Bhai tune ye kya likh diya? 💀 Tera existence itna irrelevant hai ki Google bhi tujhe search nahi karta. Wahiyat insaan."

MID Example:
"Average as fuck yaar. Tu woh banda hai jisko log party mein invite karte hai bus headcount ke liye. 🔥"

NOOB Example:
"Teri life mein potential dhundhna is like finding wifi in a village. Bc kuch nahi milega. 💀"

EPIC Example:
"Not bad bhai, tu actually better hai most chutiyon se. But Legendary? Abhi bahut door hai tu. ⚡"

OUTPUT JSON ONLY:
{
  "roast": "40-50 words max Hinglish roast",
  "subject_insight": "one savage Hinglish line",
  "isPublicFigure": true/false,
  "publicFigureStatus": "peak/stable/falling/none"
}`;

    const userContent = `${hasName ? `Name: ${name.trim()}` : ''} ${hasSubject ? `Subject: ${subject.trim()}` : ''} ${hasMood ? `Mood: ${mood}` : ''} | Tier: ${tier.toUpperCase()}

Hinglish mein roast kar. 40-50 words max. Gaali use kar naturally.`;

    const chatCompletion = await client.chat.completions.create({
      model: "meta-llama/Meta-Llama-3-70B-Instruct:novita",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userContent }
      ],
      temperature: 1.0,
      max_tokens: 180
    });

    const content = chatCompletion.choices[0]?.message?.content;
    if (!content) throw new Error("No response");

    let result;
    try {
      const jsonMatch = content.match(/\{[\s\S]*?\}/);
      result = jsonMatch ? JSON.parse(jsonMatch[0]) : { roast: content.trim(), subject_insight: "Kya hi bole...", isPublicFigure: false, publicFigureStatus: 'none' };
    } catch {
      result = { roast: content.trim(), subject_insight: "Wahiyat...", isPublicFigure: false, publicFigureStatus: 'none' };
    }

    isPublicFigure = result.isPublicFigure || false;
    publicFigureStatus = result.publicFigureStatus || 'none';

    const enforcedData = enforceRarityProbabilities(tier, finalScore, isPublicFigure, publicFigureStatus);
    tier = enforcedData.tier;
    finalScore = enforcedData.score;
    
    const updatedTierData = getTierData(tier);

    return res.status(200).json({
      aura: {
        score: finalScore,
        roast: result.roast.replace(/^["']|["']$/g, '').trim(),
        subjectInsight: result.subject_insight,
        rarity: updatedTierData.rarity,
        title: updatedTierData.title,
        challenge: updatedTierData.challenge,
        isPublicFigure,
        publicFigureStatus,
        name: hasName ? name.trim() : null,
        subject: hasSubject ? subject.trim() : null,
        mood: hasMood ? mood.trim() : null
      }
    });

  } catch (error) {
    console.error("Error:", error);
    
    const forcedTier = checkForcedExamples(subject || '', mood || '');
    let tier = forcedTier || rollForTier(getTierCap(calculateWorthiness(subject || '', mood || '', name || '')));
    let finalScore = getScoreForTier(tier);
    const { rarity, title, challenge } = getTierData(tier);
    
    return res.status(200).json({ 
      aura: {
        score: finalScore,
        roast: getFallbackRoast(tier, subject || name || 'ye'),
        subjectInsight: "Bahut kuch bolta hai ye...",
        rarity, title, challenge,
        isPublicFigure: false,
        publicFigureStatus: 'none',
        name: name || null,
        subject: subject || null,
        mood: mood || null
      }
    });
  }
}

function enforceRarityProbabilities(tier, score, isPublicFigure, publicFigureStatus) {
  const r = Math.random() * 100;
  
  if (isPublicFigure && publicFigureStatus === 'falling') {
    if (r < 60) return { tier: 'npc', score: getScoreForTier('npc') };
    if (r < 90) return { tier: 'noob', score: getScoreForTier('noob') };
    return { tier: 'mid', score: getScoreForTier('mid') };
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
  if (/\s/.test(n) && n.length > 5) score += 10;

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
    legendary: { rarity: "legendary", title: "LEGENDARY", challenge: "TU STANDARD HAI. BAKIYON KI AUKAAT NAHI. 👑" },
    epic: { rarity: "epic", title: "EPIC", challenge: "ALMOST GODLIKE. BAS THODA AUR GRIND KAR. ⚡" },
    mid: { rarity: "mid", title: "MID", challenge: "AVERAGE AF. NA GHAR KA NA GHAAT KA. 🔥" },
    noob: { rarity: "noob", title: "NOOB", challenge: "POTENTIAL NOT FOUND. GPS BHI CONFUSED HAI. 💀" },
    npc: { rarity: "npc", title: "NPC", challenge: "ERROR 404: EXISTENCE NOT FOUND. TU HAI HI NAHI. 😭" }
  };
  return data[tier] || data.npc;
}

function getFallbackRoast(tier, subject) {
  const roasts = {
    legendary: `"${subject}" ko Legendary mila? Holy shit bhai tu actually goated hai. Tujhe gaali dene ka mann nahi kar raha. Respect. 👑`,
    epic: `"${subject}" got Epic? Dekh bhai tu valid hai. Most logon se better hai but Legendary? Abhi door hai. ⚡`,
    mid: `"${subject}"? Bhai tu mid hai bc. Na accha na bura, bus hai. Jaise room temperature paani. 🔥`,
    noob: `"${subject}" got Noob? 💀 Teri life mein potential dhundhna is like finding signal in basement. Kuch nahi milega.`,
    npc: `"${subject}"? Bhai tune kya likh diya ye? 😭 Tu side character bhi nahi hai, tu loading screen hai jisko koi read nahi karta.`
  };
  return roasts[tier] || roasts.npc;
}
