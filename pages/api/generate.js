export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { subject, mood, regionalVibe } = req.body

  if (!subject || !mood) {
    return res.status(400).json({ error: 'Subject and mood required' })
  }

  const emoji = getEmoji(mood)
  const pride = getPride(regionalVibe)
  const power = getPower(regionalVibe)

  const cap1 = subject + ' ' + emoji + '\n\n' + pride.text + '\n\n' + power.text
  const trans1 = pride.english + '\n\n' + power.english

  const cap2 = 'Just ' + subject + ' ' + emoji + '\n\n' + pride.text + '\n\n' + power.text
  const trans2 = pride.english + '\n\n' + power.english

  const cap3 = subject + ' vibes ' + emoji + '\n\n' + pride.text + '\n\n' + power.text
  const trans3 = pride.english + '\n\n' + power.english

  const captions = [
    { caption: cap1, translation: regionalVibe !== 'None' ? trans1 : null },
    { caption: cap2, translation: regionalVibe !== 'None' ? trans2 : null },
    { caption: cap3, translation: regionalVibe !== 'None' ? trans3 : null }
  ]

  return res.status(200).json({ captions })
}

function getEmoji(mood) {
  const emojis = {
    'Aesthetic': '✨', 'Motivational': '💪', 'Funny': '😂',
    'Savage': '😎', 'Poetic': '🌙', 'Cinematic': '🎬',
    'Chill': '😌', 'Bold': '🔥', 'Romantic': '💕', 'Minimal': '🤍'
  }
  return emojis[mood] || '✨'
}

function getPride(vibe) {
  const lines = {
    'Gujarati': { text: 'આ અમારા કાઠિયાવાડની મોજ છે! 🙏', english: 'This is the joy of our Kathiyawad!' },
    'Punjabi': { text: 'ਪੰਜਾਬੀਆਂ ਦਾ ਜਿਗਰਾ ਵੱਖਰਾ ਆ! 👑', english: 'Punjabis have different spirit!' },
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
    'Delhi Vibe': { text: 'Dilli dil walon ki! ❤️', english: 'Delhi hearted!' },
    'MumBhai Vibe': { text: 'Aamchi Mumbai! 🌊', english: 'Our Mumbai!' },
    'South Indian': { text: 'South pride! 🌺', english: 'South pride!' },
    'Kashmiri': { text: 'कश्मीर स्वर्ग! 🏔️', english: 'Kashmir heaven!' },
    'Odia': { text: 'ଓଡ଼ିଶା ଗର୍ବ! 🏖️', english: 'Odisha pride!' },
    'Assamese': { text: 'অসম গৌৰৱ! 🌿', english: 'Assam pride!' }
  }
  return lines[vibe] || { text: '', english: '' }
}

function getPower(vibe) {
  const lines = {
    'Gujarati': { 
      text: '🌟 તમે viral નથી થતા, તમે શક્તિ બહાર કાઢો છો.', 
      english: "🌟 You're not getting viral, you're bringing out potential." 
    },
    'Punjabi': { 
      text: '🌟 ਤੁਸੀਂ viral ਨੀ, ਤਾਕਤ ਬਾਹਰ ਕੱਢ ਰਹੇ ਹੋ।', 
      english: "🌟 You're not getting viral, you're bringing out power." 
    },
    'Marathi': { 
      text: '🌟 तुम्ही viral नाही, शक्ती काढत आहात.', 
      english: "🌟 You're not getting viral, you're bringing out strength." 
    },
    'Bengali': { 
      text: '🌟 তুমি viral না, সম্ভাবনা বের করছো।', 
      english: "🌟 You're not getting viral, you're bringing out potential." 
    },
    'Tamil': { 
      text: '🌟 நீங்கள் viral இல்ல, திறமை வெளிக்கொண்டு வர்றீங்க.', 
      english: "🌟 You're not getting viral, you're bringing out talent." 
    },
    'Telugu': { 
      text: '🌟 మీరు viral కాదు, శక్తిని బయటకు తీస్తున్నారు.', 
      english: "🌟 You're not getting viral, you're bringing out power." 
    },
    'Malayalam': { 
      text: '🌟 നിങ്ങൾ viral അല്ല, കഴിവ് പുറത്തെടുക്കുകയാണ്.', 
      english: "🌟 You're not getting viral, you're bringing out potential." 
    },
    'Kannada': { 
      text: '🌟 ನೀವು viral ಅಲ್ಲ, ಶಕ್ತಿಯನ್ನು ಹೊರಗೆ ತರುತ್ತಿದ್ದೀರಿ.', 
      english: "🌟 You're not getting viral, you're bringing out power." 
    },
    'Rajasthani': { 
      text: '🌟 थे viral नी, ताकत बाहर काढ रह्या हो.', 
      english: "🌟 You're not getting viral, you're bringing out strength." 
    },
    'Haryanvi': { 
      text: '🌟 तू viral नी, ताकत बाहर काढ रहा है.', 
      english: "🌟 You're not getting viral, you're bringing out power." 
    },
    'Bhojpuri': { 
      text: '🌟 रउआ viral नाहीं, ताकत बाहर निकाल रहल बानी.', 
      english: "🌟 You're not getting viral, you're bringing out strength." 
    },
    'Hyderabadi': { 
      text: '🌟 Tu viral nahi, taakat bahar nikal raha hai.', 
      english: "🌟 You're not getting viral, you're bringing out power." 
    },
    'Delhi Vibe': { 
      text: '🌟 Tu viral nahi, shakti bahar la raha hai.', 
      english: "🌟 You're not getting viral, you're bringing out power." 
    },
    'MumBhai Vibe': { 
      text: '🌟 तू viral नाही, शक्ती बाहेर काढतोयस.', 
      english: "🌟 You're not getting viral, you're bringing out strength." 
    },
    'South Indian': { 
      text: "🌟 You're not getting viral, you're bringing out potential.", 
      english: "🌟 You're not getting viral, you're bringing out potential." 
    },
    'Kashmiri': { 
      text: '🌟 आप viral नहीं, शक्ति बाहर ला रहे हैं.', 
      english: "🌟 You're not getting viral, you're bringing out power." 
    },
    'Odia': { 
      text: '🌟 ଆପଣ viral ନୁହଁନ୍ତି, ଶକ୍ତି ବାହାରକୁ ଆଣୁଛନ୍ତି.', 
      english: "🌟 You're not getting viral, you're bringing out power." 
    },
    'Assamese': { 
      text: '🌟 আপুনি viral নহয়, শক্তি বাহিৰলৈ উলিয়াই আনিছে.', 
      english: "🌟 You're not getting viral, you're bringing out power." 
    }
  }
  return lines[vibe] || { 
    text: "🌟 You're not getting viral, you're bringing out your potential.", 
    english: "🌟 You're not getting viral, you're bringing out your potential." 
  }
}
