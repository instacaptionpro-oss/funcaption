// /pages/api/generate-aura.js

import { OpenAI } from "openai";

const AI_MODELS = {
  primary: "meta-llama/Llama-3.3-70B-Instruct:groq",
  backup: "meta-llama/Meta-Llama-3-70B-Instruct"
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { name, subject, mood, language } = req.body;

  if (!subject && !mood && !name) {
    return res.status(400).json({ error: "Provide at least name, subject, or mood" });
  }

  const hasName = name?.trim().length > 0;
  const hasSubject = subject?.trim().length > 0;
  const hasMood = mood?.trim().length > 0;
  const roastLanguage = language || 'english';

  const forcedTier = checkForcedExamples(subject || '', mood || '');
  let tier = forcedTier || rollForTier(getTierCap(calculateWorthiness(subject || '', mood || '', name || '')));
  let finalScore = getScoreForTier(tier);

  let result = null;
  const HF_TOKEN = process.env.HF_TOKEN;

  if (!HF_TOKEN) {
    return res.status(500).json({ error: "API token not configured" });
  }

  try {
    result = await generateRoast(HF_TOKEN, name, subject, mood, tier, finalScore, roastLanguage, hasName, hasSubject, hasMood);
    
    if (!result?.roast || result.roast.length < 30) {
      result = { roast: getFallbackRoast(tier, subject || name || 'this', roastLanguage), subject_insight: "Facts.", isPublicFigure: false, publicFigureStatus: 'none' };
    }
  } catch (error) {
    console.log("Error:", error.message);
    result = { roast: getFallbackRoast(tier, subject || name || 'this', roastLanguage), subject_insight: "Truth.", isPublicFigure: false, publicFigureStatus: 'none' };
  }

  const enforcedData = enforceRarityProbabilities(tier, finalScore, result.isPublicFigure, result.publicFigureStatus);
  tier = enforcedData.tier;
  finalScore = enforcedData.score;

  const { rarity, title, challenge } = getTierData(tier, roastLanguage);

  return res.status(200).json({
    aura: {
      score: finalScore,
      roast: result.roast.replace(/^["']|["']$/g, '').trim(),
      subjectInsight: result.subject_insight,
      rarity, title, challenge,
      isPublicFigure: result.isPublicFigure || false,
      publicFigureStatus: result.publicFigureStatus || 'none',
      language: roastLanguage,
      name: hasName ? name.trim() : null,
      subject: hasSubject ? subject.trim() : null,
      mood: hasMood ? mood.trim() : null
    }
  });
}

async function generateRoast(token, name, subject, mood, tier, finalScore, language, hasName, hasSubject, hasMood) {
  try {
    const result = await callAI(token, AI_MODELS.primary, name, subject, mood, tier, finalScore, language, hasName, hasSubject, hasMood);
    if (result?.roast) return result;
  } catch (error) {
    console.log("PRIMARY failed:", error.message);
  }

  try {
    const result = await callAI(token, AI_MODELS.backup, name, subject, mood, tier, finalScore, language, hasName, hasSubject, hasMood);
    if (result?.roast) return result;
  } catch (error) {
    console.log("BACKUP failed:", error.message);
  }

  return null;
}

async function callAI(token, model, name, subject, mood, tier, finalScore, language, hasName, hasSubject, hasMood) {
  const client = new OpenAI({
    baseURL: "https://router.huggingface.co/v1",
    apiKey: token,
  });

  const isHindi = language === 'hindi';
  const targetName = hasName ? name.trim() : (hasSubject ? subject.trim() : 'bro');

  const systemPrompt = `You're a savage roast comedian. Smart roasts with natural language.

## GOLDEN RULES:

1. Find ONE truth about the person and attack that
2. Observe don't insult directly: "You're the type who..." not just "You suck"
3. Write 3-4 lines (40-70 words)
4. Bad words should flow NATURALLY - not forced, not just at end

## BAD WORDS - HOW TO USE:

### WRONG ❌ (Only at end):
"You're boring. You have no friends. You suck bc"

### WRONG ❌ (Too many):
"Bc tu chutiya hai mc teri shakal bekaar hai bc"

### RIGHT ✅ (Natural flow):
"Bhai what the fuck is this career? Tu itna irrelevant hai ki tera naam Google pe bhi nahi aata. Log tujhe ignore karte hai bc, aur tu sochta hai popular hai 💀"

Bad words should come WHERE THEY FIT NATURALLY - beginning, middle, or end. Like how real friends talk.

${isHindi ? `
## HINDI STYLE:

Use these naturally anywhere: bc, mc, chutiya, saala, damn, fuck, shit, behenchod

GOOD EXAMPLES:

"Abe saale Bantai ke itne beefs hai ki butcher shop khol le 💀 Independent rapper hai kyunki koi sign nahi karna chahta isko bc. Teri rap sunke lagta hai beats ne bhi resign de diya, music nahi torture hai ye 🔥"

"Bhai what the fuck is this content? 💀 Tu influencer hai ya unemployment ka poster child? Sirf teri mummy follow karti hai, wo bhi majboori mein bc. Followers se zyada toh mere ghar mein cockroach hai saale 😭"

"Abe chutiya tu woh type hai jisko log group mein add toh karte hai but mute kar dete hai 💀 Tera phone sirf OTP ke liye bajta hai, real friends toh sapne mein bhi nahi milte. Itna dry hai tu bc ki Sahara bhi ro de 🔥"

"Yaar tu itna forgettable hai ki bc tera naam likhte likhte bhool gaya 💀 God ne tujhe banate waqt alt+tab kar diya kisi aur pe. Existence hai teri but kisi ko damn nahi hai honestly 😭"
` : `
## ENGLISH STYLE:

Use these naturally anywhere: damn, fuck, shit, dumbass, stupid, trash, bro, yaar

GOOD EXAMPLES:

"Bro what the fuck is Bantai's career at this point? 💀 Has so many beefs he should open a damn meat shop. Independent rapper because nobody wants to sign this dude, even autotune gave up on him 🔥"

"Who the hell told you you're an influencer? 💀 Only your mom follows you bro and even she mutes your stories. Your content is so trash that watching paint dry feels like damn entertainment 😭"

"Dude you're the type of guy people add to groups but immediately mute 💀 Your phone only rings for OTPs, real friends? That's just a fucking dream for you. So dry that even deserts feel bad for your boring ass 🔥"

"Bro you're so damn forgettable I forgot your name while typing this shit 💀 God was making you and got distracted, hit alt+tab on someone else. You exist but nobody gives a fuck honestly 😭"
`}

## STRUCTURE:

Line 1: Hook with observation (can have bad word)
Line 2: Twist the knife deeper (can have bad word)
Line 3: Another angle of attack (can have bad word)
Line 4: Final punchline (can have bad word)

Bad words = 2-4 total, spread naturally across lines

## TIER: ${tier.toUpperCase()}
${tier === 'legendary' ? 'Backhanded respect - acknowledge talent but find the flaw' : ''}
${tier === 'epic' ? 'Almost great - so close yet so far, roast the gap' : ''}
${tier === 'mid' ? 'Average nobody - make them feel invisible' : ''}
${tier === 'noob' ? 'Below average - stack their failures hard' : ''}
${tier === 'npc' ? 'Irrelevant - question if they even exist' : ''}

## FORMAT:
- 40-70 words (3-4 lines)
- Bad words spread naturally (2-4 total)
- Smart + savage, not just cursing
- 1-2 emojis (💀 😭 🔥)

## OUTPUT (JSON only):
{"roast": "3-4 line natural roast", "subject_insight": "truth you found", "isPublicFigure": true/false, "publicFigureStatus": "peak/stable/falling/none"}`;

  const userContent = `Roast: ${targetName}${hasSubject && hasName ? ` (${subject.trim()})` : ''}${hasMood ? ` | Mood: ${mood}` : ''}

3-4 lines. Bad words naturally spread, not just at end. Smart roast, not just cursing.
${isHindi ? 'Hinglish.' : 'Simple English.'}
JSON only.`;

  const completion = await client.chat.completions.create({
    model: model,
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userContent }
    ],
    temperature: 1.0,
    max_tokens: 250,
    top_p: 0.95
  });

  const content = completion.choices[0]?.message?.content;
  if (!content) return null;

  try {
    const jsonMatch = content.match(/\{[\s\S]*?\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      parsed.roast = cleanRoast(parsed.roast);
      return parsed;
    }
    return { roast: cleanRoast(content.trim()), subject_insight: "Truth.", isPublicFigure: hasName, publicFigureStatus: 'stable' };
  } catch {
    return { roast: cleanRoast(content.trim()), subject_insight: "Facts.", isPublicFigure: hasName, publicFigureStatus: 'stable' };
  }
}

function cleanRoast(roast) {
  let cleaned = roast;
  
  [/^oh (bro|wow|damn|well|so)/i, /^well well/i, /^okay so/i, /^let me/i, /^alright/i].forEach(p => {
    cleaned = cleaned.replace(p, '');
  });
  
  const words = cleaned.trim().split(/\s+/);
  if (words.length > 85) {
    const sentences = cleaned.match(/[^.!?]+[.!?]+/g) || [cleaned];
    cleaned = sentences.slice(0, 4).join(' ');
  }
  
  return cleaned.trim();
}

function enforceRarityProbabilities(tier, score, isPublicFigure, publicFigureStatus) {
  const r = Math.random() * 100;
  if (isPublicFigure && publicFigureStatus === 'falling') {
    return r < 50 ? { tier: 'mid', score: getScoreForTier('mid') } : r < 80 ? { tier: 'noob', score: getScoreForTier('noob') } : { tier: 'npc', score: getScoreForTier('npc') };
  }
  if (tier === 'legendary' && r > 10) {
    return r > 70 ? { tier: 'epic', score: getScoreForTier('epic') } : r > 40 ? { tier: 'mid', score: getScoreForTier('mid') } : { tier: 'noob', score: getScoreForTier('noob') };
  }
  return { tier, score };
}

function checkForcedExamples(subject, mood) {
  const s = subject.toLowerCase().trim();
  if (s.includes("teacher thinks") || s.includes("teacher's favorite")) return 'mid';
  if (s.includes("best influencer") || s.includes("boss thinks")) return 'noob';
  if (["test", "testing", "asdf", "hello", "hi"].includes(s) || s.length < 3) return 'npc';
  return null;
}

function calculateWorthiness(subject, mood, name) {
  let score = 0;
  const len = (subject || '').length + (name || '').length;
  if (len >= 30) score += 25; else if (len >= 15) score += 15; else if (len >= 5) score += 8;
  if ((name || '').length > 2) score += 10;
  if (/\s/.test(name) && (name || '').length > 5) score += 15;
  if (['test', 'testing', 'asdf', 'lol', 'hi', 'hello'].includes((subject || '').toLowerCase()) || len < 3) score -= 40;
  return Math.max(0, Math.min(100, score));
}

function getTierCap(w) {
  return w >= 80 ? 'legendary' : w >= 60 ? 'epic' : w >= 40 ? 'mid' : w >= 20 ? 'noob' : 'npc';
}

function rollForTier(cap) {
  const r = Math.random() * 100;
  const i = { npc: 0, noob: 1, mid: 2, epic: 3, legendary: 4 }[cap];
  if (i >= 4 && r < 1) return 'legendary';
  if (i >= 3 && r < 6) return 'epic';
  if (i >= 2 && r < 45) return 'mid';
  if (i >= 1 && r < 80) return 'noob';
  return 'npc';
}

function getScoreForTier(tier) {
  const scores = { legendary: [95, 6], epic: [80, 15], mid: [50, 30], noob: [25, 25], npc: [0, 25] };
  const [base, range] = scores[tier] || scores.npc;
  return base + Math.floor(Math.random() * range);
}

function getTierData(tier, language) {
  const h = language === 'hindi';
  return {
    legendary: { rarity: "legendary", title: "LEGENDARY", challenge: h ? "RESPECT HAI 👑" : "RESPECT 👑" },
    epic: { rarity: "epic", title: "EPIC", challenge: h ? "ALMOST BHAI ⚡" : "ALMOST THERE ⚡" },
    mid: { rarity: "mid", title: "MID", challenge: h ? "KON HAI TU? 🔥" : "WHO ARE YOU? 🔥" },
    noob: { rarity: "noob", title: "NOOB", challenge: h ? "SAD LIFE 💀" : "SAD LIFE 💀" },
    npc: { rarity: "npc", title: "NPC", challenge: h ? "EXIST BHI KARTA HAI? 😭" : "DO YOU EXIST? 😭" }
  }[tier] || { rarity: "npc", title: "NPC", challenge: "😭" };
}

function getFallbackRoast(tier, subject, language) {
  const h = language === 'hindi';
  
  const roasts = {
    legendary: h 
      ? [`"${subject}" damn bhai tu talented hai no doubt 💀 But ek baat sun, meri ek line teri puri career se heavy hai bc. Respect hai tujhe but thoda ego kam kar, legendary banne mein abhi time hai 🔥`]
      : [`"${subject}" damn bro you're talented no doubt 💀 But listen, my one line hits harder than your whole fucking career. Respect to you but lower that ego, you're not legendary yet shit 🔥`],
    epic: h
      ? [`"${subject}" saale tu almost kuch tha yaar 💀 Itna paas aake ruk gaya, what the fuck happened? Potential hai but bc execution zero hai. Almost mein hi marr jayega tu, finish line cross kar pehle 😭`]
      : [`"${subject}" dude you were almost something 💀 Got so damn close then stopped, what the fuck happened? Got potential but zero execution bro. You'll die in the almost zone, cross the finish line first shit 😭`],
    mid: h
      ? [
          `"${subject}" bhai what the fuck is this existence? 💀 Tu woh type hai jisko log 'haan bro' bolke ignore karte hai bc. Tera phone sirf OTP ke liye bajta hai, real calls toh sapne mein bhi nahi. Itna invisible hai tu ki Google bhi dhundh nahi pata 😭`,
          `"${subject}" abe saale teri personality itni dry hai ki Rajasthan jealous hai 💀 Tu exist karta hai but honestly kisi ko damn nahi hai bc. Background mein blur face hai tu, notice karne layak kuch hai hi nahi tujhme 🔥`,
        ]
      : [
          `"${subject}" bro what the fuck is this existence? 💀 You're the type people say 'yeah bro' to and completely damn forget. Your phone only rings for OTPs, real friends? Just a fucking dream. So invisible even Google can't find you 😭`,
          `"${subject}" dude your personality is so dry that deserts are jealous 💀 You exist but honestly nobody gives a shit bro. You're just a blur face in the background, nothing worth noticing about you damn 🔥`,
        ],
    noob: h
      ? [
          `"${subject}" abe chutiya tu itna forgettable hai ki bc tera naam likhte likhte bhool gaya 💀 Log tujhse baat karte hai sirf isliye kyunki tu pehle se group mein hai. Nikal de toh kisi ko yaad bhi nahi aayega saale 😭`,
          `"${subject}" bhai tera potential toh hai, bas what the fuck kisi ne dekha nahi 💀 Shayad exist hi nahi karta wo bc. Tu woh loading screen hai jo kabhi complete nahi hoti, buffer pe atka hai permanently 🔥`,
        ]
      : [
          `"${subject}" dude you're so damn forgettable I forgot your name while typing this shit 💀 People only talk to you because you're already in the group bro. Remove yourself and nobody will fucking notice 😭`,
          `"${subject}" bro you got potential, but what the fuck nobody has seen it 💀 Maybe it doesn't exist at all damn. You're that loading screen that never completes, stuck on buffer permanently shit 🔥`,
        ],
    npc: h
      ? [
          `"${subject}" abe tu exist bhi karta hai bc? Google ko bhi nahi pata 💀 Tu woh NPC hai jisko main dialogue skip karta hoon saale. Teri puri damn life ek loading screen hai jo buffer pe atki hai, koi farak nahi padta tera 😭`,
          `"${subject}" bhai what the fuck tujhe dekhne se behtar main wall ghoorun 💀 Kam se kam wo boring reply nahi karti bc. Tera existence literally ek waste of space hai, oxygen ki bhi barbaadi ho rahi hai tujhpe saale 🔥`,
        ]
      : [
          `"${subject}" bro do you even fucking exist? Google doesn't know either 💀 You're that NPC whose dialogue I always skip damn. Your whole life is a loading screen stuck on buffer, nobody gives a shit honestly 😭`,
          `"${subject}" dude what the fuck I'd rather stare at a wall than look at you 💀 At least the wall doesn't give boring replies bro. Your existence is literally a waste of damn space, even oxygen is wasted on you shit 🔥`,
        ]
  };
  
  const tierRoasts = roasts[tier] || roasts.npc;
  return tierRoasts[Math.floor(Math.random() * tierRoasts.length)];
      }
