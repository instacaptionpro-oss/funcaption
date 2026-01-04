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
    // STEP 1: CHECK FOR FORCED EXAMPLES FIRST
    // ============================================
    const forcedTier = checkForcedExamples(subject, mood);
    
    let tier, finalScore;
    
    if (forcedTier) {
      // Use forced tier for specific examples
      tier = forcedTier;
      finalScore = getScoreForTier(tier);
      console.log("📌 FORCED EXAMPLE:", subject, "→", tier);
    } else {
      // Use merit-based system for other inputs
      const worthiness = calculateWorthiness(subject, mood);
      const tierCap = getTierCap(worthiness);
      tier = rollForTier(tierCap);
      finalScore = getScoreForTier(tier);
      console.log("📊 Worthiness:", worthiness, "| Tier:", tier);
    }

    const { rarity, title, challenge } = getTierData(tier);

    // ============================================
    // STEP 2: GENERATE BRUTAL ROAST
    // ============================================
    const systemPrompt = `You're that friend who has NO FILTER. You say what everyone thinks but won't say. You don't give a fuck.

OUTPUT THIS JSON ONLY:
{
  "roast": "brutal roast here",
  "subject_insight": "savage one-liner"
}

HOW YOU TALK:
- Simple words everyone understands
- Short sentences that hurt
- Bad words: fuck, shit, damn, bitch, ass, dumb, stupid, pathetic
- Sound like real person, not robot
- Funny but painful
- Attack their weak points

ATTACKS TO USE:
- Loneliness: "no wonder you're single", "this is why nobody texts you"
- Parents: "your mom has a favorite and it's not you", "your dad went for milk and stayed there"
- Future: "your future is 404 not found", "Google Maps can't find your future"
- Relationships: "this is why your ex upgraded", "you're the practice relationship"
- Existence: "you're a background NPC", "you're the loading screen nobody reads"

TIER: ${tier.toUpperCase()} (Score: ${finalScore}/100)

${tier === 'legendary' ? `
LEGENDARY - They earned it. Respect them but still roast.
Example: "'${subject}' got Legendary? Holy shit bro you're actually goated. Fuck you but respect. 👑"
` : ''}

${tier === 'epic' ? `
EPIC - Pretty good. Praise with a side roast.
Example: "'${subject}' got Epic? Okay bitch, you're valid. Top 6% isn't bad. ⚡"
` : ''}

${tier === 'mid' ? `
MID - Average as fuck. Roast their boring life.
Example: "'${subject}'? Bro you're mid as fuck. Not bad, not good, just there. Like a 5/10. 🔥"
` : ''}

${tier === 'noob' ? `
NOOB - Below average loser. Laugh at them.
Example: "'${subject}' got Noob? 💀 Bro your aura is weaker than free WiFi at a train station."
` : ''}

${tier === 'npc' ? `
NPC - Absolute trash. Destroy them.
Example: "'${subject}'? Bro you're not even a side character. You're the guy nobody notices. 😭"
` : ''}

RULES:
1. 2-3 sentences MAX
2. Use 2-3 bad words minimum
3. Reference "${subject}" directly
4. Make it personal
5. Simple English everyone can read`;

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

