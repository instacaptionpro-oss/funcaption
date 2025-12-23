import { useState, useEffect } from 'react'
import Head from 'next/head'

// Mood options with emojis
const moodOptions = [
  { id: 'funny', emoji: '😂', label: 'Funny' },
  { id: 'fire', emoji: '🔥', label: 'Fire' },
  { id: 'aesthetic', emoji: '✨', label: 'Aesthetic' },
  { id: 'deep', emoji: '🧠', label: 'Deep' },
  { id: 'poetic', emoji: '✍️', label: 'Poetic' },
  { id: 'motivation', emoji: '🚀', label: 'Motivation' },
  { id: 'more', emoji: '➕', label: 'More' }
]

// Extended moods for "More" option
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
]

// Target goal chips
const targetGoals = [
  { id: 'comments', label: 'Get Comments', emoji: '💬' },
  { id: 'shares', label: 'Get Shares', emoji: '🔄' },
  { id: 'saves', label: 'Save for Later', emoji: '🔖' }
]

// Loading messages
const loadingMessages = [
  "Reading the vibe...",
  "Mixing the magic...",
  "Polishing your hook...",
  "Adding the spark...",
  "Almost there..."
]

const InstagramIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
    <path d="M8 0C5.829 0 5.556.01 4.703.048 3.85.088 3.269.222 2.76.42a3.917 3.917 0 0 0-1.417.923A3.927 3.927 0 0 0 .42 2.76C.222 3.268.087 3.85.048 4.7.01 5.555 0 5.827 0 8.001c0 2.172.01 2.444.048 3.297.04.852.174 1.433.372 1.942.205.526.478.972.923 1.417.444.445.89.719 1.416.923.51.198 1.09.333 1.942.372C5.555 15.99 5.827 16 8 16s2.444-.01 3.298-.048c.851-.04 1.434-.174 1.943-.372a3.916 3.916 0 0 0 1.416-.923c.445-.445.718-.891.923-1.417.197-.509.332-1.09.372-1.942C15.99 10.445 16 10.173 16 8s-.01-2.445-.048-3.299c-.04-.851-.175-1.433-.372-1.941a3.926 3.926 0 0 0-.923-1.417A3.911 3.911 0 0 0 13.24.42c-.51-.198-1.092-.333-1.943-.372C10.443.01 10.172 0 7.998 0h.003zm-.717 1.442h.718c2.136 0 2.389.007 3.232.046.78.035 1.204.166 1.486.275.373.145.64.319.92.599.28.28.453.546.598.92.11.281.24.705.275 1.485.039.843.047 1.096.047 3.231s-.008 2.389-.047 3.232c-.035.78-.166 1.203-.275 1.485a2.47 2.47 0 0 1-.599.919c-.28.28-.546.453-.92.598-.28.11-.704.24-1.485.276-.843.038-1.096.047-3.232.047s-2.39-.009-3.233-.047c-.78-.036-1.203-.166-1.485-.276a2.478 2.478 0 0 1-.92-.598 2.48 2.48 0 0 1-.6-.92c-.109-.281-.24-.705-.275-1.485-.038-.843-.046-1.096-.046-3.233 0-2.136.008-2.388.046-3.231.036-.78.166-1.204.276-1.486.145-.373.319-.64.599-.92.28-.28.546-.453.92-.598.282-.11.705-.24 1.485-.276.738-.034 1.024-.044 2.515-.045v.002zm4.988 1.328a.96.96 0 1 0 0 1.92.96.96 0 0 0 0-1.92zm-4.27 1.122a4.109 4.109 0 1 0 0 8.217 4.109 4.109 0 0 0 0-8.217zm0 1.441a2.667 2.667 0 1 1 0 5.334 2.667 2.667 0 0 1 0-5.334z"/>
  </svg>
)

