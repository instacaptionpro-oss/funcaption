import { OpenAI } from "openai";
import { COLLEGES } from "../../data/colleges";

// OpenAI Model configuration (BEST to WEAKEST)
const OPENAI_MODELS = [
  {
    name: "GPT-4o",
    model: "gpt-4o",
    quality: "best",
    temperature: 1.2
  },
  {
    name: "GPT-4o Mini",
    model: "gpt-4o-mini",
    quality: "good",
    temperature: 1.3
  },
  {
    name: "GPT-4 Turbo",
    model: "gpt-4-turbo",
    quality: "great",
    temperature: 1.2
  },
  {
    name: "GPT-3.5 Turbo",
    model: "gpt-3.5-turbo",
    quality: "fast",
    temperature: 1.4
  }
];

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { college, branch, topic, rivalCollege } = req.body;

  if (!college || !topic) {
    return res.status(400).json({ error: "College and topic required" });
  }

  try {
    const result = await generateRoastWithFallback(
      college,
      branch || "CSE",
      topic,
      rivalCollege || "IIT Bombay"
    );

    return res.status(200).json({ roast: result });
  } catch (error) {
    console.error("All models failed:", error);
    
    // Ultimate fallback - hardcoded savage roast
    return res.status(200).json({
      roast: {
        roast: `${college} se ho chutiye? ${rivalCollege} dekh ke jal rahe ho 💀\n\nUnka level alag hai bc, tumhara bhi alag\nBut opposite direction mein 😂\n\nReality check lelo yaar`,
        yourScore: Math.floor(Math.random() * 30) + 40,
        rivalScore: 85,
        comparisons: [
          { metric: "Overall", yours: "Average", theirs: "Elite", winner: "rival" },
          { metric: topic, yours: "Struggling", theirs: "Dominating", winner: "rival" }
        ],
        topic: topic,
        modelUsed: "fallback"
      }
    });
  }
}

// Try models in order with fallback
async function generateRoastWithFallback(college, branch, topic, rivalCollege) {
  let lastError;

  for (let i = 0; i < OPENAI_MODELS.length; i++) {
    const modelConfig = OPENAI_MODELS[i];
    
    try {
      console.log(`🔄 Trying ${modelConfig.name}...`);
      
      const result = await generateRoast(
        college,
        branch,
        topic,
        rivalCollege,
        modelConfig
      );

      if (result && result.roast && result.roast.length > 20) {
        console.log(`✅ Success with ${modelConfig.name}`);
        result.modelUsed = modelConfig.name;
        return result;
      }
    } catch (error) {
      console.log(`❌ ${modelConfig.name} failed:`, error.message);
      lastError = error;
      
      // Continue to next model
      continue;
    }
  }

  // If all models fail, throw error
  throw new Error(lastError?.message || "All models failed");
}

