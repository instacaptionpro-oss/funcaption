// /pages/api/generate-aura.js

import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { name, subject, mood } = req.body;

  if (!subject && !mood && !name) {
    return res.status(400).json({ error: "Provide at least name, subject, or mood" });
  }

  try {
    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
    if (!GEMINI_API_KEY) {
      return res.status(500).json({ error: "Gemini API key not configured" });
    }

    const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

    const hasName = name && name.trim().length > 0;
    const hasSubject = subject && subject.trim().length > 0;
    const hasMood = mood && mood.trim().length > 0;

    const forcedTier = checkForcedExamples(subject || '', mood || '');
    let tier, finalScore, isPublicFigure = false, publicFigureStatus = 'none';
    
    if (forcedTier) {
      tier = forcedTier;
      finalScore = getScoreForTier(tier);
    } else {
      const worthiness = calculateWorthiness(subject || '', mood || '', name || '');
      const tierCap = getTierCap(worthiness);
      tier = rollForTier(tierCap);
      finalScore = getScoreForTier(tier);
    }

    const { rarity, title, challenge } = getTierData(tier);

    // ============================================
    // GEMINI WITH GOOGLE SEARCH - NO CONTROVERSY
    // ============================================
    
    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash-exp",
      tools: [{ googleSearch: {} }]
    });

    const systemPrompt = `Tu ek savage roast master hai. Google Search use karke famous logon ke baare mein research kar, phir Hinglish mein roast kar.

## RESEARCH KARNA HAI (Agar name diya hai):
${hasName ? `
Name: "${name.trim()}"
1. Google search kar is person ke baare mein
2. Dekh ye famous hai ya nahi
3. Unka kaam kya hai, personality kaisi hai, content kaisa hai
` : 'No name, subject pe roast kar.'}

## ROAST SIRF IN CHEEZON PE (ACCEPTABLE THINGS):
✅ Unka content/videos/work
✅ Unki public personality
✅ Unka style, dressing, way of talking
✅ Unke achievements (backhanded compliments)
✅ Unka fanbase
✅ Unki catchphrases/famous dialogues
✅ Unka career journey
✅ Funny public moments
✅ How they present themselves
✅ Their ego/confidence

## ROAST MAT KAR IN PE (AVOID STRICTLY):
❌ Controversies (court cases, legal issues)
❌ Scandals (snake case, drugs, etc.)
❌ Personal family matters
❌ Relationships/breakups
❌ Religious/political sensitive topics
❌ Health issues
❌ Anything that could be defamatory

## LANGUAGE - HINGLISH:
Hindi + English mix jaise real friends baat karte hain.

Bad words naturally use kar jaise normal baat karte hai:
- bc, mc, chutiya, gadha, bewakoof, bkl, gandu
- fuck, shit, damn, bitch, ass, pathetic, dumb

Ye gaaliyan forced nahi honi chahiye, naturally flow mein aani chahiye jaise tu apne dost se baat kar raha hai.

## ROAST RULES:
- 40-50 words MAX
- 2-3 sentences
- 2-3 emojis
- Creative aur funny
- Specific facts use kar (unka kaam, personality)
- NO controversy mention

## TIER: ${tier.toUpperCase()} (Score: ${finalScore}/100)

${tier === 'legendary' ? 'Respect de but thoda roast bhi. Backhanded compliments.' : ''}
${tier === 'epic' ? 'Accha hai but ego thoda kam kar uska.' : ''}
${tier === 'mid' ? 'Average hai bc. Mediocrity pe roast.' : ''}
${tier === 'noob' ? 'Below average. Maar de isko.' : ''}
${tier === 'npc' ? 'Bekar hai. Full destruction. No mercy.' : ''}

## EXAMPLES:

For YouTuber/Influencer:
"Bhai tera content itna repetitive hai ki YouTube ne autoplay band kar diya. 💀 Bc har video same thumbnail, same shocked face. Thoda creative ho ja yaar."

For Celebrity:
"Acting toh theek hai teri but bhai itna overacting mat kar. 😭 Har scene mein lagta hai paise ginti kar raha hai dialogue ke beech mein. Bc thoda natural reh."

For Cricketer:
"Bhai batting toh acchi hai teri but bc form aati jaati rehti hai jaise tera WiFi signal. 🔥 Consistent ho ja thoda."

## OUTPUT JSON:
{
  "roast": "40-50 words Hinglish roast on acceptable things only",
  "subject_insight": "one line savage",
  "isPublicFigure": true/false,
  "publicFigureStatus": "peak/stable/falling/none"
}`;

    const userPrompt = `${hasName ? `Name: ${name.trim()}` : ''} ${hasSubject ? `Subject: ${subject.trim()}` : ''} ${hasMood ? `Mood: ${mood}` : ''} | Tier: ${tier.toUpperCase()}

${hasName ? `Google search kar "${name.trim()}" ke baare mein. Unka kaam, content, personality dekh. Phir unke WORK aur PUBLIC PERSONA pe roast kar. CONTROVERSY MAT MENTION KARNA. Gaaliyan naturally use kar.` : 'Hinglish mein roast kar. Gaaliyan naturally daal.'}`;

    const result = await model.generateContent(userPrompt + "\n\n" + systemPrompt);
    const response = await result.response;
    const content = response.text();

    if (!content) throw new Error("No response");

    let parsedResult;
    try {
      const jsonMatch = content.match(/\{[\s\S]*?\}/);
      parsedResult = jsonMatch ? JSON.parse(jsonMatch[0]) : { 
        roast: content.trim(), 
        subject_insight: "Kya hi bole...", 
        isPublicFigure: false, 
        publicFigureStatus: 'none'
      };
    } catch {
      parsedResult = { 
        roast: content.trim(), 
        subject_insight: "Wahiyat...", 
        isPublicFigure: false, 
        publicFigureStatus: 'none'
      };
    }

    isPublicFigure = parsedResult.isPublicFigure || false;
    publicFigureStatus = parsedResult.publicFigureStatus || 'none';

    const enforcedData = enforceRarityProbabilities(tier, finalScore, isPublicFigure, publicFigureStatus);
    tier = enforcedData.tier;
    finalScore = enforcedData.score;
    
    const updatedTierData = getTierData(tier);

    return res.status(200).json({
      aura: {
        score: finalScore,
        roast: parsedResult.roast.replace(/^["']|["']$/g, '').trim(),
        subjectInsight: parsedResult.subject_insight,
        rarity: updatedTierData.rarity,
        title: updatedTierData.title,
        challenge: updatedTierData.challenge,
        isPublicFigure,
        publicFigureStatus,
        name: hasName ? name.trim() : null,
        subject: hasSubject ? subject.trim() : null,
        mood: hasMood ? mood.trim() : null
      }
    });

  } catch (error) {
    console.error("Error:", error);
    
    const forcedTier = checkForcedExamples(subject || '', mood || '');
    let tier = forcedTier || rollForTier(getTierCap(calculateWorthiness(subject || '', mood || '', name || '')));
    let finalScore = getScoreForTier(tier);
    const { rarity, title, challenge } = getTierData(tier);
    
    return res.status(200).json({ 
      aura: {
        score: finalScore,
        roast: getFallbackRoast(tier, subject || name || 'ye'),
        subjectInsight: "Bahut kuch bolta hai...",
        rarity, title, challenge,
        isPublicFigure: false,
        publicFigureStatus: 'none',
        name: name || null,
        subject: subject || null,
        mood: mood || null
      }
    });
  }
}

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
    legendary: { rarity: "legendary", title: "LEGENDARY", challenge: "TU STANDARD HAI BC. BAKIYON KI AUKAAT NAHI. 👑" },
    epic: { rarity: "epic", title: "EPIC", challenge: "ALMOST GODLIKE. BAS THODA AUR GRIND KAR BHAI. ⚡" },
    mid: { rarity: "mid", title: "MID", challenge: "AVERAGE AF. NA GHAR KA NA GHAAT KA. 🔥" },
    noob: { rarity: "noob", title: "NOOB", challenge: "POTENTIAL NOT FOUND BC. GPS BHI CONFUSED HAI. 💀" },
    npc: { rarity: "npc", title: "NPC", challenge: "ERROR 404: TU HAI HI NAHI. WAHIYAT EXISTENCE. 😭" }
  };
  return data[tier] || data.npc;
}

function getFallbackRoast(tier, subject) {
  const roasts = {
    legendary: `"${subject}" ko Legendary mila? Bc tu actually goated hai. Gaali dene ka mann nahi kar raha. Respect yaar. 👑`,
    epic: `"${subject}" got Epic? Dekh bhai tu valid hai. Bc most logon se better hai but Legendary nahi hai tu abhi. ⚡`,
    mid: `"${subject}"? Bhai tu mid hai bc. Na accha na bura, bus hai jaise bland khana. Kuch taste nahi. 🔥`,
    noob: `"${subject}" got Noob? 💀 Bc teri life mein potential dhundhna WiFi signal dhundhne jaisa hai. Kuch nahi milega.`,
    npc: `"${subject}"? Bhai tune kya likh diya ye? 😭 Tu loading screen hai bc jisko koi skip karna chahta hai.`
  };
  return roasts[tier] || roasts.npc;
                                               }
