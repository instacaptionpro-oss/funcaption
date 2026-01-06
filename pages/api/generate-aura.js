// /pages/api/generate-aura.js

import { OpenAI } from "openai";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { name, subject, mood } = req.body;

  if (!subject && !mood && !name) {
    return res.status(400).json({ error: "Provide at least name, subject, or mood" });
  }

  const hasName = name && name.trim().length > 0;
  const hasSubject = subject && subject.trim().length > 0;
  const hasMood = mood && mood.trim().length > 0;

  const forcedTier = checkForcedExamples(subject || '', mood || '');
  let tier, finalScore;
  
  if (forcedTier) {
    tier = forcedTier;
    finalScore = getScoreForTier(tier);
  } else {
    const worthiness = calculateWorthiness(subject || '', mood || '', name || '');
    const tierCap = getTierCap(worthiness);
    tier = rollForTier(tierCap);
    finalScore = getScoreForTier(tier);
  }

  let result = null;
  let isPublicFigure = false;
  let publicFigureStatus = 'none';

  const HF_TOKEN = process.env.HF_TOKEN;

  if (!HF_TOKEN) {
    return res.status(500).json({ error: "API token not configured" });
  }

  try {
    // ============================================
    // STEP 1: DEEPSEEK R1 - RESEARCH THE PERSON
    // ============================================
    let researchData = null;
    
    if (hasName) {
      researchData = await researchWithDeepSeek(HF_TOKEN, name.trim());
      console.log("Research Data:", researchData);
      
      if (researchData && researchData.isFamous) {
        isPublicFigure = true;
        publicFigureStatus = researchData.status || 'stable';
      }
    }

    // ============================================
    // STEP 2: LLAMA - CREATE THE ROAST
    // ============================================
    result = await createRoastWithLlama(HF_TOKEN, name, subject, mood, tier, finalScore, researchData, hasName, hasSubject, hasMood);

    if (!result || !result.roast || result.roast.length < 20) {
      result = {
        roast: getFallbackRoast(tier, subject || name || 'ye'),
        subject_insight: "Waah bhai waah...",
        isPublicFigure,
        publicFigureStatus
      };
    }

  } catch (error) {
    console.log("Error:", error.message);
    result = {
      roast: getFallbackRoast(tier, subject || name || 'ye'),
      subject_insight: "Kya baat hai...",
      isPublicFigure: false,
      publicFigureStatus: 'none'
    };
  }

  const enforcedData = enforceRarityProbabilities(tier, finalScore, isPublicFigure, publicFigureStatus);
  tier = enforcedData.tier;
  finalScore = enforcedData.score;
  
  const { rarity, title, challenge } = getTierData(tier);

  return res.status(200).json({
    aura: {
      score: finalScore,
      roast: result.roast.replace(/^["']|["']$/g, '').trim(),
      subjectInsight: result.subject_insight || "Kya baat hai...",
      rarity,
      title,
      challenge,
      isPublicFigure,
      publicFigureStatus,
      name: hasName ? name.trim() : null,
      subject: hasSubject ? subject.trim() : null,
      mood: hasMood ? mood.trim() : null
    }
  });
}

// ============================================
// DEEPSEEK R1 - RESEARCH TOOL
// ============================================
async function researchWithDeepSeek(token, name) {
  const client = new OpenAI({
    baseURL: "https://router.huggingface.co/v1",
    apiKey: token,
  });

  const researchPrompt = `You are a research assistant. Find roast material about "${name}".

Answer these questions:

1. IS FAMOUS? (Yes/No)
2. PROFESSION? (YouTuber/Actor/Cricketer/Singer/Politician/Influencer/etc)
3. MOST FAMOUS FOR? (Their biggest hit/viral moment/achievement)
4. SIGNATURE THING? (Cap/Dialogue/Look/Style/Catchphrase)
5. IRONIC/FUNNY MOMENT? (Something that backfired/meme/embarrassing but not illegal)
6. STATUS? (Peak/Stable/Falling)

EXAMPLES:

Name: CarryMinati
1. IS FAMOUS? Yes
2. PROFESSION? YouTuber, Roaster
3. MOST FAMOUS FOR? "YouTube vs TikTok" video - Most liked non-music video in India, but YouTube deleted it
4. SIGNATURE THING? Always wears cap, loud screaming style, "Toh kaise hai aap log" catchphrase
5. IRONIC/FUNNY MOMENT? His biggest video got deleted by YouTube - the roaster got roasted by the platform
6. STATUS? Peak

Name: MS Dhoni
1. IS FAMOUS? Yes
2. PROFESSION? Cricketer
3. MOST FAMOUS FOR? Helicopter shot, World Cup 2011 winning six
4. SIGNATURE THING? Long hair (earlier), Calm personality "Captain Cool", keeping wickets
5. IRONIC/FUNNY MOMENT? Known for slow batting in T20s, people joke "thala for a reason" for everything
6. STATUS? Stable (retired but loved)

Name: Virat Kohli
1. IS FAMOUS? Yes
2. PROFESSION? Cricketer
3. MOST FAMOUS FOR? Aggressive batting, chasing records, 2016 T20 World Cup innings vs Pakistan
4. SIGNATURE THING? Aggression on field, bc gesture celebrations, tattoos, fitness freak
5. IRONIC/FUNNY MOMENT? Recent form struggles, gets out on same shots, attitude bigger than recent average
6. STATUS? Stable

Name: Shah Rukh Khan
1. IS FAMOUS? Yes
2. PROFESSION? Actor
3. MOST FAMOUS FOR? DDLJ, romance king, "Palat" scene, arms open pose
4. SIGNATURE THING? Arms spread open pose, romantic dialogues, dimples
5. IRONIC/FUNNY MOMENT? Same romantic pose for 30 years, still doing romance at 55+
6. STATUS? Peak (Pathaan success)

Name: Random Unknown Person
1. IS FAMOUS? No
2-6. Not applicable

NOW RESEARCH: "${name}"

OUTPUT JSON ONLY:
{
  "isFamous": true/false,
  "profession": "...",
  "mostFamousFor": "specific achievement with detail",
  "signatureThing": "what makes them recognizable",
  "ironicMoment": "funny/backfire moment (no legal issues)",
  "status": "peak/stable/falling",
  "bestRoastAngle": "the funniest thing to roast them on"
}`;

  try {
    const completion = await client.chat.completions.create({
      model: "deepseek-ai/DeepSeek-R1:hyperbolic",
      messages: [
        { role: "user", content: researchPrompt }
      ],
      temperature: 0.7,
      max_tokens: 500
    });

    const content = completion.choices[0]?.message?.content;
    if (!content) return null;

    // Extract JSON from response
    const jsonMatch = content.match(/\{[\s\S]*?\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    return null;
  } catch (error) {
    console.log("DeepSeek Research Error:", error.message);
    return null;
  }
}

// ============================================
// LLAMA - ROAST GENERATOR
// ============================================
async function createRoastWithLlama(token, name, subject, mood, tier, finalScore, researchData, hasName, hasSubject, hasMood) {
  const client = new OpenAI({
    baseURL: "https://router.huggingface.co/v1",
    apiKey: token,
  });

  // Build context from research
  let researchContext = '';
  if (researchData && researchData.isFamous) {
    researchContext = `
## RESEARCH RESULTS FOR "${name}":
- Profession: ${researchData.profession}
- Famous For: ${researchData.mostFamousFor}
- Signature: ${researchData.signatureThing}
- Ironic Moment: ${researchData.ironicMoment}
- Best Roast Angle: ${researchData.bestRoastAngle}

USE THIS SPECIFIC INFO IN YOUR ROAST. Reference their actual famous moment.
`;
  }

  const systemPrompt = `Tu ek CREATIVE sarcastic roast comedian hai. Hinglish mein roast kar.

${researchContext}

## ROAST RULES:
- 25-40 words
- 2 sentences max
- Sarcastic tone: "Waah bhai" "Kya baat hai" 🙄
- Gaali naturally beech mein: bc, damn, fuck, chutiya, wahiyat
- 2 emojis
- USE THE SPECIFIC RESEARCH INFO - reference their actual famous thing

## ROAST FORMULA:
[Sarcastic opener] + [Reference their SPECIFIC famous thing] + [Funny twist with gaali]

## EXAMPLE USING RESEARCH:

If research says: "CarryMinati - YouTube vs TikTok video deleted"
Roast: "Waah Carry bhai YouTube vs TikTok itna hit tha ki YouTube ne khud delete kar diya bc 🙄 Roaster ka roast - irony ki dukan damn. 💀"

If research says: "Dhoni - Helicopter shot famous, but slow batting"
Roast: "Bhai helicopter shot legendary hai but itna slow khelta hai ki helicopter bhi land ho jaaye bc 🙄 Captain Cool? Captain Slow bol damn. 💀"

## TIER: ${tier.toUpperCase()} (Score: ${finalScore}/100)

${tier === 'legendary' ? 'Backhanded respect using their achievement' : ''}
${tier === 'epic' ? 'Acknowledge good but find flaw in their famous thing' : ''}
${tier === 'mid' ? 'Roast their famous thing as overrated' : ''}
${tier === 'noob' ? 'Use their ironic moment against them' : ''}
${tier === 'npc' ? 'Full destruction using their fail' : ''}

OUTPUT JSON:
{
  "roast": "creative roast using specific research",
  "subject_insight": "sarcastic one liner"
}`;

  const userContent = hasName && researchData?.isFamous
    ? `Celebrity: "${name}" | Research: ${researchData.bestRoastAngle} | Tier: ${tier.toUpperCase()}

Use the research to make a specific roast about their famous moment. Make it sarcastic with gaali naturally.`
    : `${hasName ? `Name: ${name}` : ''} ${hasSubject ? `Subject: ${subject}` : ''} ${hasMood ? `Mood: ${mood}` : ''} | Tier: ${tier.toUpperCase()}

Sarcastic Hinglish roast bana. 25-40 words.`;

  try {
    const completion = await client.chat.completions.create({
      model: "meta-llama/Meta-Llama-3-70B-Instruct:novita",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userContent }
      ],
      temperature: 1.0,
      max_tokens: 150
    });

    const content = completion.choices[0]?.message?.content;
    if (!content) return null;

    const jsonMatch = content.match(/\{[\s\S]*?\}/);
    return jsonMatch ? JSON.parse(jsonMatch[0]) : { roast: content.trim(), subject_insight: "Waah bc..." };
  } catch (error) {
    console.log("Llama Roast Error:", error.message);
    return null;
  }
}

// ============================================
// HELPER FUNCTIONS
// ============================================

function enforceRarityProbabilities(tier, score, isPublicFigure, publicFigureStatus) {
  const r = Math.random() * 100;
  
  if (isPublicFigure && publicFigureStatus === 'falling') {
    if (r < 50) return { tier: 'mid', score: getScoreForTier('mid') };
    if (r < 80) return { tier: 'noob', score: getScoreForTier('noob') };
    return { tier: 'npc', score: getScoreForTier('npc') };
  }
  
  if (tier === 'legendary' && r > 10) {
    if (r > 70) return { tier: 'epic', score: getScoreForTier('epic') };
    if (r > 40) return { tier: 'mid', score: getScoreForTier('mid') };
    return { tier: 'noob', score: getScoreForTier('noob') };
  }
  
  return { tier, score };
}

function checkForcedExamples(subject, mood) {
  const s = (subject || '').toLowerCase().trim();
  const m = (mood || '').toLowerCase().trim();

  if (s.includes("teacher thinks he")) return 'mid';
  if (s.includes("best influencer")) return 'noob';
  if (s.includes("teacher's favorite")) return 'mid';
  if (s.includes("boss thinks he")) return 'noob';
  if (s.includes("office politics") || s.includes("ass kissing")) return 'npc';
  if (s.includes("workout routine") && m === "funny") return 'mid';
  if (s.includes("cooking skills") && m === "funny") return 'noob';
  if (["test", "testing", "asdf", "hello", "hi"].includes(s) || s.length < 3) return 'npc';

  return null;
}

function calculateWorthiness(subject, mood, name) {
  let score = 0;
  const s = (subject || '').toLowerCase();
  const n = (name || '').toLowerCase();
  const len = (subject || '').length + (name || '').length;

  if (len >= 30) score += 25;
  else if (len >= 15) score += 15;
  else if (len >= 5) score += 8;

  if (n.length > 2) score += 10;
  if (/\s/.test(n) && n.length > 5) score += 15;

  const trash = ['test', 'testing', 'asdf', 'lol', 'lmao', 'hi', 'hello'];
  if (trash.includes(s) || len < 3) score -= 40;

  if (/terrible|awful|obsession|addiction|fear|pathetic|embarrassing/i.test(subject)) score += 15;
  if (/instagram|tiktok|youtube|twitter/i.test(subject)) score += 6;

  return Math.max(0, Math.min(100, score));
}

function getTierCap(w) {
  if (w >= 80) return 'legendary';
  if (w >= 60) return 'epic';
  if (w >= 40) return 'mid';
  if (w >= 20) return 'noob';
  return 'npc';
}

function rollForTier(cap) {
  const r = Math.random() * 100;
  const caps = { npc: 0, noob: 1, mid: 2, epic: 3, legendary: 4 };
  const i = caps[cap];

  if (i >= 4 && r < 1) return 'legendary';
  if (i >= 3 && r < 6) return 'epic';
  if (i >= 2 && r < 45) return 'mid';
  if (i >= 1 && r < 80) return 'noob';
  return 'npc';
}

function getScoreForTier(tier) {
  switch(tier) {
    case 'legendary': return 95 + Math.floor(Math.random() * 6);
    case 'epic': return 80 + Math.floor(Math.random() * 15);
    case 'mid': return 50 + Math.floor(Math.random() * 30);
    case 'noob': return 25 + Math.floor(Math.random() * 25);
    default: return Math.floor(Math.random() * 25);
  }
}

function getTierData(tier) {
  const data = {
    legendary: { rarity: "legendary", title: "LEGENDARY", challenge: "GOATED HAI TU BC 👑" },
    epic: { rarity: "epic", title: "EPIC", challenge: "ALMOST LEGEND DAMN ⚡" },
    mid: { rarity: "mid", title: "MID", challenge: "AVERAGE BC 🔥" },
    noob: { rarity: "noob", title: "NOOB", challenge: "POTENTIAL GAYAB 💀" },
    npc: { rarity: "npc", title: "NPC", challenge: "EXIST KARTA HAI? 😭" }
  };
  return data[tier] || data.npc;
}

function getFallbackRoast(tier, subject) {
  const roasts = {
    legendary: `Waah "${subject}" bhai actually goated hai bc 🙄 Gaali dene ka mann nahi damn respect. 👑`,
    epic: `"${subject}" almost legend hai 🙄 Thoda aur try kar bc damn. ⚡`,
    mid: `Bhai "${subject}" itna average hai ki Excel sheet bore ho jaaye bc 🙄 Personality 404 damn. 🔥`,
    noob: `"${subject}" ka potential WiFi in basement jaisa hai bc 🙄 Signal nahi milega damn. 💀`,
    npc: `Bhai "${subject}" exist bhi karta hai ya loading screen hai bc 🙄 Skip button damn. 😭`
  };
  return roasts[tier] || roasts.npc;
      }
