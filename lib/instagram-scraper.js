async function getInstagramData(username) {
  try {
    const cleanUsername = username.replace('@', '').trim();
    
    // Fetch Instagram profile page
    const url = `https://www.instagram.com/${cleanUsername}/?__a=1&__d=dis`;
    
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': '*/*',
        'Accept-Language': 'en-US,en;q=0.9',
        'Sec-Fetch-Dest': 'empty',
        'Sec-Fetch-Mode': 'cors',
        'Sec-Fetch-Site': 'same-origin',
        'X-Requested-With': 'XMLHttpRequest',
      }
    });

    if (!response.ok) {
      // Fallback: Parse HTML
      return await scrapeFromHTML(cleanUsername);
    }

    const data = await response.json();
    const user = data.graphql?.user || data.user;

    if (!user) {
      throw new Error('User not found');
    }

    return {
      username: user.username,
      full_name: user.full_name || '',
      bio: user.biography || '',
      followers: user.edge_followed_by?.count || 0,
      following: user.edge_follow?.count || 0,
      posts_count: user.edge_owner_to_timeline_media?.count || 0,
      is_private: user.is_private || false,
      is_verified: user.is_verified || false,
      profile_pic: user.profile_pic_url_hd || user.profile_pic_url || '',
      recent_posts: extractPosts(user)
    };

  } catch (error) {
    console.error('Instagram fetch error:', error);
    return { error: `Could not fetch @${username}` };
  }
}

async function scrapeFromHTML(username) {
  try {
    const url = `https://www.instagram.com/${username}/`;
    
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
      }
    });

    const html = await response.text();

    // Extract data using regex
    const followersMatch = html.match(/"edge_followed_by":{"count":(\d+)}/);
    const followingMatch = html.match(/"edge_follow":{"count":(\d+)}/);
    const postsMatch = html.match(/"edge_owner_to_timeline_media":{"count":(\d+)}/);
    const bioMatch = html.match(/"biography":"([^"]*)"/);
    const nameMatch = html.match(/"full_name":"([^"]*)"/);
    const verifiedMatch = html.match(/"is_verified":(true|false)/);
    const privateMatch = html.match(/"is_private":(true|false)/);

    if (!followersMatch) {
      throw new Error('Could not extract data');
    }

    return {
      username: username,
      full_name: nameMatch ? nameMatch[1] : username,
      bio: bioMatch ? bioMatch[1].replace(/\\n/g, ' ').replace(/\\u[\dA-F]{4}/gi, '') : '',
      followers: parseInt(followersMatch[1]),
      following: followingMatch ? parseInt(followingMatch[1]) : 0,
      posts_count: postsMatch ? parseInt(postsMatch[1]) : 0,
      is_private: privateMatch ? privateMatch[1] === 'true' : false,
      is_verified: verifiedMatch ? verifiedMatch[1] === 'true' : false,
      profile_pic: '',
      recent_posts: []
    };

  } catch (error) {
    throw error;
  }
}

function extractPosts(user) {
  if (user.is_private || !user.edge_owner_to_timeline_media?.edges) {
    return [];
  }

  return user.edge_owner_to_timeline_media.edges
    .slice(0, 9)
    .map(edge => ({
      caption: edge.node.edge_media_to_caption?.edges[0]?.node?.text || '',
      likes: edge.node.edge_liked_by?.count || 0,
      comments: edge.node.edge_media_to_comment?.count || 0,
    }));
}

module.exports = { getInstagramData };
