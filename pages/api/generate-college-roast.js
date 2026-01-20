// /pages/api/generate-college-roast.js

import { OpenAI } from "openai";
import { COLLEGES } from "../../data/colleges";

// GROQ MODELS
const GROQ_MODELS = [
  {
    name: "Llama 3.3 70B Versatile",
    model: "llama-3.3-70b-versatile",
    temperature: 1.5,
    quality: "best"
  },
  {
    name: "Llama 4 Maverick 17B",
    model: "meta-llama/llama-4-maverick-17b-128e-instruct",
    temperature: 1.6,
    quality: "excellent"
  },
  {
    name: "Qwen 3 32B",
    model: "qwen/qwen3-32b",
    temperature: 1.4,
    quality: "good"
  },
  {
    name: "Llama 3.1 8B Instant",
    model: "llama-3.1-8b-instant",
    temperature: 1.7,
    quality: "fast"
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
    console.error("All Groq models failed:", error);
    
    const collegeData = COLLEGES[college] || {};
    const rivalData = COLLEGES[rivalCollege] || {};
    
    return res.status(200).json({
      roast: {
        roast: `${college} se ho chutiye? ${rivalCollege} dekh ke jal rahe ho 💀\n\nUnka avg ${rivalData.placements?.average || '21 LPA'} hai, tumhara ${collegeData.placements?.average || '8 LPA'}\nBas cope karte raho bc, reality nahi badlegi 😂`,
        yourScore: Math.floor(Math.random() * 30) + 40,
        rivalScore: 85,
        comparisons: [
          { metric: "Overall Vibe", yours: "Mid", theirs: "Elite", winner: "rival" },
          { metric: topic, yours: "Struggling", theirs: "Crushing it", winner: "rival" }
        ],
        topic: topic,
        modelUsed: "fallback"
      }
    });
  }
}

// Try models in priority order
async function generateRoastWithFallback(college, branch, topic, rivalCollege) {
  let lastError;

  for (let i = 0; i < GROQ_MODELS.length; i++) {
    const modelConfig = GROQ_MODELS[i];
    
    try {
      console.log(`🔄 Trying ${modelConfig.name}...`);
      
      const result = await generateRoast(
        college,
        branch,
        topic,
        rivalCollege,
        modelConfig
      );

      if (result && result.roast && result.roast.length > 30) {
        console.log(`✅ Success with ${modelConfig.name}`);
        result.modelUsed = modelConfig.name;
        return result;
      }
    } catch (error) {
      console.log(`❌ ${modelConfig.name} failed:`, error.message);
      lastError = error;
      continue;
    }
  }

  throw new Error(lastError?.message || "All models failed");
}

// 🎯 SMART WINNER SELECTION - FAIR SYSTEM
function determineWinner(userCollege, rivalCollege) {
  // 60% chance user wins, 40% chance rival wins
  // This keeps both sides engaged!
  const randomChance = Math.random();
  
  if (randomChance < 0.6) {
    // User wins 60% of the time
    console.log(`🎲 [WINNER SYSTEM] ${userCollege} WINS (60% chance)`);
    return {
      winner: userCollege,
      winnerIsUser: true,
      userScoreRange: [75, 95],    // User gets high score
      rivalScoreRange: [50, 74]     // Rival gets lower score
    };
  } else {
    // Rival wins 40% of the time
    console.log(`🎲 [WINNER SYSTEM] ${rivalCollege} WINS (40% chance)`);
    return {
      winner: rivalCollege,
      winnerIsUser: false,
      userScoreRange: [55, 74],     // User gets decent score
      rivalScoreRange: [75, 95]      // Rival gets high score
    };
  }
}

