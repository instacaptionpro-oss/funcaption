import { useState } from 'react'
import Head from 'next/head'

// Embedded NeonBackground component
const NeonBackground = () => {
  return (
    <div className="neon-grid-bg">
      <div className="neon-orbit orbit-1"></div>
      <div className="neon-orbit orbit-2"></div>
      <div className="neon-orbit orbit-3"></div>
    </div>
  );
};

const InstagramIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
    <path d="M8 0C5.829 0 5.556.01 4.703.048 3.85.088 3.269.222 2.76.42a3.917 3.917 0 0 0-1.417.923A3.927 3.927 0 0 0 .42 2.76C.222 3.268.087 3.85.048 4.7.01 5.555 0 5.827 0 8.001c0 2.172.01 2.444.048 3.297.04.852.174 1.433.372 1.942.205.526.478.972.923 1.417.444.445.89.719 1.416.923.51.198 1.09.333 1.942.372C5.555 15.99 5.827 16 8 16s2.444-.01 3.298-.048c.851-.04 1.434-.174 1.943-.372a3.916 3.916 0 0 0 1.416-.923c.445-.445.718-.891.923-1.417.197-.509.332-1.09.372-1.942C15.99 10.445 16 10.173 16 8s-.01-2.445-.048-3.299c-.04-.851-.175-1.433-.372-1.941a3.926 3.926 0 0 0-.923-1.417A3.911 3.911 0 0 0 13.24.42c-.51-.198-1.092-.333-1.943-.372C10.443.01 10.172 0 7.998 0h.003zm-.717 1.442h.718c2.136 0 2.389.007 3.232.046.78.035 1.204.166 1.486.275.373.145.64.319.92.599.28.28.453.546.598.92.11.281.24.705.275 1.485.039.843.047 1.096.047 3.231s-.008 2.389-.047 3.232c-.035.78-.166 1.203-.275 1.485a2.47 2.47 0 0 1-.599.919c-.28.28-.546.453-.92.598-.28.11-.704.24-1.485.276-.843.038-1.096.047-3.232.047s-2.39-.009-3.233-.047c-.78-.036-1.203-.166-1.485-.276a2.478 2.478 0 0 1-.92-.598 2.48 2.48 0 0 1-.6-.92c-.109-.281-.24-.705-.275-1.485-.038-.843-.046-1.096-.046-3.233 0-2.136.008-2.388.046-3.231.036-.78.166-1.204.276-1.486.145-.373.319-.64.599-.92.28-.28.546-.453.92-.598.282-.11.705-.24 1.485-.276.738-.034 1.024-.044 2.515-.045v.002zm4.988 1.328a.96.96 0 1 0 0 1.92.96.96 0 0 0 0-1.92zm-4.27 1.122a4.109 4.109 0 1 0 0 8.217 4.109 4.109 0 0 0 0-8.217zm0 1.441a2.667 2.667 0 1 1 0 5.334 2.667 2.667 0 0 1 0-5.334z"/>
  </svg>
)

