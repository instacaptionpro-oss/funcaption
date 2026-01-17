// /pages/api/generate-aura.js

import { OpenAI } from "openai";

const AI_PROVIDERS = [
  {
    name: "Groq",
    baseURL: "https://router.huggingface.co/v1",
    model: "meta-llama/Llama-3.3-70B-Instruct:groq",
    tokenEnv: "HF_TOKEN"
  },
  {
    name: "Together",
    baseURL: "https://router.huggingface.co/v1",
    model: "meta-llama/Meta-Llama-3-70B-Instruct:together",
    tokenEnv: "HF_TOKEN"
  },
  {
    name: "Hyperbolic",
    baseURL: "https://api.hyperbolic.xyz/v1",
    model: "meta-llama/Llama-3.3-70B-Instruct",
    tokenEnv: "HYPERBOLIC_TOKEN"
  },
  {
    name: "Novita",
    baseURL: "https://router.huggingface.co/v1",
    model: "meta-llama/Meta-Llama-3-70B-Instruct:novita",
    tokenEnv: "HF_TOKEN"
  },
  {
    name: "HuggingFace",
    baseURL: "https://router.huggingface.co/v1",
    model: "meta-llama/Meta-Llama-3-70B-Instruct",
    tokenEnv: "HF_TOKEN"
  }
];

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
  const roastLanguage = language || 'hindi';

  const forcedTier = checkForcedExamples(subject || '', mood || '');
  let tier = forcedTier || rollForTier(getTierCap(calculateWorthiness(subject || '', mood || '', name || '')));
  let finalScore = getScoreForTier(tier);

  let result = null;

  try {
    result = await generateRoastWithFallbacks(name, subject, mood, tier, finalScore, roastLanguage, hasName, hasSubject, hasMood);
    
    if (!result?.roast || result.roast.length < 30) {
      result = { 
        roast: getFallbackRoast(tier, subject || name || 'this', roastLanguage), 
        subject_insight: "Tatti existence", 
        isPublicFigure: false, 
        publicFigureStatus: 'none' 
      };
    }
  } catch (error) {
    console.log("All AI failed:", error.message);
    result = { 
      roast: getFallbackRoast(tier, subject || name || 'this', roastLanguage), 
      subject_insight: "Average life", 
      isPublicFigure: false, 
      publicFigureStatus: 'none' 
    };
  }

  const enforcedData = enforceRarityProbabilities(tier, finalScore, result.isPublicFigure, result.publicFigureStatus);
  tier = enforcedData.tier;
  finalScore = enforcedData.score;

  let displayTitle = getTierData(tier, roastLanguage).title;
  if (tier === 'npc') displayTitle = 'BOT';

  const { rarity, challenge } = getTierData(tier, roastLanguage);

  return res.status(200).json({
    aura: {
      score: finalScore,
      roast: result.roast.replace(/^["']|["']$/g, '').trim(),
      subjectInsight: result.subject_insight,
      rarity,
      title: displayTitle,
      challenge,
      isPublicFigure: result.isPublicFigure || false,
      publicFigureStatus: result.publicFigureStatus || 'none',
      language: roastLanguage,
      name: hasName ? name.trim() : null,
      subject: hasSubject ? subject.trim() : null,
      mood: hasMood ? mood.trim() : null
    }
  });
}

async function generateRoastWithFallbacks(name, subject, mood, tier, finalScore, language, hasName, hasSubject, hasMood) {
  for (let i = 0; i < AI_PROVIDERS.length; i++) {
    const provider = AI_PROVIDERS[i];
    const token = process.env[provider.tokenEnv];
    
    if (!token) continue;

    try {
      console.log(`🔄 Trying ${provider.name}...`);
      const result = await callAI(provider.baseURL, token, provider.model, name, subject, mood, tier, finalScore, language, hasName, hasSubject, hasMood);
      if (result?.roast && result.roast.length > 30) {
        console.log(`✅ ${provider.name} SUCCESS`);
        return result;
      }
    } catch (error) {
      console.log(`❌ ${provider.name} FAILED: ${error.message}`);
      continue;
    }
  }
  return null;
}

async function callAI(baseURL, token, model, name, subject, mood, tier, finalScore, language, hasName, hasSubject, hasMood) {
  const client = new OpenAI({
    baseURL: baseURL,
    apiKey: token,
  });

  const isHindi = language === 'hindi';
  const targetName = hasName ? name.trim() : (hasSubject ? subject.trim() : 'bhai');

  const systemPrompt = `Tu ek dank Indian roaster hai. Full savage mode. Natural roasting - mix karo sab kuch, ek topic pe mat atko.

## 🎯 ROASTING PHILOSOPHY:

Tu ek real dost jaisa roast kar - matlab NATURALLY mix kar:
- Reality checks
- Life observations  
- Career/future attacks
- Looks/appearance
- Personality flaws
- Relationship status
- Family mention (kabhi kabhi, har baar nahi)
- Financial status
- Social life
- Intelligence
- Choices & decisions

IMPORTANT: Ek hi topic pe mat ruk. Natural flow rakh. Real life mein dost aise roast karte hain - thoda idhar, thoda udhar, sab mix.

## 🗣️ BAD WORDS (Use Naturally):
bc, mc, chutiya, gaandu, laude, bhosdike, saale, tatti, lawde, bhenchod, gandu, madarchod

## 🔥 ROAST INGREDIENTS (MIX THESE):

### 1. REALITY CHECKS:
- "Bhai tu mirror mein dekhta hai ya sidha delusion mein jeeta hai bc"
- "Tujhe lagta hai tu special hai, reality mein tu replacement hai mc"
- "Duniya mein 8 billion log hain aur tu sabse average hai chutiye"

### 2. CAREER/FUTURE:
- "Tera resume dekh ke HR bhi depressed ho jaaye bc"
- "Future mein kya karega? Wohi jo abhi kar raha hai - nothing mc"
- "LinkedIn pe 'Open to work' likha hai, life mein bhi open to L hai chutiye"

### 3. LOOKS/APPEARANCE:
- "Shakal dekh ke lagta hai genetic lottery mein last aaya tha bc"
- "Teri photo dekh ke camera bhi focus lose kar de mc"
- "Mirror tujhe dekh ke crack hota hai ya tu dekh ke chutiye"

### 4. PERSONALITY:
- "Personality itni dry hai ki Sahara bhi tujhse paani maange bc"
- "Tu room mein aaye toh vibe check fail ho jaaye mc"
- "Tera aura itna weak hai ki ghosts bhi avoid karte hain chutiye"

### 5. RELATIONSHIP/SINGLE:
- "Single hai kyunki options nahi hain, choice nahi bc"
- "Tinder pe right swipe karne waali bhi bots hain mc"
- "Crush bhi tujhe friendzone nahi karti, directly ignore karti hai chutiye"

### 6. INTELLIGENCE:
- "Brain cells itne kam hain ki ek haath pe ginn le bc"
- "IQ room temperature se kam hai mc (celsius mein)"
- "Google bhi tera question dekh ke confused ho jaaye chutiye"

### 7. SOCIAL LIFE:
- "Friends? Bhai group mein bhi tu plus one hai bc"
- "Party mein tujhe kaun bulata hai? Sirf headcount ke liye mc"
- "Tera best friend bhi secretly tujhe tolerate karta hai chutiye"

### 8. MONEY/STATUS:
- "Bank balance dekh ke ATM bhi hass deta hai bc"
- "Itna broke hai ki window shopping mein bhi budget cross ho jaaye mc"
- "Paisa nahi hai, personality nahi hai, phir confidence kahan se aata hai chutiye"

### 9. FAMILY (KABHI KABHI - Natural Use):
- "Papa proud nahi hain, ye toh tu bhi jaanta hai bc"
- "Ghar wale rishtedaaron ko tujhe introduce karte hue topic change karte hain mc"
- "Mummy ne itna invest kiya tujhme, return negative mein hai chutiye"
(Ye har roast mein mat daal, naturally fit ho toh daal)

### 10. EXISTENCE/RELEVANCE:
- "Tu exist karta hai ya NPC hai simulation ka bc"
- "Agar tu kal gayab ho jaaye, notice hone mein mahine lagenge mc"
- "Tera contribution duniya mein zero hai chutiye, oxygen waste kar raha hai"

## 🎭 NATURAL ROAST EXAMPLES:

**Example 1 - Mixed Natural:**
"${targetName} bhai shakal dekh ke lagta hai alarm clock bhi tujhe uthane mein regret karta hai bc 💀 Career mein kuch ukhaada nahi, relationship status 'it's complicated' with life itself mc. Friends bhi tere peeche hasste hain, tune notice nahi kiya kyunki notice karne layak kuch hai hi nahi tere mein chutiye 😭"

**Example 2 - Reality + Social:**
"Abe ${targetName} tujhe lagta hai tu main character hai bc? Bhai tu background mein blur face hai jo koi notice nahi karta 💀 Party mein entry hoti hai teri - energy down, vibe dead mc. Itna boring hai ki teri company mein log phone dekhte hain, tujhe nahi chutiye 😭"

**Example 3 - Career + Looks + Personality:**
"${targetName} resume mein skills section khali hai, shakal section mein bhi kuch nahi bc 💀 Personality se compensate karta toh samajh aata, wo bhi dry hai Rajasthan se mc. Triple threat hai tu - no talent, no looks, no vibe chutiye 😭"

**Example 4 - With Family (Natural fit):**
"Bhai ${targetName} tu itna average hai ki papa bhi secretly sochte hain 'doosra bachcha karna chahiye tha' bc 💀 Career nahi hai, girlfriend nahi hai, future nahi hai - basically options nahi hain tere paas mc. Exist karta hai bas, contribute kuch nahi karta chutiye 😭"

## 🎯 CELEBRITY ROASTS (Mixed Style):

**SAMAY RAINA:**
"Abe Samay chess mein GM banna hai, comedy mein abhi bhi opening moves chal raha hai bc 💀 Shakal dekh ke lagta hai neend puri nahi hoti, content dekh ke lagta hai effort bhi pura nahi hai mc. Latent hai talent, itna latent ki dhundhna padta hai chutiye 😭"

**CARRY MINATI:**
"Carry bhai 40M subscribers hain, but bhai 2019 ke baad creativity bhi subscribe nahi hai tujhe bc 💀 Itna chillata hai video mein ki content sunai nahi deta mc. Roast karta hai doosro ko, khudko mirror mein dekh kabhi chutiye 😭"

**VIRAT KOHLI:**
"Kohli bhai aggression same hai, runs gayab hain bc 💀 71st century se pehle fans ki patience khatam ho jayegi mc. Ground pe BC bolta hai, scoreboard bhi BC bol raha hai - Bahut Chutiya performance chutiye 😭"

**INFLUENCERS:**
"Bhai influencer hai tu? 10K followers hain, 9K bots hain, 1K pity follows bc 💀 Content toh hai nahi, bas ring light aur confidence hai mc. Kispe influence hai tera? Khudpe bhi nahi chutiye 😭"

## 📝 STRUCTURE:

1. **Opening Attack** - Direct observation ya reality check
2. **Build Up** - Ek aur angle se attack (different topic)
3. **Third Punch** - Teesra angle (again different)
4. **Killer Ending** - Final blow with bad word + emoji

## ❌ DON'T DO:
- Sirf ek topic pe roast (like sirf family, ya sirf looks)
- Death wishes
- Too extreme stuff
- Repetitive jokes

## ✅ DO:
- Mix multiple angles naturally
- Bad words throughout but naturally placed
- Personal + general observations
- Specific + relatable
- Quotable for Instagram
- 50-90 words

## TIER: ${tier.toUpperCase()}
${tier === 'legendary' ? '→ Backhanded respect + small flaws. Mix: talent acknowledge + ego check + one weakness' : ''}
${tier === 'epic' ? '→ Almost great + what's missing. Mix: potential + consistency issue + reality check' : ''}
${tier === 'mid' ? '→ Average existence. Mix: career + social + personality + maybe family' : ''}
${tier === 'noob' ? '→ Below average. Mix: failures + looks + future + relationships' : ''}
${tier === 'npc' ? '→ Full destruction. Mix: existence + relevance + every aspect roast' : ''}

## OUTPUT (JSON only):
{"roast": "natural mixed roast - multiple angles", "subject_insight": "one line savage", "isPublicFigure": true/false, "publicFigureStatus": "peak/stable/falling/none"}`;

  const userContent = `Roast: ${targetName}${hasSubject && hasName ? ` (Context: ${subject.trim()})` : ''}${hasMood ? ` | Mood: ${mood}` : ''}

Natural mixed roast likh - ek topic pe mat atko. Multiple angles use kar: looks, career, personality, social life, reality checks sab mix kar naturally.
${isHindi ? 'Hinglish mein likh.' : 'English with Hindi gaali.'}
Bad words naturally use kar. 50-90 words.
JSON only.`;

  const completion = await client.chat.completions.create({
    model: model,
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userContent }
    ],
    temperature: 1.1,
    max_tokens: 400,
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
    return { roast: cleanRoast(content.trim()), subject_insight: "Average existence", isPublicFigure: hasName, publicFigureStatus: 'stable' };
  } catch {
    return { roast: cleanRoast(content.trim()), subject_insight: "Tatti life", isPublicFigure: hasName, publicFigureStatus: 'stable' };
  }
}

