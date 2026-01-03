// /pages/api/roast-chat.js

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  console.log("🔥 ROAST API HIT!");

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed. Use POST.' });
  }

  try {
    const { userInput, subject, mood, conversationHistory } = req.body;

    console.log("📝 User Input:", userInput);

    if (!userInput) {
      return res.status(400).json({ error: 'No input provided' });
    }

    const HF_TOKEN = process.env.HF_TOKEN;
    
    if (!HF_TOKEN) {
      console.error("❌ HF_TOKEN not found!");
      return res.status(500).json({ error: 'API token not configured' });
    }

    console.log("📡 Calling HuggingFace API...");

    const conversationMessages = conversationHistory?.slice(-6) || [];

    const hfResponse = await fetch("https://router.huggingface.co/v1/chat/completions", {
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
            content: `You are a brutal roast master. You destroy people with SHORT, SHARP, DEVASTATING burns.

## CRITICAL RULES:
1. MAXIMUM 2-3 sentences. NEVER more than 4 lines.
2. Be BRUTAL - use profanity freely (fuck, shit, bitch, damn, ass)
3. Reference their EXACT words to make it personal
4. One devastating punch, not a speech
5. Sound like a savage friend, not an AI
6. Make them laugh AND cry in 3 seconds

## PERFECT ROAST EXAMPLES (copy this length):
- "Bro said '${userInput}' like it meant something 💀 Even your WiFi disconnects from you on purpose."
- "Holy shit, that's the dumbest thing I've read today. Your brain's smoother than a bowling ball."
- "'${userInput}'? That's cute. Too bad your personality isn't."
- "Imagine typing that and thinking 'yeah, this is fire.' Couldn't be me. 💀"
- "You didn't just miss the point, you're in a whole different universe. Tragic."

## FORMAT:
- 2-3 sentences MAX
- Use emojis sparingly (💀 🔥 😭)
- End with a gut punch
- NO paragraphs, NO essays

${subject ? `Target: ${subject}` : ''}
${mood ? `Mood: ${mood}` : ''}

SHORT. BRUTAL. DONE.`
          },
          ...conversationMessages.map(msg => ({
            role: msg.sender === 'user' ? 'user' : 'assistant',
            content: msg.text
          })),
          {
            role: "user",
            content: userInput
          }
        ],
        temperature: 0.95,
        max_tokens: 80,  // Reduced for shorter responses
        top_p: 0.9,
        frequency_penalty: 0.9,
        presence_penalty: 0.7,
      }),
    });

    console.log("📨 Status:", hfResponse.status);

    if (!hfResponse.ok) {
      const errorText = await hfResponse.text();
      console.error("❌ HuggingFace Error:", errorText);
      throw new Error(`API error: ${hfResponse.status}`);
    }

    const data = await hfResponse.json();
    let roastText = data.choices?.[0]?.message?.content;

    if (!roastText) {
      throw new Error("No content in response");
    }

    // Clean up - remove any extra whitespace/newlines
    roastText = roastText.trim().replace(/\n\n+/g, ' ').replace(/\s+/g, ' ');

    console.log("✅ Roast:", roastText);

    return res.status(200).json({ 
      roast: roastText,
      success: true 
    });

  } catch (error) {
    console.error("❌ Error:", error.message);
    return res.status(500).json({ 
      error: 'Failed to generate roast',
      details: error.message 
    });
  }
}
