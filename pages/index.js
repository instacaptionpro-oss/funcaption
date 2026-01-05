import { useState, useEffect } from 'react';
import Head from 'next/head';
import AuraCard from '../components/AuraCard';
import RoastChat from '../components/RoastChat';

// Mood options
const moodOptions = [
  { id: 'funny', emoji: '😂', label: 'Funny' },
  { id: 'fire', emoji: '🔥', label: 'Fire' },
  { id: 'aesthetic', emoji: '✨', label: 'Aesthetic' },
  { id: 'deep', emoji: '🧠', label: 'Deep' },
  { id: 'poetic', emoji: '✍️', label: 'Poetic' },
  { id: 'motivation', emoji: '🚀', label: 'Motivation' },
  { id: 'more', emoji: '➕', label: 'More' }
];

const extendedMoods = [
  { id: 'attitude', emoji: '😎', label: 'Attitude' },
  { id: 'love', emoji: '💕', label: 'Love' },
  { id: 'breakup', emoji: '💔', label: 'Breakup' },
  { id: 'savage', emoji: '🐍', label: 'Savage' },
  { id: 'sad', emoji: '😢', label: 'Sad' },
  { id: 'happy', emoji: '😊', label: 'Happy' },
  { id: 'alone', emoji: '🌙', label: 'Alone' },
  { id: 'confident', emoji: '💪', label: 'Confident' },
  { id: 'romantic', emoji: '🌹', label: 'Romantic' },
  { id: 'sarcastic', emoji: '🙄', label: 'Sarcastic' },
  { id: 'nostalgic', emoji: '📷', label: 'Nostalgic' },
  { id: 'rebellious', emoji: '⚡', label: 'Rebellious' }
];

// Example subjects
const exampleSubjects = [
  "Why I'm always late",
  "My terrible cooking skills", 
  "My obsession with K-dramas",
  "My inconsistent workout routine",
  "My terrible cooking skills"
];

// Example celebrity names for influencer sensing
const exampleCelebrities = [
  { name: "Samay Raina", hint: "Chess streamer at peak" },
  { name: "Elon Musk", hint: "Tech billionaire" },
  { name: "Taylor Swift", hint: "Pop icon" }
];

