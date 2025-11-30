// pages/api/generate.js
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { subject, mood, region } = req.body || {};

  if (!subject || !mood) {
    return res.status(400).json({ error: 'Subject and mood required' }); 
  }

  const clean = (s = '') => String(s).trim();

  const cleanSubject = clean(subject);
  const cleanMood = clean(mood);
  const cleanRegion = clean(region || 'none');

  // Fallback content data
  const moods = [
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
    { id: "alone", punch: "Silence teaches louder than people.", hashtags: "#Alone #QuietStrength" },
    { id: "boss", punch: "Money talks, but discipline screams.", hashtags: "#Boss #Discipline" },
    { id: "genz", punch: "Chaotic but still iconic.", hashtags: "#GenZ #MainCharacter" },
    { id: "calm", punch: "Peace looks good on me.", hashtags: "#Calm #InnerPeace" }
  ];

  const regions = {
    gujarati: ["આ છે અમારા ગુજરાતી વાઇબ 🌟", "આ છે આપડી કાઠિયાવાડની મોજ 🔥", "ગુજરાતી લોહીમાં વાઇબ અલગ 💛"],
    hindi: ["ये है हमारी देसी शान 🔥","देसी दिल, देसी वाइब 💛","ये स्टाइल सिर्फ हम देसी करते हैं."],
    punjabi: ["ਏ ਸਾਡੀ ਪੰਜਾਬੀ ਵਾਈਬ ਹੈ 🔥","ਪੰਜਾਬੀਆਂ ਦੀ ਗੱਲ ਹੀ ਕੁਝ ਹੋਰ 💛","ਵਾਈਬ ਤਾ ਸਾਡੀ ਹੀ ਚਲਦੀ ਹੈ!"],
    // add others as needed...
  };

  const instagramLink = process.env.SITE_INSTAGRAM || 'https://www.instagram.com/instaalgohacker';

  const findMood = moods.find(m => m.id === cleanMood) || moods[0];

  // Helper: fallback caption generator (guaranteed)
  const createFallback = (style = 1) => {
    if (style === 1) {
      let c = `${cleanSubject}.\n${findMood.punch}`;
      if (cleanRegion !== 'none' && regions[cleanRegion]) c += `\n${regions[cleanRegion][0]}`;
      c += `\n\n${findMood.hashtags}`;
      return c;
    } else {
      let c = `${cleanSubject} — the kind that stays with you.\n\n${findMood.punch}`;
      if (cleanRegion !== 'none' && regions[cleanRegion]) c += `\n${regions[cleanRegion][1]}`;
      c += `\n\n${findMood.hashtags}`;
      return c;
    }
  };

  // Try Hugging Face (premium) — use env vars if provided
  let premiumCaption = null;
  const hfKey = process.env.HUGGINGFACE_API_KEY;
  const hfModel = process.env.HUGGINGFACE_MODEL; // full model name or endpoint

  if (hfKey && hfModel) {
    try {
      const prompt = `Write ONE high-quality Instagram caption (2-3 lines + hashtags). 
Subject: ${cleanSubject}
Mood: ${cleanMood}
Region / vibe: ${cleanRegion === 'none' ? 'none' : cleanRegion}

Tone: deep, emotional, stylish, optimized for engagement and shares.
Return only the caption text (no extra meta).`;

      const hfUrl = `https://router.huggingface.co/models/${hfModel}`;

      const hfResp = await fetch(hfUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${hfKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          inputs: prompt,
          parameters: { max_new_tokens: 160, temperature: 0.7 }
        })
      });

      // If HF returned OK, try to parse various response shapes
      if (hfResp.ok) {
        const data = await hfResp.json();
        // data may be [{generated_text: "..."}] or {generated_text: "..."} or plain text
        const text =
          (Array.isArray(data) && (data[0]?.generated_text || data[0]?.generated_text === '') ? data[0].generated_text : null)
          || (data.generated_text)
          || (typeof data === 'string' ? data : null)
          || JSON.stringify(data);

        const cleaned = String(text || '').trim();
        if (cleaned.length > 12) {
          // sometimes HF returns more; keep first 1-3 lines
          const lines = cleaned.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
          premiumCaption = lines.slice(0, 4).join('\n');
        }
      } else {
        // helpful debug log for you (will appear in Render/Vercel logs)
        const errText = await hfResp.text().catch(() => '');
        console.warn('HF non-ok response:', hfResp.status, errText);
      }
    } catch (e) {
      console.error('HuggingFace error:', e?.message || e);
    }
  }

  // If premiumCaption still null, use fallback (but we still label it Premium on front-end)
  if (!premiumCaption) {
    premiumCaption = createFallback(1);
  }

  // Build variants: premium first, then two fallback captions
  const instagramMessage = `\n\nFollow us on Instagram — ${instagramLink}`;

  const variants = [
    { caption: premiumCaption + instagramMessage, regionLabel: regions[cleanRegion]?.label || (cleanRegion === 'none' ? null : cleanRegion) || null },
    { caption: createFallback(1) + instagramMessage, regionLabel: regions[cleanRegion]?.label || (cleanRegion === 'none' ? null : cleanRegion) || null },
    { caption: createFallback(2) + instagramMessage, regionLabel: regions[cleanRegion]?.label || (cleanRegion === 'none' ? null : cleanRegion) || null }
  ];

  return res.status(200).json({ variants });
}
