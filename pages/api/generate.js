// ========== NO FS IMPORTS - STATELESS API ==========

// Mood to tone mapping
const moodTones = {
  funny: "witty, sarcastic, unexpected punchline",
  fire: "aggressive, confident, alpha energy",
  aesthetic: "poetic, visual, dreamy but punchy",
  deep: "philosophical, thought-provoking",
  poetic: "rhythmic, metaphorical, lyrical",
  motivation: "inspirational, energizing, powerful",
  attitude: "cocky, unapologetic, boss energy",
  love: "romantic, genuine, heartfelt",
  breakup: "raw, moving on, stronger now",
  savage: "brutal honesty, no filter, cuts deep",
  sad: "melancholic, relatable pain",
  happy: "joyful, grateful, infectious",
  alone: "peaceful solitude, powerful independence",
  confident: "self-assured, quiet power",
  romantic: "passionate, intimate",
  sarcastic: "dry humor, clever irony",
  nostalgic: "bittersweet, emotional depth",
  rebellious: "rule-breaker, bold, defiant"
};

// Target goal to CTA mapping
const goalToCTA = {
  comments: "End with challenge/question: 'Your move.', 'What's your excuse?'",
  shares: "Make it relatable: 'Tag someone who needs this.'",
  saves: "Sound like wisdom: 'Remember this.', 'Save for later.'"
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { 
    subject, 
    mood, 
    details, 
    scrollStopperHook,
    proTags,
    targetGoals 
  } = req.body;

  if (!subject || !mood) {
    return res.status(400).json({ error: "Subject and mood required" });
  }

  const HF_API_KEY = process.env.HUGGINGFACE_API_KEY;
  const MODEL = "jondurbin/airoboros-l2-13b-gpt4-m2.0"; // UPGRADED MODEL
  const HF_URL = "https://api-inference.huggingface.co/models/" + MODEL;

  // Clean inputs
  const cleanDetails = details?.trim() || "";
  const tone = moodTones[mood] || "confident, punchy, impactful";
  
  // Build CTA style
  let ctaStyle = "End with a powerful 2-3 word statement.";
  if (targetGoals?.length > 0) {
    ctaStyle = targetGoals.map(g => goalToCTA[g]).filter(Boolean).join(" ");
  }

  // Extra instructions
  const hookBoost = scrollStopperHook ? "Make opening line an absolute SCROLL-STOPPER." : "";
  const hashtagCount = proTags ? "3 trending hashtags" : "2 hashtags";

  // ========== SINGLE CONSOLIDATED PROMPT ==========
  const consolidatedPrompt = `You are an elite Instagram caption writer. Generate viral hooks using psychological triggers.

TOPIC: ${subject}
${cleanDetails ? `CONTEXT: ${cleanDetails}` : ""}
TONE: ${tone}
${hookBoost}

PSYCHOLOGICAL TRIGGERS TO USE:
- Curiosity Gap (leave something unsaid)
- Loss Aversion (show what they're missing)
- Contrast (before vs after)
- Authority (sound like you've made it)
- Scarcity ("1% know this...")

TASK: Generate exactly 2 hooks in JSON format.

HOOK 1 - "quick" (Quick Fire):
- MAXIMUM 10 words
- MAXIMUM 2 lines  
- ${hashtagCount}
- Punch to the face energy
- Example: "Lost 10kg. Found my first million. #fitness #wealth"

HOOK 2 - "closer" (Closer Thread):
- MAXIMUM 25 words
- MAXIMUM 4 lines
- Structure: Hook → Result → Short CTA
- 2 hashtags only
- ${ctaStyle}
- Example: "I traded my 9-5 for a 5 AM lift. Now I'm leaner, richer, free.\\nYour move.\\n#viral #success"

RESPOND ONLY WITH THIS JSON FORMAT:
{"quick": "your quick fire caption here", "closer": "your closer thread caption here"}

NO EXPLANATIONS. ONLY JSON.`;

  let quickFireCaption = null;
  let closerThreadCaption = null;

  // ========== SINGLE API CALL ==========
  try {
    if (HF_API_KEY) {
      const response = await fetch(HF_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${HF_API_KEY}`,
          "x-use-cache": "true" // PREVENT REDUNDANT MODEL LOADING
        },
        body: JSON.stringify({
          inputs: consolidatedPrompt,
          parameters: {
            max_new_tokens: 220,      // OPTIMIZED TOKEN LIMIT
            temperature: 0.85,         // ELITE/SAVAGE PERSONALITY
            return_full_text: false,   // DON'T RETURN PROMPT
            do_sample: true
          }
        }),
      });

      if (response.ok) {
        const data = await response.json();
        
        // Extract generated text
        let generatedText = "";
        if (Array.isArray(data) && data[0]?.generated_text) {
          generatedText = data[0].generated_text;
        } else if (data?.generated_text) {
          generatedText = data.generated_text;
        } else if (typeof data === "string") {
          generatedText = data;
        }

        // Parse JSON from response
        if (generatedText) {
          try {
            // Find JSON in response
            const jsonMatch = generatedText.match(/\{[\s\S]*"quick"[\s\S]*"closer"[\s\S]*\}/);
            if (jsonMatch) {
              const parsed = JSON.parse(jsonMatch[0]);
              quickFireCaption = cleanCaption(parsed.quick);
              closerThreadCaption = cleanCaption(parsed.closer);
            }
          } catch (parseErr) {
            // Fallback: try to extract manually
            const quickMatch = generatedText.match(/"quick"\s*:\s*"([^"]+)"/);
            const closerMatch = generatedText.match(/"closer"\s*:\s*"([^"]+)"/);
            
            if (quickMatch) quickFireCaption = cleanCaption(quickMatch[1]);
            if (closerMatch) closerThreadCaption = cleanCaption(closerMatch[1]);
          }
        }
      }
    }
  } catch (err) {
    console.error("API call failed:", err.message);
  }

  // ========== SMART FALLBACKS ==========
  if (!quickFireCaption) {
    quickFireCaption = generateFallbackQuick(subject, mood);
  }
  if (!closerThreadCaption) {
    closerThreadCaption = generateFallbackCloser(subject, mood);
  }

  // ========== SANITIZED RESPONSE - ONLY ESSENTIAL DATA ==========
  return res.status(200).json({
    variants: [
      {
        caption: quickFireCaption,
        type: "short",
        label: "Quick Fire",
        premium: false
      },
      {
        caption: closerThreadCaption,
        type: "long",
        label: "Closer Thread",
        premium: true
      }
    ]
  });
}

// ========== HELPER: CLEAN CAPTION ==========
function cleanCaption(text) {
  if (!text) return null;
  return text
    .replace(/\\n/g, '\n')           // Convert escaped newlines
    .replace(/^["']|["']$/g, '')     // Remove wrapping quotes
    .replace(/^(Caption:|Hook:|Quick Fire:|Closer Thread:)/gi, '')
    .trim();
}

// ========== FALLBACK GENERATORS ==========
function generateFallbackQuick(subject, mood) {
  const templates = {
    fire: `${subject}? That's where empires are built.\n\n#elite #mindset`,
    motivation: `Started with ${subject}. Ended with millions.\n\n#growth #success`,
    attitude: `They talk. I dominate ${subject}.\n\n#boss #different`,
    deep: `${subject} taught me what schools couldn't.\n\n#wisdom #truth`,
    funny: `${subject} at 3 AM hits different.\n\n#mood #relatable`,
    savage: `Your excuses won't fix ${subject}.\n\n#facts #growth`,
    love: `${subject} changed how I see everything.\n\n#love #life`,
    sad: `${subject} broke me. Then rebuilt me.\n\n#healing #strength`,
    confident: `${subject}? I make it look easy.\n\n#built #different`,
    default: `${subject}. No excuses. Just results.\n\n#grind #success`
  };
  return templates[mood] || templates.default;
}

function generateFallbackCloser(subject, mood) {
  const templates = {
    fire: `Everyone talks about ${subject}. Few actually do it.\nI chose action over excuses.\nYour move.\n\n#discipline #elite`,
    motivation: `Started ${subject} when nobody believed.\nNow they all want the secret.\nThere is none. Just start.\n\n#motivation #growth`,
    attitude: `They laughed when I chose ${subject}.\nNow they're asking how.\nI don't share with doubters.\n\n#boss #winning`,
    deep: `${subject} taught me the hardest lesson.\nSuccess costs more than money.\nWorth every sacrifice.\n\n#wisdom #truth`,
    funny: `Tried ${subject} once.\nAlmost quit 47 times.\nStill here though.\n\n#struggle #mood`,
    savage: `${subject} separated dreamers from doers.\nGuess which one I am.\nResults speak.\n\n#facts #elite`,
    love: `${subject} showed me what matters.\nNot money. Not fame.\nJust this moment.\n\n#love #life`,
    sad: `${subject} broke something in me.\nBut broken things heal stronger.\nWatch me.\n\n#healing #comeback`,
    confident: `${subject}? Made it look effortless.\nIt wasn't. I just never complained.\nBuilt different.\n\n#elite #mindset`,
    default: `${subject} changed everything.\nNot overnight. But permanently.\nBest decision ever.\n\n#growth #success`
  };
  return templates[mood] || templates.default;
}
