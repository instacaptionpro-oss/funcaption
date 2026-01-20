// components/LiveLeaderboard.js

import { useState, useEffect } from 'react';

export default function LiveLeaderboard({ userCollege }) {
  const [leaderboard, setLeaderboard] = useState([]);
  const [isShuffling, setIsShuffling] = useState(false);

  // College pool with tiers for realistic shuffling
  const collegePool = [
    // Top tier - compete for #1-3
    { name: 'IIT Bombay', tier: 'top', emoji: '👑', baseScore: 85 },
    { name: 'IIT Delhi', tier: 'top', emoji: '🏆', baseScore: 84 },
    { name: 'IIT Madras', tier: 'top', emoji: '⚡', baseScore: 83 },
    
    // Upper tier - positions 4-7
    { name: 'BITS Pilani', tier: 'upper', emoji: '🎯', baseScore: 78 },
    { name: 'IIT Kanpur', tier: 'upper', emoji: '🚀', baseScore: 77 },
    { name: 'IIT Kharagpur', tier: 'upper', emoji: '🔥', baseScore: 76 },
    { name: 'IIIT Hyderabad', tier: 'upper', emoji: '💻', baseScore: 75 },
    
    // Mid tier - positions 8-12
    { name: 'NIT Trichy', tier: 'mid', emoji: '⭐', baseScore: 72 },
    { name: 'IIT Roorkee', tier: 'mid', emoji: '🎓', baseScore: 71 },
    { name: 'DTU Delhi', tier: 'mid', emoji: '🏛️', baseScore: 70 },
    { name: 'NSUT Delhi', tier: 'mid', emoji: '📚', baseScore: 69 },
    { name: 'NIT Surathkal', tier: 'mid', emoji: '🌊', baseScore: 68 },
    
    // Lower tier - positions 13-20
    { name: 'VIT Vellore', tier: 'lower', emoji: '🌟', baseScore: 65 },
    { name: 'Manipal MIT', tier: 'lower', emoji: '🎨', baseScore: 64 },
    { name: 'IIIT Bangalore', tier: 'lower', emoji: '💡', baseScore: 63 },
    { name: 'NIT Warangal', tier: 'lower', emoji: '⚙️', baseScore: 62 },
    { name: 'COEP Pune', tier: 'lower', emoji: '🔧', baseScore: 61 },
    { name: 'PES Bangalore', tier: 'lower', emoji: '🎪', baseScore: 60 },
    { name: 'SRM Chennai', tier: 'lower', emoji: '🌈', baseScore: 59 },
    { name: 'Amity Noida', tier: 'lower', emoji: '🎭', baseScore: 58 }
  ];

  // Generate shuffled leaderboard with realistic variance
  const generateLeaderboard = () => {
    const shuffled = [...collegePool];
    
    // Shuffle within tiers for realism
    const topTier = shuffled.filter(c => c.tier === 'top').sort(() => Math.random() - 0.5);
    const upperTier = shuffled.filter(c => c.tier === 'upper').sort(() => Math.random() - 0.5);
    const midTier = shuffled.filter(c => c.tier === 'mid').sort(() => Math.random() - 0.5);
    const lowerTier = shuffled.filter(c => c.tier === 'lower').sort(() => Math.random() - 0.5);
    
    // Combine tiers
    const combined = [...topTier, ...upperTier, ...midTier, ...lowerTier];
    
    // Take top 10 and add realistic data
    return combined.slice(0, 10).map((college, index) => {
      // Add variance to scores
      const scoreVariance = Math.floor(Math.random() * 8) - 4; // -4 to +4
      const avgScore = Math.max(55, Math.min(95, college.baseScore + scoreVariance));
      
      // Generate realistic roast counts
      const baseRoasts = (10 - index) * 200 + Math.floor(Math.random() * 500);
      const totalRoasts = baseRoasts + Math.floor(Math.random() * 1000);
      
      // Trending indicator
      const trendChance = Math.random();
      let trend = null;
      if (trendChance > 0.7) trend = 'up';
      else if (trendChance < 0.3) trend = 'down';
      
      return {
        rank: index + 1,
        college: college.name,
        emoji: college.emoji,
        avgScore: avgScore,
        totalRoasts: totalRoasts,
        trend: trend,
        previousRank: index + 1 + (Math.random() > 0.5 ? 1 : -1) * Math.floor(Math.random() * 3)
      };
    });
  };

  // Initialize leaderboard
  useEffect(() => {
    setLeaderboard(generateLeaderboard());
  }, []);

  // Live shuffling every 8 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setIsShuffling(true);
      
      setTimeout(() => {
        setLeaderboard(generateLeaderboard());
        setIsShuffling(false);
      }, 500);
    }, 8000); // Shuffle every 8 seconds

    return () => clearInterval(interval);
  }, []);

  // Get rank change indicator
  const getRankChange = (current, previous) => {
    const diff = previous - current;
    if (diff > 0) return { icon: '📈', color: '#00FF00', text: `+${diff}` };
    if (diff < 0) return { icon: '📉', color: '#FF4444', text: `${diff}` };
    return { icon: '➖', color: '#666', text: '0' };
  };

  return (
    <div style={{
      background: '#0a0a0a',
      border: '1px solid #222',
      borderRadius: '20px',
      padding: '25px',
      marginBottom: '20px',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Live indicator */}
      <div style={{
        position: 'absolute',
        top: '20px',
        right: '20px',
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        fontSize: '0.75rem',
        color: '#00FF00',
        fontWeight: '700'
      }}>
        <div style={{
          width: '8px',
          height: '8px',
          borderRadius: '50%',
          background: '#00FF00',
          animation: 'pulse 2s infinite'
        }} />
        LIVE
      </div>

      {/* Header */}
      <h3 style={{
        color: '#FFD700',
        marginBottom: '8px',
        fontSize: '1.5rem',
        fontWeight: '900',
        display: 'flex',
        alignItems: 'center',
        gap: '10px'
      }}>
        🏆 Live Rankings
      </h3>
      <p style={{
        color: '#666',
        fontSize: '0.75rem',
        marginBottom: '20px',
        fontWeight: '600'
      }}>
        Updates every 8 seconds • {leaderboard.reduce((sum, c) => sum + c.totalRoasts, 0).toLocaleString()} total roasts
      </p>

      {/* Leaderboard */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        opacity: isShuffling ? 0.5 : 1,
        transition: 'opacity 0.3s ease'
      }}>
        {leaderboard.map((item) => {
          const rankChange = getRankChange(item.rank, item.previousRank);
          
          return (
            <div
              key={item.college}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '15px',
                background: item.college === userCollege ? 
                  'rgba(0, 255, 255, 0.1)' : 
                  item.rank <= 3 ? 'rgba(255, 215, 0, 0.05)' : '#000',
                border: item.college === userCollege ? 
                  '2px solid #00FFFF' : 
                  item.rank <= 3 ? '1px solid rgba(255, 215, 0, 0.3)' : '1px solid #222',
                borderRadius: '12px',
                transition: 'all 0.3s ease',
                animation: 'slideIn 0.5s ease',
                position: 'relative'
              }}
            >
              {/* Rank badge */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                flex: 1
              }}>
                <div style={{
                  minWidth: '40px',
                  height: '40px',
                  borderRadius: '10px',
                  background: item.rank === 1 ? 'linear-gradient(135deg, #FFD700, #FFA500)' :
                             item.rank === 2 ? 'linear-gradient(135deg, #C0C0C0, #808080)' :
                             item.rank === 3 ? 'linear-gradient(135deg, #CD7F32, #8B4513)' :
                             '#1a1a1a',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: '900',
                  fontSize: '1rem',
                  color: item.rank <= 3 ? '#000' : '#fff',
                  boxShadow: item.rank <= 3 ? '0 4px 12px rgba(255, 215, 0, 0.3)' : 'none'
                }}>
                  #{item.rank}
                </div>
                
                <div style={{ flex: 1 }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    marginBottom: '4px'
                  }}>
                    <span style={{ fontSize: '1.1rem' }}>{item.emoji}</span>
                    <div style={{
                      color: item.college === userCollege ? '#00FFFF' : '#fff',
                      fontWeight: '700',
                      fontSize: '0.95rem'
                    }}>
                      {item.college}
                    </div>
                    {item.college === userCollege && (
                      <span style={{
                        fontSize: '0.65rem',
                        background: '#00FFFF',
                        color: '#000',
                        padding: '2px 8px',
                        borderRadius: '10px',
                        fontWeight: '800'
                      }}>
                        YOU
                      </span>
                    )}
                  </div>
                  
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    fontSize: '0.75rem'
                  }}>
                    <span style={{ color: '#666' }}>
                      {item.totalRoasts.toLocaleString()} battles
                    </span>
                    {item.trend && (
                      <span style={{
                        color: item.trend === 'up' ? '#00FF00' : '#FF4444',
                        fontWeight: '700'
                      }}>
                        {item.trend === 'up' ? '🔥 HOT' : '❄️ COLD'}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Score and rank change */}
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-end',
                gap: '4px'
              }}>
                <div style={{
                  color: '#00FFFF',
                  fontWeight: '800',
                  fontSize: '1.3rem',
                  fontFamily: 'monospace'
                }}>
                  {item.avgScore}
                </div>
                <div style={{
                  fontSize: '0.7rem',
                  color: rankChange.color,
                  fontWeight: '700',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '3px'
                }}>
                  {rankChange.icon} {rankChange.text}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer CTA */}
      <div style={{
        marginTop: '20px',
        padding: '15px',
        background: 'linear-gradient(135deg, rgba(0, 255, 255, 0.1), rgba(0, 255, 255, 0.05))',
        borderRadius: '12px',
        border: '1px dashed #00FFFF40',
        textAlign: 'center'
      }}>
        <div style={{
          fontSize: '0.75rem',
          color: '#00FFFF',
          marginBottom: '6px',
          fontWeight: '700'
        }}>
          💡 Climb the Rankings
        </div>
        <div style={{
          fontSize: '0.7rem',
          color: '#666'
        }}>
          More battles = Higher rank for your college
        </div>
      </div>

      {/* Animations */}
      <style jsx>{`
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
            transform: scale(1);
          }
          50% {
            opacity: 0.5;
            transform: scale(1.2);
          }
        }

        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(-10px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>
    </div>
  );
        }
