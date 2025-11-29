export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { subject, mood, region } = req.body;

  if (!subject || !mood) {
    return res.status(400).json({ error: 'Subject and mood required' });
  }

  // Mood and region data
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

  const regions = {
    genz: { label: "GenZ", variants: ["Main character energy 🔥", "This vibe? Pure GenZ ✨", "Not a trend — I'm the trendsetter 💫"] },
    professional: { label: "Professional", variants: ["Crafted with precision 🎯", "Professional excellence 💼", "Where expertise meets innovation 🚀"] },
    gujarati: { label: "Gujarati", variants: ["આ છે અમારા ગુજરાતી વાઇબ 🌟", "આ છે આપડી કાઠિયાવાડની મોજ 🔥", "ગુજરાતી લોહીમાં વાઇબ અલગ 💛"] },
    marathi: { label: "Marathi", variants: ["ही आहे आमची मराठी स्टाईल 🔥", "मराठी मना ची वेगळीच ओळख 💛", "आम्ही मराठी — vibes वेगळ्याच!"] },
    punjabi: { label: "Punjabi", variants: ["ਏ ਸਾਡੀ ਪੰਜਾਬੀ ਵਾਈਬ ਹੈ 🔥", "ਪੰਜਾਬੀਆਂ ਦੀ ਗੱਲ ਹੀ ਕੁਝ ਹੋਰ 💛", "ਵਾਈਬ ਤਾ ਸਾਡੀ ਹੀ ਚਲਦੀ ਹੈ!"] },
    hindi: { label: "Hindi / Desi", variants: ["ये है हमारी देसी शान 🔥", "देसी दिल, देसी वाइब 💛", "ये स्टाइल सिर्फ हम देसी करते हैं."] },
    rajasthani: { label: "Rajasthani", variants: ["राजस्थानी शान किसी डिग्री से कम नहीं।", "म्हारी धरती… म्हारी vibe.", "राजस्थानी लहू में ही रेगिस्तान का जिगर होता है।"] },
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
  const cleanSubject = subject.trim();

  // Generate fallback captions
  const generateFallbackCaption = (style) => {
    let caption = '';
    if (style === 1) {
      caption = `${cleanSubject}.\n${moodObj.punch}`;
      if (regionObj) {
        caption += `\n${regionObj.variants[0]}`;
      }
    } else {
      caption =`${cleanSubject} hits differently.\n${moodObj.punch}`;
      if (regionObj) {
        caption += `\n${regionObj.variants[1]}`;
      }
    }
    caption += `\n\n${moodObj.hashtags}`;
    return caption;
  };

  const fallbackCaption1 = generateFallbackCaption(1);
  const fallbackCaption2 = generateFallbackCaption(2);

  // Try HuggingFace API for premium caption
  let premiumCaption = null;
  if (process.env.HUGGINGFACE_API_KEY && process.env.HUGGINGFACE_MODEL) {
    try {
      const prompt = `Generate 1 Instagram caption for:
Subject: ${cleanSubject}
Mood: ${mood}
Region: ${region || 'none'}

Caption should be:
* 2-3 lines
* Deep, emotional, stylish
* Include relevant hashtags
* Do NOT repeat the user inputs

(Return ONLY 1 caption from HuggingFace.)`;

      const response = await fetch(`https://api-inference.huggingface.co/models/${process.env.HUGGINGFACE_MODEL}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.HUGGINGFACE_API_KEY}`
        },
        body: JSON.stringify({
          inputs: prompt,
          parameters: {
            max_new_tokens: 160,
            temperature: 0.7
          }
        })
      });

      if (response.ok) {
        const data = await response.json();
        const hfCaption = data[0]?.generated_text || '';
        if (hfCaption && hfCaption.length > 10) {
          premiumCaption = hfCaption;
        }
      }
    } catch (error) {
      console.error('HuggingFace API error:', error);
    }
  }

  // Prepare final captions
  const instagramMessage = "\n\nFollow us on Instagram\nhttps://www.instagram.com/instaalgohacker";
  
  const variants = [
    { 
      caption: (premiumCaption || fallbackCaption1) + instagramMessage,
      regionLabel: regionObj?.label || null
    },
    { 
      caption: fallbackCaption1 + instagramMessage,
      regionLabel: regionObj?.label || null
    },
    { 
      caption: fallbackCaption2 + instagramMessage,
      regionLabel: regionObj?.label || null
    }
  ];

  return res.status(200).json({ variants });
}
