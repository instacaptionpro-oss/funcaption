import { useState, useEffect } from 'react';
import Head from 'next/head';
import AuraCard from '../components/AuraCard';
import RoastChat from '../components/RoastChat';

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
  const [inputType, setInputType] = useState('name'); // 'name' or 'instagram'
  const [nameInput, setNameInput] = useState('');
  const [igInput, setIgInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [aura, setAura] = useState(null);
  const [showRoastChat, setShowRoastChat] = useState(false);
  const [roastCount, setRoastCount] = useState(47832);
  const [cardVisible, setCardVisible] = useState(false);

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

  const handleNameRoast = async () => {
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
          mood: 'savage',
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

  const handleInstagramRoast = async () => {
    if (!igInput.trim()) return;

    setLoading(true);
    setAura(null);
    setCardVisible(false);
    
    try {
      const response = await fetch('/api/roast-instagram', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: igInput.trim() })
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
        score: 15,
        roast: "Instagram fetch failed bc 💀 Private account hai ya exist nahi karta mc 😭",
        subjectInsight: "Error",
        rarity: "npc",
        title: "BOT",
        challenge: "NOT FOUND"
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
      setIgInput('');
    }, 300);
  };

  const currentEnergy = aura ? (tierEnergy[aura.rarity] || tierEnergy.npc) : null;

  const getDisplayTitle = (title, rarity) => {
    if (rarity === 'npc' || title === 'NPC') return 'BOT';
    return title;
  };

  return (
    <div>
      <Head>
        <title>AuraPro - AI Roast Generator 🔥</title>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
        <meta name="description" content="Get brutally roasted by AI. Instagram analysis or any name - savage roasts guaranteed." />
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
              
              {/* Tab Selector */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '12px',
                marginBottom: '32px',
                background: 'rgba(0, 0, 0, 0.3)',
                padding: '6px',
                borderRadius: '16px'
              }}>
                <button
                  onClick={() => setInputType('instagram')}
                  style={{
                    padding: '14px',
                    border: 'none',
                    borderRadius: '12px',
                    fontSize: '0.9rem',
                    fontWeight: '700',
                    cursor: 'pointer',
                    fontFamily: 'inherit',
                    background: inputType === 'instagram' 
                      ? 'linear-gradient(135deg, #E1306C, #C13584)' 
                      : 'transparent',
                    color: inputType === 'instagram' ? '#fff' : 'rgba(255, 255, 255, 0.5)',
                    boxShadow: inputType === 'instagram' ? '0 4px 20px rgba(225, 48, 108, 0.4)' : 'none',
                    transition: 'all 0.3s ease',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px'
                  }}
                >
                  <span style={{ fontSize: '1.2rem' }}>📸</span>
                  Instagram
                </button>
                
                <button
                  onClick={() => setInputType('name')}
                  style={{
                    padding: '14px',
                    border: 'none',
                    borderRadius: '12px',
                    fontSize: '0.9rem',
                    fontWeight: '700',
                    cursor: 'pointer',
                    fontFamily: 'inherit',
                    background: inputType === 'name' 
                      ? 'linear-gradient(135deg, #A855F7, #EC4899)' 
                      : 'transparent',
                    color: inputType === 'name' ? '#fff' : 'rgba(255, 255, 255, 0.5)',
                    boxShadow: inputType === 'name' ? '0 4px 20px rgba(168, 85, 247, 0.4)' : 'none',
                    transition: 'all 0.3s ease',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px'
                  }}
                >
                  <span style={{ fontSize: '1.2rem' }}>✍️</span>
                  Any Name
                </button>
              </div>

              {/* Instagram Input */}
              {inputType === 'instagram' && (
                <div style={{
                  animation: 'slideIn 0.3s ease'
                }}>
                  <label style={{
                    display: 'block',
                    fontSize: '0.85rem',
                    fontWeight: '600',
                    color: 'rgba(255, 255, 255, 0.6)',
                    marginBottom: '10px',
                    letterSpacing: '0.5px',
                    textTransform: 'uppercase'
                  }}>
                    Instagram Username
                  </label>
                  
                  <div style={{ position: 'relative', marginBottom: '24px' }}>
                    <div style={{
                      position: 'absolute',
                      left: '18px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      fontSize: '1.1rem',
                      color: 'rgba(255, 255, 255, 0.4)'
                    }}>
                      @
                    </div>
                    <input
                      type="text"
                      value={igInput}
                      onChange={(e) => setIgInput(e.target.value)}
                      placeholder="username"
                      onKeyPress={(e) => e.key === 'Enter' && handleInstagramRoast()}
                      style={{
                        width: '100%',
                        background: 'rgba(0, 0, 0, 0.4)',
                        border: '2px solid rgba(225, 48, 108, 0.3)',
                        borderRadius: '16px',
                        padding: '18px 20px 18px 40px',
                        color: '#fff',
                        fontSize: '1.05rem',
                        fontWeight: '600',
                        outline: 'none',
                        fontFamily: 'inherit',
                        transition: 'all 0.3s ease'
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = '#E1306C';
                        e.target.style.boxShadow = '0 0 0 4px rgba(225, 48, 108, 0.15)';
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = 'rgba(225, 48, 108, 0.3)';
                        e.target.style.boxShadow = 'none';
                      }}
                    />
                  </div>

                  <button
                    onClick={handleInstagramRoast}
                    disabled={loading || !igInput.trim()}
                    style={{
                      width: '100%',
                      padding: '18px',
                      border: 'none',
                      borderRadius: '16px',
                      fontSize: '1.05rem',
                      fontWeight: '800',
                      cursor: igInput.trim() && !loading ? 'pointer' : 'not-allowed',
                      fontFamily: 'inherit',
                      background: igInput.trim() && !loading
                        ? 'linear-gradient(135deg, #E1306C, #C13584)'
                        : 'rgba(255, 255, 255, 0.1)',
                      color: igInput.trim() && !loading ? '#fff' : 'rgba(255, 255, 255, 0.3)',
                      boxShadow: igInput.trim() && !loading 
                        ? '0 8px 30px rgba(225, 48, 108, 0.4)' 
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
                        Analyzing Profile...
                      </span>
                    ) : '🔥 Roast Instagram Profile'}
                  </button>

                  <p style={{
                    fontSize: '0.75rem',
                    color: 'rgba(255, 255, 255, 0.4)',
                    textAlign: 'center',
                    marginTop: '12px',
                    lineHeight: '1.4'
                  }}>
                    AI analyzes followers, posts & bio
                  </p>
                </div>
              )}

              {/* Name Input */}
              {inputType === 'name' && (
                <div style={{
                  animation: 'slideIn 0.3s ease'
                }}>
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
                    onKeyPress={(e) => e.key === 'Enter' && handleNameRoast()}
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
                      marginBottom: '20px',
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

                  {/* Quick Picks */}
                  <div style={{ marginBottom: '24px' }}>
                    <div style={{
                      fontSize: '0.75rem',
                      color: 'rgba(255, 255, 255, 0.5)',
                      marginBottom: '8px',
                      fontWeight: '600',
                      letterSpacing: '0.5px'
                    }}>
                      🔥 TRENDING
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                      {["Samay Raina", "Carry", "Dhoni", "Elon Musk"].map((name) => (
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

                  <button
                    onClick={handleNameRoast}
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

                  <p style={{
                    fontSize: '0.75rem',
                    color: 'rgba(255, 255, 255, 0.4)',
                    textAlign: 'center',
                    marginTop: '12px',
                    lineHeight: '1.4'
                  }}>
                    AI roasts based on personality & reputation
                  </p>
                </div>
              )}
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

            {/* Instagram Stats */}
            {aura.igStats && (
              <div style={{
                background: 'rgba(225, 48, 108, 0.1)',
                border: '1px solid rgba(225, 48, 108, 0.3)',
                borderRadius: '18px',
                padding: '16px 24px',
                display: 'flex',
                gap: '24px',
                justifyContent: 'center'
              }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '1.1rem', fontWeight: '800', color: '#E1306C' }}>
                    {aura.igStats.followers}
                  </div>
                  <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.5)', marginTop: '2px' }}>
                    Followers
                  </div>
                </div>
                <div style={{ width: '1px', background: 'rgba(255,255,255,0.15)' }} />
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '1.1rem', fontWeight: '800', color: '#E1306C' }}>
                    {aura.igStats.ratio}:1
                  </div>
                  <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.5)', marginTop: '2px' }}>
                    Ratio
                  </div>
                </div>
              </div>
            )}

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
            mood="savage"
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
        
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
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
