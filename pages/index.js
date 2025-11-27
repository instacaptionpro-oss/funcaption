import { useState } from 'react'
import Head from 'next/head'

const moods = [
  { id: "attitude", label: "Attitude" },
  { id: "motivation", label: "Motivation" },
  { id: "love", label: "Love" },
  { id: "breakup", label: "Breakup" },
  { id: "gym", label: "Gym" },
  { id: "travel", label: "Travel" },
  { id: "cute", label: "Cute" },
  { id: "savage", label: "Savage" },
  { id: "aesthetic", label: "Aesthetic" },
  { id: "sad", label: "Sad" },
  { id: "happy", label: "Happy" },
  { id: "alone", label: "Alone" },
  { id: "boss", label: "Boss" },
  { id: "genz", label: "GenZ" },
  { id: "calm", label: "Calm" }
]

const regions = [
  { id: "none", label: "No Region" },
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

  return (
    <>
      <Head>
        <title>FunCaption — Hack Instagram Algorithm</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div style={{ 
        minHeight: '100vh', 
        background: '#0a0e27',
        color: 'white',
        fontFamily: 'Inter, sans-serif'
      }}>
        {/* SECTION 1: HERO / STORY */}
        <section style={{
          background: 'linear-gradient(135deg, #0a0e27 0%, #16213e 100%)',
          padding: '4rem 1.5rem',
          borderBottom: '2px solid rgba(0, 255, 255, 0.2)',
          position: 'relative'
        }}>
          <div style={{ maxWidth: '900px', margin: '0 auto', textAlign: 'center' }}>
            {/* Neon logo */}
            <div style={{
              fontSize: '2rem',
              fontWeight: '900',
              marginBottom: '3rem',
              textShadow: '0 0 20px rgba(0, 255, 255, 0.6)',
              color: '#00ffff'
            }}>
              FunCaption
            </div>

            {/* Aggressive questions */}
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

            {/* Answer */}
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
                <br />
                Because the world makes us feel the same way.
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

        {/* SECTION 2: GENERATOR */}
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

            {/* Generator Form */}
            <div style={{
              background: 'rgba(0, 0, 0, 0.4)',
              padding: '2.5rem',
              borderRadius: '1.5rem',
              border: '2px solid rgba(138, 43, 226, 0.4)',
              boxShadow: '0 0 60px rgba(138, 43, 226, 0.3)'
            }}>
              <form onSubmit={handleGenerate} style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                {/* Subject */}
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

                {/* Mood */}
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
                    {moods.map(m => (
                      <option key={m.id} value={m.id} style={{ background: '#0a0e27' }}>
                        {m.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Regional Vibe */}
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

                {/* Generate Button */}
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

              {/* Results */}
              {variants.length > 0 && (
                <div style={{ marginTop: '3rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  {variants.map((v, i) => (
                    <div key={i} style={{
                      background: 'rgba(0, 0, 0, 0.6)',
                      padding: '2rem',
                      borderRadius: '1rem',
                      border: '2px solid rgba(0, 255, 255, 0.3)',
                      boxShadow: '0 0 20px rgba(0, 255, 255, 0.2)'
                    }}>
                      <div style={{
                        fontSize: '0.75rem',
                        color: '#00ffff',
                        marginBottom: '1rem',
                        fontWeight: '700',
                        textTransform: 'uppercase',
                        letterSpacing: '0.1em'
                      }}>
                        📝 Caption {i + 1}
                      </div>
                      
                      <p style={{
                        fontSize: '1rem',
                        lineHeight: '1.8',
                        color: '#e0e0e0',
                        marginBottom: '1.5rem',
                        whiteSpace: 'pre-line'
                      }}>
                        {v.caption}
                      </p>

                      {v.regionLabel && (
                        <div style={{
                          display: 'inline-block',
                          padding: '0.4rem 1rem',
                          background: 'rgba(138, 43, 226, 0.3)',
                          border: '1px solid rgba(138, 43, 226, 0.6)',
                          borderRadius: '2rem',
                          fontSize: '0.75rem',
                          color: '#00ffff',
                          marginBottom: '1rem',
                          fontWeight: '700'
                        }}>
                          🌍 {v.regionLabel}
                        </div>
                      )}

                      <button
                        onClick={() => copyCaption(v.caption, i)}
                        style={{
                          width: '100%',
                          padding: '1rem',
                          background: copiedIndex === i
                            ? 'linear-gradient(135deg, #00ff00, #00aa00)'
                            : 'linear-gradient(135deg, #8a2be2, #00ffff)',
                          color: 'white',
                          border: 'none',
                          borderRadius: '0.5rem',
                          fontSize: '0.95rem',
                          fontWeight: '700',
                          cursor: 'pointer',
                          textTransform: 'uppercase',
                          letterSpacing: '0.05em',
                          boxShadow: '0 0 20px rgba(138, 43, 226, 0.4)',
                          transition: 'all 0.3s'
                        }}
                      >
                        {copiedIndex === i ? '✓ COPIED!' : '📋 COPY CAPTION'}
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer style={{
          background: '#0a0e27',
          borderTop: '1px solid rgba(0, 255, 255, 0.2)',
          padding: '2rem 1.5rem',
          textAlign: 'center',
          color: '#808080',
          fontSize: '0.85rem'
        }}>
          <p>FunCaption © 2025 — Built for creators who refuse to stay invisible 🔥</p>
        </footer>
      </div>
    </>
  )
}
