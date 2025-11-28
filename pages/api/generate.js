export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { subject, mood, region } = req.body

  if (!subject || !mood) {
    return res.status(400).json({ error: 'Subject and mood required' })
  }

  try {
    // FIXED PROMPT (NO NESTED BACKTICKS)
    const prompt = `
Create 3 creative Instagram captions.

- Subject: ${subject}
- Mood: ${mood}
- Region: ${region}
- Each caption must be 2–3 lines.
- Add strong emotional depth.
- Add relevant hashtags.
- Avoid repeating the subject literally.
- Make captions feel psychological & viral-worthy.
`;

    const response = await fetch('https://api-inference.huggingface.co/models/gpt2', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        inputs: prompt,
        parameters: {
          max_new_tokens: 200,
          temperature: 0.9
        }
      })
    })

    if (response.ok) {
      const data = await response.json()
      const raw = data[0]?.generated_text || ""

      const aiCaptions = raw
        .split("\n")
        .filter(x => x.trim().length > 8)
        .slice(0, 3)
        .map(c => ({
          caption: ${c}\n\nHelp please make us a favour follow us on Instagram\nhttps://www.instagram.com/instaalgohacker
        }))

      if (aiCaptions.length > 0) {
        return res.status(200).json({ variants: aiCaptions })
      }
    }
  } catch (e) {
    console.log("AI failed → using fallback")
  }

  // ---- FALLBACK SYSTEM ----
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
  ]

  const regions = {
    gujarati: ["આ છે અમારા ગુજરાતી વાઇબ 🌟","આ છે આપડી કાઠિયાવાડની મોજ 🔥","ગુજરાતી લોહીમાં વાઇબ અલગ 💛"],
    hindi: ["ये है हमारी देसी शान 🔥","देसी दिल, देसी वाइब 💛","ये स्टाइल सिर्फ हम देसी करते हैं."],
    punjabi: ["ਏ ਸਾਡੀ ਪੰਜਾਬੀ ਵਾਈਬ ਹੈ 🔥","ਪੰਜਾਬੀਆਂ ਦੀ ਗੱਲ ਹੀ ਕੁਝ ਹੋਰ 💛","ਵਾਈਬ ਤਾ ਸਾਡੀ ਹੀ ਚਲਦੀ ਹੈ!"],
    marathi: ["ही आहे आमची मराठी स्टाईल 🔥","मराठी मना ची वेगळीच ओळख 💛","आम्ही मराठी — vibes वेगळ्याच!"],
    tamil: ["இது தான் நம்ம தமிழ் vibe 🔥","தமிழர்களுக்கு swag-ம் culture-ம் இரண்டும் equal.","தமிழன் blood-லே ஒரு mass feel இருக்கும்."],
    telugu: ["ఇది మన తెలుగు vibe 🔥","తెలుగు స్వాగ్ అంటే feeling కాదు, ఒక level.","మన heartbeat కూడా rhythm తో ఉంటుంది—తెలుగు style."],
    bengali: ["এটাই আমাদের বাঙালি vibe 💛","বাঙালির স্টাইল—ভাবনাতে, ভাষাতে, vibe-e.","এখানে feeling-টা আলাদা."],
    rajasthani: ["राजस्थानी शान किसी डिग्री से कम नहीं।","म्हारी धरती… म्हारी vibe.","राजस्थानी लहू में ही रेगिस्तान का जिगर."],
    nepali: ["यो हो हाम्रो नेपाली vibe 🔥","Nepali heart—pure and strong.","हम्रो vibe copy गर्न सकिँदैन।"]
  }

  const moodObj = moods.find(m => m.id === mood)
  const regionLines = regions[region] || []

  const final = [0, 1, 2].map(i => {
    return {
      caption:
        ${subject}\n${moodObj.punch} +
        (regionLines[i] ? \n${regionLines[i]} : "") +
        \n\n${moodObj.hashtags}\n\nHelp please make us a favour follow us on Instagram\nhttps://www.instagram.com/instaalgohacker
    }
  })

  return res.status(200).json({ variants: final })
}
