const { callHuggingFace } = require('./hf-client');
const { generateFallbackCaptions } = require('./fallbacks');

async function generateWithHF(subject, mood, region) {
  const prompt = `You are a premium Instagram caption writer. Create ONE high-quality, emotionally impactful caption with:
- 2-3 short lines
- 4-7 niche hashtags
- Regional touch if region != 'none'

Subject: ${subject}
Mood: ${mood}
Region: ${region}

Output ONLY the caption with hashtags. No explanations.`;

  try {
    const response = await callHuggingFace(prompt);
    
    if (!response) {
      return { success: false };
    }
    
    return { 
      success: true, 
      captions: [response.trim()] 
    };
  } catch (error) {
    console.error('HF generation error:', error);
    return { success: false };
  }
}

module.exports = { generateWithHF, generateFallbackCaptions };