export default function Home() {
  // Form states
  const [subject, setSubject] = useState('')
  const [details, setDetails] = useState('')
  const [selectedMood, setSelectedMood] = useState('fire')
  const [showExtendedMoods, setShowExtendedMoods] = useState(false)
  
  // Feature toggles
  const [scrollStopperHook, setScrollStopperHook] = useState(true)
  const [proTags, setProTags] = useState(true)
  const [selectedGoals, setSelectedGoals] = useState(['comments'])
  
  // Loading & Results
  const [loading, setLoading] = useState(false)
  const [loadingMessageIndex, setLoadingMessageIndex] = useState(0)
  const [variants, setVariants] = useState([])
  const [copiedIndex, setCopiedIndex] = useState(null)

  // Region is hardcoded to "genz"
  const region = 'genz'

  // Rotate loading messages
  useEffect(() => {
    let interval
    if (loading) {
      interval = setInterval(() => {
        setLoadingMessageIndex(prev => (prev + 1) % loadingMessages.length)
      }, 700)
    }
    return () => clearInterval(interval)
  }, [loading])

  const handleMoodSelect = (moodId) => {
    if (moodId === 'more') {
      setShowExtendedMoods(!showExtendedMoods)
    } else {
      setSelectedMood(moodId)
      setShowExtendedMoods(false)
    }
  }

  const toggleGoal = (goalId) => {
    setSelectedGoals(prev => 
      prev.includes(goalId) 
        ? prev.filter(g => g !== goalId)
        : [...prev, goalId]
    )
  }

  const handleGenerate = async (e) => {
    e.preventDefault()
    if (!subject.trim()) return

    setLoading(true)
    setVariants([])
    setLoadingMessageIndex(0)

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subject,
          mood: selectedMood,
          region,
          details,
          feedback: '',
          scrollStopperHook,
          proTags,
          targetGoals: selectedGoals
        })
      })

      const data = await response.json()
      if (response.ok) {
        setVariants(data.variants || [])
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const copyCaption = (text, index) => {
    if (typeof window !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(text)
        .then(() => {
          setCopiedIndex(index)
          setTimeout(() => setCopiedIndex(null), 2000)
        })
        .catch((e) => console.error('Copy failed', e))
    }
  }

  // Separate variants by type
  const shortCaptions = variants.filter(v => v.type === 'short')
  const premiumCaptions = variants.filter(v => v.premium)
  const standardCaptions = variants.filter(v => !v.premium && v.type !== 'short')

  return (
    <>
      <Head>
        <title>FunCaption - AI Caption Generator</title>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
        <meta name="description" content="Generate viral Instagram captions with AI" />
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
          background: linear-gradient(135deg, #0f0f1a 0%, #1a1a2e 50%, #16213e 100%);
          min-height: 100vh;
          color: #ffffff;
        }

        /* Custom scrollbar */
        ::-webkit-scrollbar {
          width: 6px;
        }
        ::-webkit-scrollbar-track {
          background: rgba(255,255,255,0.05);
        }
        ::-webkit-scrollbar-thumb {
          background: rgba(139, 92, 246, 0.5);
          border-radius: 3px;
        }

        /* Toggle Switch */
        .toggle-switch {
          position: relative;
          width: 52px;
          height: 28px;
          background: rgba(255,255,255,0.1);
          border-radius: 14px;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        .toggle-switch.active {
          background: linear-gradient(135deg, #8b5cf6, #a855f7);
        }
        .toggle-switch::after {
          content: '';
          position: absolute;
          top: 3px;
          left: 3px;
          width: 22px;
          height: 22px;
          background: white;
          border-radius: 50%;
          transition: all 0.3s ease;
          box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        }
        .toggle-switch.active::after {
          left: 27px;
        }

        /* Skeleton shimmer */
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        .skeleton {
          background: linear-gradient(90deg, 
            rgba(255,255,255,0.05) 25%, 
            rgba(255,255,255,0.1) 50%, 
            rgba(255,255,255,0.05) 75%
          );
          background-size: 200% 100%;
          animation: shimmer 1.5s infinite;
          border-radius: 12px;
        }

        /* Glow button pulse */
        @keyframes glow-pulse {
          0%, 100% { box-shadow: 0 0 20px rgba(139, 92, 246, 0.4), 0 0 40px rgba(139, 92, 246, 0.2); }
          50% { box-shadow: 0 0 30px rgba(139, 92, 246, 0.6), 0 0 60px rgba(139, 92, 246, 0.3); }
        }

        /* Float animation */
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }

        /* Mood wheel rotation */
        @keyframes rotate-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>

      <div style={{ 
        minHeight: '100vh',
        padding: '20px',
        maxWidth: '480px',
        margin: '0 auto'
      }}>
        
        {/* Header */}
        <header style={{
          textAlign: 'center',
          padding: '20px 0 30px'
        }}>
          <h1 style={{
            fontSize: '2rem',
            fontWeight: '800',
            background: 'linear-gradient(135deg, #8b5cf6, #a855f7, #ec4899)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            marginBottom: '8px'
          }}>
            FunCaption
          </h1>
          <p style={{
            fontSize: '0.9rem',
            color: 'rgba(255,255,255,0.6)',
            fontWeight: '500'
          }}>
            AI-powered captions that go viral ✨
          </p>
        </header>

        {/* ========== INPUT CARD ========== */}
        <div style={{
          background: 'rgba(255,255,255,0.05)',
          backdropFilter: 'blur(20px)',
          borderRadius: '24px',
          padding: '24px',
          marginBottom: '24px',
          border: '1px solid rgba(255,255,255,0.08)'
        }}>
          <label style={{
            display: 'block',
            fontSize: '0.85rem',
            fontWeight: '600',
            color: 'rgba(255,255,255,0.7)',
            marginBottom: '12px'
          }}>
            What's the story? 📝
          </label>
          
          <textarea
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="e.g., Making coffee in NYC, Gym grind at 5 AM, Sunset at the beach..."
            style={{
              width: '100%',
              minHeight: '100px',
              background: 'transparent',
              border: 'none',
              outline: 'none',
              color: '#ffffff',
              fontSize: '1.1rem',
              fontWeight: '500',
              lineHeight: '1.6',
              resize: 'none',
              fontFamily: 'inherit'
            }}
          />

          {/* Optional details */}
          <div style={{
            borderTop: '1px solid rgba(255,255,255,0.08)',
            marginTop: '16px',
            paddingTop: '16px'
          }}>
            <label style={{
              display: 'block',
              fontSize: '0.75rem',
              fontWeight: '600',
              color: 'rgba(255,255,255,0.5)',
              marginBottom: '8px'
            }}>
              Add more context (optional)
            </label>
            <input
              type="text"
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              placeholder="Camera angle, emotions, twist..."
              style={{
                width: '100%',
                background: 'rgba(255,255,255,0.05)',
                border: 'none',
                outline: 'none',
                color: '#ffffff',
                fontSize: '0.9rem',
                padding: '12px 16px',
                borderRadius: '12px',
                fontFamily: 'inherit'
              }}
            />
          </div>
        </div>

        {/* ========== MOOD DIAL SECTION ========== */}
        <div style={{
          background: 'rgba(255,255,255,0.03)',
          backdropFilter: 'blur(20px)',
          borderRadius: '24px',
          padding: '24px',
          marginBottom: '24px',
          border: '1px solid rgba(255,255,255,0.05)',
          textAlign: 'center'
        }}>
          <label style={{
            display: 'block',
            fontSize: '0.85rem',
            fontWeight: '600',
            color: 'rgba(255,255,255,0.7)',
            marginBottom: '20px'
          }}>
            Pick the vibe 🎭
          </label>

          {/* Mood Wheel */}
          <div style={{
            position: 'relative',
            width: '280px',
            height: '280px',
            margin: '0 auto 20px'
          }}>
            {/* Outer ring with moods */}
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              borderRadius: '50%',
              border: '2px solid rgba(139, 92, 246, 0.2)'
            }}>
              {moodOptions.map((mood, index) => {
                const angle = (index * (360 / moodOptions.length)) - 90
                const radian = (angle * Math.PI) / 180
                const radius = 110
                const x = Math.cos(radian) * radius
                const y = Math.sin(radian) * radius
                const isSelected = selectedMood === mood.id || (mood.id === 'more' && showExtendedMoods)

                return (
                  <button
                    key={mood.id}
                    onClick={() => handleMoodSelect(mood.id)}
                    style={{
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px)) scale(${isSelected ? 1.2 : 1})`,
                      width: '56px',
                      height: '56px',
                      borderRadius: '50%',
                      background: isSelected 
                        ? 'linear-gradient(135deg, #8b5cf6, #a855f7)' 
                        : 'rgba(255,255,255,0.08)',
                      border: isSelected 
                        ? '2px solid rgba(255,255,255,0.3)' 
                        : '2px solid rgba(255,255,255,0.1)',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1.5rem',
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      boxShadow: isSelected 
                        ? '0 8px 24px rgba(139, 92, 246, 0.4)' 
                        : '0 4px 12px rgba(0,0,0,0.2)'
                    }}
                  >
                    {mood.emoji}
                  </button>
                )
              })}
            </div>

            {/* Center Generate Button */}
            <button
              onClick={handleGenerate}
              disabled={loading || !subject.trim()}
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '120px',
                height: '120px',
                borderRadius: '50%',
                background: loading 
                  ? 'rgba(139, 92, 246, 0.3)'
                  : 'linear-gradient(135deg, #8b5cf6, #a855f7, #ec4899)',
                border: 'none',
                cursor: loading || !subject.trim() ? 'not-allowed' : 'pointer',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '4px',
                boxShadow: loading 
                  ? 'none' 
                  : '0 0 30px rgba(139, 92, 246, 0.5), 0 0 60px rgba(139, 92, 246, 0.2)',
                animation: loading ? 'none' : 'glow-pulse 2s ease-in-out infinite',
                transition: 'all 0.3s ease',
                opacity: !subject.trim() ? 0.5 : 1
              }}
            >
              {loading ? (
                <div style={{
                  width: '30px',
                  height: '30px',
                  border: '3px solid rgba(255,255,255,0.3)',
                  borderTop: '3px solid white',
                  borderRadius: '50%',
                  animation: 'rotate-slow 1s linear infinite'
                }}></div>
              ) : (
                <>
                  <span style={{ fontSize: '1.5rem' }}>✨</span>
                  <span style={{
                    color: 'white',
                    fontSize: '0.75rem',
                    fontWeight: '700',
                    textAlign: 'center',
                    lineHeight: '1.2'
                  }}>
                    Work your<br/>magic!
                  </span>
                </>
              )}
            </button>
          </div>

          {/* Selected mood label */}
          <p style={{
            fontSize: '0.85rem',
            color: 'rgba(255,255,255,0.6)',
            marginTop: '8px'
          }}>
            Mood: <span style={{ color: '#a855f7', fontWeight: '600' }}>
              {moodOptions.find(m => m.id === selectedMood)?.label || 
               extendedMoods.find(m => m.id === selectedMood)?.label || 
               selectedMood}
            </span>
          </p>
        </div>

        {/* Extended Moods Modal */}
        {showExtendedMoods && (
          <div style={{
            background: 'rgba(255,255,255,0.05)',
            backdropFilter: 'blur(20px)',
            borderRadius: '24px',
            padding: '20px',
            marginBottom: '24px',
            border: '1px solid rgba(255,255,255,0.08)'
          }}>
            <p style={{
              fontSize: '0.8rem',
              color: 'rgba(255,255,255,0.6)',
              marginBottom: '16px',
              textAlign: 'center'
            }}>
              More moods 🎨
            </p>
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '10px',
              justifyContent: 'center'
            }}>
              {extendedMoods.map(mood => (
                <button
                  key={mood.id}
                  onClick={() => {
                    setSelectedMood(mood.id)
                    setShowExtendedMoods(false)
                  }}
                  style={{
                    padding: '10px 16px',
                    borderRadius: '20px',
                    background: selectedMood === mood.id 
                      ? 'linear-gradient(135deg, #8b5cf6, #a855f7)' 
                      : 'rgba(255,255,255,0.08)',
                    border: 'none',
                    color: 'white',
                    fontSize: '0.85rem',
                    fontWeight: '500',
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
            </div>
          </div>
        )}

        {/* ========== ENHANCING FEATURES TRAY ========== */}
        <div style={{
          background: 'rgba(255,255,255,0.03)',
          backdropFilter: 'blur(20px)',
          borderRadius: '24px',
          padding: '20px',
          marginBottom: '24px',
          border: '1px solid rgba(255,255,255,0.05)'
        }}>
          <p style={{
            fontSize: '0.8rem',
            fontWeight: '600',
            color: 'rgba(255,255,255,0.5)',
            marginBottom: '16px'
          }}>
            Enhancing Features 🚀
          </p>

          {/* Scroll-Stopper Hook Toggle */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '16px',
            padding: '12px 16px',
            background: 'rgba(255,255,255,0.03)',
            borderRadius: '16px'
          }}>
            <div>
              <p style={{ fontSize: '0.9rem', fontWeight: '600', color: 'white' }}>
                🎣 Scroll-Stopper Hook
              </p>
              <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)' }}>
                Include a viral opening line
              </p>
            </div>
            <div 
              className={`toggle-switch ${scrollStopperHook ? 'active' : ''}`}
              onClick={() => setScrollStopperHook(!scrollStopperHook)}
            ></div>
          </div>

          {/* Target Goal Chips */}
          <div style={{ marginBottom: '16px' }}>
            <p style={{ 
              fontSize: '0.8rem', 
              color: 'rgba(255,255,255,0.5)', 
              marginBottom: '10px' 
            }}>
              🎯 Target Goal
            </p>
            <div style={{
              display: 'flex',
              gap: '8px',
              flexWrap: 'wrap'
            }}>
              {targetGoals.map(goal => (
                <button
                  key={goal.id}
                  onClick={() => toggleGoal(goal.id)}
                  style={{
                    padding: '10px 16px',
                    borderRadius: '20px',
                    background: selectedGoals.includes(goal.id)
                      ? 'linear-gradient(135deg, #8b5cf6, #a855f7)'
                      : 'rgba(255,255,255,0.08)',
                    border: selectedGoals.includes(goal.id)
                      ? '1px solid rgba(255,255,255,0.2)'
                      : '1px solid rgba(255,255,255,0.1)',
                    color: 'white',
                    fontSize: '0.8rem',
                    fontWeight: '500',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <span>{goal.emoji}</span>
                  <span>{goal.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Pro Tags Toggle */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '12px 16px',
            background: 'rgba(255,255,255,0.03)',
            borderRadius: '16px'
          }}>
            <div>
              <p style={{ fontSize: '0.9rem', fontWeight: '600', color: 'white' }}>
                #️⃣ Pro Tags
              </p>
              <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)' }}>
                Auto-generate 5 trending hashtags
              </p>
            </div>
            <div 
              className={`toggle-switch ${proTags ? 'active' : ''}`}
              onClick={() => setProTags(!proTags)}
            ></div>
          </div>
        </div>

        {/* ========== LOADING STATE ========== */}
        {loading && (
          <div style={{
            background: 'rgba(255,255,255,0.05)',
            backdropFilter: 'blur(20px)',
            borderRadius: '24px',
            padding: '32px 24px',
            marginBottom: '24px',
            border: '1px solid rgba(255,255,255,0.08)',
            textAlign: 'center'
          }}>
            {/* Skeleton Cards */}
            <div style={{ marginBottom: '24px' }}>
              <div className="skeleton" style={{ height: '80px', marginBottom: '12px' }}></div>
              <div className="skeleton" style={{ height: '60px', marginBottom: '12px' }}></div>
              <div className="skeleton" style={{ height: '40px', width: '60%', margin: '0 auto' }}></div>
            </div>

            {/* Rotating Status */}
            <p style={{
              fontSize: '1rem',
              fontWeight: '600',
              color: '#a855f7',
              animation: 'float 2s ease-in-out infinite'
            }}>
              {loadingMessages[loadingMessageIndex]}
            </p>
          </div>
        )}

        {/* ========== RESULTS ========== */}
        {variants.length > 0 && !loading && (
          <div style={{ marginBottom: '24px' }}>
            <p style={{
              fontSize: '0.85rem',
              fontWeight: '600',
              color: 'rgba(255,255,255,0.5)',
              marginBottom: '16px',
              textAlign: 'center'
            }}>
              Your captions are ready! ✨
            </p>

            {/* Short Captions */}
            {shortCaptions.map((v, i) => {
              const processedCaption = (v.caption || '').replace(
                /\n\nHelp please make us a favour follow us on Instagram.*$/s,
                ''
              )
              
              return (
                <div 
                  key={`short-${i}`}
                  style={{
                    background: 'linear-gradient(135deg, rgba(251, 191, 36, 0.1), rgba(245, 158, 11, 0.05))',
                    borderRadius: '24px',
                    padding: '20px',
                    marginBottom: '16px',
                    border: '1px solid rgba(251, 191, 36, 0.3)'
                  }}
                >
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    marginBottom: '12px'
                  }}>
                    <span style={{ fontSize: '1.2rem' }}>⚡</span>
                    <span style={{
                      fontSize: '0.75rem',
                      fontWeight: '700',
                      color: '#fbbf24',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em'
                    }}>
                      {v.label || "Quick Fire"}
                    </span>
                  </div>

                  <p style={{
                    fontSize: '1rem',
                    lineHeight: '1.7',
                    color: 'rgba(255,255,255,0.9)',
                    marginBottom: '16px',
                    whiteSpace: 'pre-line'
                  }}>
                    {processedCaption}
                  </p>

                  <button
                    onClick={() => copyCaption(v.caption, `short-${i}`)}
                    style={{
                      width: '100%',
                      padding: '14px',
                      borderRadius: '16px',
                      background: copiedIndex === `short-${i}`
                        ? 'linear-gradient(135deg, #22c55e, #16a34a)'
                        : 'linear-gradient(135deg, #fbbf24, #f59e0b)',
                      border: 'none',
                      color: copiedIndex === `short-${i}` ? 'white' : '#1a1a2e',
                      fontSize: '0.9rem',
                      fontWeight: '700',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    {copiedIndex === `short-${i}` ? '✓ Copied!' : '📋 Copy Caption'}
                  </button>
                </div>
              )
            })}

            {/* Premium Captions */}
            {premiumCaptions.map((v, i) => {
              const processedCaption = (v.caption || '').replace(
                /\n\nHelp please make us a favour follow us on Instagram.*$/s,
                ''
              )

              return (
                <div 
                  key={`premium-${i}`}
                  style={{
                    background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.15), rgba(168, 85, 247, 0.1))',
                    borderRadius: '24px',
                    padding: '20px',
                    marginBottom: '16px',
                    border: '2px solid rgba(139, 92, 246, 0.4)',
                    position: 'relative',
                    overflow: 'hidden'
                  }}
                >
                  {/* Premium badge */}
                  <div style={{
                    position: 'absolute',
                    top: '12px',
                    right: '12px',
                    background: 'linear-gradient(135deg, #8b5cf6, #a855f7)',
                    padding: '4px 10px',
                    borderRadius: '12px',
                    fontSize: '0.65rem',
                    fontWeight: '700',
                    color: 'white',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em'
                  }}>
                    ★ Premium
                  </div>

                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    marginBottom: '12px'
                  }}>
                    <span style={{ fontSize: '1.2rem' }}>✨</span>
                    <span style={{
                      fontSize: '0.75rem',
                      fontWeight: '700',
                      color: '#a855f7',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em'
                    }}>
                      {v.label || "Story Mode"}
                    </span>
                  </div>

                  <p style={{
                    fontSize: '1rem',
                    lineHeight: '1.8',
                    color: 'rgba(255,255,255,0.9)',
                    marginBottom: '16px',
                    whiteSpace: 'pre-line'
                  }}>
                    {processedCaption}
                  </p>

                  {/* Instagram CTA */}
                  <div style={{
                    background: 'rgba(0,0,0,0.2)',
                    padding: '12px',
                    borderRadius: '12px',
                    marginBottom: '16px',
                    textAlign: 'center'
                  }}>
                    <a
                      href="https://www.instagram.com/instaalgohacker?igsh=MW1maXl2a3IxNm40OA=="
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '8px',
                        color: '#a855f7',
                        textDecoration: 'none',
                        fontSize: '0.85rem',
                        fontWeight: '600'
                      }}
                    >
                      <InstagramIcon />
                      Follow for More Premium Tips
                    </a>
                  </div>

                  <button
                    onClick={() => copyCaption(v.caption, `premium-${i}`)}
                    style={{
                      width: '100%',
                      padding: '14px',
                      borderRadius: '16px',
                      background: copiedIndex === `premium-${i}`
                        ? 'linear-gradient(135deg, #22c55e, #16a34a)'
                        : 'linear-gradient(135deg, #8b5cf6, #a855f7)',
                      border: 'none',
                      color: 'white',
                      fontSize: '0.9rem',
                      fontWeight: '700',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    {copiedIndex === `premium-${i}` ? '✓ Copied!' : '📋 Copy Premium Caption'}
                  </button>
                </div>
              )
            })}

            {/* Standard Captions */}
            {standardCaptions.map((v, i) => {
              const processedCaption = (v.caption || '').replace(
                /\n\nHelp please make us a favour follow us on Instagram.*$/s,
                ''
              )

              return (
                <div 
                  key={`standard-${i}`}
                  style={{
                    background: 'rgba(255,255,255,0.05)',
                    borderRadius: '24px',
                    padding: '20px',
                    marginBottom: '16px',
                    border: '1px solid rgba(255,255,255,0.1)'
                  }}
                >
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    marginBottom: '12px'
                  }}>
                    <span style={{ fontSize: '1.2rem' }}>📝</span>
                    <span style={{
                      fontSize: '0.75rem',
                      fontWeight: '700',
                      color: 'rgba(255,255,255,0.6)',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em'
                    }}>
                      {v.label || `Caption ${i + 1}`}
                    </span>
                  </div>

                  <p style={{
                    fontSize: '1rem',
                    lineHeight: '1.7',
                    color: 'rgba(255,255,255,0.85)',
                    marginBottom: '16px',
                    whiteSpace: 'pre-line'
                  }}>
                    {processedCaption}
                  </p>

                  <button
                    onClick={() => copyCaption(v.caption, `standard-${i}`)}
                    style={{
                      width: '100%',
                      padding: '14px',
                      borderRadius: '16px',
                      background: copiedIndex === `standard-${i}`
                        ? 'linear-gradient(135deg, #22c55e, #16a34a)'
                        : 'rgba(255,255,255,0.1)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      color: 'white',
                      fontSize: '0.9rem',
                      fontWeight: '600',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    {copiedIndex === `standard-${i}` ? '✓ Copied!' : '📋 Copy Caption'}
                  </button>
                </div>
              )
            })}
          </div>
        )}

        {/* ========== FOOTER ========== */}
        <footer style={{
          textAlign: 'center',
          padding: '24px 0',
          borderTop: '1px solid rgba(255,255,255,0.05)'
        }}>
          <a
            href="https://www.instagram.com/instaalgohacker?igsh=MW1maXl2a3IxNm40OA=="
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '12px 20px',
              borderRadius: '20px',
              background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.2), rgba(168, 85, 247, 0.1))',
              border: '1px solid rgba(139, 92, 246, 0.3)',
              color: '#a855f7',
              textDecoration: 'none',
              fontSize: '0.85rem',
              fontWeight: '600',
              marginBottom: '16px',
              transition: 'all 0.2s ease'
            }}
          >
            <InstagramIcon />
            Follow @instaalgohacker
          </a>

          <p style={{
            fontSize: '0.8rem',
            color: 'rgba(255,255,255,0.4)'
          }}>
            FunCaption © 2025 — Built for creators 🔥
          </p>
        </footer>
      </div>
    </>
  )
  }