const Logo = () => (
  <div style={{ position: 'absolute', top: '20px', left: '20px', zIndex: 10 }}>
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 1200" width="60" height="60" role="img" aria-label="FunCaption neon logo">
      <defs>
        <linearGradient id="gNeon1-fc" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0" stopColor="#22d3ee"/>
          <stop offset="0.5" stopColor="#a855f7"/>
          <stop offset="1" stopColor="#f97316"/>
        </linearGradient>
        <linearGradient id="gNeon2-fc" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0" stopColor="#0ea5e9"/>
          <stop offset="1" stopColor="#7c3aed"/>
        </linearGradient>
        <linearGradient id="metal-fc" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#e5e7eb" stopOpacity="0.35"/>
          <stop offset="1" stopColor="#020617" stopOpacity="0.2"/>
        </linearGradient>
        <filter id="softGlow-fc" x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur stdDeviation="18" result="b1"/>
          <feMerge>
            <feMergeNode in="b1"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
        <filter id="neonGlow-fc" x="-200%" y="-200%" width="400%" height="400%">
          <feGaussianBlur stdDeviation="22" result="g1"/>
          <feColorMatrix in="g1" type="matrix" values="1 0 0 0 0   0 1 0 0 0   0 0 1 0 0  0 0 0 0.9 0" />
          <feMerge>
            <feMergeNode in="g1"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
        <linearGradient id="fadeMask-fc" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#fff" stopOpacity="0.45"/>
          <stop offset="1" stopColor="#fff" stopOpacity="0"/>
        </linearGradient>
        <filter id="grain-fc">
          <feTurbulence baseFrequency="0.9" numOctaves="1" stitchTiles="stitch" result="noise"/>
          <feColorMatrix type="saturate" values="0" in="noise" result="gn"/>
          <feBlend in="SourceGraphic" in2="gn" mode="overlay"/>
        </filter>
      </defs>
      <rect width="1200" height="1200" fill="#020617"/>
      <radialGradient id="v-fc" cx="50%" cy="20%" r="65%">
        <stop offset="0" stopColor="#0f172a" stopOpacity="0.9"/>
        <stop offset="1" stopColor="#020617" stopOpacity="1"/>
      </radialGradient>
      <rect width="1200" height="1200" fill="url(#v-fc)" />
      <g transform="translate(600,420) scale(1)">
        <ellipse rx="460" ry="160" fill="url(#gNeon2-fc)" opacity="0.08" filter="url(#softGlow-fc)" transform="translate(0,140)"/>
        <g id="logo-shapes-fc" transform="translate(-220,-70)">
          <g>
            <path d="M24 18 L160 18 L160 44 L84 44 L84 74 L160 74 L160 100 L24 100 z" fill="#020617" stroke="rgba(15,23,42,0.8)" strokeWidth="4" />
            <path d="M28 22 L156 22 L156 42 L88 42 L88 70 L156 70 L156 96 L28 96 z" fill="url(#metal-fc)" opacity="0.32"/>
            <path d="M30 26 L152 26 L152 38 L92 38 L92 68 L152 68 L152 92 L30 92 z" stroke="url(#gNeon1-fc)" strokeWidth="6" fill="none" filter="url(#neonGlow-fc)"/>
            <path d="M34 30 L148 30 L148 36 L96 36 L96 64 L148 64 L148 88 L34 88 z" stroke="#ffffff22" strokeWidth="1" fill="none" opacity="0.4"/>
          </g>
          <g transform="translate(220, -6)">
            <path d="M10 2 L60 2 L160 120 L160 2 L200 2 L200 140 L150 140 L48 20 L48 140 L10 140 z" fill="#020617" stroke="rgba(15,23,42,0.8)" strokeWidth="4"/>
            <path d="M14 6 L56 6 L156 116 L156 6 L196 6 L196 136 L148 136 L52 20 L52 136 L14 136 z" fill="url(#metal-fc)" opacity="0.25"/>
            <path d="M20 12 L54 12 L150 112 L150 12 L190 12 L190 132 L144 132 L56 24 L56 132 L20 132 z" stroke="url(#gNeon1-fc)" strokeWidth="8" fill="none" filter="url(#neonGlow-fc)"/>
            <path d="M24 18 L50 18 L146 108 L146 18 L186 18 L186 128 L140 128 L60 34 L60 128 L24 128 z" stroke="#ffffff22" strokeWidth="1" fill="none" opacity="0.4"/>
          </g>
        </g>
        <g transform="translate(-220,-70)" opacity="0.95">
          <path d="M34 32 L146 32" stroke="#22d3ee" strokeWidth="6" strokeLinecap="round" opacity="0.95" filter="url(#softGlow-fc)"/>
          <path d="M86 46 L150 46" stroke="#a855f7" strokeWidth="6" strokeLinecap="round" opacity="0.9" filter="url(#softGlow-fc)"/>
          <path d="M40 82 L148 82" stroke="#f97316" strokeWidth="5" strokeLinecap="round" opacity="0.7" />
        </g>
        <g transform="translate(-220,-70)" opacity="0.65">
          <path d="M44 20 L58 20" stroke="#ffffffaa" strokeWidth="2" strokeLinecap="round" opacity="0.6"/>
          <path d="M102 26 L116 26" stroke="#ffffff66" strokeWidth="2" strokeLinecap="round" opacity="0.5"/>
          <path d="M268 34 L282 34" stroke="#ffffff88" strokeWidth="2" strokeLinecap="round"/>
        </g>
        <g transform="translate(-220,-70)">
          <path d="M18 8 L164 8 L164 108 L18 108 z M290 0 L420 0 L420 140 L290 140 z" fill="none" stroke="url(#gNeon2-fc)" strokeWidth="4" opacity="0.08" filter="url(#softGlow-fc)"/>
        </g>
        <g transform="translate(-180,220)">
          <text x="0" y="0" fontFamily="Poppins, Inter, Arial, sans-serif" fontWeight="800" fontSize="82" fill="url(#gNeon1-fc)" textRendering="geometricPrecision" style={{ letterSpacing: '-2px', filter: 'url(#neonGlow-fc)' }}>
            funcaption
          </text>
          <text x="6" y="46" fontFamily="Inter, Arial, sans-serif" fontWeight="600" fontSize="18" fill="#9ca3af" opacity="0.9" letterSpacing="1">
            Engineered attention for Indian creators
          </text>
        </g>
        <g transform="translate(-240,360) scale(1, -1)" opacity="0.28" style={{ mixBlendMode: 'screen' }}>
          <use href="#logo-shapes-fc" filter="url(#softGlow-fc)" transform="scale(0.98,0.72) translate(8,60)" />
          <rect x="-260" y="-20" width="760" height="220" fill="url(#fadeMask-fc)" opacity="0.65" />
        </g>
      </g>
      <ellipse cx="600" cy="970" rx="420" ry="36" fill="url(#gNeon2-fc)" opacity="0.04" />
      <rect width="1200" height="1200" opacity="0.05" fill="#000" filter="url(#grain-fc)" />
    </svg>
  </div>
)

