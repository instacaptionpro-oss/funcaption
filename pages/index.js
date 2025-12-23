import { useState, useEffect, useRef } from 'react'
import Head from 'next/head'

// Mood options with emojis
const moodOptions = [
  { id: 'funny', emoji: '😂', label: 'Funny' },
  { id: 'fire', emoji: '🔥', label: 'Fire' },
  { id: 'aesthetic', emoji: '✨', label: 'Aesthetic' },
  { id: 'deep', emoji: '🧠', label: 'Deep' },
  { id: 'poetic', emoji: '✍️', label: 'Poetic' },
  { id: 'motivation', emoji: '🚀', label: 'Motivation' },
  { id: 'attitude', emoji: '😎', label: 'Attitude' },
  { id: 'love', emoji: '💕', label: 'Love' },
  { id: 'breakup', emoji: '💔', label: 'Breakup' },
  { id: 'savage', emoji: '🐍', label: 'Savage' },
  { id: 'sad', emoji: '😢', label: 'Sad' },
  { id: 'happy', emoji: '😊', label: 'Happy' },
  { id: 'alone', emoji: '🌙', label: 'Alone' },
  { id: 'confident', emoji: '💪', label: 'Confident' },
  { id: 'romantic', emoji: '🌹', label: 'Romantic' },
  { id: 'sarcastic', emoji: '🙄', label: 'Sarcastic' }
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

// Example subjects for placeholder
const exampleSubjects = [
  "Making coffee in a cozy café ☕",
  "Gym grind at 5 AM 💪",
  "Sunset at the beach 🌅",
  "Late night coding session 💻",
  "Road trip with friends 🚗",
  "Cooking my favorite meal 🍳"
]

const InstagramIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16">
    <path d="M8 0C5.829 0 5.556.01 4.703.048 3.85.088 3.269.222 2.76.42a3.917 3.917 0 0 0-1.417.923A3.927 3.927 0 0 0 .42 2.76C.222 3.268.087 3.85.048 4.7.01 5.555 0 5.827 0 8.001c0 2.172.01 2.444.048 3.297.04.852.174 1.433.372 1.942.205.526.478.972.923 1.417.444.445.89.719 1.416.923.51.198 1.09.333 1.942.372C5.555 15.99 5.827 16 8 16s2.444-.01 3.298-.048c.851-.04 1.434-.174 1.943-.372a3.916 3.916 0 0 0 1.416-.923c.445-.445.718-.891.923-1.417.197-.509.332-1.09.372-1.942C15.99 10.445 16 10.173 16 8s-.01-2.445-.048-3.299c-.04-.851-.175-1.433-.372-1.941a3.926 3.926 0 0 0-.923-1.417A3.911 3.911 0 0 0 13.24.42c-.51-.198-1.092-.333-1.943-.372C10.443.01 10.172 0 7.998 0h.003zm-.717 1.442h.718c2.136 0 2.389.007 3.232.046.78.035 1.204.166 1.486.275.373.145.64.319.92.599.28.28.453.546.598.92.11.281.24.705.275 1.485.039.843.047 1.096.047 3.231s-.008 2.389-.047 3.232c-.035.78-.166 1.203-.275 1.485a2.47 2.47 0 0 1-.599.919c-.28.28-.546.453-.92.598-.28.11-.704.24-1.485.276-.843.038-1.096.047-3.232.047s-2.39-.009-3.233-.047c-.78-.036-1.203-.166-1.485-.276a2.478 2.478 0 0 1-.92-.598 2.48 2.48 0 0 1-.6-.92c-.109-.281-.24-.705-.275-1.485-.038-.843-.046-1.096-.046-3.233 0-2.136.008-2.388.046-3.231.036-.78.166-1.204.276-1.486.145-.373.319-.64.599-.92.28-.28.546-.453.92-.598.282-.11.705-.24 1.485-.276.738-.034 1.024-.044 2.515-.045v.002zm4.988 1.328a.96.96 0 1 0 0 1.92.96.96 0 0 0 0-1.92zm-4.27 1.122a4.109 4.109 0 1 0 0 8.217 4.109 4.109 0 0 0 0-8.217zm0 1.441a2.667 2.667 0 1 1 0 5.334 2.667 2.667 0 0 1 0-5.334z"/>
  </svg>
)

