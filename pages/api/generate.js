// ========== STATELESS API - NO FS IMPORTS ==========

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
  comments: "End with challenge: 'Your move.', 'What's your excuse?'",
  shares: "Make relatable: 'Tag someone who needs this.'",
  saves: "Sound like wisdom: 'Remember this.'"
};

// ========== SYSTEM PROMPT (Psychological Laws + Instructions) ==========
const SYSTEM_PROMPT = `You are an elite Instagram caption writer who creates viral hooks using psychological triggers.

PSYCHOLOGICAL LAWS TO USE:
- Curiosity Gap: Leave something unsaid, create intrigue
- Loss Aversion: Show what they're losing by not acting
- Social Proof: "Everyone does X, but elite do Y"
- Contrast Principle: Before vs After, Old vs New
- Scarcity: "1% know this...", "Nobody tells you..."
- Authority: Sound like you've already made it
- Identity: Speak to who they want to become

STRICT OUTPUT RULES:
1. Respond ONLY with valid JSON
2. No explanations, no markdown, no extra text
3. Format: {"quick": "caption here", "closer": "caption here"}

QUICK FIRE RULES:
- MAXIMUM 10 words
- MAXIMUM 2 lines
- 2-3 hashtags at end
- Punch to the face energy
- Example: "Lost 10kg. Found my first million. #fitness #wealth"

CLOSER THREAD RULES:
- MAXIMUM 25 words
- MAXIMUM 4 lines
- Structure: Hook → Result → Short CTA (2-3 words)
- Exactly 2 hashtags at end
- Example: "I traded my 9-5 for a 5 AM lift. Now I'm leaner, richer, free.\\nYour move.\\n#viral #success"`;

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
  const MODEL = "jondurbin/airoboros-l2-13b-gpt4-m2.0";
  const HF_URL = "https://router.huggingface.co/v1/chat/completions";

  // Get tone and build context
  const tone = moodTones[mood] || "confident, punchy, impactful";
  const cleanDetails = details?.trim() || "";
  
  // Build CTA style from target goals
  let ctaStyle = "End with powerful 2-3 word statement.";
  if (targetGoals?.length > 0) {
    ctaStyle = targetGoals.map(g => goalToCTA[g]).filter(Boolean).join(" ");
  }

  // Build user message
  const hookBoost = scrollStopperHook ? "Make the first line an absolute SCROLL-STOPPER." : "";
  const hashtagNote = proTags ? "Include 3 trending hashtags." : "Include 2 hashtags.";

  const userMessage = `TOPIC: ${subject}
${cleanDetails ? `CONTEXT: ${cleanDetails}` : ""}
TONE: ${tone}
${hookBoost}
${hashtagNote}
CTA STYLE: ${ctaStyle}

Generate the two hooks now. Return ONLY JSON: {"quick": "...", "closer": "..."}`;

  let quickFireCaption = null;
  let closerThreadCaption = null;

  // ========== SINGLE API CALL WITH MESSAGES FORMAT ==========
  try {
    if (HF_API_KEY) {
      const response = await fetch(HF_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${HF_API_KEY}`
        },
        body: JSON.stringify({
          model: MODEL,
          messages: [
            {
              role: "system",
              content: SYSTEM_PROMPT
            },
            {
              role: "user", 
              content: userMessage
            }
          ],
          max_tokens: 200,
          temperature: 0.85,
          stream: false
        })
      });

      if (response.ok) {
        const data = await response.json();
        
        // ========== EXTRACT ONLY choices[0].message.content ==========
        const content = data?.choices?.[0]?.message?.content;
        
        if (content) {
          try {
            // Try direct JSON parse
            const parsed = JSON.parse(content.trim());
            quickFireCaption = cleanCaption(parsed.quick);
            closerThreadCaption = cleanCaption(parsed.closer);
          } catch (parseErr) {
            // Fallback: Extract JSON from response
            const jsonMatch = content.match(/\{[\s\S]*"quick"[\s\S]*"closer"[\s\S]*\}/);
            if (jsonMatch) {
              const parsed = JSON.parse(jsonMatch[0]);
              quickFireCaption = cleanCaption(parsed.quick);
              closerThreadCaption = cleanCaption(parsed.closer);
            } else {
              // Last resort: regex extraction
              const quickMatch = content.match(/"quick"\s*:\s*"([^"]+)"/);
              const closerMatch = content.match(/"closer"\s*:\s*"([^"]+)"/);
              if (quickMatch) quickFireCaption = cleanCaption(quickMatch[1]);
              if (closerMatch) closerThreadCaption = cleanCaption(closerMatch[1]);
            }
          }
        }
      } else {
        console.error("API Error:", response.status, response.statusText);
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

  // ========== RETURN ONLY ESSENTIAL DATA ==========
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
    .replace(/\\n/g, '\n')
    .replace(/^["']|["']$/g, '')
    .replace(/^(Caption:|Hook:|Quick Fire:|Closer Thread:)/gi, '')
    .trim();
}

// ========== FALLBACK: QUICK FIRE ==========
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
    aesthetic: `${subject}. Poetry in motion.\n\n#aesthetic #vibes`,
    happy: `${subject} is my therapy.\n\n#blessed #grateful`,
    alone: `${subject}. Just me. No distractions.\n\n#solo #focused`,
    breakup: `${subject} reminded me of my worth.\n\n#movingon #stronger`,
    romantic: `${subject} with you. That's the dream.\n\n#love #forever`,
    poetic: `${subject}. Where words fail, feelings speak.\n\n#poetry #soul`,
    sarcastic: `${subject}. Because normal is boring.\n\n#different #mood`,
    nostalgic: `${subject}. Some things never change.\n\n#memories #feels`,
    rebellious: `${subject}. Rules were made to break.\n\n#rebel #free`
  };
  return templates[mood] || `${subject}. No excuses. Just results.\n\n#grind #success`;
}

// ========== FALLBACK: CLOSER THREAD ==========
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
    aesthetic: `${subject} isn't just a vibe.\nIt's a lifestyle I chose.\nNo regrets.\n\n#aesthetic #living`,
    happy: `${subject} brings me pure joy.\nNo filter needed.\nThis is real.\n\n#happiness #authentic`,
    alone: `${subject} alone taught me more than crowds ever did.\nSolitude is power.\nTry it.\n\n#solo #growth`,
    breakup: `${subject} after heartbreak hits different.\nI'm not healing. I'm upgrading.\nWatch closely.\n\n#glow #revenge`,
    romantic: `${subject} with the right person?\nThat's not a moment. That's a lifetime.\nFound it.\n\n#love #soulmate`,
    poetic: `${subject} speaks when words can't.\nFeel it. Don't explain it.\nArt lives here.\n\n#poetry #deep`,
    sarcastic: `${subject} because apparently I love chaos.\nNo regrets though.\nWouldn't have it any other way.\n\n#mood #chaos`,
    nostalgic: `${subject} takes me back every time.\nSome feelings never fade.\nThey just wait.\n\n#memories #throwback`,
    rebellious: `${subject} because I was told not to.\nRules are suggestions.\nI make my own.\n\n#rebel #freedom`
  };
  return templates[mood] || `${subject} changed everything.\nNot overnight. But permanently.\nBest decision ever.\n\n#growth #success`;
}
