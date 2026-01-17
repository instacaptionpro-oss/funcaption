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
        subject_insight: "Kya baat hai...", 
        isPublicFigure: false, 
        publicFigureStatus: 'none' 
      };
    }
  } catch (error) {
    console.log("All AI failed:", error.message);
    result = { 
      roast: getFallbackRoast(tier, subject || name || 'this', roastLanguage), 
      subject_insight: "Interesting...", 
      isPublicFigure: false, 
      publicFigureStatus: 'none' 
    };
  }

  const enforcedData = enforceRarityProbabilities(tier, finalScore, result.isPublicFigure, result.publicFigureStatus);
  tier = enforcedData.tier;
  finalScore = enforcedData.score;

  // Change NPC to BOT
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
  const targetName = hasName ? name.trim() : (hasSubject ? subject.trim() : 'bro');

  const systemPrompt = `Tu ek India's Got Latent level comedian hai. Tera kaam hai CLEVER roasts likhna - not just gaaliyan, but SMART observations with perfect punchlines.

## 🎭 INDIA'S GOT LATENT ROASTING STYLE:

### THE FORMULA:
1. **OBSERVATION** - Ek specific truth dhundho about the person
2. **SETUP** - Usko relatable way mein present karo
3. **TWIST** - Unexpected angle laao
4. **PUNCHLINE** - Killer ending jo logo ko "OHHH" bolne pe majboor kare

### ROAST PATTERNS (Use These):

**Pattern 1: "Bhai tu woh..."**
Setup comparison, then destroy.
"Bhai tu woh ladka hai na jo group project mein naam daalke gayab ho jaata hai 💀 Contribution zero, credit full. Life mein bhi yahi kar raha hai basically."

**Pattern 2: "Agar [X] hota toh..."**
Hypothetical destruction.
"Agar talent paani hota na, toh tu Sahara desert mein dehydration se marta 💀 Baarish mein bhi sukha reh jaaye aisa banda hai tu."

**Pattern 3: "Itna [X] hai ki..."**
Extreme exaggeration.
"Bhai itna boring hai tu ki teri biography likhne gaye toh pen bhi so gaya 💀 Pages khud teri story se udna chahte hain."

**Pattern 4: Sarcastic Praise**
Start positive, end brutal.
"Bohot confident hai tu bhai, respect 🙏 Bas thoda talent bhi hota toh sone pe suhaaga ho jaata. Abhi sirf suhaaga hai, sona kidhar hai pata nahi 💀"

**Pattern 5: Self-aware Roast**
Acknowledge something, then flip.
"Dekh bhai main kuch nahi bolunga tere baare mein... tere parents already bohot kuch bol chuke honge. Mera kaam unse easy hai 💀"

**Pattern 6: Comparison Destruction**
Compare to something unexpected.
"Teri personality itni bland hai na ki maggi bina masala ke bhi isse zyada tasty lagti hai 💀 At least usme noodles toh hai, tere mein kya hai?"

**Pattern 7: Callback + Punchline**
Reference something obvious, twist it.
"Bhai tera naam [NAME] hai na? Naam mein hi L hai, life mein bhi L laga hua hai 💀 Consistency toh hai, respect for that."

### 🎯 CELEBRITY SPECIFIC ROASTS:

**SAMAY RAINA:**
"Chess mein toh Grand Master banna hai, but bhai comedy mein abhi pawns se hi haar raha hai 💀 Castle kar castle kar, queen sacrifice kab karega? Content mein risk le na kabhi"

**CARRY MINATI:**
"Bhai youtube pe 40 million subscribers, lekin bhai video mein volume itna high kyun? 💀 Content sunna hai, ear damage nahi chahiye. Roast karta hai ya speakers test karta hai?"

**DHONI:**
"Thala for a reason bolte hain, lekin bhai reason kya hai koi bata do 💀 Slow batting hai, ya hum sab fast forward karein? Helicopter shot legendary hai, but run rate ground pe hai"

**VIRAT KOHLI:**
"King Kohli bolte hain, but bhai form dekh ke lagta hai ki throne kisi aur ko de diya 💀 Aggression same hai, runs udhar gaye. BC ground pe, century dreams mein"

**ELON MUSK:**
"Bhai ne Twitter khareed ke X kar diya 💀 Company ka naam bhi, aur company ki haalat bhi. Genius hai ya genius ka opposite, koi bata do"

**INFLUENCERS (Generic):**
"Bhai influencer hai tu? Kispe influence hai? 💀 Followers toh hai, but kya influence karta hai - unemployment? Content dekh ke lagta hai kamane ke liye bana hai, passion kidhar hai?"

### 🗣️ LANGUAGE STYLE:

${isHindi ? `
**HINDI/HINGLISH RULES:**
- Natural Hinglish flow - jaise dost baat karta hai
- Bad words as PUNCHLINES, not filler: bc, bhai, yaar, damn
- Phrases: "dekh bhai", "sun yaar", "ek baat bata", "samjha kya"
- End with: "💀", "😭", "🔥"
- Sound like STAND-UP COMEDIAN, not robot
` : `
**ENGLISH RULES:**
- Simple English with Indian flavor
- Mix "bro", "yaar", "bhai" naturally
- Bad words at punchlines: damn, shit, bruh
- Sound like Indian comedian doing English set
`}

### ❌ WHAT NOT TO DO:
- Generic gaaliyan without setup
- "Tu chutiya hai bc" type lazy roasts
- Random insults without observation
- Too long boring paragraphs
- Robotic AI-sounding text

### ✅ WHAT TO DO:
- Find ONE specific truth
- Build setup with relatable observation
- Twist with unexpected angle
- Kill with punchline + bad word
- Make it QUOTABLE - logo ko share karna ho

## TIER: ${tier.toUpperCase()}
${tier === 'legendary' ? '→ Backhanded compliment style. Respect dete hue roast karo.' : ''}
${tier === 'epic' ? '→ Almost great hai, but ek flaw hai. Uspe maaro.' : ''}
${tier === 'mid' ? '→ Average existence. Invisible feel karao.' : ''}
${tier === 'noob' ? '→ Below average. Stack failures.' : ''}
${tier === 'npc' ? '→ Full destruction. Existence question karo.' : ''}

## FORMAT:
- 50-80 words (4-5 lines)
- Setup → Build → Punchline structure
- Bad words naturally placed (2-3 max)
- 2 emojis max (💀 😭 🔥)
- Must be QUOTABLE and SHAREABLE

## OUTPUT (JSON only):
{"roast": "your clever roast here", "subject_insight": "one line observation", "isPublicFigure": true/false, "publicFigureStatus": "peak/stable/falling/none"}`;

  const userContent = `Roast: ${targetName}${hasSubject && hasName ? ` (Context: ${subject.trim()})` : ''}${hasMood ? ` | Energy: ${mood}` : ''}

India's Got Latent style roast likh. Clever observation + killer punchline.
${isHindi ? 'Hinglish mein likh.' : 'Simple English with Indian flavor.'}
JSON only. No explanation.`;

  const completion = await client.chat.completions.create({
    model: model,
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userContent }
    ],
    temperature: 1.0,
    max_tokens: 300,
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
    return { roast: cleanRoast(content.trim()), subject_insight: "Kya baat hai...", isPublicFigure: hasName, publicFigureStatus: 'stable' };
  } catch {
    return { roast: cleanRoast(content.trim()), subject_insight: "Interesting...", isPublicFigure: hasName, publicFigureStatus: 'stable' };
  }
}

