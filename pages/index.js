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

// Example subjects for Noob/Mid tiers
const exampleSubjects = [
  "Why I'm always late",
  "My terrible cooking skills",
  "My obsession with K-dramas",
  "My weird sleep schedule",
  "My inability to adult properly"
];

export default function Home() {
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
      setCurrentExample(prev => (prev + 1) % exampleSubjects.length);
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

  const useExampleSubject = (exampleSubject) => {
    setSubject(exampleSubject);
    // Auto-select Noob/Mid tier moods for example subjects
    const noobMoods = ['funny', 'sad', 'alone'];
    const randomMood = noobMoods[Math.floor(Math.random() * noobMoods.length)];
    setSelectedMood(randomMood);
  };

  const generateAura = async (e) => {
    e.preventDefault();
    if (!subject.trim()) return;

    setLoading(true);
    setAura(null);

    try {
      const response = await fetch('/api/generate-aura', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subject, mood: selectedMood })
      });

      const data = await response.json();
      if (response.ok) {
        setAura(data.aura);
      } else {
        setAura(data.fallback);
      }
    } catch (err) {
      console.error('Generation error:', err);
      // Fallback aura
      setAura({
        score: Math.floor(Math.random() * 60),
        roast: "Your energy is so weak, even ghosts avoid you.",
        subjectInsight: "Interesting choice, very telling...",
        rarity: "npc",
        title: "NPC",
        challenge: "FUTURE SO DARK THAT EVEN GOOGLE MAPS CANT FIND IT."
      });
    } finally {
      setLoading(false);
    }
  };

  const handleShare = async () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    
    // In a real app, this would trigger Instagram story sharing
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
    setChatSubject(subject);
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
              <label style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                fontSize: '1rem',
                fontWeight: '700',
                color: '#ffffff',
                marginBottom: '16px'
              }}>
                <span style={{ fontSize: '1.4rem' }}>🔮</span>
                What do you want roasted?
              </label>
              
              <div style={{ position: 'relative', marginBottom: '20px' }}>
                <textarea
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Your personality trait, habit, or life situation..."
                  style={{
                    width: '100%',
                    minHeight: '120px',
                    background: 'rgba(20, 20, 35, 0.8)',
                    border: '2px solid rgba(255,255,255,0.1)',
                    borderRadius: '16px',
                    padding: '16px',
                    outline: 'none',
                    color: '#ffffff',
                    fontSize: '1rem',
                    fontWeight: '500',
                    lineHeight: '1.6',
                    resize: 'none',
                    fontFamily: 'inherit',
                    transition: 'border-color 0.2s ease'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#FF4500'}
                  onBlur={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
                />
                
                {!subject && (
                  <div style={{
                    position: 'absolute',
                    top: '16px',
                    left: '16px',
                    right: '16px',
                    color: '#666666',
                    fontSize: '1rem',
                    fontWeight: '500'
                  }}>
                    {exampleSubjects[currentExample]}
                  </div>
                )}
              </div>

              {/* Example Subjects for Noob/Mid */}
              <div style={{ marginBottom: '20px' }}>
                <label style={{
                  display: 'block',
                  fontSize: '0.9rem',
                  fontWeight: '600',
                  color: '#a0a0a0',
                  marginBottom: '12px'
                }}>
                  Quick Examples (Noob/Mid Tier):
                </label>
                <div style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '8px'
                }}>
                  {exampleSubjects.slice(0, 3).map((example, index) => (
                    <button
                      key={index}
                      onClick={() => useExampleSubject(example)}
                      style={{
                        padding: '8px 12px',
                        borderRadius: '12px',
                        background: 'rgba(65, 105, 225, 0.2)',
                        border: '1px solid rgba(100, 149, 237, 0.5)',
                        color: '#a0a0ff',
                        fontSize: '0.8rem',
                        cursor: 'pointer'
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
                  display: 'block',
                  fontSize: '0.9rem',
                  fontWeight: '600',
                  color: '#a0a0a0',
                  marginBottom: '12px'
                }}>
                  Pick Your Energy
                </label>
                
                <div style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '10px',
                  justifyContent: 'center'
                }}>
                  {moodOptions.filter(m => m.id !== 'more').map(mood => (
                    <button
                      key={mood.id}
                      onClick={() => selectMoodDirectly(mood.id)}
                      style={{
                        padding: '12px 16px',
                        borderRadius: '16px',
                        background: selectedMood === mood.id 
                          ? 'linear-gradient(45deg, #FF4500, #FF0000)' 
                          : 'rgba(40, 40, 60, 0.8)',
                        border: 'none',
                        color: selectedMood === mood.id ? '#ffffff' : '#a0a0a0',
                        fontSize: '0.9rem',
                        fontWeight: '600',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
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
                      padding: '12px 16px',
                      borderRadius: '16px',
                      background: showExtendedMoods 
                        ? 'linear-gradient(45deg, #9400D3, #4B0082)' 
                        : 'rgba(40, 40, 60, 0.8)',
                      border: 'none',
                      color: '#a0a0a0',
                      fontSize: '0.9rem',
                      fontWeight: '600',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}
                  >
                    <span>➕</span>
                    <span>More</span>
                  </button>
                </div>

                {showExtendedMoods && (
                  <div style={{
                    marginTop: '15px',
                    padding: '15px',
                    background: 'rgba(30, 30, 50, 0.5)',
                    borderRadius: '16px',
                    border: '1px solid rgba(255,255,255,0.1)'
                  }}>
                    <div style={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: '10px',
                      justifyContent: 'center'
                    }}>
                      {extendedMoods.map(mood => (
                        <button
                          key={mood.id}
                          onClick={() => selectExtendedMood(mood.id)}
                          style={{
                            padding: '10px 14px',
                            borderRadius: '14px',
                            background: selectedMood === mood.id 
                              ? 'linear-gradient(45deg, #9400D3, #4B0082)' 
                              : 'rgba(40, 40, 60, 0.8)',
                            border: 'none',
                            color: selectedMood === mood.id ? '#ffffff' : '#a0a0a0',
                            fontSize: '0.85rem',
                            fontWeight: '600',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px'
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
                disabled={loading || !subject.trim()}
                className={loading ? '' : 'pulse'}
                style={{
                  width: '100%',
                  padding: '16px',
                  borderRadius: '16px',
                  background: loading 
                    ? 'linear-gradient(45deg, #666666, #444444)' 
                    : 'linear-gradient(45deg, #FF4500, #FF0000)',
                  border: 'none',
                  color: '#ffffff',
                  fontSize: '1.1rem',
                  fontWeight: '700',
                  cursor: loading || !subject.trim() ? 'not-allowed' : 'pointer',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 10px 30px rgba(255, 69, 0, 0.3)'
                }}
              >
                {loading ? '🔥 Roasting...' : '🔥 Get Roasted'}
              </button>
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
                How It Works
              </h3>
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '12px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontSize: '1.2rem' }}>1️⃣</span>
                  <span>Enter something about yourself</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontSize: '1.2rem' }}>2️⃣</span>
                  <span>Get your aura score (0-100)</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontSize: '1.2rem' }}>3️⃣</span>
                  <span>Receive a brutal roast</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontSize: '1.2rem' }}>4️⃣</span>
                  <span>Chat for more roasting!</span>
                </div>
              </div>
            </div>
          </>
        ) : (
          /* Aura Card Display with External Buttons */
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '20px'
          }}>
            <AuraCard aura={aura} />
            
            {/* Action Buttons Outside Card */}
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
                  background: 'rgba(255,255,255,0.2)',
                  color: '#ffffff',
                  border: '2px solid #ffffff',
                  borderRadius: '14px',
                  fontWeight: '700',
                  cursor: 'pointer',
                  fontSize: '1rem'
                }}
              >
                💬 More Roasting
              </button>
              <button
                onClick={() => {
                  setAura(null);
                  setSubject('');
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
                  fontSize: '1rem',
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
                ✓ Copied to clipboard! Paste in Instagram Stories
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
