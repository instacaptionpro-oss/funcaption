const config = {
  moods: [
    { id: "gym", label: "Gym", tagline: "Iron heals what people broke." },
    { id: "attitude", label: "Attitude", tagline: "I don't chase. I replace." },
    { id: "aesthetic", label: "Aesthetic", tagline: "Soft face, sharp mind." },
    { id: "love", label: "Love", tagline: "Some connections were written before we were." },
    { id: "heartbreak", label: "Heartbreak", tagline: "Broken doesn't mean finished." },
    { id: "hustle", label: "Hustle", tagline: "Slow progress is still loyalty to your dream." },
    { id: "luxury", label: "Luxury", tagline: "Soft life, loud ambition." },
    { id: "travel", label: "Travel", tagline: "Collect memories, not people." },
    { id: "lonely", label: "Lonely / Dark", tagline: "I disappear to rebuild." },
    { id: "friendship", label: "Friendship", tagline: "Chosen family hits different." },
    { id: "genz", label: "Gen-Z", tagline: "Main character energy loading…" },
    { id: "cute", label: "Cute / Soft", tagline: "Smiling like life finally got soft." },
    { id: "party", label: "Party", tagline: "Bad decisions make good stories." },
    { id: "photodump", label: "Photodump", tagline: "Proof I'm living, not posting." },
    { id: "selflove", label: "Self-Love", tagline: "Choosing myself wasn't selfish — it was survival." },
    { id: "savage", label: "Savage", tagline: "I don't argue, I upgrade." },
    { id: "sad", label: "Sad / Emotional", tagline: "Some chapters hurt but shape you." }
  ],
  regions: [
    {
      id: "gujarati",
      label: "Gujarati",
      suffixVariants: [
        "આ અમારું કાઠિયાવાડી સ્ટાઈલ છે.",
        "હવે ગમશે તો ગમશે — ગજરાતી ઢબ.",
        "શાંત દેખાયું, દિલ ગરમ છે."
      ]
    },
    {
      id: "punjabi",
      label: "Punjabi",
      suffixVariants: [
        "ਇਹ ਸਾਡੀ ਪੰਜਾਬੀ ਵਾਈਬ ਹੈ.",
        "Punjabi blood, global mood.",
        "Loud heart, warm home."
      ]
    },
    {
      id: "marathi",
      label: "Marathi",
      suffixVariants: [
        "हा आमचा मराठी स्टाइल आहे.",
        "Marathi heart — steady & strong.",
        "मज्जा करतो, परफेक्शन शोधतो."
      ]
    },
    {
      id: "bengali",
      label: "Bengali",
      suffixVariants: [
        "এটাই আমাদের বাংলা ভায়েব।",
        "Calm river, loud story.",
        "A little poetry, a lot of soul."
      ]
    },
    {
      id: "tamil",
      label: "Tamil",
      suffixVariants: [
        "இது எங்கள் தமிழ் வைபு.",
        "Roots deep, rhythm steady.",
        "Quiet strength — Tamil way."
      ]
    },
    {
      id: "telugu",
      label: "Telugu",
      suffixVariants: [
        "ఇది మా తెలుగు స్టైల్.",
        "Strong roots, bold moves.",
        "Homegrown fire, calm mind."
      ]
    },
    {
      id: "kannada",
      label: "Kannada",
      suffixVariants: [
        "ಇದು ನಮ್ಮ ಕನ್ನಡ ಸ್ಟೈಲ್.",
        "Simple heart, quiet pride.",
        "Roots first, trend later."
      ]
    },
    {
      id: "malayalam",
      label: "Malayalam",
      suffixVariants: [
        "ഇത് നമ്മുടേത് മലയാളി വൈബ്.",
        "Calm seas, loud memories.",
        "Soft voice, deep story."
      ]
    },
    {
      id: "rajasthani",
      label: "Rajasthani",
      suffixVariants: [
        "यो आपरो राजस्थानो स्टाइल है.",
        "Desert heat, proud heart.",
        "Old roots, new hustle."
      ]
    },
    {
      id: "bhojpuri",
      label: "Bhojpuri",
      suffixVariants: [
        "ई हमार भोजपुरी स्टाइल बा.",
        "Raw heart, loud laugh.",
        "Simple life, solid pride."
      ]
    },
    {
      id: "haryanvi",
      label: "Haryanvi",
      suffixVariants: [
        "इब्बै साड्डा हरियाणवी अंदाज है.",
        "Tough talk, softer heart.",
        "We keep it honest."
      ]
    },
    {
      id: "hyderabadi",
      label: "Hyderabadi",
      suffixVariants: [
        "Ye hamara Hyderabadi andaaz hai.",
        "Chill swag, spicy soul.",
        "Calm on outside — fire inside."
      ]
    },
    {
      id: "kashmiri",
      label: "Kashmiri",
      suffixVariants: [
        "Kashmiri warmth in a cool world.",
        "Quiet valleys, loud feelings.",
        "Soft snow, steady heart."
      ]
    },
    {
      id: "assamese",
      label: "Assamese / NE",
      suffixVariants: [
        "From the northeast — different, real.",
        "Fresh air, honest stories.",
        "Roots deep, horizon wide."
      ]
    },
    {
      id: "odia",
      label: "Odia",
      suffixVariants: [
        "ଏହା ଆମର ଓଡ଼ିଆ ଶୈଳୀ।",
        "Coastal calm, inner fire.",
        "Small town, big heart."
      ]
    },
    {
      id: "goan",
      label: "Goan",
      suffixVariants: [
        "Goan chill, salty soul.",
        "Beach-born, dream-forward.",
        "Sunset mindsets only."
      ]
    },
    {
      id: "up",
      label: "UP / North",
      suffixVariants: [
        "Desi roots — loud and proud.",
        "East meets grit — that's our vibe.",
        "Street stories, honest heart."
      ]
    },
    {
      id: "genz",
      label: "Gen-Z",
      suffixVariants: [
        "Main character energy — full episode.",
        "Vibe check: trending, not trying.",
        "Short clips, long feels."
      ]
    },
    {
      id: "global",
      label: "Global",
      suffixVariants: [
        "Made for the world, not the algorithm.",
        "Global mindset, local roots.",
        "Post wide — trend worldwide."
      ]
    }
  ]
}

