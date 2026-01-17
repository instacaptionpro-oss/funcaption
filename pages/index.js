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

// Tier energy colors and effects
const tierEnergy = {
  legendary: {
    primary: '#FFD700',
    secondary: '#FFA500',
    glow: 'rgba(255, 215, 0, 0.6)',
    shadow: '0 0 60px rgba(255, 215, 0, 0.5), 0 0 100px rgba(255, 165, 0, 0.3)',
    gradient: 'linear-gradient(135deg, #FFD700, #FFA500, #FF8C00)',
    pulse: true
  },
  epic: {
    primary: '#A855F7',
    secondary: '#7C3AED',
    glow: 'rgba(168, 85, 247, 0.5)',
    shadow: '0 0 50px rgba(168, 85, 247, 0.4), 0 0 80px rgba(124, 58, 237, 0.3)',
    gradient: 'linear-gradient(135deg, #A855F7, #7C3AED, #6366F1)',
    pulse: true
  },
  mid: {
    primary: '#3B82F6',
    secondary: '#60A5FA',
    glow: 'rgba(59, 130, 246, 0.4)',
    shadow: '0 0 40px rgba(59, 130, 246, 0.3), 0 0 60px rgba(96, 165, 250, 0.2)',
    gradient: 'linear-gradient(135deg, #3B82F6, #60A5FA, #93C5FD)',
    pulse: false
  },
  noob: {
    primary: '#F97316',
    secondary: '#FB923C',
    glow: 'rgba(249, 115, 22, 0.4)',
    shadow: '0 0 40px rgba(249, 115, 22, 0.3), 0 0 60px rgba(251, 146, 60, 0.2)',
    gradient: 'linear-gradient(135deg, #F97316, #FB923C, #FDBA74)',
    pulse: false
  },
  npc: { // BOT
    primary: '#EF4444',
    secondary: '#DC2626',
    glow: 'rgba(239, 68, 68, 0.5)',
    shadow: '0 0 50px rgba(239, 68, 68, 0.4), 0 0 80px rgba(220, 38, 38, 0.3)',
    gradient: 'linear-gradient(135deg, #EF4444, #DC2626, #B91C1C)',
    pulse: true
  }
};

const sampleRoasts = [
  {
    name: "Elon Musk",
    score: 72,
    title: "MID",
    rarity: "mid",
    roast: "Bro bought Twitter to save free speech and mass fired everyone 💀 Rockets to Mars but cant figure out a social media app damn 😭"
  },
  {
    name: "Samay Raina",
    score: 68,
    title: "MID",
    rarity: "mid",
    roast: "Chess mein itna time lagata hai bhai comedy practice kab karega? 💀 India's Got Latent nahi India's Got Late hona chahiye bc 🔥"
  },
  {
    name: "Carry Minati",
    score: 82,
    title: "EPIC",
    rarity: "epic",
    roast: "Bhai itna chillata hai ki neighbors ne noise complaint nahi asylum referral di 💀 YouTube ne khud video delete kar di damn 😭"
  }
];

