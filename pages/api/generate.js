// ========== STATELESS API - NO EXTERNAL PACKAGES ==========

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
  comments: "End with challenge: 'Your move.'",
  shares: "Make relatable: 'Tag someone.'",
  saves: "Sound like wisdom: 'Remember this.'"
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

  // Build context
  const tone = moodTones[mood] || "confident, punchy, impactful";
  const cleanDetails = details?.trim() || "";
  
  // Build CTA style
  let ctaStyle = "End with powerful 2-3 word statement.";
  if (targetGoals?.length > 0) {
    ctaStyle = targetGoals.map(g => goalToCTA[g]).filter(Boolean).join(" ");
  }

  // Build enhancements
  const hookBoost = scrollStopperHook ? "Make first line a SCROLL-STOPPER." : "";
  const hashtagNote = proTags ? "3 trending hashtags." : "2 hashtags.";

  // System message with psychological laws
  const systemMessage = `You are an elite Instagram caption writer using psychological triggers.

PSYCHOLOGICAL LAWS:
- Curiosity Gap: Leave something unsaid
- Loss Aversion: Show what they're missing  
- Contrast: Before vs After
- Authority: Sound successful
- Scarcity: "1% know this..."

STRICT RULES:
- Return ONLY valid JSON: {"quick": "...", "closer": "..."}
- No explanations, no markdown, no extra text
- quick = max 10 words, 2 lines, ${hashtagNote}
- closer = max 25 words, 4 lines, 2 hashtags`;

  // User message with topic
  const userMessage = `Generate captions for:
Topic: ${subject}
${cleanDetails ? `Context: ${cleanDetails}` : ""}
Tone: ${tone}
${hookBoost}
${ctaStyle}

Examples:
quick: "Lost 10kg. Found my first million. #fitness #wealth"
closer: "I traded my 9-5 for a 5 AM lift. Now I'm leaner, richer, free.
Your move.
#viral #success"

Return JSON only:`;

  let quickFireCaption = null;
  let closerThreadCaption = null;

  // ========== TRY HUGGINGFACE API ==========
  try {
    const HF_TOKEN = process.env.HF_TOKEN || process.env.HUGGINGFACE_API_KEY;
    
    if (HF_TOKEN) {
      // Using chat completions endpoint
      const response = await fetch(
        "https://router.huggingface.co/v1/chat/completions",
        {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${HF_TOKEN}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            model: "mistralai/Mistral-7B-Instruct-v0.2",
            messages: [
              { role: "system", content: systemMessage },
              { role: "user", content: userMessage }
            ],
            max_tokens: 200,
            temperature: 0.8,
            stream: false
          })
        }
      );

      if (response.ok) {
        const data = await response.json();
        
        // Extract content from chat completion response
        const content = data?.choices?.[0]?.message?.content || "";

        if (content) {
          try {
            // Try direct JSON parse
            const parsed = JSON.parse(content.trim());
            quickFireCaption = cleanCaption(parsed.quick);
            closerThreadCaption = cleanCaption(parsed.closer);
          } catch (parseErr) {
            // Fallback: Find JSON in response
            const jsonMatch = content.match(/\{[\s\S]*"quick"[\s\S]*"closer"[\s\S]*\}/);
            if (jsonMatch) {
              const parsed = JSON.parse(jsonMatch[0]);
              quickFireCaption = cleanCaption(parsed.quick);
              closerThreadCaption = cleanCaption(parsed.closer);
            } else {
              // Last resort: Regex extraction
              const quickMatch = content.match(/"quick"\s*:\s*"([^"]+)"/);
              const closerMatch = content.match(/"closer"\s*:\s*"([^"]+)"/);
              if (quickMatch) quickFireCaption = cleanCaption(quickMatch[1]);
              if (closerMatch) closerThreadCaption = cleanCaption(closerMatch[1]);
            }
          }
        }
      } else {
        const errorText = await response.text();
        console.error("API Error:", response.status, errorText);
      }
    }
  } catch (err) {
    console.error("Fetch error:", err.message);
  }

  // ========== SMART FALLBACKS ==========
  if (!quickFireCaption) {
    quickFireCaption = generateFallbackQuick(subject, mood);
  }
  if (!closerThreadCaption) {
    closerThreadCaption = generateFallbackCloser(subject, mood);
  }

  // ========== CLEAN RESPONSE ==========
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
  const t = {
    fire: `${subject}? That's where empires are built.\n\n#elite #mindset`,
    motivation: `Started with ${subject}. Ended with millions.\n\n#growth #success`,
    attitude: `They talk. I dominate ${subject}.\n\n#boss #different`,
    deep: `${subject} taught me what schools couldn't.\n\n#wisdom #truth`,
    funny: `${subject} at 3 AM hits different.\n\n#mood #relatable`,
    savage: `Your excuses won't fix ${subject}.\n\n#facts #growth`,
    love: `${subject} changed everything.\n\n#love #life`,
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
  return t[mood] || `${subject}. No excuses. Just results.\n\n#grind #success`;
}

// ========== FALLBACK: CLOSER THREAD ==========
function generateFallbackCloser(subject, mood) {
  const t = {
    fire: `Everyone talks about ${subject}. Few actually do it.\nI chose action.\nYour move.\n\n#discipline #elite`,
    motivation: `Started ${subject} when nobody believed.\nNow they want the secret.\nJust start.\n\n#motivation #growth`,
    attitude: `They laughed at my ${subject}.\nNow they're asking how.\nI don't share.\n\n#boss #winning`,
    deep: `${subject} taught me the hardest lesson.\nSuccess costs everything.\nWorth it.\n\n#wisdom #truth`,
    funny: `Tried ${subject} once.\nAlmost quit 47 times.\nStill here.\n\n#struggle #mood`,
    savage: `${subject} separated dreamers from doers.\nGuess which one I am.\n\n#facts #elite`,
    love: `${subject} showed me what matters.\nNot fame. Not money.\nJust this.\n\n#love #life`,
    sad: `${subject} broke something in me.\nBroken things heal stronger.\nWatch me.\n\n#healing #comeback`,
    confident: `${subject}? Made it look easy.\nIt wasn't. Never complained.\nBuilt different.\n\n#elite #mindset`,
    aesthetic: `${subject} isn't just a vibe.\nIt's a lifestyle.\nNo regrets.\n\n#aesthetic #living`,
    happy: `${subject} brings pure joy.\nNo filter needed.\nThis is real.\n\n#happiness #authentic`,
    alone: `${subject} alone taught me more than crowds.\nSolitude is power.\n\n#solo #growth`,
    breakup: `${subject} after heartbreak hits different.\nNot healing. Upgrading.\n\n#glow #revenge`,
    romantic: `${subject} with the right person?\nNot a moment. A lifetime.\n\n#love #soulmate`,
    poetic: `${subject} speaks when words can't.\nFeel it. Don't explain.\n\n#poetry #deep`,
    sarcastic: `${subject} because I love chaos.\nNo regrets though.\n\n#mood #chaos`,
    nostalgic: `${subject} takes me back.\nSome feelings never fade.\n\n#memories #throwback`,
    rebellious: `${subject} because I was told not to.\nI make my own rules.\n\n#rebel #freedom`
  };
  return t[mood] || `${subject} changed everything.\nNot overnight. Permanently.\nBest decision.\n\n#growth #success`;
}
