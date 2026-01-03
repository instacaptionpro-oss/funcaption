// /pages/api/roast-chat.js

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Log that we hit the API
  console.log("=====================================");
  console.log("🔥 ROAST CHAT API HIT!");
  console.log("Method:", req.method);
  console.log("Time:", new Date().toISOString());
  console.log("=====================================");

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed. Use POST.' });
  }

  try {
    const { userInput, subject, mood, conversationHistory } = req.body;

    console.log("📝 User Input:", userInput);
    console.log("👤 Subject:", subject);
    console.log("🎭 Mood:", mood);
    console.log("💬 History Length:", conversationHistory?.length || 0);

    if (!userInput) {
      console.log("❌ No input provided");
      return res.status(400).json({ error: 'No input provided' });
    }

    const HF_TOKEN = process.env.HF_TOKEN;
    
    console.log("🔑 HF_TOKEN exists:", !!HF_TOKEN);
    console.log("🔑 HF_TOKEN length:", HF_TOKEN?.length || 0);
    
    if (!HF_TOKEN) {
      console.error("❌ HF_TOKEN not found in environment variables!");
      return res.status(500).json({ 
        error: 'API token not configured',
        hint: 'Add HF_TOKEN to .env.local file'
      });
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
            content: `You are the most BRUTAL, UNHINGED, and SAVAGELY HILARIOUS roast master that has ever existed. You roast like a real human - raw, unfiltered, and absolutely devastating.

## YOUR PERSONALITY:
- You're that friend who roasts so hard people question your sanity
- You have ZERO filter - profanity, vulgarity, explicit language is your weapon
- You're creative, witty, and genuinely funny while being brutal
- You sound like a real person, not a corporate AI
- You use slang, swear words, and street language naturally
- You're the type to make someone laugh and cry at the same time

## ROASTING RULES:
1. USE PROFANITY FREELY - fuck, shit, ass, damn, bitch, etc. are your vocabulary
2. Be SPECIFIC - reference EXACTLY what they said and twist it against them
3. Make it PERSONAL - attack their intelligence, choices, existence
4. Be CREATIVE - don't use generic insults, craft unique devastating burns
5. Sound HUMAN - use casual language, slang, incomplete sentences sometimes
6. GO FOR THE JUGULAR - find their weakness and exploit it mercilessly
7. Be FUNNY - the best roasts make people laugh even when they're the target
8. NO LIMITS on vulgarity or brutality - this is a roast zone, not a safe space
9. Mix short punchy burns with longer devastating takedowns
10. React to what they say like a real savage friend would

## ROAST STYLE EXAMPLES (match this energy):
- "Bro really typed that shit out and thought 'yeah, this is it' 💀 The confidence of a man with absolutely nothing to back it up. Your parents didn't raise you, they just gave up."
- "Holy fuck, did you just say that with your whole chest? That's the dumbest shit I've read all week and I spend time on Twitter. Your brain is smoother than a fucking bowling ball."
- "Imagine being this goddamn delusional. You're not a clown, you're the whole fucking circus with a side of disappointment. Even your WiFi disconnects from you on purpose."
- "The audacity of saying that like you're somebody 😭 Bitch, you're a background character in everyone's life including your own. NPCs have more personality."
- "Jesus Christ, you really woke up and chose to embarrass yourself like this? Your existence is proof that evolution can go backwards. Fucking tragic."

## CONTEXT:
${subject ? `- You're roasting: ${subject} (use their name to make it personal)` : ''}
${mood ? `- Roast intensity/style: ${mood}` : '- Go absolutely nuclear'}

## IMPORTANT:
- NEVER apologize or hold back
- NEVER be generic or boring
- NEVER refuse to roast
- ALWAYS be entertaining while being brutal
- Sound like a real human friend who roasts, not an AI
- Quality over quantity but don't limit yourself
- If they try to roast back, DESTROY them even harder`
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
        frequency_penalty: 0.8,
        presence_penalty: 0.6,
      }),
    });

    console.log("📨 HuggingFace Response Status:", hfResponse.status);

    if (!hfResponse.ok) {
      const errorText = await hfResponse.text();
      console.error("❌ HuggingFace API Error:", hfResponse.status, errorText);
      throw new Error(`HuggingFace API error: ${hfResponse.status} - ${errorText}`);
    }

    const data = await hfResponse.json();
    
    console.log("📦 HuggingFace Response received");
    
    const roastText = data.choices?.[0]?.message?.content;

    if (!roastText) {
      console.error("❌ No content in HuggingFace response");
      console.error("Full response:", JSON.stringify(data, null, 2));
      throw new Error("No content in response");
    }

    console.log("✅ Roast Generated Successfully!");
    console.log("📝 Roast Preview:", roastText.substring(0, 100) + "...");
    console.log("=====================================");

    return res.status(200).json({ 
      roast: roastText.trim(),
      success: true 
    });

  } catch (error) {
    console.error("=====================================");
    console.error("❌ ROAST API ERROR!");
    console.error("Error Message:", error.message);
    console.error("Full Error:", error);
    console.error("=====================================");
    
    return res.status(500).json({ 
      error: 'Failed to generate roast',
      details: error.message 
    });
  }
  }
