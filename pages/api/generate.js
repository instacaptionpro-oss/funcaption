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

  // Simple fallback captions that always work
  const fallbackShort = `${baseLine}.\n${mood} energy 🔥\n\n#${mood} #viral #instagram #indiancreator`;
  const fallbackMedium = `${baseLine} speaks louder than words.\nThis ${mood} moment defines everything.\nFeel the vibe, share the energy.\n\n#${mood} #trending #creators #indiancontent #viral`;
  const regionalFallback = region && region !== "none" 
    ? `${baseLine} (${region} style)\n${mood} vibes only 🌟\n\n#${mood} #${region} #localcreator`
    : fallbackShort;

  const variants = [
    {
      caption: fallbackShort,
      type: "short",
      label: "Quick Fire",
      premium: false
    },
    {
      caption: fallbackMedium,
      type: "medium",
      label: "Story Mode",
      premium: true
    },
    {
      caption: regionalFallback,
      type: "regional",
      label: region && region !== "none" ? `${region.charAt(0).toUpperCase() + region.slice(1)} Style` : "Regional",
      premium: false,
      regionLabel: region && region !== "none" ? region : null
    }
  ];

  // Simple analytics update
  try {
    // This will work without any external dependencies
    console.log(`Caption generated: ${subject} - ${mood}`);
  } catch (err) {
    console.error('Logging failed:', err);
  }

  return res.status(200).json({ variants });
}
