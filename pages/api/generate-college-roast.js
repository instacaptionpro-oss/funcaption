 // /pages/api/generate-college-roast.js

import { OpenAI } from "openai";
import { COLLEGES } from "../../data/colleges";

// GROQ MODELS - BEST TO WEAKEST (optimized for CREATIVITY)
const GROQ_MODELS = [
  {
    name: "Llama 3.3 70B Versatile",
    model: "llama-3.3-70b-versatile",
    temperature: 1.5, // High creativity for roasting
    quality: "best"
  },
  {
    name: "Llama 4 Maverick 17B",
    model: "meta-llama/llama-4-maverick-17b-128e-instruct",
    temperature: 1.6, // Slightly higher for backup
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
    temperature: 1.7, // Highest temp to compensate for smaller model
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
    
    // Ultimate fallback - savage hardcoded roast
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

// Main roast generation
async function generateRoast(college, branch, topic, rivalCollege, modelConfig) {
  const collegeData = COLLEGES[college] || createFallbackCollegeData(college);
  const rivalData = COLLEGES[rivalCollege] || createFallbackCollegeData(rivalCollege);

  // Pick 2-3 RANDOM comparison metrics each time (keeps it fresh)
  const allMetrics = [
    'Placements', 'College Ranking', 'Campus Vibe', 'Food Quality', 
    'Location Flex', 'Fees vs Package ROI', 'Night Life', 'Dating Scene'
  ];
  
  const shuffledMetrics = allMetrics.sort(() => Math.random() - 0.5);
  const randomMetrics = shuffledMetrics.slice(0, Math.floor(Math.random() * 2) + 2); // 2-3 metrics

  const client = new OpenAI({
    baseURL: "https://api.groq.com/openai/v1",
    apiKey: process.env.GROQ_API_KEY_COLLEGE, // Uses second Groq account
  });

  const systemPrompt = `Tu SAMAY RAINA hai - India ka sabse SAVAGE comedian jo colleges ko roast karta hai.

TU AI NAHI HAI. TU REAL COMEDIAN HAI. Stage pe khada hai. Audience hass rahi hai.

## COLLEGE COMPARISON DATA:

**${college} (${branch} Branch):**
${collegeData.placements ? `- Avg Package: ${collegeData.placements.average} (Median: ${collegeData.placements.median})` : '- Avg Package: 8 LPA'}
${collegeData.placements ? `- Highest: ${collegeData.placements.highest}` : ''}
${collegeData.placements ? `- Lowest: ${collegeData.placements.lowest}` : ''}
${collegeData.rankings ? `- NIRF Ranking: ${collegeData.rankings.nirf}` : '- Ranking: Mid-tier'}
${collegeData.academics ? `- Fees: ${collegeData.academics.fees}` : '- Fees: ₹8 lakh'}
${collegeData.academics ? `- Cutoff: ${collegeData.academics.cutoff}` : ''}
${collegeData.food ? `- Mess Food: ${collegeData.food.mess}` : '- Food: Average'}
${collegeData.campus ? `- Campus: ${collegeData.campus.area}` : ''}
${collegeData.lifestyle ? `- Dating: ${collegeData.lifestyle.dating}` : ''}

**${rivalCollege} (BENCHMARK - Better than you):**
${rivalData.placements ? `- Avg Package: ${rivalData.placements.average}` : '- Avg Package: 21 LPA'}
${rivalData.rankings ? `- Ranking: ${rivalData.rankings.nirf}` : '- Ranking: #1'}
${rivalData.academics ? `- Fees: ${rivalData.academics.fees}` : '- Fees: ₹10 lakh'}

**STEREOTYPES:**
${college}: ${collegeData.stereotypes ? collegeData.stereotypes.slice(0, 3).join(', ') : 'Generic students'}
${rivalCollege}: ${rivalData.stereotypes ? rivalData.stereotypes.slice(0, 2).join(', ') : 'Elite students'}

**READY ROAST MATERIAL for ${college}:**
${collegeData.roastMaterial ? collegeData.roastMaterial.slice(0, 4).join('\n') : 'Generic roast material'}

---

## TASK:

Generate BRUTAL roast comparing **${college}** with **${rivalCollege}** about topic: **"${topic}"**

## IMPORTANT - COMPARE EXACTLY THESE METRICS (randomly chosen, will be different each time):

${randomMetrics.map((m, i) => `${i + 1}. **${m}** (find specific data and compare)`).join('\n')}

---

## ROASTING COMMANDMENTS:

### LANGUAGE STYLE:
- **70% Hindi, 30% English** (NATURAL mix, not forced)
- Jaise yaar ko roast kar rahe ho group mein
- Casual, conversational, DOST wali vibe

### GAALI USAGE (MANDATORY):
- bc, chutiye, mc, laude - USE NATURALLY
- Don't force it every line
- Place where it SOUNDS natural
- Example: "Tum chutiye second best flex karte ho" ✅
- NOT: "Chutiye tum bc second mc best ho laude" ❌ (overuse)

### LENGTH:
- **3-4 lines MAXIMUM**
- Each line = one punch
- Short, tight, brutal

### DATA USAGE:
- Use ACTUAL NUMBERS (21 LPA vs 18 LPA)
- Mention REAL rankings (#1 vs #2)
- Compare ACTUAL fees
- Creates JEALOUSY with facts

### TONE:
- Savage but funny
- Jealousy inducing
- Reality check vibes
- "Cope karte raho" energy
- Show ${rivalCollege} is CLEARLY better

---

## GOOD ROAST EXAMPLES:

**Example 1 - Placements:**
"IIT Delhi CSE se ho bc? Package flex karte ho? 💀
Bombay waale 21 LPA average le gaye, tum 18 mein khush
Google intern nahi mila toh LinkedIn bio mein 'IIT' laga diya chutiye 😂
Second best college = second best life, accept karo"

**Example 2 - Campus:**
"NIT Trichy best NIT bolte ho laude? 💀
IIT Bombay ka campus Powai lake pe hai, tumhara kahan?
Festember organize karte ho but Mood Indigo mein audience jaata bc 😂
Best of NITs = Worst of IITs, maths weak hai kya?"

**Example 3 - Fees:**
"BITS Pilani se ho? ₹25 lakh fees di mc? 💀
IIT Bombay ₹10 lakh mein better placement de raha
No attendance flex karte ho but skills bhi no attendance 😂
Private ka paisa, government ka result chutiye"

---

## BAD EXAMPLES (NEVER DO THIS):

❌ "Your college demonstrates inferior placement metrics compared to the benchmark institution..."
❌ "It is evident that there exists a significant gap..."
❌ Too formal, too English, BORING

---

## OUTPUT FORMAT (STRICT JSON):

{
  "roast": "3-4 line savage Hinglish roast with natural gaalis",
  "comparisons": [
    {"metric": "${randomMetrics[0]}", "yours": "specific data from college", "theirs": "specific data from rival", "winner": "rival"},
    {"metric": "${randomMetrics[1]}", "yours": "specific data", "theirs": "specific data", "winner": "rival"}
  ]
}

---

## REMEMBER:

Tu stage pe hai. ${college} ke students audience mein hain. ${rivalCollege} ka comparison kar raha hai tu.

Unko JEALOUS feel hona chahiye. Unko lagana chahiye "Yaar ${rivalCollege} better hai bc".

NATURAL HINGLISH. SAVAGE. FUNNY. REALITY CHECK.

**AB JAA AUR ROAST KAR! AUDIENCE WAIT KAR RAHI HAI!** 🔥`;

  try {
    const completion = await client.chat.completions.create({
      model: modelConfig.model,
      messages: [
        { role: "system", content: systemPrompt },
        { 
          role: "user", 
          content: `${college} (${branch}) ko roast kar about "${topic}" comparing with ${rivalCollege}. Natural Hinglish, gaalis use kar, savage ban. JSON return kar.` 
        }
      ],
      temperature: modelConfig.temperature, // High for creativity
      max_tokens: 500,
      top_p: 0.95,
      frequency_penalty: 0.8, // Avoid repetition
      presence_penalty: 0.8  // Encourage new ideas
    });

    const content = completion.choices[0]?.message?.content;
    if (!content) throw new Error("No response from Groq");

    console.log("Groq raw response:", content);

    // Try to parse JSON
    try {
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        
        // Calculate scores based on real data
        const yourScore = calculateScore(collegeData);
        const rivalScore = calculateScore(rivalData);

        return {
          roast: parsed.roast || content,
          yourScore: yourScore,
          rivalScore: rivalScore,
          comparisons: parsed.comparisons || generateFallbackComparisons(collegeData, rivalData, randomMetrics),
          topic: topic
        };
      }
    } catch (parseError) {
      console.log("JSON parse failed, using raw text");
    }

    // Fallback: use raw text and generate comparisons manually
    return {
      roast: content.replace(/```json|```/g, '').trim(),
      yourScore: calculateScore(collegeData),
      rivalScore: calculateScore(rivalData),
      comparisons: generateFallbackComparisons(collegeData, rivalData, randomMetrics),
      topic: topic
    };

  } catch (error) {
    console.error(`Groq ${modelConfig.name} error:`, error);
    throw error;
  }
}

// Calculate realistic score based on college data
function calculateScore(collegeData) {
  let score = 50; // base

  if (!collegeData.placements) return score;

  const avgPkg = parseFloat(collegeData.placements.average);
  
  // Score based on placement (main factor)
  if (avgPkg > 20) score = 85;
  else if (avgPkg > 15) score = 75;
  else if (avgPkg > 12) score = 68;
  else if (avgPkg > 10) score = 62;
  else if (avgPkg > 7) score = 55;
  else if (avgPkg > 5) score = 48;
  else score = 40;

  // Add slight randomness (±5)
  score += Math.floor(Math.random() * 11) - 5;

  return Math.min(100, Math.max(20, score));
}

// Generate comparisons if AI doesn't provide proper JSON
function generateFallbackComparisons(collegeData, rivalData, metrics) {
  return metrics.slice(0, 3).map(metric => {
    const metricLower = metric.toLowerCase();
    
    let yours = "Mid";
    let theirs = "Better";
    let winner = "rival";
    
    if (metricLower.includes('placement')) {
      yours = collegeData.placements?.average || "8 LPA";
      theirs = rivalData.placements?.average || "21 LPA";
      winner = parseFloat(yours) > parseFloat(theirs) ? "you" : "rival";
    } else if (metricLower.includes('ranking')) {
      yours = collegeData.rankings?.nirf || "Mid-tier";
      theirs = rivalData.rankings?.nirf || "#1";
      winner = "rival";
    } else if (metricLower.includes('fees')) {
      yours = collegeData.academics?.fees || "₹8L";
      theirs = rivalData.academics?.fees || "₹10L";
      winner = "you"; // Lower fees = you win
    } else if (metricLower.includes('food')) {
      yours = collegeData.food?.mess || "4/10";
      theirs = rivalData.food?.mess || "5/10";
      winner = "rival";
    } else if (metricLower.includes('campus')) {
      yours = collegeData.campus?.area || "Average";
      theirs = rivalData.campus?.area || "Large";
      winner = "rival";
    } else if (metricLower.includes('location')) {
      yours = collegeData.location || "Unknown";
      theirs = rivalData.location || "Premium";
      winner = "rival";
    }
    
    return {
      metric: metric,
      yours: yours,
      theirs: theirs,
      winner: winner
    };
  });
}

// Fallback college data if not in database
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
      "Average placement seekers",
      "Mid-tier aspirations"
    ],
    roastMaterial: [
      "Generic college hai bc, generic hi rahoge 💀",
      "Placement avg dekh ke depression, fees dekh ke regret 😂"
    ]
  };
                    }
