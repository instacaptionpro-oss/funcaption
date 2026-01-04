// /pages/api/generate-aura.js

import { OpenAI } from "openai";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { subject, mood } = req.body;

  if (!subject || !mood) {
    return res.status(400).json({ error: "Subject and mood required" });
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

    // ============================================
    // MERIT-BASED RARITY SYSTEM
    // ============================================
    const worthiness = calculateWorthiness(subject, mood);
    const tierCap = getTierCap(worthiness);
    const tier = rollForTier(tierCap);
    const finalScore = getScoreForTier(tier);
    const { rarity, title, challenge } = getTierData(tier);

    // ============================================
    // BRUTAL BUT SIMPLE ROAST PROMPT
    // ============================================
    const systemPrompt = `You are a savage roaster. You talk like a real person. You use bad words. You don't give a fuck.

GIVE ME ONLY THIS JSON:
{
  "roast": "your roast here",
  "subject_insight": "one line about them"
}

HOW YOU TALK:
- Use simple words everyone understands
- Short sentences that hit hard
- Bad words are okay: fuck, shit, damn, bitch, ass
- Talk like you're roasting your friend
- Make it funny but painful
- No big fancy words - keep it simple

THINGS TO ATTACK:
- Their confidence: "You really thought this was good?"
- Their loneliness: "No wonder you're single"
- Their parents: "Your mom regrets not using protection"
- Their future: "Even Google Maps can't find your future"
- Their looks: "Even your mirror cracks when you look at it"
- Their existence: "You're the human version of a skipped ad"
- Their social life: "Your phone only rings for OTP codes"

TIER: ${tier.toUpperCase()} (Score: ${finalScore}/100)

${tier === 'legendary' ? `LEGENDARY - They're actually good. Roast them but respect them. Example: "'${subject}' got you Legendary? Damn bro you're actually sick. Fuck you though. 👑"` : ''}

${tier === 'epic' ? `EPIC - Pretty good but not the best. Example: "'${subject}' got Epic? Okay you're valid. Still not Legendary so calm down. ⚡"` : ''}

${tier === 'mid' ? `MID - Average as fuck. Roast their boring ass. Example: "'${subject}'? Bro you're like room temperature water. Not bad, not good, just... there. 🔥"` : ''}

${tier === 'noob' ? `NOOB - Below average loser. Laugh at them. Example: "'${subject}' got you Noob? 💀 Bro even your WiFi leaves you on read."` : ''}

${tier === 'npc' ? `NPC - Absolute trash. Destroy them. Example: "'${subject}'? Bro you're not even a side character. You're the guy nobody notices in the background. 😭"` : ''}

RULES:
1. Only 2-3 sentences. Short and painful.
2. Use "${subject}" in the roast
3. Simple English - no big words
4. Make it personal
5. Make them laugh and cry at the same time`;

    const chatCompletion = await client.chat.completions.create({
      model: "meta-llama/Meta-Llama-3-70B-Instruct:novita",
      messages: [
        {
          role: "system",
          content: systemPrompt
        },
        {
          role: "user",
          content: `Subject: "${subject}" | Mood: ${mood} | Tier: ${tier.toUpperCase()}

Roast this. Make it hurt. Keep it simple. Use bad words.`
        }
      ],
      temperature: 1.0,
      max_tokens: 120
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
          subject_insight: "Your choices say a lot about you..."
        };
      }
    } catch {
      result = {
        roast: content.trim(),
        subject_insight: "Interesting choice bro..."
      };
    }

    // Clean roast
    let cleanRoast = result.roast
      .replace(/^["']|["']$/g, '')
      .replace(/\n\n+/g, ' ')
      .trim();

    return res.status(200).json({
      aura: {
        score: finalScore,
        roast: cleanRoast,
        subjectInsight: result.subject_insight,
        rarity,
        title,
        challenge
      }
    });

  } catch (error) {
    console.error("Aura generation error:", error);
    
    // Fallback
    const worthiness = calculateWorthiness(subject, mood);
    const tierCap = getTierCap(worthiness);
    const tier = rollForTier(tierCap);
    const finalScore = getScoreForTier(tier);
    const { rarity, title, challenge } = getTierData(tier);
    
    return res.status(200).json({ 
      aura: {
        score: finalScore,
        roast: getFallbackRoast(tier, subject),
        subjectInsight: "Says a lot about you...",
        rarity,
        title,
        challenge
      }
    });
  }
}

// ============================================
// WORTHINESS CALCULATION
// ============================================

function calculateWorthiness(subject, mood) {
  let score = 0;
  const subjectLower = subject.toLowerCase().trim();
  const charCount = subject.length;

  // Length
  if (charCount < 5) score += 0;
  else if (charCount < 15) score += 8;
  else if (charCount < 30) score += 15;
  else if (charCount < 60) score += 22;
  else score += 25;

  // Trash detection
  const trash = ['test', 'testing', 'asdf', 'qwerty', 'abc', '123', 'idk', 'nothing', 
                 'whatever', 'lol', 'lmao', 'bruh', 'hi', 'hello', 'hey', 'yo', 'a', 'aa', 'aaa'];
  if (trash.includes(subjectLower) || charCount < 3) score -= 30;
  if (/^(.)\1+$/.test(subjectLower)) score -= 25;

  // Creativity bonus
  if (/crippling|addiction|obsession|fear of|inability/i.test(subject)) score += 15;
  if (/my (terrible|horrible|awful|pathetic|embarrassing)/i.test(subject)) score += 12;
  if (/why (i|do i|can't i|am i)/i.test(subject)) score += 10;
  if (/\d+\s*(years?|times?|hours?)/i.test(subject)) score += 10;
  if (/secret|guilty pleasure|no one knows/i.test(subject)) score += 15;

  // Mood sync
  if (/terrible|awful|bad at|can't|failing|pathetic/i.test(subject)) score += 20;
  else score += 10;

  // Specificity
  if (/my (mom|dad|friend|ex|boss)/i.test(subject)) score += 5;
  if (/at (work|school|home|gym|3am)/i.test(subject)) score += 5;
  if (/(instagram|tiktok|twitter|youtube)/i.test(subject)) score += 5;

  return Math.max(0, Math.min(100, score));
}

// ============================================
// TIER CAP
// ============================================

function getTierCap(worthinessScore) {
  if (worthinessScore >= 80) return 'legendary';
  if (worthinessScore >= 60) return 'epic';
  if (worthinessScore >= 40) return 'mid';
  if (worthinessScore >= 20) return 'noob';
  return 'npc';
}

// ============================================
// WEIGHTED ROLL - Legendary 1%, Epic 5%
// ============================================

function rollForTier(tierCap) {
  const roll = Math.random() * 100;
  const caps = { npc: 0, noob: 1, mid: 2, epic: 3, legendary: 4 };
  const capIndex = caps[tierCap];

  if (capIndex >= 4 && roll < 1) return 'legendary';
  if (capIndex >= 3 && roll < 6) return 'epic';
  if (capIndex >= 2 && roll < 45) return 'mid';
  if (capIndex >= 1 && roll < 80) return 'noob';
  return 'npc';
}

// ============================================
// SCORE FOR TIER
// ============================================

function getScoreForTier(tier) {
  switch(tier) {
    case 'legendary': return 95 + Math.floor(Math.random() * 6);
    case 'epic': return 80 + Math.floor(Math.random() * 15);
    case 'mid': return 50 + Math.floor(Math.random() * 30);
    case 'noob': return 25 + Math.floor(Math.random() * 25);
    default: return Math.floor(Math.random() * 25);
  }
}

// ============================================
// TIER DATA
// ============================================

function getTierData(tier) {
  switch(tier) {
    case 'legendary':
      return { rarity: "legendary", title: "LEGENDARY", challenge: "DARE TO MATCH MY SCORE? TRY IT, LOSERS." };
    case 'epic':
      return { rarity: "epic", title: "EPIC", challenge: "DARE TO MATCH MY SCORE? TRY IT, LOSERS." };
    case 'mid':
      return { rarity: "mid", title: "MID", challenge: "FUTURE SO DARK THAT EVEN GOOGLE MAPS CANT FIND IT." };
    case 'noob':
      return { rarity: "noob", title: "NOOB", challenge: "FUTURE SO DARK THAT EVEN GOOGLE MAPS CANT FIND IT." };
    default:
      return { rarity: "npc", title: "NPC", challenge: "FUTURE SO DARK THAT EVEN GOOGLE MAPS CANT FIND IT." };
  }
}

// ============================================
// SIMPLE BRUTAL FALLBACK ROASTS
// ============================================

function getFallbackRoast(tier, subject) {
  const roasts = {
    legendary: [
      `"${subject}" got you Legendary? Holy shit bro you're actually good. I hate you but respect. 👑`,
      `Legendary? On "${subject}"? Damn. You're either talented or lucky as fuck. 👑`,
      `"${subject}" and Legendary? Bro stop flexing, we get it. You won at life. 👑`
    ],
    epic: [
      `"${subject}" got Epic? Not bad bro. You're almost impressive. Almost. ⚡`,
      `Epic on "${subject}"? Okay okay, you're valid. Still not the best though. ⚡`,
      `"${subject}" got you Epic. Top 6%. Your parents might finally be proud. Maybe. ⚡`
    ],
    mid: [
      `"${subject}"? Bro you're mid as fuck. Not bad, not good, just boring. 🔥`,
      `Mid tier on "${subject}". You're like a 5/10. Nobody remembers you exist. 🔥`,
      `"${subject}" got Mid. Congrats on being average. Your whole life is a 3-star review. 🔥`,
      `"${subject}"? Bro you're the human version of "seen at 10:32pm." Just there. 🔥`
    ],
    noob: [
      `"${subject}" got Noob? 💀 Bro your aura is weaker than free WiFi at a train station.`,
      `Noob tier because "${subject}" is the most basic shit ever. Even your ideas are broke. 💀`,
      `"${subject}" and you're Noob? This is why nobody texts you first. 💀`,
      `"${subject}" got Noob? Bro even autocorrect gives up on you. 💀`
    ],
    npc: [
      `"${subject}"? Bro you typed this thinking it was good? 😭 You're an NPC. Background character energy.`,
      `NPC because "${subject}" is trash. Your personality is drier than my lips in winter. 😭`,
      `"${subject}" got NPC. Holy shit. Even your notifications are silent because nobody cares. 😭`,
      `"${subject}"? Bro you're the human version of buffering. Nothing loads. Nothing happens. 😭`,
      `NPC tier for "${subject}". Your mom wanted a doctor but got a disappointment. 😭`,
      `"${subject}"? This is why people put their phone on silent when you call. 😭`
    ]
  };

  const tierRoasts = roasts[tier] || roasts.npc;
  return tierRoasts[Math.floor(Math.random() * tierRoasts.length)];
}
