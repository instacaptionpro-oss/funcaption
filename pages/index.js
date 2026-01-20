import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import AuraCard from '../components/AuraCard';
import RoastChat from '../components/RoastChat';
import LiveLeaderboard from '../components/LiveLeaderboard';
import RecentBattlesFeed from '../components/RecentBattlesFeed';

const moods = [
  { id: 'savage', emoji: '🔥', label: 'Savage', color: '#EF4444' },
  { id: 'funny', emoji: '😂', label: 'Funny', color: '#F59E0B' },
  { id: 'sarcastic', emoji: '🙄', label: 'Sarcastic', color: '#8B5CF6' },
  { id: 'deep', emoji: '🧠', label: 'Deep', color: '#3B82F6' },
  { id: 'attitude', emoji: '😎', label: 'Attitude', color: '#EC4899' },
  { id: 'poetic', emoji: '✍️', label: 'Poetic', color: '#10B981' },
  { id: 'motivation', emoji: '🚀', label: 'Motivational', color: '#F97316' },
  { id: 'love', emoji: '💕', label: 'Love', color: '#DB2777' }
];

const trendingPeople = {
  influencers: [
    { name: "Samay Raina", emoji: "🎯", scans: 2847 },
    { name: "CarryMinati", emoji: "🎮", scans: 2134 },
    { name: "Triggered Insaan", emoji: "😤", scans: 1856 },
    { name: "Ashish Chanchlani", emoji: "😂", scans: 1623 }
  ],
  cricketers: [
    { name: "Virat Kohli", emoji: "🏏", scans: 1923 },
    { name: "MS Dhoni", emoji: "👑", scans: 1745 },
    { name: "Rohit Sharma", emoji: "🏏", scans: 1456 },
    { name: "Hardik Pandya", emoji: "💪", scans: 1234 }
  ],
  global: [
    { name: "Elon Musk", emoji: "🚀", scans: 1678 },
    { name: "MrBeast", emoji: "💰", scans: 1456 },
    { name: "Ronaldo", emoji: "⚽", scans: 1389 },
    { name: "Andrew Tate", emoji: "🥋", scans: 1267 }
  ],
  relatable: [
    { name: "Your Ex", emoji: "💔", scans: 891 },
    { name: "Your Crush", emoji: "😍", scans: 756 },
    { name: "That Toxic Friend", emoji: "🐍", scans: 634 },
    { name: "Your Boss", emoji: "👔", scans: 523 }
  ]
};

const recentScans = [
  { name: "Virat Kohli", tier: "MID", emoji: "🔥", time: "2s ago" },
  { name: "Someone", tier: "NPC", emoji: "💀", time: "5s ago" },
  { name: "Samay Raina", tier: "EPIC", emoji: "⚡", time: "8s ago" },
  { name: "Your ex", tier: "NOOB", emoji: "😭", time: "12s ago" },
  { name: "Elon Musk", tier: "LEGENDARY", emoji: "👑", time: "15s ago" }
];

