const moodMap = {
  "attitude": { 
    punch: "Iron heals what people break.", 
    hashtags: "#Attitude #SilentGrind #Results #Boss #Unbothered #RealOnes" 
  },
  "motivation": { 
    punch: "The grind is lonely but legends are born here.", 
    hashtags: "#Motivation #Grind #Legend #HustleHard #NeverGiveUp #SuccessMindset" 
  },
  "love": { 
    punch: "Some feelings rewrite the heart, silently.", 
    hashtags: "#Love #DeepFeelings #HeartMatter #Romance #TrueLove #SoulConnection" 
  },
  "breakup": { 
    punch: "I lost them, but I found myself — and that's the win.", 
    hashtags: "#Breakup #SelfGrowth #MovingOn #StrongerNow #HealingJourney #SelfLove" 
  },
  "gym": { 
    punch: "Iron heals what people break.", 
    hashtags: "#Gym #FitnessMotivation #IronTherapy #GymLife #WorkoutVibes #FitFam" 
  },
  "travel": { 
    punch: "Some roads fix parts of you you never speak about.", 
    hashtags: "#Travel #Wanderlust #RoadTherapy #ExploreMore #TravelDiaries #AdventureAwaits" 
  },
  "cute": { 
    punch: "Soft heart, sharp mind — rare combination.", 
    hashtags: "#Cute #SoftVibes #SmileMore #HappyPlace #CuteEnergy #PositiveVibes" 
  },
  "savage": { 
    punch: "If I cared, you'd know. I don't.", 
    hashtags: "#Savage #Unbothered #NoFilter #SavageMode #Confidence #BossEnergy" 
  },
  "aesthetic": { 
    punch: "Some things look better when you stop chasing.", 
    hashtags: "#Aesthetic #AestheticVibes #Visual #CleanFeed #Minimalist #MoodBoard" 
  },
  "sad": { 
    punch: "I smile… but rarely at the same things now.", 
    hashtags: "#Sad #DeepThoughts #EmotionalPost #RealTalk #Healing #LifeLessons" 
  },
  "happy": { 
    punch: "Little moments make big lives.", 
    hashtags: "#Happy #GoodVibes #PositiveEnergy #Grateful #JoyfulMoments #Blessed" 
  },
  "alone": { 
    punch: "Silence teaches louder than people.", 
    hashtags: "#Alone #Solitude #InnerPeace #SelfReflection #QuietStrength #AloneNotLonely" 
  },
  "boss": { 
    punch: "Money talks, but discipline screams.", 
    hashtags: "#Boss #BossLife #Discipline #Success #Hustle #EntrepreneurMindset" 
  },
  "genz": { 
    punch: "Chaotic but still iconic.", 
    hashtags: "#GenZ #MainCharacter #Iconic #Trending #VibeCheck #IYKYK" 
  },
  "calm": { 
    punch: "Peace looks good on me.", 
    hashtags: "#Calm #InnerPeace #Peaceful #Zen #MindfulLiving #Serenity" 
  }
};

const regionMap = {
  "genz": "Main character energy unlocked 🔥",
  "professional": "Crafted with precision and purpose 🎯",
  "gujarati": "આ છે અમારા ગુજરાતી વાઇબ 🌟",
  "marathi": "ही आहे आमची मराठी स्टाईल 🔥",
  "punjabi": "ਏ ਸਾਡੀ ਪੰਜਾਬੀ ਵਾਈਬ ਹੈ 🔥",
  "hindi": "ये है हमारी देसी शान 🔥",
  "rajasthani": "राजस्थानी शान किसी डिग्री से कम नहीं।",
  "bengali": "এটাই আমাদের বাঙালি vibe 💛",
  "tamil": "இது தான் நம்ம தமிழ் vibe 🔥",
  "telugu": "ఇది మన తెలుగు vibe 🔥",
  "kannada": "ಇದು ನಮ್ಮ ಕನ್ನಡ vibe 🔥",
  "malayalam": "ഇത് ആണ് നമ്മുടെ Malayali vibe 🔥",
  "bhojpuri": "ई बा हमरा भोजपुरिया अंदाज 🔥",
  "odia": "ଏହା ହେଉଛି ଆମର ଓଡିଆ vibe 💛",
  "assamese": "এইটো হৈছে আমাৰ অসমীয়া vibe 🔥",
  "kashmiri": "Yi chu yimav Kashmiri vibe ❄️🔥",
  "nepali": "यो हो हाम्रो नेपाली vibe 🔥"
};

function generateFallbackCaptions(subject, mood, region) {
  const moodObj = moodMap[mood] || moodMap["attitude"];
  const regionLine = region !== 'none' ? regionMap[region] || '' : '';
  
  // Caption 1: Punchy
  let cap1 = `${subject}.\n${moodObj.punch}`;
  if (regionLine) cap1 += `\n${regionLine}`;
  cap1 += `\n\n${moodObj.hashtags}`;
  
  // Caption 2: Story
  let cap2 = `${subject} — the kind that stays with you.\n\n${moodObj.punch}`;
  if (regionLine) cap2 += `\n${regionLine}`;
  cap2 += `\n\n${moodObj.hashtags}`;
  
  return [cap1, cap2];
}

module.exports = { moodMap, regionMap, generateFallbackCaptions };
