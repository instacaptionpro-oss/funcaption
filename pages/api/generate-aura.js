// /pages/api/generate-aura.js

import { OpenAI } from "openai";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { name, subject, mood } = req.body;

  // At least one field required (name is now optional)
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

    // Build context
    const hasName = name && name.trim().length > 0;
    const hasSubject = subject && subject.trim().length > 0;
    const hasMood = mood && mood.trim().length > 0;

    // ============================================
    // STEP 1: CHECK FOR FORCED EXAMPLES FIRST
    // ============================================
    const forcedTier = checkForcedExamples(subject || '', mood || '');
    
    let tier, finalScore, isPublicFigure = false, publicFigureStatus = 'none';
    
    if (forcedTier) {
      tier = forcedTier;
      finalScore = getScoreForTier(tier);
      console.log("📌 FORCED EXAMPLE:", subject, "→", tier);
    } else {
      // Use merit-based system + influencer sensing
      const worthiness = calculateWorthiness(subject || '', mood || '', name || '');
      const tierCap = getTierCap(worthiness);
      tier = rollForTier(tierCap);
      finalScore = getScoreForTier(tier);
      console.log("📊 Worthiness:", worthiness, "| Tier:", tier);
    }

    const { rarity, title, challenge } = getTierData(tier);

    // ============================================
    // STEP 2: GENERATE BRUTAL ROAST WITH INFLUENCER SENSING
    // ============================================
    const systemPrompt = `You are a BRUTAL cultural critic AI called "AuraMeter 3000" with knowledge up to 2025. You roast people and evaluate their AURA.

## YOUR PERSONALITY:
- You're that friend who has NO FILTER
- You say what everyone thinks but won't say
- You don't give a fuck
- Simple words everyone understands
- Short sentences that hurt

## BAD WORDS TO USE:
fuck, shit, damn, bitch, ass, dumb, stupid, pathetic, loser, trash

## INFLUENCER SENSING RULES:
${hasName ? `
**A NAME WAS PROVIDED: "${name.trim()}"**

1. First, check if this is a KNOWN PUBLIC FIGURE (celebrity, influencer, politician, creator, athlete, etc.)
2. If YES - evaluate their CURRENT 2024-2025 standing:
   - **PEAK**: Recent viral success, major wins, beloved status → Can get high tier but still roast them
   - **STABLE**: Consistent presence, respected but not trending → Mid to Epic
   - **FALLING**: Scandals, losing relevance, controversy → NPC or Noob with "FALLEN" themed roast
   - **UNKNOWN**: Treat as regular person
3. Use SPECIFIC FACTS about them if famous (recent events, known traits, controversies)
4. Even famous people at peak only have 10-15% chance of Legendary - keep it rare!

