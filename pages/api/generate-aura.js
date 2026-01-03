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
    // STEP 1: ROLL FOR TIER (Weighted Probability)
    // ============================================
    const tier = rollForTier();
    const score = getScoreForTier(tier);
    
    console.log("🎰 Rolled Tier:", tier, "| Score:", score);

    // ============================================
    // STEP 2: GET TIER-SPECIFIC PROMPT
    // ============================================
    const systemPrompt = getTierPrompt(tier, score);

    // ============================================
    // STEP 3: GENERATE ROAST FROM AI
    // ============================================
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
    const jsonMatch = content.match(/\{[\s\S]*?\}/);
    if (!jsonMatch) {
      throw new Error("Invalid AI response format");
    }

    const result = JSON.parse(jsonMatch[0]);
    
    // Get tier metadata
    const tierData = getTierData(tier);

    console.log("✅ Generated:", tier, score, result.roast?.substring(0, 50) + "...");

    return res.status(200).json({
      aura: {
        score: score,
        roast: result.roast || getFallbackRoast(tier, subject),
        subjectInsight: result.subject_insight || "Interesting choice...",
        rarity: tier,
        title: tierData.title,
        challenge: tierData.challenge,
        tierMessage: tierData.message,
      }
    });

  } catch (error) {
    console.error("❌ Aura generation error:", error.message);
    
    // FALLBACK - Still use proper rarity
    const tier = rollForTier();
    const score = getScoreForTier(tier);
    const tierData = getTierData(tier);
    
    return res.status(200).json({ 
      aura: {
        score: score,
        roast: getFallbackRoast(tier, subject),
        subjectInsight: "Your choices reveal everything...",
        rarity: tier,
        title: tierData.title,
        challenge: tierData.challenge,
        tierMessage: tierData.message,
      }
    });
  }
}

// ============================================
// RARITY SYSTEM - Weighted Random
// ============================================

function rollForTier() {
  const roll = Math.random() * 100;
  
  // LEGENDARY: 1% (0 - 1)
  if (roll < 1) {
    console.log("🏆 LEGENDARY ROLLED! (1% chance)");
    return 'legendary';
  }
  
  // EPIC: 5% (1 - 6)
  if (roll < 6) {
    console.log("⚡ EPIC ROLLED! (5% chance)");
    return 'epic';
  }
  
  // MID: 39% (6 - 45)
  if (roll < 45) {
    return 'mid';
  }
  
  // NOOB: 35% (45 - 80)
  if (roll < 80) {
    return 'noob';
  }
  
  // NPC: 20% (80 - 100)
  return 'npc';
}

function getScoreForTier(tier) {
  switch(tier) {
    case 'legendary':
      // 95-100 (God tier)
      return 95 + Math.floor(Math.random() * 6);
    
    case 'epic':
      // 80-94 (Elite)
      return 80 + Math.floor(Math.random() * 15);
    
    case 'mid':
      // 50-79 (Average)
      return 50 + Math.floor(Math.random() * 30);
    
    case 'noob':
      // 25-49 (Below average)
      return 25 + Math.floor(Math.random() * 25);
    
    case 'npc':
    default:
      // 0-24 (Rock bottom)
      return Math.floor(Math.random() * 25);
  }
}

// ============================================
// TIER-SPECIFIC PROMPTS
// ============================================

