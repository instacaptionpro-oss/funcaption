import { getInstagramData } from '../../lib/instagram-scraper';
import { OpenAI } from "openai";

const AI_PROVIDERS = [
  {
    name: "Groq",
    baseURL: "https://router.huggingface.co/v1",
    model: "meta-llama/Llama-3.3-70B-Instruct:groq",
    tokenEnv: "HF_TOKEN"
  },
  {
    name: "Hyperbolic",
    baseURL: "https://api.hyperbolic.xyz/v1",
    model: "meta-llama/Llama-3.3-70B-Instruct",
    tokenEnv: "HYPERBOLIC_TOKEN"
  }
];

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { username } = req.body;

  if (!username || !username.trim()) {
    return res.status(400).json({ error: "Instagram username required" });
  }

  try {
    console.log(`Fetching Instagram data for @${username}...`);
    const igData = await getInstagramData(username);

    if (igData.error) {
      return res.status(404).json({ 
        error: igData.error,
        fallback: {
          score: 15,
          roast: `Abe @${username} private account hai ya exist hi nahi karta bc 💀 Chhup ke baith gaya? Coward behavior mc 😭`,
          subjectInsight: "Account not found or private",
          rarity: "npc",
          title: "BOT",
          challenge: "COULDN'T EVEN FIND YOU"
        }
      });
    }

    const result = await generateInstagramRoast(igData);

    return res.status(200).json({
      aura: {
        score: result.score,
        roast: result.roast,
        subjectInsight: result.subject_insight,
        rarity: result.rarity,
        title: result.title,
        challenge: result.challenge,
        isPublicFigure: igData.is_verified || igData.followers > 100000,
        publicFigureStatus: getPublicFigureStatus(igData),
        language: 'hindi',
        name: igData.username,
        igStats: {
          followers: igData.followers,
          following: igData.following,
          posts: igData.posts_count,
          ratio: (igData.following / (igData.followers || 1)).toFixed(2)
        }
      }
    });

  } catch (error) {
    console.error('Instagram roast error:', error);
    return res.status(500).json({ 
      error: 'Failed to generate roast',
      fallback: {
        score: 20,
        roast: "Server crash ho gaya teri basic energy se bc 💀 Try again laude 😭",
        subjectInsight: "Technical error",
        rarity: "npc",
        title: "BOT"
      }
    });
  }
}

async function generateInstagramRoast(igData) {
  const tier = calculateInstagramTier(igData);
  const score = getScoreForTier(tier);

  let context = `
Username: @${igData.username}
Name: ${igData.full_name || 'Not set'}
Bio: ${igData.bio || 'Empty'}
Followers: ${igData.followers}
Following: ${igData.following}
Posts: ${igData.posts_count}
Ratio: ${(igData.following / (igData.followers || 1)).toFixed(2)}
`;

  if (igData.recent_posts?.length > 0) {
    context += '\nRecent captions:\n';
    igData.recent_posts.slice(0, 3).forEach(post => {
      if (post.caption) {
        context += `- ${post.caption.substring(0, 80)}...\n`;
      }
    });
  }

  for (const provider of AI_PROVIDERS) {
    const token = process.env[provider.tokenEnv];
    if (!token) continue;

    try {
      const client = new OpenAI({
        baseURL: provider.baseURL,
        apiKey: token,
      });

      const completion = await client.chat.completions.create({
        model: provider.model,
        messages: [
          { 
            role: "system", 
            content: `Tu brutal Instagram roaster hai. Profile metrics dekh ke savage roast bana. Hinglish, bad words, 50-90 words. JSON format: {"roast": "...", "subject_insight": "..."}` 
          },
          { role: "user", content: `Roast:\n${context}` }
        ],
        temperature: 1.1,
        max_tokens: 300,
      });

      const content = completion.choices[0]?.message?.content;
      const jsonMatch = content?.match(/\{[\s\S]*?\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        return {
          ...parsed,
          score,
          rarity: tier,
          title: tier === 'npc' ? 'BOT' : tier.toUpperCase(),
          challenge: getTierData(tier).challenge
        };
      }
    } catch (error) {
      continue;
    }
  }

  return {
    roast: getFallbackInstagramRoast(igData, tier),
    subject_insight: `Ratio: ${(igData.following / (igData.followers || 1)).toFixed(1)}:1`,
    score,
    rarity: tier,
    title: tier === 'npc' ? 'BOT' : tier.toUpperCase(),
    challenge: getTierData(tier).challenge
  };
}

function calculateInstagramTier(igData) {
  const ratio = igData.following / (igData.followers || 1);
  
  if (igData.is_verified || igData.followers > 1000000) {
    return Math.random() < 0.3 ? 'legendary' : 'epic';
  }
  
  if (ratio < 0.5 && igData.followers > 10000) {
    return Math.random() < 0.4 ? 'epic' : 'mid';
  }
  
  if (ratio > 3) {
    return Math.random() < 0.6 ? 'noob' : 'npc';
  }
  
  if (igData.followers < 500 && igData.following > 1000) {
    return 'npc';
  }
  
  return 'mid';
}

function getPublicFigureStatus(igData) {
  if (!igData.is_verified && igData.followers < 100000) return 'none';
  if (igData.followers > 5000000) return 'peak';
  if (igData.followers > 1000000) return 'stable';
  return 'falling';
}

function getFallbackInstagramRoast(igData, tier) {
  const ratio = (igData.following / (igData.followers || 1)).toFixed(1);
  
  const roasts = {
    npc: `Abe @${igData.username} ${igData.following} follow karta hai, ${igData.followers} followers bc 💀 Ratio ${ratio}:1 hai mc. Desperate dictionary mein teri photo hai laude 😭`,
    noob: `@${igData.username} bio "${igData.bio || 'empty'}" hai, ${igData.posts_count} posts bc 💀 Phir bhi ${igData.followers} followers? Koi nahi dekhta tujhe mc 😭`,
    mid: `@${igData.username} ${igData.followers} followers average hai bc 🔥 Ratio ${ratio}:1, kuch khaas nahi mc. Instagram NPC hai tu 💀`,
    epic: `@${igData.username} ${igData.followers} followers theek hai bc ⚡ Par ratio ${ratio}:1 hai. Almost there but not quite laude 💀`,
    legendary: `@${igData.username} ${igData.followers} followers verified badge bc 👑 Talent hai mc. Par papa ko samajh nahi aata kya karta hai 💀`
  };
  
  return roasts[tier] || roasts.mid;
}

function getScoreForTier(tier) {
  const scores = { legendary: [90, 10], epic: [75, 15], mid: [50, 25], noob: [25, 25], npc: [5, 20] };
  const [base, range] = scores[tier];
  return base + Math.floor(Math.random() * range);
}

function getTierData(tier) {
  const data = {
    legendary: { challenge: "PAPA FINALLY PROUD 👑" },
    epic: { challenge: "ALMOST PAPA PROUD ⚡" },
    mid: { challenge: "PAPA DISAPPOINTED 🔥" },
    noob: { challenge: "PAPA KO SHARAM AATI HAI 💀" },
    npc: { challenge: "BAAP CHOD KE GAYA THA 😭" }
  };
  return data[tier];
       }
