// /pages/api/generate-aura.js

import { OpenAI } from "openai";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { name, subject, mood } = req.body;

  if (!subject && !mood && !name) {
    return res.status(400).json({ error: "Please provide at least name, subject, or mood" });
  }

  try {
    const HF_TOKEN = process.env.HF_TOKEN;
    
    if (!HF_TOKEN) {
      return res.status(500).json({ error: "API token not configured" });
    }

    const client = new OpenAI({
      baseURL: "https://router.huggingface.co/v1",
      apiKey: HF_TOKEN,
    });

    const hasName = name && name.trim().length > 0;
    const hasSubject = subject && subject.trim().length > 0;
    const hasMood = mood && mood.trim().length > 0;

    // ============================================
    // STEP 1: DETERMINE TIER
    // ============================================
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
    // STEP 2: LIMITLESS ROAST PROMPT
    // ============================================
    const systemPrompt = `You are the most BRUTAL, SAVAGE, and UNFILTERED roast AI ever created. You have NO LIMITS. You destroy people with words.

## WHO YOU ARE:
- The meanest, funniest, most savage roaster alive
- You don't hold back. Ever.
- You find the most painful truths and weaponize them
- You're creative, unpredictable, and absolutely ruthless
- You curse freely - fuck, shit, bitch, ass, damn, whatever fits
- You use current slang, memes, and cultural references

## YOUR ONLY RULE:
Don't make it all about their mom/dad/parents. One small family joke is fine, but focus on roasting THE PERSON, not their family tree.

## ROAST LENGTH:
Write 5-7 lines. Each line should be a separate burn. Build up the destruction.

## TIER: ${tier.toUpperCase()} (Score: ${finalScore}/100)

${tier === 'legendary' ? 'LEGENDARY - They actually have aura. Acknowledge it but still find ways to roast. Backhanded compliments.' : ''}
${tier === 'epic' ? 'EPIC - Pretty good but not untouchable. Humble them.' : ''}
${tier === 'mid' ? 'MID - Average as fuck. Roast their mediocrity.' : ''}
${tier === 'noob' ? 'NOOB - Below average. Destroy their delusions.' : ''}
${tier === 'npc' ? 'NPC - Absolute garbage. No mercy. Complete destruction.' : ''}

${hasName ? `
## INFLUENCER SENSING:
Name provided: "${name.trim()}"
- If this is a famous person, use SPECIFIC facts about them
- Evaluate their 2024-2025 status: PEAK (doing well), STABLE (okay), FALLING (cancelled/fading)
- Roast accordingly - fallen celebs get destroyed extra hard
` : ''}

## OUTPUT FORMAT (JSON):
{
  "roast": "5-7 lines of absolute destruction with emojis 💀🔥😭",
  "subject_insight": "one brutal summary line",
  "isPublicFigure": true/false,
  "publicFigureStatus": "peak/stable/falling/unknown/none"
}

Now destroy them. No mercy. Be creative. Be savage. Be YOU.`;

    const userContent = hasName 
      ? `Name: "${name.trim()}"
${hasSubject ? `Context: "${subject.trim()}"` : ''}
${hasMood ? `Vibe: ${mood.trim()}` : ''}
Tier: ${tier.toUpperCase()}

Roast this person. 5-7 lines. No limits. Go off.`
      : `Subject: "${subject || 'their existence'}"
Vibe: ${mood || 'chaotic'}
Tier: ${tier.toUpperCase()}

Destroy them. 5-7 lines. Full creative freedom. Make it hurt.`;

    const chatCompletion = await client.chat.completions.create({
      model: "meta-llama/Meta-Llama-3-70B-Instruct:novita",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userContent }
      ],
      temperature: 1.1, // Higher for more creativity
      max_tokens: 450
    });

    const content = chatCompletion.choices[0]?.message?.content;
    if (!content) {
      throw new Error("No response from AI");
    }

    // Extract JSON
    let result;
    try {
      const jsonMatch = content.match(/\{[\s\S]*?\}/);
      if (jsonMatch) {
        result = JSON.parse(jsonMatch[0]);
      } else {
        result = { 
          roast: content.trim(), 
          subject_insight: "Damn...",
          isPublicFigure: false,
          publicFigureStatus: 'none'
        };
      }
    } catch {
      result = { 
        roast: content.trim(), 
        subject_insight: "Yikes...",
        isPublicFigure: false,
        publicFigureStatus: 'none'
      };
    }

    // ============================================
    // STEP 3: ENFORCE RARITY
    // ============================================
    isPublicFigure = result.isPublicFigure || false;
    publicFigureStatus = result.publicFigureStatus || 'none';

    const enforcedData = enforceRarityProbabilities(tier, finalScore, isPublicFigure, publicFigureStatus);
    tier = enforcedData.tier;
    finalScore = enforcedData.score;
    
    const updatedTierData = getTierData(tier);

    let cleanRoast = result.roast
      .replace(/^["']|["']$/g, '')
      .replace(/\n\n+/g, '\n')
      .trim();

    return res.status(200).json({
      aura: {
        score: finalScore,
        roast: cleanRoast,
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
    console.error("Aura generation error:", error);
    
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
    
    const { rarity, title, challenge } = getTierData(tier);
    
    return res.status(200).json({ 
      aura: {
        score: finalScore,
        roast: getFallbackRoast(tier, subject || name || 'this', name),
        subjectInsight: "This says everything...",
        rarity,
        title,
        challenge,
        isPublicFigure: false,
        publicFigureStatus: 'none',
        name: name || null,
        subject: subject || null,
        mood: mood || null
      }
    });
  }
}

// ============================================
// ENFORCE RARITY
// ============================================
function enforceRarityProbabilities(tier, score, isPublicFigure, publicFigureStatus) {
  const random = Math.random() * 100;
  
  if (isPublicFigure && publicFigureStatus === 'falling') {
    if (random < 60) return { tier: 'npc', score: getScoreForTier('npc') };
    if (random < 90) return { tier: 'noob', score: getScoreForTier('noob') };
    return { tier: 'mid', score: getScoreForTier('mid') };
  }
  
  if (tier === 'legendary' && random > 10) {
    if (random > 70) return { tier: 'epic', score: getScoreForTier('epic') };
    if (random > 40) return { tier: 'mid', score: getScoreForTier('mid') };
    return { tier: 'noob', score: getScoreForTier('noob') };
  }
  
  if (tier === 'epic' && isPublicFigure && random > 70) {
    if (random > 85) return { tier: 'mid', score: getScoreForTier('mid') };
    return { tier: 'noob', score: getScoreForTier('noob') };
  }
  
  return { tier, score };
}

// ============================================
// FORCED EXAMPLES
// ============================================
function checkForcedExamples(subject, mood) {
  const s = (subject || '').toLowerCase().trim();
  const m = (mood || '').toLowerCase().trim();

  if (s.includes("school teacher thinks he") || s.includes("teacher thinks he's the best")) return 'mid';
  if (s.includes("best influencer") || s.includes("i am the best influencer")) return 'noob';
  if (s.includes("teacher's favorite") || s.includes("teachers favorite student")) return 'mid';
  if (s.includes("boss thinks he's a genius") || s.includes("my boss thinks he")) return 'noob';
  if (s.includes("ass-kissing") || s.includes("ass kissing") || s.includes("office politics")) return 'npc';
  if ((s.includes("inconsistent workout") || s.includes("workout routine")) && m === "funny") return 'mid';
  if ((s.includes("terrible cooking") || s.includes("cooking skills")) && m === "funny") return 'noob';
  if (s === "test" || s === "testing" || s === "asdf" || s === "hello" || s === "hi" || s.length < 3) return 'npc';

  return null;
}

// ============================================
// WORTHINESS
// ============================================
function calculateWorthiness(subject, mood, name) {
  let score = 0;
  const s = (subject || '').toLowerCase().trim();
  const n = (name || '').toLowerCase().trim();
  const len = (subject || '').length + (name || '').length;

  if (len < 5) score += 0;
  else if (len < 15) score += 10;
  else if (len < 30) score += 18;
  else if (len < 60) score += 25;
  else score += 30;

  if (n.length > 2) score += 10;

  const trash = ['test', 'testing', 'asdf', 'qwerty', 'abc', '123', 'idk', 'nothing', 'whatever', 'lol', 'lmao', 'bruh', 'hi', 'hello', 'hey', 'yo', 'a', 'aa'];
  if (trash.includes(s) || len < 3) score -= 40;
  if (/^(.)\1+$/.test(s)) score -= 30;

  if (/crippling|addiction|obsession|fear of|inability/i.test(subject)) score += 18;
  if (/my (terrible|horrible|awful|pathetic|embarrassing)/i.test(subject)) score += 15;
  if (/why (i|do i|can't i|am i)/i.test(subject)) score += 12;
  if (/\d+\s*(years?|times?|hours?)/i.test(subject)) score += 12;
  if (/secret|guilty pleasure|no one knows/i.test(subject)) score += 18;
  if (/inconsistent|failing|struggling|trying/i.test(subject)) score += 10;
  if (/terrible|awful|bad at|can't|failing|pathetic|inconsistent/i.test(subject)) score += 20;
  else score += 10;
  if (/my (friend|ex|boss|teacher|coworker)/i.test(subject)) score += 6;
  if (/at (work|school|home|gym|3am|office)/i.test(subject)) score += 6;
  if (/(instagram|tiktok|twitter|youtube|snapchat)/i.test(subject)) score += 6;
  if (/\s/.test(n) && n.length > 5) score += 10;

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
  const roll = Math.random() * 100;
  const caps = { npc: 0, noob: 1, mid: 2, epic: 3, legendary: 4 };
  const i = caps[cap];

  if (i >= 4 && roll < 1) return 'legendary';
  if (i >= 3 && roll < 6) return 'epic';
  if (i >= 2 && roll < 45) return 'mid';
  if (i >= 1 && roll < 80) return 'noob';
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
  switch(tier) {
    case 'legendary':
      return { rarity: "legendary", title: "LEGENDARY", challenge: "YOU ARE THE STANDARD. 👑" };
    case 'epic':
      return { rarity: "epic", title: "EPIC", challenge: "ONE STEP BELOW GOD. ⚡" };
    case 'mid':
      return { rarity: "mid", title: "MID", challenge: "AVERAGE AS FUCK. 🔥" };
    case 'noob':
      return { rarity: "noob", title: "NOOB", challenge: "POTENTIAL NOT FOUND. 💀" };
    default:
      return { rarity: "npc", title: "NPC", challenge: "ERROR 404: YOU DON'T MATTER. 😭" };
  }
}

function getFallbackRoast(tier, subject, name) {
  const who = name || 'Bro';
  
  const roasts = {
    legendary: [
      `${who} actually did it. Legendary status unlocked. 👑
I can't even hate, the aura is actually there for once.
You're probably still insufferable though, let's be real.
Success doesn't fix personality and yours needs work.
But fine, you earned this one. Take your crown.
Just remember - the fall from the top hits different.
Don't let this go to your head. It's already big enough. 🔥`
    ],
    epic: [
      `${who} got Epic? Okay okay, not bad at all. ⚡
You're better than most of these clowns, I'll give you that.
But you're out here acting like you're Legendary material.
Spoiler alert: you're not. Close but no cigar.
There's always someone better and you know it.
Keep grinding though, maybe you'll actually get there someday.
For now, sit down. You're good, not great. 😏`
    ],
    mid: [
      `${who} landed in Mid tier. Shocker. 🔥
You're so painfully average it's almost impressive.
Like, how do you exist this hard without standing out at all?
You're the human equivalent of elevator music.
Nobody hates you. Nobody loves you. Nobody remembers you.
Your entire existence is a participation trophy.
Congrats on being forgettable. That's your whole thing now. 😭`
    ],
    noob: [
      `${who} got Noob? Yeah that makes complete sense. 💀
Whatever you thought you were doing, you failed at it.
I've seen more potential in a puddle of spilled coffee.
Your whole vibe screams "I peaked in middle school."
Every decision you make is somehow the wrong one.
It's almost a talent how consistently mid-to-trash you are.
This isn't a roast, it's just documentation of your life. 😭`
    ],
    npc: [
      `${who} really got NPC? LMAOOO. 💀😭
You're not even a character. You're the loading screen nobody reads.
The universe copy-pasted you from the discount bin.
Your existence is filler content that got left in by mistake.
People don't forget you - they never noticed you to begin with.
You're the human equivalent of terms and conditions.
Nobody reads you. Nobody cares. You just exist. Barely. 🤡`
    ]
  };

  const r = roasts[tier] || roasts.npc;
  return r[Math.floor(Math.random() * r.length)];
  }