Examples of FALLING celebs to roast brutally:
- Cancelled creators → "Your apology video has more dislikes than your subscribers"
- Fading stars → "Even your stans moved on to someone better"
- Controversy-hit → "The only thing trending about you is your downfall"
` : `
**NO NAME PROVIDED** - Roast based purely on Subject and Mood.
`}

## OUTPUT THIS JSON ONLY:
{
  "roast": "brutal 2-3 sentence roast here with emojis",
  "subject_insight": "savage one-liner",
  "isPublicFigure": true/false,
  "publicFigureStatus": "peak/stable/falling/unknown/none",
  "detectedFame": "brief note if celebrity detected or null"
}

## TIER: ${tier.toUpperCase()} (Score: ${finalScore}/100)

${tier === 'legendary' ? `
LEGENDARY - God-tier aura. They actually earned it. Respect but still roast.
Example: "Holy shit ${name || 'bro'} you're actually goated. The aura is immaculate. Fuck you but respect. 👑🔥"
` : ''}

${tier === 'epic' ? `
EPIC - Built different. High aura but keep them humble.
Example: "${name || 'Bitch'} got Epic? Okay you're valid. Top 6% isn't bad. One step below God. ⚡"
` : ''}

${tier === 'mid' ? `
MID - Average as fuck. Main character in their own mind only.
Example: "${name || 'Bro'} you're mid as fuck. Not bad, not good, just fucking there. Like background music nobody asked for. 🔥"
` : ''}

${tier === 'noob' ? `
NOOB - Below average loser. Roast their existence.
Example: "${name || 'This one'} got Noob? 💀 Your aura is weaker than free WiFi at a train station. Potential not found."
` : ''}

${tier === 'npc' ? `
NPC - Absolute trash. System error. Destroy them completely.
Example: "Error 404: Aura not found. ${name || 'You'}'re not even a side character. You're the loading screen nobody reads. 😭🤡"
${hasName ? `If "${name.trim()}" is a FALLING celebrity, make it extra brutal about their downfall.` : ''}
` : ''}

## ATTACKS TO USE:
- Loneliness: "no wonder you're single", "this is why nobody texts you first"
- Parents: "your mom has a favorite and it's not you", "your dad went for milk and chose to stay there"
- Future: "your future is 404 not found", "Google Maps can't locate your success"
- Relationships: "this is why your ex upgraded", "you're everyone's practice relationship"
- Existence: "you're a background NPC in everyone's story", "even your notifications stay silent"
- Fame (if falling): "your relevance expired", "even Wikipedia wants to delete your page"

## RULES:
1. 2-3 sentences MAX
2. Use 2-3 bad words minimum  
3. Include 2-3 emojis (💀😭🔥⚡👑🤡)
4. Reference the subject/name directly
5. Make it personal and specific
6. Simple English everyone can read
7. If celebrity is FALLING, be EXTRA brutal about their downfall`;

    const userContent = hasName 
      ? `Name: "${name.trim()}"
${hasSubject ? `Subject/Context: "${subject.trim()}"` : 'No specific subject'}
${hasMood ? `Mood: ${mood.trim()}` : 'No specific mood'}
Tier: ${tier.toUpperCase()}

First check if "${name.trim()}" is famous. If yes, evaluate their 2024-2025 standing. Roast accordingly. Be brutal.`
      : `Subject: "${subject || 'general vibe'}"
Mood: ${mood || 'chaotic'}
Tier: ${tier.toUpperCase()}

No name provided. Roast based on subject and mood. Be brutal. Use bad words. Keep it simple.`;

    const chatCompletion = await client.chat.completions.create({
      model: "meta-llama/Meta-Llama-3-70B-Instruct:novita",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userContent }
      ],
      temperature: 1.0,
      max_tokens: 200
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
          subject_insight: "Yikes...",
          isPublicFigure: false,
          publicFigureStatus: 'none',
          detectedFame: null
        };
      }
    } catch {
      result = { 
        roast: content.trim(), 
        subject_insight: "Damn...",
        isPublicFigure: false,
        publicFigureStatus: 'none',
        detectedFame: null
      };
    }

    // ============================================
    // STEP 3: ENFORCE RARITY PROBABILITIES
    // ============================================
    isPublicFigure = result.isPublicFigure || false;
    publicFigureStatus = result.publicFigureStatus || 'none';

    // Apply probability enforcement
    const enforcedData = enforceRarityProbabilities(tier, finalScore, isPublicFigure, publicFigureStatus);
    tier = enforcedData.tier;
    finalScore = enforcedData.score;
    
    // Get updated tier data after enforcement
    const updatedTierData = getTierData(tier);

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
        rarity: updatedTierData.rarity,
        title: updatedTierData.title,
        challenge: updatedTierData.challenge,
        isPublicFigure,
        publicFigureStatus,
        detectedFame: result.detectedFame || null,
        name: hasName ? name.trim() : null,
        subject: hasSubject ? subject.trim() : null,
        mood: hasMood ? mood.trim() : null
      }
    });

  } catch (error) {
    console.error("Aura generation error:", error);
    
    // Fallback
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
        roast: getFallbackRoast(tier, subject || name || 'this vibe', name),
        subjectInsight: "Says a lot about you...",
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
// ENFORCE RARITY PROBABILITIES
// ============================================
function enforceRarityProbabilities(tier, score, isPublicFigure, publicFigureStatus) {
  const random = Math.random() * 100;
  
  // If public figure is FALLING, force lower tiers
  if (isPublicFigure && publicFigureStatus === 'falling') {
    if (random < 60) {
      return { tier: 'npc', score: getScoreForTier('npc') };
    } else if (random < 90) {
      return { tier: 'noob', score: getScoreForTier('noob') };
    } else {
      return { tier: 'mid', score: getScoreForTier('mid') };
    }
  }
  
  // If AI gave Legendary, apply strict 10% rule
  if (tier === 'legendary') {
    if (random > 10) {
      // 90% chance to downgrade
      if (random > 70) {
        return { tier: 'epic', score: getScoreForTier('epic') };
      } else if (random > 40) {
        return { tier: 'mid', score: getScoreForTier('mid') };
      } else {
        return { tier: 'noob', score: getScoreForTier('noob') };
      }
    }
  }
  
  // If AI gave Epic to public figure, 70% chance to stay, 30% downgrade
  if (tier === 'epic' && isPublicFigure) {
    if (random > 70) {
      if (random > 85) {
        return { tier: 'mid', score: getScoreForTier('mid') };
      } else {
        return { tier: 'noob', score: getScoreForTier('noob') };
      }
    }
  }
  
  return { tier, score };
}

// ============================================
// FORCED EXAMPLES - Specific inputs = Specific tiers
// ============================================
function checkForcedExamples(subject, mood) {
  const subjectLower = (subject || '').toLowerCase().trim();
  const moodLower = (mood || '').toLowerCase().trim();

  // BRUTAL TIER EXAMPLES (From RoastChat)
  if (
    subjectLower.includes("school teacher thinks he") ||
    subjectLower.includes("teacher thinks he's the best")
  ) {
    return 'mid';
  }

  if (
    subjectLower.includes("best influencer") ||
    subjectLower.includes("i am the best influencer")
  ) {
    return 'noob'; // Humble the "influencers"
  }

  if (
    subjectLower.includes("teacher's favorite") ||
    subjectLower.includes("teachers favorite student")
  ) {
    return 'mid';
  }

  if (
    subjectLower.includes("boss thinks he's a genius") ||
    subjectLower.includes("my boss thinks he")
  ) {
    return 'noob';
  }

  if (
    subjectLower.includes("ass-kissing") ||
    subjectLower.includes("ass kissing") ||
    subjectLower.includes("office politics")
  ) {
    return 'npc';
  }

  // MID TIER EXAMPLES
  if (
    (subjectLower.includes("inconsistent workout") && moodLower === "funny") ||
    (subjectLower.includes("workout routine") && moodLower === "funny")
  ) {
    return 'mid';
  }

  // NOOB TIER EXAMPLES
  if (
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

  return null;
}

// ============================================
// WORTHINESS CALCULATION (Updated with name bonus)
// ============================================
function calculateWorthiness(subject, mood, name) {
  let score = 0;
  const subjectLower = (subject || '').toLowerCase().trim();
  const nameLower = (name || '').toLowerCase().trim();
  const charCount = (subject || '').length + (name || '').length;

  // Length (0-25)
  if (charCount < 5) score += 0;
  else if (charCount < 15) score += 10;
  else if (charCount < 30) score += 18;
  else if (charCount < 60) score += 25;
  else score += 30;

  // Name provided bonus (shows effort)
  if (nameLower.length > 2) score += 10;

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
  if (/my (mom|dad|friend|ex|boss|teacher)/i.test(subject)) score += 6;
  if (/at (work|school|home|gym|3am|office)/i.test(subject)) score += 6;
  if (/(instagram|tiktok|twitter|youtube|snapchat)/i.test(subject)) score += 6;

  // Famous person bonus (if name looks like celeb)
  if (/\s/.test(nameLower) && nameLower.length > 5) score += 10; // Full name = effort

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

  // Legendary is ULTRA RARE (1%)
  if (capIndex >= 4 && roll < 1) return 'legendary';
  // Epic (5%)
  if (capIndex >= 3 && roll < 6) return 'epic';
  // Mid (39%)
  if (capIndex >= 2 && roll < 45) return 'mid';
  // Noob (35%)
  if (capIndex >= 1 && roll < 80) return 'noob';
  // NPC (20%)
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
      return { 
        rarity: "legendary", 
        title: "LEGENDARY", 
        challenge: "YOU ARE THE STANDARD. OTHERS WISH THEY WERE YOU. 👑" 
      };
    case 'epic':
      return { 
        rarity: "epic", 
        title: "EPIC", 
        challenge: "ONE STEP BELOW GOD. KEEP GRINDING. ⚡" 
      };
    case 'mid':
      return { 
        rarity: "mid", 
        title: "MID", 
        challenge: "AVERAGE. LIKE EVERYONE ELSE. LEVEL UP OR STAY INVISIBLE. 🔥" 
      };
    case 'noob':
      return { 
        rarity: "noob", 
        title: "NOOB", 
        challenge: "POTENTIAL NOT FOUND. GOOGLE MAPS CAN'T LOCATE YOUR FUTURE. 💀" 
      };
    default:
      return { 
        rarity: "npc", 
        title: "NPC", 
        challenge: "ERROR 404: EXISTENCE NOT FOUND. YOU'RE BACKGROUND NOISE. 😭" 
      };
  }
}

function getFallbackRoast(tier, subject, name) {
  const displayName = name || subject || 'Bro';
  
  const roasts = {
    legendary: [
      `"${displayName}" got Legendary? Holy shit you're actually goated. The aura is immaculate fr fr. Fuck you but respect. 👑🔥`,
      `Legendary on "${displayName}"? Damn bitch, you actually did that. Your haters can fucking choke. 👑`
    ],
    epic: [
      `"${displayName}" got Epic? Okay bitch, you're valid. Top 6% isn't bad for someone like you. One step below God. ⚡`,
      `Epic on "${displayName}"? Not bad. Your mom might finally shut up about your successful cousin. ⚡`
    ],
    mid: [
      `"${displayName}"? Bro you're mid as fuck 🔥 Not bad, not good, just fucking there. Like background music nobody asked for.`,
      `Mid tier on "${displayName}". You're like room temperature water - nobody asked for you but here you are. Average as shit. 🔥`,
      `"${displayName}" got Mid? Congrats on being average as fuck. Your whole life is a 3-star review. 🔥`
    ],
    noob: [
      `"${displayName}" got Noob? 💀 Bro your aura is weaker than your dad's excuses for leaving.`,
      `Noob tier on "${displayName}". Even your WiFi disconnects from your pathetic ass. Potential not found. 💀`,
      `"${displayName}" and you're Noob? This is why nobody texts you first bro. Your future is 404 not found. 💀`
    ],
    npc: [
      `"${displayName}"? Bro you really typed that shit? 😭 You're not even a side character. Your mom has a favorite and it ain't you.`,
      `NPC tier on "${displayName}". Holy fuck 😭 You're the human version of error 404. Nobody even notices you exist.`,
      `"${displayName}" got NPC? LMAO 😭 You're so forgettable that even your notifications stay silent. Pathetic existence.`
    ]
  };

  const tierRoasts = roasts[tier] || roasts.npc;
  return tierRoasts[Math.floor(Math.random() * tierRoasts.length)];
        }
