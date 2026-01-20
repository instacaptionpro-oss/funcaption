// pages/api/generate-college-roast.js

import { OpenAI } from "openai";
import { COLLEGES } from "../../data/colleges";
import { getTemplate, generateTemplatePrompt } from "../../lib/templateRoasts";

// GROQ MODELS - BEST TO WEAKEST (optimized for CREATIVITY)
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

  const { college, branch, topic, rivalCollege, templateId, useTemplate } = req.body;

  if (!college || !topic) {
    return res.status(400).json({ error: "College and topic required" });
  }

  try {
    const result = await generateRoastWithFallback(
      college,
      branch || "CSE",
      topic,
      rivalCollege || "IIT Bombay",
      templateId,
      useTemplate
    );

    return res.status(200).json({ roast: result });
  } catch (error) {
    console.error("All Groq models failed:", error);
    
    // Ultimate fallback
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
async function generateRoastWithFallback(college, branch, topic, rivalCollege, templateId, useTemplate) {
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
        modelConfig,
        templateId,
        useTemplate
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

// Main roast generation (ENHANCED with template support)
async function generateRoast(college, branch, topic, rivalCollege, modelConfig, templateId, useTemplate) {
  const collegeData = COLLEGES[college] || createFallbackCollegeData(college);
  const rivalData = COLLEGES[rivalCollege] || createFallbackCollegeData(rivalCollege);

  // NEW: Get template if using template mode
  const template = templateId ? getTemplate(templateId) : null;

  // Pick random comparison metrics
  let randomMetrics;
  
  if (template && template.comparisonMetrics) {
    // Use template-specific metrics
    randomMetrics = template.comparisonMetrics;
  } else {
    // Use general metrics
    const allMetrics = [
      'Placements', 'College Ranking', 'Campus Vibe', 'Food Quality', 
      'Location Flex', 'Fees vs Package ROI', 'Night Life', 'Dating Scene'
    ];
    const shuffledMetrics = allMetrics.sort(() => Math.random() - 0.5);
    randomMetrics = shuffledMetrics.slice(0, Math.floor(Math.random() * 2) + 2);
  }

  const client = new OpenAI({
    baseURL: "https://api.groq.com/openai/v1",
    apiKey: process.env.GROQ_API_KEY_COLLEGE,
  });

  // Build enhanced system prompt
  let systemPrompt = buildSystemPrompt(
    college, 
    rivalCollege, 
    collegeData, 
    rivalData, 
    topic, 
    randomMetrics,
    template
  );

  try {
    const completion = await client.chat.completions.create({
      model: modelConfig.model,
      messages: [
        { role: "system", content: systemPrompt },
        { 
          role: "user", 
          content: template 
            ? `${college} (${branch}) ko roast kar using ${template.label} template comparing with ${rivalCollege}. Natural Hinglish, gaalis use kar, savage ban. JSON return kar.`
            : `${college} (${branch}) ko roast kar about "${topic}" comparing with ${rivalCollege}. Natural Hinglish, gaalis use kar, savage ban. JSON return kar.`
        }
      ],
      temperature: modelConfig.temperature,
      max_tokens: 600,
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
        
        const yourScore = calculateScore(collegeData, template);
        const rivalScore = calculateScore(rivalData, template);

        return {
          roast: parsed.roast || content,
          yourScore: yourScore,
          rivalScore: rivalScore,
          comparisons: parsed.comparisons || generateFallbackComparisons(collegeData, rivalData, randomMetrics, template),
          topic: topic
        };
      }
    } catch (parseError) {
      console.log("JSON parse failed, using raw text");
    }

    // Fallback: use raw text
    return {
      roast: content.replace(/```json|```/g, '').trim(),
      yourScore: calculateScore(collegeData, template),
      rivalScore: calculateScore(rivalData, template),
      comparisons: generateFallbackComparisons(collegeData, rivalData, randomMetrics, template),
      topic: topic
    };

  } catch (error) {
    console.error(`Groq ${modelConfig.name} error:`, error);
    throw error;
  }
}

// NEW: Build enhanced system prompt with template support
function buildSystemPrompt(college, rivalCollege, collegeData, rivalData, topic, randomMetrics, template) {
  let basePrompt = `Tu SAMAY RAINA hai - India ka sabse SAVAGE comedian jo colleges ko roast karta hai.

TU AI NAHI HAI. TU REAL COMEDIAN HAI. Stage pe khada hai. Audience hass rahi hai.

## COLLEGE COMPARISON DATA:

**${college}:**
${collegeData.placements ? `- Avg Package: ${collegeData.placements.average} (Median: ${collegeData.placements.median})` : '- Avg Package: 8 LPA'}
${collegeData.placements ? `- Highest: ${collegeData.placements.highest}` : ''}
${collegeData.placements ? `- Lowest: ${collegeData.placements.lowest}` : ''}
${collegeData.rankings ? `- NIRF Ranking: ${collegeData.rankings.nirf}` : '- Ranking: Mid-tier'}
${collegeData.academics ? `- Fees: ${collegeData.academics.fees}` : '- Fees: ₹8 lakh'}
${collegeData.academics ? `- Cutoff: ${collegeData.academics.cutoff}` : ''}
${collegeData.food ? `- Mess Food: ${collegeData.food.mess}` : '- Food: Average'}
${collegeData.campus ? `- Campus: ${collegeData.campus.area}` : ''}
${collegeData.lifestyle ? `- Dating: ${collegeData.lifestyle.dating}` : ''}

**${rivalCollege} (BENCHMARK):**
${rivalData.placements ? `- Avg Package: ${rivalData.placements.average}` : '- Avg Package: 21 LPA'}
${rivalData.rankings ? `- Ranking: ${rivalData.rankings.nirf}` : '- Ranking: #1'}
${rivalData.academics ? `- Fees: ${rivalData.academics.fees}` : '- Fees: ₹10 lakh'}

**STEREOTYPES:**
${college}: ${collegeData.stereotypes ? collegeData.stereotypes.slice(0, 3).join(', ') : 'Generic students'}
${rivalCollege}: ${rivalData.stereotypes ? rivalData.stereotypes.slice(0, 2).join(', ') : 'Elite students'}`;

  // Add template-specific instructions
  if (template) {
    basePrompt += `

---

## 🎯 TEMPLATE MODE: ${template.label}

${template.prompt}

**FOCUS METRICS FOR THIS TEMPLATE:**
${template.metrics.map((m, i) => `${i + 1}. ${m}`).join('\n')}

**TEMPLATE-SPECIFIC DATA EXTRACTION:**
${extractTemplateSpecificData(template.id, collegeData, rivalData)}`;
  }

  basePrompt += `

---

## TASK:

Generate BRUTAL roast comparing **${college}** with **${rivalCollege}** about topic: **"${topic}"**

## COMPARE EXACTLY THESE METRICS:

${randomMetrics.map((m, i) => `${i + 1}. **${m}** (find specific data and compare)`).join('\n')}

---

## ROASTING COMMANDMENTS:

### LANGUAGE STYLE:
- **70% Hindi, 30% English** (NATURAL mix)
- Jaise yaar ko roast kar rahe ho group mein
- Casual, conversational, DOST wali vibe

### GAALI USAGE (MANDATORY):
- bc, chutiye, mc, laude - USE NATURALLY
- Don't force every line
- Place where it SOUNDS natural
- Example: "Tum chutiye second best flex karte ho" ✅

### LENGTH:
- **3-4 lines MAXIMUM**
- Each line = one punch
- Short, tight, brutal

### DATA USAGE:
- Use ACTUAL NUMBERS
- Mention REAL rankings
- Compare ACTUAL fees
- Creates JEALOUSY with facts

### TONE:
- Savage but funny
- Jealousy inducing
- Reality check vibes
- "Cope karte raho" energy
- Show ${rivalCollege} is CLEARLY better

---

## OUTPUT FORMAT (STRICT JSON):

{
  "roast": "3-4 line savage Hinglish roast with natural gaalis",
  "comparisons": [
    {"metric": "${randomMetrics[0]}", "yours": "specific data", "theirs": "specific data", "winner": "rival or you"},
    {"metric": "${randomMetrics[1]}", "yours": "specific data", "theirs": "specific data", "winner": "rival or you"}
  ]
}

---

Tu stage pe hai. ${college} ke students audience mein hain. ${rivalCollege} ka comparison kar.

NATURAL HINGLISH. SAVAGE. FUNNY. REALITY CHECK.

**AB JAA AUR ROAST KAR!** 🔥`;

  return basePrompt;
}

// NEW: Extract template-specific data for enhanced prompts
function extractTemplateSpecificData(templateId, collegeData, rivalData) {
  switch(templateId) {
    case 'placement':
      return `**Placement Focus:**
${collegeData.name || 'College'}: ${collegeData.placements?.average || 'Unknown'} avg, ${collegeData.placements?.topRecruiters?.slice(0,3).join(', ') || 'local companies'}
Rival: ${rivalData.placements?.average || 'Unknown'} avg, ${rivalData.placements?.topRecruiters?.slice(0,3).join(', ') || 'top MNCs'}`;

    case 'food':
      return `**Food Focus:**
${collegeData.name || 'College'}: ${collegeData.food?.mess || 'Average mess'}, Quality: ${collegeData.food?.quality || '3/10'}
Rival: ${rivalData.food?.mess || 'Good mess'}, Quality: ${rivalData.food?.quality || '7/10'}`;

    case 'wifi':
      return `**WiFi Focus:**
${collegeData.name || 'College'}: ${collegeData.campus?.wifi || '10 Mbps'}, ${collegeData.campus?.wifiHours || 'Limited hours'}
Rival: ${rivalData.campus?.wifi || '1 Gbps'}, ${rivalData.campus?.wifiHours || '24/7'}`;

    case 'infrastructure':
      return `**Infrastructure Focus:**
${collegeData.name || 'College'}: ${collegeData.campus?.area || 'Small campus'}, ${collegeData.campus?.infrastructure || 'Old buildings'}
Rival: ${rivalData.campus?.area || 'Large campus'}, ${rivalData.campus?.infrastructure || 'Modern facilities'}`;

    case 'roi':
      return `**ROI Focus:**
${collegeData.name || 'College'}: Fees ${collegeData.academics?.fees || '₹8L'}, Package ${collegeData.placements?.average || '6 LPA'}
Rival: Fees ${rivalData.academics?.fees || '₹10L'}, Package ${rivalData.placements?.average || '21 LPA'}`;

    case 'alumni':
      return `**Alumni Focus:**
${collegeData.name || 'College'}: ${collegeData.alumni?.notable?.slice(0,2).join(', ') || 'Local achievers'}
Rival: ${rivalData.alumni?.notable?.slice(0,2).join(', ') || 'Global CEOs'}`;

    default:
      return `**General Comparison:**
Both colleges on topic: ${templateId}`;
  }
}

// Enhanced score calculation with template awareness
function calculateScore(collegeData, template) {
  let score = 50; // base

  if (!collegeData.placements) return score;

  const avgPkg = parseFloat(collegeData.placements.average);
  
  // Base score on placement
  if (avgPkg > 20) score = 85;
  else if (avgPkg > 15) score = 75;
  else if (avgPkg > 12) score = 68;
  else if (avgPkg > 10) score = 62;
  else if (avgPkg > 7) score = 55;
  else if (avgPkg > 5) score = 48;
  else score = 40;

  // Template-specific adjustments
  if (template) {
    switch(template.id) {
      case 'food':
        const foodQuality = collegeData.food?.quality || '3/10';
        const foodScore = parseInt(foodQuality.split('/')[0]) || 3;
        score += (foodScore - 5) * 5; // ±25 based on food
        break;
        
      case 'infrastructure':
        if (collegeData.campus?.area && collegeData.campus.area.includes('acre')) {
          const acres = parseInt(collegeData.campus.area);
          if (acres > 200) score += 10;
          else if (acres < 50) score -= 10;
        }
        break;
        
      case 'roi':
        const fees = parseFloat(collegeData.academics?.fees?.replace(/[^\d.]/g, '') || '8');
        const roiMonths = (fees / avgPkg) * 12;
        if (roiMonths < 12) score += 15;
        else if (roiMonths > 24) score -= 15;
        break;
    }
  }

  // Add randomness (±5)
  score += Math.floor(Math.random() * 11) - 5;

  return Math.min(100, Math.max(20, score));
}

// Enhanced comparisons with template support
function generateFallbackComparisons(collegeData, rivalData, metrics, template) {
  return metrics.slice(0, 3).map(metric => {
    const metricLower = metric.toLowerCase();
    
    let yours = "Mid";
    let theirs = "Better";
    let winner = "rival";
    
    // Template-specific comparison logic
    if (template) {
      switch(template.id) {
        case 'placement':
          if (metricLower.includes('package') || metricLower.includes('placement')) {
            yours = collegeData.placements?.average || "8 LPA";
            theirs = rivalData.placements?.average || "21 LPA";
            winner = parseFloat(yours) >= parseFloat(theirs) ? "you" : "rival";
          } else if (metricLower.includes('companies') || metricLower.includes('recruiters')) {
            yours = collegeData.placements?.topRecruiters?.length + "+ companies" || "50+";
            theirs = rivalData.placements?.topRecruiters?.length + "+ companies" || "200+";
            winner = "rival";
          }
          break;
          
        case 'food':
          if (metricLower.includes('quality') || metricLower.includes('mess')) {
            yours = collegeData.food?.quality || "3/10";
            theirs = rivalData.food?.quality || "7/10";
            winner = parseInt(yours) > parseInt(theirs) ? "you" : "rival";
          }
          break;
          
        case 'wifi':
          if (metricLower.includes('speed') || metricLower.includes('wifi')) {
            yours = collegeData.campus?.wifi || "10 Mbps";
            theirs = rivalData.campus?.wifi || "1 Gbps";
            winner = yours.includes('Gbps') ? "you" : "rival";
          }
          break;
      }
    } else {
      // General comparison logic (your original code)
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
        winner = "you";
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
    }
    
    return {
      metric: metric,
      yours: yours,
      theirs: theirs,
      winner: winner
    };
  });
}

// Fallback college data (unchanged)
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
      area: "Standard campus",
      wifi: "10 Mbps"
    },
    food: {
      mess: "Average mess food",
      quality: "4/10"
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
