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

// Sample roasts to show users what they'll get
const sampleRoasts = [
  {
    name: "Elon Musk",
    score: 72,
    title: "MID",
    roast: "Bro bought Twitter to save free speech and mass fired everyone 💀 Rockets to Mars but cant figure out a social media app. Richest man with impulse control of a toddler damn 😭",
    color: "#ffffff"
  },
  {
    name: "Samay Raina",
    score: 68,
    title: "MID", 
    roast: "Chess mein itna time lagata hai bhai comedy practice kab karega? 💀 India's Got Latent nahi India's Got Late hona chahiye naam bc 🔥",
    color: "#ffffff"
  },
  {
    name: "Carry Minati",
    score: 78,
    title: "EPIC",
    roast: "Bhai itna chillata hai ki neighbors ne noise complaint nahi asylum referral di 💀 Roaster itna powerful ki YouTube ne khud video delete kar di damn 😭",
    color: "#a78bfa"
  }
];

export default function Home() {
  const [name, setName] = useState('');
  const [subject, setSubject] = useState('');
  const [selectedMood, setSelectedMood] = useState('savage');
  const [language, setLanguage] = useState('english');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [showExtendedMoods, setShowExtendedMoods] = useState(false);
  const [loading, setLoading] = useState(false);
  const [aura, setAura] = useState(null);
  const [showRoastChat, setShowRoastChat] = useState(false);
  const [chatSubject, setChatSubject] = useState('');
  const [chatMood, setChatMood] = useState('');
  const [chatInitialRoast, setChatInitialRoast] = useState('');
  const [roastCount, setRoastCount] = useState(47832);
  const [activeUsers, setActiveUsers] = useState(23);
  const [currentSample, setCurrentSample] = useState(0);

  // Rotate sample roasts
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSample(prev => (prev + 1) % sampleRoasts.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // Update live counters
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
  const sample = sampleRoasts[currentSample];

  return (
    <div>
      <Head>
        <title>AuraScore - AI Roast Generator | Get Brutally Roasted</title>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
        <meta name="description" content="Type any name and get brutally roasted by AI. Generate savage roast cards and share on Instagram. 50K+ roasts generated!" />
        <meta name="theme-color" content="#0f0f1a" />
        <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />
      </Head>

      {/* Background */}
      <div style={{
        position: 'fixed',
        inset: 0,
        background: 'linear-gradient(145deg, #0f0f1a 0%, #1a1025 30%, #0f0f1a 60%, #151520 100%)',
        zIndex: -3
      }} />
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
        minHeight: '100vh',
        padding: '20px',
        maxWidth: '460px',
        margin: '0 auto',
        fontFamily: "'Outfit', sans-serif"
      }}>
        
        {/* Main Content */}
        {!aura ? (
          <div>
            {/* Live Badge */}
            <div style={{ textAlign: 'center', marginTop: '16px', marginBottom: '24px' }}>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '10px',
                background: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid rgba(239, 68, 68, 0.2)',
                borderRadius: '100px',
                padding: '8px 16px'
              }}>
                <div style={{
                  width: '8px',
                  height: '8px',
                  background: '#ef4444',
                  borderRadius: '50%',
                  boxShadow: '0 0 12px rgba(239, 68, 68, 0.6)'
                }} />
                <span style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.8)', fontWeight: '500' }}>
                  {activeUsers} people roasting now
                </span>
              </div>
            </div>

            {/* Hero Section */}
            <div style={{ textAlign: 'center', marginBottom: '28px' }}>
              <h1 style={{
                fontSize: '2.6rem',
                fontWeight: '800',
                letterSpacing: '-0.02em',
                marginBottom: '16px',
                background: 'linear-gradient(135deg, #f59e0b 0%, #f97316 25%, #ec4899 50%, #8b5cf6 75%, #6366f1 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}>
                AuraScore
              </h1>
              
              {/* Clear Value Proposition */}
              <div style={{
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '16px',
                padding: '16px 20px',
                marginBottom: '8px'
              }}>
                <p style={{
                  fontSize: '1.1rem',
                  color: '#fff',
                  fontWeight: '600',
                  margin: 0,
                  lineHeight: '1.5'
                }}>
                  Type any name → Get brutally roasted → Share the screenshot
                </p>
              </div>
              
              <p style={{
                fontSize: '0.85rem',
                color: 'rgba(255, 255, 255, 0.4)',
                marginTop: '12px'
              }}>
                AI generates savage roast cards for anyone 🔥
              </p>
            </div>

            {/* 3-Step Visual */}
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '12px',
              marginBottom: '28px'
            }}>
              {[
                { step: '1', icon: '✍️', label: 'Enter Name' },
                { step: '2', icon: '🤖', label: 'AI Roasts' },
                { step: '3', icon: '📸', label: 'Share Card' }
              ].map((item, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '6px'
                  }}>
                    <div style={{
                      width: '44px',
                      height: '44px',
                      borderRadius: '12px',
                      background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.2), rgba(236, 72, 153, 0.2))',
                      border: '1px solid rgba(139, 92, 246, 0.3)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1.2rem'
                    }}>
                      {item.icon}
                    </div>
                    <span style={{
                      fontSize: '0.7rem',
                      color: 'rgba(255, 255, 255, 0.5)',
                      fontWeight: '500'
                    }}>
                      {item.label}
                    </span>
                  </div>
                  {i < 2 && (
                    <span style={{ 
                      color: 'rgba(255, 255, 255, 0.2)', 
                      fontSize: '1.2rem',
                      marginBottom: '20px'
                    }}>
                      →
                    </span>
                  )}
                </div>
              ))}
            </div>

            {/* Sample Roast Card - Shows What User Will Get */}
            <div style={{
              background: 'linear-gradient(145deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '20px',
              padding: '20px',
              marginBottom: '24px',
              position: 'relative',
              overflow: 'hidden'
            }}>
              {/* Sample Badge */}
              <div style={{
                position: 'absolute',
                top: '12px',
                right: '12px',
                background: 'rgba(139, 92, 246, 0.2)',
                border: '1px solid rgba(139, 92, 246, 0.3)',
                borderRadius: '8px',
                padding: '4px 10px',
                fontSize: '0.65rem',
                color: '#a78bfa',
                fontWeight: '600',
                letterSpacing: '1px'
              }}>
                EXAMPLE
              </div>

              {/* Sample Content */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '10px',
                  background: 'linear-gradient(135deg, #f59e0b, #ec4899)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.2rem'
                }}>
                  🔥
                </div>
                <div>
                  <div style={{ 
                    fontSize: '1rem', 
                    fontWeight: '700', 
                    color: '#fff' 
                  }}>
                    {sample.name}
                  </div>
                  <div style={{ 
                    fontSize: '0.8rem', 
                    color: 'rgba(255, 255, 255, 0.5)' 
                  }}>
                    Score: {sample.score}/100 • <span style={{ color: sample.color }}>{sample.title}</span>
                  </div>
                </div>
              </div>

              <div style={{
                background: 'rgba(0, 0, 0, 0.2)',
                borderRadius: '12px',
                padding: '14px 16px',
                fontSize: '0.9rem',
                color: 'rgba(255, 255, 255, 0.85)',
                lineHeight: '1.6',
                fontStyle: 'italic'
              }}>
                "{sample.roast}"
              </div>

              {/* Dots indicator */}
              <div style={{
                display: 'flex',
                justifyContent: 'center',
                gap: '6px',
                marginTop: '14px'
              }}>
                {sampleRoasts.map((_, i) => (
                  <div
                    key={i}
                    style={{
                      width: i === currentSample ? '20px' : '6px',
                      height: '6px',
                      borderRadius: '3px',
                      background: i === currentSample 
                        ? 'linear-gradient(135deg, #f59e0b, #ec4899)' 
                        : 'rgba(255, 255, 255, 0.2)',
                      transition: 'all 0.3s ease'
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Main Input Card */}
            <div style={{
              background: 'linear-gradient(145deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.06)',
              borderRadius: '24px',
              padding: '24px 20px',
              marginBottom: '20px'
            }}>
              
              {/* Single Input - Name/Topic */}
              <div style={{ marginBottom: '20px' }}>
                <label style={{
                  display: 'block',
                  fontSize: '0.9rem',
                  fontWeight: '600',
                  color: 'rgba(255, 255, 255, 0.9)',
                  marginBottom: '12px'
                }}>
                  🎯 Who or what to roast?
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Celebrity, friend, yourself, or any topic..."
                  style={{
                    width: '100%',
                    background: 'rgba(0, 0, 0, 0.3)',
                    border: '2px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '14px',
                    padding: '18px 20px',
                    color: '#ffffff',
                    fontSize: '1rem',
                    outline: 'none',
                    fontFamily: 'inherit',
                    transition: 'all 0.3s ease'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = 'rgba(251, 146, 60, 0.6)';
                    e.target.style.boxShadow = '0 0 0 4px rgba(251, 146, 60, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                    e.target.style.boxShadow = 'none';
                  }}
                />
              </div>

              {/* Trending - Quick Taps */}
              <div style={{ marginBottom: '24px' }}>
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '8px', 
                  marginBottom: '10px' 
                }}>
                  <span style={{ fontSize: '0.75rem', color: 'rgba(251, 146, 60, 0.9)', fontWeight: '600' }}>
                    🔥 TRY THESE
                  </span>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {trendingNames.map((trendName, i) => (
                    <button
                      key={i}
                      onClick={() => { setName(trendName); setSelectedMood('savage'); }}
                      style={{
                        padding: '10px 16px',
                        borderRadius: '10px',
                        background: 'rgba(251, 146, 60, 0.1)',
                        border: '1px solid rgba(251, 146, 60, 0.25)',
                        color: '#fb923c',
                        fontSize: '0.85rem',
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

              {/* Main CTA Button */}
              <button
                onClick={generateAura}
                disabled={loading || !canSubmit}
                style={{
                  width: '100%',
                  padding: '20px 32px',
                  border: 'none',
                  borderRadius: '16px',
                  fontSize: '1.15rem',
                  fontWeight: '700',
                  cursor: canSubmit && !loading ? 'pointer' : 'not-allowed',
                  fontFamily: 'inherit',
                  background: canSubmit && !loading
                    ? 'linear-gradient(135deg, #f59e0b 0%, #f97316 50%, #ea580c 100%)'
                    : 'rgba(255, 255, 255, 0.05)',
                  color: canSubmit && !loading ? '#000' : 'rgba(255, 255, 255, 0.3)',
                  boxShadow: canSubmit && !loading ? '0 10px 40px rgba(245, 158, 11, 0.4)' : 'none',
                  transition: 'all 0.3s ease',
                  letterSpacing: '0.5px'
                }}
              >
                {loading ? '⏳ Generating Roast...' : '🔥 Generate Roast Card'}
              </button>

              {/* Advanced Options Toggle */}
              <button
                onClick={() => setShowAdvanced(!showAdvanced)}
                style={{
                  width: '100%',
                  marginTop: '16px',
                  padding: '12px',
                  background: 'transparent',
                  border: 'none',
                  color: 'rgba(255, 255, 255, 0.4)',
                  fontSize: '0.85rem',
                  fontWeight: '500',
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px'
                }}
              >
                <span>{showAdvanced ? '▼' : '▶'}</span>
                Advanced Options (Language, Mood, Context)
              </button>

              {/* Advanced Options Panel */}
              {showAdvanced && (
                <div style={{
                  marginTop: '16px',
                  padding: '20px',
                  background: 'rgba(0, 0, 0, 0.2)',
                  borderRadius: '16px',
                  border: '1px solid rgba(255, 255, 255, 0.05)'
                }}>
                  {/* Language */}
                  <div style={{ marginBottom: '20px' }}>
                    <label style={{
                      display: 'block',
                      fontSize: '0.75rem',
                      fontWeight: '600',
                      color: 'rgba(255, 255, 255, 0.5)',
                      textTransform: 'uppercase',
                      letterSpacing: '1px',
                      marginBottom: '10px'
                    }}>
                      Language
                    </label>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      {['english', 'hindi'].map((lang) => (
                        <button
                          key={lang}
                          onClick={() => setLanguage(lang)}
                          style={{
                            flex: 1,
                            padding: '12px',
                            border: 'none',
                            borderRadius: '10px',
                            fontSize: '0.9rem',
                            fontWeight: '600',
                            cursor: 'pointer',
                            fontFamily: 'inherit',
                            background: language === lang 
                              ? 'linear-gradient(135deg, #f59e0b, #f97316)' 
                              : 'rgba(255, 255, 255, 0.05)',
                            color: language === lang ? '#000' : 'rgba(255, 255, 255, 0.5)'
                          }}
                        >
                          {lang === 'english' ? '🇬🇧 English' : '🇮🇳 हिंदी'}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Additional Context */}
                  <div style={{ marginBottom: '20px' }}>
                    <label style={{
                      display: 'block',
                      fontSize: '0.75rem',
                      fontWeight: '600',
                      color: 'rgba(255, 255, 255, 0.5)',
                      textTransform: 'uppercase',
                      letterSpacing: '1px',
                      marginBottom: '10px'
                    }}>
                      Additional Context (Optional)
                    </label>
                    <textarea
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      placeholder="Their habit, personality, career, looks..."
                      style={{
                        width: '100%',
                        background: 'rgba(0, 0, 0, 0.2)',
                        border: '1px solid rgba(255, 255, 255, 0.08)',
                        borderRadius: '12px',
                        padding: '14px 16px',
                        color: '#ffffff',
                        fontSize: '0.95rem',
                        outline: 'none',
                        minHeight: '80px',
                        resize: 'none',
                        fontFamily: 'inherit'
                      }}
                    />
                  </div>

                  {/* Mood */}
                  <div>
                    <label style={{
                      display: 'block',
                      fontSize: '0.75rem',
                      fontWeight: '600',
                      color: 'rgba(255, 255, 255, 0.5)',
                      textTransform: 'uppercase',
                      letterSpacing: '1px',
                      marginBottom: '10px'
                    }}>
                      Roast Energy
                    </label>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                      {moodOptions.map(mood => (
                        <button
                          key={mood.id}
                          onClick={() => selectMood(mood.id)}
                          style={{
                            padding: '10px 14px',
                            borderRadius: '10px',
                            background: selectedMood === mood.id 
                              ? 'linear-gradient(135deg, rgba(139, 92, 246, 0.3), rgba(236, 72, 153, 0.2))' 
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
                      <button
                        onClick={() => setShowExtendedMoods(!showExtendedMoods)}
                        style={{
                          padding: '10px 14px',
                          borderRadius: '10px',
                          background: 'rgba(255, 255, 255, 0.03)',
                          border: '1px solid rgba(255, 255, 255, 0.06)',
                          color: 'rgba(255, 255, 255, 0.5)',
                          fontSize: '0.8rem',
                          fontWeight: '600',
                          cursor: 'pointer',
                          fontFamily: 'inherit'
                        }}
                      >
                        ➕ More
                      </button>
                    </div>

                    {showExtendedMoods && (
                      <div style={{ marginTop: '10px', display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                        {extendedMoods.map(mood => (
                          <button
                            key={mood.id}
                            onClick={() => selectMood(mood.id)}
                            style={{
                              padding: '8px 12px',
                              borderRadius: '8px',
                              background: selectedMood === mood.id 
                                ? 'linear-gradient(135deg, rgba(139, 92, 246, 0.3), rgba(236, 72, 153, 0.2))' 
                                : 'rgba(255, 255, 255, 0.03)',
                              border: selectedMood === mood.id 
                                ? '1px solid rgba(139, 92, 246, 0.5)' 
                                : '1px solid rgba(255, 255, 255, 0.06)',
                              color: selectedMood === mood.id ? '#a78bfa' : 'rgba(255, 255, 255, 0.4)',
                              fontSize: '0.75rem',
                              fontWeight: '600',
                              cursor: 'pointer',
                              fontFamily: 'inherit'
                            }}
                          >
                            {mood.emoji} {mood.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Stats & Trust */}
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '24px',
              marginBottom: '20px'
            }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{
                  fontSize: '1.3rem',
                  fontWeight: '700',
                  background: 'linear-gradient(135deg, #fbbf24, #f59e0b)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text'
                }}>
                  {roastCount.toLocaleString()}+
                </div>
                <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)', fontWeight: '500' }}>
                  Roasts Generated
                </div>
              </div>
              <div style={{ width: '1px', height: '30px', background: 'rgba(255,255,255,0.1)' }} />
              <div style={{ textAlign: 'center' }}>
                <div style={{
                  fontSize: '1.3rem',
                  fontWeight: '700',
                  background: 'linear-gradient(135deg, #ec4899, #8b5cf6)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text'
                }}>
                  1%
                </div>
                <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)', fontWeight: '500' }}>
                  Get Legendary
                </div>
              </div>
            </div>

            {/* Rarity Info */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.02)',
              border: '1px solid rgba(255, 255, 255, 0.04)',
              borderRadius: '16px',
              padding: '16px',
              marginBottom: '20px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '6px' }}>
                {[
                  { icon: '👑', label: 'LEGENDARY', pct: '1%', color: '#fbbf24' },
                  { icon: '⚡', label: 'EPIC', pct: '5%', color: '#a78bfa' },
                  { icon: '💫', label: 'MID', pct: '39%', color: '#fff' },
                  { icon: '😬', label: 'NOOB', pct: '35%', color: '#fb923c' },
                  { icon: '💀', label: 'NPC', pct: '20%', color: '#f87171' }
                ].map((r, i) => (
                  <span key={i} style={{
                    padding: '5px 10px',
                    borderRadius: '6px',
                    fontSize: '0.6rem',
                    fontWeight: '700',
                    background: 'rgba(255, 255, 255, 0.05)',
                    color: r.color
                  }}>
                    {r.icon} {r.label} {r.pct}
                  </span>
                ))}
              </div>
            </div>

            {/* Trust Badges */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '20px' }}>
              {['🔒 Anonymous', '⚡ Instant', '🎯 Brutal'].map((badge, i) => (
                <span key={i} style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.35)' }}>
                  {badge}
                </span>
              ))}
            </div>
          </div>
        ) : (
          /* Results */
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '24px', paddingTop: '20px' }}>
            <AuraCard aura={aura} />
            
            {aura.isPublicFigure && (
              <div style={{ 
                padding: '14px 28px', 
                background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.1), rgba(236, 72, 153, 0.1))', 
                border: '1px solid rgba(139, 92, 246, 0.3)', 
                borderRadius: '16px'
              }}>
                <p style={{ margin: 0, fontSize: '0.85rem', fontWeight: '700', color: '#a78bfa', textAlign: 'center' }}>
                  {aura.publicFigureStatus === 'peak' && '👑 PUBLIC FIGURE AT PEAK'}
                  {aura.publicFigureStatus === 'stable' && '⚡ ESTABLISHED FIGURE'}
                  {aura.publicFigureStatus === 'falling' && '📉 FALLING FROM GRACE'}
                </p>
              </div>
            )}
            
            <div style={{ display: 'flex', gap: '12px', width: '100%', maxWidth: '340px' }}>
              <button
                onClick={handleRoastChat}
                style={{
                  flex: 1,
                  padding: '16px 24px',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  borderRadius: '14px',
                  fontSize: '0.95rem',
                  fontWeight: '700',
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                  background: 'rgba(255, 255, 255, 0.05)',
                  color: '#fff'
                }}
              >
                💬 More Roasts
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
                🔄 Try Again
              </button>
            </div>

            <p style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)', textAlign: 'center' }}>
              📸 Screenshot & share on Instagram
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
        <footer style={{ textAlign: 'center', padding: '40px 0 20px' }}>
          <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.25)' }}>AuraScore © 2025</p>
          <p style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.15)', marginTop: '4px' }}>
            Get roasted. Get humbled. Get better.
          </p>
        </footer>
      </div>
    </div>
  );
         }
