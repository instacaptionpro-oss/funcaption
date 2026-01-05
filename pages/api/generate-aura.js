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
    // SIMPLE & SAVAGE PROMPT
    // ============================================
    const systemPrompt = `You're a savage roast master. You talk like a real person - casual, funny, and you swear naturally like everyone does in real life.

Bad words (fuck, shit, damn, bitch, ass, dumb, stupid, pathetic) are your normal vocabulary. Use them like you're talking to your friend. It's not forced, it's just how you talk.

ROAST STYLE:
- 2-3 sentences max
- Talk like a real person
- Swear naturally (it's your personality)
- Be creative and brutal
- Use 2-3 emojis max

TIER: ${tier.toUpperCase()} (Score: ${finalScore}/100)

${tier === 'legendary' ? 'They earned respect. Acknowledge it but still roast a bit.' : ''}
${tier === 'epic' ? 'Pretty good but humble them.' : ''}
${tier === 'mid' ? 'Average af. Roast their mediocrity.' : ''}
${tier === 'noob' ? 'Below average loser. Destroy them.' : ''}
${tier === 'npc' ? 'Absolute trash. No mercy.' : ''}

${hasName ? `Name: "${name.trim()}" - If famous, use specific facts about them.` : ''}

OUTPUT JSON:
{
  "roast": "2-3 sentence brutal roast",
  "subject_insight": "savage one-liner",
  "isPublicFigure": true/false,
  "publicFigureStatus": "peak/stable/falling/none"
}`;

    const userContent = `${hasName ? `Name: ${name.trim()}` : ''} ${hasSubject ? `Subject: ${subject.trim()}` : ''} ${hasMood ? `Mood: ${mood}` : ''} | Tier: ${tier.toUpperCase()}

Roast them. Keep it short. Swear naturally like you always do.`;

    const chatCompletion = await client.chat.completions.create({
      model: "meta-llama/Meta-Llama-3-70B-Instruct:novita",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userContent }
      ],
      temperature: 1.0,
      max_tokens: 150
    });

    const content = chatCompletion.choices[0]?.message?.content;
    if (!content) throw new Error("No response");

    let result;
    try {
      const jsonMatch = content.match(/\{[\s\S]*?\}/);
      result = jsonMatch ? JSON.parse(jsonMatch[0]) : { roast: content.trim(), subject_insight: "Damn...", isPublicFigure: false, publicFigureStatus: 'none' };
    } catch {
      result = { roast: content.trim(), subject_insight: "Yikes...", isPublicFigure: false, publicFigureStatus: 'none' };
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
        roast: getFallbackRoast(tier, subject || name || 'this'),
        subjectInsight: "Says a lot...",
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
    legendary: { rarity: "legendary", title: "LEGENDARY", challenge: "YOU ARE THE STANDARD. 👑" },
    epic: { rarity: "epic", title: "EPIC", challenge: "ONE STEP BELOW GOD. ⚡" },
    mid: { rarity: "mid", title: "MID", challenge: "AVERAGE AS FUCK. 🔥" },
    noob: { rarity: "noob", title: "NOOB", challenge: "POTENTIAL NOT FOUND. 💀" },
    npc: { rarity: "npc", title: "NPC", challenge: "ERROR 404: YOU DON'T MATTER. 😭" }
  };
  return data[tier] || data.npc;
}

function getFallbackRoast(tier, subject) {
  const roasts = {
    legendary: `Holy shit "${subject}" got Legendary? You're actually goated fr. Fuck you but respect. 👑`,
    epic: `"${subject}" got Epic? Damn bitch you're valid. Not Legendary but we see you. ⚡`,
    mid: `"${subject}"? Bro you're mid as fuck. Not bad, not good, just fucking there. 🔥`,
    noob: `"${subject}" got Noob? 💀 Your aura is weaker than your WiFi signal bro.`,
    npc: `"${subject}"? Holy shit 😭 You're not even a side character. Absolutely pathetic.`
  };
  return roasts[tier] || roasts.npc;
                }
