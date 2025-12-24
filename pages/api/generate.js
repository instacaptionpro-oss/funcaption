import fs from "fs";
import path from "path";

const analyticsPath = path.join(process.cwd(), "data", "analytics.json");

function updateAnalytics() {
  try {
    const raw = fs.readFileSync(analyticsPath, "utf8");
    const data = JSON.parse(raw);

    const today = new Date().toISOString().slice(0, 10);

    data.total_requests += 1;
    data.by_day[today] = (data.by_day[today] || 0) + 1;

    fs.writeFileSync(analyticsPath, JSON.stringify(data, null, 2));
  } catch (err) {
    console.error("Analytics update failed:", err);
  }
}

// Mood to tone mapping
const moodTones = {
  funny: "witty, sarcastic, unexpected punchline, makes people smirk",
  fire: "aggressive, confident, alpha energy, powerful",
  aesthetic: "poetic, visual, dreamy but punchy, beautiful imagery",
  deep: "philosophical, thought-provoking, makes you pause and think",
  poetic: "rhythmic, metaphorical, lyrical flow",
  motivation: "inspirational, energizing, 'get up and do it' energy",
  attitude: "cocky, unapologetic, unbothered, boss energy",
  love: "romantic but not cringe, genuine, heartfelt",
  breakup: "raw, moving on energy, stronger now, no regrets",
  savage: "brutal honesty, no filter, cuts deep",
  sad: "melancholic, relatable pain, beautifully broken",
  happy: "joyful, grateful, infectious positivity",
  alone: "peaceful solitude, self-discovery, powerful independence",
  confident: "self-assured, unbothered, quiet power",
  romantic: "passionate, intimate, genuine connection",
  sarcastic: "dry humor, clever irony, smart wit",
  nostalgic: "bittersweet memories, time reflection, emotional depth",
  rebellious: "rule-breaker, against the norm, bold and defiant"
};

// Target goal to CTA style mapping
const goalToCTA = {
  comments: "End with a challenge or provocative question. Examples: 'Your move.', 'What's your excuse?', 'Prove me wrong.'",
  shares: "Make it universally relatable so people tag others. Examples: 'Tag someone who needs this.', 'Most people won't get this.'",
  saves: "Sound like valuable wisdom worth saving. Examples: 'Remember this.', 'Save this for when you need it.', 'This changes everything.'"
};

