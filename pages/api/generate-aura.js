// /pages/api/generate-aura.js

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

    // ============================================
    // STEP 1: CALCULATE WORTHINESS SCORE
    // ============================================
    const worthiness = calculateWorthiness(subject, mood);
    console.log("📊 Worthiness Score:", worthiness.score, "| Reason:", worthiness.reason);

    // ============================================
    // STEP 2: GET TIER CAP (Max tier they deserve)
    // ============================================
    const tierCap = getTierCap(worthiness.score);
    console.log("🎯 Tier Cap:", tierCap);

    // ============================================
    // STEP 3: ROLL FOR TIER (Within allowed range)
    // ============================================
    const tier = rollForTier(tierCap, worthiness.score);
    const score = getScoreForTier(tier);
    
    console.log("🎰 Final Tier:", tier, "| Score:", score);

    // ============================================
    // STEP 4: GENERATE AI ROAST
    // ============================================
    const systemPrompt = getTierPrompt(tier, score, subject, worthiness);

    const response = await fetch("https://router.huggingface.co/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${HF_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "meta-llama/Llama-3.3-70B-Instruct",
        messages: [
          {
            role: "system",
            content: systemPrompt
          },
          {
            role: "user",
            content: `Subject: "${subject}" | Mood: ${mood} | Tier: ${tier.toUpperCase()} | Score: ${score}`
          }
        ],
        temperature: 0.95,
        max_tokens: 100,
      }),
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error("No response from AI");
    }

    // Extract JSON from response
    let result;
    try {
      const jsonMatch = content.match(/\{[\s\S]*?\}/);
      if (jsonMatch) {
        result = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error("No JSON found");
      }
    } catch (e) {
      // If JSON parsing fails, use the content directly
      result = {
        roast: content.trim(),
        subject_insight: "Interesting choice..."
      };
    }
    
    // Get tier metadata
    const tierData = getTierData(tier);

    console.log("✅ Generated:", tier, score);

    return res.status(200).json({
      aura: {
        score: score,
        roast: result.roast || getFallbackRoast(tier, subject),
        subjectInsight: result.subject_insight || worthiness.reason,
        rarity: tier,
        title: tierData.title,
        challenge: tierData.challenge,
        tierMessage: tierData.message,
        worthinessScore: worthiness.score,
        worthinessReason: worthiness.reason,
      }
    });

  } catch (error) {
    console.error("❌ Aura generation error:", error.message);
    
    // FALLBACK - Still use merit system
    const worthiness = calculateWorthiness(subject, mood);
    const tierCap = getTierCap(worthiness.score);
    const tier = rollForTier(tierCap, worthiness.score);
    const score = getScoreForTier(tier);
    const tierData = getTierData(tier);
    
    return res.status(200).json({ 
      aura: {
        score: score,
        roast: getFallbackRoast(tier, subject),
        subjectInsight: worthiness.reason,
        rarity: tier,
        title: tierData.title,
        challenge: tierData.challenge,
        tierMessage: tierData.message,
        worthinessScore: worthiness.score,
      }
    });
  }
}

// ============================================
// WORTHINESS CALCULATION SYSTEM
// ============================================

