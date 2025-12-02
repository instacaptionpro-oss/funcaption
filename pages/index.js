import { useState } from 'react';
import Head from 'next/head';

const InstagramIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
    <path d="M8 0C5.829 0 5.556.01 4.703.048 3.85.088 3.269.222 2.76.42a3.917 3.917 0 0 0-1.417.923A3.927 3.927 0 0 0 .42 2.76C.222 3.268.087 3.85.048 4.7.01 5.555 0 5.827 0 8.001c0 2.172.01 2.444.48 3.297.04.852.17 1.433.37 1.942.2.526.48.972.92 1.417.44.445.89.719 1.41.923.51.198 1.09.333 1.94.372C5.555 15.99 5.827 16 8 16s2.444-.01 3.298-.048c.851-.04 1.434-.174 1.943-.372.51-.198.972-.478 1.417-.923.445-.445.719-.891.923-1.417.197-.509.332-1.09.372-1.942C15.99 10.445 16 10.173 16 8s-.01-2.445-.048-3.299c-.04-.851-.175-1.433-.372-1.941a3.926 3.926 0 0 0-.923-1.417A3.911 3.911 0 0 0 13.24.42c-.51-.198-1.092-.333-1.943-.372C10.443.01 10.172 0 7.998 0h.003zm-.717 1.442h.718c2.136 0 2.389.007 3.232.046.78.035 1.204.166 1.486.275.373.145.64.319.92.599.28.28.453.546.598.92.11.281.24.705.275 1.485.039.843.047 1.096.047 3.231s-.008 2.389-.47 3.232c-.35.780-.16.20-.476.20a2.47.2 2.47 2.47 0 0 1-.599.919c-.28.28-.546-.453-.920.598-.28.11-.704.24-1.485.276-.843.038-1.096.047-3.232.047s-2.39-.009-3.233-.047c-.78-.036-1.203-.166-1.485-.276a2.478 2.478 0 0 1-.92-.598 2.48 2.48 0 0 1-.6-.92c-.109-.281-.24-.705-.275-1.485-.038-.843-.046-1.096-.046-3.233 0-2.136.008-2.388.046-3.231.036-.78.166-1.204.276-1.486.145-.373.319-.64.599-.92.28-.28.546-.453.92-.598.282-.11.705-.24 1.485-.276.738-.034 1.024-.044 2.515-.045v.002zm4.988 1.328a.96.96 0 1 0 0 1.92.96.96 0 0 0 0-1.92zm-4.27 1.122a4.109 4.109 0 1 0 0 8.217 4.109 4.109 0 0 0 0-8.217zm0 1.441a2.667 2.667 0 1 1 0 5.334 2.667 2.667 0 0 1 0-5.334z"/>
  </svg>
);

