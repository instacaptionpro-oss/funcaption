import { useState, useEffect } from 'react';
import Head from 'next/head';
import AuraCard from '../components/AuraCard';
import RoastChat from '../components/RoastChat';

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

const tierEnergy = {
  legendary: {
    primary: '#FFD700',
    secondary: '#FFA500',
    glow: 'rgba(255, 215, 0, 0.6)',
    shadow: '0 0 60px rgba(255, 215, 0, 0.5)',
    gradient: 'linear-gradient(135deg, #FFD700, #FFA500)',
  },
  epic: {
    primary: '#A855F7',
    secondary: '#7C3AED',
    glow: 'rgba(168, 85, 247, 0.5)',
    shadow: '0 0 50px rgba(168, 85, 247, 0.4)',
    gradient: 'linear-gradient(135deg, #A855F7, #7C3AED)',
  },
  mid: {
    primary: '#3B82F6',
    secondary: '#60A5FA',
    glow: 'rgba(59, 130, 246, 0.4)',
    shadow: '0 0 40px rgba(59, 130, 246, 0.3)',
    gradient: 'linear-gradient(135deg, #3B82F6, #60A5FA)',
  },
  noob: {
    primary: '#F97316',
    secondary: '#FB923C',
    glow: 'rgba(249, 115, 22, 0.4)',
    shadow: '0 0 40px rgba(249, 115, 22, 0.3)',
    gradient: 'linear-gradient(135deg, #F97316, #FB923C)',
  },
  npc: {
    primary: '#EF4444',
    secondary: '#DC2626',
    glow: 'rgba(239, 68, 68, 0.5)',
    shadow: '0 0 50px rgba(239, 68, 68, 0.4)',
    gradient: 'linear-gradient(135deg, #EF4444, #DC2626)',
  }
};

