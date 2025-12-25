// ========== SAVAGE ENGINE v2.0 - DIRECT INFERENCE MODE ==========

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

  // THE PERSONA PROMPT
  const systemMessage = `You are an elite Instagram writer. Rules: 
1. Return ONLY JSON: {"quick": "...", "closer": "..."}
2. No chatter. 
3. Style: Savage, viral, high-status.`;

  const userMessage = `Topic: ${subject}. Context: ${cleanDetails}. Tone: ${tone}. ${hookBoost}. ${ctaStyle}. Tags: ${hashtagNote}`;

  let quickFireCaption = null;
  let closerThreadCaption = null;

  try {
    const HF_TOKEN = process.env.HF_TOKEN || process.env.HUGGINGFACE_API_KEY;
    
    if (HF_TOKEN) {
      // DIRECT INFERENCE ENDPOINT (Bypasses "Chat Model" Errors)
      const response = await fetch(
        `https://api-inference.huggingface.co/models/jondurbin/airoboros-l2-13b-gpt4-m2.0`,
        {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${HF_TOKEN}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            inputs: `### Instruction: ${systemMessage}\n${userMessage}\n### Response:`,
            parameters: {
              max_new_tokens: 250,
              temperature: 0.8,
              stop: ["###"]
            }
          })
        }
      );

      if (response.ok) {
        const data = await response.json();
        const content = Array.isArray(data) ? data[0].generated_text : data.generated_text;
        
        console.log(`[API SUCCESS] Savage content ready for: ${subject}`);

        if (content) {
          const jsonMatch = content.match(/\{[\s\S]*\}/);
          if (jsonMatch) {
            const parsed = JSON.parse(jsonMatch[0]);
            quickFireCaption = cleanCaption(parsed.quick);
            closerThreadCaption = cleanCaption(parsed.closer);
          }
        }
      } else {
        console.error("Inference Error:", response.status);
      }
    }
  } catch (err) {
    console.error("Logic Error:", err.message);
  }

  // FAILSAFE FALLBACKS (If API is slow or fails)
  if (!quickFireCaption) {
    quickFireCaption = `${subject}. While they talk, I build. #mindset #elite`;
  }
  if (!closerThreadCaption) {
    closerThreadCaption = `Most people want the prize without the process of ${subject}. I'm built differently. Watch me work. #success #discipline`;
  }

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
