const HF_MODEL = process.env.HUGGINGFACE_MODEL || 'bigscience/bloom-560m';
const HF_API_KEY = process.env.HUGGINGFACE_API_KEY;

async function callHuggingFace(prompt, retries = 2, backoff = 500) {
  const url = `https://api-inference.huggingface.co/models/${HF_MODEL}`;
  
  const headers = {
    'Content-Type': 'application/json'
  };
  
  if (HF_API_KEY) {
    headers['Authorization'] = `Bearer ${HF_API_KEY}`;
  }
  
  const body = JSON.stringify({
    inputs: prompt,
    parameters: { 
      max_new_tokens: 120, 
      temperature: 0.8 
    }
  });
  
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout
    
    const response = await fetch(url, {
      method: 'POST',
      headers,
      body,
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${await response.text()}`);
    }
    
    const data = await response.json();
    return data[0]?.generated_text || '';
  } catch (error) {
    if (retries > 0) {
      await new Promise(resolve => setTimeout(resolve, backoff));
      return callHuggingFace(prompt, retries - 1, backoff * 2);
    }
    throw error;
  }
}

module.exports = { callHuggingFace };