export default function Home() {
  const [nameInput, setNameInput] = useState('');
  const [selectedMood, setSelectedMood] = useState(0); // Index in moods array
  const [loading, setLoading] = useState(false);
  const [aura, setAura] = useState(null);
  const [showRoastChat, setShowRoastChat] = useState(false);
  const [roastCount, setRoastCount] = useState(47832);
  const [cardVisible, setCardVisible] = useState(false);
  const [isSpinning, setIsSpinning] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setRoastCount(prev => prev + Math.floor(Math.random() * 3));
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
    const spinDuration = 2000; // 2 seconds
    const spinTimes = 20; // Number of mood changes
    let currentSpin = 0;

    const spinInterval = setInterval(() => {
      setSelectedMood(Math.floor(Math.random() * moods.length));
      currentSpin++;

      if (currentSpin >= spinTimes) {
        clearInterval(spinInterval);
        setIsSpinning(false);
        // Final selection
        setSelectedMood(Math.floor(Math.random() * moods.length));
      }
    }, spinDuration / spinTimes);
  };

  const handleRoast = async () => {
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
        setRoastCount(prev => prev + 1);
      }
    } catch (err) {
      setAura({
        score: 15,
        roast: "Server crash ho gaya bc 💀 Tera energy bhi utna hi weak hai 😭",
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

  const currentEnergy = aura ? (tierEnergy[aura.rarity] || tierEnergy.npc) : null;
  const currentMood = moods[selectedMood];

  const getDisplayTitle = (title, rarity) => {
    if (rarity === 'npc' || title === 'NPC') return 'BOT';
    return title;
  };

  return (
    <div>
      <Head>
        <title>AuraPro - AI Roast Generator 🔥</title>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
        <meta name="description" content="Get brutally roasted by AI. Choose mood and get savage roasts!" />
        <meta name="theme-color" content="#0a0a12" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />
      </Head>

      {/* Animated Background */}
      <div style={{
        position: 'fixed',
        inset: 0,
        background: 'radial-gradient(circle at 20% 50%, rgba(168, 85, 247, 0.15) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(236, 72, 153, 0.15) 0%, transparent 50%), linear-gradient(180deg, #0a0a12 0%, #0f0d18 100%)',
        zIndex: -2
      }} />

      {/* Floating Orbs */}
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
            {/* Header */}
            <div style={{ textAlign: 'center', marginBottom: '40px' }}>
              <div style={{
                display: 'inline-block',
                background: 'linear-gradient(135deg, #A855F7, #EC4899)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                fontSize: '3.5rem',
                fontWeight: '900',
                letterSpacing: '-0.03em',
                marginBottom: '12px',
                filter: 'drop-shadow(0 0 30px rgba(168, 85, 247, 0.3))'
              }}>
                AuraPro
              </div>
              
              <p style={{
                fontSize: '1.1rem',
                color: 'rgba(255, 255, 255, 0.8)',
                fontWeight: '500',
                margin: '0 0 8px 0',
                lineHeight: '1.5'
              }}>
                Get <span style={{ 
                  background: 'linear-gradient(135deg, #F59E0B, #EF4444)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  fontWeight: '700'
                }}>brutally roasted</span> by AI
              </p>
              
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
                fontWeight: '600',
                marginTop: '12px'
              }}>
                <div style={{
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  background: '#EF4444',
                  boxShadow: '0 0 10px #EF4444',
                  animation: 'pulse 2s infinite'
                }} />
                {roastCount.toLocaleString()}+ Roasts Generated
              </div>
            </div>

            {/* Main Card */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.03)',
              backdropFilter: 'blur(30px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '28px',
              padding: '32px 28px',
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
              marginBottom: '24px'
              }}>
              
              {/* Name Input */}
              <div style={{ marginBottom: '28px' }}>
                <label style={{
                  display: 'block',
                  fontSize: '0.85rem',
                  fontWeight: '600',
                  color: 'rgba(255, 255, 255, 0.6)',
                  marginBottom: '10px',
                  letterSpacing: '0.5px',
                  textTransform: 'uppercase'
                }}>
                  Who Gets Roasted?
                </label>
                
                <input
                  type="text"
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  placeholder="Celebrity, friend, yourself..."
                  onKeyPress={(e) => e.key === 'Enter' && handleRoast()}
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
                    transition: 'all 0.3s ease'
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

              {/* Quick Picks */}
              <div style={{ marginBottom: '32px' }}>
                <div style={{
                  fontSize: '0.75rem',
                  color: 'rgba(255, 255, 255, 0.5)',
                  marginBottom: '10px',
                  fontWeight: '600',
                  letterSpacing: '0.5px'
                }}>
                  🔥 TRENDING
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {["Samay Raina", "Carry", "Dhoni", "Virat", "Elon"].map((name) => (
                    <button
                      key={name}
                      onClick={() => setNameInput(name)}
                      style={{
                        padding: '8px 14px',
                        border: '1px solid rgba(255, 255, 255, 0.15)',
                        borderRadius: '10px',
                        background: 'rgba(255, 255, 255, 0.05)',
                        color: 'rgba(255, 255, 255, 0.7)',
                        fontSize: '0.8rem',
                        fontWeight: '600',
                        cursor: 'pointer',
                        fontFamily: 'inherit',
                        transition: 'all 0.2s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.background = 'rgba(168, 85, 247, 0.2)';
                        e.target.style.borderColor = 'rgba(168, 85, 247, 0.5)';
                        e.target.style.color = '#A855F7';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.background = 'rgba(255, 255, 255, 0.05)';
                        e.target.style.borderColor = 'rgba(255, 255, 255, 0.15)';
                        e.target.style.color = 'rgba(255, 255, 255, 0.7)';
                      }}
                    >
                      {name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Mood Wheel */}
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
                  Choose Roast Mood
                </label>

                {/* Mood Display Circle */}
                <div style={{
                  position: 'relative',
                  width: '180px',
                  height: '180px',
                  margin: '0 auto 24px',
                }}>
                  {/* Outer Ring */}
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

                  {/* Inner Circle */}
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
                    gap: '8px',
                    boxShadow: `0 0 30px ${currentMood.color}60`,
                    transition: 'all 0.3s ease'
                  }}>
                    <div style={{ fontSize: '3rem' }}>{currentMood.emoji}</div>
                    <div style={{
                      fontSize: '0.95rem',
                      fontWeight: '700',
                      color: currentMood.color,
                      letterSpacing: '0.5px'
                    }}>
                      {currentMood.label}
                    </div>
                  </div>
                </div>

                {/* Spin Button */}
                <button
                  onClick={spinMoodWheel}
                  disabled={isSpinning}
                  style={{
                    width: '100%',
                    padding: '14px',
                    border: `2px solid ${currentMood.color}40`,
                    borderRadius: '14px',
                    background: `${currentMood.color}15`,
                    color: currentMood.color,
                    fontSize: '0.9rem',
                    fontWeight: '700',
                    cursor: isSpinning ? 'not-allowed' : 'pointer',
                    fontFamily: 'inherit',
                    transition: 'all 0.2s ease',
                    marginBottom: '12px'
                  }}
                  onMouseEnter={(e) => {
                    if (!isSpinning) {
                      e.target.style.background = `${currentMood.color}25`;
                      e.target.style.transform = 'scale(1.02)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = `${currentMood.color}15`;
                    e.target.style.transform = 'scale(1)';
                  }}
                >
                  {isSpinning ? '🎰 Spinning...' : '🎲 Spin the Wheel'}
                </button>

                {/* Mood Grid */}
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
                      <div style={{ fontSize: '1.5rem' }}>{mood.emoji}</div>
                      <div style={{
                        fontSize: '0.65rem',
                        fontWeight: '600',
                        color: selectedMood === index ? mood.color : 'rgba(255, 255, 255, 0.5)'
                      }}>
                        {mood.label}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Generate Button */}
              <button
                onClick={handleRoast}
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
                    ? 'linear-gradient(135deg, #F59E0B, #EF4444)'
                    : 'rgba(255, 255, 255, 0.1)',
                  color: nameInput.trim() && !loading ? '#000' : 'rgba(255, 255, 255, 0.3)',
                  boxShadow: nameInput.trim() && !loading 
                    ? '0 8px 30px rgba(245, 158, 11, 0.4)' 
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
                      border: '2px solid rgba(0,0,0,0.3)',
                      borderTop: '2px solid #000',
                      borderRadius: '50%',
                      animation: 'spin 0.8s linear infinite'
                    }} />
                    Generating Roast...
                  </span>
                ) : '🔥 Generate Roast Card'}
              </button>
            </div>

            {/* Rarity Info */}
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
                Roast Tiers
              </div>
              
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(5, 1fr)',
                gap: '8px'
              }}>
                {[
                  { emoji: '👑', label: 'LEG', color: '#FFD700', pct: '1%' },
                  { emoji: '⚡', label: 'EPIC', color: '#A855F7', pct: '5%' },
                  { emoji: '💫', label: 'MID', color: '#3B82F6', pct: '39%' },
                  { emoji: '😬', label: 'NOOB', color: '#F97316', pct: '35%' },
                  { emoji: '🤖', label: 'BOT', color: '#EF4444', pct: '20%' }
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

            {/* Footer Badges */}
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '16px',
              flexWrap: 'wrap'
            }}>
              {['⚡ Instant', '🔒 Anonymous', '🎯 Brutal'].map((badge) => (
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
          /* Results */
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '24px',
            opacity: cardVisible ? 1 : 0,
            transform: cardVisible ? 'translateY(0) scale(1)' : 'translateY(20px) scale(0.95)',
            transition: 'all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)'
          }}>
            {/* Energy Glow */}
            <div style={{ position: 'relative', width: '100%', maxWidth: '400px' }}>
              <div style={{
                position: 'absolute',
                inset: '-30px',
                background: currentEnergy?.gradient,
                opacity: 0.2,
                filter: 'blur(40px)',
                borderRadius: '40px',
                animation: 'pulse 3s ease-in-out infinite'
              }} />
              
              <div style={{
                position: 'relative',
                background: 'rgba(10, 10, 18, 0.8)',
                borderRadius: '28px',
                padding: '4px',
                border: `2px solid ${currentEnergy?.primary}`,
                boxShadow: currentEnergy?.shadow
              }}>
                <AuraCard aura={{...aura, title: getDisplayTitle(aura.title, aura.rarity)}} />
              </div>
            </div>

            {/* Action Buttons */}
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
                  background: currentEnergy?.gradient,
                  color: '#fff',
                  boxShadow: `0 8px 30px ${currentEnergy?.glow}`,
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'scale(1.02)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'scale(1)';
                }}
              >
                🔄 Roast Again
              </button>
            </div>

            <p style={{
              fontSize: '0.8rem',
              color: 'rgba(255, 255, 255, 0.4)',
              textAlign: 'center'
            }}>
              📸 Screenshot & share on Instagram
            </p>
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

        {/* Footer */}
        <footer style={{ textAlign: 'center', padding: '40px 0 20px', marginTop: '40px' }}>
          <p style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.3)' }}>
            AuraPro © 2025 • Get roasted, get humbled
          </p>
        </footer>
      </div>

      {/* Animations */}
      <style jsx global>{`
        * {
          box-sizing: border-box;
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.6; }
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
      `}</style>
    </div>
  );
          }
