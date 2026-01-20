// components/LiveLeaderboard.js

import { useState, useEffect } from 'react';
import { subscribeToLeaderboard, subscribeToLiveStats, getCompetitionStatus, COMPETITION } from '../lib/firebase';

export default function LiveLeaderboard() {
  const [leaderboard, setLeaderboard] = useState([]);
  const [stats, setStats] = useState({ totalBattles: 0, liveUsers: 0 });
  const [compStatus, setCompStatus] = useState(getCompetitionStatus());
  const [timeLeft, setTimeLeft] = useState('');

  useEffect(() => {
    // Subscribe to real-time leaderboard
    const unsubLeaderboard = subscribeToLeaderboard((data) => {
      setLeaderboard(data);
    });

    // Subscribe to live stats
    const unsubStats = subscribeToLiveStats((data) => {
      setStats(data);
    });

    // Update competition status every second
    const timer = setInterval(() => {
      const status = getCompetitionStatus();
      setCompStatus(status);
      
      if (status.timeLeft > 0) {
        const days = Math.floor(status.timeLeft / (1000 * 60 * 60 * 24));
        const hours = Math.floor((status.timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const mins = Math.floor((status.timeLeft % (1000 * 60 * 60)) / (1000 * 60));
        const secs = Math.floor((status.timeLeft % (1000 * 60)) / 1000);
        
        setTimeLeft(`${days}d ${hours}h ${mins}m ${secs}s`);
      }
    }, 1000);

    return () => {
      unsubLeaderboard();
      unsubStats();
      clearInterval(timer);
    };
  }, []);

  const getTeamColor = (teamName) => {
    if (teamName.includes('Bombay')) return '#00D4FF';
    if (teamName.includes('Delhi')) return '#FF4500';
    return '#FFD700';
  };

  const getTeamEmoji = (teamName) => {
    if (teamName.includes('Bombay')) return '🌊';
    if (teamName.includes('Delhi')) return '🔥';
    return '🎓';
  };

  return (
    <div style={{
      background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.95), rgba(10, 10, 20, 0.98))',
      border: '2px solid rgba(255, 255, 255, 0.1)',
      borderRadius: '20px',
      padding: '20px',
      position: 'relative',
      overflow: 'hidden'
    }}>
      
      {/* Animated Background */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'radial-gradient(circle at 50% 50%, rgba(0, 212, 255, 0.1) 0%, transparent 70%)',
        animation: 'pulse-glow 4s ease-in-out infinite',
        pointerEvents: 'none'
      }} />

      {/* Content */}
      <div style={{ position: 'relative', zIndex: 1 }}>
        
        {/* Header - COMPACT */}
        <div style={{
          textAlign: 'center',
          marginBottom: '16px',
          paddingBottom: '12px',
          borderBottom: '2px solid rgba(255, 255, 255, 0.1)'
        }}>
          <div style={{
            fontSize: '1.4rem',
            fontWeight: '900',
            background: 'linear-gradient(135deg, #00D4FF, #FF4500)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            marginBottom: '6px',
            letterSpacing: '0.5px'
          }}>
            {COMPETITION.name}
          </div>
          
          {/* Status Badge */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            background: compStatus.status === 'live' 
              ? 'rgba(239, 68, 68, 0.2)' 
              : 'rgba(255, 255, 255, 0.1)',
            border: compStatus.status === 'live'
              ? '2px solid #EF4444'
              : '1px solid rgba(255, 255, 255, 0.2)',
            borderRadius: '16px',
            padding: '4px 12px',
            marginBottom: '8px'
          }}>
            {compStatus.status === 'live' && (
              <div style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                background: '#EF4444',
                boxShadow: '0 0 8px #EF4444',
                animation: 'pulse 2s infinite'
              }} />
            )}
            <span style={{
              fontSize: '0.75rem',
              fontWeight: '700',
              color: compStatus.status === 'live' ? '#EF4444' : 'rgba(255, 255, 255, 0.7)',
              letterSpacing: '0.5px'
            }}>
              {compStatus.message}
            </span>
          </div>

          {/* Countdown - COMPACT */}
          {compStatus.status === 'live' && (
            <div style={{
              fontSize: '0.95rem',
              fontWeight: '800',
              color: '#00D4FF',
              fontFamily: 'monospace',
              marginTop: '4px'
            }}>
              ⏰ {timeLeft}
            </div>
          )}
        </div>

        {/* Live Stats - COMPACT */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '10px',
          marginBottom: '16px'
        }}>
          <div style={{
            background: 'rgba(0, 212, 255, 0.1)',
            border: '1px solid rgba(0, 212, 255, 0.3)',
            borderRadius: '10px',
            padding: '10px',
            textAlign: 'center'
          }}>
            <div style={{
              fontSize: '1.4rem',
              fontWeight: '900',
              color: '#00D4FF',
              fontFamily: 'monospace'
            }}>
              {stats.totalBattles || 0}
            </div>
            <div style={{
              fontSize: '0.65rem',
              color: 'rgba(255, 255, 255, 0.6)',
              fontWeight: '600',
              textTransform: 'uppercase',
              letterSpacing: '0.3px',
              marginTop: '2px'
            }}>
              Battles
            </div>
          </div>

          <div style={{
            background: 'rgba(34, 197, 94, 0.1)',
            border: '1px solid rgba(34, 197, 94, 0.3)',
            borderRadius: '10px',
            padding: '10px',
            textAlign: 'center'
          }}>
            <div style={{
              fontSize: '1.4rem',
              fontWeight: '900',
              color: '#22C55E',
              fontFamily: 'monospace'
            }}>
              {stats.liveUsers || 0}
            </div>
            <div style={{
              fontSize: '0.65rem',
              color: 'rgba(255, 255, 255, 0.6)',
              fontWeight: '600',
              textTransform: 'uppercase',
              letterSpacing: '0.3px',
              marginTop: '2px'
            }}>
              Live Users
            </div>
          </div>
        </div>

        {/* Leaderboard Title */}
        <div style={{
          fontSize: '1rem',
          fontWeight: '800',
          color: '#FFD700',
          textAlign: 'center',
          marginBottom: '12px',
          textTransform: 'uppercase',
          letterSpacing: '0.5px'
        }}>
          👑 Live Rankings
        </div>

        {/* Teams - COMPACT */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '12px'
        }}>
          {leaderboard.map((team, index) => {
            const teamColor = getTeamColor(team.name);
            const teamEmoji = getTeamEmoji(team.name);
            const isWinning = index === 0;
            const winRate = team.battles > 0 ? ((team.wins / team.battles) * 100).toFixed(1) : 0;

            return (
              <div
                key={team.name}
                style={{
                  background: `linear-gradient(135deg, ${teamColor}15, ${teamColor}05)`,
                  border: isWinning ? `2px solid ${teamColor}` : `1px solid ${teamColor}40`,
                  borderRadius: '12px',
                  padding: '14px',
                  position: 'relative',
                  overflow: 'hidden',
                  transform: isWinning ? 'scale(1.02)' : 'scale(1)',
                  transition: 'all 0.3s ease',
                  boxShadow: isWinning ? `0 8px 30px ${teamColor}40` : 'none'
                }}
              >
                {/* Winning Glow */}
                {isWinning && (
                  <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '100%',
                    background: `linear-gradient(45deg, transparent, ${teamColor}20, transparent)`,
                    backgroundSize: '200% 200%',
                    animation: 'shimmer 3s infinite'
                  }} />
                )}

                {/* Crown for winner */}
                {isWinning && (
                  <div style={{
                    position: 'absolute',
                    top: '8px',
                    right: '8px',
                    fontSize: '1.5rem',
                    animation: 'bounce 2s infinite'
                  }}>
                    👑
                  </div>
                )}

                <div style={{ position: 'relative', zIndex: 1 }}>
                  {/* Rank & Team Name */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    marginBottom: '12px'
                  }}>
                    <div style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '50%',
                      background: `linear-gradient(135deg, ${teamColor}, ${teamColor}cc)`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1.4rem',
                      fontWeight: '900',
                      color: '#000',
                      boxShadow: `0 0 15px ${teamColor}60`
                    }}>
                      #{index + 1}
                    </div>
                    
                    <div style={{ flex: 1 }}>
                      <div style={{
                        fontSize: '1.1rem',
                        fontWeight: '900',
                        color: teamColor,
                        marginBottom: '2px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}>
                        {teamEmoji} {team.name}
                      </div>
                      <div style={{
                        fontSize: '0.7rem',
                        color: 'rgba(255, 255, 255, 0.5)',
                        fontWeight: '600'
                      }}>
                        {team.battles} battles • {winRate}% win
                      </div>
                    </div>
                  </div>

                  {/* Score Display - COMPACT */}
                  <div style={{
                    background: 'rgba(0, 0, 0, 0.3)',
                    borderRadius: '10px',
                    padding: '12px',
                    marginBottom: '10px'
                  }}>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'baseline',
                      marginBottom: '8px'
                    }}>
                      <span style={{
                        fontSize: '0.7rem',
                        color: 'rgba(255, 255, 255, 0.6)',
                        fontWeight: '600',
                        textTransform: 'uppercase'
                      }}>
                        Total Score
                      </span>
                      <span style={{
                        fontSize: '1.8rem',
                        fontWeight: '900',
                        color: teamColor,
                        fontFamily: 'monospace',
                        textShadow: `0 0 15px ${teamColor}80`
                      }}>
                        {team.totalScore?.toLocaleString() || 0}
                      </span>
                    </div>

                    {/* Progress Bar - COMPACT */}
                    <div style={{
                      background: 'rgba(0, 0, 0, 0.5)',
                      height: '8px',
                      borderRadius: '4px',
                      overflow: 'hidden',
                      position: 'relative'
                    }}>
                      <div style={{
                        width: `${Math.min((team.totalScore / Math.max(...leaderboard.map(t => t.totalScore || 0))) * 100, 100)}%`,
                        height: '100%',
                        background: `linear-gradient(90deg, ${teamColor}, ${teamColor}cc)`,
                        borderRadius: '4px',
                        transition: 'width 1s cubic-bezier(0.34, 1.56, 0.64, 1)',
                        position: 'relative',
                        overflow: 'hidden'
                      }}>
                        <div style={{
                          position: 'absolute',
                          top: 0,
                          left: '-100%',
                          width: '100%',
                          height: '100%',
                          background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent)',
                          animation: 'slide 2s infinite'
                        }} />
                      </div>
                    </div>
                  </div>

                  {/* Stats Grid - COMPACT */}
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(2, 1fr)',
                    gap: '8px'
                  }}>
                    <div style={{
                      background: 'rgba(34, 197, 94, 0.15)',
                      border: '1px solid rgba(34, 197, 94, 0.3)',
                      borderRadius: '6px',
                      padding: '8px',
                      textAlign: 'center'
                    }}>
                      <div style={{
                        fontSize: '1.2rem',
                        fontWeight: '900',
                        color: '#22C55E',
                        fontFamily: 'monospace'
                      }}>
                        {team.wins || 0}
                      </div>
                      <div style={{
                        fontSize: '0.65rem',
                        color: 'rgba(255, 255, 255, 0.5)',
                        fontWeight: '600',
                        marginTop: '2px'
                      }}>
                        Wins
                      </div>
                    </div>

                    <div style={{
                      background: 'rgba(239, 68, 68, 0.15)',
                      border: '1px solid rgba(239, 68, 68, 0.3)',
                      borderRadius: '6px',
                      padding: '8px',
                      textAlign: 'center'
                    }}>
                      <div style={{
                        fontSize: '1.2rem',
                        fontWeight: '900',
                        color: '#EF4444',
                        fontFamily: 'monospace'
                      }}>
                        {team.losses || 0}
                      </div>
                      <div style={{
                        fontSize: '0.65rem',
                        color: 'rgba(255, 255, 255, 0.5)',
                        fontWeight: '600',
                        marginTop: '2px'
                      }}>
                        Losses
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* No data state */}
        {leaderboard.length === 0 && (
          <div style={{
            textAlign: 'center',
            padding: '30px 15px',
            color: 'rgba(255, 255, 255, 0.5)'
          }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '10px' }}>⏳</div>
            <div style={{ fontSize: '0.9rem', fontWeight: '600' }}>
              Waiting for first battle...
            </div>
          </div>
        )}
      </div>

      {/* Animations */}
      <style jsx>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        
        @keyframes pulse-glow {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 0.8; }
        }
        
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
        
        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
        
        @keyframes slide {
          0% { left: -100%; }
          100% { left: 100%; }
        }
      `}</style>
    </div>
  );
    }
