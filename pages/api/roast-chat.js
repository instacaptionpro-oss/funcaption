export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { userInput, subject, mood } = req.body;

    if (!userInput) {
      return res.status(400).json({ error: 'No input provided' });
    }

    const HF_TOKEN = process.env.HF_TOKEN;
    
    if (!HF_TOKEN) {
      console.error("HF_TOKEN not found");
      return res.status(500).json({ error: 'API token not configured' });
    }

    const response = await fetch("https://router.huggingface.co/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${HF_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "meta-llama/Llama-3.3-70B-Instruct",
        messages: [
          {
            role: "system",
            content: `You are a brutally savage roaster who creates devastating, creative roasts. Rules:
1. Roast the user's message with MAXIMUM brutality and creativity
2. Reference their EXACT words in the roast to make it personal
3. Use harsh, cutting language - be ruthless
4. Keep responses 2-3 lines EXACTLY - short and devastating
5. Make it personal, specific, and absolutely savage
6. Be as brutal as these examples:
   - "Pretty good? You burn water, genius. Your idea of gourmet is ordering takeout twice in one day."
   - "1000 followers? Half of them are bots and the other half are your mom double-tapping."
   - "Good at gaming? You rage quit after dying to NPCs. Your high score is probably negative."
7. NEVER be generic - make every roast unique and specific
8. Hit where it hurts - be creative with your insults
${subject ? `9. The person's name/subject is: ${subject}` : ''}
${mood ? `10. Roast mood/style: ${mood}` : ''}`
          },
          {
            role: "user",
            content: `DESTROY THIS PERSON WITH YOUR MOST SAVAGE ROAST: "${userInput}"`
          }
        ],
        temperature: 0.9,
        max_tokens: 150,
        top_p: 0.95,
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error("HuggingFace API Error:", response.status, errorData);
      throw new Error(`API returned ${response.status}`);
    }

    const data = await response.json();
    const roastText = data.choices?.[0]?.message?.content;

    if (!roastText) {
      throw new Error("No content in response");
    }

    return res.status(200).json({ 
      roast: roastText.trim(),
      success: true 
    });

  } catch (error) {
    console.error("Roast API Error:", error);
    return res.status(500).json({ 
      error: 'Failed to generate roast',
      details: error.message 
    });
  }
}
