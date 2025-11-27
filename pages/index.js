import { useState } from 'react'
import Head from 'next/head'

const moodOptions = [
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

const IG_FOOTER = \n\n📷 Follow: @funcaption.in — https://instagram.com/funcaption.in

export default function Home() {
  const [subject, setSubject] = useState('')
  const [mood, setMood] = useState('attitude')
  const [region, setRegion] = useState('none')
  const [loading, setLoading] = useState(false)
  const [variants, setVariants] = useState([])
  const [copiedIndex, setCopiedIndex] = useState(null)

  const ensureIgFooter = (text) => {
    if (!text) return IG_FOOTER.trim()
    if (text.includes('@funcaption.in') || text.includes('instagram.com/funcaption.in')) return text
    return ${text}${IG_FOOTER}
  }

  const handleGenerate = async (e) => {
    e?.preventDefault()
    if (!subject?.trim()) return alert('Add a subject to generate a caption.')
    setLoading(true)
    setVariants([])

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subject, mood, region, variants: 3 })
      })
      const data = await res.json()
      if (!res.ok) {
        console.error('LLM error', data)
        alert('Generation failed. Try again.')
        setLoading(false)
        return
      }

      // Accept both formats: array of strings OR array of objects { caption, regionLabel }
      let output = []
      if (Array.isArray(data.variants)) {
        output = data.variants.map(v => {
          if (typeof v === 'string') return { caption: ensureIgFooter(v) }
          if (v?.caption) return { ...v, caption: ensureIgFooter(v.caption) }
          return { caption: ensureIgFooter(String(v)) }
        })
      } else if (data.variant) {
        // single variant fallback
        const v = data.variant
        output = [{ caption: ensureIgFooter(typeof v === 'string' ? v : JSON.stringify(v)) }]
      } else {
        output = [{ caption: ensureIgFooter('No caption returned. Try again.') }]
      }

      setVariants(output)
    } catch (err) {
      console.error(err)
      alert('Something went wrong. Check console.')
    } finally {
      setLoading(false)
    }
  }

  const copyCaption = (text, index) => {
    const txt = text + '\n' // ensure newline
    navigator.clipboard.writeText(txt)
    setCopiedIndex(index)
    setTimeout(() => setCopiedIndex(null), 1400)
  }

  return (
    <>
      <Head>
        <title>FunCaption — Hack Instagram Algorithm</title>
        <meta name="description" content="FunCaption creates algorithm-boosted Instagram captions. Choose mood + regional vibe, generate captions with hashtags and IG footer." />
      </Head>

      <div style={{
        minHeight: '100vh',
        background: '#07080a',
        color: 'white',
        fontFamily: 'Inter, sans-serif'
      }}>
        {/* HERO */}
        <section style={{
          background: 'linear-gradient(135deg, #0a0e27 0%, #16213e 100%)',
          padding: '3.5rem 1.25rem',
          borderBottom: '2px solid rgba(0,255,255,0.06)'
        }}>
          <div style={{ maxWidth: '980px', margin: '0 auto', textAlign: 'center' }}>
            <div style={{
              fontSize: '2rem', fontWeight: 900, marginBottom: '2rem',
              textShadow: '0 0 20px rgba(0,255,255,0.15)', color: '#00ffff'
            }}>
              FunCaption
            </div>

            <div style={{ marginBottom: '2rem', lineHeight: 1.9 }}>
              <p style={{ fontSize: '1.15rem', color: '#bdbdbd', marginBottom: '0.6rem' }}>
                Do you really think you work hard for your content?
              </p>
              <p style={{ fontSize: '1.15rem', color: '#bdbdbd', marginBottom: '0.6rem' }}>
                Do you really think people see your content when you post it?
              </p>
              <p style={{ fontSize: '1.15rem', color: '#bdbdbd', marginBottom: '1.2rem' }}>
                Do you think you're even capable for this game?
              </p>
            </div>

            <div style={{
              background: 'linear-gradient(135deg, rgba(138,43,226,0.07), rgba(0,255,255,0.04))',
              padding: '1.6rem',
              borderRadius: '0.9rem',
              border: '1px solid rgba(0,255,255,0.08)',
              display: 'inline-block',
              maxWidth: '780px'
            }}>
              <p style={{ fontSize: '1.25rem', fontWeight: 700, color: '#00ffff', marginBottom: '0.6rem' }}>
                Yes — we think you are. That's why you and us are here.
                <br />
                Because the world makes us feel the same way.
              </p>

              <p style={{ color: '#c3c3c3', marginBottom: '0.5rem' }}>
                By using this, people will NOT magically start to see you.
              </p>

              <p style={{
                fontSize: '1.6rem', fontWeight: 900,
                background: 'linear-gradient(135deg, #00ffff, #8a2be2)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                marginBottom: '0.5rem'
              }}>
                But Instagram's algorithm WILL start working for you.
              </p>

              <p style={{ color: '#ffd966', fontStyle: 'italic' }}>
                Share this with your regional creators — let all brothers rise together.
              </p>
            </div>
          </div>
        </section>

        {/* SECTION 2: GENERATOR - with background + logo */}
        <section
          style={{
            padding: '4rem 1.5rem',
            background: '#000',
            backgroundImage: "url('/generator-bg.png')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
          }}
        >
          <div style={{ maxWidth: '880px', margin: '0 auto' }}>
            <h2 style={{
              fontSize: '2.2rem', fontWeight: 900, textAlign: 'center', marginBottom: '2rem',
              background: 'linear-gradient(135deg, #00ffff, #8a2be2)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
            }}>
              Generate captions to hack Instagram's algorithm
            </h2>

            <div style={{
              background: 'rgba(0,0,0,0.5)',
              padding: '2rem',
              borderRadius: '1.25rem',
              border: '2px solid rgba(138,43,226,0.35)',
              boxShadow: '0 10px 60px rgba(0,0,0,0.6)'
            }}>
              {/* Logo */}
              <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                <img
                  src="/funcaption-logo.png"
                  alt="FunCaption"
                  style={{
                    width: 110, height: 110, objectFit: 'contain',
                    filter: 'drop-shadow(0 0 22px rgba(0,255,255,0.12))'
                  }}
                />
              </div>

              <form onSubmit={handleGenerate} style={{ display: 'flex', flexDirection: 'column', gap: '1.6rem' }}>
                {/* Subject */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#00ffff', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                    Subject
                  </label>
                  <input
                    type="text"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="What's your post about?"
                    style={{
                      width: '100%', padding: '0.95rem', background: 'rgba(0,0,0,0.6)',
                      border: '2px solid rgba(0,255,255,0.14)', borderRadius: '0.6rem', color: 'white', fontSize: '0.98rem', outline: 'none'
                    }}
                    required
                  />
                </div>

                {/* Mood */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#00ffff', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                    Mood
                  </label>
                  <select
                    value={mood}
                    onChange={(e) => setMood(e.target.value)}
                    style={{ width: '100%', padding: '0.95rem', background: 'rgba(0,0,0,0.6)', border: '2px solid rgba(0,255,255,0.14)', borderRadius: '0.6rem', color: 'white', fontSize: '0.98rem', outline: 'none', cursor: 'pointer' }}
                  >
                    {moodOptions.map(m => (
                      <option key={m.id} value={m.id} style={{ background: '#0a0e27' }}>
                        {m.label} — {m.punch}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Region */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#00ffff', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                    Regional Vibe
                  </label>
                  <select
                    value={region}
                    onChange={(e) => setRegion(e.target.value)}
                    style={{ width: '100%', padding: '0.95rem', background: 'rgba(0,0,0,0.6)', border: '2px solid rgba(138,43,226,0.24)', borderRadius: '0.6rem', color: 'white', fontSize: '0.98rem', outline: 'none', cursor: 'pointer' }}
                  >
                    {regions.map(r => (
                      <option key={r.id} value={r.id} style={{ background: '#0a0e27' }}>{r.label}</option>
                    ))}
                  </select>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    width: '100%', padding: '1rem',
                    background: loading ? 'rgba(138,43,226,0.5)' : 'linear-gradient(135deg,#8a2be2,#00ffff)',
                    color: 'white', border: 'none', borderRadius: '0.6rem', fontSize: '1.05rem', fontWeight: 800, cursor: loading ? 'not-allowed' : 'pointer', textTransform: 'uppercase', letterSpacing: '0.06em', boxShadow: loading ? 'none' : '0 10px 30px rgba(138,43,226,0.25)'
                  }}
                >
                  {loading ? '⚡ GENERATING...' : '🚀 GENERATE'}
                </button>
              </form>

              {/* Results */}
              {variants.length > 0 && (
                <div style={{ marginTop: '1.75rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {variants.map((v, i) => (
                    <div key={i} style={{ background: 'rgba(0,0,0,0.55)', padding: '1.4rem', borderRadius: '0.9rem', border: '1px solid rgba(0,255,255,0.08)' }}>
                      <div style={{ fontSize: '0.72rem', color: '#00ffff', marginBottom: '0.6rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                        📝 Caption {i + 1}
                      </div>

                      <p style={{ fontSize: '1rem', lineHeight: 1.7, color: '#e6e6e6', marginBottom: '1rem', whiteSpace: 'pre-line' }}>
                        {v.caption}
                      </p>

                      {v.regionLabel && (
                        <div style={{ display: 'inline-block', padding: '0.3rem 0.85rem', background: 'rgba(138,43,226,0.18)', border: '1px solid rgba(138,43,226,0.28)', borderRadius: '1.5rem', color: '#00ffff', fontWeight: 800, marginBottom: '0.8rem', fontSize: '0.78rem' }}>
                          🌍 {v.regionLabel}
                        </div>
                      )}

                      <button
                        onClick={() => copyCaption(v.caption, i)}
                        style={{
                          width: '100%', padding: '0.9rem', marginTop: '0.6rem',
                          background: copiedIndex === i ? 'linear-gradient(135deg,#00ff88,#00aa66)' : 'linear-gradient(135deg,#8a2be2,#00ffff)',
                          color: 'white', border: 'none', borderRadius: '0.6rem', fontSize: '0.95rem', fontWeight: 800, cursor: 'pointer'
                        }}
                      >
                        {copiedIndex === i ? '✓ COPIED' : '📋 COPY CAPTION'}
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>

        {/* FOOTER */}
        <footer style={{ background: '#060617', borderTop: '1px solid rgba(0,255,255,0.04)', padding: '1.5rem', textAlign: 'center', color: '#8f8f8f' }}>
          <div>FunCaption © {new Date().getFullYear()} — Built for creators who refuse to stay invisible 🔥</div>
        </footer>
      </div>
    </>
  )
}