export default function Home() {
  const [name, setName] = useState('');
  const [subject, setSubject] = useState('');
  const [selectedMood, setSelectedMood] = useState('fire');
  const [showExtendedMoods, setShowExtendedMoods] = useState(false);
  const [currentExample, setCurrentExample] = useState(0);
  const [loading, setLoading] = useState(false);
  const [aura, setAura] = useState(null);
  const [showRoastChat, setShowRoastChat] = useState(false);
  const [chatSubject, setChatSubject] = useState('');
  const [chatMood, setChatMood] = useState('');
  const [chatInitialRoast, setChatInitialRoast] = useState('');
  const [copied, setCopied] = useState(false);

  // Cycle through example subjects
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentExample(prev => (prev + 1) % 3);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const selectMoodDirectly = (moodId) => {
    if (moodId === 'more') {
      setShowExtendedMoods(!showExtendedMoods);
      return;
    }
    setSelectedMood(moodId);
    setShowExtendedMoods(false);
  };

  const selectExtendedMood = (moodId) => {
    setSelectedMood(moodId);
    setShowExtendedMoods(false);
  };

  // Example subject handler
  const useExampleSubject = (exampleSubject) => {
    setSubject(exampleSubject);
    
    let selectedMood;
    if (exampleSubject === "My inconsistent workout routine") {
      selectedMood = 'funny';
    } else if (exampleSubject === "My terrible cooking skills") {
      selectedMood = 'funny';
    } else {
      const noobMoods = ['funny', 'sad', 'alone'];
      selectedMood = noobMoods[Math.floor(Math.random() * noobMoods.length)];
    }
    setSelectedMood(selectedMood);
  };

  // Example celebrity handler
  const useCelebrity = (celebName) => {
    setName(celebName);
    setSubject('Their current relevance in 2025');
    setSelectedMood('savage');
  };

  const generateAura = async (e) => {
    e.preventDefault();
    
    // At least one field required
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
          mood: selectedMood 
        })
      });

      const data = await response.json();
      if (response.ok) {
        setAura(data.aura);
      } else {
        setAura(data.fallback);
      }
    } catch (err) {
      console.error('Generation error:', err);
      setAura({
        score: Math.floor(Math.random() * 60),
        roast: "Your energy is so weak, even ghosts avoid you. 💀",
        subjectInsight: "Interesting choice, very telling...",
        rarity: "npc",
        title: "NPC",
        challenge: "ERROR 404: EXISTENCE NOT FOUND."
      });
    } finally {
      setLoading(false);
    }
  };

  const handleShare = async () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'My Aura Score!',
          text: `I got ${aura.score}/${aura.title} on AuraScore! Can you beat it?`,
          url: window.location.href
        });
      } catch (err) {
        console.log('Sharing failed:', err);
      }
    }
  };

  const handleRoastChat = () => {
    setChatSubject(subject || name);
    setChatMood(selectedMood);
    setChatInitialRoast(aura.roast);
    setShowRoastChat(true);
  };

  const getCurrentMoodInfo = () => {
    const mainMood = moodOptions.find(m => m.id === selectedMood);
    if (mainMood) return mainMood;
    return extendedMoods.find(m => m.id === selectedMood) || { emoji: '🔥', label: 'Fire' }
  };

  const currentMoodInfo = getCurrentMoodInfo();
  const canSubmit = subject.trim() || name.trim();

  return (
    <>
      <Head>
        <title>AuraScore - Get Your Roasted Aura Card</title>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
        <meta name="description" content="Discover your aura score and get brutally roasted!" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />
      </Head>

      <style jsx global>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        body {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
          background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
          min-height: 100vh;
          color: #ffffff;
          overflow-x: hidden;
        }

        .pulse {
          animation: pulse 2s infinite;
        }

        @keyframes pulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.05); }
          100% { transform: scale(1); }
        }

        .gradient-text {
          background: linear-gradient(45deg, #FFD700, #FF4500, #9400D3);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        input::placeholder, textarea::placeholder {
          color: #666666;
        }
      `}</style>

      <div style={{ 
        minHeight: '100vh',
        padding: '20px',
        maxWidth: '500px',
        margin: '0 auto',
        background: 'transparent'
      }}>
        
        {/* Header */}
        <header style={{
          textAlign: 'center',
          padding: '30px 0 20px'
        }}>
          <h1 className="gradient-text" style={{
            fontSize: '2.8rem',
            fontWeight: '900',
            marginBottom: '10px',
            letterSpacing: '-0.03em'
          }}>
            AuraScore
          </h1>
          <p style={{
            fontSize: '1.1rem',
            fontWeight: '600',
            color: '#a0a0a0',
            marginBottom: '30px'
          }}>
            Get brutally roasted. Level up your aura.
          </p>
        </header>

        {/* Main Content */}
        {!aura ? (
          <>
            {/* Input Form */}
            <div style={{
              background: 'rgba(30, 30, 50, 0.7)',
              borderRadius: '24px',
              padding: '24px',
              marginBottom: '20px',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255,255,255,0.1)'
            }}>
              
              {/* ============================================ */}
              {/* NAME FIELD (Optional) - NEW! */}
              {/* ============================================ */}
              <div style={{ marginBottom: '20px' }}>
                <label style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  fontSize: '1rem',
                  fontWeight: '700',
                  color: '#FFD700',
                  marginBottom: '12px'
                }}>
                  <span style={{ fontSize: '1.4rem' }}>👤</span>
                  Name
                  <span style={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    padding: '3px 10px',
                    borderRadius: '8px',
                    fontSize: '0.7rem',
                    color: 'rgba(255, 255, 255, 0.5)',
                    fontWeight: '500'
                  }}>
                    Optional
                  </span>
                </label>
                
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter name (celebrity, friend, or yours)"
                  style={{
                    width: '100%',
                    padding: '14px 16px',
                    background: 'rgba(20, 20, 35, 0.8)',
                    border: '2px solid rgba(255, 215, 0, 0.2)',
                    borderRadius: '14px',
                    outline: 'none',
                    color: '#ffffff',
                    fontSize: '1rem',
                    fontWeight: '500',
                    fontFamily: 'inherit',
                    transition: 'border-color 0.2s ease'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#FFD700'}
                  onBlur={(e) => e.target.style.borderColor = 'rgba(255, 215, 0, 0.2)'}
                />
                
                <p style={{
                  marginTop: '8px',
                  fontSize: '0.75rem',
                  color: 'rgba(255, 255, 255, 0.4)'
                }}>
                  💡 Try a celebrity name for personalized roasts with Influencer Sensing™
                </p>
              </div>

              {/* Celebrity Examples */}
              <div style={{ marginBottom: '20px' }}>
                <label style={{
                  display: 'block',
                  fontSize: '0.85rem',
                  fontWeight: '600',
                  color: '#a0a0a0',
                  marginBottom: '10px'
                }}>
                  🌟 Try Celebrity Names:
                </label>
                <div style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '8px'
                }}>
                  {exampleCelebrities.map((celeb, index) => (
                    <button
                      key={index}
                      onClick={() => useCelebrity(celeb.name)}
                      style={{
                        padding: '8px 14px',
                        borderRadius: '12px',
                        background: 'rgba(255, 215, 0, 0.15)',
                        border: '1px solid rgba(255, 215, 0, 0.4)',
                        color: '#FFD700',
                        fontSize: '0.8rem',
                        fontWeight: '600',
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                      }}
                    >
                      {celeb.name}
                    </button>
                  ))}
                </div>
                <p style={{
                  marginTop: '6px',
                  fontSize: '0.7rem',
                  color: 'rgba(255, 255, 255, 0.3)'
                }}>
                  ⚠️ Even celebs only have 10% chance of Legendary!
                </p>
              </div>

              {/* Divider */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '15px',
                margin: '20px 0'
              }}>
                <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.1)' }} />
                <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.8rem' }}>AND / OR</span>
                <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.1)' }} />
              </div>

              {/* ============================================ */}
              {/* SUBJECT FIELD */}
              {/* ============================================ */}
              <label style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                fontSize: '1rem',
                fontWeight: '700',
                color: '#00FFFF',
                marginBottom: '12px'
              }}>
                <span style={{ fontSize: '1.4rem' }}>🔮</span>
                What to roast?
              </label>
              
              <div style={{ position: 'relative', marginBottom: '20px' }}>
                <textarea
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Personality trait, habit, situation, or context..."
                  style={{
                    width: '100%',
                    minHeight: '100px',
                    background: 'rgba(20, 20, 35, 0.8)',
                    border: '2px solid rgba(0, 255, 255, 0.2)',
                    borderRadius: '14px',
                    padding: '14px 16px',
                    outline: 'none',
                    color: '#ffffff',
                    fontSize: '1rem',
                    fontWeight: '500',
                    lineHeight: '1.6',
                    resize: 'none',
                    fontFamily: 'inherit',
                    transition: 'border-color 0.2s ease'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#00FFFF'}
                  onBlur={(e) => e.target.style.borderColor = 'rgba(0, 255, 255, 0.2)'}
                />
                
                {!subject && (
                  <div style={{
                    position: 'absolute',
                    top: '14px',
                    left: '16px',
                    right: '16px',
                    color: '#555555',
                    fontSize: '1rem',
                    fontWeight: '500',
                    pointerEvents: 'none'
                  }}>
                    {exampleSubjects[currentExample]}
                  </div>
                )}
              </div>

              {/* Example Subjects */}
              <div style={{ marginBottom: '20px' }}>
                <label style={{
                  display: 'block',
                  fontSize: '0.85rem',
                  fontWeight: '600',
                  color: '#a0a0a0',
                  marginBottom: '10px'
                }}>
                  🎯 Quick Examples:
                </label>
                <div style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '8px'
                }}>
                  {exampleSubjects.slice(0, 4).map((example, index) => (
                    <button
                      key={index}
                      onClick={() => useExampleSubject(example)}
                      style={{
                        padding: '8px 12px',
                        borderRadius: '10px',
                        background: 'rgba(0, 255, 255, 0.1)',
                        border: '1px solid rgba(0, 255, 255, 0.3)',
                        color: '#00FFFF',
                        fontSize: '0.75rem',
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                      }}
                    >
                      {example}
                    </button>
                  ))}
                </div>
              </div>

              {/* Mood Selection */}
              <div style={{ marginBottom: '20px' }}>
                <label style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  fontSize: '0.9rem',
                  fontWeight: '600',
                  color: '#FF69B4',
                  marginBottom: '12px'
                }}>
                  <span style={{ fontSize: '1.2rem' }}>🎭</span>
                  Pick Your Energy
                </label>
                
                <div style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '8px',
                  justifyContent: 'flex-start'
                }}>
                  {moodOptions.filter(m => m.id !== 'more').map(mood => (
                    <button
                      key={mood.id}
                      onClick={() => selectMoodDirectly(mood.id)}
                      style={{
                        padding: '10px 14px',
                        borderRadius: '12px',
                        background: selectedMood === mood.id 
                          ? 'linear-gradient(45deg, #FF4500, #FF0000)' 
                          : 'rgba(40, 40, 60, 0.8)',
                        border: selectedMood === mood.id 
                          ? 'none' 
                          : '1px solid rgba(255,255,255,0.1)',
                        color: selectedMood === mood.id ? '#ffffff' : '#a0a0a0',
                        fontSize: '0.85rem',
                        fontWeight: '600',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      <span>{mood.emoji}</span>
                      <span>{mood.label}</span>
                    </button>
                  ))}
                  <button
                    onClick={() => selectMoodDirectly('more')}
                    style={{
                      padding: '10px 14px',
                      borderRadius: '12px',
                      background: showExtendedMoods 
                        ? 'linear-gradient(45deg, #9400D3, #4B0082)' 
                        : 'rgba(40, 40, 60, 0.8)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      color: showExtendedMoods ? '#fff' : '#a0a0a0',
                      fontSize: '0.85rem',
                      fontWeight: '600',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}
                  >
                    <span>➕</span>
                    <span>More</span>
                  </button>
                </div>

                {showExtendedMoods && (
                  <div style={{
                    marginTop: '12px',
                    padding: '12px',
                    background: 'rgba(30, 30, 50, 0.5)',
                    borderRadius: '14px',
                    border: '1px solid rgba(255,255,255,0.1)'
                  }}>
                    <div style={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: '8px'
                    }}>
                      {extendedMoods.map(mood => (
                        <button
                          key={mood.id}
                          onClick={() => selectExtendedMood(mood.id)}
                          style={{
                            padding: '8px 12px',
                            borderRadius: '10px',
                            background: selectedMood === mood.id 
                              ? 'linear-gradient(45deg, #9400D3, #4B0082)' 
                              : 'rgba(40, 40, 60, 0.8)',
                            border: '1px solid rgba(255,255,255,0.1)',
                            color: selectedMood === mood.id ? '#ffffff' : '#a0a0a0',
                            fontSize: '0.8rem',
                            fontWeight: '600',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '5px'
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

              {/* Generate Button */}
              <button
                onClick={generateAura}
                disabled={loading || !canSubmit}
                className={loading ? '' : 'pulse'}
                style={{
                  width: '100%',
                  padding: '16px',
                  borderRadius: '16px',
                  background: loading || !canSubmit
                    ? 'linear-gradient(45deg, #444444, #333333)' 
                    : 'linear-gradient(45deg, #FF4500, #FF0000)',
                  border: 'none',
                  color: '#ffffff',
                  fontSize: '1.1rem',
                  fontWeight: '700',
                  cursor: loading || !canSubmit ? 'not-allowed' : 'pointer',
                  transition: 'all 0.3s ease',
                  boxShadow: loading || !canSubmit ? 'none' : '0 10px 30px rgba(255, 69, 0, 0.3)',
                  opacity: loading || !canSubmit ? 0.6 : 1
                }}
              >
                {loading ? '🔥 Analyzing Aura...' : '🔥 Get Roasted'}
              </button>

              {/* Rarity Info */}
              <div style={{
                marginTop: '15px',
                padding: '12px',
                background: 'rgba(255, 215, 0, 0.05)',
                borderRadius: '12px',
                border: '1px solid rgba(255, 215, 0, 0.2)',
                textAlign: 'center'
              }}>
                <p style={{
                  margin: 0,
                  fontSize: '0.75rem',
                  color: 'rgba(255, 255, 255, 0.5)'
                }}>
                  🎰 <strong style={{ color: '#FFD700' }}>LEGENDARY</strong> is ULTRA RARE (1%) • 
                  <strong style={{ color: '#00FFFF' }}> EPIC</strong> (5%) • 
                  <strong style={{ color: '#fff' }}> MID</strong> (39%) • 
                  <strong style={{ color: '#FF8C00' }}> NOOB</strong> (35%) • 
                  <strong style={{ color: '#FF0000' }}> NPC</strong> (20%)
                </p>
              </div>
            </div>

            {/* Info Section */}
            <div style={{
              background: 'rgba(30, 30, 50, 0.7)',
              borderRadius: '24px',
              padding: '20px',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255,255,255,0.1)'
            }}>
              <h3 style={{
                fontSize: '1rem',
                fontWeight: '700',
                color: '#ffffff',
                marginBottom: '15px',
                textAlign: 'center'
              }}>
                🚀 How It Works
              </h3>
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '10px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.9rem' }}>
                  <span>1️⃣</span>
                  <span>Enter a name (optional) + subject to roast</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.9rem' }}>
                  <span>2️⃣</span>
                  <span>AI detects if it's a celebrity (Influencer Sensing™)</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.9rem' }}>
                  <span>3️⃣</span>
                  <span>Get your aura score + brutal roast</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.9rem' }}>
                  <span>4️⃣</span>
                  <span>Share your card or chat for more roasting!</span>
                </div>
              </div>

              {/* Influencer Sensing Info */}
              <div style={{
                marginTop: '15px',
                padding: '12px',
                background: 'rgba(148, 0, 211, 0.1)',
                borderRadius: '12px',
                border: '1px solid rgba(148, 0, 211, 0.3)'
              }}>
                <p style={{
                  margin: 0,
                  fontSize: '0.8rem',
                  color: '#9400D3',
                  fontWeight: '600',
                  marginBottom: '5px'
                }}>
                  ⚡ Influencer Sensing™
                </p>
                <p style={{
                  margin: 0,
                  fontSize: '0.75rem',
                  color: 'rgba(255, 255, 255, 0.5)'
                }}>
                  AI evaluates celebrity status: <strong>PEAK</strong> (can get Legendary), 
                  <strong> STABLE</strong> (Mid-Epic), <strong> FALLING</strong> (NPC-Noob with brutal roast!)
                </p>
              </div>
            </div>
          </>
        ) : (
          /* Aura Card Display */
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '20px'
          }}>
            <AuraCard aura={aura} />
            
            {/* Public Figure Badge */}
            {aura.isPublicFigure && (
              <div style={{
                padding: '10px 20px',
                background: aura.publicFigureStatus === 'peak' 
                  ? 'rgba(255, 215, 0, 0.2)' 
                  : aura.publicFigureStatus === 'falling' 
                    ? 'rgba(255, 0, 0, 0.2)' 
                    : 'rgba(0, 255, 255, 0.2)',
                border: `1px solid ${
                  aura.publicFigureStatus === 'peak' 
                    ? '#FFD700' 
                    : aura.publicFigureStatus === 'falling' 
                      ? '#FF0000' 
                      : '#00FFFF'
                }`,
                borderRadius: '12px'
              }}>
                <p style={{
                  margin: 0,
                  fontSize: '0.85rem',
                  color: '#fff',
                  textAlign: 'center'
                }}>
                  {aura.publicFigureStatus === 'peak' && '👑 PUBLIC FIGURE AT PEAK'}
                  {aura.publicFigureStatus === 'stable' && '⚡ ESTABLISHED PUBLIC FIGURE'}
                  {aura.publicFigureStatus === 'falling' && '💀 FALLEN FROM GRACE'}
                  {aura.publicFigureStatus === 'unknown' && '🔍 UNKNOWN FIGURE'}
                </p>
              </div>
            )}
            
            {/* Action Buttons */}
            <div style={{
              display: 'flex',
              gap: '15px',
              width: '320px'
            }}>
              <button
                onClick={handleRoastChat}
                style={{
                  flex: 1,
                  padding: '14px',
                  background: 'rgba(255,255,255,0.15)',
                  color: '#ffffff',
                  border: '2px solid rgba(255,255,255,0.3)',
                  borderRadius: '14px',
                  fontWeight: '700',
                  cursor: 'pointer',
                  fontSize: '0.95rem'
                }}
              >
                💬 More Roasting
              </button>
              <button
                onClick={() => {
                  setAura(null);
                  setSubject('');
                  setName('');
                }}
                style={{
                  flex: 1,
                  padding: '14px',
                  background: 'linear-gradient(45deg, #FF4500, #FF0000)',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '14px',
                  fontWeight: '700',
                  cursor: 'pointer',
                  fontSize: '0.95rem',
                  boxShadow: '0 5px 20px rgba(255, 69, 0, 0.3)'
                }}
              >
                🔄 Try Again
              </button>
            </div>
            
            {copied && (
              <div style={{
                padding: '12px 20px',
                background: 'rgba(30, 200, 30, 0.2)',
                borderRadius: '12px',
                border: '1px solid #00ff00',
                color: '#00ff00',
                fontWeight: '600'
              }}>
                ✓ Copied! Paste in Instagram Stories
              </div>
            )}
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
          padding: '30px 0 20px',
          color: '#666666',
          fontSize: '0.8rem'
        }}>
          <p>AuraScore © 2025 - Get roasted. Get better.</p>
        </footer>
      </div>
    </>
  );
}
