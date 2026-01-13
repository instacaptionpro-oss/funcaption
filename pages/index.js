import { useState, useEffect } from 'react';
import Head from 'next/head';
import AuraCard from '../components/AuraCard';
import RoastChat from '../components/RoastChat';

// Mood options
const moodOptions = [
  { id: 'savage', emoji: '🔥', label: 'Savage' },
  { id: 'funny', emoji: '😂', label: 'Funny' },
  { id: 'deep', emoji: '🧠', label: 'Deep' },
  { id: 'attitude', emoji: '😎', label: 'Attitude' },
  { id: 'sarcastic', emoji: '🙄', label: 'Sarcastic' },
];

const extendedMoods = [
  { id: 'fire', emoji: '💥', label: 'Fire' },
  { id: 'aesthetic', emoji: '✨', label: 'Aesthetic' },
  { id: 'poetic', emoji: '✍️', label: 'Poetic' },
  { id: 'motivation', emoji: '🚀', label: 'Motivation' },
  { id: 'love', emoji: '💕', label: 'Love' },
  { id: 'breakup', emoji: '💔', label: 'Breakup' },
  { id: 'sad', emoji: '😢', label: 'Sad' },
  { id: 'confident', emoji: '💪', label: 'Confident' },
  { id: 'rebellious', emoji: '⚡', label: 'Rebellious' }
];

// Trending names for social proof
const trendingNames = [
  "Samay Raina", "Carry Minati", "Dhoni", "Virat Kohli", "Elon Musk"
];

