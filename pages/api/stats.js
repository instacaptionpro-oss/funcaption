// pages/api/stats.js
import { db } from '../../lib/firebase-admin';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const snap = await db.collection('captionEvents').get();
    const total = snap.size;

    const byMood = {};
    const byRegion = {};
    let premiumCount = 0;

    snap.forEach(doc => {
      const d = doc.data();
      if (!d) return;

      if (d.mood) {
        byMood[d.mood] = (byMood[d.mood] || 0) + 1;
      }
      if (d.region) {
        byRegion[d.region] = (byRegion[d.region] || 0) + 1;
      }
      if (d.premiumUsed) {
        premiumCount += 1;
      }
    });

    return res.status(200).json({
      total,
      premiumCount,
      byMood,
      byRegion,
    });
  } catch (e) {
    console.error('stats error', e);
    return res.status(500).json({ error: 'Stats failed' });
  }
}
