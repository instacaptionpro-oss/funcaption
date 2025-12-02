// pages/api/generate.js

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { subject, mood, region, more, feedback } = req.body || {};

  if (!subject || !mood) {
    return res.status(400).json({ error: 'Subject and mood required' });
  }

  const cleanSubject = String(subject).trim();
  const extraContext = (more || '').trim();

  // ---- MOODS ----
  const moods = [
    { id: "attitude", label: "Attitude", punch: "Iron heals what people break.", hashtags: "#Attitude #SilentGrind #Results #Boss #Unbothered #RealOnes" },
    { id: "motivation", label: "Motivation", punch: "The grind is lonely but legends are born here.", hashtags: "#Motivation #Grind #Legend #HustleHard #NeverGiveUp #SuccessMindset" },
    { id: "love", label: "Love", punch: "Some feelings rewrite the heart, silently.", hashtags: "#Love #DeepFeelings #HeartMatter #Romance #TrueLove #SoulConnection" },
    { id: "breakup", label: "Breakup", punch: "I lost them, but I found myself — and that's the win.", hashtags: "#Breakup #SelfGrowth #MovingOn #StrongerNow #HealingJourney #SelfLove" },
    { id: "gym", label: "Gym", punch: "Iron heals what people break.", hashtags: "#Gym #FitnessMotivation #IronTherapy #GymLife #WorkoutVibes #FitFam" },
    { id: "travel", label: "Travel", punch: "Some roads fix parts of you you never speak about.", hashtags: "#Travel #Wanderlust #RoadTherapy #ExploreMore #TravelDiaries #AdventureAwaits" },
    { id: "cute", label: "Cute", punch: "Soft heart, sharp mind — rare combination.", hashtags: "#Cute #SoftVibes #SmileMore #HappyPlace #CuteEnergy #PositiveVibes" },
    { id: "savage", label: "Savage", punch: "If I cared, you'd know. I don't.", hashtags: "#Savage #Unbothered #NoFilter #SavageMode #Confidence #BossEnergy" },
    { id: "aesthetic", label: "Aesthetic", punch: "Some things look better when you stop chasing.", hashtags: "#Aesthetic #AestheticVibes #Visual #CleanFeed #Minimalist #MoodBoard" },
    { id: "sad", label: "Sad", punch: "I smile… but rarely at the same things now.", hashtags: "#Sad #DeepThoughts #EmotionalPost #RealTalk #Healing #LifeLessons" },
    { id: "happy", label: "Happy", punch: "Little moments make big lives.", hashtags: "#Happy #GoodVibes #PositiveEnergy #Grateful #JoyfulMoments #Blessed" },
    { id: "alone", label: "Alone", punch: "Silence teaches louder than people.", hashtags: "#Alone #Solitude #InnerPeace #SelfReflection #QuietStrength #AloneNotLonely" },
    { id: "boss", label: "Boss", punch: "Money talks, but discipline screams.", hashtags: "#Boss #BossLife #Discipline #Success #Hustle #EntrepreneurMindset" },
    { id: "genz", label: "GenZ", punch: "Chaotic but still iconic.", hashtags: "#GenZ #MainCharacter #Iconic #Trending #VibeCheck #IYKYK" },
    { id: "calm", label: "Calm", punch: "Peace looks good on me.", hashtags: "#Calm #InnerPeace #Peaceful #Zen #MindfulLiving #Serenity" }
  ];

  // ---- REGIONS ----
  const regions = {
    genz: { label: "GenZ", variants: ["Main character energy 🔥", "This vibe? Pure GenZ ✨", "Not a trend — I'm the trendsetter 💫"] },
    professional: { label: "Professional", variants: ["Crafted with precision 🎯", "Professional excellence 💼", "Where expertise meets innovation 🚀"] },
    gujarati: { label: "Gujarati", variants: ["આ છે અમારા ગુજરાતી વાઇબ 🌟", "આ છે આપડી કાઠિયાવાડની મોજ 🔥", "ગુજરાતી લોહીમાં વાઇબ અલગ 💛"] },
    marathi: { label: "Marathi", variants: ["ही आहे आमची मराठी स्टाईल 🔥", "मराठी मना ची वेगळीच ओळख 💛", "आम्ही मराठी — vibes वेगळ्याच!"] },
    punjabi: { label: "Punjabi", variants: ["ਏ ਸਾਡੀ ਪੰਜਾਬੀ ਵਾਈਬ ਹੈ 🔥", "ਪੰਜਾਬੀਆਂ ਦੀ ਗੱਲ ਹੀ ਕੁਝ ਹੋਰ 💛", "ਵਾਈਬ ਤਾ ਸਾਡੀ ਹੀ ਚਲਦੀ ਹੈ!"] },
    hindi: { label: "Hindi / Desi", variants: ["ये है हमारी देसी शान 🔥", "देसी दिल, देसी वाइब 💛", "ये स्टाइल सिर्फ हम देसी करते हैं."] },
    rajasthani: { label: "Rajasthani", variants: ["राजस्थानी शान किसी डिग्री से कम नहीं।", "म्हारीधरती… म्हारी vibe.", "राजस्थानी लहू में ही रेगिस्तान का जिगर होता है।"] },
    bengali: { label: "Bengali", variants: ["এটাই আমাদের বাঙালি vibe 💛", "বাঙালির স্টাইল—ভাবনাতে, ভাষাতে, vibe-e.", "এখানে feeling-টা আলাদা, কারণ আমরা বাঙালি।"] },
    tamil: { label: "Tamil", variants: ["இது தான் நம்ம தமிழ் vibe 🔥", "தமிழர்களுக்கு swag-ம் culture-ம் இரண்டும் equal.", "தமிழன் blood-லே ஒரு mass feel இருக்கும்."] },
    telugu: { label: "Telugu", variants: ["ఇది మన తెలుగు vibe 🔥", "తెలుగు స్వాగ్ అంటే feeling కాదు, ఒక level.", "మన heartbeat కూడా rhythm తో ఉంటుంది—తెలుగు style."] },
    kannada: { label: "Kannada", variants: ["ಇದು ನಮ್ಮ ಕನ್ನಡ vibe 🔥", "ಕನ್ನಡಿಗ swag-ಗೆ logic ಇಲ್ಲ, magic ಇರುತ್ತೆ.", "ನಮ್ಮ style, ನಮ್ಮ vibe, ನಮ್ಮ Karnataka."] },
    malayalam: { label: "Malayalam", variants: ["ഇത് ആണ് നമ്മുടെ Malayali vibe 🔥", "Kerala-ക്ക് vibe വേറെ level-ല്‍ ആണ്.", "Malayali swag—calm look, sharp brain."] },
    bhojpuri: { label: "Bhojpuri", variants: ["ई बा हमरा भोजपुरिया अंदाज 🔥", "भोजपुरिया दिल… सिद्धा और साफ़।", "हमरा vibe देख के लोग कहेला — असली दम बा।"] },
    odia: { label: "Odia", variants: ["ଏହା ହେଉଛି ଆମର ଓଡିଆ vibe 💛", "Odia ସ୍ୱାଗ୍—ନିଜରେ ଅଲଗା।", "ଓଡିଆ ମନ… ଶାନ୍ତ, କିନ୍ତୁ ଶକ୍ତିଶାଳୀ।"] },
    assamese: { label: "Assamese", variants: ["এইটো হৈছে আমাৰ অসমীয়া vibe 🔥", "Assam-ৰ blood-ত নিজৰে rhythm থাকে।", "আমাৰ style—simple, pure, powerful।"] },
    kashmiri: { label: "Kashmiri", variants: ["Yi chu yimav Kashmiri vibe ❄️🔥", "Kashmiris carry peace… and hidden fire.", "Hami ti vibe chu asmaan sa tafreeh."] },
    nepali: { label: "Nepali", variants: ["यो हो हाम्रो नेपाली vibe 🔥", "Nepali heart—pure, strong, unforgettable.", "हम्रो vibe लाई copy गर्न सकिँदैन।"] }
  };

  const moodObj = moods.find(m => m.id === mood);
  if (!moodObj) {
    return res.status(400).json({ error: 'Invalid mood' });
  }

  const regionObj = region && region !== 'none' ? regions[region] : null;

  // ---------- FALLBACK CAPTION GENERATOR ----------
  const makeFallback = (styleIndex) => {
    let caption;
    if (styleIndex === 1) {
      caption = `${cleanSubject}.\n${moodObj.punch}`;
      if (regionObj) caption += `\n${regionObj.variants[0]}`;
    } else if (styleIndex === 2) {
      caption = `${cleanSubject} — the kind that stays with you.\n\n${moodObj.punch}`;
      if (regionObj) caption += `\n${regionObj.variants[1]}`;
    } else {
      caption = `${moodObj.punch}\n\nThat's what ${cleanSubject} taught me.`;
      if (regionObj) caption += `\n${regionObj.variants[2]}`;
    }
    caption += `\n\n${moodObj.hashtags}`;
    return caption;
  };

  const instagramMessage =
    "\n\nHelp please make us a favour follow us on Instagram and click below\nhttps://www.instagram.com/instaalgohacker?igsh=MW1maXl2a3IxNm40OA==";

  let premiumCaption = null;

  // ---------- HUGGINGFACE PREMIUM CAPTION ----------
  const hfToken = process.env.HF_TOKEN;
  const hfModel = process.env.HF_MODEL || 'meta-llama/Llama-3.2-3B-Instruct:novita';

  if (hfToken && hfModel) {
    try {
      const prompt = `
You are an expert Instagram caption writer for Indian creators.

Write ONE viral caption only.

Subject: ${cleanSubject}
Mood: ${moodObj.label}
Region: ${regionObj ? regionObj.label : 'Global / No region'}
Extra context about the reel: ${extraContext || 'No extra context given'}

Rules:
- Make it 2–3 lines max.
- Emotion + punch + style.
- If region is not "No region", blend a subtle local flavour in language or vibe.
- Include relevant modern hashtags at the end.
- Do NOT repeat the input text directly.
- Do NOT add explanations, just the caption text.
`;

      const hfResponse = await fetch('https://router.huggingface.co/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${hfToken}`
        },
        body: JSON.stringify({
          model: hfModel,
          messages: [
            { role: 'system', content: 'You write short, viral Instagram captions for Indian creators.' },
            { role: 'user', content: prompt.trim() }
          ],
          max_tokens: 180,
          temperature: 0.85
        })
      });

      if (!hfResponse.ok) {
        const errText = await hfResponse.text();
        console.error('HF non-ok', hfResponse.status, errText);
      } else {
        const data = await hfResponse.json();
        const text = data?.choices?.[0]?.message?.content || '';
        const cleaned = String(text).trim();
        if (cleaned.length > 10) {
          premiumCaption = cleaned;
        }
      }
    } catch (err) {
      console.error('HF Error:', err);
    }
  }

  // ---------- BUILD FINAL VARIANTS ----------
  const variants = [];

  // 1) Premium (if available) or fallback-1
  const basePremium = premiumCaption || makeFallback(1);
  variants.push({
    caption: basePremium + instagramMessage,
    regionLabel: regionObj?.label || null,
    isPremium: !!premiumCaption
  });

  // 2) Fallback style 1
  const fallback2 = makeFallback(2);
  variants.push({
    caption: fallback2 + instagramMessage,
    regionLabel: regionObj?.label || null,
    isPremium: false
  });

  // 3) Fallback style 2
  const fallback3 = makeFallback(3);
  variants.push({
    caption: fallback3 + instagramMessage,
    regionLabel: regionObj?.label || null,
    isPremium: false
  });

  return res.status(200).json({ variants });
}