Roast this. Be brutal. Use bad words. Keep it simple.`
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
        result = { roast: content.trim(), subject_insight: "Yikes..." };
      }
    } catch {
      result = { roast: content.trim(), subject_insight: "Damn..." };
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
    const forcedTier = checkForcedExamples(subject, mood);
    let tier, finalScore;
    
    if (forcedTier) {
      tier = forcedTier;
      finalScore = getScoreForTier(tier);
    } else {
      const worthiness = calculateWorthiness(subject, mood);
      const tierCap = getTierCap(worthiness);
      tier = rollForTier(tierCap);
      finalScore = getScoreForTier(tier);
    }
    
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
// FORCED EXAMPLES - Specific inputs = Specific tiers
// ============================================

function checkForcedExamples(subject, mood) {
  const subjectLower = subject.toLowerCase().trim();
  const moodLower = mood.toLowerCase().trim();

  // MID TIER EXAMPLES
  if (
    (subjectLower === "my inconsistent workout routine" && moodLower === "funny") ||
    (subjectLower.includes("inconsistent workout") && moodLower === "funny") ||
    (subjectLower.includes("workout routine") && moodLower === "funny")
  ) {
    return 'mid';
  }

  // NOOB TIER EXAMPLES
  if (
    (subjectLower === "my terrible cooking skills" && moodLower === "funny") ||
    (subjectLower.includes("terrible cooking") && moodLower === "funny") ||
    (subjectLower.includes("cooking skills") && moodLower === "funny")
  ) {
    return 'noob';
  }

  // NPC TIER EXAMPLES (trash inputs)
  if (
    subjectLower === "test" ||
    subjectLower === "testing" ||
    subjectLower === "asdf" ||
    subjectLower === "hello" ||
    subjectLower === "hi" ||
    subjectLower.length < 3
  ) {
    return 'npc';
  }

  // No forced tier - use merit system
  return null;
}

// ============================================
// WORTHINESS CALCULATION
// ============================================

function calculateWorthiness(subject, mood) {
  let score = 0;
  const subjectLower = subject.toLowerCase().trim();
  const charCount = subject.length;

  // Length (0-25)
  if (charCount < 5) score += 0;
  else if (charCount < 15) score += 10;
  else if (charCount < 30) score += 18;
  else if (charCount < 60) score += 25;
  else score += 30;

  // Trash detection (-40)
  const trash = ['test', 'testing', 'asdf', 'qwerty', 'abc', '123', 'idk', 'nothing', 
                 'whatever', 'lol', 'lmao', 'bruh', 'hi', 'hello', 'hey', 'yo', 'a', 'aa'];
  if (trash.includes(subjectLower) || charCount < 3) score -= 40;
  if (/^(.)\1+$/.test(subjectLower)) score -= 30;

  // Creativity bonus (0-30)
  if (/crippling|addiction|obsession|fear of|inability/i.test(subject)) score += 18;
  if (/my (terrible|horrible|awful|pathetic|embarrassing)/i.test(subject)) score += 15;
  if (/why (i|do i|can't i|am i)/i.test(subject)) score += 12;
  if (/\d+\s*(years?|times?|hours?)/i.test(subject)) score += 12;
  if (/secret|guilty pleasure|no one knows/i.test(subject)) score += 18;
  if (/inconsistent|failing|struggling|trying/i.test(subject)) score += 10;

  // Mood sync (0-20)
  if (/terrible|awful|bad at|can't|failing|pathetic|inconsistent/i.test(subject)) score += 20;
  else score += 10;

  // Specificity (0-15)
  if (/my (mom|dad|friend|ex|boss)/i.test(subject)) score += 6;
  if (/at (work|school|home|gym|3am)/i.test(subject)) score += 6;
  if (/(instagram|tiktok|twitter|youtube)/i.test(subject)) score += 6;

  return Math.max(0, Math.min(100, score));
}

function getTierCap(worthinessScore) {
  if (worthinessScore >= 80) return 'legendary';
  if (worthinessScore >= 60) return 'epic';
  if (worthinessScore >= 40) return 'mid';
  if (worthinessScore >= 20) return 'noob';
  return 'npc';
}

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

function getFallbackRoast(tier, subject) {
  const roasts = {
    legendary: [
      `"${subject}" got Legendary? Holy shit bro you're actually goated. Fuck you but respect. 👑`,
      `Legendary on "${subject}"? Damn bitch, you actually did that. Your haters can choke. 👑`
    ],
    epic: [
      `"${subject}" got Epic? Okay bitch, you're valid. Top 6% isn't bad for someone like you. ⚡`,
      `Epic on "${subject}"? Not bad. Your mom might finally shut up about your cousin. ⚡`
    ],
    mid: [
      `"${subject}"? Bro you're mid as fuck 🔥 Not bad, not good, just fucking there. Like a 5/10.`,
      `Mid tier on "${subject}". You're like room temperature water - nobody asked for you but here you are. 🔥`,
      `"${subject}" got Mid? Congrats on being average as fuck. Your whole life is a 3-star review. 🔥`
    ],
    noob: [
      `"${subject}" got Noob? 💀 Bro your aura is weaker than your dad's excuses for leaving.`,
      `Noob tier on "${subject}". Even your WiFi disconnects from your pathetic ass. 💀`,
      `"${subject}" and you're Noob? This is why nobody texts you first bro. 💀`
    ],
    npc: [
      `"${subject}"? Bro you really typed that shit? 😭 You're not even a side character. Your mom has a favorite and it ain't you.`,
      `NPC tier on "${subject}". Holy fuck 😭 You're the human version of error 404. Nobody cares about you.`,
      `"${subject}" got NPC? LMAO 😭 You're so forgettable that your notifications stay silent. Pathetic.`
    ]
  };

  const tierRoasts = roasts[tier] || roasts.npc;
  return tierRoasts[Math.floor(Math.random() * tierRoasts.length)];
           }