export default function Home() {
  const [name, setName] = useState('');
  const [subject, setSubject] = useState('');
  const [selectedMood, setSelectedMood] = useState('savage');
  const [language, setLanguage] = useState('hindi'); // DEFAULT HINDI
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
  const [cardVisible, setCardVisible] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSample(prev => (prev + 1) % sampleRoasts.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setRoastCount(prev => prev + Math.floor(Math.random() * 3));
      setActiveUsers(Math.floor(Math.random() * 30) + 15);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Card appear animation
  useEffect(() => {
    if (aura) {
      setCardVisible(false);
      setTimeout(() => setCardVisible(true), 100);
    }
  }, [aura]);

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
    setCardVisible(false);

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
        // Change NPC to BOT
        if (data.aura.rarity === 'npc') {
          data.aura.title = 'BOT';
        }
        setAura(data.aura);
        setRoastCount(prev => prev + 1);
      } else {
        setAura(data.fallback);
      }
    } catch (err) {
      setAura({
        score: Math.floor(Math.random() * 25),
        roast: "Tera energy itna weak hai ki server bhi crash ho gaya 💀 Exist karta hai ya loading screen hai tu bc 😭",
        subjectInsight: "Error 404: Aura not found",
        rarity: "npc",
        title: "BOT",
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
    setCardVisible(false);
    setTimeout(() => {
      setAura(null);
      setSubject('');
      setName('');
    }, 300);
  };

  const canSubmit = subject.trim() || name.trim();
  const sample = sampleRoasts[currentSample];
  const sampleEnergy = tierEnergy[sample.rarity] || tierEnergy.mid;
  const currentEnergy = aura ? (tierEnergy[aura.rarity] || tierEnergy.npc) : null;

  // Get display title (NPC -> BOT)
  const getDisplayTitle = (title, rarity) => {
    if (rarity === 'npc' || title === 'NPC') return 'BOT';
    return title;
  };

  return (
    <div>
      <Head>
        <title>AuraScore - AI Roast Generator | Get Brutally Roasted</title>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
        <meta name="description" content="Type any name and get brutally roasted by AI. Generate savage roast cards and share on Instagram." />
        <meta name="theme-color" content="#0f0f1a" />
        <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />
      </Head>

      {/* Background */}
      <div style={{
        position: 'fixed',
        inset: 0,
        background: 'linear-gradient(145deg, #0a0a12 0%, #12101f 30%, #0a0a12 60%, #0f0d18 100%)',
        zIndex: -3
      }} />
      <div style={{
        position: 'fixed',
        top: '-20%',
        left: '-10%',
        width: '500px',
        height: '500px',
        background: 'radial-gradient(circle, rgba(139, 92, 246, 0.12) 0%, transparent 60%)',
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
        background: 'radial-gradient(circle, rgba(251, 146, 60, 0.1) 0%, transparent 60%)',
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
        
        {!aura ? (
          <div>
            {/* Live Badge */}
            <div style={{ textAlign: 'center', marginTop: '16px', marginBottom: '24px' }}>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '10px',
                background: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid rgba(239, 68, 68, 0.25)',
                borderRadius: '100px',
                padding: '8px 18px'
              }}>
                <div style={{
                  width: '8px',
                  height: '8px',
                  background: '#ef4444',
                  borderRadius: '50%',
                  boxShadow: '0 0 12px rgba(239, 68, 68, 0.8)',
                  animation: 'pulse 1.5s infinite'
                }} />
                <span style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.85)', fontWeight: '500' }}>
                  {activeUsers} लोग अभी roast कर रहे हैं
                </span>
              </div>
            </div>

            {/* Hero */}
            <div style={{ textAlign: 'center', marginBottom: '28px' }}>
              <h1 style={{
                fontSize: '2.8rem',
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
              
              <div style={{
                background: 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '16px',
                padding: '18px 22px',
                marginBottom: '8px'
              }}>
                <p style={{
                  fontSize: '1.15rem',
                  color: '#fff',
                  fontWeight: '600',
                  margin: 0,
                  lineHeight: '1.5'
                }}>
                  कोई भी नाम डालो → AI बेइज्जती करेगा → Screenshot शेयर करो
                </p>
              </div>
              
              <p style={{
                fontSize: '0.85rem',
                color: 'rgba(255, 255, 255, 0.45)',
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
              gap: '8px',
              marginBottom: '28px'
            }}>
              {[
                { icon: '✍️', label: 'नाम डालो' },
                { icon: '🤖', label: 'AI Roasts' },
                { icon: '📸', label: 'Share करो' }
              ].map((item, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '6px'
                  }}>
                    <div style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '14px',
                      background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.2), rgba(236, 72, 153, 0.15))',
                      border: '1px solid rgba(139, 92, 246, 0.3)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1.3rem'
                    }}>
                      {item.icon}
                    </div>
                    <span style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.5)', fontWeight: '500' }}>
                      {item.label}
                    </span>
                  </div>
                  {i < 2 && (
                    <span style={{ color: 'rgba(255,255,255,0.2)', fontSize: '1rem', marginBottom: '22px' }}>→</span>
                  )}
                </div>
              ))}
            </div>

            {/* Sample Roast Card with Energy Effect */}
            <div style={{
              position: 'relative',
              marginBottom: '28px'
            }}>
              {/* Energy Glow Background */}
              <div style={{
                position: 'absolute',
                inset: '-4px',
                borderRadius: '24px',
                background: sampleEnergy.gradient,
                opacity: 0.15,
                filter: 'blur(20px)',
                animation: 'energyPulse 3s ease-in-out infinite',
                zIndex: 0
              }} />
              
              <div style={{
                position: 'relative',
                background: 'linear-gradient(145deg, rgba(20, 20, 30, 0.95) 0%, rgba(15, 15, 22, 0.98) 100%)',
                border: `1px solid ${sampleEnergy.primary}30`,
                borderRadius: '20px',
                padding: '20px',
                boxShadow: sampleEnergy.shadow,
                zIndex: 1,
                overflow: 'hidden'
              }}>
                {/* Animated Energy Lines */}
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: '2px',
                  background: `linear-gradient(90deg, transparent, ${sampleEnergy.primary}, transparent)`,
                  animation: 'energyLine 2s linear infinite'
                }} />

                {/* Example Badge */}
                <div style={{
                  position: 'absolute',
                  top: '12px',
                  right: '12px',
                  background: `${sampleEnergy.primary}25`,
                  border: `1px solid ${sampleEnergy.primary}50`,
                  borderRadius: '8px',
                  padding: '4px 12px',
                  fontSize: '0.65rem',
                  color: sampleEnergy.primary,
                  fontWeight: '700',
                  letterSpacing: '1px'
                }}>
                  EXAMPLE
                </div>

                {/* Content */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
                  <div style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: '12px',
                    background: sampleEnergy.gradient,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.3rem',
                    boxShadow: `0 0 20px ${sampleEnergy.glow}`
                  }}>
                    🔥
                  </div>
                  <div>
                    <div style={{ fontSize: '1.05rem', fontWeight: '700', color: '#fff' }}>
                      {sample.name}
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)' }}>
                      Score: {sample.score}/100 • <span style={{ color: sampleEnergy.primary, fontWeight: '600' }}>{getDisplayTitle(sample.title, sample.rarity)}</span>
                    </div>
                  </div>
                </div>

                <div style={{
                  background: 'rgba(0, 0, 0, 0.3)',
                  borderRadius: '12px',
                  padding: '14px 16px',
                  fontSize: '0.9rem',
                  color: 'rgba(255, 255, 255, 0.9)',
                  lineHeight: '1.6',
                  fontStyle: 'italic',
                  borderLeft: `3px solid ${sampleEnergy.primary}`
                }}>
                  "{sample.roast}"
                </div>

                {/* Dots */}
                <div style={{ display: 'flex', justifyContent: 'center', gap: '6px', marginTop: '14px' }}>
                  {sampleRoasts.map((_, i) => (
                    <div
                      key={i}
                      style={{
                        width: i === currentSample ? '24px' : '8px',
                        height: '8px',
                        borderRadius: '4px',
                        background: i === currentSample ? sampleEnergy.gradient : 'rgba(255,255,255,0.2)',
                        transition: 'all 0.4s ease',
                        boxShadow: i === currentSample ? `0 0 10px ${sampleEnergy.glow}` : 'none'
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Main Input Card */}
            <div style={{
              background: 'linear-gradient(145deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.01) 100%)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '24px',
              padding: '24px 20px',
              marginBottom: '20px'
            }}>
              
              {/* Main Input */}
              <div style={{ marginBottom: '20px' }}>
                <label style={{
                  display: 'block',
                  fontSize: '0.95rem',
                  fontWeight: '600',
                  color: '#fff',
                  marginBottom: '12px'
                }}>
                  🎯 किसे roast करना है?
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Celebrity, friend, या खुद का नाम..."
                  style={{
                    width: '100%',
                    background: 'rgba(0, 0, 0, 0.35)',
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
                    e.target.style.borderColor = 'rgba(251, 146, 60, 0.7)';
                    e.target.style.boxShadow = '0 0 0 4px rgba(251, 146, 60, 0.15), 0 0 30px rgba(251, 146, 60, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                    e.target.style.boxShadow = 'none';
                  }}
                />
              </div>

              {/* Trending */}
              <div style={{ marginBottom: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                  <span style={{ fontSize: '0.8rem', color: '#fb923c', fontWeight: '600' }}>🔥 TRENDING</span>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {trendingNames.map((trendName, i) => (
                    <button
                      key={i}
                      onClick={() => { setName(trendName); setSelectedMood('savage'); }}
                      style={{
                        padding: '10px 16px',
                        borderRadius: '10px',
                        background: 'rgba(251, 146, 60, 0.12)',
                        border: '1px solid rgba(251, 146, 60, 0.3)',
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

              {/* CTA Button */}
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
                  boxShadow: canSubmit && !loading ? '0 10px 40px rgba(245, 158, 11, 0.4), 0 0 60px rgba(249, 115, 22, 0.2)' : 'none',
                  transition: 'all 0.3s ease'
                }}
              >
                {loading ? '⏳ Roast Generate हो रहा है...' : '🔥 Roast Card बनाओ'}
              </button>

              {/* Advanced Options - More Visible */}
              <div style={{
                marginTop: '20px',
                background: 'rgba(139, 92, 246, 0.08)',
                border: '1px solid rgba(139, 92, 246, 0.2)',
                borderRadius: '16px',
                overflow: 'hidden'
              }}>
                <button
                  onClick={() => setShowAdvanced(!showAdvanced)}
                  style={{
                    width: '100%',
                    padding: '16px 20px',
                    background: 'transparent',
                    border: 'none',
                    color: '#a78bfa',
                    fontSize: '0.9rem',
                    fontWeight: '600',
                    cursor: 'pointer',
                    fontFamily: 'inherit',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                >
                  <span style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span>⚙️</span>
                    <span>Settings (Language, Mood, Context)</span>
                  </span>
                  <span style={{
                    transform: showAdvanced ? 'rotate(180deg)' : 'rotate(0deg)',
                    transition: 'transform 0.3s ease'
                  }}>
                    ▼
                  </span>
                </button>

                {showAdvanced && (
                  <div style={{
                    padding: '20px',
                    borderTop: '1px solid rgba(139, 92, 246, 0.15)',
                    background: 'rgba(0, 0, 0, 0.2)'
                  }}>
                    {/* Language */}
                    <div style={{ marginBottom: '20px' }}>
                      <label style={{
                        display: 'block',
                        fontSize: '0.8rem',
                        fontWeight: '600',
                        color: 'rgba(255, 255, 255, 0.6)',
                        marginBottom: '10px'
                      }}>
                        🌐 Language
                      </label>
                      <div style={{ display: 'flex', gap: '10px' }}>
                        {['hindi', 'english'].map((lang) => (
                          <button
                            key={lang}
                            onClick={() => setLanguage(lang)}
                            style={{
                              flex: 1,
                              padding: '14px',
                              border: 'none',
                              borderRadius: '12px',
                              fontSize: '0.95rem',
                              fontWeight: '600',
                              cursor: 'pointer',
                              fontFamily: 'inherit',
                              background: language === lang 
                                ? 'linear-gradient(135deg, #f59e0b, #f97316)' 
                                : 'rgba(255, 255, 255, 0.05)',
                              color: language === lang ? '#000' : 'rgba(255, 255, 255, 0.5)',
                              boxShadow: language === lang ? '0 4px 20px rgba(245, 158, 11, 0.3)' : 'none',
                              transition: 'all 0.2s ease'
                            }}
                          >
                            {lang === 'hindi' ? '🇮🇳 हिंदी' : '🇬🇧 English'}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Context */}
                    <div style={{ marginBottom: '20px' }}>
                      <label style={{
                        display: 'block',
                        fontSize: '0.8rem',
                        fontWeight: '600',
                        color: 'rgba(255, 255, 255, 0.6)',
                        marginBottom: '10px'
                      }}>
                        📝 Additional Context (Optional)
                      </label>
                      <textarea
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        placeholder="Unki habit, personality, career, looks..."
                        style={{
                          width: '100%',
                          background: 'rgba(0, 0, 0, 0.3)',
                          border: '1px solid rgba(255, 255, 255, 0.1)',
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
                        fontSize: '0.8rem',
                        fontWeight: '600',
                        color: 'rgba(255, 255, 255, 0.6)',
                        marginBottom: '10px'
                      }}>
                        🎭 Roast Energy
                      </label>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                        {moodOptions.map(mood => (
                          <button
                            key={mood.id}
                            onClick={() => selectMood(mood.id)}
                            style={{
                              padding: '10px 16px',
                              borderRadius: '10px',
                              background: selectedMood === mood.id 
                                ? 'linear-gradient(135deg, rgba(139, 92, 246, 0.3), rgba(236, 72, 153, 0.2))' 
                                : 'rgba(255, 255, 255, 0.04)',
                              border: selectedMood === mood.id 
                                ? '1px solid rgba(139, 92, 246, 0.5)' 
                                : '1px solid rgba(255, 255, 255, 0.08)',
                              color: selectedMood === mood.id ? '#a78bfa' : 'rgba(255, 255, 255, 0.6)',
                              fontSize: '0.85rem',
                              fontWeight: '600',
                              cursor: 'pointer',
                              fontFamily: 'inherit'
                            }}
                          >
                            {mood.emoji} {mood.label}
                          </button>
                        ))}
                        <button
                          onClick={() => setShowExtendedMoods(!showExtendedMoods)}
                          style={{
                            padding: '10px 16px',
                            borderRadius: '10px',
                            background: 'rgba(255, 255, 255, 0.04)',
                            border: '1px solid rgba(255, 255, 255, 0.08)',
                            color: 'rgba(255, 255, 255, 0.6)',
                            fontSize: '0.85rem',
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
                                padding: '8px 14px',
                                borderRadius: '8px',
                                background: selectedMood === mood.id 
                                  ? 'rgba(139, 92, 246, 0.2)' 
                                  : 'rgba(255, 255, 255, 0.03)',
                                border: '1px solid rgba(255, 255, 255, 0.06)',
                                color: selectedMood === mood.id ? '#a78bfa' : 'rgba(255,255,255,0.5)',
                                fontSize: '0.8rem',
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
            </div>

            {/* Stats */}
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '28px',
              marginBottom: '20px'
            }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{
                  fontSize: '1.4rem',
                  fontWeight: '700',
                  background: 'linear-gradient(135deg, #fbbf24, #f59e0b)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}>
                  {roastCount.toLocaleString()}+
                </div>
                <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)', fontWeight: '500' }}>
                  Roasts Generated
                </div>
              </div>
              <div style={{ width: '1px', height: '35px', background: 'rgba(255,255,255,0.1)' }} />
              <div style={{ textAlign: 'center' }}>
                <div style={{
                  fontSize: '1.4rem',
                  fontWeight: '700',
                  background: 'linear-gradient(135deg, #ec4899, #8b5cf6)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}>
                  1%
                </div>
                <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)', fontWeight: '500' }}>
                  Get Legendary
                </div>
              </div>
            </div>

            {/* Rarity */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.02)',
              border: '1px solid rgba(255, 255, 255, 0.05)',
              borderRadius: '16px',
              padding: '16px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '6px' }}>
                {[
                  { icon: '👑', label: 'LEGENDARY', pct: '1%', color: '#fbbf24' },
                  { icon: '⚡', label: 'EPIC', pct: '5%', color: '#a78bfa' },
                  { icon: '💫', label: 'MID', pct: '39%', color: '#3b82f6' },
                  { icon: '😬', label: 'NOOB', pct: '35%', color: '#fb923c' },
                  { icon: '🤖', label: 'BOT', pct: '20%', color: '#ef4444' }
                ].map((r, i) => (
                  <span key={i} style={{
                    padding: '6px 12px',
                    borderRadius: '8px',
                    fontSize: '0.65rem',
                    fontWeight: '700',
                    background: `${r.color}15`,
                    color: r.color,
                    border: `1px solid ${r.color}30`
                  }}>
                    {r.icon} {r.label} {r.pct}
                  </span>
                ))}
              </div>
            </div>

            {/* Trust */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginTop: '20px' }}>
              {['🔒 Anonymous', '⚡ Instant', '🎯 Brutal'].map((badge, i) => (
                <span key={i} style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.35)' }}>
                  {badge}
                </span>
              ))}
            </div>
          </div>
        ) : (
          /* Results with Energy Animation */
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '24px',
            paddingTop: '30px',
            opacity: cardVisible ? 1 : 0,
            transform: cardVisible ? 'translateY(0) scale(1)' : 'translateY(30px) scale(0.95)',
            transition: 'all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)'
          }}>
            {/* Energy Wrapper */}
            <div style={{ position: 'relative' }}>
              {/* Outer Energy Glow */}
              <div style={{
                position: 'absolute',
                inset: '-20px',
                borderRadius: '35px',
                background: currentEnergy?.gradient,
                opacity: 0.2,
                filter: 'blur(30px)',
                animation: currentEnergy?.pulse ? 'energyPulse 2s ease-in-out infinite' : 'none'
              }} />
              
              {/* Energy Ring */}
              <div style={{
                position: 'absolute',
                inset: '-3px',
                borderRadius: '28px',
                background: currentEnergy?.gradient,
                opacity: 0.6,
                animation: 'energyRotate 4s linear infinite'
              }} />
              
              {/* Card Container */}
              <div style={{
                position: 'relative',
                background: '#0f0f18',
                borderRadius: '25px',
                padding: '3px',
                boxShadow: currentEnergy?.shadow
              }}>
                <AuraCard aura={{...aura, title: getDisplayTitle(aura.title, aura.rarity)}} />
              </div>
              
              {/* Floating Particles */}
              <div style={{
                position: 'absolute',
                top: '10%',
                left: '-10px',
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                background: currentEnergy?.primary,
                boxShadow: `0 0 10px ${currentEnergy?.glow}`,
                animation: 'float 3s ease-in-out infinite'
              }} />
              <div style={{
                position: 'absolute',
                bottom: '20%',
                right: '-8px',
                width: '4px',
                height: '4px',
                borderRadius: '50%',
                background: currentEnergy?.secondary,
                boxShadow: `0 0 8px ${currentEnergy?.glow}`,
                animation: 'float 2.5s ease-in-out infinite 0.5s'
              }} />
            </div>

            {aura.isPublicFigure && (
              <div style={{ 
                padding: '14px 28px', 
                background: `linear-gradient(135deg, ${currentEnergy?.primary}15, ${currentEnergy?.secondary}10)`,
                border: `1px solid ${currentEnergy?.primary}40`,
                borderRadius: '16px',
                boxShadow: `0 0 30px ${currentEnergy?.glow}`
              }}>
                <p style={{ margin: 0, fontSize: '0.85rem', fontWeight: '700', color: currentEnergy?.primary, textAlign: 'center' }}>
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
                  color: '#fff',
                  transition: 'all 0.2s ease'
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
                  background: currentEnergy?.gradient,
                  color: '#000',
                  boxShadow: `0 6px 30px ${currentEnergy?.glow}`,
                  transition: 'all 0.2s ease'
                }}
              >
                🔄 Again
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

        <footer style={{ textAlign: 'center', padding: '40px 0 20px' }}>
          <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.25)' }}>AuraScore © 2025</p>
          <p style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.15)', marginTop: '4px' }}>
            Get roasted. Get humbled. Get better.
          </p>
        </footer>
      </div>

      {/* CSS Animations */}
      <style jsx global>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        
        @keyframes energyPulse {
          0%, 100% { opacity: 0.2; transform: scale(1); }
          50% { opacity: 0.35; transform: scale(1.05); }
        }
        
        @keyframes energyRotate {
          0% { opacity: 0.6; }
          50% { opacity: 0.3; }
          100% { opacity: 0.6; }
        }
        
        @keyframes energyLine {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-15px); }
        }
        
        input::placeholder, textarea::placeholder {
          color: rgba(255, 255, 255, 0.3);
        }
      `}</style>
    </div>
  );
    }
