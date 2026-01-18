const instaTouch = require('instatouch');

async function getInstagramData(username) {
    try {
        const cleanUsername = username.replace('@', '').trim();
        
        const profile = await instaTouch.getUserProfileInfo(cleanUsername);
        const userData = profile.collector[0];
        
        const data = {
            username: userData.username,
            full_name: userData.fullName,
            bio: userData.biography,
            followers: userData.followers,
            following: userData.following,
            posts_count: userData.postsCount,
            is_private: userData.private,
            is_verified: userData.verified,
            profile_pic: userData.profilePicUrl,
        };
        
        if (!userData.private) {
            try {
                const posts = await instaTouch.getUserProfilePosts(cleanUsername, {
                    count: 9
                });
                
                data.recent_posts = posts.collector.map(post => ({
                    caption: post.caption || '',
                    likes: post.likes,
                }));
            } catch (e) {
                data.recent_posts = [];
            }
        }
        
        return data;
        
    } catch (error) {
        console.error('Instagram fetch error:', error.message);
        return { error: `Could not fetch @${username}` };
    }
}

module.exports = { getInstagramData };
