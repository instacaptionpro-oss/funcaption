import { useState } from 'react'
import Head from 'next/head'

const InstagramIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
    <path d="M8 0C5.829 0 5.556.01 4.703.048 3.85.088 3.269.222 2.76.42a3.917 3.917 0 0 0-1.417.923A3.927 3.927 0 0 0 .42 2.76C.222 3.268.087 3.85.048 4.7.01 5.555 0 5.827 0 8.001c0 2.172.01 2.444.048 3.297.04.852.174 1.433.372 1.942.205.526.478.972.923 1.417.444.445.89.719 1.416.923.51.198 1.09.333 1.942.372C5.555 15.99 5.827 16 8 16s2.444-.01 3.298-.048c.851-.04 1.434-.174 1.943-.372a3.916 3.916 0 0 0 1.416-.923c.445-.445.718-.891.923-1.417.197-.509.332-1.09.372-1.942C15.99 10.445 16 10.173 16 8s-.01-2.445-.048-3.299c-.04-.851-.175-1.433-.372-1.941a3.926 3.926 0 0 0-.923-1.417A3.911 3.911 0 0 0 13.24.42c-.51-.198-1.092-.333-1.943-.372C10.443.01 10.172 0 7.998 0h.003zm-.717 1.442h.718c2.136 0 2.389.007 3.232.046.78.035 1.204.166 1.486.275.373.145.64.319.92.599.28.28.453.546.598.92.11.281.24.705.275 1.485.039.843.047 1.096.047 3.231s-.008 2.389-.047 3.232c-.035.78-.166 1.203-.275 1.485a2.47 2.47 0 0 1-.599.919c-.28.28-.546.453-.92.598-.28.11-.704.24-1.485.276-.843.038-1.096.047-3.232.047s-2.39-.009-3.233-.047c-.78-.036-1.203-.166-1.485-.276a2.478 2.478 0 0 1-.92-.598 2.48 2.48 0 0 1-.6-.92c-.109-.281-.24-.705-.275-1.485-.038-.843-.046-1.096-.046-3.233 0-2.136.008-2.388.046-3.231.036-.78.166-1.204.276-1.486.145-.373.319-.64.599-.92.28-.28.546-.453.92-.598.282-.11.705-.24 1.485-.276.738-.034 1.024-.044 2.515-.045v.002zm4.988 1.328a.96.96 0 1 0 0 1.92.96.96 0 0 0 0-1.92zm-4.27 1.122a4.109 4.109 0 1 0 0 8.217 4.109 4.109 0 0 0 0-8.217zm0 1.441a2.667 2.667 0 1 1 0 5.334 2.667 2.667 0 0 1 0-5.334z"/>
  </svg>
);

const Logo = () => (
  <div style={{ position: 'absolute', top: '20px', left: '20px', zIndex: 20 }}>
    {/* Same SVG logo as before */}
    {/* ...keep your existing SVG exactly as it is... */}
  </div>
);

// Only regions here – moods are in the select directly
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
];