function calculateWorthiness(subject, mood) {
  let score = 0;
  let reasons = [];

  const subjectLower = subject.toLowerCase().trim();
  const moodLower = mood.toLowerCase().trim();

  // ============================================
  // FACTOR 1: Subject Length & Effort (0-25 points)
  // ============================================
  const wordCount = subject.split(/\s+/).filter(w => w.length > 0).length;
  const charCount = subject.length;

  if (charCount < 5) {
    score += 0;
    reasons.push("Lazy input detected");
  } else if (charCount < 15) {
    score += 8;
    reasons.push("Minimal effort");
  } else if (charCount < 30) {
    score += 15;
    reasons.push("Decent effort");
  } else if (charCount < 60) {
    score += 22;
    reasons.push("Good detail");
  } else {
    score += 25;
    reasons.push("High effort input");
  }

  // ============================================
  // FACTOR 2: Trash Input Detection (-30 points)
  // ============================================
  const trashInputs = [
    'test', 'testing', 'asdf', 'asd', 'qwerty', 'abc', '123', 
    'idk', 'nothing', 'whatever', 'lol', 'lmao', 'bruh',
    'hi', 'hello', 'hey', 'yo', 'sup', 'a', 'aa', 'aaa',
    'fuck', 'shit', 'ass', 'dick', 'penis', 'sex',
    'me', 'myself', 'i', 'my life', 'life'
  ];

  if (trashInputs.includes(subjectLower) || charCount < 3) {
    score -= 30;
    reasons.push("Trash tier input 💀");
  }

  // Check for keyboard spam
  if (/^(.)\1+$/.test(subjectLower) || /^[a-z]{1,3}$/.test(subjectLower)) {
    score -= 25;
    reasons.push("Keyboard spam detected");
  }

  // ============================================
  // FACTOR 3: Creativity & Uniqueness (0-25 points)
  // ============================================
  const creativePatterns = [
    { pattern: /crippling|obsession|addiction|fear of|inability to/i, points: 15, reason: "Self-aware humor" },
    { pattern: /my (terrible|horrible|awful|pathetic|sad|embarrassing)/i, points: 12, reason: "Self-deprecating" },
    { pattern: /why (i|do i|can't i|am i)/i, points: 10, reason: "Existential crisis energy" },
    { pattern: /relationship with|addiction to|obsessed with/i, points: 12, reason: "Deep cut" },
    { pattern: /despite|even though|but still/i, points: 8, reason: "Complex thought" },
    { pattern: /\d+\s*(years?|times?|hours?|days?)/i, points: 10, reason: "Specific details" },
    { pattern: /(never|always|every time|constantly)/i, points: 6, reason: "Pattern recognition" },
    { pattern: /secret|guilty pleasure|no one knows/i, points: 15, reason: "Vulnerability" },
    { pattern: /trying to|attempting to|failing at/i, points: 8, reason: "Honest struggle" },
  ];

  let creativityScore = 0;
  for (const { pattern, points, reason } of creativePatterns) {
    if (pattern.test(subject)) {
      creativityScore += points;
      if (!reasons.includes(reason)) reasons.push(reason);
    }
  }
  score += Math.min(creativityScore, 25); // Cap at 25

  // ============================================
  // FACTOR 4: Mood-Subject Synchronization (0-25 points)
  // ============================================
  const moodSync = calculateMoodSync(subject, mood);
  score += moodSync.points;
  if (moodSync.reason) reasons.push(moodSync.reason);

  // ============================================
  // FACTOR 5: Specificity Bonus (0-15 points)
  // ============================================
  const specificPatterns = [
    { pattern: /my (mom|dad|brother|sister|friend|ex|boss|coworker)/i, points: 8 },
    { pattern: /at (work|school|home|gym|party|3am|night)/i, points: 6 },
    { pattern: /(instagram|tiktok|twitter|youtube|netflix|spotify)/i, points: 7 },
    { pattern: /every (day|night|morning|week|time)/i, points: 5 },
    { pattern: /\$\d+|money|broke|poor|rich/i, points: 6 },
  ];

  for (const { pattern, points } of specificPatterns) {
    if (pattern.test(subject)) {
      score += points;
    }
  }

  // ============================================
  // FACTOR 6: Humor Detection (0-10 points)
  // ============================================
  const humorPatterns = [
    { pattern: /😭|💀|😂|🤡|😅/u, points: 5 },
    { pattern: /lmao|lol|haha|hehe/i, points: 3 },
    { pattern: /don't judge|hear me out|i know|okay but/i, points: 8 },
    { pattern: /it's not (that|a) (bad|big deal)/i, points: 6 },
  ];

  for (const { pattern, points } of humorPatterns) {
    if (pattern.test(subject)) {
      score += points;
    }
  }

  // ============================================
  // FINAL SCORE (Capped 0-100)
  // ============================================
  score = Math.max(0, Math.min(100, score));

  // Determine final reason
  let finalReason;
  if (score >= 80) {
    finalReason = "Exceptional input - you earned this 👑";
  } else if (score >= 60) {
    finalReason = "High quality submission";
  } else if (score >= 40) {
    finalReason = "Average effort detected";
  } else if (score >= 20) {
    finalReason = "Low effort, low reward";
  } else {
    finalReason = "Trash input = trash tier 💀";
  }

  return {
    score,
    reason: finalReason,
    details: reasons.slice(0, 3).join(", ")
  };
}

function calculateMoodSync(subject, mood) {
  const subjectLower = subject.toLowerCase();
  const moodLower = mood.toLowerCase();

  // Define mood-appropriate subject patterns
  const moodPatterns = {
    funny: {
      good: [/terrible|awful|bad at|can't|failing|addiction|obsession|guilty/i],
      bad: [/death|dead|dying|suicide|cancer|disease/i],
    },
    savage: {
      good: [/my|i am|i'm|about me|myself/i],
      bad: [/someone else|my friend|other people/i],
    },
    brutal: {
      good: [/worst|terrible|pathetic|embarrassing|failure/i],
      bad: [/best|amazing|great|awesome/i],
    },
    roast: {
      good: [/me|my|i|myself/i],
      bad: [],
    },
    wholesome: {
      good: [/trying|learning|improving|growth/i],
      bad: [/hate|terrible|worst|pathetic/i],
    }
  };

  // Check for mood-specific patterns
  const patterns = moodPatterns[moodLower] || moodPatterns.roast;
  
  // Check good matches
  for (const pattern of patterns.good || []) {
    if (pattern.test(subjectLower)) {
      return { points: 20, reason: "Perfect mood sync 🎯" };
    }
  }

  // Check bad matches (penalize)
  for (const pattern of patterns.bad || []) {
    if (pattern.test(subjectLower)) {
      return { points: 5, reason: "Mood mismatch" };
    }
  }

  // Default - decent sync
  return { points: 12, reason: "Okay sync" };
}

// ============================================
// TIER CAP SYSTEM - What's the max they can get?
// ============================================

function getTierCap(worthinessScore) {
  if (worthinessScore >= 80) {
    // EXCEPTIONAL: Full access to all tiers
    return 'legendary';
  } else if (worthinessScore >= 60) {
    // HIGH: Can get Epic at best
    return 'epic';
  } else if (worthinessScore >= 40) {
    // MEDIUM: Can get Mid at best
    return 'mid';
  } else if (worthinessScore >= 20) {
    // LOW: Can get Noob at best
    return 'noob';
  } else {
    // TRASH: NPC only
    return 'npc';
  }
}

// ============================================
// WEIGHTED TIER ROLL (Within Cap)
// ============================================

function rollForTier(tierCap, worthinessScore) {
  const roll = Math.random() * 100;
  
  // Define tier hierarchy
  const tierOrder = ['npc', 'noob', 'mid', 'epic', 'legendary'];
  const capIndex = tierOrder.indexOf(tierCap);

  // Adjust probabilities based on worthiness
  // Higher worthiness = slightly better odds for higher tiers
  const worthinessBonus = (worthinessScore - 50) / 100; // -0.5 to +0.5

  // Base probabilities (adjusted by worthiness)
  let legendaryChance = 1 + (worthinessBonus * 1);     // 0.5% to 1.5%
  let epicChance = 5 + (worthinessBonus * 3);          // 3.5% to 6.5%
  let midChance = 39 + (worthinessBonus * 5);          // 36.5% to 41.5%
  let noobChance = 35 - (worthinessBonus * 3);         // 33.5% to 36.5%
  // NPC gets the rest

  // Apply tier cap
  if (capIndex < 4) legendaryChance = 0;  // Can't get Legendary
  if (capIndex < 3) epicChance = 0;       // Can't get Epic
  if (capIndex < 2) midChance = 0;        // Can't get Mid
  if (capIndex < 1) noobChance = 0;       // Can't get Noob (NPC only)

  // Normalize probabilities
  const total = legendaryChance + epicChance + midChance + noobChance;
  const npcChance = 100 - total;

  // Roll!
  if (roll < legendaryChance && legendaryChance > 0) {
    console.log("🏆 LEGENDARY! (1% chance, worthiness:", worthinessScore, ")");
    return 'legendary';
  }
  
  if (roll < legendaryChance + epicChance && epicChance > 0) {
    console.log("⚡ EPIC! (5% chance, worthiness:", worthinessScore, ")");
    return 'epic';
  }
  
  if (roll < legendaryChance + epicChance + midChance && midChance > 0) {
    return 'mid';
  }
  
  if (roll < legendaryChance + epicChance + midChance + noobChance && noobChance > 0) {
    return 'noob';
  }
  
  return 'npc';
}

// ============================================
// SCORE GENERATION FOR EACH TIER
// ============================================

function getScoreForTier(tier) {
  switch(tier) {
    case 'legendary':
      return 95 + Math.floor(Math.random() * 6);    // 95-100
    case 'epic':
      return 80 + Math.floor(Math.random() * 15);   // 80-94
    case 'mid':
      return 50 + Math.floor(Math.random() * 30);   // 50-79
    case 'noob':
      return 25 + Math.floor(Math.random() * 25);   // 25-49
    case 'npc':
    default:
      return Math.floor(Math.random() * 25);        // 0-24
  }
}

// ============================================
// TIER-SPECIFIC AI PROMPTS
// ============================================

function getTierPrompt(tier, score, subject, worthiness) {
  const baseRules = `Generate ONLY valid JSON:
{
  "roast": "your roast here (2-3 sentences MAX)",
  "subject_insight": "one line insight about their choice"
}

RULES:
- 2-3 sentences MAXIMUM (short & brutal)
- Use profanity freely (fuck, shit, damn, bitch)
- Reference "${subject}" specifically
- Be creative, not generic
- Make it sting but be witty`;

  switch(tier) {
    case 'legendary':
      return `${baseRules}

TIER: LEGENDARY (${score}/100) - TOP 1% 👑
This person EARNED it with quality input (worthiness: ${worthiness.score}/100)
ENERGY: They're a god. Acknowledge their power while roasting.
STYLE: Flex-worthy, make them feel elite.
Example: "A ${score} on '${subject}'? You're actually goated. Fuck you for being this good. 👑"`;

    case 'epic':
      return `${baseRules}

TIER: EPIC (${score}/100) - TOP 6% ⚡
Solid input deserves solid tier (worthiness: ${worthiness.score}/100)
ENERGY: Impressed but still roasting.
STYLE: Acknowledge they're rare, but not the best.
Example: "'${subject}' got you Epic? Okay you're valid. Still not Legendary though. ⚡"`;

    case 'mid':
      return `${baseRules}

TIER: MID (${score}/100) - AVERAGE 🔥
Average input = average result (worthiness: ${worthiness.score}/100)
ENERGY: Classic roast, nothing special.
STYLE: Painfully average vibes.
Example: "A ${score} on '${subject}'? You're the human equivalent of room temperature water. 🔥"`;

    case 'noob':
      return `${baseRules}

TIER: NOOB (${score}/100) - BELOW AVERAGE 💀
Low effort detected (worthiness: ${worthiness.score}/100)
ENERGY: Playful destruction.
STYLE: Laugh at their failure.
Example: "'${subject}' and you got Noob? Your aura said 'error 404.' 💀"`;

    case 'npc':
    default:
      return `${baseRules}

TIER: NPC (${score}/100) - BOTTOM 20% 😭
Trash input = trash tier (worthiness: ${worthiness.score}/100)
ENERGY: Absolutely devastating.
STYLE: Destroy their existence.
Example: "You typed '${subject}' and expected what? A ${score}. NPC behavior. 😭"`;
  }
}

// ============================================
// TIER METADATA
// ============================================

function getTierData(tier) {
  switch(tier) {
    case 'legendary':
      return {
        title: "LEGENDARY",
        challenge: "DARE TO MATCH MY SCORE? TRY IT, LOSERS.",
        message: "TOP 1% - You earned this 👑"
      };
    case 'epic':
      return {
        title: "EPIC",
        challenge: "DARE TO MATCH MY SCORE? TRY IT, LOSERS.",
        message: "TOP 6% - Rare breed ⚡"
      };
    case 'mid':
      return {
        title: "MID",
        challenge: "MAIN CHARACTER ENERGY... KINDA.",
        message: "Average gang 🔥"
      };
    case 'noob':
      return {
        title: "NOOB",
        challenge: "FUTURE SO DARK THAT EVEN GOOGLE MAPS CANT FIND IT.",
        message: "Try harder next time 💀"
      };
    case 'npc':
    default:
      return {
        title: "NPC",
        challenge: "FUTURE SO DARK THAT EVEN GOOGLE MAPS CANT FIND IT.",
        message: "Trash in = Trash out 😭"
      };
  }
}

// ============================================
// FALLBACK ROASTS (Tier-Specific)
// ============================================

function getFallbackRoast(tier, subject) {
  const roasts = {
    legendary: [
      `"${subject}" and you hit Legendary? You're actually built different. Disgusting. 👑`,
      `A Legendary? On "${subject}"? Did you sell your soul or just get lucky? Either way, respect. 👑`,
      `Holy shit, Legendary tier. "${subject}" was the right call. Now flex on these peasants. 👑`
    ],
    epic: [
      `Epic tier on "${subject}"? Okay, you're valid. Still not Legendary though. ⚡`,
      `"${subject}" got you Epic. Top 6% isn't bad. Almost impressive. ⚡`,
      `An Epic? You're kinda rare. Don't let it go to your head though. ⚡`
    ],
    mid: [
      `"${subject}" got you Mid. Congrats on being aggressively average. 🔥`,
      `Mid tier. "${subject}" was a mid choice. Makes sense. 🔥`,
      `A Mid? You're not bad, you're not good. You're just... there. Like a lamp. 🔥`
    ],
    noob: [
      `"${subject}" got you Noob? Low effort = low reward. Simple math. 💀`,
      `Noob tier. "${subject}" screams tutorial level energy. 💀`,
      `A Noob? Try putting in actual effort next time. Just a thought. 💀`
    ],
    npc: [
      `"${subject}"? Really? That's NPC behavior and you got NPC results. 😭`,
      `NPC tier because you typed "${subject}" like it meant something. It didn't. 😭`,
      `Trash input, trash tier. "${subject}" got you exactly what you deserved. 😭`
    ]
  };

  const tierRoasts = roasts[tier] || roasts.npc;
  return tierRoasts[Math.floor(Math.random() * tierRoasts.length)];
}
