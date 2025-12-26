// ... existing imports ...

// Target goal chips - ALL OFF BY DEFAULT
const targetGoals = [
  { id: 'comments', label: '💬 Get Comments', active: false },
  { id: 'shares', label: '🔄 Get Shares', active: false },
  { id: 'saves', label: '🔖 Save for Later', active: false }
]

// ... rest of existing code until state declarations ...

export default function Home() {
  // Form states
  const [subject, setSubject] = useState('')
  const [details, setDetails] = useState('')
  const [selectedMood, setSelectedMood] = useState('fire')
  const [showExtendedMoods, setShowExtendedMoods] = useState(false)
  const [wheelRotation, setWheelRotation] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const [startAngle, setStartAngle] = useState(0)
  const [currentExample, setCurrentExample] = useState(0)
  
  // Feature toggles - CAPTION BUTTON OFF BY DEFAULT
  const [scrollStopperHook, setScrollStopperHook] = useState(true)
  const [proTags, setProTags] = useState(true)
  const [selectedGoals, setSelectedGoals] = useState([]) // EMPTY BY DEFAULT
  
  // Loading & Results
  const [loading, setLoading] = useState(false)
  const [loadingStep, setLoadingStep] = useState(0)
  const [variants, setVariants] = useState([])
  const [copiedIndex, setCopiedIndex] = useState(null)

  // ... rest of existing code until targetGoals section ...

  const toggleGoal = (goalId) => {
    setSelectedGoals(prev => 
      prev.includes(goalId) 
        ? prev.filter(g => g !== goalId)
        : [...prev, goalId]
    )
  }

  // ... rest of existing code ...

  return (
    <>
      {/* ... existing head and styles ... */}

      <div style={{ 
        minHeight: '100vh',
        padding: '20px',
        maxWidth: '480px',
        margin: '0 auto',
        background: '#FAFAFA'
      }}>
        
        {/* ========== HEADER ========== */}
        <header style={{
          textAlign: 'center',
          padding: '24px 0 20px'
        }}>
          <h1 className="instagram-gradient-text" style={{
            fontSize: '2.4rem',
            fontWeight: '900',
            marginBottom: '16px',
            letterSpacing: '-0.03em'
          }}>
            FunCaption
          </h1>

          <h2 className="instagram-gradient-text" style={{
            fontSize: '1.5rem',
            fontWeight: '900',
            marginBottom: '24px',
            letterSpacing: '0.02em',
            textTransform: 'uppercase',
            lineHeight: '1.3'
          }}>
            YOUR NEXT MILLION<br/>ARE HERE
          </h2>

          {/* Steps */}
          <div style={{
            background: '#FFFFFF',
            borderRadius: '20px',
            padding: '20px 24px',
            marginBottom: '16px',
            boxShadow: '0 2px 16px rgba(0,0,0,0.05)',
            border: '1px solid rgba(0,0,0,0.04)',
            textAlign: 'left'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}>
              <span className="instagram-gradient step-number">1</span>
              <span style={{ fontSize: '0.95rem', fontWeight: '600', color: '#262626' }}>
                Type your topic.
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}>
              <span className="instagram-gradient step-number">2</span>
              <span style={{ fontSize: '0.95rem', fontWeight: '600', color: '#262626' }}>
                Pick your vibe.
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center' }}>
              <span className="instagram-gradient step-number">3</span>
              <span style={{ fontSize: '0.95rem', fontWeight: '600', color: '#262626' }}>
                Copy the hook and go.
              </span>
            </div>
          </div>

          <p className="instagram-gradient-text glow-text" style={{
            fontSize: '1.15rem',
            fontWeight: '800',
            letterSpacing: '0.01em'
          }}>
            ✨ Your millions are waiting ✨
          </p>
        </header>

        {/* ... existing input card ... */}

        {/* ... existing mood wheel ... */}

        {/* ... existing extended moods ... */}

        {/* ========== ENHANCING FEATURES - WITH AESTHETIC UPGRADES ========== */}
        <div className="card-hover" style={{
          background: '#FFFFFF',
          borderRadius: '24px',
          padding: '20px',
          marginBottom: '20px',
          boxShadow: '0 2px 16px rgba(0,0,0,0.05)',
          border: '1px solid rgba(0,0,0,0.04)'
        }}>
          <p style={{
            fontSize: '0.8rem',
            fontWeight: '700',
            color: '#8E8E8E',
            marginBottom: '16px',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            textAlign: 'center'
          }}>
            🚀 Enhance Your Virality
          </p>

          {/* Scroll-Stopper Hook */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '14px',
            padding: '14px 16px',
            background: '#FAFAFA',
            borderRadius: '16px',
            border: '1px solid #EFEFEF'
          }}>
            <div>
              <p style={{ fontSize: '0.9rem', fontWeight: '600', color: '#262626' }}>
                🎣 Scroll-Stopper Hook
              </p>
              <p style={{ fontSize: '0.75rem', color: '#8E8E8E', marginTop: '2px' }}>
                Viral opening line
              </p>
            </div>
            <div 
              className={`toggle-switch ${scrollStopperHook ? 'active' : ''}`}
              onClick={() => setScrollStopperHook(!scrollStopperHook)}
            ></div>
          </div>

          {/* Target Goals - ALL OFF BY DEFAULT */}
          <div style={{ marginBottom: '14px' }}>
            <p style={{ 
              fontSize: '0.8rem', 
              color: '#8E8E8E', 
              marginBottom: '10px',
              fontWeight: '600',
              textAlign: 'center'
            }}>
              🎯 Target Actions
            </p>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'center' }}>
              {targetGoals.map(goal => (
                <button
                  key={goal.id}
                  onClick={() => toggleGoal(goal.id)}
                  className={selectedGoals.includes(goal.id) ? 'instagram-gradient' : ''}
                  style={{
                    padding: '10px 14px',
                    borderRadius: '18px',
                    background: selectedGoals.includes(goal.id) ? undefined : '#FAFAFA',
                    border: selectedGoals.includes(goal.id) ? 'none' : '2px solid #EFEFEF',
                    color: selectedGoals.includes(goal.id) ? 'white' : '#262626',
                    fontSize: '0.8rem',
                    fontWeight: '600',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <span>{goal.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Pro Tags */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '14px 16px',
            background: '#FAFAFA',
            borderRadius: '16px',
            border: '1px solid #EFEFEF'
          }}>
            <div>
              <p style={{ fontSize: '0.9rem', fontWeight: '600', color: '#262626' }}>
                #️⃣ Pro Tags
              </p>
              <p style={{ fontSize: '0.75rem', color: '#8E8E8E', marginTop: '2px' }}>
                Trending hashtags
              </p>
            </div>
            <div 
              className={`toggle-switch ${proTags ? 'active' : ''}`}
              onClick={() => setProTags(!proTags)}
            ></div>
          </div>
        </div>

        {/* ========== RESULTS - AESTHETIC UPGRADE ========== */}
        {variants.length > 0 && !loading && (
          <div style={{ marginBottom: '24px' }}>
            <p style={{
              fontSize: '0.95rem',
              fontWeight: '700',
              color: '#262626',
              marginBottom: '16px',
              textAlign: 'center'
            }}>
              🌟 Your Exclusive Content Awaits
            </p>

            {/* Quick Fire - PREMIUM LOOK */}
            {variants.filter(v => v.type === 'short').map((v, i) => {
              return (
                <div 
                  key={`short-${i}`}
                  className="card-hover"
                  style={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    borderRadius: '24px',
                    padding: '20px',
                    marginBottom: '16px',
                    boxShadow: '0 8px 32px rgba(102, 126, 234, 0.3)',
                    border: 'none',
                    position: 'relative',
                    overflow: 'hidden'
                  }}
                >
                  <div style={{
                    position: 'absolute',
                    top: '12px',
                    right: '12px',
                    background: 'rgba(255, 255, 255, 0.2)',
                    backdropFilter: 'blur(10px)',
                    padding: '4px 12px',
                    borderRadius: '20px'
                  }}>
                    <span style={{
                      fontSize: '0.7rem',
                      fontWeight: '800',
                      color: 'white',
                      textTransform: 'uppercase'
                    }}>
                      ⚡ Quick Impact
                    </span>
                  </div>

                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    marginBottom: '14px'
                  }}>
                    <span style={{ fontSize: '1.2rem' }}>✨</span>
                    <span style={{
                      fontSize: '0.8rem',
                      fontWeight: '700',
                      color: 'rgba(255, 255, 255, 0.9)',
                      textTransform: 'uppercase'
                    }}>
                      {v.label || "Power Hook"}
                    </span>
                  </div>

                  <p style={{
                    fontSize: '1.1rem',
                    lineHeight: '1.6',
                    color: 'white',
                    marginBottom: '16px',
                    whiteSpace: 'pre-line',
                    fontWeight: '600',
                    textShadow: '0 2px 4px rgba(0,0,0,0.2)'
                  }}>
                    {v.caption}
                  </p>

                  <button
                    onClick={() => copyCaption(v.caption, `short-${i}`)}
                    style={{
                      width: '100%',
                      padding: '14px',
                      borderRadius: '14px',
                      background: 'rgba(255, 255, 255, 0.2)',
                      border: '1px solid rgba(255, 255, 255, 0.3)',
                      color: 'white',
                      fontSize: '0.9rem',
                      fontWeight: '700',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      backdropFilter: 'blur(5px)'
                    }}
                  >
                    {copiedIndex === `short-${i}` ? '✓ Copied to Your Clipboard!' : '📋 Copy Your Power Hook'}
                  </button>
                </div>
              )
            })}

            {/* Closer Thread - ROYAL LOOK */}
            {variants.filter(v => v.type === 'long').map((v, i) => {
              return (
                <div 
                  key={`long-${i}`}
                  className="card-hover"
                  style={{
                    background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                    borderRadius: '24px',
                    padding: '20px',
                    marginBottom: '16px',
                    boxShadow: '0 8px 32px rgba(240, 147, 251, 0.3)',
                    border: 'none',
                    position: 'relative',
                    overflow: 'hidden'
                  }}
                >
                  <div style={{
                    position: 'absolute',
                    top: '12px',
                    right: '12px',
                    background: 'rgba(255, 255, 255, 0.2)',
                    backdropFilter: 'blur(10px)',
                    padding: '4px 12px',
                    borderRadius: '20px'
                  }}>
                    <span style={{
                      fontSize: '0.7rem',
                      fontWeight: '800',
                      color: 'white',
                      textTransform: 'uppercase'
                    }}>
                      📝 Story Builder
                    </span>
                  </div>

                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    marginBottom: '14px'
                  }}>
                    <span style={{ fontSize: '1.2rem' }}>👑</span>
                    <span style={{
                      fontSize: '0.8rem',
                      fontWeight: '700',
                      color: 'rgba(255, 255, 255, 0.9)',
                      textTransform: 'uppercase'
                    }}>
                      {v.label || "Complete Thread"}
                    </span>
                  </div>

                  <p style={{
                    fontSize: '1rem',
                    lineHeight: '1.7',
                    color: 'white',
                    marginBottom: '16px',
                    whiteSpace: 'pre-line',
                    fontWeight: '500',
                    textShadow: '0 2px 4px rgba(0,0,0,0.2)'
                  }}>
                    {v.caption}
                  </p>

                  <button
                    onClick={() => copyCaption(v.caption, `long-${i}`)}
                    style={{
                      width: '100%',
                      padding: '14px',
                      borderRadius: '14px',
                      background: 'rgba(255, 255, 255, 0.2)',
                      border: '1px solid rgba(255, 255, 255, 0.3)',
                      color: 'white',
                      fontSize: '0.9rem',
                      fontWeight: '700',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      backdropFilter: 'blur(5px)'
                    }}
                  >
                    {copiedIndex === `long-${i}` ? '✓ Copied to Your Clipboard!' : '📋 Copy Your Complete Thread'}
                  </button>
                </div>
              )
            })}

            {/* VIP MESSAGE */}
            <div style={{
              background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
              borderRadius: '20px',
              padding: '16px',
              textAlign: 'center',
              marginBottom: '20px'
            }}>
              <p style={{
                fontSize: '0.9rem',
                fontWeight: '700',
                color: '#262626',
                marginBottom: '8px'
              }}>
                🎁 VIP Creator Tip
              </p>
              <p style={{
                fontSize: '0.8rem',
                color: '#262626',
                lineHeight: '1.5'
              }}>
                You just unlocked premium content that takes others hours to craft. 
                Your audience won't know what hit them! 💫
              </p>
            </div>
          </div>
        )}

        {/* ========== FOOTER ========== */}
        <footer style={{
          textAlign: 'center',
          padding: '24px 0',
          borderTop: '1px solid #EFEFEF'
        }}>
          <a
            href="https://www.instagram.com/instaalgohacker?igsh=MW1maXl2a3IxNm40OA=="
            target="_blank"
            rel="noopener noreferrer"
            className="instagram-gradient"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '12px 24px',
              borderRadius: '24px',
              color: 'white',
              textDecoration: 'none',
              fontSize: '0.85rem',
              fontWeight: '700',
              marginBottom: '14px',
              boxShadow: '0 4px 15px rgba(193, 53, 132, 0.3)'
            }}
          >
            <InstagramIcon />
            Follow @instaalgohacker
          </a>

          <p style={{ fontSize: '0.8rem', color: '#8E8E8E' }}>
            FunCaption © 2025 — Built for Creators Like You 🔥
          </p>
        </footer>
      </div>
    </>
  )
            }                                 