export default function Home() {
  const [name, setName] = useState('');
  const [subject, setSubject] = useState('');
  const [selectedMood, setSelectedMood] = useState('savage');
  const [language, setLanguage] = useState('english');
  const [showExtendedMoods, setShowExtendedMoods] = useState(false);
  const [loading, setLoading] = useState(false);
  const [aura, setAura] = useState(null);
  const [showRoastChat, setShowRoastChat] = useState(false);
  const [chatSubject, setChatSubject] = useState('');
  const [chatMood, setChatMood] = useState('');
  const [chatInitialRoast, setChatInitialRoast] = useState('');
  const [copied, setCopied] = useState(false);
  const [roastCount, setRoastCount] = useState(47832);
  const [activeUsers, setActiveUsers] = useState(23);

  // Simulate live counters for social proof
  useEffect(() => {
    const interval = setInterval(() => {
      setRoastCount(prev => prev + Math.floor(Math.random() * 3));
      setActiveUsers(Math.floor(Math.random() * 30) + 15);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const selectMood = (moodId) => {
    if (moodId === 'more') {
      setShowExtendedMoods(!showExtendedMoods);
      return;
    }
    setSelectedMood(moodId);
    setShowExtendedMoods(false);
  };

  const useTrendingName = (trendName) => {
    setName(trendName);
    setSelectedMood('savage');
  };

  const generateAura = async (e) => {
    e.preventDefault();
    if (!subject.trim() && !name.trim()) return;

    setLoading(true);
    setAura(null);

    try {
      const response = await fetch('/api/generate-aura', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          name: name.trim(),
          subject: subject.trim(), 
          mood: selectedMood,
          language: language
        })
      });

      const data = await response.json();
      if (response.ok) {
        setAura(data.aura);
        setRoastCount(prev => prev + 1);
      } else {
        setAura(data.fallback);
      }
    } catch (err) {
      console.error('Generation error:', err);
      setAura({
        score: Math.floor(Math.random() * 60),
        roast: "Your energy crashed our servers. That's how weak it is. 💀",
        subjectInsight: "Error 404: Aura not found",
        rarity: "npc",
        title: "NPC",
        challenge: "SYSTEM COULDN'T HANDLE YOUR AVERAGE ENERGY."
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRoastChat = () => {
    setChatSubject(subject || name);
    setChatMood(selectedMood);
    setChatInitialRoast(aura.roast);
    setShowRoastChat(true);
  };

  const resetForm = () => {
    setAura(null);
    setSubject('');
    setName('');
  };

  const canSubmit = subject.trim() || name.trim();

  return (
    <>
      <Head>
        <title>AuraScore™ - The Ultimate Roast Experience</title>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
        <meta name="description" content="Get your aura scored and brutally roasted by AI. Join 50K+ people who dared to know the truth." />
        <meta name="theme-color" content="#0a0a0f" />
        <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
      </Head>

      <style jsx global>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        body {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
          background: #0a0a0f;
          min-height: 100vh;
          color: #ffffff;
          overflow-x: hidden;
        }

        /* Custom Scrollbar */
        ::-webkit-scrollbar {
          width: 6px;
        }
        ::-webkit-scrollbar-track {
          background: #0a0a0f;
        }
        ::-webkit-scrollbar-thumb {
          background: linear-gradient(180deg, #FFD700, #FF4500);
          border-radius: 3px;
        }

        /* Animations */
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }

        @keyframes glow {
          0%, 100% { box-shadow: 0 0 20px rgba(255, 215, 0, 0.3); }
          50% { box-shadow: 0 0 40px rgba(255, 215, 0, 0.6); }
        }

        @keyframes shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }

        @keyframes pulse-ring {
          0% { transform: scale(0.95); opacity: 1; }
          50% { transform: scale(1); opacity: 0.8; }
          100% { transform: scale(0.95); opacity: 1; }
        }

        @keyframes gradient-shift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .float { animation: float 3s ease-in-out infinite; }
        .glow { animation: glow 2s ease-in-out infinite; }
        .pulse-ring { animation: pulse-ring 2s ease-in-out infinite; }
        .fade-in-up { animation: fadeInUp 0.6s ease-out forwards; }

        .shimmer-text {
          background: linear-gradient(90deg, #FFD700 0%, #FFF 50%, #FFD700 100%);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: shimmer 3s linear infinite;
        }

        .gradient-border {
          position: relative;
          background: #12121a;
          border-radius: 20px;
        }
        .gradient-border::before {
          content: '';
          position: absolute;
          inset: -2px;
          border-radius: 22px;
          background: linear-gradient(135deg, #FFD700, #FF4500, #9400D3, #00FFFF);
          background-size: 300% 300%;
          animation: gradient-shift 4s ease infinite;
          z-index: -1;
          opacity: 0.7;
        }

        .glass-card {
          background: rgba(18, 18, 26, 0.8);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 24px;
        }

        .premium-input {
          width: 100%;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 16px;
          padding: 16px 20px;
          color: #ffffff;
          font-size: 1rem;
          font-family: inherit;
          transition: all 0.3s ease;
          outline: none;
        }
        .premium-input:focus {
          border-color: #FFD700;
          box-shadow: 0 0 0 3px rgba(255, 215, 0, 0.1);
          background: rgba(255, 255, 255, 0.05);
        }
        .premium-input::placeholder {
          color: rgba(255, 255, 255, 0.3);
        }

        .premium-btn {
          position: relative;
          padding: 18px 32px;
          border: none;
          border-radius: 16px;
          font-size: 1.1rem;
          font-weight: 700;
          cursor: pointer;
          overflow: hidden;
          transition: all 0.3s ease;
        }
        .premium-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .mood-chip {
          padding: 12px 18px;
          border-radius: 14px;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.08);
          color: rgba(255, 255, 255, 0.7);
          font-size: 0.9rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .mood-chip:hover {
          background: rgba(255, 255, 255, 0.08);
          border-color: rgba(255, 255, 255, 0.15);
          transform: translateY(-2px);
        }
        .mood-chip.active {
          background: linear-gradient(135deg, rgba(255, 215, 0, 0.2), rgba(255, 69, 0, 0.2));
          border-color: #FFD700;
          color: #FFD700;
        }

        .stat-card {
          text-align: center;
          padding: 16px;
        }
        .stat-number {
          font-size: 1.8rem;
          font-weight: 800;
          background: linear-gradient(135deg, #FFD700, #FF4500);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .stat-label {
          font-size: 0.75rem;
          color: rgba(255, 255, 255, 0.5);
          text-transform: uppercase;
          letter-spacing: 1px;
          margin-top: 4px;
        }

        .trending-chip {
          padding: 8px 14px;
          border-radius: 20px;
          background: rgba(255, 215, 0, 0.1);
          border: 1px solid rgba(255, 215, 0, 0.3);
          color: #FFD700;
          font-size: 0.8rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .trending-chip:hover {
          background: rgba(255, 215, 0, 0.2);
          transform: scale(1.05);
        }

        .rarity-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 6px 12px;
          border-radius: 8px;
          font-size: 0.7rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .language-toggle {
          display: flex;
          background: rgba(255, 255, 255, 0.03);
          border-radius: 12px;
          padding: 4px;
          border: 1px solid rgba(255, 255, 255, 0.08);
        }
        .language-btn {
          flex: 1;
          padding: 12px 20px;
          border: none;
          border-radius: 10px;
          font-size: 0.9rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          background: transparent;
          color: rgba(255, 255, 255, 0.5);
        }
        .language-btn.active {
          background: linear-gradient(135deg, #FFD700, #FF8C00);
          color: #000;
        }
      `}</style>

      {/* Background Elements */}
      <div style={{
        position: 'fixed',
        inset: 0,
        background: 'radial-gradient(ellipse at top, #1a1a2e 0%, #0a0a0f 50%)',
        zIndex: -2
      }} />
      <div style={{
        position: 'fixed',
        top: '10%',
        left: '5%',
        width: '300px',
        height: '300px',
        background: 'radial-gradient(circle, rgba(255,215,0,0.1) 0%, transparent 70%)',
        borderRadius: '50%',
        filter: 'blur(60px)',
        zIndex: -1
      }} />
      <div style={{
        position: 'fixed',
        bottom: '20%',
        right: '10%',
        width: '250px',
        height: '250px',
        background: 'radial-gradient(circle, rgba(148,0,211,0.1) 0%, transparent 70%)',
        borderRadius: '50%',
        filter: 'blur(60px)',
        zIndex: -1
      }} />

      <div style={{ 
        minHeight: '100vh',
        padding: '20px',
        maxWidth: '480px',
        margin: '0 auto'
      }}>
        
        {/* Header */}
        <header style={{
          textAlign: 'center',
          padding: '40px 0 30px'
        }}>
          {/* Live Badge */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            background: 'rgba(255, 0, 0, 0.1)',
            border: '1px solid rgba(255, 0, 0, 0.3)',
            borderRadius: '20px',
            padding: '6px 14px',
            marginBottom: '20px'
          }}>
            <span style={{
              width: '8px',
              height: '8px',
              background: '#FF0000',
              borderRadius: '50%',
              animation: 'pulse-ring 1.5s infinite'
            }} />
            <span style={{ fontSize: '0.75rem', color: '#FF6B6B', fontWeight: '600' }}>
              {activeUsers} people roasting right now
            </span>
          </div>

          {/* Logo */}
          <h1 className="shimmer-text" style={{
            fontSize: '3rem',
            fontWeight: '800',
            letterSpacing: '-0.03em',
            marginBottom: '12px',
            fontFamily: "'Space Grotesk', sans-serif"
          }}>
            AuraScore™
          </h1>
          
          <p style={{
            fontSize: '1rem',
            color: 'rgba(255, 255, 255, 0.6)',
            fontWeight: '500',
            marginBottom: '24px'
          }}>
            The AI that roasts without mercy
          </p>

          {/* Stats */}
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '30px'
          }}>
            <div className="stat-card">
              <div className="stat-number">{roastCount.toLocaleString()}</div>
              <div className="stat-label">Roasts Generated</div>
            </div>
            <div style={{
              width: '1px',
              background: 'rgba(255,255,255,0.1)'
            }} />
            <div className="stat-card">
              <div className="stat-number">1%</div>
              <div className="stat-label">Get Legendary</div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        {!aura ? (
          <div className="fade-in-up">
            {/* Main Form Card */}
            <div className="glass-card" style={{ padding: '28px', marginBottom: '20px' }}>
              
              {/* Language Toggle */}
              <div style={{ marginBottom: '28px' }}>
                <label style={{
                  display: 'block',
                  fontSize: '0.8rem',
                  fontWeight: '600',
                  color: 'rgba(255, 255, 255, 0.5)',
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                  marginBottom: '12px'
                }}>
                  Language
                </label>
                <div className="language-toggle">
                  <button
                    className={`language-btn ${language === 'english' ? 'active' : ''}`}
                    onClick={() => setLanguage('english')}
                  >
                    🇬🇧 English
                  </button>
                  <button
                    className={`language-btn ${language === 'hindi' ? 'active' : ''}`}
                    onClick={() => setLanguage('hindi')}
                  >
                    🇮🇳 हिंदी
                  </button>
                </div>
              </div>

              {/* Name Input */}
              <div style={{ marginBottom: '24px' }}>
                <label style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '12px'
                }}>
                  <span style={{
                    fontSize: '0.8rem',
                    fontWeight: '600',
                    color: 'rgba(255, 255, 255, 0.5)',
                    textTransform: 'uppercase',
                    letterSpacing: '1px'
                  }}>
                    Who to roast?
                  </span>
                  <span style={{
                    fontSize: '0.7rem',
                    color: 'rgba(255, 215, 0, 0.7)',
                    background: 'rgba(255, 215, 0, 0.1)',
                    padding: '4px 10px',
                    borderRadius: '6px'
                  }}>
                    Optional
                  </span>
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Celebrity, friend, or yourself..."
                  className="premium-input"
                />
              </div>

              {/* Trending Names */}
              <div style={{ marginBottom: '28px' }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  marginBottom: '12px'
                }}>
                  <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)' }}>🔥 TRENDING</span>
                </div>
                <div style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '8px'
                }}>
                  {trendingNames.map((trendName, i) => (
                    <button
                      key={i}
                      className="trending-chip"
                      onClick={() => useTrendingName(trendName)}
                    >
                      {trendName}
                    </button>
                  ))}
                </div>
              </div>

              {/* Divider */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                margin: '28px 0'
              }}>
                <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.08)' }} />
                <span style={{ 
                  color: 'rgba(255,255,255,0.3)', 
                  fontSize: '0.75rem',
                  fontWeight: '600',
                  letterSpacing: '2px'
                }}>
                  AND / OR
                </span>
                <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.08)' }} />
              </div>

              {/* Subject Input */}
              <div style={{ marginBottom: '28px' }}>
                <label style={{
                  display: 'block',
                  fontSize: '0.8rem',
                  fontWeight: '600',
                  color: 'rgba(255, 255, 255, 0.5)',
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                  marginBottom: '12px'
                }}>
                  What to roast about?
                </label>
                <textarea
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Their habit, personality, career, looks, anything..."
                  className="premium-input"
                  style={{
                    minHeight: '100px',
                    resize: 'none',
                    lineHeight: '1.6'
                  }}
                />
              </div>

              {/* Mood Selection */}
              <div style={{ marginBottom: '28px' }}>
                <label style={{
                  display: 'block',
                  fontSize: '0.8rem',
                  fontWeight: '600',
                  color: 'rgba(255, 255, 255, 0.5)',
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                  marginBottom: '12px'
                }}>
                  Roast Energy
                </label>
                <div style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '10px'
                }}>
                  {moodOptions.map(mood => (
                    <button
                      key={mood.id}
                      className={`mood-chip ${selectedMood === mood.id ? 'active' : ''}`}
                      onClick={() => selectMood(mood.id)}
                    >
                      <span>{mood.emoji}</span>
                      <span>{mood.label}</span>
                    </button>
                  ))}
                  <button
                    className={`mood-chip ${showExtendedMoods ? 'active' : ''}`}
                    onClick={() => setShowExtendedMoods(!showExtendedMoods)}
                  >
                    <span>➕</span>
                    <span>More</span>
                  </button>
                </div>

                {/* Extended Moods */}
                {showExtendedMoods && (
                  <div style={{
                    marginTop: '12px',
                    padding: '16px',
                    background: 'rgba(0,0,0,0.3)',
                    borderRadius: '16px',
                    border: '1px solid rgba(255,255,255,0.05)'
                  }}>
                    <div style={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: '8px'
                    }}>
                      {extendedMoods.map(mood => (
                        <button
                          key={mood.id}
                          className={`mood-chip ${selectedMood === mood.id ? 'active' : ''}`}
                          onClick={() => selectMood(mood.id)}
                          style={{ padding: '10px 14px', fontSize: '0.85rem' }}
                        >
                          <span>{mood.emoji}</span>
                          <span>{mood.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Generate Button */}
              <button
                onClick={generateAura}
                disabled={loading || !canSubmit}
                className="premium-btn glow"
                style={{
                  width: '100%',
                  background: loading || !canSubmit
                    ? 'rgba(255,255,255,0.1)'
                    : 'linear-gradient(135deg, #FFD700 0%, #FF4500 50%, #FF0000 100%)',
                  color: loading || !canSubmit ? 'rgba(255,255,255,0.3)' : '#000',
                  fontFamily: "'Space Grotesk', sans-serif"
                }}
              >
                {loading ? (
                  <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                    <span style={{
                      width: '20px',
                      height: '20px',
                      border: '2px solid rgba(0,0,0,0.2)',
                      borderTopColor: '#000',
                      borderRadius: '50%',
                      animation: 'spin 1s linear infinite'
                    }} />
                    Analyzing Your Aura...
                  </span>
                ) : (
                  '🔥 Get Roasted'
                )}
              </button>

              <style jsx>{`
                @keyframes spin {
                  to { transform: rotate(360deg); }
                }
              `}</style>
            </div>

            {/* Rarity Info Card */}
            <div className="glass-card" style={{ padding: '20px' }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                marginBottom: '16px'
              }}>
                <span style={{ fontSize: '1rem' }}>🎰</span>
                <span style={{
                  fontSize: '0.8rem',
                  fontWeight: '700',
                  color: 'rgba(255,255,255,0.7)',
                  letterSpacing: '1px'
                }}>
                  RARITY ODDS
                </span>
              </div>
              <div style={{
                display: 'flex',
                justifyContent: 'space-around',
                flexWrap: 'wrap',
                gap: '8px'
              }}>
                <span className="rarity-badge" style={{ background: 'rgba(255,215,0,0.2)', color: '#FFD700' }}>
                  👑 LEGENDARY 1%
                </span>
                <span className="rarity-badge" style={{ background: 'rgba(148,0,211,0.2)', color: '#9400D3' }}>
                  ⚡ EPIC 5%
                </span>
                <span className="rarity-badge" style={{ background: 'rgba(255,255,255,0.1)', color: '#fff' }}>
                  💫 MID 39%
                </span>
                <span className="rarity-badge" style={{ background: 'rgba(255,140,0,0.2)', color: '#FF8C00' }}>
                  😬 NOOB 35%
                </span>
                <span className="rarity-badge" style={{ background: 'rgba(255,0,0,0.2)', color: '#FF4444' }}>
                  💀 NPC 20%
                </span>
              </div>
            </div>

            {/* Trust Badges */}
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '20px',
              marginTop: '24px',
              opacity: 0.5
            }}>
              <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)' }}>🔒 Anonymous</span>
              <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)' }}>⚡ Instant</span>
              <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)' }}>🎯 Brutal</span>
            </div>
          </div>
        ) : (
          /* Results View */
          <div className="fade-in-up" style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '24px'
          }}>
            <AuraCard aura={aura} />
            
            {/* Public Figure Badge */}
            {aura.isPublicFigure && (
              <div className="glass-card" style={{
                padding: '14px 24px',
                background: aura.publicFigureStatus === 'peak' 
                  ? 'rgba(255, 215, 0, 0.1)' 
                  : aura.publicFigureStatus === 'falling' 
                    ? 'rgba(255, 0, 0, 0.1)' 
                    : 'rgba(148, 0, 211, 0.1)',
                borderColor: aura.publicFigureStatus === 'peak' 
                  ? 'rgba(255, 215, 0, 0.3)' 
                  : aura.publicFigureStatus === 'falling' 
                    ? 'rgba(255, 0, 0, 0.3)' 
                    : 'rgba(148, 0, 211, 0.3)'
              }}>
                <p style={{
                  margin: 0,
                  fontSize: '0.85rem',
                  fontWeight: '700',
                  color: '#fff',
                  textAlign: 'center'
                }}>
                  {aura.publicFigureStatus === 'peak' && '👑 PUBLIC FIGURE AT PEAK'}
                  {aura.publicFigureStatus === 'stable' && '⚡ ESTABLISHED FIGURE'}
                  {aura.publicFigureStatus === 'falling' && '📉 FALLING FROM GRACE'}
                  {!['peak', 'stable', 'falling'].includes(aura.publicFigureStatus) && '🔍 DETECTED FIGURE'}
                </p>
              </div>
            )}
            
            {/* Action Buttons */}
            <div style={{
              display: 'flex',
              gap: '12px',
              width: '100%',
              maxWidth: '340px'
            }}>
              <button
                onClick={handleRoastChat}
                className="premium-btn"
                style={{
                  flex: 1,
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.15)',
                  color: '#fff'
                }}
              >
                💬 Chat
              </button>
              <button
                onClick={resetForm}
                className="premium-btn"
                style={{
                  flex: 1,
                  background: 'linear-gradient(135deg, #FFD700, #FF4500)',
                  color: '#000'
                }}
              >
                🔄 Again
              </button>
            </div>

            {/* Share Prompt */}
            <p style={{
              fontSize: '0.8rem',
              color: 'rgba(255,255,255,0.4)',
              textAlign: 'center'
            }}>
              Screenshot & share on Instagram 📸
            </p>
          </div>
        )}

        {/* Roast Chat Modal */}
        {showRoastChat && (
          <RoastChat 
            subject={chatSubject}
            mood={chatMood}
            initialRoast={chatInitialRoast}
            onClose={() => setShowRoastChat(false)}
          />
        )}

        {/* Footer */}
        <footer style={{
          textAlign: 'center',
          padding: '40px 0 20px'
        }}>
          <p style={{
            fontSize: '0.75rem',
            color: 'rgba(255,255,255,0.3)'
          }}>
            AuraScore™ © 2025
          </p>
          <p style={{
            fontSize: '0.7rem',
            color: 'rgba(255,255,255,0.2)',
            marginTop: '4px'
          }}>
            Get roasted. Get humbled. Get better.
          </p>
        </footer>
      </div>
    </>
  );
         }
