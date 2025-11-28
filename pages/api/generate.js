export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { subject, mood, region } = req.body;

  if (!subject || !mood) {
    return res.status(400).json({ error: 'Subject and mood required' });
  }

  const cleanSubject = subject.trim();

  // -----------------------
  // Mood Data
  // -----------------------
  const moods = [
    { id: "attitude", punch: "Iron heals what people break.", hashtags: "#Attitude #SilentGrind #Results #Boss #Unbothered #RealOnes" },
    { id: "motivation", punch: "The grind is lonely but legends are born here.", hashtags: "#Motivation #Grind #Legend #HustleHard #NeverGiveUp #SuccessMindset" },
    { id: "love", punch: "Some feelings rewrite the heart, silently.", hashtags: "#Love #DeepFeelings #HeartMatter #Romance #TrueLove #SoulConnection" },
    { id: "breakup", punch: "I lost them, but I found myself — and that's the win.", hashtags: "#Breakup #SelfGrowth #MovingOn #StrongerNow #HealingJourney #SelfLove" },
    { id: "gym", punch: "Iron heals what people break.", hashtags: "#Gym #FitnessMotivation #IronTherapy #GymLife #WorkoutVibes #FitFam" },
    { id: "travel", punch: "Some roads fix parts of you you never speak about.", hashtags: "#Travel #Wanderlust #RoadTherapy #ExploreMore #TravelDiaries #AdventureAwaits" },
    { id: "cute", punch: "Soft heart, sharp mind — rare combination.", hashtags: "#Cute #SoftVibes #SmileMore #HappyPlace #CuteEnergy #PositiveVibes" },
    { id: "savage", punch: "If I cared, you'd know. I don't.", hashtags: "#Savage #Unbothered #NoFilter #SavageMode #Confidence #BossEnergy" },
    { id: "aesthetic", punch: "Some things look better when you stop chasing.", hashtags: "#Aesthetic #AestheticVibes #Visual #CleanFeed #Minimalist #MoodBoard" },
    { id: "sad", punch: "I smile… but rarely at the same things now.", hashtags: "#Sad #DeepThoughts #EmotionalPost #RealTalk #Healing #LifeLessons" },
    { id: "happy", punch: "Little moments make big lives.", hashtags: "#Happy #GoodVibes #PositiveEnergy #Grateful #JoyfulMoments #Blessed" },
    { id: "alone", punch: "Silence teaches louder than people.", hashtags: "#Alone #Solitude #InnerPeace #SelfReflection #QuietStrength #AloneNotLonely" },
    { id: "boss", punch: "Money talks, but discipline screams.", hashtags: "#Boss #BossLife #Discipline #Success #Hustle #EntrepreneurMindset" },
    { id: "genz", punch: "Chaotic but still iconic.", hashtags: "#GenZ #MainCharacter #Iconic #Trending #VibeCheck #IYKYK" },
    { id: "calm", punch: "Peace looks good on me.", hashtags: "#Calm #InnerPeace #Peaceful #Zen #MindfulLiving #Serenity" }
  ];

  const moodObj = moods.find(m => m.id === mood);
  if (!moodObj) return res.status(400).json({ error: 'Invalid mood' });

  // -----------------------
  // Regional Lines
  // -----------------------
  const regions = {
    gujarati: ["આ છે અમારા ગુજરાતી વાઇબ 🌟", "આ છે આપડી કાઠિયાવાડની મોજ 🔥", "ગુજરાતી લોહીમાં વાઇબ અલગ 💛"],
    marathi: ["ही आहे आमची मराठी स्टाईल 🔥", "मराठी मना ची वेगळीच ओळख 💛", "आम्ही मराठी — vibes वेगळ्याच!"],
    punjabi: ["ਏ ਸਾਡੀ ਪੰਜਾਬੀ ਵਾਈਬ ਹੈ 🔥", "ਪੰਜਾਬੀਆਂ ਦੀ ਗੱਲ ਹੀ ਕੁਝ ਹੋਰ 💛", "ਵਾਈਬ ਤਾ ਸਾਡੀ ਹੀ ਚਲਦੀ ਹੈ!"],
    hindi: ["ये है हमारी देसी शान 🔥", "देसी दिल, देसी वाइब 💛", "ये स्टाइल सिर्फ हम देसी करते हैं."],
    rajasthani: ["राजस्थानी शान किसी डिग्री سے کم نہیں।", "म्हारी धरती… म्हारी vibe.", "राजस्थानी लहू में ही fire होता है।"],
    bengali: ["এটাই আমাদের বাঙালি vibe 💛", "বাঙালির স্টাইল—vibe আলাদা.", "Feeling আলাদা কারণ আমরা বাঙালি।"],
    tamil: ["இது தான் நம்ம தமிழ் vibe 🔥", "தமிழர்களுக்கு swag-ம் culture-ம் equal.", "தமிழன் blood-லே mass feel இருக்கும்."],
    telugu: ["ఇది మన తెలుగు vibe 🔥", "తెలుగు swag అంటే level.", "మన heartbeat కూడా rhythm తో ఉంటుంది."],
    kannada: ["ಇದು ನಮ್ಮ ಕನ್ನಡ vibe 🔥", "ಕನ್ನಡಿಗ swag-ಗೆ logic ಇಲ್ಲ.", "ನಮ್ಮ Karnataka—vibe different."],
    malayalam: ["ഇത് ആണ് Malayali vibe 🔥", "കേരള vibe വേറെ level.", "Malayali swag—calm look, sharp mind."],
    bhojpuri: ["ई बा भोजपुरिया अंदाज 🔥", "भोजपुरिया दिल—साफ़ और सीधा.", "हमरा vibe—दमदार।"],
    odia: ["ଏହା ହେଉଛି ଓଡିଆ vibe 💛", "Odia swag—ଅଲଗା.", "ଓଡିଆ heart—calm but strong."],
    assamese: ["এইটো অসমৰ vibe 🔥", "Assamese blood-ত rhythm থাকে.", "Simple. Pure. Powerful."],
    kashmiri: ["Yi chu Kashmiri vibe ❄️🔥", "Kashmiris carry peace + fire.", "Our vibe is sky-deep."],
    nepali: ["यो हो नेपाली vibe 🔥", "Nepali heart—strong.", "Vibe cannot be copied."]
  };

  const regionLines = region !== 'none' ? regions[region] : null;

  // -----------------------
  // Create Creative Captions
  // -----------------------
  const captions = [];

  // CAPTION 1
  let c1 = ${cleanSubject}.\n${moodObj.punch};
  if (regionLines) c1 += \n${regionLines[0]};
  c1 += \n\n${moodObj.hashtags};
  captions.push({ caption: c1, regionLabel: region });

  // CAPTION 2 — Story
  let c2 = ${cleanSubject} — the kind that stays.\n${moodObj.punch};
  if (regionLines) c2 += \n${regionLines[1]};
  c2 += \n\n${moodObj.hashtags};
  captions.push({ caption: c2, regionLabel: region });

  // CAPTION 3 — Reflective
  let c3 = ${moodObj.punch}\nThat’s what ${cleanSubject} taught me.;
  if (regionLines) c3 += \n${regionLines[2]};
  c3 += \n\n${moodObj.hashtags};
  captions.push({ caption: c3, regionLabel: region });

  // Add Instagram follow line
  const instagramLink =
    "\n\nHelp please make us a favour follow us on Instagram\nhttps://www.instagram.com/instaalgohacker";

  const finalCaptions = captions.map(c => ({
    ...c,
    caption: c.caption + instagramLink
  }));

  return res.status(200).json({ variants: finalCaptions });
}
