export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { subject, mood, region, details } = req.body;

  if (!subject || !mood) {
    return res.status(400).json({ error: "Subject and mood required" });
  }

  // Build base line
  const baseLine = details ? `${subject} — ${details}` : subject;

  // 1-LINE QUICK FIRE CAPTION
  const quickFire = `${baseLine}.\n${mood} energy 🔥\n\n#${mood} #viral #instagram #indiancreator`;

  // 2-3 LINE PREMIUM CAPTION  
  const premiumCaption = `${baseLine} speaks louder than words.\nThis ${mood} moment defines everything.\nFeel the vibe, share the energy.\n\n#${mood} #trending #creators #indiancontent #viral`;

  // REGIONAL CAPTION
  const regionalCaption = region && region !== "none" 
    ? `${baseLine} (${region} style)\n${mood} vibes only 🌟\n\n#${mood} #${region} #localcreator`
    : quickFire;

  const variants = [
    {
      caption: quickFire,
      type: "short",
      label: "Quick Fire",
      premium: false
    },
    {
      caption: premiumCaption,
      type: "medium",
      label: "Story Mode",
      premium: true
    },
    {
      caption: regionalCaption,
      type: "regional",
      label: region && region !== "none" ? `${region.charAt(0).toUpperCase() + region.slice(1)} Style` : "Regional",
      premium: false,
      regionLabel: region && region !== "none" ? region : null
    }
  ];

  // Simple analytics logging
  try {
    console.log(`Caption generated: ${subject} - ${mood} - ${region || 'none'}`);
  } catch (err) {
    console.error('Logging failed:', err);
  }

  return res.status(200).json({ variants });
}
