// ========== SAVAGE ENGINE v2.0 - HOOK GENERATION MODE ==========

import { OpenAI } from "openai";

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

  // OPTIMIZED PROMPT FOR INSTAGRAM HOOKS
  const systemMessage = `You are a elite Instagram hook writer. Create viral content that stops scrolls.
Rules: 
1. Return ONLY valid JSON: {"quick": "...", "closer": "..."}
2. No explanations or extra text.
3. quick: 1-2 lines hook (max 80 chars)
4. closer: 2-4 lines thread (max 200 chars)
5. Style: ${tone}, savage, high-status`;

  const userMessage = `Create Instagram hooks for: ${subject}
Context: ${cleanDetails}
${hookBoost}
${ctaStyle}
Include ${hashtagNote}
Return ONLY JSON format.`;

  let quickFireCaption = null;
  let closerThreadCaption = null;

  try {
    // Use OpenAI SDK with Hugging Face Router
    const HF_TOKEN = process.env.HF_TOKEN || process.env.HUGGINGFACE_API_KEY;
    const MODEL_ID = process.env.HUGGINGFACE_MODEL || "openai/gpt-oss-120b:groq";
    
    if (!HF_TOKEN) {
      console.error("No API token found");
      return res.status(500).json({ error: "API token not configured" });
    }

    const client = new OpenAI({
      baseURL: "https://router.huggingface.co/v1",
      apiKey: HF_TOKEN,
    });

    const chatCompletion = await client.chat.completions.create({
      model: MODEL_ID,
      messages: [
        {
          role: "system",
          content: systemMessage,
        },
        {
          role: "user",
          content: userMessage,
        },
      ],
      temperature: 0.85,
      max_tokens: 200,
      stop: ["\n\n\n", "###"]
    });

    const content = chatCompletion.choices[0]?.message?.content;
    
    if (content) {
      // Extract JSON more reliably
      const jsonMatch = content.match(/\{[^{}]*\}/);  // Simpler JSON matching
      if (jsonMatch) {
        try {
          const parsed = JSON.parse(jsonMatch[0]);
          quickFireCaption = cleanCaption(parsed.quick);
          closerThreadCaption = cleanCaption(parsed.closer);
        } catch (parseError) {
          console.error("JSON Parse Error:", parseError);
          // Fallback extraction if JSON fails
          quickFireCaption = extractQuickHook(content);
          closerThreadCaption = extractCloserThread(content);
        }
      } else {
        // Manual extraction if no JSON found
        quickFireCaption = extractQuickHook(content);
        closerThreadCaption = extractCloserThread(content);
      }
    }

  } catch (err) {
    console.error("Logic Error:", err.message);
    return res.status(500).json({ error: `Server Error: ${err.message}` });
  }

  // FAILSAFE FALLBACKS
  if (!quickFireCaption) {
    quickFireCaption = generateFallbackQuick(subject, mood);
  }
  if (!closerThreadCaption) {
    closerThreadCaption = generateFallbackCloser(subject, mood);
  }

  return res.status(200).json({
    variants: [
      { caption: quickFireCaption, type: "short", label: "Quick Fire" },
      { caption: closerThreadCaption, type: "long", label: "Closer Thread" }
    ]
  });
}

// Helper functions for better extraction
function cleanCaption(text) {
  if (!text) return null;
  return text.replace(/\\n/g, '\n').replace(/^["']|["']$/g, '').trim();
}

function extractQuickHook(content) {
  if (!content) return null;
  // Try to find something that looks like a hook
  const lines = content.split('\n').filter(line => line.trim().length > 0);
  return lines[0] ? lines[0].substring(0, 80) + (lines[0].length > 80 ? '...' : '') : null;
}

function extractCloserThread(content) {
  if (!content) return null;
  const lines = content.split('\n').filter(line => line.trim().length > 0);
  const threadLines = lines.slice(0, 4); // Take up to 4 lines
  return threadLines.join('\n').substring(0, 200);
}

// Better fallback generators
function generateFallbackQuick(subject, mood) {
  const hooks = {
    funny: `${subject}? More like ${subject} jokes! 😂`,
    fire: `${subject} while others sleep. That's the difference. 🔥`,
    aesthetic: `${subject} in its purest form ✨`,
    deep: `They don't understand ${subject} like I do 🧠`,
    savage: `Everyone talks about ${subject}. I own it. 🐍`,
    motivation: `${subject} is my warm-up. Ready? 🚀`
  };
  return hooks[mood] || `${subject}. Built different. #mindset`;
}

function generateFallbackCloser(subject, mood) {
  const threads = {
    funny: `${subject}?\n- Wake up\n- Do it\n- Flex results\n- Repeat\nSimple.`,
    fire: `${subject} isn't about trying hard.\nIt's about making it look easy.\nWatch me work.`,
    aesthetic: `${subject} captured perfectly.\nSome call it luck.\nI call it intentional.`,
    deep: `${subject} taught me one thing:\nSurface level wins fade.\nReal depth lasts forever.`,
    savage: `Everyone has an opinion on ${subject}.\nMine? I don't ask permission.\nI deliver results.`,
    motivation: `${subject} separates dreamers from builders.\nWhich one are you?\nYour answer determines everything.`
  };
  return threads[mood] || `Most chase ${subject}.\nFew understand it.\nNone execute like me.\n#success #grind`;
                                   }