export default function Home() {
  const [subject, setSubject] = useState('');
  const [mood, setMood] = useState('attitude');
  const [region, setRegion] = useState('none');
  const [loading, setLoading] = useState(false);
  const [variants, setVariants] = useState([]);
  const [copiedIndex, setCopiedIndex] = useState(null);

  const handleGenerate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setVariants([]);

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subject, mood, region })
      });

      const data = await response.json();
      if (response.ok) {
        setVariants(data.variants || []);
      } else {
        setVariants(data.variants || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const copyCaption = (text, index) => {
    try {
      navigator.clipboard.writeText(text);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch (e) {
      console.error('Copy failed', e);
    }
  };

  return (
    <>
      <Head>
        <title>FunCaption – Futuristic Caption Generator</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      {/* ROOT FUTURISTIC BACKGROUND */}
      <div
        style={{
          minHeight: '100vh',
          color: 'white',
          fontFamily: 'Inter, system-ui, -apple-system, BlinkMacSystemFont, sans-serif',
          position: 'relative',
          overflow: 'hidden',
          backgroundColor: '#020617',
          backgroundImage: `
            radial-gradient(circle at 0% 0%, rgba(56,189,248,0.35), transparent 60%),
            radial-gradient(circle at 100% 0%, rgba(168,85,247,0.35), transparent 60%),
            radial-gradient(circle at 50% 100%, rgba(56,189,248,0.18), transparent 55%),
            repeating-linear-gradient(
              0deg,
              rgba(148,163,184,0.18) 0px,
              rgba(148,163,184,0.18) 1px,
              transparent 1px,
              transparent 32px
            ),
            repeating-linear-gradient(
              90deg,
              rgba(148,163,184,0.18) 0px,
              rgba(148,163,184,0.18) 1px,
              transparent 1px,
              transparent 32px
            )
          `,
          backgroundSize: 'cover',
          backgroundAttachment: 'fixed'
        }}
      >
        {/* Glow discs / hologram platforms */}
        <div
          style={{
            position: 'absolute',
            inset: '0',
            pointerEvents: 'none',
            opacity: 0.35
          }}
        >
          <div
            style={{
              position: 'absolute',
              left: '10%',
              bottom: '8%',
              width: '260px',
              height: '260px',
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(56,189,248,0.4), transparent 60%)',
              filter: 'blur(6px)'
            }}
          />
          <div
            style={{
              position: 'absolute',
              right: '12%',
              bottom: '4%',
              width: '320px',
              height: '320px',
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(168,85,247,0.5), transparent 60%)',
              filter: 'blur(10px)'
            }}
          />
          <div
            style={{
              position: 'absolute',
              left: '50%',
              top: '12%',
              transform: 'translateX(-50%)',
              width: '420px',
              height: '420px',
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(15,23,42,0.1), transparent 70%)',
              border: '1px solid rgba(148,163,184,0.2)',
              boxShadow: '0 0 60px rgba(56,189,248,0.15)'
            }}
          />
        </div>

        <Logo />

        {/* SECTION 1: HERO / STORY */}
        <section
          style={{
            padding: '5rem 1.5rem 3rem',
            position: 'relative',
            zIndex: 5
          }}
        >
          <div
            style={{
              maxWidth: '960px',
              margin: '0 auto',
              textAlign: 'center',
              paddingTop: '40px'
            }}
          >
            {/* Title / Tagline card */}
            <div
              style={{
                marginBottom: '3rem',
                padding: '1.5rem 1.75rem',
                borderRadius: '1.25rem',
                border: '1px solid rgba(148,163,184,0.4)',
                background:
                  'radial-gradient(circle at top, rgba(56,189,248,0.28), rgba(15,23,42,0.96))',
                boxShadow:
                  '0 0 40px rgba(15,23,42,0.9), 0 0 60px rgba(56,189,248,0.25)'
              }}
            >
              <div
                style={{
                  fontSize: '2.8rem',
                  fontWeight: 900,
                  marginBottom: '0.5rem',
                  backgroundImage:
                    'linear-gradient(135deg, #22d3ee, #a855f7, #f97316)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  textShadow: '0 0 24px rgba(56,189,248,0.45)'
                }}
              >
                Funcaption
              </div>
              <div
                style={{
                  fontSize: '1rem',
                  color: '#e5e7eb',
                  fontWeight: 600,
                  letterSpacing: '0.25em',
                  textTransform: 'uppercase'
                }}
              >
                Instagram Algorithm Hacking Lab
              </div>

              {/* Instagram Link */}
              <div style={{ marginTop: '1.25rem' }}>
                <a
                  href="https://www.instagram.com/instaalgohacker?igsh=MW1maXl2a3IxNm40OA=="
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    color: '#0f172a',
                    textDecoration: 'none',
                    fontSize: '0.9rem',
                    fontWeight: 700,
                    padding: '0.6rem 1.2rem',
                    borderRadius: '999px',
                    background:
                      'linear-gradient(135deg, #22d3ee, #a855f7)',
                    boxShadow: '0 0 25px rgba(56,189,248,0.5)'
                  }}
                >
                  <InstagramIcon />
                  Follow @instaalgohacker
                </a>
              </div>
            </div>

            {/* Questions */}
            <div
              style={{
                marginBottom: '3rem',
                lineHeight: 2,
                color: '#9ca3af',
                fontSize: '1.02rem'
              }}
            >
              <p style={{ marginBottom: '0.75rem' }}>
                Do you really think you work hard for your content?
              </p>
              <p style={{ marginBottom: '0.75rem' }}>
                Do you really think people see your content when you post it?
              </p>
              <p style={{ marginBottom: '0.75rem' }}>
                Do you think you're even capable for this game?
              </p>
            </div>

            {/* Answer / Story card */}
            <div
              style={{
                background:
                  'radial-gradient(circle at top, rgba(59,130,246,0.4), rgba(15,23,42,0.96))',
                padding: '2.5rem',
                borderRadius: '1.5rem',
                border: '1px solid rgba(129,140,248,0.4)',
                boxShadow:
                  '0 0 60px rgba(37,99,235,0.45), 0 0 120px rgba(56,189,248,0.25)'
              }}
            >
              <p
                style={{
                  fontSize: '1.4rem',
                  fontWeight: 700,
                  color: '#e0f2fe',
                  marginBottom: '1.5rem',
                  lineHeight: 1.6
                }}
              >
                Yes — we think you are. That&apos;s why you and us are here.
                <br />
                Because the world makes us feel the same way.
              </p>

              <p
                style={{
                  fontSize: '1rem',
                  color: '#cbd5f5',
                  marginBottom: '1rem'
                }}
              >
                Using this tool won&apos;t magically make people respect you
                overnight.
              </p>

              <p
                style={{
                  fontSize: '1.9rem',
                  fontWeight: 900,
                  background:
                    'linear-gradient(135deg, #22d3ee, #a855f7, #f97316)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  marginBottom: '1rem',
                  textShadow: '0 0 28px rgba(56,189,248,0.6)'
                }}
              >
                But Instagram&apos;s algorithm will finally start fighting on
                your side.
              </p>

              <p
                style={{
                  fontSize: '0.95rem',
                  color: '#fbbf24',
                  fontStyle: 'italic'
                }}
              >
                Share this with creators from your region — let the whole crew
                rise together.
              </p>
            </div>
          </div>
        </section>

        {/* SECTION 2: GENERATOR */}
        <section
          style={{
            padding: '3rem 1.5rem 4rem',
            position: 'relative',
            zIndex: 6
          }}
        >
          <div style={{ maxWidth: '960px', margin: '0 auto' }}>
            <h2
              style={{
                fontSize: '2.4rem',
                fontWeight: 900,
                textAlign: 'center',
                marginBottom: '2.5rem',
                background:
                  'linear-gradient(135deg, #22d3ee, #a855f7, #f97316)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                textShadow: '0 0 24px rgba(56,189,248,0.6)'
              }}
            >
              Generate captions to hack Instagram&apos;s algorithm
            </h2>

            <div
              style={{
                position: 'relative',
                borderRadius: '1.75rem',
                padding: '2px',
                background:
                  'linear-gradient(135deg, rgba(56,189,248,0.7), rgba(129,140,248,0.4), rgba(244,114,182,0.5))',
                boxShadow:
                  '0 0 70px rgba(56,189,248,0.4), 0 0 120px rgba(88,28,135,0.6)'
              }}
            >
              <div
                style={{
                  background:
                    'radial-gradient(circle at top, rgba(15,23,42,0.98), rgba(2,6,23,0.98))',
                  borderRadius: '1.6rem',
                  padding: '2.5rem',
                  border: '1px solid rgba(15,23,42,1)'
                }}
              >
                {/* FORM */}
                <form
                  onSubmit={handleGenerate}
                  style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}
                >
                  {/* Subject */}
                  <div>
                    <label
                      style={{
                        display: 'block',
                        fontSize: '0.85rem',
                        fontWeight: 700,
                        color: '#38bdf8',
                        marginBottom: '0.6rem',
                        textTransform: 'uppercase',
                        letterSpacing: '0.16em'
                      }}
                    >
                      Subject
                    </label>
                    <input
                      type="text"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      placeholder="Gym vlog, breakup reel, travel montage..."
                      style={{
                        width: '100%',
                        padding: '0.9rem 1rem',
                        background:
                          'linear-gradient(135deg, rgba(15,23,42,0.95), rgba(15,23,42,0.95))',
                        border: '1px solid rgba(148,163,184,0.7)',
                        borderRadius: '0.75rem',
                        color: '#e5e7eb',
                        fontSize: '0.98rem',
                        outline: 'none',
                        boxShadow: '0 0 18px rgba(15,23,42,0.9)'
                      }}
                      required
                    />
                  </div>

                  {/* Mood */}
                  <div>
                    <label
                      style={{
                        display: 'block',
                        fontSize: '0.85rem',
                        fontWeight: 700,
                        color: '#38bdf8',
                        marginBottom: '0.6rem',
                        textTransform: 'uppercase',
                        letterSpacing: '0.16em'
                      }}
                    >
                      Mood
                    </label>
                    <select
                      value={mood}
                      onChange={(e) => setMood(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '0.9rem 1rem',
                        background:
                          'linear-gradient(135deg, rgba(15,23,42,0.95), rgba(15,23,42,0.95))',
                        border: '1px solid rgba(148,163,184,0.7)',
                        borderRadius: '0.75rem',
                        color: '#e5e7eb',
                        fontSize: '0.98rem',
                        outline: 'none',
                        cursor: 'pointer'
                      }}
                    >
                      {[
                        { id: 'attitude', label: 'Attitude', punch: 'Iron heals what people break.' },
                        { id: 'motivation', label: 'Motivation', punch: 'The grind is lonely but legends are born here.' },
                        { id: 'love', label: 'Love', punch: 'Some feelings rewrite the heart, silently.' },
                        { id: 'breakup', label: 'Breakup', punch: 'I lost them, but I found myself — and that\'s the win.' },
                        { id: 'gym', label: 'Gym', punch: 'Iron heals what people break.' },
                        { id: 'travel', label: 'Travel', punch: 'Some roads fix parts of you you never speak about.' },
                        { id: 'cute', label: 'Cute', punch: 'Soft heart, sharp mind — rare combination.' },
                        { id: 'savage', label: 'Savage', punch: 'If I cared, you\'d know. I don\'t.' },
                        { id: 'aesthetic', label: 'Aesthetic', punch: 'Some things look better when you stop chasing.' },
                        { id: 'sad', label: 'Sad', punch: 'I smile… but rarely at the same things now.' },
                        { id: 'happy', label: 'Happy', punch: 'Little moments make big lives.' },
                        { id: 'alone', label: 'Alone', punch: 'Silence teaches louder than people.' },
                        { id: 'boss', label: 'Boss', punch: 'Money talks, but discipline screams.' },
                        { id: 'genz', label: 'GenZ', punch: 'Chaotic but still iconic.' },
                        { id: 'calm', label: 'Calm', punch: 'Peace looks good on me.' }
                      ].map((m) => (
                        <option key={m.id} value={m.id} style={{ background: '#020617' }}>
                          {m.label} — {m.punch}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Regional Vibe */}
                  <div>
                    <label
                      style={{
                        display: 'block',
                        fontSize: '0.85rem',
                        fontWeight: 700,
                        color: '#38bdf8',
                        marginBottom: '0.6rem',
                        textTransform: 'uppercase',
                        letterSpacing: '0.16em'
                      }}
                    >
                      Regional vibe
                    </label>
                    <select
                      value={region}
                      onChange={(e) => setRegion(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '0.9rem 1rem',
                        background:
                          'linear-gradient(135deg, rgba(15,23,42,0.95), rgba(15,23,42,0.95))',
                        border: '1px solid rgba(129,140,248,0.8)',
                        borderRadius: '0.75rem',
                        color: '#e5e7eb',
                        fontSize: '0.98rem',
                        outline: 'none',
                        cursor: 'pointer'
                      }}
                    >
                      {regions.map((r) => (
                        <option key={r.id} value={r.id} style={{ background: '#020617' }}>
                          {r.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Generate button */}
                  <button
                    type="submit"
                    disabled={loading}
                    style={{
                      width: '100%',
                      padding: '1.1rem',
                      marginTop: '0.5rem',
                      background: loading
                        ? 'linear-gradient(135deg, #1e293b, #0f172a)'
                        : 'linear-gradient(135deg, #22d3ee, #a855f7, #f97316)',
                      color: '#020617',
                      border: 'none',
                      borderRadius: '999px',
                      fontSize: '1rem',
                      fontWeight: 800,
                      cursor: loading ? 'not-allowed' : 'pointer',
                      letterSpacing: '0.18em',
                      textTransform: 'uppercase',
                      boxShadow: loading
                        ? 'none'
                        : '0 16px 40px rgba(15,23,42,0.9), 0 0 40px rgba(56,189,248,0.6)',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    {loading ? '⚡ GENERATING...' : '🚀 FIRE THE ALGORITHM'}
                  </button>
                </form>

                {/* RESULTS */}
                {variants.length > 0 && (
                  <div
                    style={{
                      marginTop: '3rem',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '1.5rem'
                    }}
                  >
                    {variants.map((v, i) => {
                      const processedCaption = (v.caption || '').replace(
                        /\n\nHelp please make us a favour follow us on Instagram.*$/s,
                        ''
                      );
                      const instagramLink =
                        (v.caption &&
                          v.caption.match(/https:\/\/www\.instagram\.com\/[^\s]+/)?.[0]) ||
                        'https://www.instagram.com/instaalgohacker?igsh=MW1maXl2a3IxNm40OA==';

                      const isPremium = i === 0;

                      if (isPremium) {
                        // PREMIUM CARD
                        return (
                          <div key={i} style={{ position: 'relative' }}>
                            <div
                              style={{
                                position: 'absolute',
                                inset: 0,
                                borderRadius: '1.25rem',
                                padding: '2px',
                                background:
                                  'conic-gradient(from 120deg, rgba(34,211,238,0.2), rgba(168,85,247,0.4), rgba(244,114,182,0.25), rgba(34,211,238,0.2))',
                                filter: 'blur(8px)',
                                opacity: 0.9,
                                zIndex: 0
                              }}
                            />
                            <div
                              style={{
                                position: 'relative',
                                zIndex: 1,
                                background:
                                  'radial-gradient(circle at top, rgba(15,23,42,0.96), rgba(15,23,42,0.98))',
                                padding: '2rem',
                                borderRadius: '1.25rem',
                                border: '1px solid rgba(148,163,184,0.7)',
                                boxShadow:
                                  '0 18px 60px rgba(15,23,42,0.95), 0 0 60px rgba(56,189,248,0.5)'
                              }}
                            >
                              <div
                                style={{
                                  display: 'flex',
                                  justifyContent: 'space-between',
                                  alignItems: 'center',
                                  marginBottom: '1rem'
                                }}
                              >
                                <div
                                  style={{
                                    fontSize: '0.75rem',
                                    fontWeight: 800,
                                    letterSpacing: '0.2em',
                                    textTransform: 'uppercase',
                                    color: '#38bdf8'
                                  }}
                                >
                                  ⚡ Premium Caption
                                </div>
                                <div
                                  style={{
                                    padding: '0.25rem 0.65rem',
                                    borderRadius: '999px',
                                    background:
                                      'linear-gradient(135deg, rgba(34,197,235,0.3), rgba(168,85,247,0.3))',
                                    fontSize: '0.7rem',
                                    fontWeight: 700,
                                    letterSpacing: '0.12em',
                                    textTransform: 'uppercase',
                                    color: '#e5e7eb'
                                  }}
                                >
                                  AI Engine: Llama 3.2
                                </div>
                              </div>

                              <p
                                style={{
                                  fontSize: '1.02rem',
                                  color: '#e5e7eb',
                                  lineHeight: 1.9,
                                  whiteSpace: 'pre-line',
                                  marginBottom: '1.25rem'
                                }}
                              >
                                {processedCaption}
                              </p>

                              {v.regionLabel && (
                                <div
                                  style={{
                                    display: 'inline-block',
                                    padding: '0.35rem 0.9rem',
                                    borderRadius: '999px',
                                    border: '1px solid rgba(129,140,248,0.8)',
                                    background:
                                      'linear-gradient(90deg, rgba(15,23,42,0.9), rgba(30,64,175,0.6))',
                                    color: '#bfdbfe',
                                    fontSize: '0.76rem',
                                    fontWeight: 700,
                                    marginBottom: '1rem'
                                  }}
                                >
                                  🌍 {v.regionLabel}
                                </div>
                              )}

                              <div
                                style={{
                                  display: 'flex',
                                  justifyContent: 'space-between',
                                  alignItems: 'center',
                                  gap: '0.75rem',
                                  marginBottom: '1rem'
                                }}
                              >
                                <a
                                  href={instagramLink}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '0.5rem',
                                    padding: '0.55rem 1rem',
                                    borderRadius: '999px',
                                    background:
                                      'linear-gradient(135deg, #22d3ee, #a855f7)',
                                    color: '#020617',
                                    fontWeight: 700,
                                    fontSize: '0.9rem',
                                    textDecoration: 'none',
                                    boxShadow: '0 10px 30px rgba(15,23,42,0.9)'
                                  }}
                                >
                                  <InstagramIcon />
                                  Follow for more hooks
                                </a>
                                <span
                                  style={{
                                    fontSize: '0.75rem',
                                    color: '#9ca3af'
                                  }}
                                >
                                  Save this before posting your reel.
                                </span>
                              </div>

                              <button
                                onClick={() => copyCaption(v.caption, i)}
                                style={{
                                  width: '100%',
                                  padding: '0.95rem',
                                  borderRadius: '0.75rem',
                                  border: 'none',
                                  fontSize: '0.95rem',
                                  fontWeight: 700,
                                  cursor: 'pointer',
                                  color: '#020617',
                                  background: copiedIndex === i
                                    ? 'linear-gradient(135deg, #22c55e, #16a34a)'
                                    : 'linear-gradient(135deg, #22d3ee, #a855f7)',
                                  boxShadow:
                                    '0 16px 40px rgba(15,23,42,0.9), 0 0 30px rgba(56,189,248,0.6)',
                                  transition: 'all 0.2s'
                                }}
                              >
                                {copiedIndex === i
                                  ? '✓ COPIED PREMIUM CAPTION'
                                  : '📋 COPY PREMIUM CAPTION'}
                              </button>
                            </div>
                          </div>
                        );
                      }

                      // FREE CAPTIONS
                      return (
                        <div
                          key={i}
                          style={{
                            background:
                              'radial-gradient(circle at top, rgba(15,23,42,0.98), rgba(2,6,23,0.98))',
                            padding: '1.75rem',
                            borderRadius: '1rem',
                            border: '1px solid rgba(31,41,55,0.9)',
                            boxShadow: '0 10px 32px rgba(15,23,42,0.85)'
                          }}
                        >
                          <div
                            style={{
                              fontSize: '0.78rem',
                              color: '#38bdf8',
                              marginBottom: '0.85rem',
                              fontWeight: 700,
                              textTransform: 'uppercase',
                              letterSpacing: '0.14em'
                            }}
                          >
                            📝 Caption {i + 1}
                          </div>

                          <p
                            style={{
                              fontSize: '0.98rem',
                              lineHeight: 1.8,
                              color: '#e5e7eb',
                              marginBottom: '1rem',
                              whiteSpace: 'pre-line'
                            }}
                          >
                            {processedCaption}
                          </p>

                          {v.regionLabel && (
                            <div
                              style={{
                                display: 'inline-block',
                                padding: '0.35rem 0.9rem',
                                background: 'rgba(30,64,175,0.5)',
                                border: '1px solid rgba(129,140,248,0.7)',
                                borderRadius: '999px',
                                fontSize: '0.75rem',
                                color: '#bfdbfe',
                                marginBottom: '1rem',
                                fontWeight: 700
                              }}
                            >
                              🌍 {v.regionLabel}
                            </div>
                          )}

                          <button
                            onClick={() => copyCaption(v.caption, i)}
                            style={{
                              width: '100%',
                              padding: '0.9rem',
                              background: copiedIndex === i
                                ? 'linear-gradient(135deg, #22c55e, #16a34a)'
                                : 'linear-gradient(135deg, #22d3ee, #a855f7)',
                              color: '#020617',
                              border: 'none',
                              borderRadius: '0.6rem',
                              fontSize: '0.9rem',
                              fontWeight: 700,
                              cursor: 'pointer',
                              boxShadow: '0 12px 30px rgba(15,23,42,0.9)',
                              transition: 'all 0.2s'
                            }}
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
          </div>
        </section>

        {/* FOOTER */}
        <footer
          style={{
            borderTop: '1px solid rgba(30,64,175,0.6)',
            padding: '1.75rem 1.5rem',
            textAlign: 'center',
            color: '#9ca3af',
            fontSize: '0.85rem',
            background:
              'linear-gradient(to top, rgba(15,23,42,0.98), rgba(15,23,42,0.8))',
            position: 'relative',
            zIndex: 6
          }}
        >
          <div style={{ marginBottom: '0.75rem' }}>
            <a
              href="https://www.instagram.com/instaalgohacker?igsh=MW1maXl2a3IxNm40OA=="
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                color: '#e5e7eb',
                textDecoration: 'none',
                fontWeight: 600
              }}
            >
              <InstagramIcon />
              Follow @instaalgohacker for more hooks
            </a>
          </div>
          <p>FunCaption © 2025 — Engineered for creators who refuse to stay invisible 🔥</p>
        </footer>
      </div>
    </>
  );
}