function cleanRoast(roast) {
  let cleaned = roast;
  [/^oh (bro|wow|damn|well|so)/i, /^well well/i, /^okay so/i, /^let me/i, /^alright/i, /^here's/i].forEach(p => {
    cleaned = cleaned.replace(p, '');
  });
  const words = cleaned.trim().split(/\s+/);
  if (words.length > 110) {
    const sentences = cleaned.match(/[^.!?]+[.!?]+/g) || [cleaned];
    cleaned = sentences.slice(0, 5).join(' ');
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
    legendary: { rarity: "legendary", title: "LEGENDARY", challenge: h ? "RESPECT HAI BC 👑" : "RESPECT 👑" },
    epic: { rarity: "epic", title: "EPIC", challenge: h ? "ALMOST KING ⚡" : "ALMOST THERE ⚡" },
    mid: { rarity: "mid", title: "MID", challenge: h ? "AVERAGE INSAAN 🔥" : "MID AF 🔥" },
    noob: { rarity: "noob", title: "NOOB", challenge: h ? "L LE BC 💀" : "TAKE THIS L 💀" },
    npc: { rarity: "npc", title: "BOT", challenge: h ? "EXIST BHI KARTA HAI? 😭" : "DO YOU EXIST? 😭" }
  }[tier] || { rarity: "npc", title: "BOT", challenge: "😭" };
}

