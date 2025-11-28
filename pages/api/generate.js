export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { subject, mood, region } = req.body;

  if (!subject || !mood) {
    return res.status(400).json({ error: 'Subject and mood required' });
  }

  // Use DeepSeek API
  try {
    const prompt = `You are a caption-writing expert who creates emotional, impactful, viral Instagram captions.

Generate 3 completely ORIGINAL caption variations with:
- 1 short emotional/powerful main line
- 1 supporting line (optional)
- 5–10 viral hashtags
- Tone based on the selected mood
- Add a regional touch ONLY if region ≠ "none"

Do NOT repeat the subject or mood text in the caption.  
Do NOT copy input words.  
Create something fresh, creative, and meaningful.

Subject: ${subject}
Mood: ${mood}
Region: ${region}

Format EXACTLY like this JSON structure:

{
  "variants": [
    { "caption": "caption 1 here" },
    { "caption": "caption 2 here" },
    { "caption": "caption 3 here" }
  ]
}`;

    const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.DEEPSEEK_API_KEY}`
      },
      body: JSON.stringify({
        model: "deepseek-chat",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.8,
        max_tokens: 500
      })
    });

    if (response.ok) {
      const data = await response.json();
      console.log('DeepSeek response:', data); // Debug log
      
      let content = data.choices[0].message.content;
      
      // Remove markdown code blocks if present
      content = content.replace(/```json/g, '').replace(/```/g, '').trim();
      
      try {
        const aiResponse = JSON.parse(content);
        
        // Add Instagram follow request to each caption
        const instagramMessage = "\n\nHelp please make us a favour follow us on Instagram and click below\nhttps://www.instagram.com/instaalgohacker?igsh=MW1maXl2a3IxNm40OA==";
        
        const finalVariants = aiResponse.variants.map(variant => ({
          caption: variant.caption + instagramMessage
        }));

        return res.status(200).json({ variants: finalVariants });
      } catch (parseError) {
        console.error('JSON parse error:', parseError);
        console.error('Raw content:', content);
        return res.status(500).json({ error: 'Failed to parse AI response' });
      }
    } else {
      const errorData = await response.text();
      console.error('DeepSeek API error:', errorData);
      return res.status(response.status).json({ error: 'DeepSeek API error' });
    }
  } catch (error) {
    console.error('DeepSeek error:', error);
    return res.status(500).json({ error: 'Failed to generate captions' });
  }
}
