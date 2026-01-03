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

    // Get tier data
    const { rarity, title, challenge } = getTierData(tier);

    // ============================================
    // AI ROAST GENERATION
    // ============================================
    const systemPrompt = `You are a brutally honest roaster. Generate ONLY JSON:
{
  "roast": "harsh, witty roast (2-3 lines max, use bad words)",
  "subject_insight": "1-line insight about the subject"
}
Rules:
1. Be savage but creative
2. Use explicit language when appropriate
3. No censorship - be brutally honest
4. Make it sting but be witty
5. Keep roast to 2-3 sentences MAX
6. This is ${tier.toUpperCase()} tier (score: ${finalScore})
${tier === 'legendary' ? '7. Acknowledge their power, flex-worthy roast 👑' : ''}
${tier === 'epic' ? '7. Impressed but still roasting ⚡' : ''}
${tier === 'mid' ? '7. Classic average roast 🔥' : ''}
${tier === 'noob' ? '7. Laugh at their failure 💀' : ''}
${tier === 'npc' ? '7. Destroy them completely 😭' : ''}`;

    const chatCompletion = await client.chat.completions.create({
      model: "meta-llama/Meta-Llama-3-70B-Instruct:novita",
      messages: [
        {
          role: "system",
          content: systemPrompt
        },
        {
          role: "user",
          content: `Subject: ${subject}, Mood: ${mood}. Generate brutal assessment.`
        }
      ],
      temperature: 0.95,
      max_tokens: 120
    });

    const content = chatCompletion.choices[0]?.message?.content;
    if (!content) {
      throw new Error("No response from AI");
    }

    // Extract JSON
    const jsonMatch = content.match(/\{[^{}]*\}/);
    if (!jsonMatch) {
      throw new Error("Invalid AI response format");
    }

    const result = JSON.parse(jsonMatch[0]);

    return res.status(200).json({
      aura: {
        score: finalScore,
        roast: result.roast,
        subjectInsight: result.subject_insight,
        rarity,
        title,
        challenge
      }
    });

  } catch (error) {
    console.error("Aura generation error:", error);
    
    // Fallback with merit system
    const worthiness = calculateWorthiness(subject, mood);
    const tierCap = getTierCap(worthiness);
    const tier = rollForTier(tierCap);
    const finalScore = getScoreForTier(tier);
    const { rarity, title, challenge } = getTierData(tier);
    
    return res.status(200).json({ 
      aura: {
        score: finalScore,
        roast: getFallbackRoast(tier, subject),
        subjectInsight: "Interesting choice, very telling...",
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

  // Length score (0-25)
  if (charCount < 5) score += 0;
  else if (charCount < 15) score += 8;
  else if (charCount < 30) score += 15;
  else if (charCount < 60) score += 22;
  else score += 25;

  // Trash detection (-30)
  const trash = ['test', 'testing', 'asdf', 'qwerty', 'abc', '123', 'idk', 'nothing', 
                 'whatever', 'lol', 'lmao', 'bruh', 'hi', 'hello', 'hey', 'yo', 'a', 'aa', 'aaa'];
  if (trash.includes(subjectLower) || charCount < 3) score -= 30;
  if (/^(.)\1+$/.test(subjectLower)) score -= 25;

  // Creativity bonus (0-25)
  if (/crippling|addiction|obsession|fear of|inability/i.test(subject)) score += 15;
  if (/my (terrible|horrible|awful|pathetic|embarrassing)/i.test(subject)) score += 12;
  if (/why (i|do i|can't i|am i)/i.test(subject)) score += 10;
  if (/\d+\s*(years?|times?|hours?)/i.test(subject)) score += 10;
  if (/secret|guilty pleasure|no one knows/i.test(subject)) score += 15;

  // Mood sync bonus (0-20)
  if (/terrible|awful|bad at|can't|failing|pathetic/i.test(subject)) score += 20;
  else score += 10;

  // Specificity bonus (0-15)
  if (/my (mom|dad|friend|ex|boss)/i.test(subject)) score += 5;
  if (/at (work|school|home|gym|3am)/i.test(subject)) score += 5;
  if (/(instagram|tiktok|twitter|youtube)/i.test(subject)) score += 5;

  return Math.max(0, Math.min(100, score));
}

// ============================================
// TIER CAP - What's the MAX they can get?
// ============================================

function getTierCap(worthinessScore) {
  if (worthinessScore >= 80) return 'legendary';  // Full access
  if (worthinessScore >= 60) return 'epic';       // Max Epic
  if (worthinessScore >= 40) return 'mid';        // Max Mid
  if (worthinessScore >= 20) return 'noob';       // Max Noob
  return 'npc';                                    // NPC only
}

// ============================================
// WEIGHTED ROLL - Legendary 1%, Epic 5%
// ============================================

function rollForTier(tierCap) {
  const roll = Math.random() * 100;
  const caps = { npc: 0, noob: 1, mid: 2, epic: 3, legendary: 4 };
  const capIndex = caps[tierCap];

  // Legendary: 1%
  if (capIndex >= 4 && roll < 1) return 'legendary';
  
  // Epic: 5% (1-6)
  if (capIndex >= 3 && roll < 6) return 'epic';
  
  // Mid: 39% (6-45)
  if (capIndex >= 2 && roll < 45) return 'mid';
  
  // Noob: 35% (45-80)
  if (capIndex >= 1 && roll < 80) return 'noob';
  
  // NPC: 20% (80-100)
  return 'npc';
}

// ============================================
// SCORE FOR TIER
// ============================================

function getScoreForTier(tier) {
  switch(tier) {
    case 'legendary': return 95 + Math.floor(Math.random() * 6);   // 95-100
    case 'epic': return 80 + Math.floor(Math.random() * 15);       // 80-94
    case 'mid': return 50 + Math.floor(Math.random() * 30);        // 50-79
    case 'noob': return 25 + Math.floor(Math.random() * 25);       // 25-49
    default: return Math.floor(Math.random() * 25);                 // 0-24
  }
}

// ============================================
// TIER DATA
// ============================================

function getTierData(tier) {
  switch(tier) {
    case 'legendary':
      return {
        rarity: "legendary",
        title: "LEGENDARY",
        challenge: "DARE TO MATCH MY SCORE? TRY IT, LOSERS."
      };
    case 'epic':
      return {
        rarity: "epic",
        title: "EPIC",
        challenge: "DARE TO MATCH MY SCORE? TRY IT, LOSERS."
      };
    case 'mid':
      return {
        rarity: "mid",
        title: "MID",
        challenge: "FUTURE SO DARK THAT EVEN GOOGLE MAPS CANT FIND IT."
      };
    case 'noob':
      return {
        rarity: "noob",
        title: "NOOB",
        challenge: "FUTURE SO DARK THAT EVEN GOOGLE MAPS CANT FIND IT."
      };
    default:
      return {
        rarity: "npc",
        title: "NPC",
        challenge: "FUTURE SO DARK THAT EVEN GOOGLE MAPS CANT FIND IT."
      };
  }
}

// ============================================
// FALLBACK ROASTS
// ============================================

function getFallbackRoast(tier, subject) {
  const roasts = {
    legendary: `"${subject}" got you Legendary? You're built different. Fuck you and congrats. 👑`,
    epic: `Epic on "${subject}"? Okay you're valid. Still not Legendary though. ⚡`,
    mid: `"${subject}" screams mid energy. Congrats on being aggressively average. 🔥`,
    noob: `"${subject}" got you Noob? Your aura said 'error 404.' 💀`,
    npc: `"${subject}"? NPC behavior = NPC results. 😭`
  };
  return roasts[tier] || roasts.npc;
    }