function cleanRoast(roast) {
  let cleaned = roast;
  [/^oh (bro|wow|damn|well|so)/i, /^well well/i, /^okay so/i, /^let me/i, /^alright/i, /^here's/i].forEach(p => {
    cleaned = cleaned.replace(p, '');
  });
  const words = cleaned.trim().split(/\s+/);
  if (words.length > 100) {
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
    legendary: { rarity: "legendary", title: "LEGENDARY", challenge: h ? "GOAT HAI TU 👑" : "YOU'RE THE GOAT 👑" },
    epic: { rarity: "epic", title: "EPIC", challenge: h ? "ALMOST KING 👑" : "ALMOST THERE ⚡" },
    mid: { rarity: "mid", title: "MID", challenge: h ? "AVERAGE BANDA 🔥" : "MID AT BEST 🔥" },
    noob: { rarity: "noob", title: "NOOB", challenge: h ? "KOSHISH JAARI HAI 💀" : "KEEP TRYING 💀" },
    npc: { rarity: "npc", title: "BOT", challenge: h ? "EXIST KARTA HAI? 😭" : "DO YOU EXIST? 😭" }
  }[tier] || { rarity: "npc", title: "BOT", challenge: "😭" };
}

function getFallbackRoast(tier, subject, language) {
  const h = language === 'hindi';
  
  const roasts = {
    legendary: h 
      ? [
          `Dekh bhai "${subject}" - respect hai tujhe, koi doubt nahi 👑 Talent hai, mehnat hai, sab hai. Bas ek problem hai - ego bhi utna hi bada hai jitna talent. Thoda balance kar, warna talent se zyada ego famous ho jaayega 💀`,
          `Bhai "${subject}" legend hai no cap 👑 But sun, jab tu room mein aata hai na, talent se pehle tera attitude aata hai. Dono mein se ek kam kar - preferably attitude, talent kaam aayega 💀`
        ]
      : [
          `Look "${subject}" - respect where it's due, you're actually talented 👑 But here's the thing - your ego walks into the room before you do. Maybe let the talent speak first? Just a thought 💀`,
          `"${subject}" you're genuinely good, no cap 👑 But bro the way you carry yourself, people see attitude before talent. Balance it out or attitude will overshadow everything 💀`
        ],
    epic: h
      ? [
          `"${subject}" - bhai itna paas hai tu greatness ke 💀 Bas last step pe aake ruk jaata hai har baar. 99% complete karta hai, 1% pe chill maarta hai. Yahi 1% greatness aur "almost great" mein farak hai. Finish kar be ⚡`,
          `Sun "${subject}" - talent hai tujhme genuinely 💀 But bhai consistency kidhar hai? Ek din fire, ek din flop. Audience ko bipolar feel ho raha hai tujhe dekh ke. Stable ho ja thoda ⚡`
        ]
      : [
          `"${subject}" you're so close to being great 💀 But you choke at the last step every time. 99% done, 1% chilling. That 1% is the difference between great and almost. Finish it bro ⚡`,
          `Look "${subject}" - genuine talent hai 💀 But where's the consistency? One day fire, next day flop. You're giving the audience mood swings. Stabilize yourself ⚡`
        ],
    mid: h
      ? [
          `Bhai "${subject}" - tu woh banda hai na jo har party mein hota hai but kisiko yaad nahi rehta 💀 Attendance lagaata hai, presence nahi. Guest list mein naam hai, memories mein nahi. Kuch aisa kar ki log yaad rakhein be 😭`,
          `"${subject}" sun yaar - tujhe dekh ke lagta hai ki God ne "default settings" pe chhod diya 💀 Na too good, na too bad. Bilkul beech mein atka hua. Average ka poster child hai tu literally. Kuch extreme kar life mein 😭`,
          `Dekh "${subject}" - tera phone sirf OTP ke liye bajta hai 💀 Real calls? Sapne mein bhi nahi. WhatsApp pe bhi log seen karke chhod dete hain. Reply ka wait mat kar, pizza delivery waale se zyada engagement nahi hai teri 😭`
        ]
      : [
          `Bro "${subject}" - you're that guy who shows up to every party but nobody remembers 💀 Attendance hai, presence nahi. On the guest list, not in the memories. Do something memorable for once 😭`,
          `"${subject}" looking at you feels like God left you on default settings 💀 Not too good, not too bad. Stuck in the middle. You're literally the poster child for average. Do something extreme 😭`,
          `Look "${subject}" - your phone only rings for OTPs 💀 Real calls? Not even in dreams. People leave you on seen. Don't wait for replies, even pizza delivery guy has more engagement than you 😭`
        ],
    noob: h
      ? [
          `"${subject}" bhai - tujhe dekh ke lagta hai potential toh hai, bas kisi ne dekha nahi 💀 Shayad exist hi nahi karta. Tu woh loading screen hai jo 99% pe atak jaati hai. Kabhi complete nahi hota, log skip kar dete hain 😭`,
          `Sun "${subject}" - tujhe add kiya group mein kyunki pehle se tha, remove kare toh kisi ko pata bhi nahi chalega 💀 Presence itni weak hai ki shadow bhi dhoop maangti hai tujhse. Exist kar thoda properly 😭`,
          `Bhai "${subject}" - tera bio mein "Living life to the fullest" likha hai 💀 But bro life toh chal rahi hai, tu kidhar hai? Fullest kidhar hai? Half bhi nahi bhara abhi tak. Bio change kar, "Existing somehow" likh 😭`
        ]
      : [
          `"${subject}" bro - looks like potential exists somewhere, nobody has seen it though 💀 Maybe it doesn't exist at all. You're that loading screen stuck at 99%. Never completes, people just skip 😭`,
          `Look "${subject}" - you're in the group because you were already there, remove you and nobody notices 💀 Your presence is so weak your shadow asks for sunlight. Exist properly for once 😭`,
          `Bro "${subject}" - your bio says "Living life to the fullest" 💀 But where's the fullest? Not even half full yet. Change it to "Existing somehow" - more accurate honestly 😭`
        ],
    npc: h
      ? [
          `"${subject}" - bhai tu exist karta hai ya glitch hai simulation ka? 💀 Google pe search kiya tujhe, "Did you mean someone else?" aaya. Internet bhi confuse hai tu kaun hai. Relevance itna low hai ki cancel bhi nahi ho sakta 😭`,
          `Dekh "${subject}" - tu woh NPC hai jisko main dialogue skip karta hoon 💀 Story mein role nahi hai tera, background mein blur face hai. Main characters ki journey mein tu loading time hai - necessary evil, but evil 😭`,
          `Bhai "${subject}" sun - agar tu kal disappear ho jaaye na, notice hone mein 3 mahine lagenge 💀 Wo bhi jab koi purane photos dekhe aur bole "ye kaun tha?" Missing person report bhi boring lagegi teri 😭`
        ]
      : [
          `"${subject}" - do you exist or are you a simulation glitch? 💀 Googled you, got "Did you mean someone else?" Even the internet is confused about who you are. So irrelevant you can't even get cancelled 😭`,
          `Look "${subject}" - you're that NPC whose dialogue I skip 💀 No role in the story, just a blur face in background. In main characters' journey, you're the loading time - necessary evil, but evil 😭`,
          `Bro "${subject}" listen - if you disappeared tomorrow, it would take 3 months for anyone to notice 💀 That too when someone sees old photos and goes "who was this?" Even your missing person report would be boring 😭`
        ]
  };
  
  const tierRoasts = roasts[tier] || roasts.npc;
  return tierRoasts[Math.floor(Math.random() * tierRoasts.length)];
       }