const hooks = ["Read this", "Listen", "Slow down", "Stop scrolling", "Real talk", "Honest moment"]
const bridges = ["and I proved it", "and I'm just getting started", "because truth is simple", "no filters needed", "just reality", "the rest is noise"]

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { subject, mood, region } = req.body

  if (!subject || !mood) {
    return res.status(400).json({ error: 'Subject and mood required' })
  }

  const moodObj = config.moods.find(m => m.id === mood)
  const regionObj = region && region !== 'none' ? config.regions.find(r => r.id === region) : null

  if (!moodObj) {
    return res.status(400).json({ error: 'Invalid mood' })
  }

  const cleanSubject = subject.trim()
  const moodPunch = moodObj.tagline

  const variants = []

  // Template 1: Hook + Subject + Mood Punch
  const hook1 = hooks[Math.floor(Math.random() * hooks.length)]
  let caption1 = hook1 + ' — ' + cleanSubject + ' — ' + moodPunch + '.'
  if (regionObj) {
    caption1 += '\n\n' + regionObj.suffixVariants[0]
  }
  variants.push({ caption: caption1, regionLabel: regionObj?.label || null })

  // Template 2: Subject + Mood Punch + Bridge
  const bridge2 = bridges[Math.floor(Math.random() * bridges.length)]
  let caption2 = cleanSubject + ' — ' + moodPunch + ' ' + bridge2 + '.'
  if (regionObj) {
    caption2 += '\n\n' + regionObj.suffixVariants[1 % regionObj.suffixVariants.length]
  }
  variants.push({ caption: caption2, regionLabel: regionObj?.label || null })

  // Template 3: Short story + Subject + Mood Punch
  const story = 'When I started, ' + cleanSubject + ' was a dream'
  let caption3 = story + '. ' + moodPunch + '.'
  if (regionObj) {
    caption3 += '\n\n' + regionObj.suffixVariants[2 % regionObj.suffixVariants.length]
  }
  variants.push({ caption: caption3, regionLabel: regionObj?.label || null })

  return res.status(200).json({ variants })
}