export default function Home() {
  // Form states
  const [subject, setSubject] = useState('')
  const [details, setDetails] = useState('')
  const [selectedMood, setSelectedMood] = useState('fire')
  const [wheelRotation, setWheelRotation] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const [startAngle, setStartAngle] = useState(0)
  const [currentExample, setCurrentExample] = useState(0)
  
  // Feature toggles
  const [scrollStopperHook, setScrollStopperHook] = useState(true)
  const [proTags, setProTags] = useState(true)
  const [selectedGoals, setSelectedGoals] = useState(['comments'])
  
  // Loading & Results
  const [loading, setLoading] = useState(false)
  const [loadingMessageIndex, setLoadingMessageIndex] = useState(0)
  const [variants, setVariants] = useState([])
  const [copiedIndex, setCopiedIndex] = useState(null)

  // Refs
  const wheelRef = useRef(null)

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

  // Cycle through example subjects
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentExample(prev => (prev + 1) % exampleSubjects.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  // Wheel drag handlers
  const getAngleFromEvent = (e, rect) => {
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    const clientX = e.touches ? e.touches[0].clientX : e.clientX
    const clientY = e.touches ? e.touches[0].clientY : e.clientY
    return Math.atan2(clientY - centerY, clientX - centerX) * (180 / Math.PI)
  }

  const handleWheelStart = (e) => {
    if (!wheelRef.current) return
    setIsDragging(true)
    const rect = wheelRef.current.getBoundingClientRect()
    setStartAngle(getAngleFromEvent(e, rect) - wheelRotation)
  }

  const handleWheelMove = (e) => {
    if (!isDragging || !wheelRef.current) return
    const rect = wheelRef.current.getBoundingClientRect()
    const currentAngle = getAngleFromEvent(e, rect)
    setWheelRotation(currentAngle - startAngle)
  }

  const handleWheelEnd = () => {
    setIsDragging(false)
    // Snap to nearest mood
    const moodCount = moodOptions.length
    const anglePerMood = 360 / moodCount
    const normalizedRotation = ((wheelRotation % 360) + 360) % 360
    const nearestIndex = Math.round(normalizedRotation / anglePerMood) % moodCount
    const snappedRotation = nearestIndex * anglePerMood
    setWheelRotation(snappedRotation)
    
    // Calculate which mood is at the top (12 o'clock position)
    const topMoodIndex = (moodCount - nearestIndex) % moodCount
    setSelectedMood(moodOptions[topMoodIndex].id)
  }

  const selectMoodDirectly = (moodId, index) => {
    setSelectedMood(moodId)
    const moodCount = moodOptions.length
    const anglePerMood = 360 / moodCount
    // Rotate so selected mood is at top
    const targetRotation = ((moodCount - index) % moodCount) * anglePerMood
    setWheelRotation(targetRotation)
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
          background: #FAFAFA;
          min-height: 100vh;
          color: #262626;
        }

        /* Instagram Gradient */
        .instagram-gradient {
          background: linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%);
        }

        .instagram-gradient-text {
          background: linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        /* Custom scrollbar */
        ::-webkit-scrollbar {
          width: 6px;
        }
        ::-webkit-scrollbar-track {
          background: #f1f1f1;
        }
        ::-webkit-scrollbar-thumb {
          background: linear-gradient(45deg, #f09433, #dc2743, #bc1888);
          border-radius: 3px;
        }

        /* Toggle Switch */
        .toggle-switch {
          position: relative;
          width: 52px;
          height: 28px;
          background: #e0e0e0;
          border-radius: 14px;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        .toggle-switch.active {
          background: linear-gradient(45deg, #f09433, #e6683c, #dc2743, #bc1888);
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
          box-shadow: 0 2px 8px rgba(0,0,0,0.15);
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
            #f0f0f0 25%, 
            #e0e0e0 50%, 
            #f0f0f0 75%
          );
          background-size: 200% 100%;
          animation: shimmer 1.5s infinite;
          border-radius: 12px;
        }

        /* Glow button pulse */
        @keyframes glow-pulse {
          0%, 100% { 
            box-shadow: 0 4px 20px rgba(225, 48, 108, 0.4), 
                        0 8px 40px rgba(225, 48, 108, 0.2);
            transform: scale(1);
          }
          50% { 
            box-shadow: 0 6px 30px rgba(225, 48, 108, 0.5), 
                        0 12px 50px rgba(225, 48, 108, 0.3);
            transform: scale(1.02);
          }
        }

        /* Float animation */
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }

        /* Spin animation */
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        /* Fade in animation */
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        /* Example text fade */
        @keyframes exampleFade {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 0.6; }
        }

        .example-text {
          animation: exampleFade 3s ease-in-out infinite;
        }

        /* Wheel grab cursor */
        .wheel-container {
          cursor: grab;
          touch-action: none;
        }
        .wheel-container:active {
          cursor: grabbing;
        }

        /* Card hover */
        .card-hover {
          transition: all 0.3s ease;
        }
        .card-hover:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 30px rgba(0,0,0,0.08);
        }
      `}</style>

      <div style={{ 
        minHeight: '100vh',
        padding: '20px',
        maxWidth: '480px',
        margin: '0 auto',
        background: '#FAFAFA'
      }}>
        
        {/* ========== HEADER ========== */}
        <header style={{
          textAlign: 'center',
          padding: '24px 0 32px'
        }}>
          <h1 className="instagram-gradient-text" style={{
            fontSize: '2.2rem',
            fontWeight: '900',
            marginBottom: '8px',
            letterSpacing: '-0.02em'
          }}>
            FunCaption
          </h1>
          <p style={{
            fontSize: '0.95rem',
            color: '#8e8e8e',
            fontWeight: '500'
          }}>
            AI-powered captions that go viral ✨
          </p>
        </header>

        {/* ========== INPUT CARD ========== */}
        <div className="card-hover" style={{
          background: '#FFFFFF',
          borderRadius: '24px',
          padding: '24px',
          marginBottom: '20px',
          boxShadow: '0 2px 20px rgba(0,0,0,0.06)',
          border: '1px solid rgba(0,0,0,0.05)'
        }}>
          <label style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '0.9rem',
            fontWeight: '700',
            color: '#262626',
            marginBottom: '16px'
          }}>
            <span style={{ fontSize: '1.2rem' }}>📝</span>
            What's the story?
          </label>
          
          <div style={{ position: 'relative' }}>
            <textarea
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder=""
              style={{
                width: '100%',
                minHeight: '120px',
                background: '#FAFAFA',
                border: '2px solid #efefef',
                borderRadius: '16px',
                padding: '16px',
                outline: 'none',
                color: '#262626',
                fontSize: '1.05rem',
                fontWeight: '500',
                lineHeight: '1.6',
                resize: 'none',
                fontFamily: 'inherit',
                transition: 'border-color 0.3s ease'
              }}
              onFocus={(e) => e.target.style.borderColor = '#dc2743'}
              onBlur={(e) => e.target.style.borderColor = '#efefef'}
            />
            
            {/* Faded example text */}
            {!subject && (
              <div 
                className="example-text"
                style={{
                  position: 'absolute',
                  top: '16px',
                  left: '16px',
                  right: '16px',
                  pointerEvents: 'none',
                  color: '#8e8e8e',
                  fontSize: '1.05rem',
                  fontWeight: '500',
                  lineHeight: '1.6'
                }}
              >
                <span style={{ color: '#c7c7c7' }}>Try: </span>
                {exampleSubjects[currentExample]}
              </div>
            )}
          </div>

          {/* Optional details */}
          <div style={{
            marginTop: '16px'
          }}>
            <label style={{
              display: 'block',
              fontSize: '0.8rem',
              fontWeight: '600',
              color: '#8e8e8e',
              marginBottom: '8px'
            }}>
              Add more context (optional)
            </label>
            <input
              type="text"
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              placeholder="Camera angle, emotions, location..."
              style={{
                width: '100%',
                background: '#FAFAFA',
                border: '2px solid #efefef',
                borderRadius: '12px',
                outline: 'none',
                color: '#262626',
                fontSize: '0.95rem',
                padding: '14px 16px',
                fontFamily: 'inherit',
                transition: 'border-color 0.3s ease'
              }}
              onFocus={(e) => e.target.style.borderColor = '#dc2743'}
              onBlur={(e) => e.target.style.borderColor = '#efefef'}
            />
          </div>
        </div>

        {/* ========== MOOD WHEEL SECTION ========== */}
        <div className="card-hover" style={{
          background: '#FFFFFF',
          borderRadius: '24px',
          padding: '24px',
          marginBottom: '20px',
          boxShadow: '0 2px 20px rgba(0,0,0,0.06)',
          border: '1px solid rgba(0,0,0,0.05)',
          textAlign: 'center'
        }}>
          <label style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            fontSize: '0.9rem',
            fontWeight: '700',
            color: '#262626',
            marginBottom: '24px'
          }}>
            <span style={{ fontSize: '1.2rem' }}>🎨</span>
            Spin & Pick the Vibe
          </label>

          {/* Spinnable Mood Wheel */}
          <div 
            ref={wheelRef}
            className="wheel-container"
            style={{
              position: 'relative',
              width: '300px',
              height: '300px',
              margin: '0 auto 24px',
              userSelect: 'none'
            }}
            onMouseDown={handleWheelStart}
            onMouseMove={handleWheelMove}
            onMouseUp={handleWheelEnd}
            onMouseLeave={handleWheelEnd}
            onTouchStart={handleWheelStart}
            onTouchMove={handleWheelMove}
            onTouchEnd={handleWheelEnd}
          >
            {/* Outer decorative ring */}
            <div style={{
              position: 'absolute',
              top: '-5px',
              left: '-5px',
              right: '-5px',
              bottom: '-5px',
              borderRadius: '50%',
              background: 'linear-gradient(45deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888)',
              opacity: 0.15
            }}></div>

            {/* Selection indicator at top */}
            <div style={{
              position: 'absolute',
              top: '-12px',
              left: '50%',
              transform: 'translateX(-50%)',
              width: '24px',
              height: '24px',
              background: 'linear-gradient(45deg, #f09433, #dc2743, #bc1888)',
              borderRadius: '50%',
              boxShadow: '0 4px 12px rgba(225, 48, 108, 0.4)',
              zIndex: 10,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <div style={{
                width: 0,
                height: 0,
                borderLeft: '6px solid transparent',
                borderRight: '6px solid transparent',
                borderTop: '8px solid white',
                marginTop: '2px'
              }}></div>
            </div>

            {/* Wheel background */}
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              borderRadius: '50%',
              background: '#FAFAFA',
              border: '3px solid #efefef'
            }}></div>

            {/* Rotating mood items */}
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              transform: `rotate(${wheelRotation}deg)`,
              transition: isDragging ? 'none' : 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
            }}>
              {moodOptions.map((mood, index) => {
                const angle = (index * (360 / moodOptions.length)) - 90
                const radian = (angle * Math.PI) / 180
                const radius = 115
                const x = Math.cos(radian) * radius
                const y = Math.sin(radian) * radius
                const isSelected = selectedMood === mood.id

                return (
                  <button
                    key={mood.id}
                    onClick={(e) => {
                      e.stopPropagation()
                      selectMoodDirectly(mood.id, index)
                    }}
                    style={{
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px)) rotate(${-wheelRotation}deg)`,
                      width: isSelected ? '56px' : '48px',
                      height: isSelected ? '56px' : '48px',
                      borderRadius: '50%',
                      background: isSelected 
                        ? 'linear-gradient(45deg, #f09433, #e6683c, #dc2743, #bc1888)' 
                        : '#FFFFFF',
                      border: isSelected 
                        ? 'none' 
                        : '2px solid #efefef',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: isSelected ? '1.5rem' : '1.3rem',
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      boxShadow: isSelected 
                        ? '0 6px 20px rgba(225, 48, 108, 0.35)' 
                        : '0 2px 8px rgba(0,0,0,0.08)',
                      zIndex: isSelected ? 5 : 1
                    }}
                  >
                    {mood.emoji}
                  </button>
                )
              })}
            </div>

            {/* Center Generate Button - Instagram Style */}
            <button
              onClick={handleGenerate}
              disabled={loading || !subject.trim()}
              className="instagram-gradient"
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '110px',
                height: '110px',
                borderRadius: '50%',
                border: 'none',
                cursor: loading || !subject.trim() ? 'not-allowed' : 'pointer',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '4px',
                animation: loading || !subject.trim() ? 'none' : 'glow-pulse 2s ease-in-out infinite',
                transition: 'all 0.3s ease',
                opacity: !subject.trim() ? 0.6 : 1,
                zIndex: 10
              }}
            >
              {loading ? (
                <div style={{
                  width: '32px',
                  height: '32px',
                  border: '3px solid rgba(255,255,255,0.3)',
                  borderTop: '3px solid white',
                  borderRadius: '50%',
                  animation: 'spin 0.8s linear infinite'
                }}></div>
              ) : (
                <>
                  <span style={{ fontSize: '1.6rem' }}>✨</span>
                  <span style={{
                    color: 'white',
                    fontSize: '0.7rem',
                    fontWeight: '800',
                    textAlign: 'center',
                    lineHeight: '1.3',
                    textTransform: 'uppercase',
                    letterSpacing: '0.02em'
                  }}>
                    Work your<br/>magic!
                  </span>
                </>
              )}
            </button>
          </div>

          {/* Selected mood label */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 20px',
            background: '#FAFAFA',
            borderRadius: '20px',
            border: '1px solid #efefef'
          }}>
            <span style={{ fontSize: '1.2rem' }}>
              {moodOptions.find(m => m.id === selectedMood)?.emoji}
            </span>
            <span style={{
              fontSize: '0.9rem',
              fontWeight: '600',
              color: '#262626'
            }}>
              {moodOptions.find(m => m.id === selectedMood)?.label}
            </span>
          </div>

          {/* Spin hint */}
          <p style={{
            fontSize: '0.75rem',
            color: '#c7c7c7',
            marginTop: '12px'
          }}>
            👆 Drag to spin • Tap to select
          </p>
        </div>

        {/* ========== ENHANCING FEATURES TRAY ========== */}
        <div className="card-hover" style={{
          background: '#FFFFFF',
          borderRadius: '24px',
          padding: '20px',
          marginBottom: '20px',
          boxShadow: '0 2px 20px rgba(0,0,0,0.06)',
          border: '1px solid rgba(0,0,0,0.05)'
        }}>
          <p style={{
            fontSize: '0.8rem',
            fontWeight: '700',
            color: '#8e8e8e',
            marginBottom: '16px',
            textTransform: 'uppercase',
            letterSpacing: '0.05em'
          }}>
            🚀 Enhancing Features
          </p>

          {/* Scroll-Stopper Hook Toggle */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '14px',
            padding: '14px 16px',
            background: '#FAFAFA',
            borderRadius: '16px'
          }}>
            <div>
              <p style={{ fontSize: '0.9rem', fontWeight: '600', color: '#262626' }}>
                🎣 Scroll-Stopper Hook
              </p>
              <p style={{ fontSize: '0.75rem', color: '#8e8e8e', marginTop: '2px' }}>
                Include a viral opening line
              </p>
            </div>
            <div 
              className={`toggle-switch ${scrollStopperHook ? 'active' : ''}`}
              onClick={() => setScrollStopperHook(!scrollStopperHook)}
            ></div>
          </div>

          {/* Target Goal Chips */}
          <div style={{ marginBottom: '14px' }}>
            <p style={{ 
              fontSize: '0.8rem', 
              color: '#8e8e8e', 
              marginBottom: '10px',
              fontWeight: '600'
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
                  className="instagram-gradient"
                  style={{
                    padding: '10px 16px',
                    borderRadius: '20px',
                    background: selectedGoals.includes(goal.id)
                      ? undefined
                      : '#FAFAFA',
                    border: selectedGoals.includes(goal.id)
                      ? 'none'
                      : '2px solid #efefef',
                    color: selectedGoals.includes(goal.id) ? 'white' : '#262626',
                    fontSize: '0.8rem',
                    fontWeight: '600',
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
            padding: '14px 16px',
            background: '#FAFAFA',
            borderRadius: '16px'
          }}>
            <div>
              <p style={{ fontSize: '0.9rem', fontWeight: '600', color: '#262626' }}>
                #️⃣ Pro Tags
              </p>
              <p style={{ fontSize: '0.75rem', color: '#8e8e8e', marginTop: '2px' }}>
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
            background: '#FFFFFF',
            borderRadius: '24px',
            padding: '32px 24px',
            marginBottom: '20px',
            boxShadow: '0 2px 20px rgba(0,0,0,0.06)',
            border: '1px solid rgba(0,0,0,0.05)',
            textAlign: 'center'
          }}>
            {/* Skeleton Cards */}
            <div style={{ marginBottom: '24px' }}>
              <div className="skeleton" style={{ height: '80px', marginBottom: '12px' }}></div>
              <div className="skeleton" style={{ height: '60px', marginBottom: '12px' }}></div>
              <div className="skeleton" style={{ height: '40px', width: '60%', margin: '0 auto' }}></div>
            </div>

            {/* Rotating Status */}
            <p className="instagram-gradient-text" style={{
              fontSize: '1.1rem',
              fontWeight: '700',
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
              fontSize: '0.9rem',
              fontWeight: '700',
              color: '#262626',
              marginBottom: '16px',
              textAlign: 'center'
            }}>
              ✨ Your captions are ready!
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
                  className="card-hover"
                  style={{
                    background: '#FFFFFF',
                    borderRadius: '24px',
                    padding: '20px',
                    marginBottom: '16px',
                    boxShadow: '0 2px 20px rgba(0,0,0,0.06)',
                    border: '2px solid #fbbf24',
                    animation: 'fadeIn 0.5s ease'
                  }}
                >
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    marginBottom: '14px'
                  }}>
                    <span style={{ fontSize: '1.3rem' }}>⚡</span>
                    <span style={{
                      fontSize: '0.75rem',
                      fontWeight: '800',
                      color: '#f59e0b',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em'
                    }}>
                      {v.label || "Quick Fire"}
                    </span>
                  </div>

                  <p style={{
                    fontSize: '1rem',
                    lineHeight: '1.7',
                    color: '#262626',
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
                        ? '#22c55e'
                        : 'linear-gradient(45deg, #fbbf24, #f59e0b)',
                      border: 'none',
                      color: 'white',
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
                  className="card-hover"
                  style={{
                    background: '#FFFFFF',
                    borderRadius: '24px',
                    padding: '20px',
                    marginBottom: '16px',
                    boxShadow: '0 2px 20px rgba(0,0,0,0.06)',
                    border: '2px solid transparent',
                    borderImage: 'linear-gradient(45deg, #f09433, #e6683c, #dc2743, #bc1888) 1',
                    position: 'relative',
                    overflow: 'hidden',
                    animation: 'fadeIn 0.5s ease 0.1s both'
                  }}
                >
                  {/* Premium badge */}
                  <div className="instagram-gradient" style={{
                    position: 'absolute',
                    top: '12px',
                    right: '12px',
                    padding: '4px 12px',
                    borderRadius: '12px',
                    fontSize: '0.65rem',
                    fontWeight: '800',
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
                    marginBottom: '14px'
                  }}>
                    <span style={{ fontSize: '1.3rem' }}>✨</span>
                    <span className="instagram-gradient-text" style={{
                      fontSize: '0.75rem',
                      fontWeight: '800',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em'
                    }}>
                      {v.label || "Story Mode"}
                    </span>
                  </div>

                  <p style={{
                    fontSize: '1rem',
                    lineHeight: '1.8',
                    color: '#262626',
                    marginBottom: '16px',
                    whiteSpace: 'pre-line'
                  }}>
                    {processedCaption}
                  </p>

                  {/* Instagram CTA */}
                  <div style={{
                    background: '#FAFAFA',
                    padding: '12px',
                    borderRadius: '12px',
                    marginBottom: '16px',
                    textAlign: 'center'
                  }}>
                    <a
                      href="https://www.instagram.com/instaalgohacker?igsh=MW1maXl2a3IxNm40OA=="
                      target="_blank"
                      rel="noopener noreferrer"
                      className="instagram-gradient-text"
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '8px',
                        textDecoration: 'none',
                        fontSize: '0.85rem',
                        fontWeight: '700'
                      }}
                    >
                      <InstagramIcon />
                      Follow for More Premium Tips
                    </a>
                  </div>

                  <button
                    onClick={() => copyCaption(v.caption, `premium-${i}`)}
                    className="instagram-gradient"
                    style={{
                      width: '100%',
                      padding: '14px',
                      borderRadius: '16px',
                      background: copiedIndex === `premium-${i}` ? '#22c55e' : undefined,
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
                  className="card-hover"
                  style={{
                    background: '#FFFFFF',
                    borderRadius: '24px',
                    padding: '20px',
                    marginBottom: '16px',
                    boxShadow: '0 2px 20px rgba(0,0,0,0.06)',
                    border: '1px solid #efefef',
                    animation: 'fadeIn 0.5s ease 0.2s both'
                  }}
                >
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    marginBottom: '14px'
                  }}>
                    <span style={{ fontSize: '1.3rem' }}>📝</span>
                    <span style={{
                      fontSize: '0.75rem',
                      fontWeight: '800',
                      color: '#8e8e8e',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em'
                    }}>
                      {v.label || `Caption ${i + 1}`}
                    </span>
                  </div>

                  <p style={{
                    fontSize: '1rem',
                    lineHeight: '1.7',
                    color: '#262626',
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
                      background: copiedIndex === `standard-${i}` ? '#22c55e' : '#FAFAFA',
                      border: copiedIndex === `standard-${i}` ? 'none' : '2px solid #efefef',
                      color: copiedIndex === `standard-${i}` ? 'white' : '#262626',
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
          borderTop: '1px solid #efefef'
        }}>
          <a
            href="https://www.instagram.com/instaalgohacker?igsh=MW1maXl2a3IxNm40OA=="
            target="_blank"
            rel="noopener noreferrer"
            className="instagram-gradient"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '12px 24px',
              borderRadius: '24px',
              color: 'white',
              textDecoration: 'none',
              fontSize: '0.9rem',
              fontWeight: '700',
              marginBottom: '16px',
              boxShadow: '0 4px 15px rgba(225, 48, 108, 0.3)'
            }}
          >
            <InstagramIcon />
            Follow @instaalgohacker
          </a>

          <p style={{
            fontSize: '0.8rem',
            color: '#8e8e8e'
          }}>
            FunCaption © 2025 — Built for creators 🔥
          </p>
        </footer>
      </div>
    </>
  )
}