export default function Home() {
  const [subject, setSubject] = useState('');
  const [mood, setMood] = useState('attitude');
  const [region, setRegion] = useState('none');
  const [reelInfo, setReelInfo] = useState('');
  const [suggestions, setSuggestions] = useState('');

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
        body: JSON.stringify({ subject, mood, region, reelInfo, suggestions })
      });

      const data = await response.json();
      if (response.ok) setVariants(data.variants || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const copyCaption = (text, index) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <>
      <Head>
        <title>FunCaption — Premium AI Caption Generator</title>
      </Head>

      <div style={{
        minHeight: '100vh',
        background: '#000000',
        color: '#e5e5e5',
        fontFamily: 'Inter, sans-serif',
        paddingBottom: '4rem'
      }}>

        {/* HERO SECTION */}
        <section style={{
          padding: '5rem 2rem 3rem',
          textAlign: 'center'
        }}>
          <h1 style={{
            fontSize: '3rem',
            fontWeight: '900',
            color: '#ffffff',
            marginBottom: '0.5rem',
            letterSpacing: '-1px'
          }}>
            FunCaption
          </h1>

          <div style={{
            fontSize: '1rem',
            color: '#9aa0a6',
            letterSpacing: '0.08em',
            marginBottom: '2rem'
          }}>
            Engineered for Indian creators who refuse to stay invisible.
          </div>

          <a
            href="https://www.instagram.com/instaalgohacker"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.7rem 1.4rem',
              borderRadius: '2rem',
              background: '#111',
              border: '1px solid #cfcfcf',
              color: '#fff',
              textDecoration: 'none',
              fontWeight: '600'
            }}
          >
            <InstagramIcon /> Follow us on Instagram
          </a>
        </section>

        {/* GENERATOR */}
        <section style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem' }}>

          {/* FORM CONTAINER */}
          <div style={{
            background: '#0c0c0c',
            padding: '2.2rem',
            borderRadius: '1rem',
            border: '1px solid #2a2a2a',
            marginBottom: '3rem'
          }}>
            <form onSubmit={handleGenerate} style={{ display: 'flex', flexDirection: 'column', gap: '1.8rem' }}>

              {/* SUBJECT */}
              <input
                placeholder="Subject of your reel (e.g. Gym, Travel, Love)"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                required
                style={{
                  background: '#0f0f0f',
                  padding: '1rem',
                  borderRadius: '0.5rem',
                  border: '1px solid #3a3a3a',
                  color: '#fff',
                  fontSize: '1rem'
                }}
              />

              {/* MORE ABOUT REEL */}
              <textarea
                placeholder="More about your reel… (optional, improves accuracy)"
                value={reelInfo}
                onChange={(e) => setReelInfo(e.target.value)}
                rows={3}
                style={{
                  background: '#0f0f0f',
                  padding: '1rem',
                  borderRadius: '0.5rem',
                  border: '1px solid #3a3a3a',
                  color: '#fff',
                  fontSize: '1rem'
                }}
              />

              {/* SUGGESTIONS BOX */}
              <textarea
                placeholder="Your valuable words for our improvement…"
                value={suggestions}
                onChange={(e) => setSuggestions(e.target.value)}
                rows={2}
                style={{
                  background: '#0f0f0f',
                  padding: '1rem',
                  borderRadius: '0.5rem',
                  border: '1px solid #3a3a3a',
                  color: '#fff',
                  fontSize: '1rem'
                }}
              />

              {/* MOOD */}
              <select
                value={mood}
                onChange={(e) => setMood(e.target.value)}
                style={{
                  background: '#0f0f0f',
                  padding: '1rem',
                  borderRadius: '0.5rem',
                  border: '1px solid #3a3a3a',
                  color: '#fff',
                  fontSize: '1rem'
                }}
              >
                <option value="attitude">Attitude</option>
                <option value="motivation">Motivation</option>
                <option value="love">Love</option>
                <option value="breakup">Breakup</option>
                <option value="gym">Gym</option>
                <option value="travel">Travel</option>
                <option value="cute">Cute</option>
                <option value="savage">Savage</option>
                <option value="aesthetic">Aesthetic</option>
                <option value="sad">Sad</option>
                <option value="happy">Happy</option>
                <option value="alone">Alone</option>
                <option value="boss">Boss</option>
                <option value="genz">GenZ</option>
                <option value="calm">Calm</option>
              </select>

              {/* REGION */}
              <select
                value={region}
                onChange={(e) => setRegion(e.target.value)}
                style={{
                  background: '#0f0f0f',
                  padding: '1rem',
                  borderRadius: '0.5rem',
                  border: '1px solid #3a3a3a',
                  color: '#fff',
                  fontSize: '1rem'
                }}
              >
                <option value="none">No Region</option>
                <option value="gujarati">Gujarati</option>
                <option value="marathi">Marathi</option>
                <option value="punjabi">Punjabi</option>
                <option value="hindi">Hindi</option>
                <option value="bengali">Bengali</option>
                <option value="tamil">Tamil</option>
                <option value="telugu">Telugu</option>
                <option value="kannada">Kannada</option>
                <option value="malayalam">Malayalam</option>
                <option value="bhojpuri">Bhojpuri</option>
              </select>

              {/* GENERATE BUTTON */}
              <button
                type="submit"
                style={{
                  background: '#111',
                  border: '1px solid #cfcfcf',
                  color: '#fff',
                  padding: '1rem',
                  borderRadius: '0.5rem',
                  fontSize: '1.2rem',
                  fontWeight: '700',
                  cursor: 'pointer'
                }}
              >
                {loading ? "Generating…" : "Generate"}
              </button>

            </form>
          </div>

          {/* OUTPUT */}
          {variants.length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>

              {/* PREMIUM CAPTION — FIRST VARIANT */}
              <div style={{
                background: '#0a0a0a',
                padding: '2rem',
                borderRadius: '1rem',
                border: '1px solid #5edfff',
                boxShadow: '0 0 25px rgba(94,223,255,0.25)',
                color: '#e8f8ff'
              }}>
                <div style={{
                  fontSize: '0.8rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  color: '#5edfff',
                  marginBottom: '1rem'
                }}>
                  Premium AI Caption
                </div>

                <p style={{ whiteSpace: 'pre-line', fontSize: '1.1rem' }}>
                  {variants[0].caption}
                </p>

                <button
                  onClick={() => copyCaption(variants[0].caption, 0)}
                  style={{
                    marginTop: '1rem',
                    background: '#111',
                    border: '1px solid #cfcfcf',
                    color: '#fff',
                    padding: '0.8rem 1rem',
                    borderRadius: '0.5rem',
                    cursor: 'pointer',
                    width: '100%'
                  }}
                >
                  {copiedIndex === 0 ? 'Copied!' : 'Copy'}
                </button>
              </div>

              {/* NORMAL CAPTIONS */}
              {variants.slice(1).map((v, i) => (
                <div key={i+1} style={{
                  background: '#0d0d0d',
                  padding: '2rem',
                  borderRadius: '1rem',
                  border: '1px solid #2d2d2d',
                  color: '#ddd'
                }}>
                  <div style={{
                    fontSize: '0.8rem',
                    textTransform: 'uppercase',
                    color: '#888',
                    marginBottom: '1rem'
                  }}>
                    Caption Style {i+2}
                  </div>

                  <p style={{ whiteSpace: 'pre-line', fontSize: '1.1rem' }}>
                    {v.caption}
                  </p>

                  <button
                    onClick={() => copyCaption(v.caption, i+1)}
                    style={{
                      marginTop: '1rem',
                      background: '#111',
                      border: '1px solid '#cfcfcf',
                      color: '#fff',
                      padding: '0.8rem 1rem',
                      borderRadius: '0.5rem',
                      cursor: 'pointer',
                      width: '100%'
                    }}
                  >
                    {copiedIndex === i+1 ? 'Copied!' : 'Copy'}
                  </button>
                </div>
              ))}

            </div>
          )}

        </section>
      </div>
    </>
  );
}