export default function Home() {
  const [nameInput, setNameInput] = useState('');
  const [selectedMood, setSelectedMood] = useState(0);
  const [loading, setLoading] = useState(false);
  const [aura, setAura] = useState(null);
  const [showRoastChat, setShowRoastChat] = useState(false);
  const [scanCount, setScanCount] = useState(47832);
  const [cardVisible, setCardVisible] = useState(false);
  const [isSpinning, setIsSpinning] = useState(false);
  const [activeCategory, setActiveCategory] = useState('influencers');
  const [liveScanners, setLiveScanners] = useState(47);
  const [campusWarsBattles, setCampusWarsBattles] = useState(1247);

  useEffect(() => {
    const interval = setInterval(() => {
      setScanCount(prev => prev + Math.floor(Math.random() * 3));
      setLiveScanners(prev => {
        const change = Math.floor(Math.random() * 7) - 3;
        return Math.max(40, Math.min(60, prev + change));
      });
      setCampusWarsBattles(prev => prev + Math.floor(Math.random() * 2));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (aura) {
      setCardVisible(false);
      setTimeout(() => setCardVisible(true), 100);
    }
  }, [aura]);

  const spinMoodWheel = () => {
    if (isSpinning) return;
    setIsSpinning(true);
    const spinDuration = 2000;
    const spinTimes = 20;
    let currentSpin = 0;

    const spinInterval = setInterval(() => {
      setSelectedMood(Math.floor(Math.random() * moods.length));
      currentSpin++;
      if (currentSpin >= spinTimes) {
        clearInterval(spinInterval);
        setIsSpinning(false);
        setSelectedMood(Math.floor(Math.random() * moods.length));
      }
    }, spinDuration / spinTimes);
  };

  const handleQuickScan = (name) => {
    setNameInput(name);
    setTimeout(() => handleScan(), 300);
  };

  const handleScan = async () => {
    if (!nameInput.trim()) return;

    setLoading(true);
    setAura(null);
    setCardVisible(false);

    try {
      const response = await fetch('/api/generate-aura', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          name: nameInput.trim(),
          subject: '', 
          mood: moods[selectedMood].id,
          language: 'hindi'
        })
      });

      const data = await response.json();
      if (response.ok) {
        if (data.aura.rarity === 'npc') data.aura.title = 'BOT';
        setAura(data.aura);
        setScanCount(prev => prev + 1);
      }
    } catch (err) {
      setAura({
        score: 15,
        roast: "Server crash ho gaya bc 💀 Tera energy bhi utna hi weak hai chutiye 😭",
        subjectInsight: "Error",
        rarity: "npc",
        title: "BOT",
        challenge: "SYSTEM FAILURE"
      });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setCardVisible(false);
    setTimeout(() => {
      setAura(null);
      setNameInput('');
      setSelectedMood(0);
    }, 300);
  };

  const currentMood = moods[selectedMood];

  return (
    <div>
      <Head>
        <title>AuraPro - AI Aura Scanner 🔮</title>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
        <meta name="description" content="AI scans anyone's aura and reveals their true power level. Are they LEGENDARY or just an NPC?" />
        <meta name="theme-color" content="#0a0a12" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />
      </Head>

      <div style={{
        position: 'fixed',
        inset: 0,
        background: 'radial-gradient(circle at 20% 50%, rgba(168, 85, 247, 0.15) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(236, 72, 153, 0.15) 0%, transparent 50%), linear-gradient(180deg, #0a0a12 0%, #0f0d18 100%)',
        zIndex: -2
      }} />

      <div style={{
        position: 'fixed',
        top: '10%',
        left: '5%',
        width: '300px',
        height: '300px',
        background: 'radial-gradient(circle, rgba(168, 85, 247, 0.2) 0%, transparent 70%)',
        borderRadius: '50%',
        filter: 'blur(60px)',
        animation: 'float 8s ease-in-out infinite',
        zIndex: -1
      }} />
      <div style={{
        position: 'fixed',
        bottom: '10%',
        right: '5%',
        width: '250px',
        height: '250px',
        background: 'radial-gradient(circle, rgba(236, 72, 153, 0.2) 0%, transparent 70%)',
        borderRadius: '50%',
        filter: 'blur(60px)',
        animation: 'float 6s ease-in-out infinite 2s',
        zIndex: -1
      }} />

      <div style={{ 
        minHeight: '100vh',
        padding: '30px 20px',
        maxWidth: '480px',
        margin: '0 auto',
        fontFamily: "'Inter', -apple-system, sans-serif"
      }}>
        
        {!aura ? (
          <div>
            {/* HEADER */}
            <div style={{ textAlign: 'center', marginBottom: '35px' }}>
              <div style={{
                display: 'inline-block',
                background: 'linear-gradient(135deg, #A855F7, #EC4899)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                fontSize: '3.5rem',
                fontWeight: '900',
                letterSpacing: '-0.03em',
                marginBottom: '15px',
                filter: 'drop-shadow(0 0 30px rgba(168, 85, 247, 0.3))',
                lineHeight: 1.1
              }}>
                AuraPro
              </div>
              
              <h1 style={{
                fontSize: '1.6rem',
                color: '#fff',
                fontWeight: '800',
                margin: '0 0 12px 0',
                lineHeight: '1.3',
                textShadow: '0 2px 20px rgba(0,0,0,0.5)'
              }}>
                🔮 AI Reveals Your <span style={{ 
                  background: 'linear-gradient(135deg, #FFD700, #FFA500)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}>TRUE AURA</span>
              </h1>
              
              <p style={{
                fontSize: '1.05rem',
                color: 'rgba(255, 255, 255, 0.8)',
                fontWeight: '500',
                margin: '0 0 20px 0',
                lineHeight: '1.6',
                padding: '0 10px'
              }}>
                Discover if you're <span style={{ color: '#FFD700', fontWeight: '700' }}>LEGENDARY 👑</span> or just another <span style={{ color: '#EF4444', fontWeight: '700' }}>NPC 💀</span>
              </p>

              <div style={{
                display: 'flex',
                justifyContent: 'center',
                gap: '15px',
                flexWrap: 'wrap',
                marginTop: '15px'
              }}>
                <div style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  background: 'rgba(239, 68, 68, 0.15)',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                  borderRadius: '100px',
                  padding: '6px 14px',
                  fontSize: '0.75rem',
                  color: '#EF4444',
                  fontWeight: '600'
                }}>
                  <div style={{
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    background: '#EF4444',
                    boxShadow: '0 0 10px #EF4444',
                    animation: 'pulse 2s infinite'
                  }} />
                  {scanCount.toLocaleString()}+ Auras Scanned
                </div>

                <div style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  background: 'rgba(34, 197, 94, 0.15)',
                  border: '1px solid rgba(34, 197, 94, 0.3)',
                  borderRadius: '100px',
                  padding: '6px 14px',
                  fontSize: '0.75rem',
                  color: '#22C55E',
                  fontWeight: '600'
                }}>
                  <div style={{
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    background: '#22C55E',
                    boxShadow: '0 0 10px #22C55E',
                    animation: 'pulse 2s infinite 1s'
                  }} />
                  {liveScanners} scanning now
                </div>
              </div>
            </div>

            {/* 🔥🔥🔥 NEW - IIT WARS LIVE LEADERBOARD SECTION 🔥🔥🔥 */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.03)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '24px',
              padding: '24px 20px',
              marginBottom: '30px',
              boxShadow: '0 15px 40px rgba(0, 0, 0, 0.3)'
            }}>
              <div style={{
                textAlign: 'center',
                marginBottom: '20px'
              }}>
                <h2 style={{
                  fontSize: '1.5rem',
                  fontWeight: '900',
                  background: 'linear-gradient(135deg, #00D4FF, #FF4500)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  margin: '0 0 8px 0',
                  letterSpacing: '0.5px'
                }}>
                  🔥 IIT WARS - LIVE NOW
                </h2>
                <p style={{
                  color: 'rgba(255, 255, 255, 0.6)',
                  fontSize: '0.85rem',
                  margin: 0
                }}>
                  IIT Bombay vs Delhi - 7 Day Battle
                </p>
              </div>

              <LiveLeaderboard />

              <Link href="/campus-wars">
                <div style={{
                  marginTop: '20px',
                  textAlign: 'center'
                }}>
                  <button style={{
                    padding: '14px 28px',
                    background: 'linear-gradient(135deg, #00FFFF, #0088FF)',
                    border: 'none',
                    borderRadius: '14px',
                    color: '#000',
                    fontSize: '0.95rem',
                    fontWeight: '800',
                    cursor: 'pointer',
                    fontFamily: 'inherit',
                    boxShadow: '0 8px 24px rgba(0, 255, 255, 0.4)',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.transform = 'translateY(-2px)';
                    e.target.style.boxShadow = '0 12px 32px rgba(0, 255, 255, 0.6)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = '0 8px 24px rgba(0, 255, 255, 0.4)';
                  }}>
                    🎯 JOIN THE BATTLE
                  </button>
                </div>
              </Link>

              <RecentBattlesFeed />
            </div>
            {/* CAMPUS WARS BANNER */}
            <Link href="/campus-wars">
              <div style={{
                background: 'linear-gradient(135deg, rgba(0, 255, 255, 0.25), rgba(0, 180, 255, 0.25))',
                border: '3px solid #00FFFF',
                borderRadius: '24px',
                padding: '28px 24px',
                marginBottom: '30px',
                cursor: 'pointer',
                transition: 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
                position: 'relative',
                overflow: 'hidden',
                boxShadow: '0 10px 40px rgba(0, 255, 255, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-6px) scale(1.02)';
                e.currentTarget.style.boxShadow = '0 20px 60px rgba(0, 255, 255, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.2)';
                e.currentTarget.style.borderColor = '#00FFFF';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0) scale(1)';
                e.currentTarget.style.boxShadow = '0 10px 40px rgba(0, 255, 255, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)';
              }}>
                
                <div style={{
                  position: 'absolute',
                  top: '-100%',
                  left: '-100%',
                  width: '300%',
                  height: '300%',
                  background: 'conic-gradient(from 0deg, transparent 0deg, rgba(0, 255, 255, 0.3) 60deg, transparent 120deg)',
                  animation: 'spin 4s linear infinite',
                  pointerEvents: 'none'
                }} />

                <div style={{
                  position: 'absolute',
                  inset: '-20px',
                  background: 'radial-gradient(circle at 50% 50%, rgba(0, 255, 255, 0.4) 0%, transparent 70%)',
                  animation: 'pulse-glow 3s ease-in-out infinite',
                  pointerEvents: 'none'
                }} />

                <div style={{
                  position: 'absolute',
                  top: '16px',
                  right: '16px',
                  background: 'linear-gradient(135deg, #FF0000, #FF4500)',
                  color: '#FFF',
                  padding: '6px 16px',
                  borderRadius: '20px',
                  fontSize: '0.7rem',
                  fontWeight: '900',
                  letterSpacing: '1.5px',
                  boxShadow: '0 4px 15px rgba(255, 0, 0, 0.4)',
                  animation: 'pulse 1.5s infinite',
                  zIndex: 2
                }}>
                  🔥 HOT
                </div>

                <div style={{ position: 'relative', zIndex: 2 }}>
                  <div style={{
                    fontSize: '3rem',
                    marginBottom: '12px',
                    textAlign: 'center',
                    filter: 'drop-shadow(0 0 20px rgba(0, 255, 255, 0.6))',
                    animation: 'float 3s ease-in-out infinite'
                  }}>
                    🎓⚔️🏆
                  </div>
                  
                  <h2 style={{
                    fontSize: '2rem',
                    fontWeight: '900',
                    background: 'linear-gradient(135deg, #00FFFF, #00BFFF, #FFFFFF)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    textAlign: 'center',
                    margin: '0 0 10px 0',
                    textShadow: '0 0 40px rgba(0, 255, 255, 0.8)',
                    letterSpacing: '2px',
                    animation: 'glow-text 2s ease-in-out infinite alternate'
                  }}>
                    CAMPUS WARS
                  </h2>
                  
                  <p style={{
                    fontSize: '1.1rem',
                    color: '#FFFFFF',
                    textAlign: 'center',
                    margin: '0 0 16px 0',
                    lineHeight: '1.6',
                    fontWeight: '700',
                    textShadow: '0 2px 10px rgba(0, 0, 0, 0.5)'
                  }}>
                    AI-Powered College Roast Battles 🔥
                  </p>

                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '10px',
                    marginBottom: '16px'
                  }}>
                    {[
                      { battle: 'IIT vs NIT', icon: '⚡' },
                      { battle: 'BITS vs VIT', icon: '💥' },
                      { battle: 'DU vs DTU', icon: '🎯' },
                      { battle: 'MIT vs Stanford', icon: '🚀' }
                    ].map((item, idx) => (
                      <div key={idx} style={{
                        fontSize: '0.75rem',
                        color: '#FFFFFF',
                        background: 'rgba(0, 255, 255, 0.15)',
                        padding: '8px 12px',
                        borderRadius: '12px',
                        border: '1px solid rgba(0, 255, 255, 0.4)',
                        fontWeight: '700',
                        textAlign: 'center',
                        boxShadow: '0 2px 10px rgba(0, 255, 255, 0.2)',
                        animation: `float 3s ease-in-out infinite ${idx * 0.2}s`
                      }}>
                        {item.icon} {item.battle}
                      </div>
                    ))}
                  </div>

                  <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    gap: '20px',
                    marginBottom: '16px',
                    flexWrap: 'wrap'
                  }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      fontSize: '0.8rem',
                      color: '#FFFFFF',
                      fontWeight: '700'
                    }}>
                      <span style={{ fontSize: '1.2rem' }}>⚔️</span>
                      {campusWarsBattles.toLocaleString()}+ battles
                    </div>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      fontSize: '0.8rem',
                      color: '#FFFFFF',
                      fontWeight: '700'
                    }}>
                      <span style={{ fontSize: '1.2rem' }}>🏆</span>
                      Live Leaderboard
                    </div>
                  </div>

                  <div style={{
                    textAlign: 'center',
                    fontSize: '1.05rem',
                    fontWeight: '900',
                    color: '#00FFFF',
                    background: 'rgba(0, 0, 0, 0.4)',
                    padding: '14px 24px',
                    borderRadius: '16px',
                    border: '2px solid #00FFFF',
                    boxShadow: '0 0 20px rgba(0, 255, 255, 0.5), inset 0 0 20px rgba(0, 255, 255, 0.1)',
                    letterSpacing: '1px',
                    animation: 'pulse-border 2s infinite'
                  }}>
                    👉 START ROASTING NOW 👈
                  </div>
                </div>
              </div>
            </Link>

            {/* TRENDING PEOPLE */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.03)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '20px',
              padding: '20px',
              marginBottom: '24px'
            }}>
              <div style={{
                fontSize: '0.8rem',
                color: 'rgba(255, 255, 255, 0.5)',
                marginBottom: '15px',
                fontWeight: '600',
                letterSpacing: '1px',
                textTransform: 'uppercase',
                textAlign: 'center'
              }}>
                🔥 Trending Scans Right Now
              </div>

              <div style={{
                display: 'flex',
                gap: '8px',
                marginBottom: '16px',
                overflowX: 'auto',
                paddingBottom: '8px',
                WebkitOverflowScrolling: 'touch'
              }}>
                {Object.keys(trendingPeople).map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    style={{
                      padding: '8px 16px',
                      border: activeCategory === cat 
                        ? '2px solid #A855F7' 
                        : '1px solid rgba(255, 255, 255, 0.15)',
                      borderRadius: '12px',
                      background: activeCategory === cat 
                        ? 'rgba(168, 85, 247, 0.2)' 
                        : 'rgba(255, 255, 255, 0.05)',
                      color: activeCategory === cat ? '#A855F7' : 'rgba(255, 255, 255, 0.7)',
                      fontSize: '0.75rem',
                      fontWeight: '700',
                      cursor: 'pointer',
                      fontFamily: 'inherit',
                      transition: 'all 0.2s',
                      whiteSpace: 'nowrap',
                      textTransform: 'capitalize'
                    }}
                  >
                    {cat === 'influencers' && '📺'}
                    {cat === 'cricketers' && '🏏'}
                    {cat === 'global' && '🌍'}
                    {cat === 'relatable' && '💭'}
                    {' '}{cat}
                  </button>
                ))}
              </div>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: '10px'
              }}>
                {trendingPeople[activeCategory].map((person) => (
                  <button
                    key={person.name}
                    onClick={() => handleQuickScan(person.name)}
                    style={{
                      padding: '14px',
                      border: '1px solid rgba(255, 255, 255, 0.15)',
                      borderRadius: '14px',
                      background: 'rgba(255, 255, 255, 0.05)',
                      cursor: 'pointer',
                      fontFamily: 'inherit',
                      transition: 'all 0.2s',
                      textAlign: 'left'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.background = 'rgba(168, 85, 247, 0.15)';
                      e.target.style.borderColor = 'rgba(168, 85, 247, 0.4)';
                      e.target.style.transform = 'translateY(-2px)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.background = 'rgba(255, 255, 255, 0.05)';
                      e.target.style.borderColor = 'rgba(255, 255, 255, 0.15)';
                      e.target.style.transform = 'translateY(0)';
                    }}
                  >
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      marginBottom: '6px'
                    }}>
                      <span style={{ fontSize: '1.5rem' }}>{person.emoji}</span>
                      <span style={{
                        fontSize: '0.85rem',
                        fontWeight: '700',
                        color: '#fff',
                        flex: 1
                      }}>
                        {person.name}
                      </span>
                    </div>
                    <div style={{
                      fontSize: '0.65rem',
                      color: 'rgba(255, 255, 255, 0.5)',
                      fontWeight: '600'
                    }}>
                      {person.scans.toLocaleString()} scans
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* SCAN FORM */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.03)',
              backdropFilter: 'blur(30px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '28px',
              padding: '32px 28px',
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
              marginBottom: '24px'
            }}>
              
              <div style={{ marginBottom: '28px' }}>
                <label style={{
                  display: 'block',
                  fontSize: '0.9rem',
                  fontWeight: '700',
                  color: 'rgba(255, 255, 255, 0.8)',
                  marginBottom: '12px',
                  letterSpacing: '0.5px',
                  textAlign: 'center'
                }}>
                  👁️ Whose Aura Should We Scan?
                </label>
                
                <input
                  type="text"
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  placeholder="Celebrity, friend, yourself..."
                  onKeyPress={(e) => e.key === 'Enter' && handleScan()}
                  style={{
                    width: '100%',
                    background: 'rgba(0, 0, 0, 0.4)',
                    border: '2px solid rgba(168, 85, 247, 0.3)',
                    borderRadius: '16px',
                    padding: '18px 20px',
                    color: '#fff',
                    fontSize: '1.05rem',
                    fontWeight: '600',
                    outline: 'none',
                    fontFamily: 'inherit',
                    transition: 'all 0.3s ease',
                    textAlign: 'center'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#A855F7';
                    e.target.style.boxShadow = '0 0 0 4px rgba(168, 85, 247, 0.15)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = 'rgba(168, 85, 247, 0.3)';
                    e.target.style.boxShadow = 'none';
                  }}
                />
              </div>

              <div style={{ marginBottom: '28px' }}>
                <label style={{
                  display: 'block',
                  fontSize: '0.85rem',
                  fontWeight: '600',
                  color: 'rgba(255, 255, 255, 0.6)',
                  marginBottom: '16px',
                  letterSpacing: '0.5px',
                  textTransform: 'uppercase',
                  textAlign: 'center'
                }}>
                  Choose Scan Mood
                </label>

                <div style={{
                  position: 'relative',
                  width: '160px',
                  height: '160px',
                  margin: '0 auto 20px',
                }}>
                  <div style={{
                    position: 'absolute',
                    inset: 0,
                    borderRadius: '50%',
                    background: `conic-gradient(${moods.map((m, i) => 
                      `${m.color} ${(i * 360 / moods.length)}deg ${((i + 1) * 360 / moods.length)}deg`
                    ).join(', ')})`,
                    animation: isSpinning ? 'spin 0.1s linear infinite' : 'none',
                    filter: 'blur(8px)',
                    opacity: 0.6
                  }} />

                  <div style={{
                    position: 'absolute',
                    inset: '15px',
                    borderRadius: '50%',
                    background: `linear-gradient(135deg, ${currentMood.color}30, ${currentMood.color}10)`,
                    border: `3px solid ${currentMood.color}`,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    boxShadow: `0 0 30px ${currentMood.color}60`,
                    transition: 'all 0.3s ease'
                  }}>
                    <div style={{ fontSize: '2.5rem' }}>{currentMood.emoji}</div>
                    <div style={{
                      fontSize: '0.85rem',
                      fontWeight: '700',
                      color: currentMood.color,
                      letterSpacing: '0.5px'
                    }}>
                      {currentMood.label}
                    </div>
                  </div>
                </div>

                <button
                  onClick={spinMoodWheel}
                  disabled={isSpinning}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: `2px solid ${currentMood.color}40`,
                    borderRadius: '14px',
                    background: `${currentMood.color}15`,
                    color: currentMood.color,
                    fontSize: '0.85rem',
                    fontWeight: '700',
                    cursor: isSpinning ? 'not-allowed' : 'pointer',
                    fontFamily: 'inherit',
                    transition: 'all 0.2s ease',
                    marginBottom: '12px'
                  }}
                >
                  {isSpinning ? '🎰 Spinning...' : '🎲 Random Mood'}
                </button>

                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(4, 1fr)',
                  gap: '8px'
                }}>
                  {moods.map((mood, index) => (
                    <button
                      key={mood.id}
                      onClick={() => setSelectedMood(index)}
                      style={{
                        padding: '10px',
                        border: selectedMood === index 
                          ? `2px solid ${mood.color}` 
                          : '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: '12px',
                        background: selectedMood === index 
                          ? `${mood.color}20` 
                          : 'rgba(255, 255, 255, 0.03)',
                        cursor: 'pointer',
                        fontFamily: 'inherit',
                        transition: 'all 0.2s ease',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '4px'
                      }}
                    >
                      <div style={{ fontSize: '1.3rem' }}>{mood.emoji}</div>
                      <div style={{
                        fontSize: '0.6rem',
                        fontWeight: '600',
                        color: selectedMood === index ? mood.color : 'rgba(255, 255, 255, 0.5)'
                      }}>
                        {mood.label}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={handleScan}
                disabled={loading || !nameInput.trim()}
                style={{
                  width: '100%',
                  padding: '18px',
                  border: 'none',
                  borderRadius: '16px',
                  fontSize: '1.05rem',
                  fontWeight: '800',
                  cursor: nameInput.trim() && !loading ? 'pointer' : 'not-allowed',
                  fontFamily: 'inherit',
                  background: nameInput.trim() && !loading
                    ? 'linear-gradient(135deg, #A855F7, #EC4899)'
                    : 'rgba(255, 255, 255, 0.1)',
                  color: nameInput.trim() && !loading ? '#fff' : 'rgba(255, 255, 255, 0.3)',
                  boxShadow: nameInput.trim() && !loading 
                    ? '0 8px 30px rgba(168, 85, 247, 0.4)' 
                    : 'none',
                  transition: 'all 0.3s ease',
                  transform: loading ? 'scale(0.98)' : 'scale(1)'
                }}
              >
                {loading ? (
                  <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                    <span style={{ 
                      width: '16px', 
                      height: '16px', 
                      border: '2px solid rgba(255,255,255,0.3)',
                      borderTop: '2px solid #fff',
                      borderRadius: '50%',
                      animation: 'spin 0.8s linear infinite'
                    }} />
                    Scanning Aura...
                  </span>
                ) : '🔮 SCAN AURA NOW'}
              </button>
            </div>

            {/* RECENT SCANS */}
            <div style={{
              background: 'rgba(0, 0, 0, 0.3)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '20px',
              padding: '18px',
              marginBottom: '24px'
            }}>
              <div style={{
                fontSize: '0.75rem',
                color: 'rgba(255, 255, 255, 0.5)',
                marginBottom: '12px',
                fontWeight: '600',
                letterSpacing: '1px',
                textTransform: 'uppercase',
                textAlign: 'center'
              }}>
                ⚡ Last 5 Scans
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {recentScans.map((scan, i) => (
                  <div key={i} style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '8px 12px',
                    background: 'rgba(255, 255, 255, 0.03)',
                    borderRadius: '10px',
                    fontSize: '0.75rem'
                  }}>
                    <span style={{ color: 'rgba(255,255,255,0.7)' }}>
                      {scan.emoji} {scan.name}
                    </span>
                    <span style={{ color: 'rgba(255,255,255,0.5)', fontWeight: '600' }}>
                      {scan.tier} • {scan.time}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* AURA TIERS */}
            <div style={{
              background: 'rgba(0, 0, 0, 0.3)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '20px',
              padding: '20px',
              marginBottom: '24px'
            }}>
              <div style={{
                fontSize: '0.8rem',
                color: 'rgba(255, 255, 255, 0.5)',
                marginBottom: '14px',
                fontWeight: '600',
                letterSpacing: '1px',
                textTransform: 'uppercase',
                textAlign: 'center'
              }}>
                Aura Tiers
              </div>
              
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(5, 1fr)',
                gap: '8px'
              }}>
                {[
                  { emoji: '👑', label: 'LEG', color: '#FFD700', pct: '1%' },
                  { emoji: '⚡', label: 'EPIC', color: '#00FFFF', pct: '5%' },
                  { emoji: '🔥', label: 'MID', color: '#FFFFFF', pct: '39%' },
                  { emoji: '😬', label: 'NOOB', color: '#FF8C00', pct: '35%' },
                  { emoji: '💀', label: 'BOT', color: '#FF0000', pct: '20%' }
                ].map((tier) => (
                  <div key={tier.label} style={{
                    textAlign: 'center',
                    padding: '12px 6px',
                    background: `${tier.color}15`,
                    border: `1px solid ${tier.color}40`,
                    borderRadius: '12px'
                  }}>
                    <div style={{ fontSize: '1.3rem', marginBottom: '4px' }}>{tier.emoji}</div>
                    <div style={{ fontSize: '0.65rem', fontWeight: '700', color: tier.color, marginBottom: '2px' }}>
                      {tier.label}
                    </div>
                    <div style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.4)' }}>
                      {tier.pct}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* BADGES */}
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '16px',
              flexWrap: 'wrap'
            }}>
              {['⚡ Instant', '🔒 Anonymous', '🎯 100% Free'].map((badge) => (
                <div key={badge} style={{
                  fontSize: '0.75rem',
                  color: 'rgba(255, 255, 255, 0.4)',
                  fontWeight: '600'
                }}>
                  {badge}
                </div>
              ))}
            </div>
          </div>
        ) : (
          // RESULT SCREEN
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '24px',
            opacity: cardVisible ? 1 : 0,
            transform: cardVisible ? 'translateY(0) scale(1)' : 'translateY(20px) scale(0.95)',
            transition: 'all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)'
          }}>
            <div style={{ position: 'relative', width: '100%', maxWidth: '400px' }}>
              <AuraCard aura={aura} />
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '12px',
              width: '100%',
              maxWidth: '360px'
            }}>
              <button
                onClick={() => setShowRoastChat(true)}
                style={{
                  padding: '16px',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '16px',
                  fontSize: '0.9rem',
                  fontWeight: '700',
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                  background: 'rgba(255, 255, 255, 0.05)',
                  color: '#fff',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = 'rgba(255, 255, 255, 0.1)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = 'rgba(255, 255, 255, 0.05)';
                }}
              >
                💬 More Roasts
              </button>
              
              <button
                onClick={resetForm}
                style={{
                  padding: '16px',
                  border: 'none',
                  borderRadius: '16px',
                  fontSize: '0.9rem',
                  fontWeight: '700',
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                  background: 'linear-gradient(135deg, #A855F7, #EC4899)',
                  color: '#fff',
                  boxShadow: '0 8px 30px rgba(168, 85, 247, 0.4)',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'scale(1.02)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'scale(1)';
                }}
              >
                🔄 Scan Again
              </button>
            </div>
          </div>
        )}

        {showRoastChat && (
          <RoastChat 
            subject={aura.name || nameInput}
            mood={moods[selectedMood].id}
            initialRoast={aura.roast}
            onClose={() => setShowRoastChat(false)}
          />
        )}

        <footer style={{ textAlign: 'center', padding: '40px 0 20px', marginTop: '40px' }}>
          <p style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.3)' }}>
            AuraPro © 2025 • AI Aura Scanner
          </p>
        </footer>
      </div>

      <style jsx global>{`
        * {
          box-sizing: border-box;
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.6; }
        }

        @keyframes pulse-glow {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 0.7; }
        }

        @keyframes pulse-border {
          0%, 100% { 
            border-color: #00FFFF;
            box-shadow: 0 0 20px rgba(0, 255, 255, 0.5), inset 0 0 20px rgba(0, 255, 255, 0.1);
          }
          50% { 
            border-color: #00BFFF;
            box-shadow: 0 0 30px rgba(0, 255, 255, 0.8), inset 0 0 30px rgba(0, 255, 255, 0.2);
          }
        }

        @keyframes glow-text {
          from {
            text-shadow: 0 0 20px rgba(0, 255, 255, 0.6), 0 0 40px rgba(0, 255, 255, 0.4);
          }
          to {
            text-shadow: 0 0 30px rgba(0, 255, 255, 0.9), 0 0 60px rgba(0, 255, 255, 0.6);
          }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        input::placeholder {
          color: rgba(255, 255, 255, 0.3);
        }
        
        button:active {
          transform: scale(0.98) !important;
        }

        div::-webkit-scrollbar {
          height: 4px;
        }
        
        div::-webkit-scrollbar-track {
          background: rgba(255,255,255,0.05);
          border-radius: 10px;
        }
        
        div::-webkit-scrollbar-thumb {
          background: rgba(168, 85, 247, 0.3);
          border-radius: 10px;
        }
      `}</style>
    </div>
  );
                      }
