import { useState } from 'react'
import Head from 'next/head'

const moods = [
  { id: "gym", label: "Gym", tagline: "Iron heals what people broke." },
  { id: "attitude", label: "Attitude", tagline: "I don't chase. I replace." },
  { id: "aesthetic", label: "Aesthetic", tagline: "Soft face, sharp mind." },
  { id: "love", label: "Love", tagline: "Some connections were written before we were." },
  { id: "heartbreak", label: "Heartbreak", tagline: "Broken doesn't mean finished." },
  { id: "hustle", label: "Hustle", tagline: "Slow progress is still loyalty to your dream." },
  { id: "luxury", label: "Luxury", tagline: "Soft life, loud ambition." },
  { id: "travel", label: "Travel", tagline: "Collect memories, not people." },
  { id: "lonely", label: "Lonely / Dark", tagline: "I disappear to rebuild." },
  { id: "friendship", label: "Friendship", tagline: "Chosen family hits different." },
  { id: "genz", label: "Gen-Z", tagline: "Main character energy loading…" },
  { id: "cute", label: "Cute / Soft", tagline: "Smiling like life finally got soft." },
  { id: "party", label: "Party", tagline: "Bad decisions make good stories." },
  { id: "photodump", label: "Photodump", tagline: "Proof I'm living, not posting." },
  { id: "selflove", label: "Self-Love", tagline: "Choosing myself wasn't selfish — it was survival." },
  { id: "savage", label: "Savage", tagline: "I don't argue, I upgrade." },
  { id: "sad", label: "Sad / Emotional", tagline: "Some chapters hurt but shape you." }
]

const regions = [
  { id: "none", label: "No Region" },
  { id: "gujarati", label: "Gujarati" },
  { id: "punjabi", label: "Punjabi" },
  { id: "marathi", label: "Marathi" },
  { id: "bengali", label: "Bengali" },
  { id: "tamil", label: "Tamil" },
  { id: "telugu", label: "Telugu" },
  { id: "kannada", label: "Kannada" },
  { id: "malayalam", label: "Malayalam" },
  { id: "rajasthani", label: "Rajasthani" },
  { id: "bhojpuri", label: "Bhojpuri" },
  { id: "haryanvi", label: "Haryanvi" },
  { id: "hyderabadi", label: "Hyderabadi" },
  { id: "kashmiri", label: "Kashmiri" },
  { id: "assamese", label: "Assamese / NE" },
  { id: "odia", label: "Odia" },
  { id: "goan", label: "Goan" },
  { id: "up", label: "UP / North" },
  { id: "genz", label: "Gen-Z" },
  { id: "global", label: "Global" }
]

const sampleSubjects = ["gym transformation", "street food in Surat", "college fest", "late night drive", "chai pe charcha"]

