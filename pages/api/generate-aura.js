// /pages/api/generate-aura.js

import { OpenAI } from "openai";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { name, subject, mood, language } = req.body;

  if (!subject && !mood && !name) {
    return res.status(400).json({ error: "Provide at least name, subject, or mood" });
  }

  const hasName = name && name.trim().length > 0;
  const hasSubject = subject && subject.trim().length > 0;
  const hasMood = mood && mood.trim().length > 0;
  const roastLanguage = language || 'english';

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
    result = await generateRoastWithLlama(HF_TOKEN, name, subject, mood, tier, finalScore, roastLanguage, hasName, hasSubject, hasMood);
    
    if (result) {
      isPublicFigure = result.isPublicFigure || false;
      publicFigureStatus = result.publicFigureStatus || 'none';
    }

    if (!result || !result.roast || result.roast.length < 30) {
      result = {
        roast: getFallbackRoast(tier, subject || name || 'this', roastLanguage),
        subject_insight: roastLanguage === 'hindi' ? "Waah bhai waah..." : "Well well well...",
        isPublicFigure: false,
        publicFigureStatus: 'none'
      };
    }

  } catch (error) {
    console.log("Error:", error.message);
    result = {
      roast: getFallbackRoast(tier, subject || name || 'this', roastLanguage),
      subject_insight: roastLanguage === 'hindi' ? "Kya baat hai..." : "Interesting...",
      isPublicFigure: false,
      publicFigureStatus: 'none'
    };
  }

  const enforcedData = enforceRarityProbabilities(tier, finalScore, isPublicFigure, publicFigureStatus);
  tier = enforcedData.tier;
  finalScore = enforcedData.score;
  
  const { rarity, title, challenge } = getTierData(tier, roastLanguage);

  return res.status(200).json({
    aura: {
      score: finalScore,
      roast: result.roast.replace(/^["']|["']$/g, '').trim(),
      subjectInsight: result.subject_insight || (roastLanguage === 'hindi' ? "Kya baat hai..." : "Interesting..."),
      rarity,
      title,
      challenge,
      isPublicFigure,
      publicFigureStatus,
      language: roastLanguage,
      name: hasName ? name.trim() : null,
      subject: hasSubject ? subject.trim() : null,
      mood: hasMood ? mood.trim() : null
    }
  });
}

// ============================================
// LLAMA - PSYCHOLOGY-BASED SARCASTIC ROASTING
// ============================================
async function generateRoastWithLlama(token, name, subject, mood, tier, finalScore, language, hasName, hasSubject, hasMood) {
  const client = new OpenAI({
    baseURL: "https://router.huggingface.co/v1",
    apiKey: token,
  });

  const isHindi = language === 'hindi';

  const systemPrompt = `You are a MASTER ROAST COMEDIAN - not a "bad word generator".

## 🧠 PSYCHOLOGY OF A PERFECT ROAST:

### WHAT MAKES PEOPLE LAUGH:
1. **SURPRISE** - Setup expectation, then flip it
2. **SPECIFICITY** - Generic = boring, Specific = funny
3. **RELATABILITY** - They should think "damn that's true"
4. **EARNED PUNCHLINE** - Build up, then deliver

### WHAT MAKES A BAD ROAST:
❌ "Tu chutiya hai bc lmao 💀" - This is NOT a roast, it's lazy
❌ Random bad words thrown together
❌ Generic insults anyone could say
❌ No setup, no punchline, no wit

### WHAT MAKES A LEGENDARY ROAST:
✅ Observation + Exaggeration + Punchline
✅ Start nice, end savage (sarcasm)
✅ Bad words as SPICE, not the whole dish
✅ Makes them laugh AND cry inside

---

## 📏 PERFECT ROAST LENGTH (PSYCHOLOGY):

**35-55 words** = Sweet spot for engagement
- Under 25 words: Feels incomplete, unsatisfying
- Over 60 words: People stop reading
- 35-55 words: Perfect setup + punchline + breathing room

**STRUCTURE: 3 SENTENCES**
1. **HOOK** (Sarcastic compliment/observation) - 8-12 words
2. **TWIST** (The reality check) - 12-20 words  
3. **KILL SHOT** (Punchline with spicy language) - 10-18 words

---

${hasName ? `
## 🔍 CELEBRITY RESEARCH PROCESS FOR "${name.trim()}":

Before roasting, ANALYZE:
1. **PEAK MOMENT**: Their biggest achievement/viral moment
2. **SIGNATURE TRAIT**: What they're known for (look/catchphrase/style)
3. **IRONIC WEAKNESS**: The funny contradiction in their image
4. **CURRENT STATUS**: Still relevant or clinging to past glory?

### CELEBRITY DATABASE (Use this knowledge):

**INDIAN YOUTUBERS:**
- CarryMinati: YouTube vs TikTok (deleted by YouTube - ironic), cap, screaming style, "Toh kaise hai aap log"
- Triggered Insaan: Overreacting thumbnails, "family friendly" but cringe, lives in brother's shadow
- Ashish Chanchlani: Vines legend but repeats same jokes, loud = funny formula
- BB Ki Vines: Bhuvan Bam, multiple characters, first big Indian YouTuber, music career mid
- Elvish Yadav: Bigg Boss winner, controversy magnet, village boy image
- Fukra Insaan: Triggered Insaan's brother, gambling promotions controversy

**BOLLYWOOD:**
- SRK: DDLJ, arms open pose, romance king, recent comeback with Pathaan/Jawan
- Salman: Bhai persona, shirtless scenes, "virgin" claims, Being Human
- Aamir: Mr. Perfectionist, social issues, Laal Singh Chaddha flop
- Ranveer: Weird fashion, high energy, Deepika's husband jokes
- Akshay: Canadian citizenship jokes, 2-3 movies per year factory

**CRICKETERS:**
- Dhoni: Captain Cool, helicopter shot, "Thala for a reason" meme, slow batting
- Virat: Aggression, BC on field, chasing records, recent form dip
- Rohit: Vada Pav lover, lazy running, talent vs fitness jokes
- Hardik: Koffee with Karan disaster, attitude, playboy image reformed

**INTERNATIONAL:**
- Elon Musk: Twitter/X disaster, promises vs delivery, richest troll
- Mark Zuckerberg: Robot/lizard jokes, Meta flop, data stealing
- Trump: Orange tan, Twitter addiction, ego, "tremendous"
- Jake Paul: Boxing career, IQ jokes, brother's shadow
` : ''}

---

## 🎭 SARCASM MASTERCLASS:

### THE PATTERN:
"Oh wow [FAKE PRAISE]... [REALITY CHECK]... [SAVAGE CONCLUSION with bad word]"

### SARCASM INDICATORS:
- "Oh wow", "Amazing", "Incredible", "So proud" (said mockingly)
- 🙄 emoji = chef's kiss for sarcasm
- "I mean...", "Not gonna lie...", "Respect but..."

---

## 🌶️ BAD WORDS AS SEASONING:

### WRONG WAY:
"Tu chutiya hai bc mc gadha 💀" 
(Just insults, zero creativity, anyone can type this)

### RIGHT WAY:
"Bhai tu itna talented hai ki teri talent ko dhundne ke liye NASA ko bulana padega, aur wo bhi fail ho jayenge bc 🙄 Kya baat hai, invisible excellence. 💀"
(Setup → Build → Punchline → Bad word as cherry on top)

---

## 🎯 TIER-BASED ROASTING:

**LEGENDARY (Score 95-100):**
- Backhanded compliment style
- Acknowledge their greatness, then find the ONE flaw
- "You're amazing BUT..."
- Respectful destruction

**EPIC (Score 80-94):**
- Good but not untouchable
- Find irony in their success
- "Almost great, almost..."

**MID (Score 50-79):**
- They're average and need to hear it
- "Bhai tu exist karta hai but like... barely"
- Mediocrity is the roast itself

**NOOB (Score 25-49):**
- Their potential is a myth
- Use their failures against them
- "Remember when you tried? Yeah neither does anyone"

**NPC (Score 0-24):**
- Background character energy
- "Are you even real or just loading?"
- Full existential crisis mode

---

## 🗣️ LANGUAGE STYLE:

${isHindi ? `
### HINDI/HINGLISH ROAST STYLE:
- Mix Hindi + English naturally (how Indians actually talk)
- Sarcastic openers: "Waah bhai", "Kya baat hai", "Amazing yaar", "Bohot hard"
- Bad words as flow: bc, mc, chutiya, gadha, bewakoof, wahiyat, bkl
- End with: damn, bc, kya hi bolein, next level

### HINDI EXAMPLES (PERFECT LENGTH 35-55 words):

**CarryMinati:**
"Waah Carry bhai, YouTube vs TikTok itni legendary video thi ki YouTube ne khud delete kar di 🙄 Roaster itna powerful ki apni hi platform ne gand maar di. Irony ki dukan khol lo bc, business boom karega. 💀"

**Dhoni:**
"Mahi bhai helicopter shot legendary hai, koi doubt nahi. But bhai end overs mein itna slow khelta hai ki helicopter land hoke, passengers utar ke, chai pi ke wapas nikal jaaye 🙄 Captain Cool? Captain Buffering bc. 💀"

**Average Person:**
"Bhai tujhe dekh ke lagta hai ki god ne jab talent distribute kiya tha, tu line mein WiFi dhundh raha tha 🙄 Ab bhi buffer ho raha hai, connection kabhi laga nahi bc. Tragic yaar. 💀"
` : `
### ENGLISH ROAST STYLE:
- Simple English that everyone understands
- Sarcastic openers: "Oh wow", "Amazing", "Incredible", "So talented"
- Bad words as flow: fuck, shit, damn, ass, bitch, pathetic, trash, dumbass
- End with: damn, shit, what a time to be alive, tragic

### ENGLISH EXAMPLES (PERFECT LENGTH 35-55 words):

**CarryMinati:**
"Oh wow Carry made YouTube vs TikTok so legendary that YouTube itself deleted it 🙄 The roaster was so powerful his own platform said 'nah fuck that'. Peak irony, should open an irony museum, would be packed damn. 💀"

**Elon Musk:**
"Incredible how Elon bought Twitter to save free speech and turned it into a dumpster fire 🙄 Rockets to Mars but can't figure out a social media app. World's richest man with the impulse control of a toddler, damn pathetic. 💀"

**Average Person:**
"Bro when God was distributing talent, you were probably looking for WiFi 🙄 Still buffering apparently, connection never established. At least loading screens have a purpose, you're just stuck on 0% forever, shit's tragic. 💀"
`}

---

## 📝 OUTPUT FORMAT:

Return ONLY valid JSON:
{
  "roast": "35-55 word sarcastic roast following the 3-sentence structure",
  "subject_insight": "Short sarcastic one-liner observation",
  "isPublicFigure": true/false,
  "publicFigureStatus": "peak/stable/falling/none"
}

## ⚠️ FINAL REMINDERS:
1. 35-55 words - NOT negotiable
2. 3 sentences - Hook, Twist, Kill Shot
3. SARCASM - Start fake nice, end savage
4. SPECIFIC - Use real facts about the person
5. BAD WORDS - 1-2 max, placed at punchline
6. NO - Legal issues, family attacks, death wishes
7. EMOJIS - Use 🙄 for sarcasm, 💀 or 🔥 for ending

CURRENT TIER: ${tier.toUpperCase()} | SCORE: ${finalScore}/100`;

  const userContent = `${hasName ? `Name: ${name.trim()}` : ''} ${hasSubject ? `Subject: ${subject.trim()}` : ''} ${hasMood ? `Mood: ${mood}` : ''} 

TIER: ${tier.toUpperCase()} | Language: ${isHindi ? 'HINDI/HINGLISH' : 'ENGLISH'}

${hasName ? `
🔍 RESEARCH TASK: Who is "${name.trim()}"? 
- What are they famous for?
- What's their signature thing?
- What's ironic/funny about them?

Then craft a SPECIFIC roast using that knowledge.
` : `
Create a creative roast about the subject/mood provided.
`}

📏 REMEMBER: 
- 35-55 words (3 sentences)
- Sarcastic setup → Reality check → Savage punchline
- Bad words as SEASONING only
- Be CLEVER, not just vulgar

${isHindi ? '🗣️ Language: Hindi/Hinglish with natural bad words (bc, chutiya, etc.)' : '🗣️ Language: English with natural bad words (fuck, damn, shit, etc.)'}

GO! 🎯`;

  const completion = await client.chat.completions.create({
    model: "meta-llama/Meta-Llama-3-70B-Instruct",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userContent }
    ],
    temperature: 0.9,
    max_tokens: 300,
    top_p: 0.95,
  });

  const content = completion.choices[0]?.message?.content;
  if (!content) return null;

  try {
    const jsonMatch = content.match(/\{[\s\S]*?\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      // Validate roast length
      const wordCount = parsed.roast?.split(/\s+/).length || 0;
      if (wordCount < 20 || wordCount > 70) {
        // If out of range, try to fix or use fallback
        console.log(`Roast word count: ${wordCount}, adjusting...`);
      }
      return parsed;
    }
    return { 
      roast: content.trim(), 
      subject_insight: isHindi ? "Waah bc..." : "Damn...", 
      isPublicFigure: hasName, 
      publicFigureStatus: 'stable' 
    };
  } catch {
    return { 
      roast: content.trim(), 
      subject_insight: isHindi ? "Kya baat hai..." : "Interesting...", 
      isPublicFigure: hasName, 
      publicFigureStatus: 'stable' 
    };
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

function getTierData(tier, language) {
  const isHindi = language === 'hindi';
  
  const data = {
    legendary: { 
      rarity: "legendary", 
      title: "LEGENDARY", 
      challenge: isHindi ? "GOATED HAI TU BC 👑" : "YOU'RE GOATED DAMN 👑"
    },
    epic: { 
      rarity: "epic", 
      title: "EPIC", 
      challenge: isHindi ? "ALMOST LEGEND BHAI ⚡" : "ALMOST LEGENDARY SHIT ⚡"
    },
    mid: { 
      rarity: "mid", 
      title: "MID", 
      challenge: isHindi ? "AVERAGE HAI BC 🔥" : "AVERAGE AS FUCK 🔥"
    },
    noob: { 
      rarity: "noob", 
      title: "NOOB", 
      challenge: isHindi ? "POTENTIAL GAYAB 💀" : "POTENTIAL NOT FOUND 💀"
    },
    npc: { 
      rarity: "npc", 
      title: "NPC", 
      challenge: isHindi ? "EXIST KARTA HAI BC? 😭" : "DO YOU EVEN EXIST? 😭"
    }
  };
  return data[tier] || data.npc;
}

function getFallbackRoast(tier, subject, language) {
  const isHindi = language === 'hindi';
  
  const roasts = {
    legendary: isHindi 
      ? `Bhai "${subject}" ko dekh ke lagta hai ki kuch log sach mein blessed hote hain 🙄 Itna talent ki gaali dene ka mann nahi karta. Respect hai bc, kya hi bolein. 👑`
      : `Looking at "${subject}" you realize some people are genuinely blessed 🙄 So talented that insults feel wrong. Respect where it's due, damn impressive shit. 👑`,
    epic: isHindi
      ? `"${subject}" almost legendary territory mein hai bhai 🙄 Bas thoda sa aur push karo, abhi sirf 'great' pe atke ho. Almost wala tag hatao bc, full send karo. ⚡`
      : `"${subject}" is almost in legendary territory 🙄 Just push a little more, stuck at 'great' right now. Remove that 'almost' tag damn, go full send shit. ⚡`,
    mid: isHindi
      ? `Bhai "${subject}" ko dekh ke lagta hai ki mediocrity bhi ek talent hai 🙄 Na itna bura ki ignore karo, na itna acha ki yaad rakho. Perfectly forgettable bc, next level average. 🔥`
      : `Looking at "${subject}" makes you realize mediocrity is also a talent 🙄 Not bad enough to ignore, not good enough to remember. Perfectly forgettable damn, next level average shit. 🔥`,
    noob: isHindi
      ? `"${subject}" ka potential abhi bhi loading screen pe hai 🙄 Shuru mein umeed thi, ab realize hua ki buffering permanent hai. Connection establish hi nahi hua bc, tragic. 💀`
      : `"${subject}" potential is still on loading screen 🙄 Had hopes initially, now realized buffering is permanent. Connection was never established damn, tragic shit. 💀`,
    npc: isHindi
      ? `"${subject}" exist bhi karta hai ya bas background mein render ho raha hai 🙄 Main characters ki story mein tum wo blur face ho jo koi notice nahi karta bc. Skip button embodied, damn. 😭`
      : `Does "${subject}" even exist or just rendering in the background 🙄 In main characters' stories you're that blur face nobody notices damn. Skip button personified, tragic shit. 😭`
  };
  return roasts[tier] || roasts.npc;
}