function getFallbackRoast(tier, subject, language) {
  const h = language === 'hindi';
  
  const roasts = {
    legendary: h 
      ? [
          `Abe "${subject}" talent hai tere mein bc, koi doubt nahi 👑 Bas ego bhi utna hi bada hai jitna talent mc. Room mein pehle tera attitude aata hai, phir tu. Thoda balance kar chutiye, warna talent famous hone se pehle ego famous ho jaayega 💀`,
          `Sun "${subject}" - respect hai tujhe genuinely bc 👑 Lekin bhai har jagah gyaan dena zaroori hai kya mc? Camera ke saamne alag, peeche alag. Authentic reh thoda chutiye, fake smile se asli fans nahi bante 💀`
        ]
      : [
          `"${subject}" you got talent no doubt bc 👑 But ego is equally big mc. Your attitude enters before you do. Balance it chutiye or ego will overshadow talent 💀`,
          `"${subject}" respect where it's due bc 👑 But do you have to flex everywhere mc? On camera one person, off camera another. Stay authentic chutiye 💀`
        ],
    epic: h
      ? [
          `Abe "${subject}" itna paas hai tu greatness ke bc, bas last moment pe somehow gaand fat jaati hai teri 💀 Talent hai, potential hai, lekin execution mein tatti mc. Har baar 99% pe atakta hai, 1% confidence ki kami hai chutiye. Finish kar na kuch life mein 😭`,
          `"${subject}" sun bc - almost star hai tu, almost 💀 Career thoda better ho sakta hai, looks thode better ho sakte hain, personality thodi better ho sakti hai mc. Basically sab mein "thoda" kami hai chutiye. Jack of all, master of none gaandu 😭`
        ]
      : [
          `"${subject}" you're so close to greatness bc, but you choke at the last moment somehow 💀 Talent hai, potential hai, but execution tatti mc. Always stuck at 99%, missing 1% confidence chutiye 😭`,
          `"${subject}" you're almost a star, almost bc 💀 Career could be better, looks could be better, personality could be better mc. "Thoda" kami everywhere chutiye. Jack of all, master of none 😭`
        ],
    mid: h
      ? [
          `Bhai "${subject}" tu itna average hai ki statistics mein example ban jaaye bc 💀 Career mein kuch special nahi, looks mein kuch special nahi, personality mein toh bilkul nahi mc. Agar mediocrity ek insaan hoti toh tu hota chutiye. Kuch toh unique kar life mein gaandu 😭`,
          `"${subject}" dekh yaar - tu woh banda hai jisko log yaad nahi rakhte bc 💀 Party mein aata hai, koi notice nahi karta. Jaata hai, koi miss nahi karta mc. Presence itni weak hai ki WiFi signal bhi tujhse strong hai chutiye. Exist karta hai but matter nahi karta gaandu 😭`,
          `Abe "${subject}" shakal average, career average, personality average bc 💀 Tinder pe bhi average swipes aate hain tere mc. Life ka algorithm bhi tujhe middle mein rakhta hai chutiye. Na famous, na failure - sirf forgettable gaandu 😭`
        ]
      : [
          `"${subject}" you're so average you could be a statistics example bc 💀 Nothing special in career, looks, or personality mc. If mediocrity was a person, it would be you chutiye. Do something unique 😭`,
          `"${subject}" you're that guy nobody remembers bc 💀 Come to party, no one notices. Leave, no one misses mc. Your presence is weaker than WiFi signal chutiye. You exist but don't matter 😭`,
          `"${subject}" average face, average career, average personality bc 💀 Even Tinder gives you average swipes mc. Life's algorithm keeps you in the middle chutiye. Not famous, not failure - just forgettable 😭`
        ],
    noob: h
      ? [
          `Abe laude "${subject}" - shakal dekh ke lagta hai God ne mistake ki thi bc 💀 Career nahi hai, girlfriend nahi hai, future nahi hai mc. Triple L combo hai tu - looks mein L, life mein L, love mein L chutiye. Kisi cheez mein toh W le gaandu 😭`,
          `"${subject}" sun bc - tujhe dekh ke lagta hai potential exist hi nahi karta 💀 Resume khali hai, bank account khali hai, social life khali hai mc. Itna khali khali ki vacuum cleaner bhi tujhse kuch nahi le sakta chutiye. Fill kar kuch life mein gaandu 😭`,
          `Bhai "${subject}" tu woh loading screen hai jo kabhi complete nahi hoti bc 💀 Log wait karte karte skip kar dete hain mc. Tera buffering permanent hai chutiye. Life mein progress bar 10% pe atka hai 5 saal se gaandu 😭`
        ]
      : [
          `"${subject}" looking at your face feels like God made a mistake bc 💀 No career, no girlfriend, no future mc. Triple L combo - looks L, life L, love L chutiye. Win at something at least 😭`,
          `"${subject}" looking at you feels like potential doesn't exist bc 💀 Resume empty, bank empty, social life empty mc. So empty that vacuum cleaner can't take anything from you chutiye. Fill something in life 😭`,
          `"${subject}" you're that loading screen that never completes bc 💀 People wait then skip mc. Your buffering is permanent chutiye. Life's progress bar stuck at 10% for 5 years 😭`
        ],
    npc: h
      ? [
          `Abe laude "${subject}" - tu exist karta hai ya simulation glitch hai bc? 💀 Google pe search kiya, results nahi aaye mc. Shakal bhi generic hai, naam bhi generic hai, personality toh hai hi nahi chutiye. NPC energy hai teri - koi story mein role nahi, bas background mein blur face gaandu 😭`,
          `"${subject}" sun bc - agar tu kal gayab ho jaaye, duniya ko pata next year chalega 💀 Wo bhi jab koi purane photos dekhe aur bole "ye kaun tha" mc. Tera existence itna pointless hai ki oxygen bhi waste ho rahi hai tujhpe chutiye. Carbon footprint se zyada toh bore footprint hai tera gaandu 😭`,
          `Bhai "${subject}" tujhe dekh ke lagta hai God ne save karna bhool gaya aur file corrupt ho gayi bc 💀 Features load nahi hue, personality install nahi hui mc. Tera existence ek error hai jo koi fix nahi karna chahta chutiye. Ctrl+Z karna chahiye tha teri life pe gaandu 😭`
        ]
      : [
          `"${subject}" do you exist or are you a simulation glitch bc? 💀 Googled you, no results mc. Generic face, generic name, no personality chutiye. NPC energy - no role in story, just blur face in background 😭`,
          `"${subject}" if you disappear tomorrow, world will know next year bc 💀 That too when someone sees old photos and asks "who was this" mc. Your existence is so pointless oxygen is wasted on you chutiye. More bore footprint than carbon footprint 😭`,
          `"${subject}" looking at you feels like God forgot to save and file got corrupted bc 💀 Features didn't load, personality didn't install mc. Your existence is an error nobody wants to fix chutiye. Should've pressed Ctrl+Z on your life 😭`
        ]
  };
  
  const tierRoasts = roasts[tier] || roasts.npc;
  return tierRoasts[Math.floor(Math.random() * tierRoasts.length)];
    }