// Main roast generation function
async function generateRoast(college, branch, topic, rivalCollege, modelConfig) {
  const collegeData = COLLEGES[college] || createFallbackCollegeData(college);
  const rivalData = COLLEGES[rivalCollege] || createFallbackCollegeData(rivalCollege);

  // Pick 2-3 random comparison metrics
  const allMetrics = [
    'placements', 'ranking', 'campus', 'food', 
    'location', 'fees', 'hostel', 'nightLife'
  ];
  
  const randomMetrics = allMetrics
    .sort(() => Math.random() - 0.5)
    .slice(0, Math.floor(Math.random() * 2) + 2); // 2-3 metrics

  // OpenAI client (official API)
  const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY_COLLEGE,
  });

  const systemPrompt = `Tu SAMAY RAINA style ka SAVAGE college roaster hai.

COLLEGE COMPARISON DATA:

${college} (${branch}):
${collegeData.placements ? `- Avg Package: ${collegeData.placements.average}` : ''}
${collegeData.rankings ? `- Ranking: ${collegeData.rankings.nirf}` : ''}
${collegeData.campus ? `- Campus: ${collegeData.campus.area}` : ''}
${collegeData.food ? `- Food: ${collegeData.food.mess}` : ''}
${collegeData.academics ? `- Fees: ${collegeData.academics.fees}` : ''}

${rivalCollege}:
${rivalData.placements ? `- Avg Package: ${rivalData.placements.average}` : ''}
${rivalData.rankings ? `- Ranking: ${rivalData.rankings.nirf}` : ''}
${rivalData.campus ? `- Campus: ${rivalData.campus.area}` : ''}

STEREOTYPES:
${college}: ${collegeData.stereotypes ? collegeData.stereotypes.slice(0, 3).join(', ') : 'Generic college'}
${rivalCollege}: ${rivalData.stereotypes ? rivalData.stereotypes.slice(0, 2).join(', ') : 'Elite college'}

TASK:
Generate SAVAGE roast comparing ${college} with ${rivalCollege} about "${topic}".

COMPARE EXACTLY THESE ${randomMetrics.length} METRICS (randomly chosen):
${randomMetrics.map((m, i) => `${i + 1}. ${m.toUpperCase()}`).join('\n')}

ROASTING RULES:
1. Use HINGLISH naturally (70% Hindi, 30% English)
2. GAALIS are MANDATORY: bc, chutiye, mc, laude (use naturally, not forced)
3. 3-4 lines maximum
4. Compare ${college} to ${rivalCollege} - show ${rivalCollege} is BETTER
5. Make ${college} feel JEALOUS
6. Use REAL data numbers (packages, ranks, etc.)
7. Be BRUTAL but FUNNY

EXAMPLES OF SAVAGE ROASTING:

"IIT Delhi se ho chutiye? Second best flex karte ho 💀
Bombay waale 21 LPA le gaye, tum 18 mein khush
Metro mein AC hai but campus mein nahi bc 😂
#2 tag LinkedIn pe permanent, reality accept karo"

"NIT Trichy best NIT bolte ho laude? 💀
IIT Bombay avg 21L, tumhara 12L
Best of NITs = Worst of IITs math samajh nahi aata? 😂
JEE Advanced nahi hua acceptance first step"

"BITS se ho bc ₹25L fees di? 💀
IIT Bombay ₹10L mein better placement de raha
No attendance flex karte ho but skills bhi no attendance 😂
Private ka paisa, government ka result"

STYLE:
- Natural Hinglish (jaise dost se baat kar rahe ho)
- Gaali natural lagni chahiye (forced nahi)
- Numbers mention karo (creates jealousy)
- Emojis use karo (💀😂😭🔥)
- Punchline strong ho

OUTPUT FORMAT (JSON):
{
  "roast": "3-4 line savage roast with gaalis",
  "comparisons": [
    {"metric": "${randomMetrics[0]}", "yours": "data", "theirs": "data", "winner": "rival"},
    {"metric": "${randomMetrics[1]}", "yours": "data", "theirs": "data", "winner": "rival"}
  ]
}

GENERATE NOW - MAKE IT BRUTAL! 🔥`;

  const completion = await client.chat.completions.create({
    model: modelConfig.model,
    messages: [
      { role: "system", content: systemPrompt },
      {
        role: "user",
        content: `Generate savage roast for ${college} (${branch}) comparing with ${rivalCollege} about "${topic}". Use gaalis naturally. Be brutal. Return JSON only.`
      }
    ],
    temperature: modelConfig.temperature,
    max_tokens: 400,
    top_p: 0.95
  });

  const content = completion.choices[0]?.message?.content;
  if (!content) throw new Error("No response from AI");

  try {
    // Try to parse JSON
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      
      // Calculate scores
      const yourScore = calculateScore(collegeData);
      const rivalScore = calculateScore(rivalData);

      return {
        roast: parsed.roast || content,
        yourScore: yourScore,
        rivalScore: rivalScore,
        comparisons: parsed.comparisons || [],
        topic: topic
      };
    }
  } catch (parseError) {
    console.log("JSON parse failed, using raw text");
  }

  // Fallback: use raw text
  return {
    roast: content,
    yourScore: Math.floor(Math.random() * 30) + 40,
    rivalScore: 85,
    comparisons: [],
    topic: topic
  };
}

// Calculate score based on college data
function calculateScore(collegeData) {
  let score = 50; // base

  if (!collegeData.placements) return score;

  const avgPkg = parseFloat(collegeData.placements.average);
  
  if (avgPkg > 20) score = 85;
  else if (avgPkg > 15) score = 75;
  else if (avgPkg > 10) score = 65;
  else if (avgPkg > 7) score = 55;
  else score = 45;

  // Add randomness
  score += Math.floor(Math.random() * 10) - 5;

  return Math.min(100, Math.max(20, score));
}

// Fallback college data if not in database
function createFallbackCollegeData(collegeName) {
  return {
    placements: {
      average: "8 LPA",
      highest: "₹30 LPA"
    },
    rankings: {
      nirf: "Not ranked"
    },
    campus: {
      area: "Standard campus"
    },
    food: {
      mess: "Average food"
    },
    academics: {
      fees: "₹8 lakh"
    },
    stereotypes: [
      "Generic college student",
      "Average placement",
      "Mid-tier college"
    ]
  };
           }
