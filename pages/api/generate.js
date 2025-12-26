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
  const systemMessage = `You are a Savage 2025 Instagram ghostwriter. Rules: 
1. Return ONLY JSON: {"quick": "...", "closer": "..."}
2. No chatter. 
3. Style: Savage, viral, high-status.
4. Avoid AI-isms like delve, unlock, or tapestry.`;

  const userMessage = `Topic: ${subject}. Context: ${cleanDetails}. Tone: ${tone}. ${hookBoost}. ${ctaStyle}. Tags: ${hashtagNote}`;

  let quickFireCaption = null;
  let closerThreadCaption = null;

  try {
    // Use the Hugging Face API key from environment variables
    const HF_TOKEN = process.env.HUGGINGFACE_API_KEY || "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";
    const MODEL_ID = process.env.HUGGINGFACE_MODEL || "openai/gpt-oss-120b:groq";
    
    console.log("Using API token present:", !!HF_TOKEN);
    console.log("Using model:", MODEL_ID);
    
    if (!HF_TOKEN) {
      console.error("No API token found");
      return res.status(500).json({ error: "API token not configured" });
    }

    // Updated to use OpenAI SDK via Hugging Face Router v1 with correct format
    const response = await fetch(
      `https://router.huggingface.co/v1/chat/completions`,
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${HF_TOKEN}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: MODEL_ID,
          messages: [
            { role: "system", content: systemMessage },
            { role: "user", content: userMessage }
          ],
          temperature: 0.9,
          max_tokens: 150,
          reasoning: { effort: "low" } // Kill thinking (reasoning) for instant responses
        })
      }
    );

    console.log("Response status:", response.status);
    
    if (response.ok) {
      const data = await response.json();
      const content = data.choices && data.choices[0] && data.choices[0].message ? data.choices[0].message.content : null;
      
      console.log(`[API SUCCESS] Savage content ready for: ${subject}`);

      if (content) {
        // Try to extract JSON from the response
        const jsonMatch = content.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          try {
            const parsed = JSON.parse(jsonMatch[0]);
            quickFireCaption = cleanCaption(parsed.quick);
            closerThreadCaption = cleanCaption(parsed.closer);
          } catch (parseError) {
            console.error("JSON Parse Error:", parseError);
            // Fallback: use the raw content if JSON parsing fails
            quickFireCaption = content.substring(0, 100) + "...";
            closerThreadCaption = content;
          }
        } else {
          // If no JSON found, use the raw content
          quickFireCaption = content.substring(0, 100) + "...";
          closerThreadCaption = content;
        }
      }
    } else {
      const errorText = await response.text();
      console.error("Inference Error:", response.status, errorText);
      return res.status(response.status).json({ 
        error: `API Error: ${response.status} - ${errorText}`,
        debug: {
          tokenPresent: !!HF_TOKEN,
          model: MODEL_ID,
          responseStatus: response.status
        }
      });
    }
  } catch (err) {
    console.error("Logic Error:", err.message);
    return res.status(500).json({ error: `Server Error: ${err.message}` });
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
