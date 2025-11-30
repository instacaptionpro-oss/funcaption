import { useState } from 'react'
import Head from 'next/head'

const InstagramIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
    <path d="M8 0C5.829 0 5.556.01 4.703.048 3.85.088 3.269.222 2.76.42a3.917 3.917 0 0 0-1.417.923A3.927 3.927 0 0 0 .42 2.76C.222 3.268.087 3.85.048 4.7.01 5.555 0 5.827 0 8.001c0 2.172.01 2.444.048 3.297.04.852.174 1.433.372 1.942.205.526.478.972.923 1.417.444.445.89.719 1.416.923.51.198 1.09.333 1.942.372C5.555 15.99 5.827 16 8 16s2.444-.01 3.298-.048c.851-.04 1.434-.174 1.943-.372a3.916 3.916 0 0 0 1.416-.923c.445-.445.718-.891.923-1.417.197-.509.332-1.09.372-1.942C15.99 10.445 16 10.173 16 8s-.01-2.445-.048-3.299c-.04-.851-.175-1.433-.372-1.941a3.926 3.926 0 0 0-.923-1.417A3.911 3.911 0 0 0 13.24.42c-.51-.198-1.092-.333-1.943-.372C10.443.01 10.172 0 7.998 0h.003zm-.717 1.442h.718c2.136 0 2.389.007 3.232.046.78.035 1.204.166 1.486.275.373.145.64.319.92.599.28.28.453.546.598.92.11.281.24.705.275 1.485.039.843.047 1.096.047 3.231s-.008 2.389-.047 3.232c-.035.78-.166 1.203-.275 1.485a2.47 2.47 0 0 1-.599.919c-.28.28-.546.453-.92.598-.28.11-.704.24-1.485.276-.843.038-1.096.047-3.232.047s-2.39-.009-3.233-.047c-.78-.036-1.203-.166-1.485-.276a2.478 2.478 0 0 1-.92-.598 2.48 2.48 0 0 1-.6-.92c-.109-.281-.24-.705-.275-1.485-.038-.843-.046-1.096-.046-3.233 0-2.136.008-2.388.046-3.231.036-.78.166-1.204.276-1.486.145-.373.319-.64.599-.92.28-.28.546-.453.92-.598.282-.11.705-.24 1.485-.276.738-.034 1.024-.044 2.515-.045v.002zm4.988 1.328a.96.96 0 1 0 0 1.92.96.96 0 0 0 0-1.92zm-4.27 1.122a4.109 4.109 0 1 0 0 8.217 4.109 4.109 0 0 0 0-8.217zm0 1.441a2.667 2.667 0 1 1 0 5.334 2.667 2.667 0 0 1 0-5.334z"/>
  </svg>
);

const Logo = () => (
  <div style={{ position: 'absolute', top: '20px', left: '20px', zIndex: 10 }}>
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 1200" width="60" height="60" role="img" aria-label="FunCaption neon logo">
      <rect width="1200" height="1200" fill="#02020a"/>
      <text x="6" y="46" fontFamily="Inter, Arial, sans-serif" fontWeight="600"
            fontSize="18" fill="#9fb6d8" opacity="0.9" letterSpacing="1">
        Home of real trendsetters
      </text>
    </svg>
  </div>
);

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

