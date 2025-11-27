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

      <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #F8FAFC 0%, #EEF2FF 100%)' }}>
        {/* Header */}
        <nav style={{ borderBottom: '1px solid #E2E8F0', background: 'white', padding: '1rem 0' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ fontSize: '1.5rem', fontWeight: '700', background: 'linear-gradient(135deg, #00E5FF, #6A00FF)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              FunCaption
            </div>
            <div style={{ display: 'flex', gap: '1.5rem', fontSize: '0.9rem', color: '#64748B' }}>
              <span>How it works</span>
              <span style={{ opacity: 0.5 }}>Pricing</span>
            </div>
          </div>
        </nav>

        {/* Hero */}
        <section style={{ maxWidth: '900px', margin: '0 auto', padding: '3rem 1rem', textAlign: 'center' }}>
          <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: '700', marginBottom: '1rem', color: '#1E293B' }}>
            FunCaption — get captions that feel like your life.
          </h1>
          <p style={{ fontSize: '1.1rem', color: '#64748B', marginBottom: '2rem' }}>
            Subject + Mood + Region → 3 emotional captions.
          </p>

          {/* Generator Card */}
          <div style={{ 
            background: 'rgba(255, 255, 255, 0.8)', 
            backdropFilter: 'blur(10px)', 
            borderRadius: '1.5rem', 
            padding: '2rem', 
            boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
            border: '1px solid rgba(255,255,255,0.2)'
          }}>
            <form onSubmit={handleGenerate} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {/* Subject Input */}
              <div style={{ textAlign: 'left' }}>
                <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: '600', marginBottom: '0.5rem', color: '#334155' }}>
                  Subject
                </label>
                <input 
                  type="text" 
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="What's your post about?"
                  style={{ 
                    width: '100%', 
                    padding: '0.75rem 1rem', 
                    border: '2px solid #E2E8F0', 
                    borderRadius: '0.5rem', 
                    fontSize: '1rem',
                    outline: 'none'
                  }}
                  required
                />
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.75rem' }}>
                  {sampleSubjects.map(s => (
                    <button 
                      key={s}
                      type="button"
                      onClick={() => setSubject(s)}
                      style={{
                        padding: '0.4rem 0.8rem',
                        background: '#F1F5F9',
                        border: 'none',
                        borderRadius: '1rem',
                        fontSize: '0.8rem',
                        cursor: 'pointer',
                        color: '#64748B'
                      }}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* Mood Dropdown */}
              <div style={{ textAlign: 'left' }}>
                <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: '600', marginBottom: '0.5rem', color: '#334155' }}>
                  Mood
                </label>
                <select 
                  value={mood}
                  onChange={(e) => setMood(e.target.value)}
                  style={{ 
                    width: '100%', 
                    padding: '0.75rem 1rem', 
                    border: '2px solid #E2E8F0', 
                    borderRadius: '0.5rem', 
                    fontSize: '1rem',
                    outline: 'none'
                  }}
                >
                  {moods.map(m => (
                    <option key={m.id} value={m.id}>
                      {m.label} — {m.tagline}
                    </option>
                  ))}
                </select>
              </div>

              {/* Region Dropdown */}
              <div style={{ textAlign: 'left' }}>
                <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: '600', marginBottom: '0.5rem', color: '#334155' }}>
                  Region (optional)
                </label>
                <select 
                  value={region}
                  onChange={(e) => setRegion(e.target.value)}
                  style={{ 
                    width: '100%', 
                    padding: '0.75rem 1rem', 
                    border: '2px solid #E2E8F0', 
                    borderRadius: '0.5rem', 
                    fontSize: '1rem',
                    outline: 'none'
                  }}
                >
                  {regions.map(r => (
                    <option key={r.id} value={r.id}>{r.label}</option>
                  ))}
                </select>
              </div>

              {/* Generate Button */}
              <button 
                type="submit"
                disabled={loading}
                style={{ 
                  width: '100%', 
                  padding: '1rem', 
                  background: 'linear-gradient(135deg, #00E5FF, #6A00FF)', 
                  color: 'white', 
                  border: 'none', 
                  borderRadius: '0.75rem', 
                  fontSize: '1.1rem', 
                  fontWeight: '600', 
                  cursor: loading ? 'not-allowed' : 'pointer',
                  opacity: loading ? 0.6 : 1
                }}
              >
                {loading ? 'Generating...' : 'Generate Caption'}
              </button>

              <p style={{ fontSize: '0.85rem', color: '#94A3B8', textAlign: 'center' }}>
                Free — 3 captions per generation • No login
              </p>
            </form>

            {/* Results */}
            {variants.length > 0 && (
              <div style={{ marginTop: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {variants.map((v, i) => (
                  <div key={i} style={{ 
                    background: 'white', 
                    padding: '1.5rem', 
                    borderRadius: '1rem', 
                    border: '1px solid #E2E8F0',
                    textAlign: 'left'
                  }}>
                    <p style={{ fontSize: '0.95rem', lineHeight: '1.6', color: '#334155', marginBottom: '1rem', whiteSpace: 'pre-line' }}>
                      {v.caption}
                    </p>
                    {v.regionLabel && (
                      <span style={{ 
                        display: 'inline-block', 
                        padding: '0.25rem 0.75rem', 
                        background: '#F1F5F9', 
                        borderRadius: '1rem', 
                        fontSize: '0.75rem', 
                        color: '#64748B',
                        marginBottom: '0.75rem'
                      }}>
                        {v.regionLabel}
                      </span>
                    )}
                    <button 
                      onClick={() => copyCaption(v.caption, i)}
                      style={{ 
                        width: '100%', 
                        padding: '0.75rem', 
                        background: copiedIndex === i ? '#10B981' : '#6366F1', 
                        color: 'white', 
                        border: 'none', 
                        borderRadius: '0.5rem', 
                        cursor: 'pointer',
                        fontSize: '0.9rem',
                        fontWeight: '500'
                      }}
                    >
                      {copiedIndex === i ? '✓ Copied!' : 'Copy Caption'}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Why Section */}
        <section style={{ maxWidth: '900px', margin: '2rem auto', padding: '0 1rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', textAlign: 'center' }}>
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '0.5rem', color: '#1E293B' }}>Belonging</h3>
              <p style={{ fontSize: '0.9rem', color: '#64748B' }}>Captions that sound like you, not the algorithm.</p>
            </div>
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '0.5rem', color: '#1E293B' }}>Speed</h3>
              <p style={{ fontSize: '0.9rem', color: '#64748B' }}>3 emotional captions in 3 seconds.</p>
            </div>
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '0.5rem', color: '#1E293B' }}>Psychology</h3>
              <p style={{ fontSize: '0.9rem', color: '#64748B' }}>Built on mood science, not templates.</p>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer style={{ borderTop: '1px solid #E2E8F0', marginTop: '4rem', padding: '2rem 1rem', textAlign: 'center', color: '#94A3B8', fontSize: '0.85rem' }}>
          <p>FunCaption © 2025 — Made for creators</p>
        </footer>
      </div>
    </>
  )
}