const regions = [
  { id: "none", label: "No Region" },
  { id: "genz", label: "GenZ" },
  { id: "professional", label: "Professional" },
  { id: "gujarati", label: "Gujarati" },
  { id: "marathi", label: "Marathi" },
  { id: "punjabi", label: "Punjabi" },
  { id: "hindi", label: "Hindi / Desi" },
  { id: "rajasthani", label: "Rajasthani" },
  { id: "bengali", label: "Bengali" },
  { id: "tamil", label: "Tamil" },
  { id: "telugu", label: "Telugu" },
  { id: "kannada", label: "Kannada" },
  { id: "malayalam", label: "Malayalam" },
  { id: "bhojpuri", label: "Bhojpuri" },
  { id: "odia", label: "Odia" },
  { id: "assamese", label: "Assamese" },
  { id: "kashmiri", label: "Kashmiri" },
  { id: "nepali", label: "Nepali" }
]

const moods = [
  { id: "attitude", label: "Attitude", punch: "Iron heals what people break." },
  { id: "motivation", label: "Motivation", punch: "The grind is lonely but legends are born here." },
  { id: "love", label: "Love", punch: "Some feelings rewrite the heart, silently." },
  { id: "breakup", label: "Breakup", punch: "I lost them, but I found myself — and that's the win." },
  { id: "gym", label: "Gym", punch: "Iron heals what people break." },
  { id: "travel", label: "Travel", punch: "Some roads fix parts of you you never speak about." },
  { id: "cute", label: "Cute", punch: "Soft heart, sharp mind — rare combination." },
  { id: "savage", label: "Savage", punch: "If I cared, you'd know. I don't." },
  { id: "aesthetic", label: "Aesthetic", punch: "Some things look better when you stop chasing." },
  { id: "sad", label: "Sad", punch: "I smile… but rarely at the same things now." },
  { id: "happy", label: "Happy", punch: "Little moments make big lives." },
  { id: "alone", label: "Alone", punch: "Silence teaches louder than people." },
  { id: "boss", label: "Boss", punch: "Money talks, but discipline screams." },
  { id: "genz", label: "GenZ", punch: "Chaotic but still iconic." },
  { id: "calm", label: "Calm", punch: "Peace looks good on me." }
]