// Psychological laws reference
const psychLaws = `
PSYCHOLOGICAL LAWS TO USE:
- Curiosity Gap: Leave something unsaid, create intrigue
- Loss Aversion: Show what they're losing by not acting
- Social Proof: "Everyone does X, but elite do Y"
- Contrast Principle: Before vs After, Old vs New
- Scarcity: "1% know this...", "Nobody tells you..."
- Authority: Sound like you've already made it
- Identity: Speak to who they want to become
`;

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { 
    subject, 
    mood, 
    details, 
    feedback,
    scrollStopperHook,
    proTags,
    targetGoals 
  } = req.body;

  if (!subject || !mood) {
    return res.status(400).json({ error: "Subject and mood required" });
  }

  const HF_API_KEY = process.env.HUGGINGFACE_API_KEY;
  const MODEL = process.env.HUGGINGFACE_MODEL;
  const HF_URL = "https://router.huggingface.co/v1/chat/completions";

  // Clean inputs
  const cleanDetails = typeof details === "string" && details.trim().length > 0
    ? details.trim()
    : null;

  const cleanFeedback = typeof feedback === "string" && feedback.trim().length > 0
    ? feedback.trim()
    : null;

  if (cleanFeedback) {
    console.log("User feedback:", cleanFeedback);
  }

  // Get tone based on mood
  const tone = moodTones[mood] || "confident, punchy, impactful";

  // Get CTA style based on target goals
  let ctaStyle = "";
  if (targetGoals && targetGoals.length > 0) {
    const ctaInstructions = targetGoals.map(goal => goalToCTA[goal]).filter(Boolean);
    ctaStyle = ctaInstructions.join(" OR ");
  } else {
    ctaStyle = "End with a short, powerful statement that demands attention.";
  }

  // Extra context
  const extraContext = cleanDetails ? `Additional context: ${cleanDetails}` : "";

  // Hook enhancement instruction
  const hookEnhancement = scrollStopperHook 
    ? "Make the first line an absolute SCROLL-STOPPER. It should make someone freeze mid-scroll."
    : "";

  // Hashtag instruction
  const hashtagInstruction = proTags
    ? "Include 2-3 trending, relevant hashtags at the end."
    : "Include exactly 2 relevant hashtags at the end.";

  let quickFireCaption = null;
  let closerThreadCaption = null;

  try {
    if (HF_API_KEY && MODEL) {

      // ========== QUICK FIRE PROMPT ==========
      const quickFirePrompt = `
You are an elite Instagram caption writer who creates viral hooks using psychological triggers.

TASK: Write ONE "Quick Fire" hook for this topic.

TOPIC: ${subject}
MOOD/TONE: ${tone}
${extraContext}
${hookEnhancement}

${psychLaws}

STRICT RULES FOR QUICK FIRE:
1. MAXIMUM 10 words total
2. MAXIMUM 2 lines
3. Zero fluff - every word must PUNCH
4. Sound expensive, authoritative, elite
5. Use contrast, curiosity, or shock
6. ${hashtagInstruction}

CTA STYLE: ${ctaStyle}

EXAMPLES OF PERFECT QUICK FIRE HOOKS:
- "Gym saved my body. Then it saved my bank. #fitness #wealth"
- "Stop training for 'likes.' Start training for millions. #mindset #success"
- "Lost 10kg. Found my first million. #transformation #elite"
- "Your excuses are why you're still small. #truth #growth"

NOW WRITE ONE QUICK FIRE HOOK FOR: "${subject}"

RETURN ONLY THE CAPTION TEXT WITH HASHTAGS. NO EXPLANATIONS.
`;

      // ========== CLOSER THREAD PROMPT ==========
      const closerThreadPrompt = `
You are an elite Instagram caption writer who creates viral story hooks using psychological triggers.

TASK: Write ONE "Closer Thread" hook for this topic.

TOPIC: ${subject}
MOOD/TONE: ${tone}
${extraContext}
${hookEnhancement}

${psychLaws}

STRICT RULES FOR CLOSER THREAD:
1. MAXIMUM 25 words total (excluding hashtags)
2. MAXIMUM 4 lines
3. Structure: Hook Statement → Transformation/Result → Short CTA (2-3 words)
4. Sound expensive, not desperate
5. Every word must earn its place
6. Include exactly 2 hashtags at the end

CTA STYLE: ${ctaStyle}

EXAMPLES OF PERFECT CLOSER THREAD HOOKS:
- "I traded my 9-5 for a 5 AM lift. Now I'm leaner, richer, and finally free.
Your move.
#viral #success"

- "Most people fail because they play it safe. I chose power, and my profits tripled.
Stop waiting.
#beastmode #wealth"

- "Fitness isn't just about muscle; it's about the million-dollar mindset. I fixed my body, then I fixed my life.
#discipline #growth"

NOW WRITE ONE CLOSER THREAD HOOK FOR: "${subject}"

RETURN ONLY THE CAPTION TEXT WITH HASHTAGS. NO EXPLANATIONS.
`;

      // Fetch Quick Fire
      const quickFireResponse = await fetch(HF_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${HF_API_KEY}`,
        },
        body: JSON.stringify({
          model: MODEL,
          messages: [{ role: "user", content: quickFirePrompt }],
          max_tokens: 80,
          temperature: 0.8,
        }),
      });

      if (quickFireResponse.ok) {
        const data = await quickFireResponse.json();
        const text = data?.choices?.[0]?.message?.content || "";
        if (text && text.trim().length > 5) {
          quickFireCaption = text.trim()
            .replace(/^["']|["']$/g, '') // Remove quotes
            .replace(/^(Quick Fire:|Caption:|Hook:)/i, '') // Remove labels
            .trim();
        }
      }

      // Fetch Closer Thread
      const closerThreadResponse = await fetch(HF_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${HF_API_KEY}`,
        },
        body: JSON.stringify({
          model: MODEL,
          messages: [{ role: "user", content: closerThreadPrompt }],
          max_tokens: 120,
          temperature: 0.8,
        }),
      });

      if (closerThreadResponse.ok) {
        const data = await closerThreadResponse.json();
        const text = data?.choices?.[0]?.message?.content || "";
        if (text && text.trim().length > 5) {
          closerThreadCaption = text.trim()
            .replace(/^["']|["']$/g, '') // Remove quotes
            .replace(/^(Closer Thread:|Caption:|Hook:|Story:)/i, '') // Remove labels
            .trim();
        }
      }
    }
  } catch (err) {
    console.error("Caption generation failed:", err);
  }

  // ========== FALLBACK CAPTIONS ==========
  
  // Generate smart fallbacks based on mood
  const fallbackQuickFire = generateFallbackQuickFire(subject, mood);
  const fallbackCloserThread = generateFallbackCloserThread(subject, mood);

  // ========== BUILD RESPONSE ==========
  const variants = [
    {
      caption: quickFireCaption || fallbackQuickFire,
      type: "short",
      label: "Quick Fire",
      premium: false
    },
    {
      caption: closerThreadCaption || fallbackCloserThread,
      type: "long",
      label: "Closer Thread",
      premium: true
    }
  ];

  // Update analytics
  updateAnalytics();

  return res.status(200).json({ variants });
}

