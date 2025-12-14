// pages/api/generate.js
export default async function handler(req, res) {
  // Set CORS headers to allow requests from any origin
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Max-Age', '86400'); // 24 hours

  // Handle preflight OPTIONS request
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Only allow POST requests
  if (req.method !== "POST") {
    return res.status(405).json({ 
      error: "Method not allowed. Use POST method." 
    });
  }

  // Parse and validate request body
  const { subject, mood, region, details, feedback } = req.body;

  // Validate required fields
  if (!subject || typeof subject !== 'string' || subject.trim().length === 0) {
    return res.status(400).json({ 
      error: "Subject is required and must be a non-empty string" 
    });
  }

  if (!mood || typeof mood !== 'string' || mood.trim().length === 0) {
    return res.status(400).json({ 
      error: "Mood is required and must be a non-empty string" 
    });
  }

  try {
    // Build base line with subject and optional details
    const baseLine = details && details.trim() 
      ? `${subject.trim()} — ${details.trim()}` 
      : subject.trim();

    // 1-LINE QUICK FIRE CAPTION
    const quickFire = `${baseLine}.\n${mood} energy 🔥\n\n#${mood} #viral #instagram #indiancreator`;

    // 2-3 LINE PREMIUM CAPTION  
    const premiumCaption = `${baseLine} speaks louder than words.\nThis ${mood} moment defines everything.\nFeel the vibe, share the energy.\n\n#${mood} #trending #creators #indiancontent #viral`;

    // REGIONAL CAPTION
    const regionalCaption = region && region !== "none" 
      ? `${baseLine} (${region} style)\n${mood} vibes only 🌟\n\n#${mood} #${region} #localcreator`
      : quickFire;

    // Create variants array
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
        label: region && region !== "none" 
          ? `${region.charAt(0).toUpperCase() + region.slice(1)} Style` 
          : "Regional",
        premium: false,
        regionLabel: region && region !== "none" 
          ? region.charAt(0).toUpperCase() + region.slice(1) 
          : null
      }
    ];

    // Log analytics data
    console.log(`Caption generated:`, {
      subject: subject.trim(),
      mood: mood.trim(),
      region: region || 'none',
      hasDetails: !!details,
      hasFeedback: !!feedback
    });

    // Return successful response with variants
    return res.status(200).json({ variants });
    
  } catch (error) {
    // Log error for debugging
    console.error('API Generation Error:', {
      message: error.message,
      stack: error.stack,
      requestBody: req.body
    });
    
    // Return error response
    return res.status(500).json({ 
      error: "Internal server error. Failed to generate captions." 
    });
  }
}
