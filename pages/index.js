import { useState, useEffect, useRef } from 'react'
import Head from 'next/head'

// Only 7 items: 6 moods + 1 "More" option
const moodOptions = [
  { id: 'funny', emoji: '😂', label: 'Funny' },
  { id: 'fire', emoji: '🔥', label: 'Fire' },
  { id: 'aesthetic', emoji: '✨', label: 'Aesthetic' },
  { id: 'deep', emoji: '🧠', label: 'Deep' },
  { id: 'poetic', emoji: '✍️', label: 'Poetic' },
  { id: 'motivation', emoji: '🚀', label: 'Motivation' },
  { id: 'more', emoji: '➕', label: 'More' }
]

// Extended moods when "More" is clicked
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

// Target goal chips - ALL OFF BY DEFAULT
const targetGoals = [
  { id: 'comments', label: 'Get Comments', emoji: '💬' },
  { id: 'shares', label: 'Get Shares', emoji: '🔄' },
  { id: 'saves', label: 'Save for Later', emoji: '🔖' }
]

// Loading messages - each shows ONCE
const loadingSteps = [
  "ANALYSING TRENDS",
  "CODING VIRALITY",
  "FINALISING YOUR MILLIONS"
]

// Example subjects that cycle
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
  const [showExtendedMoods, setShowExtendedMoods] = useState(false)
  const [wheelRotation, setWheelRotation] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const [startAngle, setStartAngle] = useState(0)
  const [currentExample, setCurrentExample] = useState(0)
  
  // Feature toggles - TARGET GOALS OFF BY DEFAULT
  const [scrollStopperHook, setScrollStopperHook] = useState(true)
  const [proTags, setProTags] = useState(true)
  const [selectedGoals, setSelectedGoals] = useState([]) // EMPTY BY DEFAULT
  
  // Loading & Results
  const [loading, setLoading] = useState(false)
  const [loadingStep, setLoadingStep] = useState(0)
  const [variants, setVariants] = useState([])
  const [copiedIndex, setCopiedIndex] = useState(null)

  // Refs
  const wheelRef = useRef(null)

  // Region hardcoded to "genz"
  const region = 'genz'

  // Loading steps - each shows once, 1.5s each
  useEffect(() => {
    let timeout
    if (loading && loadingStep < loadingSteps.length - 1) {
      timeout = setTimeout(() => {
        setLoadingStep(prev => prev + 1)
      }, 1500)
    }
    return () => clearTimeout(timeout)
  }, [loading, loadingStep])

  // Cycle through example subjects
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentExample(prev => (prev + 1) % exampleSubjects.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  // Get angle from mouse/touch event
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
    if (!isDragging) return
    setIsDragging(false)
    
    const moodCount = moodOptions.length
    const anglePerMood = 360 / moodCount
    const normalizedRotation = ((wheelRotation % 360) + 360) % 360
    const nearestIndex = Math.round(normalizedRotation / anglePerMood) % moodCount
    const snappedRotation = nearestIndex * anglePerMood
    setWheelRotation(snappedRotation)
    
    const topMoodIndex = (moodCount - nearestIndex) % moodCount
    const selectedMoodItem = moodOptions[topMoodIndex]
    
    if (selectedMoodItem.id === 'more') {
      setShowExtendedMoods(true)
    } else {
      setSelectedMood(selectedMoodItem.id)
      setShowExtendedMoods(false)
    }
  }

  const selectMoodDirectly = (moodId, index) => {
    if (moodId === 'more') {
      setShowExtendedMoods(!showExtendedMoods)
      return
    }
    
    setSelectedMood(moodId)
    setShowExtendedMoods(false)
    
    const moodCount = moodOptions.length
    const anglePerMood = 360 / moodCount
    const targetRotation = ((moodCount - index) % moodCount) * anglePerMood
    setWheelRotation(targetRotation)
  }

  const selectExtendedMood = (moodId) => {
    setSelectedMood(moodId)
    setShowExtendedMoods(false)
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
    setLoadingStep(0)
    setVariants([])

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
      setLoadingStep(0)
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

  const getCurrentMoodInfo = () => {
    const mainMood = moodOptions.find(m => m.id === selectedMood)
    if (mainMood) return mainMood
    return extendedMoods.find(m => m.id === selectedMood) || { emoji: '🔥', label: 'Fire' }
  }

  const shortCaptions = variants.filter(v => v.type === 'short')
  const premiumCaptions = variants.filter(v => v.premium)
  const standardCaptions = variants.filter(v => !v.premium && v.type !== 'short')

  const currentMoodInfo = getCurrentMoodInfo()

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
          overflow-x: hidden;
        }

        /* Instagram Gradient */
        .instagram-gradient {
          background: radial-gradient(circle at 30% 107%, #fdf497 0%, #fdf497 5%, #fd5949 45%, #d6249f 60%, #285AEB 90%);
        }

        .instagram-gradient-text {
          background: radial-gradient(circle at 30% 107%, #fdf497 0%, #fdf497 5%, #fd5949 45%, #d6249f 60%, #285AEB 90%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        /* Toggle Switch */
        .toggle-switch {
          position: relative;
          width: 52px;
          height: 28px;
          background: #DBDBDB;
          border-radius: 14px;
          cursor: pointer;
          transition: background 0.3s ease;
        }
        .toggle-switch.active {
          background: radial-gradient(circle at 30% 107%, #fdf497 0%, #fdf497 5%, #fd5949 45%, #d6249f 60%, #285AEB 90%);
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
          transition: left 0.3s ease;
          box-shadow: 0 2px 4px rgba(0,0,0,0.15);
        }
        .toggle-switch.active::after {
          left: 27px;
        }

        /* ========== LOADING OVERLAY - SIMPLE & EFFECTIVE ========== */
        .loading-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(250, 250, 250, 0.95);
          z-index: 9999;
          display: flex;
          align-items: center;
          justify-content: center;
          animation: fadeIn 0.3s ease;
        }

        /* Diamond Container */
        .diamond-container {
          position: relative;
          width: 160px;
          height: 160px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        /* Neon Diamond - Thin Border */
        .neon-diamond {
          position: absolute;
          width: 130px;
          height: 130px;
          transform: rotate(45deg);
          border: 2px solid;
          border-image: linear-gradient(135deg, #fdf497, #fd5949, #d6249f, #285AEB) 1;
          animation: diamondGlow 2s ease-in-out infinite;
        }

        @keyframes diamondGlow {
          0%, 100% { 
            box-shadow: 0 0 20px rgba(214, 36, 159, 0.4);
            opacity: 1;
          }
          50% { 
            box-shadow: 0 0 40px rgba(214, 36, 159, 0.6);
            opacity: 0.9;
          }
        }

        /* Text Inside Diamond */
        .diamond-text {
          position: relative;
          z-index: 2;
          text-align: center;
          padding: 20px;
        }

        .loading-step-text {
          font-size: 0.7rem;
          font-weight: 800;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: #262626;
          animation: textFadeIn 0.5s ease;
        }

        @keyframes textFadeIn {
          from { opacity: 0; transform: translateY(5px); }
          to { opacity: 1; transform: translateY(0); }
        }

        /* Dots animation */
        .loading-dots::after {
          content: '';
          animation: dots 1.5s infinite;
        }

        @keyframes dots {
          0%, 20% { content: ''; }
          40% { content: '.'; }
          60% { content: '..'; }
          80%, 100% { content: '...'; }
        }

        /* ========== OTHER ANIMATIONS ========== */
        
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(15px); }
          to { opacity: 1; transform: translateY(0); }
        }

        /* Glow text - simplified */
        .glow-text {
          text-shadow: 0 0 20px rgba(214, 36, 159, 0.3);
        }

        /* Example text fade */
        @keyframes exampleFade {
          0%, 20% { opacity: 0; }
          30%, 70% { opacity: 0.5; }
          80%, 100% { opacity: 0; }
        }

        .example-text {
          animation: exampleFade 3s ease-in-out infinite;
        }

        /* Wheel */
        .wheel-container {
          cursor: grab;
          touch-action: none;
        }
        .wheel-container:active {
          cursor: grabbing;
        }

        /* Card hover */
        .card-hover {
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        .card-hover:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 30px rgba(0,0,0,0.08);
        }

        /* Mood item */
        .mood-item {
          transition: transform 0.2s ease, box-shadow 0.2s ease;
          will-change: transform;
        }

        /* Magic button pulse - simplified */
        @keyframes simplePulse {
          0%, 100% { 
            box-shadow: 0 4px 20px rgba(214, 36, 159, 0.4);
          }
          50% { 
            box-shadow: 0 6px 30px rgba(214, 36, 159, 0.5);
          }
        }

        .magic-button {
          animation: simplePulse 2s ease-in-out infinite;
        }

        .magic-button:disabled {
          animation: none;
        }

        /* Step number */
        .step-number {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          font-size: 0.75rem;
          font-weight: 800;
          margin-right: 10px;
          color: white;
        }
      `}</style>

      {/* ========== LOADING OVERLAY ========== */}
      {loading && (
        <div className="loading-overlay">
          <div className="diamond-container">
            {/* Neon Diamond Border */}
            <div className="neon-diamond"></div>
            
            {/* Text Inside */}
            <div className="diamond-text">
              <p className="loading-step-text" key={loadingStep}>
                {loadingSteps[loadingStep]}
                <span className="loading-dots"></span>
              </p>
            </div>
          </div>
        </div>
      )}

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
          padding: '24px 0 20px'
        }}>
          <h1 className="instagram-gradient-text" style={{
            fontSize: '2.4rem',
            fontWeight: '900',
            marginBottom: '16px',
            letterSpacing: '-0.03em'
          }}>
            FunCaption
          </h1>

          <h2 className="instagram-gradient-text" style={{
            fontSize: '1.5rem',
            fontWeight: '900',
            marginBottom: '24px',
            letterSpacing: '0.02em',
            textTransform: 'uppercase',
            lineHeight: '1.3'
          }}>
            YOUR NEXT MILLION<br/>ARE HERE
          </h2>

          {/* Steps */}
          <div style={{
            background: '#FFFFFF',
            borderRadius: '20px',
            padding: '20px 24px',
            marginBottom: '16px',
            boxShadow: '0 2px 16px rgba(0,0,0,0.05)',
            border: '1px solid rgba(0,0,0,0.04)',
            textAlign: 'left'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}>
              <span className="instagram-gradient step-number">1</span>
              <span style={{ fontSize: '0.95rem', fontWeight: '600', color: '#262626' }}>
                Type your topic.
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}>
              <span className="instagram-gradient step-number">2</span>
              <span style={{ fontSize: '0.95rem', fontWeight: '600', color: '#262626' }}>
                Pick your vibe.
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center' }}>
              <span className="instagram-gradient step-number">3</span>
              <span style={{ fontSize: '0.95rem', fontWeight: '600', color: '#262626' }}>
                Copy the hook and go.
              </span>
            </div>
          </div>

          <p className="instagram-gradient-text glow-text" style={{
            fontSize: '1.15rem',
            fontWeight: '800',
            letterSpacing: '0.01em'
          }}>
            ✨ Your millions are waiting ✨
          </p>
        </header>

        {/* ========== INPUT CARD ========== */}
        <div className="card-hover" style={{
          background: '#FFFFFF',
          borderRadius: '24px',
          padding: '24px',
          marginBottom: '20px',
          boxShadow: '0 2px 16px rgba(0,0,0,0.05)',
          border: '1px solid rgba(0,0,0,0.04)'
        }}>
          <label style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            fontSize: '0.95rem',
            fontWeight: '700',
            color: '#262626',
            marginBottom: '16px'
          }}>
            <span style={{ fontSize: '1.3rem' }}>🎬</span>
            What's the reel about?
          </label>
          
          <div style={{ position: 'relative' }}>
            <textarea
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              style={{
                width: '100%',
                minHeight: '100px',
                background: '#FAFAFA',
                border: '2px solid #EFEFEF',
                borderRadius: '16px',
                padding: '16px',
                outline: 'none',
                color: '#262626',
                fontSize: '1rem',
                fontWeight: '500',
                lineHeight: '1.6',
                resize: 'none',
                fontFamily: 'inherit',
                transition: 'border-color 0.2s ease'
              }}
              onFocus={(e) => e.target.style.borderColor = '#C13584'}
              onBlur={(e) => e.target.style.borderColor = '#EFEFEF'}
            />
            
            {!subject && (
              <div 
                className="example-text"
                style={{
                  position: 'absolute',
                  top: '16px',
                  left: '16px',
                  right: '16px',
                  pointerEvents: 'none',
                  color: '#8E8E8E',
                  fontSize: '1rem',
                  fontWeight: '500'
                }}
              >
                {exampleSubjects[currentExample]}
              </div>
            )}
          </div>

          <div style={{ marginTop: '16px' }}>
            <label style={{
              display: 'block',
              fontSize: '0.8rem',
              fontWeight: '600',
              color: '#8E8E8E',
              marginBottom: '8px'
            }}>
              Add more details (optional)
            </label>
            <input
              type="text"
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              placeholder="Emotions, location, camera angle..."
              style={{
                width: '100%',
                background: '#FAFAFA',
                border: '2px solid #EFEFEF',
                borderRadius: '14px',
                outline: 'none',
                color: '#262626',
                fontSize: '0.95rem',
                padding: '14px 16px',
                fontFamily: 'inherit',
                transition: 'border-color 0.2s ease'
              }}
              onFocus={(e) => e.target.style.borderColor = '#C13584'}
              onBlur={(e) => e.target.style.borderColor = '#EFEFEF'}
            />
          </div>
        </div>

        {/* ========== MOOD WHEEL ========== */}
        <div className="card-hover" style={{
          background: '#FFFFFF',
          borderRadius: '24px',
          padding: '24px',
          marginBottom: '20px',
          boxShadow: '0 2px 16px rgba(0,0,0,0.05)',
          border: '1px solid rgba(0,0,0,0.04)',
          textAlign: 'center'
        }}>
          <label style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px',
            fontSize: '0.95rem',
            fontWeight: '700',
            color: '#262626',
            marginBottom: '24px'
          }}>
            <span style={{ fontSize: '1.3rem' }}>🎨</span>
            Spin & Pick the Vibe
          </label>

          {/* Fixed Wheel Container */}
          <div 
            ref={wheelRef}
            className="wheel-container"
            style={{
              position: 'relative',
              width: '280px',
              height: '280px',
              margin: '0 auto 20px',
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
            {/* Outer ring */}
            <div className="instagram-gradient" style={{
              position: 'absolute',
              top: '-4px',
              left: '-4px',
              right: '-4px',
              bottom: '-4px',
              borderRadius: '50%',
              opacity: 0.2
            }}></div>

            {/* Selector indicator */}
            <div className="instagram-gradient" style={{
              position: 'absolute',
              top: '-12px',
              left: '50%',
              transform: 'translateX(-50%)',
              width: '26px',
              height: '26px',
              borderRadius: '50%',
              boxShadow: '0 3px 10px rgba(193, 53, 132, 0.4)',
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

            {/* White background */}
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              borderRadius: '50%',
              background: '#FFFFFF',
              border: '2px solid #EFEFEF'
            }}></div>

            {/* Rotating moods */}
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              transform: `rotate(${wheelRotation}deg)`,
              transition: isDragging ? 'none' : 'transform 0.4s ease-out'
            }}>
              {moodOptions.map((mood, index) => {
                const angle = (index * (360 / 7)) - 90
                const radian = (angle * Math.PI) / 180
                const radius = 100
                const x = Math.cos(radian) * radius
                const y = Math.sin(radian) * radius
                const isSelected = selectedMood === mood.id || (mood.id === 'more' && showExtendedMoods)

                return (
                  <button
                    key={mood.id}
                    className="mood-item"
                    onClick={(e) => {
                      e.stopPropagation()
                      selectMoodDirectly(mood.id, index)
                    }}
                    style={{
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px)) rotate(${-wheelRotation}deg) scale(${isSelected ? 1.15 : 1})`,
                      width: '48px',
                      height: '48px',
                      borderRadius: '50%',
                      background: isSelected 
                        ? 'radial-gradient(circle at 30% 107%, #fdf497 0%, #fdf497 5%, #fd5949 45%, #d6249f 60%, #285AEB 90%)'
                        : '#FFFFFF',
                      border: isSelected ? 'none' : '2px solid #EFEFEF',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1.3rem',
                      boxShadow: isSelected 
                        ? '0 4px 15px rgba(193, 53, 132, 0.35)' 
                        : '0 2px 8px rgba(0,0,0,0.06)',
                      zIndex: isSelected ? 5 : 1
                    }}
                  >
                    {mood.emoji}
                  </button>
                )
              })}
            </div>

            {/* Center Magic Button - ALWAYS CENTERED */}
            <button
              onClick={handleGenerate}
              disabled={loading || !subject.trim()}
              className={`instagram-gradient ${!loading && subject.trim() ? 'magic-button' : ''}`}
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '95px',
                height: '95px',
                borderRadius: '50%',
                border: 'none',
                cursor: loading || !subject.trim() ? 'not-allowed' : 'pointer',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '2px',
                opacity: !subject.trim() ? 0.5 : 1,
                zIndex: 10,
                transition: 'opacity 0.2s ease'
              }}
            >
              <span style={{ fontSize: '1.4rem' }}>✨</span>
              <span style={{
                color: 'white',
                fontSize: '0.6rem',
                fontWeight: '800',
                textAlign: 'center',
                lineHeight: '1.2',
                textTransform: 'uppercase',
                letterSpacing: '0.02em'
              }}>
                Work your<br/>magic!
              </span>
            </button>
          </div>

          {/* Selected mood */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '10px',
            padding: '12px 24px',
            background: '#FAFAFA',
            borderRadius: '24px',
            border: '1px solid #EFEFEF'
          }}>
            <span style={{ fontSize: '1.3rem' }}>{currentMoodInfo.emoji}</span>
            <span style={{ fontSize: '0.95rem', fontWeight: '700', color: '#262626' }}>
              {currentMoodInfo.label}
            </span>
          </div>

          <p style={{ fontSize: '0.75rem', color: '#C7C7C7', marginTop: '12px' }}>
            👆 Drag to spin • Tap to select
          </p>
        </div>

        {/* ========== EXTENDED MOODS ========== */}
        {showExtendedMoods && (
          <div className="card-hover" style={{
            background: '#FFFFFF',
            borderRadius: '24px',
            padding: '20px',
            marginBottom: '20px',
            boxShadow: '0 2px 16px rgba(0,0,0,0.05)',
            border: '1px solid rgba(0,0,0,0.04)',
            animation: 'fadeInUp 0.3s ease'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '16px'
            }}>
              <p style={{ fontSize: '0.9rem', fontWeight: '700', color: '#262626' }}>
                🎭 More Moods
              </p>
              <button
                onClick={() => setShowExtendedMoods(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '1.2rem',
                  cursor: 'pointer',
                  color: '#8E8E8E',
                  padding: '4px'
                }}
              >
                ✕
              </button>
            </div>
            
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
                  className={selectedMood === mood.id ? 'instagram-gradient' : ''}
                  style={{
                    padding: '10px 16px',
                    borderRadius: '20px',
                    background: selectedMood === mood.id ? undefined : '#FAFAFA',
                    border: selectedMood === mood.id ? 'none' : '2px solid #EFEFEF',
                    color: selectedMood === mood.id ? 'white' : '#262626',
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
            </div>
          </div>
        )}

        {/* ========== ENHANCING FEATURES - WITH TARGET GOALS OFF BY DEFAULT ========== */}
        <div className="card-hover" style={{
          background: '#FFFFFF',
          borderRadius: '24px',
          padding: '20px',
          marginBottom: '20px',
          boxShadow: '0 2px 16px rgba(0,0,0,0.05)',
          border: '1px solid rgba(0,0,0,0.04)'
        }}>
          <p style={{
            fontSize: '0.8rem',
            fontWeight: '700',
            color: '#8E8E8E',
            marginBottom: '16px',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            textAlign: 'center'
          }}>
            🚀 Enhance Your Virality
          </p>

          {/* Scroll-Stopper Hook */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '14px',
            padding: '14px 16px',
            background: '#FAFAFA',
            borderRadius: '16px',
            border: '1px solid #EFEFEF'
          }}>
            <div>
              <p style={{ fontSize: '0.9rem', fontWeight: '600', color: '#262626' }}>
                🎣 Scroll-Stopper Hook
              </p>
              <p style={{ fontSize: '0.75rem', color: '#8E8E8E', marginTop: '2px' }}>
                Viral opening line
              </p>
            </div>
            <div 
              className={`toggle-switch ${scrollStopperHook ? 'active' : ''}`}
              onClick={() => setScrollStopperHook(!scrollStopperHook)}
            ></div>
          </div>

          {/* Target Goals - ALL OFF BY DEFAULT */}
          <div style={{ marginBottom: '14px' }}>
            <p style={{ 
              fontSize: '0.8rem', 
              color: '#8E8E8E', 
              marginBottom: '10px',
              fontWeight: '600',
              textAlign: 'center'
            }}>
              🎯 Target Actions
            </p>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'center' }}>
              {targetGoals.map(goal => (
                <button
                  key={goal.id}
                  onClick={() => toggleGoal(goal.id)}
                  className={selectedGoals.includes(goal.id) ? 'instagram-gradient' : ''}
                  style={{
                    padding: '10px 14px',
                    borderRadius: '18px',
                    background: selectedGoals.includes(goal.id) ? undefined : '#FAFAFA',
                    border: selectedGoals.includes(goal.id) ? 'none' : '2px solid #EFEFEF',
                    color: selectedGoals.includes(goal.id) ? 'white' : '#262626',
                    fontSize: '0.8rem',
                    fontWeight: '600',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <span>{goal.emoji}</span>
                  <span>{goal.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Pro Tags */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '14px 16px',
            background: '#FAFAFA',
            borderRadius: '16px',
            border: '1px solid #EFEFEF'
          }}>
            <div>
              <p style={{ fontSize: '0.9rem', fontWeight: '600', color: '#262626' }}>
                #️⃣ Pro Tags
              </p>
              <p style={{ fontSize: '0.75rem', color: '#8E8E8E', marginTop: '2px' }}>
                Trending hashtags
              </p>
            </div>
            <div 
              className={`toggle-switch ${proTags ? 'active' : ''}`}
              onClick={() => setProTags(!proTags)}
            ></div>
          </div>
        </div>

        {/* ========== RESULTS - AESTHETIC UPGRADE ========== */}
        {variants.length > 0 && !loading && (
          <div style={{ marginBottom: '24px' }}>
            <p style={{
              fontSize: '0.95rem',
              fontWeight: '700',
              color: '#262626',
              marginBottom: '16px',
              textAlign: 'center'
            }}>
              🌟 Your Exclusive Content Awaits
            </p>

            {/* Short Captions - PREMIUM LOOK */}
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
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    borderRadius: '24px',
                    padding: '20px',
                    marginBottom: '16px',
                    boxShadow: '0 8px 32px rgba(102, 126, 234, 0.3)',
                    border: 'none',
                    position: 'relative',
                    overflow: 'hidden'
                  }}
                >
                  <div style={{
                    position: 'absolute',
                    top: '12px',
                    right: '12px',
                    background: 'rgba(255, 255, 255, 0.2)',
                    backdropFilter: 'blur(10px)',
                    padding: '4px 12px',
                    borderRadius: '20px'
                  }}>
                    <span style={{
                      fontSize: '0.7rem',
                      fontWeight: '800',
                      color: 'white',
                      textTransform: 'uppercase'
                    }}>
                      ⚡ Quick Impact
                    </span>
                  </div>

                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    marginBottom: '14px'
                  }}>
                    <span style={{ fontSize: '1.2rem' }}>✨</span>
                    <span style={{
                      fontSize: '0.8rem',
                      fontWeight: '700',
                      color: 'rgba(255, 255, 255, 0.9)',
                      textTransform: 'uppercase'
                    }}>
                      {v.label || "Power Hook"}
                    </span>
                  </div>

                  <p style={{
                    fontSize: '1.1rem',
                    lineHeight: '1.6',
                    color: 'white',
                    marginBottom: '16px',
                    whiteSpace: 'pre-line',
                    fontWeight: '600',
                    textShadow: '0 2px 4px rgba(0,0,0,0.2)'
                  }}>
                    {processedCaption}
                  </p>

                  <button
                    onClick={() => copyCaption(v.caption, `short-${i}`)}
                    style={{
                      width: '100%',
                      padding: '14px',
                      borderRadius: '14px',
                      background: 'rgba(255, 255, 255, 0.2)',
                      border: '1px solid rgba(255, 255, 255, 0.3)',
                      color: 'white',
                      fontSize: '0.9rem',
                      fontWeight: '700',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      backdropFilter: 'blur(5px)'
                    }}
                  >
                    {copiedIndex === `short-${i}` ? '✓ Copied to Your Clipboard!' : '📋 Copy Your Power Hook'}
                  </button>
                </div>
              )
            })}

            {/* Premium Captions - ROYAL LOOK */}
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
                    background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                    borderRadius: '24px',
                    padding: '20px',
                    marginBottom: '16px',
                    boxShadow: '0 8px 32px rgba(240, 147, 251, 0.3)',
                    border: 'none',
                    position: 'relative',
                    overflow: 'hidden'
                  }}
                >
                  <div style={{
                    position: 'absolute',
                    top: '12px',
                    right: '12px',
                    background: 'rgba(255, 255, 255, 0.2)',
                    backdropFilter: 'blur(10px)',
                    padding: '4px 12px',
                    borderRadius: '20px'
                  }}>
                    <span style={{
                      fontSize: '0.7rem',
                      fontWeight: '800',
                      color: 'white',
                      textTransform: 'uppercase'
                    }}>
                      📝 Story Builder
                    </span>
                  </div>

                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    marginBottom: '14px'
                  }}>
                    <span style={{ fontSize: '1.2rem' }}>👑</span>
                    <span style={{
                      fontSize: '0.8rem',
                      fontWeight: '700',
                      color: 'rgba(255, 255, 255, 0.9)',
                      textTransform: 'uppercase'
                    }}>
                      {v.label || "Complete Thread"}
                    </span>
                  </div>

                  <p style={{
                    fontSize: '1rem',
                    lineHeight: '1.7',
                    color: 'white',
                    marginBottom: '16px',
                    whiteSpace: 'pre-line',
                    fontWeight: '500',
                    textShadow: '0 2px 4px rgba(0,0,0,0.2)'
                  }}>
                    {processedCaption}
                  </p>

                  <button
                    onClick={() => copyCaption(v.caption, `premium-${i}`)}
                    style={{
                      width: '100%',
                      padding: '14px',
                      borderRadius: '14px',
                      background: 'rgba(255, 255, 255, 0.2)',
                      border: '1px solid rgba(255, 255, 255, 0.3)',
                      color: 'white',
                      fontSize: '0.9rem',
                      fontWeight: '700',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      backdropFilter: 'blur(5px)'
                    }}
                  >
                    {copiedIndex === `premium-${i}` ? '✓ Copied to Your Clipboard!' : '📋 Copy Your Complete Thread'}
                  </button>
                </div>
              )
            })}

            {/* Standard Captions - ELEGANT LOOK */}
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
                    background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
                    borderRadius: '24px',
                    padding: '20px',
                    marginBottom: '16px',
                    boxShadow: '0 8px 32px rgba(67, 233, 123, 0.3)',
                    border: 'none',
                    position: 'relative',
                    overflow: 'hidden'
                  }}
                >
                  <div style={{
                    position: 'absolute',
                    top: '12px',
                    right: '12px',
                    background: 'rgba(255, 255, 255, 0.2)',
                    backdropFilter: 'blur(10px)',
                    padding: '4px 12px',
                    borderRadius: '20px'
                  }}>
                    <span style={{
                      fontSize: '0.7rem',
                      fontWeight: '800',
                      color: 'white',
                      textTransform: 'uppercase'
                    }}>
                      💎 Creator Gold
                    </span>
                  </div>

                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    marginBottom: '14px'
                  }}>
                    <span style={{ fontSize: '1.2rem' }}>🎯</span>
                    <span style={{
                      fontSize: '0.8rem',
                      fontWeight: '700',
                      color: 'rgba(255, 255, 255, 0.9)',
                      textTransform: 'uppercase'
                    }}>
                      {v.label || "Premium Content"}
                    </span>
                  </div>

                  <p style={{
                    fontSize: '1rem',
                    lineHeight: '1.7',
                    color: 'white',
                    marginBottom: '16px',
                    whiteSpace: 'pre-line',
                    fontWeight: '500',
                    textShadow: '0 2px 4px rgba(0,0,0,0.2)'
                  }}>
                    {processedCaption}
                  </p>

                  <button
                    onClick={() => copyCaption(v.caption, `standard-${i}`)}
                    style={{
                      width: '100%',
                      padding: '14px',
                      borderRadius: '14px',
                      background: 'rgba(255, 255, 255, 0.2)',
                      border: '1px solid rgba(255, 255, 255, 0.3)',
                      color: 'white',
                      fontSize: '0.9rem',
                      fontWeight: '700',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      backdropFilter: 'blur(5px)'
                    }}
                  >
                    {copiedIndex === `standard-${i}` ? '✓ Copied to Your Clipboard!' : '📋 Copy Your Premium Content'}
                  </button>
                </div>
              )
            })}

            {/* VIP MESSAGE */}
            <div style={{
              background: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)',
              borderRadius: '20px',
              padding: '16px',
              textAlign: 'center',
              marginBottom: '20px',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              boxShadow: '0 4px 20px rgba(255, 154, 158, 0.3)'
            }}>
              <p style={{
                fontSize: '0.9rem',
                fontWeight: '700',
                color: '#262626',
                marginBottom: '8px'
              }}>
                🎁 VIP Creator Tip
              </p>
              <p style={{
                fontSize: '0.8rem',
                color: '#262626',
                lineHeight: '1.5'
              }}>
                You just unlocked premium content that takes others hours to craft. 
                Your audience won't know what hit them! 💫
              </p>
            </div>
          </div>
        )}

        {/* ========== FOOTER ========== */}
        <footer style={{
          textAlign: 'center',
          padding: '24px 0',
          borderTop: '1px solid #EFEFEF'
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
              fontSize: '0.85rem',
              fontWeight: '700',
              marginBottom: '14px',
              boxShadow: '0 4px 15px rgba(193, 53, 132, 0.3)'
            }}
          >
            <InstagramIcon />
            Follow @instaalgohacker
          </a>

          <p style={{ fontSize: '0.8rem', color: '#8E8E8E' }}>
            FunCaption © 2025 — Built for Creators Like You 🔥
          </p>
        </footer>
      </div>
    </>
  )
  }
