export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { subject, mood, regionalVibe } = req.body

    if (!subject || !mood) {
      return res.status(400).json({ error: 'Subject and mood are required' })
    }

    const captions = generateCaptions(subject, mood, regionalVibe)

    return res.status(200).json({ captions })
  } catch (error) {
    console.error('Generate API Error:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}

function generateCaptions(subject, mood, regionalVibe) {
  if (regionalVibe && regionalVibe !== 'None') {
    return getRegionalCaptions(subject, mood, regionalVibe)
  }
  return getBasicCaptions(subject, mood)
}

function getRegionalCaptions(subject, mood, vibe) {
  const prideLine = getPrideLine(vibe)
  const potentialLine = getPotentialLine(vibe)
  const emoji = getMoodEmoji(mood)

  const templates = {
    'Gujarati': [
      {
        caption: ${subject} ${emoji}\n\nઆજે ${subject} નો આનંદ માણ્યો!\n\n${prideLine.text}\n\n${potentialLine.text},
        translation: Enjoyed ${subject} today!\n\n${prideLine.english}\n\n${potentialLine.english}
      },
      {
        caption: જ્યારે પણ ${subject}, મજા આવે જ છે! ${emoji}\n\n${prideLine.text}\n\n${potentialLine.text},
        translation: Whenever ${subject}, it's always fun!\n\n${prideLine.english}\n\n${potentialLine.english}
      },
      {
        caption: ${subject} સાથે પળ ${emoji}\n\n${prideLine.text}\n\n${potentialLine.text},
        translation: Moment with ${subject}\n\n${prideLine.english}\n\n${potentialLine.english}
      }
    ],
    'Punjabi': [
      {
        caption: ${subject} ${emoji}\n\n${subject} de naal din ban gaya!\n\n${prideLine.text}\n\n${potentialLine.text},
        translation: Day became great with ${subject}!\n\n${prideLine.english}\n\n${potentialLine.english}
      },
      {
        caption: Vadiya ${subject}! ${emoji}\n\n${prideLine.text}\n\n${potentialLine.text},
        translation: Great ${subject}!\n\n${prideLine.english}\n\n${potentialLine.english}
      },
      {
        caption: ${subject} ${emoji}\n\nOye hoye!\n\n${prideLine.text}\n\n${potentialLine.text},
        translation: ${prideLine.english}\n\n${potentialLine.english}
      }
    ],
    'Marathi': [
      {
        caption: ${subject} ${emoji}\n\n${subject} खूप छान!\n\n${prideLine.text}\n\n${potentialLine.text},
        translation: ${subject} very good!\n\n${prideLine.english}\n\n${potentialLine.english}
      },
      {
        caption: आज ${subject} मस्त होता! ${emoji}\n\n${prideLine.text}\n\n${potentialLine.text},
        translation: Today ${subject} was great!\n\n${prideLine.english}\n\n${potentialLine.english}
      },
      {
        caption: ${subject} ${emoji}\n\n${prideLine.text}\n\n${potentialLine.text},
        translation: ${prideLine.english}\n\n${potentialLine.english}
      }
    ],
    'Bengali': [
      {
        caption: ${subject} ${emoji}\n\n${subject} দেখে মন ভরে গেলো!\n\n${prideLine.text}\n\n${potentialLine.text},
        translation: Heart filled seeing ${subject}!\n\n${prideLine.english}\n\n${potentialLine.english}
      },
      {
        caption: আজ ${subject} খুব ভালো! ${emoji}\n\n${prideLine.text}\n\n${potentialLine.text},
        translation: Today ${subject} very good!\n\n${prideLine.english}\n\n${potentialLine.english}
      },
      {
        caption: ${subject} ${emoji}\n\n${prideLine.text}\n\n${potentialLine.text},
        translation: ${prideLine.english}\n\n${potentialLine.english}
      }
    ],
    'Tamil': [
      {
        caption: ${subject} ${emoji}\n\n${subject} ரொம்ப நல்லா இருக்கு!\n\n${prideLine.text}\n\n${potentialLine.text},
        translation: ${subject} very good!\n\n${prideLine.english}\n\n${potentialLine.english}
      },
      {
        caption: இன்னிக்கு ${subject} அருமை! ${emoji}\n\n${prideLine.text}\n\n${potentialLine.text},
        translation: Today ${subject} great!\n\n${prideLine.english}\n\n${potentialLine.english}
      },
      {
        caption: ${subject} ${emoji}\n\n${prideLine.text}\n\n${potentialLine.text},
        translation: ${prideLine.english}\n\n${potentialLine.english}
      }
    ],
    'Telugu': [
      {
        caption: ${subject} ${emoji}\n\n${subject} చాలా బాగుంది!\n\n${prideLine.text}\n\n${potentialLine.text},
        translation: ${subject} very good!\n\n${prideLine.english}\n\n${potentialLine.english}
      },
      {
        caption: ఈరోజు ${subject} బాగుంది! ${emoji}\n\n${prideLine.text}\n\n${potentialLine.text},
        translation: Today ${subject} good!\n\n${prideLine.english}\n\n${potentialLine.english}
      },
      {
        caption: ${subject} ${emoji}\n\n${prideLine.text}\n\n${potentialLine.text},
        translation: ${prideLine.english}\n\n${potentialLine.english}
      }
    ],
    'Malayalam': [
      {
        caption: ${subject} ${emoji}\n\n${subject} സൂപ്പർ!\n\n${prideLine.text}\n\n${potentialLine.text},
        translation: ${subject} super!\n\n${prideLine.english}\n\n${potentialLine.english}
      },
      {
        caption: ഇന്ന് ${subject} നല്ലത്! ${emoji}\n\n${prideLine.text}\n\n${potentialLine.text},
        translation: Today ${subject} good!\n\n${prideLine.english}\n\n${potentialLine.english}
      },
      {
        caption: ${subject} ${emoji}\n\n${prideLine.text}\n\n${potentialLine.text},
        translation: ${prideLine.english}\n\n${potentialLine.english}
      }
    ],
    'Kannada': [
      {
        caption: ${subject} ${emoji}\n\n${subject} ಚೆನ್ನಾಗಿದೆ!\n\n${prideLine.text}\n\n${potentialLine.text},
        translation: ${subject} good!\n\n${prideLine.english}\n\n${potentialLine.english}
      },
      {
        caption: ಇವತ್ತು ${subject} ಸೂಪರ್! ${emoji}\n\n${prideLine.text}\n\n${potentialLine.text},
        translation: Today ${subject} super!\n\n${prideLine.english}\n\n${potentialLine.english}
      },
      {
        caption: ${subject} ${emoji}\n\n${prideLine.text}\n\n${potentialLine.text},
        translation: ${prideLine.english}\n\n${potentialLine.english}
      }
    ],
    'Rajasthani': [
      {
        caption: ${subject} ${emoji}\n\n${subject} बहुत बढ़िया!\n\n${prideLine.text}\n\n${potentialLine.text},
        translation: ${subject} very good!\n\n${prideLine.english}\n\n${potentialLine.english}
      },
      {
        caption: आज ${subject} मस्त! ${emoji}\n\n${prideLine.text}\n\n${potentialLine.text},
        translation: Today ${subject} great!\n\n${prideLine.english}\n\n${potentialLine.english}
      },
      {
        caption: ${subject} ${emoji}\n\n${prideLine.text}\n\n${potentialLine.text},
        translation: ${prideLine.english}\n\n${potentialLine.english}
      }
    ],
    'Haryanvi': [
      {
        caption: ${subject} ${emoji}\n\n${subject} बढ़िया!\n\n${prideLine.text}\n\n${potentialLine.text},
        translation: ${subject} great!\n\n${prideLine.english}\n\n${potentialLine.english}
      },
      {
        caption: आज ${subject} मस्त! ${emoji}\n\n${prideLine.text}\n\n${potentialLine.text},
        translation: Today ${subject} good!\n\n${prideLine.english}\n\n${potentialLine.english}
      },
      {
        caption: ${subject} ${emoji}\n\n${prideLine.text}\n\n${potentialLine.text},
        translation: ${prideLine.english}\n\n${potentialLine.english}
      }
    ],
    'Bhojpuri': [
      {
        caption: ${subject} ${emoji}\n\n${subject} बड़ बढ़िया!\n\n${prideLine.text}\n\n${potentialLine.text},
        translation: ${subject} very good!\n\n${prideLine.english}\n\n${potentialLine.english}
      },
      {
        caption: आजु ${subject} मस्त! ${emoji}\n\n${prideLine.text}\n\n${potentialLine.text},
        translation: Today ${subject} great!\n\n${prideLine.english}\n\n${potentialLine.english}
      },
      {
        caption: ${subject} ${emoji}\n\n${prideLine.text}\n\n${potentialLine.text},
        translation: ${prideLine.english}\n\n${potentialLine.english}
      }
    ],
    'Hyderabadi': [
      {
        caption: ${subject} ${emoji}\n\n${subject} ekdum mast!\n\n${prideLine.text}\n\n${potentialLine.text},
        translation: ${subject} totally awesome!\n\n${prideLine.english}\n\n${potentialLine.english}
      },
      {
        caption: Aaj ${subject} badhiya! ${emoji}\n\n${prideLine.text}\n\n${potentialLine.text},
        translation: Today ${subject} good!\n\n${prideLine.english}\n\n${potentialLine.english}
      },
      {
        caption: ${subject} ${emoji}\n\n${prideLine.text}\n\n${potentialLine.text},
        translation: ${prideLine.english}\n\n${potentialLine.english}
      }
    ],
    'Delhi Vibe': [
      {
        caption: ${subject} ${emoji}\n\n${subject} bhai ekdum solid!\n\n${prideLine.text}\n\n${potentialLine.text},
        translation: ${subject} bro totally solid!\n\n${prideLine.english}\n\n${potentialLine.english}
      },
      {
        caption: Aaj ${subject} mast tha! ${emoji}\n\n${prideLine.text}\n\n${potentialLine.text},
        translation: Today ${subject} great!\n\n${prideLine.english}\n\n${potentialLine.english}
      },
      {
        caption: ${subject} ${emoji}\n\n${prideLine.text}\n\n${potentialLine.text},
        translation: ${prideLine.english}\n\n${potentialLine.english}
      }
    ],
    'MumBhai Vibe': [
      {
        caption: ${subject} ${emoji}\n\n${subject} खूप छान!\n\n${prideLine.text}\n\n${potentialLine.text},
        translation: ${subject} very good!\n\n${prideLine.english}\n\n${potentialLine.english}
      },
      {
        caption: आज ${subject} मस्त! ${emoji}\n\n${prideLine.text}\n\n${potentialLine.text},
        translation: Today ${subject} great!\n\n${prideLine.english}\n\n${potentialLine.english}
      },
      {
        caption: ${subject} ${emoji}\n\n${prideLine.text}\n\n${potentialLine.text},
        translation: ${prideLine.english}\n\n${potentialLine.english}
      }
    ],
    'South Indian': [
      {
        caption: ${subject} ${emoji}\n\n${subject} super!\n\n${prideLine.text}\n\n${potentialLine.text},
        translation: ${prideLine.english}\n\n${potentialLine.english}
      },
      {
        caption: Today ${subject} great! ${emoji}\n\n${prideLine.text}\n\n${potentialLine.text},
        translation: ${prideLine.english}\n\n${potentialLine.english}
      },
      {
        caption: ${subject} ${emoji}\n\n${prideLine.text}\n\n${potentialLine.text},
        translation: ${prideLine.english}\n\n${potentialLine.english}
      }
    ],
    'Kashmiri': [
      {
        caption: ${subject} ${emoji}\n\n${subject} बहुत सुंदर!\n\n${prideLine.text}\n\n${potentialLine.text},
        translation: ${subject} very beautiful!\n\n${prideLine.english}\n\n${potentialLine.english}
      },
      {
        caption: आज ${subject} अच्छा! ${emoji}\n\n${prideLine.text}\n\n${potentialLine.text},
        translation: Today ${subject} good!\n\n${prideLine.english}\n\n${potentialLine.english}
      },
      {
        caption: ${subject} ${emoji}\n\n${prideLine.text}\n\n${potentialLine.text},
        translation: ${prideLine.english}\n\n${potentialLine.english}
      }
    ],
    'Odia': [
      {
        caption: ${subject} ${emoji}\n\n${subject} ବହୁତ ଭଲ!\n\n${prideLine.text}\n\n${potentialLine.text},
        translation: ${subject} very good!\n\n${prideLine.english}\n\n${potentialLine.english}
      },
      {
        caption: ଆଜି ${subject} ଭଲ! ${emoji}\n\n${prideLine.text}\n\n${potentialLine.text},
        translation: Today ${subject} good!\n\n${prideLine.english}\n\n${potentialLine.english}
      },
      {
        caption: ${subject} ${emoji}\n\n${prideLine.text}\n\n${potentialLine.text},
        translation: ${prideLine.english}\n\n${potentialLine.english}
      }
    ],
    'Assamese': [
      {
        caption: ${subject} ${emoji}\n\n${subject} বহুত ভাল!\n\n${prideLine.text}\n\n${potentialLine.text},
        translation: ${subject} very good!\n\n${prideLine.english}\n\n${potentialLine.english}
      },
      {
        caption: আজি ${subject} ভাল! ${emoji}\n\n${prideLine.text}\n\n${potentialLine.text},
        translation: Today ${subject} good!\n\n${prideLine.english}\n\n${potentialLine.english}
      },
      {
        caption: ${subject} ${emoji}\n\n${prideLine.text}\n\n${potentialLine.text},
        translation: ${prideLine.english}\n\n${potentialLine.english}
      }
    ]
  }

  if (!templates[vibe]) {
    const simple = [
      {
        caption: ${subject} ${emoji}\n\n${prideLine.text}\n\n${potentialLine.text},
        translation: ${prideLine.english}\n\n${potentialLine.english}
      },
      {
        caption: ${subject} moments ${emoji}\n\n${prideLine.text}\n\n${potentialLine.text},
        translation: ${prideLine.english}\n\n${potentialLine.english}
      },
      {
        caption: ${subject} vibes ${emoji}\n\n${prideLine.text}\n\n${potentialLine.text},
        translation: ${prideLine.english}\n\n${potentialLine.english}
      }
    ]
    return simple
  }

  return templates[vibe]
}

function getPrideLine(vibe) {
  const lines = {
    'Gujarati': { text: 'આ અમારા કાઠિયાવાડની મોજ છે! 🙏', english: 'This is the joy of our Kathiyawad!' },
    'Punjabi': { text: 'ਪੰਜਾਬੀਆਂ ਦਾ ਜਿਗਰਾ ਵੱਖਰਾ ਆ! 👑', english: 'Punjabis have a different spirit!' },
    'Marathi': { text: 'जय महाराष्ट्र! 🚩', english: 'Jai Maharashtra!' },
    'Bengali': { text: 'বাঙালির গর্ব! 💙', english: 'Bengali pride!' },
    'Tamil': { text: 'தமிழன் என்று சொல்லடா! 🔥', english: 'Say you are Tamil!' },
    'Telugu': { text: 'తెలుగు గర్వం! 💛', english: 'Telugu pride!' },
    'Malayalam': { text: 'കേരളത്തിന്റെ അഭിമാനം! 🌴', english: "Kerala's pride!" },
    'Kannada': { text: 'ಕರ್ನಾಟಕದ ಹೆಮ್ಮೆ! 💛', english: 'Karnataka pride!' },
    'Rajasthani': { text: 'म्हारो राजस्थान! 👑', english: 'My Rajasthan!' },
    'Haryanvi': { text: 'हरियाणे की शान! 🦁', english: "Haryana's glory!" },
    'Bhojpuri': { text: 'भोजपुरिया के जिगरा! 🎶', english: 'Bhojpuri spirit!' },
    'Hyderabadi': { text: 'Hyderabad ka swag! 🏛️', english: "Hyderabad's swag!" },
    'Delhi Vibe': { text: 'Dilli dil walon ki! ❤️', english: 'Delhi of the hearted!' },
    'MumBhai Vibe': { text: 'Aamchi Mumbai! 🌊', english: 'Our Mumbai!' },
    'South Indian': { text: 'South pride! 🌺', english: 'South pride!' },
    'Kashmiri': { text: 'कश्मीर स्वर्ग! 🏔️', english: 'Kashmir heaven!' },
    'Odia': { text: 'ଓଡ଼ିଶା ଗର୍ବ! 🏖️', english: 'Odisha pride!' },
    'Assamese': { text: 'অসম গৌৰৱ! 🌿', english: 'Assam pride!' }
  }
  return lines[vibe] || { text: '', english: '' }
}

function getPotentialLine(vibe) {
  const lines = {
    'Gujarati': {
      text: '🌟 તમે viral નથી થતા, તમે તમારી શક્તિ બહાર કાઢો છો.',
      english: "🌟 You're not getting viral, you're bringing out your potential."
    },
    'Punjabi': {
      text: '🌟 ਤੁਸੀਂ viral ਨੀ ਹੋ ਰਹੇ, ਤੁਸੀਂ ਆਪਣੀ ਤਾਕਤ ਬਾਹਰ ਕੱਢ ਰਹੇ ਹੋ।',
      english: "🌟 You're not getting viral, you're bringing out your power."
    },
    'Marathi': {
      text: '🌟 तुम्ही viral होत नाही, तुम्ही शक्ती काढत आहात.',
      english: "🌟 You're not getting viral, you're bringing out strength."
    },
    'Bengali': {
      text: '🌟 তুমি viral হচ্ছো না, তুমি সম্ভাবনা বের করছো।',
      english: "🌟 You're not getting viral, you're bringing out potential."
    },
    'Tamil': {
      text: '🌟 நீங்கள் viral ஆகல, திறமையை வெளிக்கொண்டு வர்றீங்க.',
      english: "🌟 You're not getting viral, you're bringing out talent."
    },
    'Telugu': {
      text: '🌟 మీరు viral కాడం లేదు, శక్తిని బయటకు తీస్తున్నారు.',
      english: "🌟 You're not getting viral, you're bringing out power."
    },
    'Malayalam': {
      text: '🌟 നിങ്ങൾ viral ആകുന്നില്ല, കഴിവ് പുറത്തെടുക്കുകയാണ്.',
      english: "🌟 You're not getting viral, you're bringing out potential."
    },
    'Kannada': {
      text: '🌟 ನೀವು viral ಆಗುತ್ತಿಲ್ಲ, ಶಕ್ತಿಯನ್ನು ಹೊರಗೆ ತರುತ್ತಿದ್ದೀರಿ.',
      english: "🌟 You're not getting viral, you're bringing out power."
    },
    'Rajasthani': {
      text: '🌟 थे viral नी हो रह्या, ताकत बाहर काढ रह्या हो.',
      english: "🌟 You're not getting viral, you're bringing out strength."
    },
    'Haryanvi': {
      text: '🌟 तू viral नी हो रहा, ताकत बाहर काढ रहा है.',
      english: "🌟 You're not getting viral, you're bringing out power."
    },
    'Bhojpuri': {
      text: '🌟 रउआ viral नाहीं हो रहल, ताकत बाहर निकाल रहल बानी.',
      english: "🌟 You're not getting viral, you're bringing out strength."
    },
    'Hyderabadi': {
      text: '🌟 Tu viral nahi ho raha, taakat bahar nikal raha hai.',
      english: "🌟 You're not getting viral, you're bringing out power."
    },
    'Delhi Vibe': {
      text: '🌟 Tu viral nahi ho raha, shakti bahar la raha hai.',
      english: "🌟 You're not getting viral, you're bringing out power."
    },
    'MumBhai Vibe': {
      text: '🌟 तू viral होत नाहीयेस, शक्ती बाहेर काढतोयस.',
      english: "🌟 You're not getting viral, you're bringing out strength."
    },
    'South Indian': {
      text: "🌟 You're not getting viral, you're bringing out your potential.",
      english: "🌟 You're not getting viral, you're bringing out your potential."
    },
    'Kashmiri': {
      text: '🌟 आप viral नहीं हो रहे, शक्ति बाहर ला रहे हैं.',
      english: "🌟 You're not getting viral, you're bringing out power."
    },
    'Odia': {
      text: '🌟 ଆପଣ viral ହେଉନାହାଁନ୍ତି, ଶକ୍ତି ବାହାରକୁ ଆଣୁଛନ୍ତି.',
      english: "🌟 You're not getting viral, you're bringing out power."
    },
    'Assamese': {
      text: '🌟 আপুনি viral হোৱা নাই, শক্তি বাহিৰলৈ উলিয়াই আনিছে.',
      english: "🌟 You're not getting viral, you're bringing out power."
    }
  }
  return lines[vibe] || {
    text: "🌟 You're not getting viral, you're bringing out your potential.",
    english: "🌟 You're not getting viral, you're bringing out your potential."
  }
}

function getBasicCaptions(subject, mood) {
  const emoji = getMoodEmoji(mood)
  const potential = "🌟 You're not getting viral, you're bringing out your potential."

  return [
    { caption: ${subject} ${emoji}\n\nLiving the moment.\n\n${potential}, translation: null },
    { caption: ${subject} vibes ${emoji}\n\n${mood} energy.\n\n${potential}, translation: null },
    { caption: Just ${subject} ${emoji}\n\n${potential}, translation: null }
  ]
}

function getMoodEmoji(mood) {
  const emojis = {
    'Aesthetic': '✨',
    'Motivational': '💪',
    'Funny': '😂',
    'Savage': '😎',
    'Poetic': '🌙',
    'Cinematic': '🎬',
    'Chill': '😌',
    'Bold': '🔥',
    'Romantic': '💕',
    'Minimal': '🤍'
  }
  return emojis[mood] || '✨'
}