// Main roast generation with FAIR SYSTEM
async function generateRoast(college, branch, topic, rivalCollege, modelConfig) {
  const collegeData = COLLEGES[college] || createFallbackCollegeData(college);
  const rivalData = COLLEGES[rivalCollege] || createFallbackCollegeData(rivalCollege);

  // 🎯 DETERMINE WINNER FAIRLY
  const winnerInfo = determineWinner(college, rivalCollege);
  
  // Generate scores based on who wins
  const userScore = Math.floor(Math.random() * (winnerInfo.userScoreRange[1] - winnerInfo.userScoreRange[0] + 1)) + winnerInfo.userScoreRange[0];
  const rivalScore = Math.floor(Math.random() * (winnerInfo.rivalScoreRange[1] - winnerInfo.rivalScoreRange[0] + 1)) + winnerInfo.rivalScoreRange[0];

  console.log(`📊 [SCORES] ${college}: ${userScore} | ${rivalCollege}: ${rivalScore}`);

  // Pick random comparison metrics
  const allMetrics = [
    'Placements', 'College Ranking', 'Campus Vibe', 'Food Quality', 
    'Location Flex', 'Fees vs Package ROI', 'Night Life', 'Dating Scene'
  ];
  
  const shuffledMetrics = allMetrics.sort(() => Math.random() - 0.5);
  const randomMetrics = shuffledMetrics.slice(0, Math.floor(Math.random() * 2) + 2);

  const client = new OpenAI({
    baseURL: "https://api.groq.com/openai/v1",
    apiKey: process.env.GROQ_API_KEY_COLLEGE,
  });

  // 🎯 DYNAMIC SYSTEM PROMPT BASED ON WINNER
  const systemPrompt = buildDynamicPrompt(
    college,
    rivalCollege,
    collegeData,
    rivalData,
    topic,
    randomMetrics,
    winnerInfo
  );

  try {
    const completion = await client.chat.completions.create({
      model: modelConfig.model,
      messages: [
        { role: "system", content: systemPrompt },
        { 
          role: "user", 
          content: `${college} (${branch}) ko roast kar about "${topic}" comparing with ${rivalCollege}. ${winnerInfo.winnerIsUser ? `${college} should WIN this battle` : `${rivalCollege} should WIN this battle`}. Natural Hinglish, gaalis use kar, savage ban. JSON return kar.` 
        }
      ],
      temperature: modelConfig.temperature,
      max_tokens: 500,
      top_p: 0.95,
      frequency_penalty: 0.8,
      presence_penalty: 0.8
    });

    const content = completion.choices[0]?.message?.content;
    if (!content) throw new Error("No response from Groq");

    console.log("Groq raw response:", content);

    // Try to parse JSON
    try {
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        
        return {
          roast: parsed.roast || content,
          yourScore: userScore,
          rivalScore: rivalScore,
          comparisons: parsed.comparisons || generateFallbackComparisons(collegeData, rivalData, randomMetrics, winnerInfo),
          topic: topic
        };
      }
    } catch (parseError) {
      console.log("JSON parse failed, using raw text");
    }

    // Fallback
    return {
      roast: content.replace(/```json|```/g, '').trim(),
      yourScore: userScore,
      rivalScore: rivalScore,
      comparisons: generateFallbackComparisons(collegeData, rivalData, randomMetrics, winnerInfo),
      topic: topic
    };

  } catch (error) {
    console.error(`Groq ${modelConfig.name} error:`, error);
    throw error;
  }
}

