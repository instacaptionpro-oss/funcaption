// lib/fallback.js
const MOODS = [
  { id: "attitude", punch: "Iron heals what people break.", hashtags: "#Attitude #SilentGrind #Results" },
  { id: "motivation", punch: "The grind is lonely but legends are born here.", hashtags: "#Motivation #Grind #Hustle" },
  { id: "love", punch: "Some feelings rewrite the heart, silently.", hashtags: "#Love #DeepFeelings" },
  { id: "breakup", punch: "I lost them, but I found myself — and that's the win.", hashtags: "#Breakup #SelfGrowth" },
  { id: "gym", punch: "Iron heals what people break.", hashtags: "#Gym #FitnessMotivation" },
  { id: "travel", punch: "Some roads fix parts of you you never speak about.", hashtags: "#Travel #Wanderlust" },
  { id: "cute", punch: "Soft heart, sharp mind — rare combination.", hashtags: "#Cute #SoftVibes" },
  { id: "savage", punch: "If I cared, you'd know. I don't.", hashtags: "#Savage #Unbothered" },
  { id: "aesthetic", punch: "Some things look better when you stop chasing.", hashtags: "#Aesthetic #Mood" },
  { id: "sad", punch: "I smile… but rarely at the same things now.", hashtags: "#Sad #RealTalk" },
  { id: "happy", punch: "Little moments make big lives.", hashtags: "#Happy #Grateful" },
  { id: "alone", punch: "Silence teaches louder than people.", hashtags: "#Alone #InnerPeace" },
  { id: "boss", punch: "Money talks, but discipline screams.", hashtags: "#Boss #Discipline" },
  { id: "genz", punch: "Chaotic but still iconic.", hashtags: "#GenZ #MainCharacter" },
  { id: "calm", punch: "Peace looks good on me.", hashtags: "#Calm #Zen" }
];

const REGIONS = {
  gujarati: ["આ છે આપડી કાઠિયાવાડની મોજ 🔥", "આ છે અમારી ગુજરાતી vibe 💛", "ગુજરાતી લોહીમાં વાઇબ અલગ 🌟"],
  marathi: ["ही आहे आमची मराठी स्टाईल 🔥", "मराठी मनाची वेगळी ओळख 💛", "आम्ही मराठी — vibes वेगळ्याच!"],
  punjabi: ["ਏ ਸਾਡੀ ਪੰਜਾਬੀ ਵਾਈਬ ਹੈ 🔥", "ਪੰਜਾਬੀਆਂ ਦੀ ਗੱਲ ਹੀ ਕੁਝ ਹੋਰ 💛", "ਵਾਈਬ ਤਾਂ ਸਾਡੀ ਹੀ ਚਲਦੀ ਹੈ!"],
  hindi: ["ये है हमारी देसी शान 🔥", "देसी दिल, देसी वाइब 💛", "ये स्टाइल सिर्फ हम देसी करते हैं."],
  none: []
};

export function generateFallbackCaptions({ subject, moodId, region }) {
  const mood = MOODS.find(m => m.id === moodId) || MOODS[0];
  const regionArr = REGIONS[region] || [];
  const clean = (subject || '').trim();

  const cap1 = ${clean}.\n${mood.punch}${regionArr[0] ? '\n' + regionArr[0] : ''}\n\n${mood.hashtags};
  const cap2 = ${clean} — the kind that stays with you.\n\n${mood.punch}${regionArr[1] ? '\n' + regionArr[1] : ''}\n\n${mood.hashtags};

  return [
    { caption: cap1, regionLabel: regionArr[0] ? region : null },
    { caption: cap2, regionLabel: regionArr[1] ? region : null }
  ];
}
