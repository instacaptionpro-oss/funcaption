// lib/hf-client.js
export async function getPremiumCaption({ subject, mood, region }) {
  const token = process.env.HF_TOKEN;
  if (!token) return null;

  try {
    const prompt = `Write 1 deep, modern, emotional Instagram caption.
Subject: ${subject}
Mood: ${mood}
Region: ${region || 'none'}

Rules:
- 2 to 3 lines (short)
- Do NOT repeat user inputs verbatim
- Add relevant stylish hashtags
- Make it viral-ready and shareable.`;

    const res = await fetch('https://api-inference.huggingface.co/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': Bearer ${token}
      },
      body: JSON.stringify({
        model: 'Qwen/Qwen2.5-7B-Instruct',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 160,
        temperature: 0.7
      })
    });

    if (!res.ok) {
      // non-200 -> bail
      console.warn('HF non-ok', res.status);
      return null;
    }

    const data = await res.json();
    // chat response path (choices[0].message.content)
    const text = data?.choices?.[0]?.message?.content ?? null;
    if (!text || text.length < 8) return null;

    // sanitize minimal: trim and return
    return String(text).trim();
  } catch (err) {
    console.error('HF error', err);
    return null;
  }
}
