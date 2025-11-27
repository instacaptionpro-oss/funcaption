import { useState } from 'react'
import Head from 'next/head'

export default function Home() {
  const [subject, setSubject] = useState('')
  const [mood, setMood] = useState('Aesthetic')
  const [regionalVibe, setRegionalVibe] = useState('None')
  const [loading, setLoading] = useState(false)
  const [captions, setCaptions] = useState([])
  const [copied, setCopied] = useState(null)
  const [error, setError] = useState('')

  const moods = [
    'Aesthetic', 'Motivational', 'Funny', 'Savage', 'Poetic',
    'Cinematic', 'Chill', 'Bold', 'Romantic', 'Minimal'
  ]
  
  const regionalVibes = [
    'None', 'Gujarati', 'Punjabi', 'Marathi', 'Bengali', 'Tamil',
    'Telugu', 'Malayalam', 'Kannada', 'Rajasthani', 'Haryanvi',
    'Bhojpuri', 'Hyderabadi', 'Delhi Vibe', 'MumBhai Vibe',
    'South Indian', 'Kashmiri', 'Odia', 'Assamese'
  ]

  const handleGenerate = async (e) => {
    e.preventDefault()
    setLoading(true)
    setCaptions([])
    setError('')

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subject, mood, regionalVibe })
      })

      if (!response.ok) {
        throw new Error('Failed to generate')
      }

      const data = await response.json()
      setCaptions(data.captions || [])
    } catch (err) {
      setError('Error generating captions. Try again.')
    } finally {
      setLoading(false)
    }
  }

  const copyCaption = (text, index) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text)
      setCopied(index)
      setTimeout(() => setCopied(null), 2000)
    }
  }

  return (
    <>
      <Head>
        <title>FunCaption - Regional Instagram Captions</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className="min-h-screen bg-gradient-to-b from-purple-900 via-black to-black text-white">
        <nav className="border-b border-purple-500/30 bg-black/50 backdrop-blur-lg">
          <div className="container mx-auto px-4 py-4">
            <h1 className="text-2xl font-bold gradient-text">FunCaption</h1>
          </div>
        </nav>

        <section className="container mx-auto px-4 py-20 text-center">
          <h2 className="text-4xl md:text-6xl font-bold mb-6 gradient-text">
            Where Real Trendsetters Are Made.
          </h2>
          <p className="text-lg md:text-xl text-gray-300 mb-6 max-w-3xl mx-auto">
            Create viral Instagram captions with regional pride!
          </p>
          <p className="text-base text-purple-300">
            ✨ 18 Regional Vibes | Native Scripts ✨
          </p>
        </section>

        <section className="container mx-auto px-4 py-8">
          <h3 className="text-xl font-bold text-center mb-4">
            Your Culture. Your Language. Your Caption.
          </h3>
          <div className="flex flex-wrap gap-2 justify-center max-w-5xl mx-auto">
            {regionalVibes.filter(v => v !== 'None').map((vibe, i) => (
              <span 
                key={i} 
                className="bg-purple-800/40 border border-purple-500/50 px-3 py-1 rounded-full text-xs"
              >
                {vibe}
              </span>
            ))}
          </div>
        </section>

        <section className="container mx-auto px-4 py-12 max-w-2xl">
          <div className="bg-gradient-to-br from-purple-900/40 to-black border border-purple-500/30 rounded-3xl p-6 md:p-8">
            <h3 className="text-2xl font-bold mb-6 text-center">
              Generate Your Caption
            </h3>
            
            <form onSubmit={handleGenerate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  📸 What's your post about?
                </label>
                <input 
                  type="text" 
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="e.g., chai pe charcha, beach sunset"
                  className="w-full px-4 py-3 bg-black/50 border border-purple-500/50 rounded-lg focus:outline-none focus:border-purple-400 text-white placeholder-gray-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  😎 Choose Mood
                </label>
                <select 
                  value={mood}
                  onChange={(e) => setMood(e.target.value)}
                  className="w-full px-4 py-3 bg-black/50 border border-purple-500/50 rounded-lg focus:outline-none focus:border-purple-400 text-white"
                >
                  {moods.map(m => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  🏛️ Regional Vibe (Optional)
                </label>
                <select 
                  value={regionalVibe}
                  onChange={(e) => setRegionalVibe(e.target.value)}
                  className="w-full px-4 py-3 bg-black/50 border border-purple-500/50 rounded-lg focus:outline-none focus:border-purple-400 text-white"
                >
                  {regionalVibes.map(v => (
                    <option key={v} value={v}>
                      {v === 'None' ? '🌍 No Regional (Global)' : '🎯 ' + v}
                    </option>
                  ))}
                </select>
              </div>

              {error && (
                <div className="bg-red-900/50 border border-red-500 text-red-200 px-4 py-2 rounded text-sm">
                  {error}
                </div>
              )}

              <button 
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 text-white font-bold py-3 rounded-lg transition"
              >
                {loading ? '✨ Generating...' : '🚀 Generate Captions (Free!)'}
              </button>
            </form>

            {captions.length > 0 && (
              <div className="mt-8 space-y-4">
                <h4 className="text-xl font-bold text-center">
                  Your Captions Are Ready! 🎉
                </h4>
                
                {captions.map((cap, i) => (
                  <div key={i} className="bg-gradient-to-br from-purple-800/20 to-pink-800/20 p-4 rounded-xl border border-purple-500/40">
                    <div className="bg-black/40 p-4 rounded-lg mb-3">
                      <p className="text-gray-100 whitespace-pre-line text-sm md:text-base leading-relaxed">
                        {cap.caption}
                      </p>
                    </div>
                    
                    {cap.translation && (
                      <details className="mb-3">
                        <summary className="text-xs text-purple-300 cursor-pointer hover:text-purple-200 mb-2">
                          📖 English Translation (click)
                        </summary>
                        <div className="bg-black/30 p-3 rounded mt-2">
                          <p className="text-sm text-gray-300 italic whitespace-pre-line">
                            {cap.translation}
                          </p>
                        </div>
                      </details>
                    )}
                    
                    <button 
                      onClick={() => copyCaption(cap.caption, i)}
                      className="w-full bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg text-sm font-medium transition"
                    >
                      {copied === i ? '✓ Copied!' : '📋 Copy Caption'}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        <footer className="border-t border-purple-500/30 py-6 mt-12">
          <div className="container mx-auto px-4 text-center text-gray-400 text-xs">
            <p>FunCaption © 2025 - Celebrate Regional Pride 🇮🇳</p>
          </div>
        </footer>
      </div>
    </>
  )
}
