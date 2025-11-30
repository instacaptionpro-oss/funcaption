// pages/api/generate.js
import { getPremiumCaption } from '../../lib/hf-client.js';
import { generateFallbackCaptions } from '../../lib/fallback.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { subject, mood, region } = req.body ?? {};
  if (!subject || !mood) return res.status(400).json({ error: 'Subject and mood required' });

  // Ensure trimmed inputs
  const cleanSubject = String(subject).trim();
  const cleanMood = String(mood).trim();
  const cleanRegion = region ? String(region).trim() : 'none';

  // 1) Try premium from HF
  let premium = null;
  try {
    premium = await getPremiumCaption({ subject: cleanSubject, mood: cleanMood, region: cleanRegion });
  } catch (err) {
    console.warn('Premium fetch failed', err);
    premium = null;
  }

  // 2) Generate 2 fallback captions
  const fallback = generateFallbackCaptions({ subject: cleanSubject, moodId: cleanMood, region: cleanRegion });

  // 3) Build final variants: premium first if exists else fallback1, fallback2
  const instagramFooter = "\n\nFollow us on Instagram: https://www.instagram.com/instacaptionpro";
  const variants = [];

  if (premium) {
    variants.push({ caption: premium + instagramFooter, regionLabel: cleanRegion !== 'none' ? cleanRegion : null, premium: true });
    // add two fallback captions after premium
    variants.push({ caption: fallback[0].caption + instagramFooter, regionLabel: fallback[0].regionLabel || null, premium: false });
    variants.push({ caption: fallback[1].caption + instagramFooter, regionLabel: fallback[1].regionLabel || null, premium: false });
  } else {
    // No premium -> use 3 fallback (repeat a variation)
    variants.push({ caption: fallback[0].caption + instagramFooter, regionLabel: fallback[0].regionLabel || null, premium: false });
    variants.push({ caption: fallback[1].caption + instagramFooter, regionLabel: fallback[1].regionLabel || null, premium: false });
    // make a small third variant derived from mood
    variants.push({ caption: ${cleanSubject} — ${fallback[0].caption.split('\n')[0]}\n\n${fallback[0].caption.split('\n').slice(-1)[0]}${instagramFooter}, regionLabel: null, premium: false });
  }

  return res.status(200).json({ variants });
}