export default function Home() {
  const [subject, setSubject] = useState('')
  const [mood, setMood] = useState('gym')
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
        <title>FunCaption — Captions that feel like your life</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div style={{ 
        minHeight: '100vh', 
        background: 'linear-gradient(135deg, #0F0C29 0%, #302B63 50%, #24243e 100%)',
        color: 'white'
      }}>
        {/* Header */}
        <nav style={{ 
          borderBottom: '1px solid rgba(139, 92, 246, 0.3)', 
          background: 'rgba(0, 0, 0, 0.4)', 
          backdropFilter: 'blur(10px)',
          padding: '1.2rem 0',
          position: 'sticky',
          top: 0,
          zIndex: 50
        }}>
          <div style={{ 
            maxWidth: '1200px', 
            margin: '0 auto', 
            padding: '0 1.5rem', 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center' 
          }}>
            <div style={{ 
              fontSize: '1.8rem', 
              fontWeight: '800', 
              background: 'linear-gradient(135deg, #00E5FF 0%, #FF00E5 100%)', 
              WebkitBackgroundClip: 'text', 
              WebkitTextFillColor: 'transparent',
              letterSpacing: '-0.02em'
            }}>
              FunCaption
            </div>
            <div style={{ display: 'flex', gap: '2rem', fontSize: '0.95rem', color: '#A78BFA' }}>
              <span style={{ cursor: 'pointer', transition: 'color 0.2s' }}>How it works</span>
              <span style={{ opacity: 0.5 }}>Pricing</span>
            </div>
          </div>
        </nav>

        {/* Hero */}
        <section style={{ maxWidth: '900px', margin: '0 auto', padding: '4rem 1.5rem 2rem', textAlign: 'center' }}>
          <h1 style={{ 
            fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', 
            fontWeight: '900', 
            marginBottom: '1.5rem', 
            background: 'linear-gradient(135deg, #FBBF24 0%, #F59E0B 50%, #EF4444 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            lineHeight: '1.1',
            letterSpacing: '-0.03em'
          }}>
            Get captions that feel like your life.
          </h1>
          <p style={{ 
            fontSize: '1.3rem', 
            color: '#C4B5FD', 
            marginBottom: '3rem',
            fontWeight: '500'
          }}>
            Subject + Mood + Region → 3 emotional captions. 🔥
          </p>

          {/* Generator Card */}
          <div style={{ 
            background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(59, 130, 246, 0.1) 100%)',
            backdropFilter: 'blur(20px)', 
            borderRadius: '2rem', 
            padding: '2.5rem', 
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(139, 92, 246, 0.3)',
            border: '1px solid rgba(139, 92, 246, 0.2)'
          }}>
            <form onSubmit={handleGenerate} style={{ display: 'flex', flexDirection: 'column', gap: '1.8rem' }}>
              {/* Subject Input */}
              <div style={{ textAlign: 'left' }}>
                <label style={{ 
                  display: 'block', 
                  fontSize: '1rem', 
                  fontWeight: '700', 
                  marginBottom: '0.75rem', 
                  color: '#E9D5FF',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em'
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
                    padding: '1rem 1.25rem', 
                    background: 'rgba(0, 0, 0, 0.4)',
                    border: '2px solid rgba(139, 92, 246, 0.3)', 
                    borderRadius: '0.75rem', 
                    fontSize: '1.1rem',
                    outline: 'none',
                    color: 'white',
                    transition: 'all 0.3s'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#8B5CF6'}
                  onBlur={(e) => e.target.style.borderColor = 'rgba(139, 92, 246, 0.3)'}
                  required
                />
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem', marginTop: '1rem' }}>
                  {sampleSubjects.map(s => (
                    <button 
                      key={s}
                      type="button"
                      onClick={() => setSubject(s)}
                      style={{
                        padding: '0.5rem 1rem',
                        background: 'rgba(139, 92, 246, 0.2)',
                        border: '1px solid rgba(139, 92, 246, 0.4)',
                        borderRadius: '2rem',
                        fontSize: '0.85rem',
                        cursor: 'pointer',
                        color: '#C4B5FD',
                        transition: 'all 0.2s',
                        fontWeight: '500'
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.background = 'rgba(139, 92, 246, 0.4)'
                        e.target.style.transform = 'scale(1.05)'
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.background = 'rgba(139, 92, 246, 0.2)'
                        e.target.style.transform = 'scale(1)'
                      }}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* Mood Dropdown */}
              <div style={{ textAlign: 'left' }}>
                <label style={{ 
                  display: 'block', 
                  fontSize: '1rem', 
                  fontWeight: '700', 
                  marginBottom: '0.75rem', 
                  color: '#E9D5FF',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em'
                }}>
                  Mood
                </label>
                <select 
                  value={mood}
                  onChange={(e) => setMood(e.target.value)}
                  style={{ 
                    width: '100%', 
                    padding: '1rem 1.25rem', 
                    background: 'rgba(0, 0, 0, 0.4)',
                    border: '2px solid rgba(139, 92, 246, 0.3)', 
                    borderRadius: '0.75rem', 
                    fontSize: '1rem',
                    outline: 'none',
                    color: 'white',
                    cursor: 'pointer'
                  }}
                >
                  {moods.map(m => (
                    <option key={m.id} value={m.id} style={{ background: '#1F1B2E', color: 'white' }}>
                      {m.label} — {m.tagline}
                    </option>
                  ))}
                </select>
              </div>

              {/* Region Dropdown */}
              <div style={{ textAlign: 'left' }}>
                <label style={{ 
                  display: 'block', 
                  fontSize: '1rem', 
                  fontWeight: '700', 
                  marginBottom: '0.75rem', 
                  color: '#E9D5FF',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em'
                }}>
                  Region (optional)
                </label>
                <select 
                  value={region}
                  onChange={(e) => setRegion(e.target.value)}
                  style={{ 
                    width: '100%', 
                    padding: '1rem 1.25rem', 
                    background: 'rgba(0, 0, 0, 0.4)',
                    border: '2px solid rgba(139, 92, 246, 0.3)', 
                    borderRadius: '0.75rem', 
                    fontSize: '1rem',
                    outline: 'none',
                    color: 'white',
                    cursor: 'pointer'
                  }}
                >
                  {regions.map(r => (
                    <option key={r.id} value={r.id} style={{ background: '#1F1B2E', color: 'white' }}>
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
                  background: loading ? 'rgba(139, 92, 246, 0.5)' : 'linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%)', 
                  color: 'white', 
                  border: 'none', 
                  borderRadius: '1rem', 
                  fontSize: '1.2rem', 
                  fontWeight: '700', 
                  cursor: loading ? 'not-allowed' : 'pointer',
                  boxShadow: loading ? 'none' : '0 10px 30px rgba(139, 92, 246, 0.4)',
                  transition: 'all 0.3s',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em'
                }}
                onMouseEnter={(e) => {
                  if (!loading) e.target.style.transform = 'translateY(-2px)'
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'translateY(0)'
                }}
              >
                {loading ? '⚡ Generating...' : '🚀 Generate Captions'}
              </button>

              <p style={{ fontSize: '0.9rem', color: '#A78BFA', textAlign: 'center', fontWeight: '500' }}>
                ✨ Free — 3 captions per generation • No login
              </p>
            </form>

            {/* Results */}
            {variants.length > 0 && (
              <div style={{ marginTop: '2.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <h3 style={{ 
                  fontSize: '1.5rem', 
                  fontWeight: '700', 
                  textAlign: 'center',
                  background: 'linear-gradient(135deg, #FBBF24, #F59E0B)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}>
                  🎉 Your Captions Are Ready!
                </h3>
                {variants.map((v, i) => (
                  <div key={i} style={{ 
                    background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.4) 0%, rgba(59, 130, 246, 0.1) 100%)', 
                    padding: '1.75rem', 
                    borderRadius: '1.25rem', 
                    border: '1px solid rgba(139, 92, 246, 0.3)',
                    textAlign: 'left',
                    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.3)'
                  }}>
                    <p style={{ 
                      fontSize: '1.05rem', 
                      lineHeight: '1.7', 
                      color: '#E9D5FF', 
                      marginBottom: '1.25rem', 
                      whiteSpace: 'pre-line',
                      fontWeight: '400'
                    }}>
                      {v.caption}
                    </p>
                    {v.regionLabel && (
                      <span style={{ 
                        display: 'inline-block', 
                        padding: '0.4rem 1rem', 
                        background: 'rgba(139, 92, 246, 0.3)', 
                        borderRadius: '2rem', 
                        fontSize: '0.8rem', 
                        color: '#C4B5FD',
                        marginBottom: '1rem',
                        fontWeight: '600',
                        border: '1px solid rgba(139, 92, 246, 0.4)'
                      }}>
                        🌍 {v.regionLabel}
                      </span>
                    )}
                    <button 
                      onClick={() => copyCaption(v.caption, i)}
                      style={{ 
                        width: '100%', 
                        padding: '1rem', 
                        background: copiedIndex === i 
                          ? 'linear-gradient(135deg, #10B981 0%, #059669 100%)' 
                          : 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)', 
                        color: 'white', 
                        border: 'none', 
                        borderRadius: '0.75rem', 
                        cursor: 'pointer',
                        fontSize: '1rem',
                        fontWeight: '700',
                        transition: 'all 0.3s',
                        boxShadow: '0 4px 12px rgba(99, 102, 241, 0.4)'
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.transform = 'scale(1.02)'
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.transform = 'scale(1)'
                      }}
                    >
                      {copiedIndex === i ? '✓ Copied!' : '📋 Copy Caption'}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Why Section */}
        <section style={{ maxWidth: '900px', margin: '3rem auto', padding: '0 1.5rem' }}>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
            gap: '2rem', 
            textAlign: 'center' 
          }}>
            <div style={{ 
              background: 'rgba(139, 92, 246, 0.1)', 
              padding: '2rem', 
              borderRadius: '1.25rem',
              border: '1px solid rgba(139, 92, 246, 0.2)'
            }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>💛</div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '0.75rem', color: '#FBBF24' }}>
                Belonging
              </h3>
              <p style={{ fontSize: '0.95rem', color: '#C4B5FD', lineHeight: '1.5' }}>
                Captions that sound like you, not the algorithm.
              </p>
            </div>
            <div style={{ 
              background: 'rgba(139, 92, 246, 0.1)', 
              padding: '2rem', 
              borderRadius: '1.25rem',
              border: '1px solid rgba(139, 92, 246, 0.2)'
            }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>⚡</div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '0.75rem', color: '#FBBF24' }}>
                Speed
              </h3>
              <p style={{ fontSize: '0.95rem', color: '#C4B5FD', lineHeight: '1.5' }}>
                3 emotional captions in 3 seconds.
              </p>
            </div>
            <div style={{ 
              background: 'rgba(139, 92, 246, 0.1)', 
              padding: '2rem', 
              borderRadius: '1.25rem',
              border: '1px solid rgba(139, 92, 246, 0.2)'
            }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>🧠</div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '0.75rem', color: '#FBBF24' }}>
                Psychology
              </h3>
              <p style={{ fontSize: '0.95rem', color: '#C4B5FD', lineHeight: '1.5' }}>
                Built on mood science, not templates.
              </p>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer style={{ 
          borderTop: '1px solid rgba(139, 92, 246, 0.2)', 
          marginTop: '4rem', 
          padding: '2.5rem 1.5rem', 
          textAlign: 'center', 
          color: '#A78BFA', 
          fontSize: '0.9rem' 
        }}>
          <p style={{ fontWeight: '500' }}>FunCaption © 2025 — Made for creators 🚀</p>
        </footer>
      </div>
    </>
  )
}
