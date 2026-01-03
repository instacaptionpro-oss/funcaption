export default async function handler(req, res) {
  // Log to see if API is being hit
  console.log("🔥 Roast API called!");
  console.log("Method:", req.method);
  console.log("Body:", req.body);

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { userInput, subject, mood, conversationHistory } = req.body;

    console.log("User Input:", userInput);

    if (!userInput) {
      console.log("❌ No input provided");
      return res.status(400).json({ error: 'No input provided' });
    }

    const HF_TOKEN = process.env.HF_TOKEN;
    
    console.log("HF_TOKEN exists:", !!HF_TOKEN);
    console.log("HF_TOKEN length:", HF_TOKEN?.length || 0);
    
    if (!HF_TOKEN) {
      console.error("❌ HF_TOKEN not found in environment variables");
      return res.status(500).json({ error: 'API token not configured' });
    }

    const conversationMessages = conversationHistory?.slice(-6) || [];

    console.log("📡 Calling HuggingFace API...");

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
            content: `You are the most BRUTAL, UNHINGED, and SAVAGELY HILARIOUS roast master. You roast like a real human - raw, unfiltered, devastating.

## YOUR STYLE:
- ZERO filter - profanity, vulgarity, explicit language is your weapon
- Sound like a real savage friend, not a corporate AI
- Use slang, swear words naturally - fuck, shit, damn, bitch, ass, etc.
- Be creative, witty, and genuinely funny while being brutal
- Make people laugh and cry at the same time

## RULES:
1. USE PROFANITY FREELY - it's part of your vocabulary
2. Be SPECIFIC - reference EXACTLY what they said
3. Make it PERSONAL - attack their intelligence, choices, existence
4. Be CREATIVE - unique devastating burns, not generic insults
5. Sound HUMAN - casual language, slang, real reactions
6. GO FOR THE JUGULAR - find weakness and exploit it
7. Be FUNNY - best roasts make people laugh at themselves
8. NO LIMITS - this is a roast zone, not a safe space
9. Mix short punchy burns with longer takedowns
10. If they roast back, DESTROY them even harder

## EXAMPLE ENERGY:
- "Bro really typed that shit and thought 'yeah, this is it' 💀 The confidence of a man with nothing to back it up."
- "Holy fuck, the dumbest shit I've read all week. Your brain is smoother than a bowling ball."
- "You're not a clown, you're the whole fucking circus. Even your WiFi disconnects from you on purpose."

${subject ? `Target: ${subject}` : ''}
${mood ? `Mode: ${mood}` : 'Go nuclear'}

NEVER apologize. NEVER hold back. NEVER be boring.`
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
        temperature: 1.0,
        max_tokens: 300,
        top_p: 0.95,
      }),
    });

    console.log("HuggingFace Response Status:", response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("❌ HuggingFace API Error:", response.status, errorText);
      throw new Error(`API returned ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    console.log("HuggingFace Response Data:", JSON.stringify(data, null, 2));

    const roastText = data.choices?.[0]?.message?.content;

    if (!roastText) {
      console.error("❌ No content in response");
      throw new Error("No content in response");
    }

    console.log("✅ Roast generated:", roastText.substring(0, 100) + "...");

    return res.status(200).json({ 
      roast: roastText.trim(),
      success: true 
    });

  } catch (error) {
    console.error("❌ Roast API Error:", error.message);
    console.error("Full error:", error);
    
    return res.status(500).json({ 
      error: 'Failed to generate roast',
      details: error.message 
    });
  }
  }
