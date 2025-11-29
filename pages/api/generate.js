import { rateLimitByIP } from '../../lib/rate-limit';
import { getCachedResponse, setCachedResponse } from '../../lib/cache';
import { generateWithHF, generateFallbackCaptions } from '../../lib/caption-generator';

const CACHE_TTL_SECONDS = parseInt(process.env.CACHE_TTL_SECONDS) || 86400;
const RATE_LIMIT_PER_IP_PER_MIN = parseInt(process.env.RATE_LIMIT_PER_IP_PER_MIN) || 10;

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { subject, mood, region = 'none' } = req.body;

  if (!subject || !mood) {
    return res.status(400).json({ error: 'Subject and mood required' });
  }

  // Rate limiting
  const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  const isAllowed = rateLimitByIP(ip, RATE_LIMIT_PER_IP_PER_MIN);
  if (!isAllowed) {
    return res.status(429).json({ 
      error: "rate_limited", 
      retry_after: 60 
    });
  }

  // Cache key
  const cacheKey = `variants:${require('crypto').createHash('sha256')
    .update(${subject}|${mood}|${region})
    .digest('hex')}`;

  // Check cache
  const cached = getCachedResponse(cacheKey);
  if (cached) {
    return res.status(200).json({
      variants: cached,
      meta: { source: cached.meta?.source || 'cache', cached: true }
    });
  }

  try {
    // Generate with HuggingFace (1 premium-style caption)
    const hfResult = await generateWithHF(subject, mood, region);
    
    if (hfResult.success) {
      const variants = [
        { 
          caption: hfResult.captions[0] + "\n\n💎 PREMIUM STYLE - FREE ACCESS\n\nFollow @instaalgohacker", 
          type: "premium-free" 
        },
        { 
          caption: generateFallbackCaptions(subject, mood, region)[0] + "\n\n🌟 BASIC STYLE\n\nFollow @instaalgohacker", 
          type: "free" 
        },
        { 
          caption: generateFallbackCaptions(subject, mood, region)[1] + "\n\n🌟 BASIC STYLE\n\nFollow @instaalgohacker", 
          type: "free" 
        }
      ];
      
      // Cache result
      setCachedResponse(cacheKey, variants, CACHE_TTL_SECONDS);
      
      return res.status(200).json({
        variants,
        meta: { source: "huggingface", cached: false }
      });
    } else {
      // Fallback to local generation (all free)
      const fallbackVariants = generateFallbackCaptions(subject, mood, region);
      const variants = [
        { 
          caption: fallbackVariants[0] + "\n\n🌟 BASIC STYLE\n\nFollow @instaalgohacker", 
          type: "free" 
        },
        { 
          caption: fallbackVariants[1] + "\n\n🌟 BASIC STYLE\n\nFollow @instaalgohacker", 
          type: "free" 
        },
        { 
          caption: "💎 PREMIUM STYLE - Try again for premium caption\n\nFollow @instaalgohacker", 
          type: "premium-preview" 
        }
      ];
      
      // Cache result
      setCachedResponse(cacheKey, variants, CACHE_TTL_SECONDS);
      
      return res.status(200).json({
        variants,
        meta: { source: "fallback", cached: false }
      });
    }
  } catch (error) {
    console.error('Generation error:', error);
    
    // Fallback to local generation
    const fallbackVariants = generateFallbackCaptions(subject, mood, region);
    const variants = [
      { 
        caption: fallbackVariants[0] + "\n\n🌟 BASIC STYLE\n\nFollow @instaalgohacker", 
        type: "free" 
      },
      { 
        caption: fallbackVariants[1] + "\n\n🌟 BASIC STYLE\n\nFollow @instaalgohacker", 
        type: "free" 
      },
      { 
        caption: "💎 PREMIUM STYLE - Try again for premium caption\n\nFollow @instaalgohacker", 
        type: "premium-preview" 
      }
    ];
    
    // Cache result
    setCachedResponse(cacheKey, variants, CACHE_TTL_SECONDS);
    
    return res.status(200).json({
      variants,
      meta: { source: "fallback", cached: false }
    });
  }
}
