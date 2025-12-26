// ========== SAVAGE ENGINE v2.0 - SINGLE CALL HOOK GENERATION ==========

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

  // SINGLE PROMPT THAT GETS BOTH RESULTS AT ONCE
  const systemMessage = `Role: World-class social media hook writer.
Core Task: Generate scroll-stopping, first-person hooks for Instagram/TikTok.
Critical Rules:
- ALWAYS use first-person perspective (I/me/my). This is non-negotiable.
- NEVER use generic AI phrases: "unlock potential," "journey of," "dive into," "elevate your," etc.
- Match the requested Mood perfectly: "Aesthetic" = visual & elegant, "Attitude" = bold & confident.
- Format exactly:
  • "Quick Fire": 1-2 lines, punchy, immediate.
  • "Close Thread": 2-4 lines, narrative, conclusive.
- Output ONLY the hook text. No explanations. Make it like send ai this once and add hastag and say it to not give instructions to user genarte like user should feel that by using this i will leval up`;

  const userMessage = `Create both hooks in ONE response:
Topic: ${subject}
Context: ${cleanDetails}
Tone: ${tone}
${hookBoost}
${ctaStyle}
Include ${hashtagNote}`;

  let quickFireCaption = null;
  let closerThreadCaption = null;

  try {
    // Use OpenAI SDK with Hugging Face Router - SINGLE CALL
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

    // SINGLE API CALL TO GET BOTH RESULTS
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
      // Extract both Quick Fire and Close Thread from single response
      const jsonMatch = content.match(/\{[^{}]*\}/);
      if (jsonMatch) {
        try {
          const parsed = JSON.parse(jsonMatch[0]);
          quickFireCaption = cleanCaption(parsed.quick);
          closerThreadCaption = cleanCaption(parsed.closer);
        } catch (parseError) {
          console.error("JSON Parse Error:", parseError);
          // Fallback extraction from plain text
          const sections = extractHooksFromText(content);
          quickFireCaption = sections.quick;
          closerThreadCaption = sections.closer;
        }
      } else {
        // Extract from plain text response
        const sections = extractHooksFromText(content);
        quickFireCaption = sections.quick;
        closerThreadCaption = sections.closer;
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

// Helper functions
function cleanCaption(text) {
  if (!text) return null;
  return text.replace(/\\n/g, '\n').replace(/^["']|["']$/g, '').trim();
}

function extractHooksFromText(content) {
  if (!content) return { quick: null, closer: null };
  
  // Look for Quick Fire and Close Thread sections
  const quickMatch = content.match(/Quick Fire[:\n\s]*([^\n]+(?:\n[^\n]+)?)/i);
  const closerMatch = content.match(/Close Thread[:\n\s]*([\s\S]*?)(?:\n\n|$)/i);
  
  return {
    quick: quickMatch ? quickMatch[1].trim() : content.split('\n')[0] || null,
    closer: closerMatch ? closerMatch[1].trim() : content || null
  };
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
