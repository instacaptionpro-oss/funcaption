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
    ]
  }

  // If vibe not in detailed templates, use simple format
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
    'Aesthetic': '✨', 'Motivational': '💪', 'Funny': '😂',
    'Savage': '😎', 'Poetic': '🌙', 'Cinematic': '🎬',
    'Chill': '😌', 'Bold': '🔥', 'Romantic': '💕', 'Minimal': '🤍'
  }
  return emojis[mood] || '✨'
}
