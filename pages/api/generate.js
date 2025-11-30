// pages/api/generate.js
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { subject, mood, region } = req.body || {};
  if (!subject || !mood) return res.status(400).json({ error: 'Subject and mood required' });

  const cleanSubject = String(subject).trim();
  const moodKey = String(mood).trim();

  // --- Data (moods + regions) ---
  const moods = [
    { id: "attitude", label: "Attitude", punch: "Iron heals what people break.", hashtags: "#Attitude #SilentGrind #Results" },
    { id: "motivation", label: "Motivation", punch: "The grind is lonely but legends are born here.", hashtags: "#Motivation #Grind #Hustle" },
    { id: "love", label: "Love", punch: "Some feelings rewrite the heart, silently.", hashtags: "#Love #DeepFeelings" },
    { id: "breakup", label: "Breakup", punch: "I lost them, but I found myself — and that's the win.", hashtags: "#Breakup #SelfGrowth" },
    { id: "gym", label: "Gym", punch: "Iron heals what people break.", hashtags: "#Gym #FitnessMotivation" },
    { id: "travel", label: "Travel", punch: "Some roads fix parts of you you never speak about.", hashtags: "#Travel #Wanderlust" },
    { id: "cute", label: "Cute", punch: "Soft heart, sharp mind — rare combination.", hashtags: "#Cute #PositiveVibes" },
    { id: "savage", label: "Savage", punch: "If I cared, you'd know. I don't.", hashtags: "#Savage #Unbothered" },
    { id: "aesthetic", label: "Aesthetic", punch: "Some things look better when you stop chasing.", hashtags: "#Aesthetic #Mood" },
    { id: "sad", label: "Sad", punch: "I smile… but rarely at the same things now.", hashtags: "#Sad #RealTalk" },
    { id: "happy", label: "Happy", punch: "Little moments make big lives.", hashtags: "#Happy #Grateful" },
    { id: "alone", label: "Alone", punch: "Silence teaches louder than people.", hashtags: "#Alone #SelfReflection" },
    { id: "boss", label: "Boss", punch: "Money talks, but discipline screams.", hashtags: "#Boss #Discipline" },
    { id: "genz", label: "GenZ", punch: "Chaotic but still iconic.", hashtags: "#GenZ #MainCharacter" },
    { id: "calm", label: "Calm", punch: "Peace looks good on me.", hashtags: "#Calm #InnerPeace" }
  ];

  const regions = {
    gujarati: { label: "Gujarati", variants: ["આ છે અમારા ગુજરાતી વાઇબ 🌟", "આ છે આપડી કાઠિયાવાડની મોજ 🔥", "ગુજરાતી લોહીમાં વાઇબ અલગ 💛"] },
    marathi: { label: "Marathi", variants: ["ही आहे आमची मराठी स्टाईल 🔥", "मराठी मना ची वेगळीच ओळख 💛", "आम्ही मराठी — vibes वेगळ्याच!"] },
    punjabi: { label: "Punjabi", variants: ["ਏ ਸਾਡੀ ਪੰਜਾਬੀ ਵਾਈਬ ਹੈ 🔥", "ਪੰਜਾਬੀਆਂ ਦੀ ਗੱਲ ਹੀ ਕੁਝ ਹੋਰ 💛", "ਵਾਈਬ ਤਾ ਸਾਡੀ ਹੀ ਚਲਦੀ ਹੈ!"] },
    hindi: { label: "Hindi / Desi", variants: ["ये है हमारी देसी शान 🔥", "देसी दिल, देसी वाइब 💛", "ये स्टाइल सिर्फ हम देसी करते हैं."] },
    // add other regions if you want...
  };

  const moodObj = moods.find(m => m.id === moodKey) || { label: moodKey, punch: '', hashtags: '' };
  const regionObj = region && region !== 'none' ? (regions[region] || null) : null;

  // --- Generate fallback captions (fast, deterministic) ---
  const makeFallback = (styleIndex) => {
    if (styleIndex === 1) {
      let c = `${cleanSubject}.\n${moodObj.punch || ''}`;
      if (regionObj) c += `\n${regionObj.variants[0]}`;
      c += `\n\n${moodObj.hashtags.trim()}`;
      return c;
    } else {
      let c = `${cleanSubject} hits differently.\n${moodObj.punch || ''}`;
      if (regionObj) c += `\n${regionObj.variants[1] || ''}`;
      c += `\n\n${moodObj.hashtags.trim()}`;
      return c;
    }
  };

  const fallback1 = makeFallback(1);
  const fallback2 = makeFallback(2);

  // --- Try Hugging Face Router (premium caption) ---
  let premiumCaption = null;
  if (process.env.HUGGINGFACE_API_KEY && process.env.HUGGINGFACE_MODEL) {
    try {
      const hfResp = await fetch("https://router.huggingface.co/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: process.env.HUGGINGFACE_MODEL,
          messages: [
            {
              role: "user",
              content: `Write ONE Instagram caption (2–3 lines + hashtags). 
Subject: ${cleanSubject}
Mood: ${moodKey}
Region: ${region || 'none'}
Tone: deep, emotional, stylish. 
Return ONLY the caption text, no explanation.`
            }
          ],
          temperature: 0.7,
          max_tokens: 140
        })
      });

      if (hfResp.ok) {
        const hfJson = await hfResp.json();
        // try common shapes: choices[0].message.content or choices[0].text
        const candidate =
          hfJson?.choices?.[0]?.message?.content ||
          hfJson?.choices?.[0]?.text ||
          hfJson?.output_text ||
          "";

        if (candidate && candidate.trim().length > 8) {
          premiumCaption = String(candidate).trim();
        }
      } else {
        // log for debugging (Render logs)
        const bodyText = await hfResp.text().catch(() => '');
        console.log('HF non-ok', hfResp.status, bodyText);
      }
    } catch (err) {
      console.log('HF request error', err?.message || err);
    }
  }

  // --- Prepare final variants array (premium first if exists) ---
  const instagramMessage = "\n\nFollow us on Instagram: https://www.instagram.com/instaalgohacker";

  const variants = [];

  if (premiumCaption) {
    variants.push({ caption: `${premiumCaption}${instagramMessage}`, regionLabel: regionObj?.label || null, premium: true });
  } else {
    // if no premium available, put fallback1 in premium slot (but premium:false)
    variants.push({ caption: `${fallback1}${instagramMessage}`, regionLabel: regionObj?.label || null, premium: false });
  }

  // always include two fallback captions (free)
  variants.push({ caption: `${fallback1}${instagramMessage}`, regionLabel: regionObj?.label || null, premium: false });
  variants.push({ caption: `${fallback2}${instagramMessage}`, regionLabel: regionObj?.label || null, premium: false });

  return res.status(200).json({ variants });
}