// 🎯 BUILD DYNAMIC PROMPT BASED ON WINNER
function buildDynamicPrompt(college, rivalCollege, collegeData, rivalData, topic, randomMetrics, winnerInfo) {
  const winnerCollege = winnerInfo.winner;
  const loserCollege = winnerInfo.winnerIsUser ? rivalCollege : college;

  return `Tu SAMAY RAINA hai - India ka sabse SAVAGE comedian jo colleges ko roast karta hai.

## 🎯 IMPORTANT: ${winnerCollege} SHOULD WIN THIS BATTLE!

**Winner:** ${winnerCollege}
**Loser:** ${loserCollege}

Your roast should FAVOR ${winnerCollege} and ROAST ${loserCollege}.

## COLLEGE COMPARISON DATA:

**${college}:**
${collegeData.placements ? `- Avg Package: ${collegeData.placements.average}` : '- Avg Package: 8 LPA'}
${collegeData.rankings ? `- Ranking: ${collegeData.rankings.nirf}` : '- Ranking: Mid-tier'}
${collegeData.academics ? `- Fees: ${collegeData.academics.fees}` : '- Fees: ₹8 lakh'}

**${rivalCollege}:**
${rivalData.placements ? `- Avg Package: ${rivalData.placements.average}` : '- Avg Package: 21 LPA'}
${rivalData.rankings ? `- Ranking: ${rivalData.rankings.nirf}` : '- Ranking: #1'}
${rivalData.academics ? `- Fees: ${rivalData.academics.fees}` : '- Fees: ₹10 lakh'}

---

## TASK:

Generate roast about "${topic}" where **${winnerCollege} WINS**.

${winnerInfo.winnerIsUser ? 
`Make ${college} look BETTER than ${rivalCollege}. Show ${college} superiority!` : 
`Make ${rivalCollege} look BETTER than ${college}. Show ${rivalCollege} superiority!`}

## ROASTING RULES:

### LANGUAGE:
- 70% Hindi, 30% English (NATURAL mix)
- Casual conversational tone

### GAALI USAGE:
- bc, chutiye, mc, laude - USE NATURALLY
- Not every line, just where it fits

### LENGTH:
- 3-4 lines MAXIMUM
- Each line = one punch

### TONE:
- Roast the LOSER (${loserCollege})
- Praise the WINNER (${winnerCollege})
- ${winnerInfo.winnerIsUser ? `Make ${college} students feel good!` : `Make ${rivalCollege} look superior but keep ${college} competitive!`}

---

## GOOD ROAST EXAMPLES:

${winnerInfo.winnerIsUser ? `
**Example (${college} WINS):**
"${college} crushing it bc! ${rivalCollege} trying hard but nahi ho raha 💀
Tumhare stats dekh ke unko depression aa gaya chutiye 😂
${college} supremacy is REAL!"
` : `
**Example (${rivalCollege} WINS):**
"${rivalCollege} showing ${college} their place! 💀
${college} decent hai but ${rivalCollege} next level pe hai bc 😎
Gap toh dikh hi raha hai chutiye, accept karo!"
`}

---

## COMPARE THESE METRICS:

${randomMetrics.map((m, i) => `${i + 1}. **${m}**`).join('\n')}

## OUTPUT FORMAT (STRICT JSON):

{
  "roast": "3-4 line savage Hinglish roast favoring ${winnerCollege}",
  "comparisons": [
    {"metric": "${randomMetrics[0]}", "yours": "data", "theirs": "data", "winner": "${winnerInfo.winnerIsUser ? 'you' : 'rival'}"},
    {"metric": "${randomMetrics[1]}", "yours": "data", "theirs": "data", "winner": "${winnerInfo.winnerIsUser ? 'you' : 'rival'}"}
  ]
}

Remember: ${winnerCollege} MUST look better in this roast! 🔥`;
}

// Generate comparisons based on winner
function generateFallbackComparisons(collegeData, rivalData, metrics, winnerInfo) {
  return metrics.slice(0, 3).map(metric => {
    const metricLower = metric.toLowerCase();
    
    let yours = "Mid";
    let theirs = "Better";
    
    // Determine winner based on winnerInfo
    let winner = winnerInfo.winnerIsUser ? "you" : "rival";
    
    if (metricLower.includes('placement')) {
      yours = collegeData.placements?.average || "8 LPA";
      theirs = rivalData.placements?.average || "21 LPA";
    } else if (metricLower.includes('ranking')) {
      yours = collegeData.rankings?.nirf || "Mid-tier";
      theirs = rivalData.rankings?.nirf || "#1";
    } else if (metricLower.includes('fees')) {
      yours = collegeData.academics?.fees || "₹8L";
      theirs = rivalData.academics?.fees || "₹10L";
      winner = "you"; // Lower fees always better
    }
    
    return {
      metric: metric,
      yours: yours,
      theirs: theirs,
      winner: winner
    };
  });
}

// Fallback college data
function createFallbackCollegeData(collegeName) {
  return {
    placements: {
      average: "8 LPA",
      median: "7 LPA",
      highest: "₹30 LPA",
      lowest: "₹4 LPA"
    },
    rankings: {
      nirf: "Not ranked",
      reputation: "Average college"
    },
    campus: {
      area: "Standard campus"
    },
    food: {
      mess: "Average mess food 4/10"
    },
    academics: {
      fees: "₹8 lakh (4 years)",
      cutoff: "Moderate"
    },
    stereotypes: [
      "Generic college students",
      "Average placement seekers"
    ],
    roastMaterial: [
      "Generic college hai bc 💀"
    ]
  };
}
