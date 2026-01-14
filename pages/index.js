import { useState, useEffect } from 'react';
import Head from 'next/head';
import AuraCard from '../components/AuraCard';
import RoastChat from '../components/RoastChat';

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

const trendingNames = ["Samay Raina", "Carry Minati", "Dhoni", "Virat Kohli", "Elon Musk"];

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
  const [roastCount, setRoastCount] = useState(47832);
  const [activeUsers, setActiveUsers] = useState(23);

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
      setAura({
        score: Math.floor(Math.random() * 60),
        roast: "Your energy crashed our servers. That is how weak it is. 💀",
        subjectInsight: "Error 404: Aura not found",
        rarity: "npc",
        title: "NPC",
        challenge: "SYSTEM COULD NOT HANDLE YOUR AVERAGE ENERGY."
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
    <div>
      <Head>
        <title>AuraScore - The Ultimate Roast Experience</title>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
        <meta name="description" content="Get your aura scored and brutally roasted by AI." />
        <meta name="theme-color" content="#0f0f1a" />
        <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />
      </Head>

      {/* Animated Background */}
      <div style={{
        position: 'fixed',
        inset: 0,
        background: 'linear-gradient(145deg, #0f0f1a 0%, #1a1025 30%, #0f0f1a 60%, #151520 100%)',
        zIndex: -3
      }} />
      
      {/* Gradient Orbs */}
      <div style={{
        position: 'fixed',
        top: '-20%',
        left: '-10%',
        width: '500px',
        height: '500px',
        background: 'radial-gradient(circle, rgba(139, 92, 246, 0.15) 0%, transparent 60%)',
        borderRadius: '50%',
        filter: 'blur(80px)',
        zIndex: -1
      }} />
      <div style={{
        position: 'fixed',
        top: '40%',
        right: '-15%',
        width: '400px',
        height: '400px',
        background: 'radial-gradient(circle, rgba(251, 146, 60, 0.12) 0%, transparent 60%)',
        borderRadius: '50%',
        filter: 'blur(80px)',
        zIndex: -1
      }} />
      <div style={{
        position: 'fixed',
        bottom: '-10%',
        left: '30%',
        width: '350px',
        height: '350px',
        background: 'radial-gradient(circle, rgba(236, 72, 153, 0.1) 0%, transparent 60%)',
        borderRadius: '50%',
        filter: 'blur(80px)',
        zIndex: -1
      }} />

      {/* Noise Texture Overlay */}
      <div style={{
        position: 'fixed',
        inset: 0,
        opacity: 0.03,
        background: 'url("data:image/svg+xml,%3Csvg viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg"%3E%3Cfilter id="noise"%3E%3CfeTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="4" stitchTiles="stitch"/%3E%3C/filter%3E%3Crect width="100%" height="100%" filter="url(%23noise)"/%3E%3C/svg%3E")',
        zIndex: -1
      }} />

      <div style={{ 
        minHeight: '100vh',
        padding: '24px 20px',
        maxWidth: '460px',
        margin: '0 auto',
        fontFamily: "'Outfit', sans-serif"
      }}>
        
        {/* Header */}
        <header style={{ textAlign: 'center', paddingTop: '20px', paddingBottom: '32px' }}>
          
          {/* Live Badge */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '10px',
            background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.1) 0%, rgba(239, 68, 68, 0.05) 100%)',
            border: '1px solid rgba(239, 68, 68, 0.2)',
            borderRadius: '100px',
            padding: '8px 16px',
            marginBottom: '28px',
            backdropFilter: 'blur(10px)'
          }}>
            <div style={{
              width: '8px',
              height: '8px',
              background: '#ef4444',
              borderRadius: '50%',
              boxShadow: '0 0 12px rgba(239, 68, 68, 0.6)'
            }} />
            <span style={{ 
              fontSize: '0.8rem', 
              color: 'rgba(255, 255, 255, 0.8)', 
              fontWeight: '500',
              letterSpacing: '0.3px'
            }}>
              {activeUsers} people roasting now
            </span>
          </div>

          {/* Logo */}
          <h1 style={{
            fontSize: '2.8rem',
            fontWeight: '800',
            letterSpacing: '-0.02em',
            marginBottom: '12px',
            background: 'linear-gradient(135deg, #f59e0b 0%, #f97316 25%, #ec4899 50%, #8b5cf6 75%, #6366f1 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            backgroundSize: '200% 200%'
          }}>
            AuraScore
          </h1>
          
          <p style={{
            fontSize: '1rem',
            color: 'rgba(255, 255, 255, 0.5)',
            fontWeight: '400',
            marginBottom: '32px',
            letterSpacing: '0.5px'
          }}>
            The AI that roasts without mercy
          </p>

          {/* Stats */}
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '40px'
          }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{
                fontSize: '1.6rem',
                fontWeight: '700',
                background: 'linear-gradient(135deg, #fbbf24, #f59e0b)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}>
                {roastCount.toLocaleString()}
              </div>
              <div style={{
                fontSize: '0.7rem',
                color: 'rgba(255, 255, 255, 0.4)',
                textTransform: 'uppercase',
                letterSpacing: '1.5px',
                marginTop: '4px',
                fontWeight: '500'
              }}>
                Roasts
              </div>
            </div>
            
            <div style={{
              width: '1px',
              height: '40px',
              background: 'linear-gradient(180deg, transparent, rgba(255,255,255,0.15), transparent)'
            }} />
            
            <div style={{ textAlign: 'center' }}>
              <div style={{
                fontSize: '1.6rem',
                fontWeight: '700',
                background: 'linear-gradient(135deg, #ec4899, #8b5cf6)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}>
                1%
              </div>
              <div style={{
                fontSize: '0.7rem',
                color: 'rgba(255, 255, 255, 0.4)',
                textTransform: 'uppercase',
                letterSpacing: '1.5px',
                marginTop: '4px',
                fontWeight: '500'
              }}>
                Legendary
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        {!aura ? (
          <div>
            {/* Main Card */}
            <div style={{
              background: 'linear-gradient(145deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.06)',
              borderRadius: '28px',
              padding: '28px 24px',
              marginBottom: '20px',
              boxShadow: '0 20px 50px rgba(0, 0, 0, 0.3)'
            }}>
              
              {/* Language Toggle */}
              <div style={{ marginBottom: '28px' }}>
                <label style={{
                  display: 'block',
                  fontSize: '0.75rem',
                  fontWeight: '600',
                  color: 'rgba(255, 255, 255, 0.4)',
                  textTransform: 'uppercase',
                  letterSpacing: '1.5px',
                  marginBottom: '14px'
                }}>
                  Language
                </label>
                <div style={{
                  display: 'flex',
                  background: 'rgba(0, 0, 0, 0.2)',
                  borderRadius: '14px',
                  padding: '5px',
                  gap: '5px'
                }}>
                  {['english', 'hindi'].map((lang) => (
                    <button
                      key={lang}
                      onClick={() => setLanguage(lang)}
                      style={{
                        flex: 1,
                        padding: '14px 20px',
                        border: 'none',
                        borderRadius: '11px',
                        fontSize: '0.9rem',
                        fontWeight: '600',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        fontFamily: 'inherit',
                        background: language === lang 
                          ? 'linear-gradient(135deg, rgba(251, 146, 60, 0.9), rgba(245, 158, 11, 0.9))' 
                          : 'transparent',
                        color: language === lang ? '#000' : 'rgba(255, 255, 255, 0.5)',
                        boxShadow: language === lang ? '0 4px 15px rgba(251, 146, 60, 0.3)' : 'none'
                      }}
                    >
                      {lang === 'english' ? '🇬🇧 English' : '🇮🇳 हिंदी'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Name Input */}
              <div style={{ marginBottom: '24px' }}>
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  marginBottom: '14px' 
                }}>
                  <label style={{
                    fontSize: '0.75rem',
                    fontWeight: '600',
                    color: 'rgba(255, 255, 255, 0.4)',
                    textTransform: 'uppercase',
                    letterSpacing: '1.5px'
                  }}>
                    Who to roast?
                  </label>
                  <span style={{
                    fontSize: '0.65rem',
                    color: '#fbbf24',
                    background: 'rgba(251, 191, 36, 0.1)',
                    padding: '4px 10px',
                    borderRadius: '6px',
                    fontWeight: '600',
                    letterSpacing: '0.5px'
                  }}>
                    OPTIONAL
                  </span>
                </div>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Celebrity, friend, or yourself..."
                  style={{
                    width: '100%',
                    background: 'rgba(0, 0, 0, 0.25)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    borderRadius: '14px',
                    padding: '16px 20px',
                    color: '#ffffff',
                    fontSize: '1rem',
                    outline: 'none',
                    fontFamily: 'inherit',
                    transition: 'all 0.3s ease'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = 'rgba(251, 146, 60, 0.5)';
                    e.target.style.boxShadow = '0 0 0 3px rgba(251, 146, 60, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = 'rgba(255, 255, 255, 0.08)';
                    e.target.style.boxShadow = 'none';
                  }}
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
                  <span style={{ fontSize: '0.7rem', color: 'rgba(251, 146, 60, 0.8)', fontWeight: '600', letterSpacing: '1px' }}>
                    🔥 TRENDING
                  </span>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {trendingNames.map((trendName, i) => (
                    <button
                      key={i}
                      onClick={() => { setName(trendName); setSelectedMood('savage'); }}
                      style={{
                        padding: '10px 16px',
                        borderRadius: '12px',
                        background: 'rgba(251, 146, 60, 0.08)',
                        border: '1px solid rgba(251, 146, 60, 0.2)',
                        color: '#fb923c',
                        fontSize: '0.8rem',
                        fontWeight: '600',
                        cursor: 'pointer',
                        fontFamily: 'inherit',
                        transition: 'all 0.2s ease'
                      }}
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
                margin: '32px 0'
              }}>
                <div style={{ 
                  flex: 1, 
                  height: '1px', 
                  background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)' 
                }} />
                <span style={{ 
                  color: 'rgba(255,255,255,0.25)', 
                  fontSize: '0.7rem',
                  fontWeight: '600',
                  letterSpacing: '2px'
                }}>
                  AND / OR
                </span>
                <div style={{ 
                  flex: 1, 
                  height: '1px', 
                  background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)' 
                }} />
              </div>

              {/* Subject Input */}
              <div style={{ marginBottom: '28px' }}>
                <label style={{
                  display: 'block',
                  fontSize: '0.75rem',
                  fontWeight: '600',
                  color: 'rgba(255, 255, 255, 0.4)',
                  textTransform: 'uppercase',
                  letterSpacing: '1.5px',
                  marginBottom: '14px'
                }}>
                  What to roast about?
                </label>
                <textarea
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Their habit, personality, career, looks, anything..."
                  style={{
                    width: '100%',
                    background: 'rgba(0, 0, 0, 0.25)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    borderRadius: '14px',
                    padding: '16px 20px',
                    color: '#ffffff',
                    fontSize: '1rem',
                    outline: 'none',
                    minHeight: '110px',
                    resize: 'none',
                    lineHeight: '1.6',
                    fontFamily: 'inherit',
                    transition: 'all 0.3s ease'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = 'rgba(139, 92, 246, 0.5)';
                    e.target.style.boxShadow = '0 0 0 3px rgba(139, 92, 246, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = 'rgba(255, 255, 255, 0.08)';
                    e.target.style.boxShadow = 'none';
                  }}
                />
              </div>

              {/* Mood Selection */}
              <div style={{ marginBottom: '32px' }}>
                <label style={{
                  display: 'block',
                  fontSize: '0.75rem',
                  fontWeight: '600',
                  color: 'rgba(255, 255, 255, 0.4)',
                  textTransform: 'uppercase',
                  letterSpacing: '1.5px',
                  marginBottom: '14px'
                }}>
                  Roast Energy
                </label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                  {moodOptions.map(mood => (
                    <button
                      key={mood.id}
                      onClick={() => selectMood(mood.id)}
                      style={{
                        padding: '12px 18px',
                        borderRadius: '12px',
                        background: selectedMood === mood.id 
                          ? 'linear-gradient(135deg, rgba(139, 92, 246, 0.25), rgba(236, 72, 153, 0.2))' 
                          : 'rgba(255, 255, 255, 0.03)',
                        border: selectedMood === mood.id 
                          ? '1px solid rgba(139, 92, 246, 0.5)' 
                          : '1px solid rgba(255, 255, 255, 0.06)',
                        color: selectedMood === mood.id ? '#a78bfa' : 'rgba(255, 255, 255, 0.6)',
                        fontSize: '0.85rem',
                        fontWeight: '600',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        fontFamily: 'inherit',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      <span>{mood.emoji}</span>
                      <span>{mood.label}</span>
                    </button>
                  ))}
                  <button
                    onClick={() => setShowExtendedMoods(!showExtendedMoods)}
                    style={{
                      padding: '12px 18px',
                      borderRadius: '12px',
                      background: showExtendedMoods 
                        ? 'linear-gradient(135deg, rgba(139, 92, 246, 0.25), rgba(236, 72, 153, 0.2))' 
                        : 'rgba(255, 255, 255, 0.03)',
                      border: showExtendedMoods 
                        ? '1px solid rgba(139, 92, 246, 0.5)' 
                        : '1px solid rgba(255, 255, 255, 0.06)',
                      color: showExtendedMoods ? '#a78bfa' : 'rgba(255, 255, 255, 0.6)',
                      fontSize: '0.85rem',
                      fontWeight: '600',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      fontFamily: 'inherit',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <span>✨</span>
                    <span>More</span>
                  </button>
                </div>

                {showExtendedMoods && (
                  <div style={{
                    marginTop: '14px',
                    padding: '16px',
                    background: 'rgba(0, 0, 0, 0.2)',
                    borderRadius: '16px',
                    border: '1px solid rgba(255, 255, 255, 0.04)'
                  }}>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                      {extendedMoods.map(mood => (
                        <button
                          key={mood.id}
                          onClick={() => selectMood(mood.id)}
                          style={{
                            padding: '10px 16px',
                            borderRadius: '10px',
                            background: selectedMood === mood.id 
                              ? 'linear-gradient(135deg, rgba(139, 92, 246, 0.25), rgba(236, 72, 153, 0.2))' 
                              : 'rgba(255, 255, 255, 0.03)',
                            border: selectedMood === mood.id 
                              ? '1px solid rgba(139, 92, 246, 0.5)' 
                              : '1px solid rgba(255, 255, 255, 0.06)',
                            color: selectedMood === mood.id ? '#a78bfa' : 'rgba(255, 255, 255, 0.5)',
                            fontSize: '0.8rem',
                            fontWeight: '600',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            fontFamily: 'inherit'
                          }}
                        >
                          <span>{mood.emoji}</span>
                          <span>{mood.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <button
                onClick={generateAura}
                disabled={loading || !canSubmit}
                style={{
                  width: '100%',
                  padding: '18px 32px',
                  border: 'none',
                  borderRadius: '16px',
                  fontSize: '1.05rem',
                  fontWeight: '700',
                  cursor: canSubmit && !loading ? 'pointer' : 'not-allowed',
                  fontFamily: 'inherit',
                  background: canSubmit && !loading
                    ? 'linear-gradient(135deg, #f59e0b 0%, #f97316 50%, #ea580c 100%)'
                    : 'rgba(255, 255, 255, 0.05)',
                  color: canSubmit && !loading ? '#000' : 'rgba(255, 255, 255, 0.3)',
                  boxShadow: canSubmit && !loading ? '0 8px 30px rgba(245, 158, 11, 0.35)' : 'none',
                  transition: 'all 0.3s ease',
                  letterSpacing: '0.5px'
                }}
              >
                {loading ? '⏳ Analyzing Your Aura...' : '🔥 Get Roasted'}
              </button>
            </div>

            {/* Rarity Card */}
            <div style={{
              background: 'linear-gradient(145deg, rgba(255,255,255,0.02) 0%, rgba(255,255,255,0.01) 100%)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.04)',
              borderRadius: '20px',
              padding: '20px 16px',
              marginBottom: '20px'
            }}>
              <div style={{ 
                textAlign: 'center', 
                marginBottom: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}>
                <span style={{ fontSize: '1rem' }}>🎰</span>
                <span style={{ 
                  fontSize: '0.7rem', 
                  fontWeight: '700', 
                  color: 'rgba(255,255,255,0.5)',
                  letterSpacing: '1.5px'
                }}>
                  RARITY ODDS
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '8px' }}>
                {[
                  { icon: '👑', label: 'LEGENDARY', pct: '1%', bg: 'rgba(251, 191, 36, 0.15)', color: '#fbbf24' },
                  { icon: '⚡', label: 'EPIC', pct: '5%', bg: 'rgba(139, 92, 246, 0.15)', color: '#a78bfa' },
                  { icon: '💫', label: 'MID', pct: '39%', bg: 'rgba(255, 255, 255, 0.08)', color: '#fff' },
                  { icon: '😬', label: 'NOOB', pct: '35%', bg: 'rgba(251, 146, 60, 0.15)', color: '#fb923c' },
                  { icon: '💀', label: 'NPC', pct: '20%', bg: 'rgba(239, 68, 68, 0.15)', color: '#f87171' }
                ].map((r, i) => (
                  <span key={i} style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '5px',
                    padding: '6px 12px',
                    borderRadius: '8px',
                    fontSize: '0.65rem',
                    fontWeight: '700',
                    letterSpacing: '0.5px',
                    background: r.bg,
                    color: r.color
                  }}>
                    {r.icon} {r.label} {r.pct}
                  </span>
                ))}
              </div>
            </div>

            {/* Trust Badges */}
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '24px',
              marginTop: '24px'
            }}>
              {['🔒 Anonymous', '⚡ Instant', '🎯 Brutal'].map((badge, i) => (
                <span key={i} style={{ 
                  fontSize: '0.75rem', 
                  color: 'rgba(255,255,255,0.35)',
                  fontWeight: '500'
                }}>
                  {badge}
                </span>
              ))}
            </div>
          </div>
        ) : (
          /* Results */
          <div style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            gap: '24px' 
          }}>
            <AuraCard aura={aura} />
            
            {aura.isPublicFigure && (
              <div style={{ 
                padding: '14px 28px', 
                background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.1), rgba(236, 72, 153, 0.1))', 
                border: '1px solid rgba(139, 92, 246, 0.3)', 
                borderRadius: '16px',
                backdropFilter: 'blur(10px)'
              }}>
                <p style={{ 
                  margin: 0, 
                  fontSize: '0.85rem', 
                  fontWeight: '700', 
                  color: '#a78bfa', 
                  textAlign: 'center',
                  letterSpacing: '0.5px'
                }}>
                  {aura.publicFigureStatus === 'peak' && '👑 PUBLIC FIGURE AT PEAK'}
                  {aura.publicFigureStatus === 'stable' && '⚡ ESTABLISHED FIGURE'}
                  {aura.publicFigureStatus === 'falling' && '📉 FALLING FROM GRACE'}
                </p>
              </div>
            )}
            
            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: '12px', width: '100%', maxWidth: '340px' }}>
              <button
                onClick={handleRoastChat}
                style={{
                  flex: 1,
                  padding: '16px 24px',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  borderRadius: '14px',
                  fontSize: '0.95rem',
                  fontWeight: '700',
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                  background: 'rgba(255, 255, 255, 0.04)',
                  color: '#fff',
                  backdropFilter: 'blur(10px)'
                }}
              >
                💬 Chat
              </button>
              <button
                onClick={resetForm}
                style={{
                  flex: 1,
                  padding: '16px 24px',
                  border: 'none',
                  borderRadius: '14px',
                  fontSize: '0.95rem',
                  fontWeight: '700',
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                  background: 'linear-gradient(135deg, #f59e0b, #f97316)',
                  color: '#000',
                  boxShadow: '0 6px 25px rgba(245, 158, 11, 0.3)'
                }}
              >
                🔄 Again
              </button>
            </div>

            <p style={{ 
              fontSize: '0.8rem', 
              color: 'rgba(255,255,255,0.35)', 
              textAlign: 'center' 
            }}>
              Screenshot & share on Instagram 📸
            </p>
          </div>
        )}

        {showRoastChat && (
          <RoastChat 
            subject={chatSubject}
            mood={chatMood}
            initialRoast={chatInitialRoast}
            onClose={() => setShowRoastChat(false)}
          />
        )}

        {/* Footer */}
        <footer style={{ textAlign: 'center', padding: '48px 0 24px' }}>
          <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.25)', fontWeight: '500' }}>
            AuraScore © 2025
          </p>
          <p style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.15)', marginTop: '6px' }}>
            Get roasted. Get humbled. Get better.
          </p>
        </footer>
      </div>
    </div>
  );
                    }
