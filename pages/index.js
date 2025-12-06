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

// Keep all your existing components (InstagramIcon, Logo, etc.)
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

// Keep your existing regions and moods arrays
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

        {/* Rest of your existing code remains the same */}
        {/* ... (keep all your existing JSX content) ... */}
        
      </div>
    </>
  )
}