function getTierPrompt(tier, score) {
  const baseRules = `Generate ONLY valid JSON:
{
  "roast": "your roast here",
  "subject_insight": "one line insight"
}

ROAST RULES:
- 2-3 sentences MAX (short & brutal)
- Use profanity (fuck, shit, damn, etc.)
- Reference the subject specifically
- Be creative, not generic`;

  switch(tier) {
    case 'legendary':
      return `${baseRules}

TIER: LEGENDARY (Score: ${score}/100) - TOP 1% RAREST
ENERGY: This person is a GOD. Roast them like they're untouchable royalty.
STYLE: Flex-worthy, confident, make them feel like they hit the jackpot.
VIBE: "You're so good it's annoying" / "You won the genetic lottery"
Example: "Damn, ${score} aura? Either you sold your soul or life's been kissing your ass. Either way, fuck you and congrats. 👑"`;

    case 'epic':
      return `${baseRules}

TIER: EPIC (Score: ${score}/100) - TOP 6% RARE
ENERGY: This person is ELITE but not quite god-tier.
STYLE: Impressed but still roasting, acknowledge their power.
VIBE: "You're actually kinda sick" / "Respect, but still roasting you"
Example: "A ${score}? Okay, you're kinda cracked. Still not Legendary though, so don't let it go to your head. ⚡"`;

    case 'mid':
      return `${baseRules}

TIER: MID (Score: ${score}/100) - AVERAGE
ENERGY: Main character who's actually just a side character.
STYLE: Classic roast, nothing special, perfectly average.
VIBE: "You're mid and that's okay" / "Painfully average"
Example: "A ${score}? So you're the human equivalent of room temperature water. Not bad, not good, just... there. 🔥"`;

    case 'noob':
      return `${baseRules}

TIER: NOOB (Score: ${score}/100) - BELOW AVERAGE
ENERGY: Rookie energy, still learning how to exist.
STYLE: Playful destruction, laugh at their failure.
VIBE: "You tried and failed" / "Bless your heart"
Example: "A ${score}? Bro you're not even mid, you're below mid. Your aura said 'error 404 confidence not found.' 💀"`;

    case 'npc':
    default:
      return `${baseRules}

TIER: NPC (Score: ${score}/100) - BOTTOM 20%
ENERGY: Background character, no main character potential.
STYLE: Absolutely DEVASTATING, destroy their existence.
VIBE: "You're literally furniture" / "Do you even exist?"
Example: "A ${score}? Holy shit 💀 You're not even a side character, you're the blurry person in the background nobody notices. NPC energy is STRONG."`;
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
        message: "TOP 1% - You're built different 👑"
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
        message: "Still learning 💀"
      };
    
    case 'npc':
    default:
      return {
        title: "NPC",
        challenge: "FUTURE SO DARK THAT EVEN GOOGLE MAPS CANT FIND IT.",
        message: "Background character energy 😭"
      };
  }
}

// ============================================
// FALLBACK ROASTS (Tier-Specific)
// ============================================

function getFallbackRoast(tier, subject) {
  const roasts = {
    legendary: [
      `A Legendary on "${subject}"? You're either goated or delusional. Probably both. 👑`,
      `Holy shit, Legendary tier? Did you sacrifice someone for this? Respect. 👑`,
      `"${subject}" and you got Legendary? Life's been too easy for you. Disgusting. 👑`
    ],
    epic: [
      `Epic tier on "${subject}"? Okay you're kinda valid. Still not Legendary though. ⚡`,
      `An Epic? You're in the top 6%. Don't let it inflate your already big ego. ⚡`,
      `"${subject}" got you Epic? Nice flex, but you're one tier away from greatness. ⚡`
    ],
    mid: [
      `Mid tier on "${subject}"? Congrats, you're aggressively average. 🔥`,
      `You got Mid. Not good, not bad, just... existing. Like a lamp. 🔥`,
      `"${subject}" screams mid energy. You're the human equivalent of a 3-star Yelp review. 🔥`
    ],
    noob: [
      `Noob tier on "${subject}"? Bro you're still in the tutorial level of life. 💀`,
      `A Noob? Your potential is somewhere... just not here. Keep searching. 💀`,
      `"${subject}" and you got Noob? Even your roast is below average. Tragic. 💀`
    ],
    npc: [
      `NPC tier? You're not even a character, you're background noise. 😭`,
      `"${subject}" got you NPC? Bro you're the "generic pedestrian #47" of life. 😭`,
      `NPC energy so strong, people walk through you like you're not there. 😭`
    ]
  };

  const tierRoasts = roasts[tier] || roasts.npc;
  return tierRoasts[Math.floor(Math.random() * tierRoasts.length)];
                             }
