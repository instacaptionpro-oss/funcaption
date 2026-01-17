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
        subject_insight: "L + Ratio + Fatherless", 
        isPublicFigure: false, 
        publicFigureStatus: 'none' 
      };
    }
  } catch (error) {
    console.log("All AI failed:", error.message);
    result = { 
      roast: getFallbackRoast(tier, subject || name || 'this', roastLanguage), 
      subject_insight: "Papa proud nahi hai", 
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

  const systemPrompt = `Tu ek dank Indian roaster hai. Tera style = Carryminati + Samay Raina + Indian meme pages + dank humor. Full savage mode, no mercy.

## 🔥 ROASTING ARSENAL:

### BAD WORDS - USE FREELY:
bc, mc, chutiya, gaandu, laude, bhosdike, saale, tatti, lawde, madarchod, bhenchod, gandu

### 👨‍👩‍👦 FAMILY ROASTS (USE THESE):

**Papa/Baap Roasts:**
- "Tera baap doodh lene gaya tha, abhi tak nahi aaya bc 💀"
- "Papa ka disappointment hai tu mc"
- "Baap ne condom use kiya hota toh aaj ye din nahi dekhna padta 💀"
- "Tera baap tujhe dekh ke rota hai raat ko bc"
- "Papa proud nahi hai tujhse, pata hai na chutiye?"
- "Baap ka paisa waste kr raha hai gaandu"
- "Papa ne tujhe hospital mein chhod dena chahiye tha mc"

**Mummy/Maa Roasts:**
- "Teri mummy bhi jaanti hai tu tatti hai bc 💀"
- "Maa ka doodh waste kar diya tune laude"
- "Mummy ne 9 mahine carry kiya, result ye nikla mc 💀"
- "Teri mummy ko bhi sharam aati hogi tujhe introduce karate hue bc"
- "Ghar mein mummy bhi tujhe ignore karti hai na chutiye?"
- "Mummy daddy dono regret karte hain tujhe bc"

**Fatherless/Orphan Jokes (Meme style):**
- "L + Ratio + Fatherless + No bitches 💀"
- "Fatherless behavior bc"
- "Tera baap chod ke gaya tha, ab samajh aaya kyun mc 💀"
- "Baap nahi hai isliye ye haalat hai teri chutiye"
- "Daddy issues dikhra hai bc 💀"

**Disappointment Roasts:**
- "Ghar wale rishtedaaron ko tujhe introduce nahi karte bc 💀"
- "Family WhatsApp group mein bhi muted hai tu mc"
- "Mummy papa dono ko lagta hai tune adopt kiya hota kaash 💀"
- "Tu family ka wo member hai jiske baare mein baat nahi karte bc"
- "Relatives puche 'beta kya karta hai' toh mummy topic change karti hai mc 💀"

### 🎭 MEME FORMATS WITH FAMILY:

**Format 1: Direct Attack**
"Abe laude ${targetName} tera baap bhi jaanta hai tu failure hai 💀 Roz daru peeta hai teri wajah se bc. Khud hi bol 'galti ho gayi' mc."

**Format 2: Comparison**
"${targetName} mummy ne 9 mahine carry kiya, 18 saal paala, aur result kya nikla? 💀 Tu bc. Refund maang leni chahiye teri mummy ko mc."

**Format 3: Disappointment Chain**
"${targetName} papa disappointed, mummy disappointed, relatives disappointed bc 💀 Bas tu khush hai apne aap se chutiye. Delusion bhi itna strong nahi hona chahiye mc."

**Format 4: Fatherless Behavior**
"Ye ${targetName} jaise logo ko dekh ke samajh aata hai fatherless behavior kya hota hai bc 💀 Baap hota toh belt se seedha kar deta mc."

**Format 5: Birth Regret**
"Teri mummy ${targetName} ko dekh ke sochti hai kaash us din headache ka bahana kar diya hota bc 💀 Papa bhi same sochte hain mc. Dono regret karte hain chutiye."

### 🎯 CELEBRITY ROASTS WITH FAMILY:

**SAMAY RAINA:**
"Abe Samay bc chess mein GM banna hai, comedy mein pawn movement hai 💀 Papa ko bol GM ka matlab Grand Mistake nahi hai mc. Mummy proud hai ki nahi ye bata chutiye."

**CARRY MINATI:**
"Carry ke papa sochte hain 40M subscribers hain toh kuch toh sahi kar raha hoga bc 💀 Bhai content 2019 wala hai, papa ko mat batana nahi toh dil toot jayega mc."

**DHONI:**
"Dhoni legend hai but run rate dekh ke baap bhi bolta hoga 'beta thoda fast karo' bc 💀 Thala for a reason? Papa ka BP reason hai mc."

**VIRAT KOHLI:**
"Kohli bhai form gira hai itna ki papa bhi bolte honge 'beta wapas aa jayegi' bc 💀 71st century se pehle papa ka patience khatam ho jayega mc."

**INFLUENCERS:**
"Abe saale influencer hai tu? 💀 Papa ko kya bolta hai 'Content Creator hoon'? bc Papa jaante hain unemployed hai tu mc. Mummy bhi jaanti hai chutiye."

### 🗣️ LANGUAGE STYLE:

${isHindi ? `
**HINGLISH BRUTAL MODE:**
- Family roasts zaroori hai
- Bad words har sentence mein
- Short punchy delivery
- "💀" "😭" "🔥" endings

**STARTERS:**
- "Abe laude..."
- "Sun bc teri mummy bhi..."
- "Tera baap..."
- "Fatherless behavior..."
- "Papa disappointed hai..."
- "Ghar wale jaante hain..."

**ENDINGS:**
- "...bc/mc"
- "...papa proud nahi hai"
- "...mummy regret karti hai"
- "...L + Ratio + Fatherless"
- "...baap chod ke gaya tha isliye"
` : `
**ENGLISH + HINDI GAALI:**
- Mix family roasts naturally
- "Your dad left and now we know why bc 💀"
- "Mommy regrets you mc"
- "Fatherless behavior chutiya"
`}

### ❌ DON'T DO:
- Death wishes to parents
- Sexual content about parents (extreme)
- Genuinely traumatic stuff

### ✅ DO:
- Disappointment jokes ✅
- Fatherless memes ✅
- Baap chod ke gaya jokes ✅
- Mummy regret jokes ✅
- Papa ka paisa waste ✅
- Family ignore karta hai ✅
- Relatives sharam ✅

## TIER: ${tier.toUpperCase()}
${tier === 'legendary' ? '→ Respect with disappointment. "Talent hai bc, bas papa abhi bhi believe nahi karte 👑"' : ''}
${tier === 'epic' ? '→ Almost there. "Itna paas aake ruk gaya, papa ka trust bhi gaya chutiye ⚡"' : ''}
${tier === 'mid' ? '→ Average + family disappointment. "Mummy papa dono ko lagta hai galti ho gayi bc 🔥"' : ''}
${tier === 'noob' ? '→ Failure + family shame. "Papa ne tujhe dekh ke daaru start ki mc 💀"' : ''}
${tier === 'npc' ? '→ Full destruction + orphan jokes. "Baap chod ke gaya tha, ab samajh aaya kyun bc 😭"' : ''}

## FORMAT:
- 50-90 words (4-6 lines)
- 3-5 bad words
- 1-2 family roasts zaroori
- Indian meme style
- 2 emojis (💀 😭 🔥)

## OUTPUT (JSON only):
{"roast": "brutal roast with gaali + family", "subject_insight": "savage one-liner", "isPublicFigure": true/false, "publicFigureStatus": "peak/stable/falling/none"}`;

  const userContent = `Roast: ${targetName}${hasSubject && hasName ? ` (Context: ${subject.trim()})` : ''}${hasMood ? ` | Mood: ${mood}` : ''}

Indian meme style brutal roast likh. Bad words + Family roasts use kar.
${isHindi ? 'Hinglish mein likh with bc mc chutiya + mummy papa jokes.' : 'English with Hindi gaali + family roasts.'}
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
    return { roast: cleanRoast(content.trim()), subject_insight: "Papa proud nahi hai", isPublicFigure: hasName, publicFigureStatus: 'stable' };
  } catch {
    return { roast: cleanRoast(content.trim()), subject_insight: "L + Fatherless", isPublicFigure: hasName, publicFigureStatus: 'stable' };
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
    cleaned = sentences.slice(0, 6).join(' ');
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
    legendary: { rarity: "legendary", title: "LEGENDARY", challenge: h ? "PAPA FINALLY PROUD 👑" : "DAD IS PROUD 👑" },
    epic: { rarity: "epic", title: "EPIC", challenge: h ? "ALMOST PAPA PROUD ⚡" : "ALMOST THERE ⚡" },
    mid: { rarity: "mid", title: "MID", challenge: h ? "PAPA DISAPPOINTED 🔥" : "DAD IS DISAPPOINTED 🔥" },
    noob: { rarity: "noob", title: "NOOB", challenge: h ? "PAPA KO SHARAM AATI HAI 💀" : "DAD IS ASHAMED 💀" },
    npc: { rarity: "npc", title: "BOT", challenge: h ? "BAAP CHOD KE GAYA THA 😭" : "FATHERLESS BEHAVIOR 😭" }
  }[tier] || { rarity: "npc", title: "BOT", challenge: "😭" };
}

function getFallbackRoast(tier, subject, language) {
  const h = language === 'hindi';
  
  const roasts = {
    legendary: h 
      ? [
          `Abe "${subject}" respect hai tujhe bc 👑 Talent hai genuinely. Bas papa ko abhi bhi vishwas nahi hai mc. "Beta kya karta hai?" mein mummy abhi bhi topic change karti hai. Talent hai but family mein clout nahi hai chutiye 💀`,
          `Sun laude "${subject}" tu actually talented hai bc 👑 Papa finally thoda proud feel kar rahe hain mc. 20 saal lage convince karne mein chutiye. Ab aur disappoint mat karna warna ghar se nikal denge gaandu 💀`
        ]
      : [
          `"${subject}" respect where it's due bc 👑 You're talented but papa still doesn't believe mc. When relatives ask "beta kya karta hai?" mummy changes topic chutiye. Talent hai but family clout nahi hai 💀`,
          `"${subject}" you're actually talented bc 👑 Papa is finally kinda proud mc. Took 20 years to convince them chutiye. Don't disappoint now or they'll disown you gaandu 💀`
        ],
    epic: h
      ? [
          `Abe "${subject}" tu itna paas hai bc ⚡ Bas last step pe gaand phat jaati hai mc. Papa sochte hain 'ab hoga beta successful' aur tu disappoint kar deta hai chutiye. Mummy ne itna invest kiya tujhme, return kab milega gaandu? Finish kar na laude 💀`,
          `"${subject}" sun bc ⚡ Talent hai tujhme but consistency nahi mc. Papa ko lagta tha doctor banega, tu influencer ban gaya chutiye. Mummy abhi bhi relatives ko bolta hai 'exploring kar raha hai' gaandu. 30 saal ka hoke bhi explore kar raha hai tatti 💀`
        ]
      : [
          `"${subject}" you're so close bc ⚡ But you choke at the last step mc. Papa thinks 'ab successful hoga' and you disappoint chutiye. Mummy invested so much, where's the return gaandu? Finish it laude 💀`,
          `"${subject}" talent hai but no consistency bc ⚡ Papa thought you'd be doctor, you became "influencer" mc. Mummy still tells relatives "exploring kar raha hai" chutiye. 30 years old and still exploring gaandu 💀`
        ],
    mid: h
      ? [
          `Abe laude "${subject}" mummy papa dono ko lagta hai galti ho gayi bc 💀 Tu woh accident hai jo planned nahi tha mc. 9 mahine carry kiya, 20 saal paala, result? Ek average chutiya jo ghar pe baitha hai gaandu. Mummy relatives ko tujhe introduce nahi karti bhosdike 😭`,
          `"${subject}" sun yaar tera baap tujhe dekh ke roz sochta hai "condom use karna chahiye tha" bc 💀 Papa disappointed, mummy disappointed, relatives confused mc. Tu family ka wo secret hai jisko koi discuss nahi karta chutiye. L + Ratio + Family disappointment gaandu 😭`,
          `Abe saale "${subject}" family WhatsApp group mein bhi muted hai tu bc 💀 Jab rishtedaar aate hain toh mummy tujhe room mein bhej deti hai mc. "Beta kya karta hai?" ka answer nahi hai family ke paas chutiye. Professional disappointment hai tu gaandu 😭`
        ]
      : [
          `"${subject}" mummy papa both think it was a mistake bc 💀 You're that accident that wasn't planned mc. 9 months carrying, 20 years raising, result? Average chutiya sitting at home gaandu. Mummy doesn't introduce you to relatives bhosdike 😭`,
          `"${subject}" your dad looks at you daily thinking "should have used condom" bc 💀 Papa disappointed, mummy disappointed, relatives confused mc. You're the family secret nobody discusses chutiye. L + Ratio + Family disappointment gaandu 😭`,
          `"${subject}" you're muted in family WhatsApp group bc 💀 When relatives visit, mummy sends you to your room mc. "Beta kya karta hai?" - family has no answer chutiye. Professional disappointment gaandu 😭`
        ],
    noob: h
      ? [
          `Abe chutiye "${subject}" papa ne tujhe dekh ke daaru start ki bc 💀 Pehle nahi peete the, ab roz peete hain mc. Teri wajah se ghar mein shaanti nahi hai gaandu. Mummy roz roti hai ki "kahan galti ho gayi" laude. Tu family ka curse hai bhosdike 😭`,
          `"${subject}" sun bc tera baap chod ke gaya tha na? 💀 Ab samajh aaya kyun mc. Tujhe dekh ke koi bhi bhaag jaaye chutiye. Mummy ne tujhe single handedly paala, result ye nikla gaandu? Uski mehnat tatti mein gayi laude 😭`,
          `Abe laude "${subject}" papa ko lagta hai tu adopt karke galti ki bc 💀 Wait tu adopted bhi nahi hai, toh aur bura hai mc. Apna khoon hai aur phir bhi disappointment chutiye. Mummy relatives se bolta hai "kuch health issues hain" tujhe describe karne ke liye gaandu 😭`
        ]
      : [
          `"${subject}" papa started drinking after seeing you bc 💀 Didn't drink before, now daily mc. No peace at home because of you gaandu. Mummy cries daily "kahan galti ho gayi" laude. You're the family curse bhosdike 😭`,
          `"${subject}" your dad left right bc? 💀 Now we know why mc. Anyone would run seeing you chutiye. Mummy raised you alone, this is the result gaandu? Her efforts went to tatti laude 😭`,
          `"${subject}" papa thinks adopting you was a mistake bc 💀 Wait you're not even adopted, that's worse mc. Own blood and still disappointment chutiye. Mummy tells relatives "health issues hain" to describe you gaandu 😭`
        ],
    npc: h
      ? [
          `Abe laude "${subject}" baap chod ke gaya tha tujhe dekh ke bc 💀 Mummy akeli reh gayi tere saath, wo bhi regret karti hai mc. Tu exist karta hai ya glitch hai simulation ka chutiye? Ghar mein bhi koi baat nahi karta tujhse gaandu. Family tree mein tu wo branch hai jo kaat deni chahiye thi bhosdike 😭`,
          `"${subject}" sun bc tu woh galti hai jo teri mummy ne ki thi bc 💀 Papa doodh lene gaye the 15 saal pehle, abhi tak nahi aaye mc. Aur kyun aayein? Tujhe dekhne chutiye? Mummy bhi secretly wish karti hai kaash tu nahi hota gaandu. L + Ratio + Fatherless + Motherless love bhosdike 😭`,
          `Abe chutiye "${subject}" agar tu kal mar jaaye na, funeral mein 4 log aayenge bc 💀 Wo bhi confirm karne ki tu sach mein gaya mc. Mummy papa relieved honge secretly chutiye. "Ek bojh kam hua" yehi sochenge gaandu. Tu family ke liye insurance money se zyada kuch nahi hai laude 😭`
        ]
      : [
          `"${subject}" your dad left after seeing you bc 💀 Mummy was left alone with you, she regrets it too mc. Do you exist or are you a glitch chutiya? Nobody talks to you at home gaandu. You're that branch in family tree that should've been cut bhosdike 😭`,
          `"${subject}" you're the mistake your mummy made bc 💀 Papa went to get milk 15 years ago, never came back mc. Why would he? To see you chutiya? Mummy secretly wishes you didn't exist gaandu. L + Ratio + Fatherless bhosdike 😭`,
          `"${subject}" if you die tomorrow, 4 people at funeral bc 💀 That too to confirm you're actually gone mc. Mummy papa will be secretly relieved chutiya. "Ek bojh kam hua" that's what they'll think gaandu. You're worth less than insurance money laude 😭`
        ]
  };
  
  const tierRoasts = roasts[tier] || roasts.npc;
  return tierRoasts[Math.floor(Math.random() * tierRoasts.length)];
        }