export default function Home() {
  const [subject, setSubject] = useState('')
  const [details, setDetails] = useState('')
  const [feedback, setFeedback] = useState('')
  const [mood, setMood] = useState('attitude')
  const [region, setRegion] = useState('none')
  const [loading, setLoading] = useState(false)
  const [variants, setVariants] = useState([])
  const [copiedIndex, setCopiedIndex] = useState(null)

  const handleGenerate = async (e) => {
    e.preventDefault()
    setLoading(true)
    setVariants([])

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subject,
          mood,
          region,
          details,
          feedback
        })
      })

      const data = await response.json()
      if (response.ok) {
        setVariants(data.variants || [])
      } else {
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
        .catch((e) => {
          console.error('Copy failed', e)
        })
    }
  }

  return (
    <>
      <Head>
        <title>FunCaption - Free Caption Generator</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content="Generate viral Instagram captions with regional Indian flavors" />
        <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />
      </Head>

      {/* Remove all the inline styles and replace with the neon background component */}
      <div style={{ 
        minHeight: '100vh', 
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Add the neon background */}
        <NeonBackground />

        {/* Content Container */}
        <div style={{ position: 'relative', zIndex: 2 }}>
          <Logo />
          
          {/* SECTION 1: HERO / STORY - Updated with glass card */}
          <section style={{
            padding: '4rem 1.5rem 3rem',
            position: 'relative'
          }}>
            <div style={{ 
              maxWidth: '900px', 
              margin: '0 auto', 
              paddingTop: '60px', 
              position: 'relative', 
              zIndex: 1 
            }}>
              {/* Brand + Tagline in glass card */}
              <div className="glass-card" style={{ marginBottom: '3rem', textAlign: 'center' }}>
                <div style={{
                  fontSize: '3.2rem',
                  fontWeight: '900',
                  marginBottom: '0.4rem',
                  background: 'linear-gradient(135deg, #22d3ee, #a855f7, #ec4899)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  textShadow: '0 0 40px rgba(34, 211, 238, 0.6)',
                  fontFamily: 'Orbitron, monospace, sans-serif',
                  letterSpacing: '0.05em'
                }}>
                  FunCaption
                </div>
                <div style={{
                  fontSize: '1.05rem',
                  color: '#38bdf8',
                  fontWeight: '600',
                  letterSpacing: '0.2em',
                  textTransform: 'uppercase',
                  textShadow: '0 0 10px rgba(34, 211, 238, 0.5)'
                }}>
                  Engineered attention for Indian creators
                </div>
                
                {/* Instagram Link with Icon */}
                <div style={{ marginTop: '1.5rem' }}>
                  <a 
                    href="https://www.instagram.com/instaalgohacker?igsh=MW1maXl2a3IxNm40OA==" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="neon-button-enhanced"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.6rem',
                      textDecoration: 'none',
                      fontSize: '0.95rem',
                      padding: '0.7rem 1.4rem',
                      borderRadius: '999px'
                    }}
                  >
                    <InstagramIcon />
                    Follow us on Instagram
                  </a>
                </div>
              </div>

              {/* Aggressive questions */}
              <div style={{ marginBottom: '3rem', lineHeight: '2.2' }}>
                <p style={{ 
                  fontSize: '1.3rem', 
                  color: '#94a3b8', 
                  marginBottom: '0.8rem',
                  textShadow: '0 0 10px rgba(148, 163, 184, 0.3)'
                }}>
                  Do you really think you work hard for your content?
                </p>
                <p style={{ 
                  fontSize: '1.3rem', 
                  color: '#94a3b8', 
                  marginBottom: '0.8rem',
                  textShadow: '0 0 10px rgba(148, 163, 184, 0.3)'
                }}>
                  Do you really think people see your content when you post it?
                </p>
                <p style={{ 
                  fontSize: '1.3rem', 
                  color: '#94a3b8', 
                  marginBottom: '1.8rem',
                  textShadow: '0 0 10px rgba(148, 163, 184, 0.3)'
                }}>
                  Do you think you are even capable for this game?
                </p>
              </div>

              {/* Answer in premium card */}
              <div className="premium-card">
                <p style={{ 
                  fontSize: '1.6rem', 
                  fontWeight: '700', 
                  color: '#e0f2fe',
                  marginBottom: '1.6rem',
                  lineHeight: '1.7',
                  textShadow: '0 0 15px rgba(34, 211, 238, 0.4)'
                }}>
                  Yes — we think you are. That is why you and us are here.
                  <br />
                  Because the world makes us feel the same way.
                </p>
                
                <p style={{ 
                  fontSize: '1.1rem', 
                  color: '#bae6fd', 
                  marginBottom: '1.2rem',
                  textShadow: '0 0 10px rgba(186, 230, 253, 0.3)'
                }}>
                  By using this, people will NOT magically start to see you.
                </p>
                
                <p style={{ 
                  fontSize: '2rem', 
                  fontWeight: '900', 
                  background: 'linear-gradient(135deg, #22c55e, #22d3ee, #a855f7)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  marginBottom: '1rem',
                  textShadow: '0 0 30px rgba(34, 211, 238, 0.6)',
                  fontFamily: 'Orbitron, monospace, sans-serif'
                }}>
                  But Instagram algorithm WILL start working for you.
                </p>
                
                <p style={{ 
                  fontSize: '1rem', 
                  color: '#fde047', 
                  fontStyle: 'italic',
                  textShadow: '0 0 15px rgba(253, 224, 71, 0.4)'
                }}>
                  Share this with your regional creators — let all brothers rise together.
                </p>
              </div>
            </div>
          </section>

          {/* SECTION 2: GENERATOR - Updated with glass card */}
          <section style={{
            padding: '4rem 1.5rem 5rem',
            position: 'relative'
          }}>
            <div style={{ maxWidth: '900px', margin: '0 auto' }}>
              <h2 className="neon-heading" style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
                Generate captions to hack Instagram algorithm
              </h2>

              {/* Generator Form in glass card */}
              <div className="glass-card">
                <form onSubmit={handleGenerate} style={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  gap: '2rem'
                }}>
                  {/* Subject */}
                  <div>
                    <label style={{
                      display: 'block',
                      fontSize: '0.85rem',
                      fontWeight: '700',
                      color: '#38bdf8',
                      marginBottom: '0.7rem',
                      textTransform: 'uppercase',
                      letterSpacing: '0.15em',
                      textShadow: '0 0 10px rgba(56, 189, 248, 0.5)'
                    }}>
                      ⚡ Subject
                    </label>
                    <input
                      type="text"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      placeholder="Example: Leg day in a small-town gym, night rooftop chai scene, breakup reel, etc."
                      style={{
                        width: '100%',
                        padding: '1rem 1.2rem',
                        borderRadius: '0.8rem',
                        color: '#e0f2fe',
                        fontSize: '1rem',
                        fontFamily: 'monospace',
                        background: 'rgba(6, 182, 212, 0.05)',
                        border: '1px solid rgba(34, 211, 238, 0.3)',
                        backdropFilter: 'blur(10px)'
                      }}
                      required
                    />
                  </div>

                  {/* More about your reel */}
                  <div>
                    <label style={{
                      display: 'block',
                      fontSize: '0.85rem',
                      fontWeight: '700',
                      color: '#38bdf8',
                      marginBottom: '0.7rem',
                      textTransform: 'uppercase',
                      letterSpacing: '0.15em',
                      textShadow: '0 0 10px rgba(56, 189, 248, 0.5)'
                    }}>
                      📹 More about your reel (optional)
                    </label>
                    <textarea
                      value={details}
                      onChange={(e) => setDetails(e.target.value)}
                      placeholder="What is happening in the reel? Camera angle, emotions, twist, location, who is in the frame... (this helps generate sharper captions)"
                      rows={3}
                      style={{
                        width: '100%',
                        padding: '1rem 1.2rem',
                        borderRadius: '0.8rem',
                        color: '#e0f2fe',
                        fontSize: '0.98rem',
                        fontFamily: 'monospace',
                        resize: 'vertical',
                        background: 'rgba(6, 182, 212, 0.05)',
                        border: '1px solid rgba(34, 211, 238, 0.3)',
                        backdropFilter: 'blur(10px)'
                      }}
                    />
                  </div>

                  {/* Mood */}
                  <div>
                    <label style={{
                      display: 'block',
                      fontSize: '0.85rem',
                      fontWeight: '700',
                      color: '#38bdf8',
                      marginBottom: '0.7rem',
                      textTransform: 'uppercase',
                      letterSpacing: '0.15em',
                      textShadow: '0 0 10px rgba(56, 189, 248, 0.5)'
                    }}>
                      🎭 Mood
                    </label>
                    <select
                      value={mood}
                      onChange={(e) => setMood(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '1rem 1.2rem',
                        borderRadius: '0.8rem',
                        color: '#e0f2fe',
                        fontSize: '1rem',
                        fontFamily: 'monospace',
                        cursor: 'pointer',
                        background: 'rgba(6, 182, 212, 0.05)',
                        border: '1px solid rgba(34, 211, 238, 0.3)',
                        backdropFilter: 'blur(10px)'
                      }}
                    >
                      {moods.map((m) => (
                        <option key={m.id} value={m.id} style={{ background: '#001d3d', color: '#e0f2fe' }}>
                          {m.label} — {m.punch}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Regional Vibe */}
                  <div>
                    <label style={{
                      display: 'block',
                      fontSize: '0.85rem',
                      fontWeight: '700',
                      color: '#38bdf8',
                      marginBottom: '0.7rem',
                      textTransform: 'uppercase',
                      letterSpacing: '0.15em',
                      textShadow: '0 0 10px rgba(56, 189, 248, 0.5)'
                    }}>
                      🌍 Regional Vibe
                    </label>
                    <select
                      value={region}
                      onChange={(e) => setRegion(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '1rem 1.2rem',
                        borderRadius: '0.8rem',
                        color: '#e0f2fe',
                        fontSize: '1rem',
                        fontFamily: 'monospace',
                        cursor: 'pointer',
                        background: 'rgba(6, 182, 212, 0.05)',
                        border: '1px solid rgba(34, 211, 238, 0.3)',
                        backdropFilter: 'blur(10px)'
                      }}
                    >
                      {regions.map((r) => (
                        <option key={r.id} value={r.id} style={{ background: '#001d3d', color: '#e0f2fe' }}>
                          {r.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Feedback box */}
                  <div>
                    <label style={{
                      display: 'block',
                      fontSize: '0.85rem',
                      fontWeight: '700',
                      color: '#38bdf8',
                      marginBottom: '0.7rem',
                      textTransform: 'uppercase',
                      letterSpacing: '0.15em',
                      textShadow: '0 0 10px rgba(56, 189, 248, 0.5)'
                    }}>
                      💬 Your valuable words for our improvement
                    </label>
                    <textarea
                      value={feedback}
                      onChange={(e) => setFeedback(e.target.value)}
                      placeholder="Tell us what to improve, what you loved, what you hate—your words will shape FunCaption."
                      rows={2}
                      style={{
                        width: '100%',
                        padding: '1rem 1.2rem',
                        borderRadius: '0.8rem',
                        color: '#e0f2fe',
                        fontSize: '0.98rem',
                        fontFamily: 'monospace',
                        resize: 'vertical',
                        background: 'rgba(6, 182, 212, 0.05)',
                        border: '1px solid rgba(34, 211, 238, 0.3)',
                        backdropFilter: 'blur(10px)'
                      }}
                    />
                  </div>

                  {/* Generate Button */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="neon-button-enhanced"
                    style={{
                      width: '100%',
                      cursor: loading ? 'not-allowed' : 'pointer',
                      opacity: loading ? 0.7 : 1
                    }}
                  >
                    {loading ? '⚡ GENERATING CAPTIONS...' : '🚀 GENERATE CAPTIONS'}
                  </button>
                </form>

                {/* Results */}
                {variants.length > 0 && (
                  <div style={{ 
                    marginTop: '4rem', 
                    display: 'flex', 
                    flexDirection: 'column', 
                    gap: '2rem'
                  }}>
                    {variants.map((v, i) => {
                      const processedCaption = (v.caption || '').replace(
                        /\n\nHelp please make us a favour follow us on Instagram.*$/s,
                        ''
                      )
                      
                      const instagramLink = 'https://www.instagram.com/instaalgohacker?igsh=MW1maXl2a3IxNm40OA=='
                      const isPremium = i === 0

                      if (isPremium) {
                        return (
                          <div key={i} className="premium-card">
                            <div style={{
                              position: 'absolute',
                              top: '0',
                              left: '50%',
                              transform: 'translateX(-50%)',
                              padding: '0.5rem 1.5rem',
                              borderRadius: '0 0 1rem 1rem',
                              background: 'linear-gradient(135deg, #22d3ee, #a855f7)',
                              color: '#000814',
                              fontSize: '0.75rem',
                              fontWeight: '900',
                              letterSpacing: '0.15em',
                              border: '2px solid rgba(255, 255, 255, 0.3)',
                              borderTop: 'none'
                            }}>
                              ★ PREMIUM ★
                            </div>

                            <p style={{
                              fontSize: '1.05rem',
                              color: '#e0f2fe',
                              lineHeight: 1.9,
                              whiteSpace: 'pre-line',
                              marginBottom: '1.5rem',
                              marginTop: '2rem',
                              textShadow: '0 0 10px rgba(224, 242, 254, 0.3)',
                              fontFamily: 'monospace'
                            }}>
                              {processedCaption}
                            </p>

                            {v.regionLabel && (
                              <div style={{
                                display: 'inline-block',
                                padding: '0.5rem 1.2rem',
                                background: 'linear-gradient(90deg, rgba(34, 211, 238, 0.2), rgba(168, 85, 247, 0.2))',
                                border: '2px solid rgba(34, 211, 238, 0.5)',
                                borderRadius: '999px',
                                fontSize: '0.8rem',
                                color: '#bae6fd',
                                marginBottom: '1.2rem',
                                fontWeight: '700'
                              }}>
                                🌍 {v.regionLabel}
                              </div>
                            )}

                            {/* Instagram CTA */}
                            <div style={{
                              background: 'rgba(0, 8, 20, 0.6)',
                              padding: '1.2rem',
                              borderRadius: '1rem',
                              margin: '1.5rem 0',
                              display: 'flex',
                              justifyContent: 'center',
                              gap: '0.8rem',
                              alignItems: 'center',
                              border: '2px dashed rgba(34, 211, 238, 0.3)'
                            }}>
                              <a
                                href={instagramLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="neon-button-enhanced"
                                style={{
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '0.6rem',
                                  textDecoration: 'none',
                                  padding: '0.7rem 1.3rem',
                                  borderRadius: '999px',
                                  fontSize: '0.95rem',
                                  fontWeight: '800'
                                }}
                              >
                                <InstagramIcon /> Click to follow
                              </a>
                            </div>

                            <button
                              type="button"
                              onClick={() => copyCaption(v.caption, i)}
                              className="neon-button-enhanced"
                              style={{
                                width: '100%',
                                padding: '1.2rem',
                                background: copiedIndex === i
                                  ? 'linear-gradient(135deg, rgba(34, 197, 94, 0.3), rgba(22, 163, 74, 0.3))'
                                  : 'linear-gradient(135deg, rgba(34, 211, 238, 0.2), rgba(168, 85, 247, 0.2))',
                                color: copiedIndex === i ? '#86efac' : '#e0f2fe',
                                border: copiedIndex === i 
                                  ? '2px solid #22c55e' 
                                  : '2px solid rgba(34, 211, 238, 0.6)',
                                borderRadius: '1rem',
                                fontSize: '1rem',
                                fontWeight: '900',
                                cursor: 'pointer',
                                textTransform: 'uppercase',
                                letterSpacing: '0.15em',
                                fontFamily: 'Orbitron, monospace, sans-serif'
                              }}
                            >
                              {copiedIndex === i ? '✓ COPIED!' : '📋 COPY PREMIUM CAPTION'}
                            </button>
                          </div>
                        )
                      } else {
                        return (
                          <div key={i} className="glass-card">
                            <div style={{
                              fontSize: '0.75rem',
                              color: '#38bdf8',
                              marginBottom: '1rem',
                              fontWeight: '800',
                              textTransform: 'uppercase',
                              letterSpacing: '0.15em',
                              textShadow: '0 0 10px rgba(56, 189, 248, 0.5)'
                            }}>
                              📝 Caption {i + 1}
                            </div>
                            
                            <p style={{
                              fontSize: '1rem',
                              lineHeight: '1.9',
                              color: '#cbd5e1',
                              marginBottom: '1.2rem',
                              whiteSpace: 'pre-line',
                              fontFamily: 'monospace'
                            }}>
                              {processedCaption}
                            </p>

                            {v.regionLabel && (
                              <div style={{
                                display: 'inline-block',
                                padding: '0.45rem 1.1rem',
                                background: 'rgba(6, 182, 212, 0.15)',
                                border: '1px solid rgba(34, 211, 238, 0.3)',
                                borderRadius: '999px',
                                fontSize: '0.75rem',
                                color: '#7dd3fc',
                                marginBottom: '1.2rem',
                                fontWeight: '700'
                              }}>
                                🌍 {v.regionLabel}
                              </div>
                            )}

                            <button
                              type="button"
                              onClick={() => copyCaption(v.caption, i)}
                              className="neon-button-enhanced"
                              style={{
                                width: '100%',
                                padding: '1.1rem',
                                background: copiedIndex === i
                                  ? 'linear-gradient(135deg, rgba(34, 197, 94, 0.2), rgba(22, 163, 74, 0.2))'
                                  : 'linear-gradient(135deg, rgba(59, 130, 246, 0.15), rgba(34, 197, 94, 0.15))',
                                color: copiedIndex === i ? '#86efac' : '#bae6fd',
                                border: copiedIndex === i 
                                  ? '2px solid rgba(34, 197, 94, 0.5)' 
                                  : '2px solid rgba(34, 211, 238, 0.3)',
                                borderRadius: '0.8rem',
                                fontSize: '0.95rem',
                                fontWeight: '800',
                                cursor: 'pointer',
                                textTransform: 'uppercase',
                                letterSpacing: '0.12em',
                                fontFamily: 'monospace'
                              }}
                            >
                              {copiedIndex === i ? '✓ COPIED!' : '📋 COPY CAPTION'}
                            </button>
                          </div>
                        )
                      }
                    })}
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* Footer with Instagram Link */}
          <footer style={{
            padding: '3rem 1.5rem',
            textAlign: 'center',
            color: '#64748b',
            fontSize: '0.9rem',
            position: 'relative'
          }}>
            <div style={{ marginBottom: '1.5rem', marginTop: '1rem' }}>
              <a 
                href="https://www.instagram.com/instaalgohacker?igsh=MW1maXl2a3IxNm40OA==" 
                target="_blank" 
                rel="noopener noreferrer"
                className="neon-button-enhanced"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.6rem',
                  color: '#e0f2fe',
                  textDecoration: 'none',
                  fontWeight: '700',
                  padding: '0.8rem 1.5rem',
                  borderRadius: '999px'
                }}
              >
                <InstagramIcon />
                Follow @instaalgohacker on Instagram
              </a>
            </div>
            <p style={{ 
              color: '#94a3b8',
              textShadow: '0 0 10px rgba(148, 163, 184, 0.3)'
            }}>
              FunCaption © 2025 — Built for creators who refuse to stay invisible 🔥
            </p>
          </footer>
        </div>
      </div>
    </>
  )
}