export default function Home() {
  const [subject, setSubject] = useState('')
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
        body: JSON.stringify({ subject, mood, region })
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
    navigator.clipboard.writeText(text)
    setCopiedIndex(index)
    setTimeout(() => setCopiedIndex(null), 2000)
  }

  const premiumBoxStyle = {
    background: 'linear-gradient(180deg, rgba(9,10,21,0.6), rgba(8,9,18,0.8))',
    padding: '2.25rem',
    borderRadius: '1rem',
    border: '3px solid',
    borderImage: 'linear-gradient(135deg,#FFD700,#FF6A00) 1',
    boxShadow: '0 15px 40px rgba(138,43,226,0.18), inset 0 0 40px rgba(255,215,0,0.06)',
    position: 'relative'
  };

  const normalBoxStyle = {
    background: 'rgba(0, 0, 0, 0.6)',
    padding: '2rem',
    borderRadius: '1rem',
    border: '2px solid rgba(0, 255, 255, 0.3)',
    boxShadow: '0 0 20px rgba(0, 255, 255, 0.2)'
  };

  const premiumBadge = (
    <div style={{
      position: 'absolute',
      top: '-14px',
      right: '-14px',
      background: 'linear-gradient(135deg,#FFD700,#FF6A00)',
      color: '#0b0b0b',
      padding: '0.45rem 0.9rem',
      borderRadius: '999px',
      fontWeight: '800',
      fontSize: '0.8rem',
      boxShadow: '0 8px 24px rgba(255,106,0,0.18)'
    }}>
      PREMIUM
    </div>
  );

  return (
    <>
      <Head>
        <title>FunCaption - Free Caption Generator</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div style={{ 
        minHeight: '100vh', 
        background: '#0a0e27',
        color: 'white',
        fontFamily: 'Inter, sans-serif',
        position: 'relative'
      }}>
        <Logo />
        
        {/* HERO SECTION */}
        <section style={{
          background: 'linear-gradient(135deg, #0a0e27 0%, #16213e 100%)',
          padding: '4rem 1.5rem',
          borderBottom: '2px solid rgba(0, 255, 255, 0.2)',
          position: 'relative'
        }}>
          <div style={{ maxWidth: '900px', margin: '0 auto', textAlign: 'center', paddingTop: '60px' }}>
            <div style={{ marginBottom: '3rem' }}>
              <div style={{
                fontSize: '2.5rem',
                fontWeight: '900',
                marginBottom: '0.5rem',
                textShadow: '0 0 20px rgba(0, 255, 255, 0.6)',
                color: '#00ffff'
              }}>
                FunCaption
              </div>
              <div style={{
                fontSize: '1.1rem',
                color: '#8a2be2',
                fontWeight: '600',
                letterSpacing: '0.1em',
                textTransform: 'uppercase'
              }}>
                A Free Caption Generator
              </div>
              
              <div style={{ marginTop: '1rem' }}>
                <a 
                  href="https://www.instagram.com/instaalgohacker?igsh=MW1maXl2a3IxNm40OA==" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    color: '#00ffff',
                    textDecoration: 'none',
                    fontSize: '0.9rem',
                    fontWeight: '600',
                    padding: '0.5rem 1rem',
                    border: '1px solid rgba(0, 255, 255, 0.3)',
                    borderRadius: '2rem',
                    background: 'rgba(0, 255, 255, 0.1)',
                    transition: 'all 0.3s'
                  }}
                >
                  <InstagramIcon />
                  Follow us on Instagram
                </a>
              </div>
            </div>

            <div style={{ marginBottom: '3rem', lineHeight: '2' }}>
              <p style={{ fontSize: '1.3rem', color: '#a0a0a0', marginBottom: '1rem' }}>
                Do you really think you work hard for your content?
              </p>
              <p style={{ fontSize: '1.3rem', color: '#a0a0a0', marginBottom: '1rem' }}>
                Do you really think people see your content when you post it?
              </p>
              <p style={{ fontSize: '1.3rem', color: '#a0a0a0', marginBottom: '2rem' }}>
                Do you think you're even capable for this game?
              </p>
            </div>

            <div style={{
              background: 'linear-gradient(135deg, rgba(138, 43, 226, 0.2), rgba(0, 255, 255, 0.2))',
              padding: '2.5rem',
              borderRadius: '1rem',
              border: '1px solid rgba(0, 255, 255, 0.3)',
              marginBottom: '2rem',
              boxShadow: '0 0 40px rgba(138, 43, 226, 0.3)'
            }}>
              <p style={{ 
                fontSize: '1.5rem', 
                fontWeight: '700', 
                color: '#00ffff',
                marginBottom: '1.5rem',
                lineHeight: '1.6'
              }}>
                Yes — we think you are. That's why you and us are here.
              </p>

              <p style={{ fontSize: '1.1rem', color: '#c0c0c0', marginBottom: '1rem' }}>
                By using this, people will NOT magically start to see you.
              </p>

              <p style={{ 
                fontSize: '2rem', 
                fontWeight: '900', 
                background: 'linear-gradient(135deg, #00ffff, #8a2be2)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                marginBottom: '1rem'
              }}>
                But Instagram's algorithm WILL start working for you.
              </p>

              <p style={{ fontSize: '0.95rem', color: '#ffd700', fontStyle: 'italic' }}>
                Share this with your regional creators — let all brothers rise together.
              </p>
            </div>
          </div>
        </section>

        {/* GENERATOR */}
        <section style={{
          background: 'linear-gradient(135deg, #16213e 0%, #0f3460 100%)',
          padding: '4rem 1.5rem'
        }}>
          <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <h2 style={{
              fontSize: '2.5rem',
              fontWeight: '900',
              textAlign: 'center',
              marginBottom: '3rem',
              background: 'linear-gradient(135deg, #00ffff, #8a2be2)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              Generate captions to hack Instagram's algorithm
            </h2>

            <div style={{
              background: 'rgba(0, 0, 0, 0.4)',
              padding: '2.5rem',
              borderRadius: '1.5rem',
              border: '2px solid rgba(138, 43, 226, 0.4)',
              boxShadow: '0 0 60px rgba(138, 43, 226, 0.3)'
            }}>
              <form 
                onSubmit={handleGenerate} 
                style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}
              >

                {/* SUBJECT */}
                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '0.9rem',
                    fontWeight: '700',
                    color: '#00ffff',
                    marginBottom: '0.75rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em'
                  }}>
                    Subject
                  </label>
                  <input
                    type="text"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="What's your post about?"
                    style={{
                      width: '100%',
                      padding: '1rem',
                      background: 'rgba(0, 0, 0, 0.6)',
                      border: '2px solid rgba(0, 255, 255, 0.3)',
                      borderRadius: '0.5rem',
                      color: 'white',
                      fontSize: '1rem',
                      outline: 'none'
                    }}
                    required
                  />
                </div>

                {/* MOOD */}
                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '0.9rem',
                    fontWeight: '700',
                    color: '#00ffff',
                    marginBottom: '0.75rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em'
                  }}>
                    Mood
                  </label>
                  <select
                    value={mood}
                    onChange={(e) => setMood(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '1rem',
                      background: 'rgba(0, 0, 0, 0.6)',
                      border: '2px solid rgba(0, 255, 255, 0.3)',
                      borderRadius: '0.5rem',
                      color: 'white',
                      fontSize: '1rem',
                      outline: 'none',
                      cursor: 'pointer'
                    }}
                  >
                    {[
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
                    ].map(m => (
                      <option key={m.id} value={m.id} style={{ background: '#0a0e27' }}>
                        {m.label} — {m.punch}
                      </option>
                    ))}
                  </select>
                </div>

                {/* REGION */}
                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '0.9rem',
                    fontWeight: '700',
                    color: '#00ffff',
                    marginBottom: '0.75rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em'
                  }}>
                    Regional Vibe
                  </label>
                  <select
                    value={region}
                    onChange={(e) => setRegion(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '1rem',
                      background: 'rgba(0, 0, 0, 0.6)',
                      border: '2px solid rgba(138, 43, 226, 0.4)',
                      borderRadius: '0.5rem',
                      color: 'white',
                      fontSize: '1rem',
                      outline: 'none',
                      cursor: 'pointer'
                    }}
                  >
                    {regions.map(r => (
                      <option key={r.id} value={r.id} style={{ background: '#0a0e27' }}>
                        {r.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* SUBMIT BUTTON */}
                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    width: '100%',
                    padding: '1.25rem',
                    background: loading 
                      ? 'rgba(138, 43, 226, 0.5)' 
                      : 'linear-gradient(135deg, #8a2be2, #00ffff)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '0.75rem',
                    fontSize: '1.2rem',
                    fontWeight: '900',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em',
                    boxShadow: loading ? 'none' : '0 0 30px rgba(138, 43, 226, 0.6)',
                    transition: 'all 0.3s'
                  }}
                >
                  {loading ? '⚡ GENERATING...' : '🚀 GENERATE'}
                </button>
              </form>

              {/* RESULTS */}
              {variants.length > 0 && (
                <div style={{ marginTop: '3rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  {variants.map((v, i) => {

                    const processedCaption = v.caption.replace(
                      /\n\nHelp please make us a favour follow us on Instagram.*$/s,
                      ''
                    );

                    const instagramLink = v.caption.match(/https:\/\/www\.instagram\.com\/[^\s]+/)
                      ?.[0] || 'https://www.instagram.com/instaalgohacker?igsh=MW1maXl2a3IxNm40OA==';

                    const boxStyle = i === 0 ? premiumBoxStyle : normalBoxStyle;

                    const copyButtonStyle = {
                      width: '100%',
                      padding: '1rem',
                      background: copiedIndex === i
                        ? 'linear-gradient(135deg, #00ff00, #00aa00)'
                        : (i === 0 
                          ? 'linear-gradient(135deg, #FFD700, #FF6A00)' 
                          : 'linear-gradient(135deg, #8a2be2, #00ffff)'
                        ),
                      color: i === 0 ? '#09101a' : 'white',
                      border: 'none',
                      borderRadius: '0.5rem',
                      fontSize: i === 0 ? '1rem' : '0.95rem',
                      fontWeight: '800',
                      cursor: 'pointer',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      boxShadow: '0 0 20px rgba(138, 43, 226, 0.4)',
                      transition: 'all 0.3s'
                    };

                    return (
                      <div key={i} style={boxStyle}>
                        {i === 0 && premiumBadge}

                        {/* FIXED BACKTICKS BELOW */}
                        <div style={{
                          fontSize: '0.75rem',
                          color: '#00ffff',
                          marginBottom: '1rem',
                          fontWeight: '700',
                          textTransform: 'uppercase',
                          letterSpacing: '0.1em'
                        }}>
                          {i === 0 ? '💎 Premium Caption' : `📝 Caption Style ${i + 1}`}
                        </div>

                        <p style={{
                          fontSize: '1rem',
                          lineHeight: '1.8',
                          color: '#e0e0e0',
                          marginBottom: '1.5rem',
                          whiteSpace: 'pre-line'
                        }}>
                          {processedCaption}
                        </p>

                        {v.regionLabel && (
                          <div style={{
                            display: 'inline-block',
                            padding: '0.4rem 1rem',
                            background: i === 0 ? 'rgba(255,215,0,0.12)' : 'rgba(138, 43, 226, 0.3)',
                            border: i === 0 
                              ? '1px solid rgba(255,215,0,0.28)' 
                              : '1px solid rgba(138, 43, 226, 0.6)',
                            borderRadius: '2rem',
                            fontSize: '0.75rem',
                            color: i === 0 ? '#FFD700' : '#00ffff',
                            marginBottom: '1rem',
                            fontWeight: '700'
                          }}>
                            🌍 {v.regionLabel}
                          </div>
                        )}

                        <div style={{
                          background: i === 0 ? 'rgba(255,215,0,0.08)' : 'rgba(138, 43, 226, 0.2)',
                          padding: '1rem',
                          borderRadius: '0.5rem',
                          marginBottom: '1rem',
                          textAlign: 'center'
                        }}>
                          <p style={{ 
                            margin: '0 0 0.5rem 0', 
                            fontSize: '0.9rem',
                            color: i === 0 ? '#FFD700' : '#00ffff',
                            fontWeight: 700
                          }}>
                            Help please make us a favour follow us on Instagram
                          </p>
                          <a 
                            href={instagramLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '0.5rem',
                              background: i === 0 
                                ? 'linear-gradient(135deg,#FFD700,#FF6A00)' 
                                : 'linear-gradient(135deg,#8a2be2,#00ffff)',
                              color: i === 0 ? '#09101a' : 'white',
                              textDecoration: 'none',
                              padding: '0.5rem 1rem',
                              borderRadius: '1.5rem',
                              fontWeight: '800',
                              fontSize: '0.9rem'
                            }}
                          >
                            <InstagramIcon />
                            Click Below
                          </a>
                        </div>

                        <button
                          onClick={() => copyCaption(v.caption, i)}
                          style={copyButtonStyle}
                        >
                          {copiedIndex === i ? '✓ COPIED!' : '📋 COPY CAPTION'}
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </section>

        {/* FOOTER */}
        <footer style={{
          background: '#0a0e27',
          borderTop: '1px solid rgba(0, 255, 255, 0.2)',
          padding: '2rem 1.5rem',
          textAlign: 'center',
          color: '#808080',
          fontSize: '0.85rem'
        }}>
          <div style={{ marginBottom: '1rem' }}>
            <a 
              href="https://www.instagram.com/instaalgohacker?igsh=MW1maXl2a3IxNm40OA==" 
              target="_blank" 
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                color: '#00ffff',
                textDecoration: 'none',
                fontWeight: '600'
              }}
            >
              <InstagramIcon />
              Follow @instaalgohacker on Instagram
            </a>
          </div>
          <p>FunCaption © 2025 — Built for creators who refuse to stay invisible 🔥</p>
        </footer>
      </div>
    </>
  )
}
