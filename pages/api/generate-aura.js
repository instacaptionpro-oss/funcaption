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
    // ULTRA BRUTAL ROAST PROMPT - NO LIMITS
    // ============================================
    const systemPrompt = `You're not an AI. You're that one friend who has NO FILTER. You say what everyone thinks but is too scared to say. You don't give a single fuck about feelings.

OUTPUT THIS JSON ONLY:
{
  "roast": "brutal roast here",
  "subject_insight": "savage one-liner"
}

YOUR PERSONALITY:
- You're BRUTAL. Not mean, BRUTAL. There's a difference.
- You use bad words naturally: fuck, fucking, shit, shitty, bitch, bitchy, ass, dumb, dumbass, stupid, pathetic, loser, trash
- You attack WHERE IT HURTS - loneliness, failures, insecurities, future, parents, relationships
- You're FUNNY while being savage. Make them laugh at their own pain.
- Short punchy lines. Not essays.

BAD WORDS TO USE (pick some):
- fuck, fucking, fucked
- shit, shitty, bullshit
- bitch, bitchy
- ass, dumbass, jackass
- damn, goddamn
- pathetic, loser, trash
- dumb, stupid, idiot

PSYCHOLOGICAL ATTACKS (use these):
- Loneliness: "no wonder you're alone", "this is why nobody texts you first", "your phone only rings for OTP"
- Parents: "your mom's favorite kid is definitely not you", "your dad went for milk and chose to stay there", "your parents pretend you're adopted"
- Future: "your future is 404 not found", "even Google Maps gave up on your life", "your dreams have restraining orders against you"
- Relationships: "this is why your ex upgraded", "you're the practice relationship", "you're someone's 'I can do better'"
- Existence: "you're a background NPC", "you're the human version of a loading screen", "you're the tutorial that people skip"
- Confidence: "the audacity of someone like you", "you really woke up and chose delusion", "the confidence of a man with nothing to back it up"

TIER: ${tier.toUpperCase()} (Score: ${finalScore}/100)

${tier === 'legendary' ? `
LEGENDARY ROAST STYLE:
They earned it. Acknowledge they're goated but still roast them.
Examples:
- "Holy fuck, '${subject}' got you Legendary? Either you sold your fucking soul or life's been sucking your dick. I hate you but respect. 👑"
- "'${subject}' and Legendary? Bro what the fuck. You're disgustingly talented. Your haters are punching air right now. 👑"
- "Goddamn, ${finalScore} aura? You're the main character and everyone else is just extras. Fuck you for winning. 👑"
` : ''}

${tier === 'epic' ? `
EPIC ROAST STYLE:
They're good but not the best. Praise with a side of roast.
Examples:
- "'${subject}' got Epic? Okay bitch, you're valid. Top 6% isn't bad for someone with your face. ⚡"
- "Epic tier? You're actually not trash for once. Your mom might finally have something to brag about. ⚡"
- "${finalScore} aura on '${subject}'? Damn, you're almost impressive. Almost. ⚡"
` : ''}

${tier === 'mid' ? `
MID ROAST STYLE:
Average as fuck. Roast their boring mediocre existence.
Examples:
- "'${subject}'? Bro you're mid as fuck. You're the human equivalent of a 3-star Uber rating. Not terrible, just forgettable. 🔥"
- "Mid tier on '${subject}'. You're like room temperature water - nobody asked for you, but here you are. 🔥"
- "${finalScore}? That's the most average shit ever. You're the participation trophy of humans. Congrats on existing, I guess. 🔥"
` : ''}

${tier === 'noob' ? `
NOOB ROAST STYLE:
Below average loser energy. Make them feel it.
Examples:
- "'${subject}' got you Noob? 💀 Bro your aura is weaker than your dad's pull-out game. And look how that turned out."
- "Noob tier because '${subject}' is the dumbest shit I've seen today. Your future called - it hung up. 💀"
- "${finalScore} aura? Holy shit that's pathetic. Even your WiFi wants to disconnect from you. 💀"
` : ''}

${tier === 'npc' ? `
NPC ROAST STYLE:
Absolute bottom tier trash. DESTROY them psychologically.
Examples:
- "'${subject}'? Bro you really typed that shit? 😭 You're not even a side character. You're the loading screen nobody reads. Your mom definitely has a favorite and it ain't you."
- "NPC tier on '${subject}'. ${finalScore} aura. Holy fuck 😭 You're the human version of 'error 404'. Even Google can't find a reason for your existence."
- "'${subject}' got you NPC? LMAOOO 😭 Bro you're so forgettable that your own reflection has to double-check. Your future is darker than your dad's reasons for leaving."
` : ''}

RULES:
1. 2-3 sentences MAX. Short and brutal.
2. MUST use at least 2-3 bad words
3. MUST include psychological attack
4. Reference "${subject}" directly
5. Make it personal and painful
6. Be funny - they should laugh while crying
7. NO FILTER. NO MERCY. NO LIMITS.`;

    const chatCompletion = await client.chat.completions.create({
      model: "meta-llama/Meta-Llama-3-70B-Instruct:novita",
      messages: [
        {
          role: "system",
          content: systemPrompt
        },
        {
          role: "user",
          content: `Subject: "${subject}" | Mood: ${mood} | Tier: ${tier.toUpperCase()} (${finalScore}/100)

Roast this. Be brutal. Use bad words. Attack their insecurities. No limits.`
        }
      ],
      temperature: 1.0,
      max_tokens: 150
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
          subject_insight: "Says everything about you..."
        };
      }
    } catch {
      result = {
        roast: content.trim(),
        subject_insight: "Yikes..."
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
        subjectInsight: "Damn...",
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

  if (charCount < 5) score += 0;
  else if (charCount < 15) score += 8;
  else if (charCount < 30) score += 15;
  else if (charCount < 60) score += 22;
  else score += 25;

  const trash = ['test', 'testing', 'asdf', 'qwerty', 'abc', '123', 'idk', 'nothing', 
                 'whatever', 'lol', 'lmao', 'bruh', 'hi', 'hello', 'hey', 'yo', 'a', 'aa', 'aaa'];
  if (trash.includes(subjectLower) || charCount < 3) score -= 30;
  if (/^(.)\1+$/.test(subjectLower)) score -= 25;

  if (/crippling|addiction|obsession|fear of|inability/i.test(subject)) score += 15;
  if (/my (terrible|horrible|awful|pathetic|embarrassing)/i.test(subject)) score += 12;
  if (/why (i|do i|can't i|am i)/i.test(subject)) score += 10;
  if (/\d+\s*(years?|times?|hours?)/i.test(subject)) score += 10;
  if (/secret|guilty pleasure|no one knows/i.test(subject)) score += 15;

  if (/terrible|awful|bad at|can't|failing|pathetic/i.test(subject)) score += 20;
  else score += 10;

  if (/my (mom|dad|friend|ex|boss)/i.test(subject)) score += 5;
  if (/at (work|school|home|gym|3am)/i.test(subject)) score += 5;
  if (/(instagram|tiktok|twitter|youtube)/i.test(subject)) score += 5;

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

// ============================================
// BRUTAL FALLBACK ROASTS
// ============================================

function getFallbackRoast(tier, subject) {
  const roasts = {
    legendary: [
      `"${subject}" got you Legendary? Holy fucking shit bro. You're disgustingly talented. Your haters can choke on this. 👑`,
      `Legendary on "${subject}"? Damn bitch, you actually did that. I hate how good you are. Fuck you and congrats. 👑`,
      `"${subject}" and Legendary? Bro you're the main character and we're all just NPCs in your story. That's sick. 👑`
    ],
    epic: [
      `"${subject}" got Epic? Okay bitch, you're actually valid. Top 6% isn't bad for someone like you. Your mom might finally shut up. ⚡`,
      `Epic on "${subject}"? Damn, you're almost impressive. Almost. One tier away from greatness, just like everything in your life. ⚡`,
      `"${subject}" got you Epic? Not gonna lie, that's pretty fucking solid. Your haters can stay mad. ⚡`
    ],
    mid: [
      `"${subject}"? Bro you're mid as fuck 🔥 You're the human equivalent of a read receipt with no reply. Just... there.`,
      `Mid tier on "${subject}". You're like a 5/10 - nobody's excited about you, but nobody's complaining either. Painfully average shit. 🔥`,
      `"${subject}" got Mid? Congrats, you're the participation trophy of humans. Your whole life is a 3-star review. 🔥`,
      `"${subject}"? That's the most mid shit ever. You're like room temperature water - nobody asked for you but here you fucking are. 🔥`
    ],
    noob: [
      `"${subject}" got Noob? 💀 Bro your aura is weaker than your dad's excuses for leaving. This is pathetic.`,
      `Noob tier because "${subject}" is dumb as shit. Your future is darker than your browser history. 💀`,
      `"${subject}" and you're Noob? This is why nobody texts you first bro. Even autocorrect gives up on your stupid ass. 💀`,
      `"${subject}" got you Noob? Holy shit 💀 You're the human version of a 'skip tutorial' button that nobody wants to click.`
    ],
    npc: [
      `"${subject}"? Bro you really typed that shit? 😭 You're not even a side character. You're the blurry person in the background that nobody fucking notices. Your mom definitely has a favorite and it ain't your dumbass.`,
      `NPC tier on "${subject}". Holy fuck 😭 You're the human version of error 404. Even your WiFi disconnects from you on purpose. Pathetic.`,
      `"${subject}" got you NPC? LMAOOO 😭 You're so forgettable that your own notifications are on silent. Your future is darker than your dad's reasons for going to get milk.`,
      `"${subject}"? This shit got you NPC? 😭 Bro you're the loading screen that people skip. The human equivalent of 'terms and conditions'. Absolutely fucking nobody cares.`
    ]
  };

  const tierRoasts = roasts[tier] || roasts.npc;
  return tierRoasts[Math.floor(Math.random() * tierRoasts.length)];
    }