// ========== FALLBACK GENERATORS ==========

function generateFallbackQuickFire(subject, mood) {
  const templates = {
    fire: [
      `${subject}? That's where champions are made.\n\n#elite #mindset`,
      `They doubted ${subject}. I made it my empire.\n\n#winning #growth`
    ],
    motivation: [
      `${subject} changed my life. Now it's your turn.\n\n#motivation #success`,
      `Started with ${subject}. Ended with millions.\n\n#journey #growth`
    ],
    attitude: [
      `${subject}? I don't explain. I just dominate.\n\n#boss #attitude`,
      `They talk. I do ${subject}. Different.\n\n#elite #mindset`
    ],
    deep: [
      `${subject} taught me what books couldn't.\n\n#wisdom #life`,
      `The truth about ${subject}? Nobody's ready.\n\n#truth #deep`
    ],
    funny: [
      `${subject} hits different at 3 AM.\n\n#relatable #mood`,
      `Me trying ${subject}: Chapter 47.\n\n#struggle #funny`
    ],
    default: [
      `${subject}. No excuses. Just results.\n\n#grind #success`,
      `They sleep. I focus on ${subject}.\n\n#elite #different`
    ]
  };

  const moodTemplates = templates[mood] || templates.default;
  return moodTemplates[Math.floor(Math.random() * moodTemplates.length)];
}

function generateFallbackCloserThread(subject, mood) {
  const templates = {
    fire: [
      `Everyone's talking about ${subject}. Few are actually doing it.\nI chose action over excuses.\nYour move.\n\n#discipline #success`,
      `${subject} separated the dreamers from the doers.\nI know which side I'm on.\nDo you?\n\n#elite #mindset`
    ],
    motivation: [
      `I started ${subject} when nobody believed in me.\nNow they all want to know the secret.\nThere is none. Just start.\n\n#motivation #growth`,
      `${subject} was my rock bottom moment.\nIt became my foundation.\nEverything changed.\n\n#transformation #success`
    ],
    attitude: [
      `They laughed when I chose ${subject}.\nNow they're asking how I did it.\nI don't share secrets with doubters.\n\n#boss #attitude`,
      `${subject}? I made it look easy.\nIt wasn't. I just never complained.\nBuilt different.\n\n#elite #mindset`
    ],
    deep: [
      `${subject} taught me the hardest lesson.\nSuccess costs more than money.\nBut it's worth every sacrifice.\n\n#wisdom #truth`,
      `The truth about ${subject}?\nIt reveals who you really are.\nNot everyone's ready for that mirror.\n\n#deep #growth`
    ],
    funny: [
      `Tried ${subject} once.\nAlmost gave up 47 times.\nStill here though.\n\n#struggle #relatable`,
      `My relationship with ${subject}?\nIt's complicated.\nBut we're making it work.\n\n#mood #life`
    ],
    default: [
      `${subject} changed everything for me.\nNot overnight. But permanently.\nBest decision I ever made.\n\n#growth #success`,
      `Started ${subject} with zero experience.\nNow it's my unfair advantage.\nStop waiting. Start doing.\n\n#journey #elite`
    ]
  };

  const moodTemplates = templates[mood] || templates.default;
  return moodTemplates[Math.floor(Math.random() * moodTemplates.length)];
  }
