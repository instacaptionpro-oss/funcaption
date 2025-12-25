// ========== STATELESS API - NO EXTERNAL PACKAGES ==========

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

const goalToCTA = {
  comments: "End with challenge: 'Your move.'",
  shares: "Make relatable: 'Tag someone.'",
  saves: "Sound like wisdom: 'Remember this.'"
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { subject, mood, details, scrollStopperHook, proTags, targetGoals } = req.body;

  if (!subject || !mood) {
    return res.status(400).json({ error: "Subject and mood required" });
  }

  const tone = moodTones[mood] || "confident, punchy, impactful";
  const cleanDetails = details?.trim() || "";
  let ctaStyle = targetGoals?.length > 0 ? targetGoals.map(g => goalToCTA[g]).filter(Boolean).join(" ") : "End with powerful 2-3 word statement.";
  const hookBoost = scrollStopperHook ? "Make first line a SCROLL-STOPPER." : "";
  const hashtagNote = proTags ? "3 trending hashtags." : "2 hashtags.";

  const systemMessage = `You are an elite Instagram caption writer. 
STRICT RULES:
- Return ONLY valid JSON: {"quick": "...", "closer": "..."}
- No markdown, no explanations.
- quick = max 10 words, ${hashtagNote}
- closer = max 25 words, 2 hashtags`;

  const userMessage = `Generate savage captions for:
Topic: ${subject}
Context: ${cleanDetails}
Tone: ${tone}
${hookBoost}
${ctaStyle}

Return JSON only:`;

  let quickFireCaption = null;
  let closerThreadCaption = null;

  try {
    const HF_TOKEN = process.env.HF_TOKEN || process.env.HUGGINGFACE_API_KEY;
    
    if (HF_TOKEN) {
      const response = await fetch(
        "https://router.huggingface.co/v1/chat/completions",
        {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${HF_TOKEN}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            model: "jondurbin/airoboros-l2-13b-gpt4-m2.0",
            provider: "featherless-ai",
            messages: [
              { role: "system", content: systemMessage },
              { role: "user", content: userMessage }
            ],
            max_tokens: 250,
            temperature: 0.8
          })
        }
      );

      if (response.ok) {
        const data = await response.json();
        const content = data?.choices?.[0]?.message?.content || "";
        console.log(`[API SUCCESS] Generated for: ${subject}`);

        if (content) {
          const jsonMatch = content.match(/\{[\s\S]*\}/);
          if (jsonMatch) {
            const parsed = JSON.parse(jsonMatch[0]);
            quickFireCaption = cleanCaption(parsed.quick);
            closerThreadCaption = cleanCaption(parsed.closer);
          }
        }
      } else {
        const errorText = await response.text();
        console.error("API Error 400:", errorText);
      }
    }
  } catch (err) {
    console.error("Fetch error:", err.message);
  }

  // FALLBACKS
  if (!quickFireCaption) quickFireCaption = generateFallbackQuick(subject, mood);
  if (!closerThreadCaption) closerThreadCaption = generateFallbackCloser(subject, mood);

  return res.status(200).json({
    variants: [
      { caption: quickFireCaption, type: "short", label: "Quick Fire" },
      { caption: closerThreadCaption, type: "long", label: "Closer Thread" }
    ]
  });
}

function cleanCaption(text) {
  if (!text) return null;
  return text.replace(/\\n/g, '\n').replace(/^["']|["']$/g, '').trim();
}

function generateFallbackQuick(subject, mood) {
  return `${subject}. Different breed.\n\n#grind #success`;
}

function generateFallbackCloser(subject, mood) {
  return `While they talk about ${subject}, I'm building it.\nWatch the results speak for me.\n\n#alpha #growth`;
}
