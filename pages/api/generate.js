// ========== SAVAGE ENGINE v2.0 - HOOK GENERATION ==========

import { OpenAI } from "openai";

const moodTones = {
  funny: "witty, playful, viral",
  fire: "aggressive, confident, alpha",
  aesthetic: "poetic, visual, dreamy",
  deep: "philosophical, thought-provoking",
  poetic: "rhythmic, metaphorical, lyrical",
  motivation: "inspirational, energizing, powerful",
  attitude: "cocky, unapologetic, bold",
  love: "romantic, genuine, heartfelt",
  breakup: "raw, moving on, stronger",
  savage: "brutal honesty, no filter",
  sad: "melancholic, relatable pain",
  happy: "joyful, grateful, infectious",
  alone: "peaceful solitude, independent",
  confident: "self-assured, quiet power",
  romantic: "passionate, intimate",
  sarcastic: "dry humor, clever irony",
  nostalgic: "bittersweet, emotional",
  rebellious: "rule-breaker, bold, defiant"
};

const goalToCTA = {
  comments: "End with: 'Your move.'",
  shares: "Make relatable: 'Tag someone'",
  saves: "Sound like wisdom: 'Remember this'"
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
  let ctaStyle = targetGoals?.length > 0 ? targetGoals.map(g => goalToCTA[g]).filter(Boolean).join(" ") : "End with powerful statement";
  const hookBoost = scrollStopperHook ? "Make first line VIRAL." : "";
  const hashtagNote = proTags ? "3 trending hashtags" : "2 hashtags";

  // PROMPT FOR BOTH HOOKS IN ONE CALL
  const systemMessage = `You are a world-class social media hook writer.
Create scroll-stopping content for Instagram/TikTok.
Rules:
1. Return ONLY JSON: {"quick": "...", "closer": "..."}
2. No explanations
3. quick: 3 lines MAX, catchy, no "I" or "my", simple English, deep meaning, with hashtags
4. closer: 5 lines MAX, with hashtags
5. Style: ${tone}, viral, high-impact`;

  const userMessage = `Create BOTH hooks in ONE response:
Topic: ${subject}
Context: ${cleanDetails}
${hookBoost}
${ctaStyle}
Include ${hashtagNote}`;

  let quickFireCaption = null;
  let closerThreadCaption = null;

  try {
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

    // SINGLE CALL FOR BOTH RESULTS
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
      temperature: 0.9,
      max_tokens: 200,
      stop: ["\n\n\n"]
    });

    const content = chatCompletion.choices[0]?.message?.content;
    
    if (content) {
      const jsonMatch = content.match(/\{[^{}]*\}/);
      if (jsonMatch) {
        try {
          const parsed = JSON.parse(jsonMatch[0]);
          quickFireCaption = cleanCaption(parsed.quick);
          closerThreadCaption = cleanCaption(parsed.closer);
        } catch (parseError) {
          console.error("JSON Parse Error:", parseError);
        }
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

function cleanCaption(text) {
  if (!text) return null;
  return text.replace(/\\n/g, '\n').replace(/^["']|["']$/g, '').trim();
}

// Simple fallback generators
function generateFallbackQuick(subject, mood) {
  const hooks = {
    funny: `When ${subject} hits different 😂\nReality check unlocked\nTag your friend who needs this\n#funny #viral`,
    fire: `${subject} level: UNMATCHED 🔥\nBuilt different energy\nWatch me work\n#grind #success`,
    aesthetic: `${subject} in its element ✨\nPure visual poetry\nFeel the moment\n#aesthetic #art`,
    deep: `What ${subject} taught me 🧠\nSurface is illusion\nDepth is truth\n#deep #thoughts`,
    savage: `${subject} truth drops 🐍\nNo sugar coating\nJust facts\n#savage #real`,
    motivation: `${subject} is my language 🚀\nDreams to reality\nNo shortcuts taken\n#motivation # grind`
  };
  return hooks[mood] || `${subject} changed everything\nSimple but powerful\nLevel up time\n#mindset #growth`;
}

function generateFallbackCloser(subject, mood) {
  const threads = {
    funny: `When ${subject} goes wrong:\n- Expectations vs Reality\n- People lose their minds\n- I just laugh it off\n- Life lesson learned\n#funny #relatable`,
    fire: `${subject} mastery:\n- See opportunity\n- Take massive action\n- Deliver results\n- Move to next level\n- That's how champions built\n#grind #success`,
    aesthetic: `My ${subject} moment:\n- Perfect timing\n- Raw emotion captured\n- No filters needed\n- Pure authenticity\n- Art in motion\n#aesthetic #art`,
    deep: `The ${subject} revelation:\n- Everyone chases surface\n- I went deeper\n- Found hidden truth\n- Everything changed\n- Wisdom earned\n#deep #enlightenment`,
    savage: `${subject} reality check:\n- They make excuses\n- I make progress\n- Results don't lie\n- Comparison is theft\n- Your move.\n#savage #truth`,
    motivation: `My ${subject} journey:\n- Started from nothing\n- Stayed consistent daily\n- Built momentum\n- Made impact\n- Still climbing higher\n#motivation #growth`
  };
  return threads[mood] || `About ${subject}:\n- Most people fake it\n- I make it real\n- Difference is obvious\n- Execution matters\n- Watch me work\n#mindset #success`;
}
