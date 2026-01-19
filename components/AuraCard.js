// /components/AuraCard.js

import { useState, useEffect, useRef } from 'react';

const AuraCard = ({ aura }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [shareMessage, setShareMessage] = useState('');
  const cardRef = useRef(null);
  
  useEffect(() => {
    setIsVisible(true);
  }, []);

  const captureCard = async () => {
    try {
      const html2canvas = (await import('html2canvas')).default;
      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: null,
        scale: 3,
        useCORS: true,
        logging: false,
        width: 360,
        height: 640,
      });
      return canvas;
    } catch (error) {
      console.error('Error capturing card:', error);
      return null;
    }
  };

  const downloadCard = async () => {
    setIsSharing(true);
    try {
      const canvas = await captureCard();
      if (canvas) {
        const link = document.createElement('a');
        link.download = `aurapro-${aura.rarity}-${Date.now()}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
        setShareMessage('✅ Downloaded!');
        setTimeout(() => setShareMessage(''), 3000);
      }
    } catch (error) {
      setShareMessage('❌ Failed');
      setTimeout(() => setShareMessage(''), 3000);
    }
    setIsSharing(false);
  };

  const shareToInstagram = async () => {
    setIsSharing(true);
    try {
      const canvas = await captureCard();
      if (!canvas) throw new Error('Failed');
      const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png'));
      const file = new File([blob], 'aurapro.png', { type: 'image/png' });

      if (navigator.share && navigator.canShare?.({ files: [file] })) {
        await navigator.share({ 
          files: [file], 
          title: `My Aura: ${aura.rarity.toUpperCase()}`,
          text: `Got ${aura.score} aura score!`
        });
        setShareMessage('✅ Shared!');
      } else {
        await downloadCard();
        setShowShareModal(true);
      }
    } catch (error) {
      if (error.name !== 'AbortError') {
        await downloadCard();
        setShowShareModal(true);
      }
    }
    setIsSharing(false);
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText('https://aurapro.vercel.app');
      setShareMessage('✅ Link copied!');
      setTimeout(() => setShareMessage(''), 2000);
    } catch {
      setShareMessage('❌ Failed');
    }
  };

  const getTierConfig = (rarity) => {
    switch (rarity) {
      case 'legendary':
        return {
          gradient: 'linear-gradient(135deg, #FFD700 0%, #FFA500 50%, #FF6B00 100%)',
          glowColor: '#FFD700',
          textColor: '#FFD700',
          shadowColor: 'rgba(255, 215, 0, 0.8)',
          borderColor: '#FFD700',
          tierLabel: "LEGENDARY",
          tierIcon: "👑",
          headerBadge: "TOP 1%",
          accentGradient: 'linear-gradient(90deg, #FFD700, #FFA500, #FFD700)',
        };
      case 'epic':
        return {
          gradient: 'linear-gradient(135deg, #00FFFF 0%, #00CED1 50%, #1E90FF 100%)',
          glowColor: '#00FFFF',
          textColor: '#00FFFF',
          shadowColor: 'rgba(0, 255, 255, 0.8)',
          borderColor: '#00FFFF',
          tierLabel: "EPIC",
          tierIcon: "⚡",
          headerBadge: "TOP 6%",
          accentGradient: 'linear-gradient(90deg, #00FFFF, #1E90FF, #00FFFF)',
        };
      case 'mid':
        return {
          gradient: 'linear-gradient(135deg, #E0E0E0 0%, #BDBDBD 50%, #9E9E9E 100%)',
          glowColor: '#E0E0E0',
          textColor: '#FFFFFF',
          shadowColor: 'rgba(224, 224, 224, 0.7)',
          borderColor: '#E0E0E0',
          tierLabel: "MID",
          tierIcon: "🔥",
          headerBadge: "AVERAGE",
          accentGradient: 'linear-gradient(90deg, #E0E0E0, #BDBDBD, #E0E0E0)',
        };
      case 'noob':
        return {
          gradient: 'linear-gradient(135deg, #FF8C00 0%, #FF6347 50%, #FF4500 100%)',
          glowColor: '#FF8C00',
          textColor: '#FF8C00',
          shadowColor: 'rgba(255, 140, 0, 0.8)',
          borderColor: '#FF8C00',
          tierLabel: "NOOB",
          tierIcon: "😬",
          headerBadge: "NEEDS WORK",
          accentGradient: 'linear-gradient(90deg, #FF8C00, #FF6347, #FF8C00)',
        };
      case 'npc':
      default:
        return {
          gradient: 'linear-gradient(135deg, #FF0000 0%, #DC143C 50%, #B22222 100%)',
          glowColor: '#FF0000',
          textColor: '#FF0000',
          shadowColor: 'rgba(255, 0, 0, 0.9)',
          borderColor: '#FF0000',
          tierLabel: "BOT",
          tierIcon: "💀",
          headerBadge: "BOTTOM 20%",
          accentGradient: 'linear-gradient(90deg, #FF0000, #DC143C, #FF0000)',
        };
    }
  };

  const config = getTierConfig(aura.rarity);

  const ShareModal = () => (
    <div style={{
      position: 'fixed',
      top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(0,0,0,0.95)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
      padding: '20px',
      backdropFilter: 'blur(20px)',
    }}>
      <div style={{
        background: 'linear-gradient(135deg, #1a1a1a 0%, #0a0a0a 100%)',
        borderRadius: '24px',
        padding: '35px',
        maxWidth: '340px',
        width: '100%',
        border: `2px solid ${config.borderColor}`,
        boxShadow: `0 0 60px ${config.shadowColor}`,
      }}>
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div style={{ 
            fontSize: '4rem', 
            marginBottom: '18px',
            filter: `drop-shadow(0 0 25px ${config.glowColor})`,
            animation: 'bounce 1s ease-in-out'
          }}>
            📸
          </div>
          <h3 style={{ 
            margin: '0 0 12px 0', 
            color: config.textColor, 
            fontSize: '1.4rem',
            fontWeight: '900',
            textShadow: `0 0 25px ${config.shadowColor}`
          }}>
            Card Downloaded!
          </h3>
          <p style={{ 
            margin: 0, 
            color: 'rgba(255,255,255,0.75)', 
            fontSize: '0.9rem',
            lineHeight: '1.6'
          }}>
            Open Instagram & flex your aura 🔥
          </p>
        </div>

        <a
          href="instagram://story-camera"
          style={{
            display: 'block',
            padding: '18px',
            background: 'linear-gradient(135deg, #833AB4, #FD1D1D, #F77737)',
            borderRadius: '16px',
            color: '#fff',
            fontSize: '1.05rem',
            fontWeight: '900',
            textAlign: 'center',
            textDecoration: 'none',
            marginBottom: '14px',
            boxShadow: '0 10px 30px rgba(131, 58, 180, 0.5)',
            transition: 'transform 0.2s',
          }}
        >
          📱 Open Instagram
        </a>

        <button
          onClick={() => setShowShareModal(false)}
          style={{
            width: '100%',
            padding: '16px',
            background: 'rgba(255,255,255,0.08)',
            border: '1px solid rgba(255,255,255,0.15)',
            borderRadius: '14px',
            color: 'rgba(255,255,255,0.8)',
            fontSize: '0.95rem',
            fontWeight: '700',
            cursor: 'pointer',
            transition: 'all 0.2s',
          }}
        >
          Close
        </button>
      </div>
    </div>
  );

  return (
    <>
      {showShareModal && <ShareModal />}
      
      {shareMessage && (
        <div style={{
          position: 'fixed',
          top: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          background: '#111',
          border: `2px solid ${config.borderColor}`,
          borderRadius: '14px',
          padding: '14px 28px',
          color: '#fff',
          fontSize: '0.95rem',
          fontWeight: '800',
          zIndex: 10000,
          boxShadow: `0 0 40px ${config.shadowColor}`,
        }}>
          {shareMessage}
        </div>
      )}

      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '22px',
      }}>
        <div 
          ref={cardRef}
          style={{
            position: 'relative',
            width: '360px',
            height: '640px',
            borderRadius: '24px',
            overflow: 'hidden',
            background: config.gradient,
            fontFamily: '"Inter", -apple-system, sans-serif',
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'scale(1) rotateY(0deg)' : 'scale(0.9) rotateY(10deg)',
            transition: 'all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)',
            boxShadow: `
              0 25px 80px rgba(0,0,0,0.6),
              0 0 100px ${config.shadowColor},
              inset 0 0 120px rgba(0,0,0,0.4)
            `,
          }}
        >
          
          {/* Animated Grain Texture */}
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'1.5\' numOctaves=\'4\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\'/%3E%3C/svg%3E")',
            opacity: 0.05,
            mixBlendMode: 'overlay',
            pointerEvents: 'none',
            animation: 'grain 8s steps(10) infinite',
          }} />

          {/* Dark Vignette */}
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'radial-gradient(circle at center, transparent 0%, rgba(0,0,0,0.7) 100%)',
          }} />

          {/* Accent Glow Lines */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '2px',
            background: config.accentGradient,
            boxShadow: `0 0 20px ${config.glowColor}`,
            animation: 'shimmer 3s ease-in-out infinite',
          }} />

          <div style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '2px',
            background: config.accentGradient,
            boxShadow: `0 0 20px ${config.glowColor}`,
            animation: 'shimmer 3s ease-in-out infinite 1.5s',
          }} />

          {/* Content */}
          <div style={{
            position: 'relative',
            zIndex: 10,
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
            padding: '32px 26px',
          }}>
            
            {/* Header Badge */}
            <div style={{
              textAlign: 'center',
              marginBottom: '22px',
              animation: 'fadeInDown 0.6s ease-out',
            }}>
              <div style={{
                display: 'inline-block',
                padding: '10px 24px',
                background: `linear-gradient(135deg, ${config.glowColor}40, ${config.glowColor}15)`,
                border: `2px solid ${config.borderColor}`,
                borderRadius: '100px',
                fontSize: '0.75rem',
                fontWeight: '900',
                letterSpacing: '2.5px',
                color: config.textColor,
                textShadow: `0 0 20px ${config.shadowColor}`,
                boxShadow: `0 0 30px ${config.shadowColor}, inset 0 0 20px ${config.glowColor}20`,
                animation: 'glow 2s ease-in-out infinite',
              }}>
                {config.headerBadge}
              </div>
            </div>

            {/* Tier Icon - Floating */}
            <div style={{
              textAlign: 'center',
              marginBottom: '18px',
              animation: 'float 3s ease-in-out infinite',
            }}>
              <div style={{
                fontSize: '5rem',
                filter: `drop-shadow(0 0 35px ${config.glowColor})`,
                transform: 'scale(1)',
                animation: 'pulse 2s ease-in-out infinite',
              }}>
                {config.tierIcon}
              </div>
            </div>

            {/* Tier Label - Glitch Effect */}
            <div style={{
              textAlign: 'center',
              marginBottom: '28px',
              position: 'relative',
            }}>
              <h1 style={{
                margin: '0',
                fontSize: '3.2rem',
                fontWeight: '900',
                letterSpacing: '8px',
                color: config.textColor,
                textShadow: `
                  0 0 40px ${config.glowColor},
                  0 0 80px ${config.glowColor},
                  2px 2px 0 ${config.borderColor}80,
                  -2px -2px 0 ${config.borderColor}40,
                  0 8px 20px rgba(0,0,0,0.7)
                `,
                WebkitTextStroke: `1.5px ${config.borderColor}`,
                animation: 'glitch 5s infinite',
              }}>
                {config.tierLabel}
              </h1>
            </div>

            {/* Score - BIG & BOLD */}
            <div style={{
              textAlign: 'center',
              marginBottom: '32px',
              padding: '24px',
              background: 'rgba(0,0,0,0.6)',
              borderRadius: '24px',
              border: `3px solid ${config.borderColor}50`,
              backdropFilter: 'blur(10px)',
              boxShadow: `
                0 0 40px ${config.shadowColor},
                inset 0 0 40px rgba(0,0,0,0.5)
              `,
              animation: 'fadeInUp 0.8s ease-out 0.2s backwards',
            }}>
              <div style={{
                fontSize: '0.8rem',
                color: config.textColor,
                letterSpacing: '4px',
                fontWeight: '800',
                marginBottom: '12px',
                opacity: 0.9,
                textTransform: 'uppercase',
              }}>
                Aura Score
              </div>
              <div style={{
                fontSize: '6rem',
                fontWeight: '900',
                lineHeight: 1,
                color: config.textColor,
                textShadow: `
                  0 0 50px ${config.glowColor},
                  0 0 100px ${config.glowColor},
                  0 8px 25px rgba(0,0,0,0.8)
                `,
                animation: 'scoreGlow 2s ease-in-out infinite',
              }}>
                {aura.score}
              </div>
              <div style={{
                width: '60px',
                height: '3px',
                background: config.accentGradient,
                margin: '12px auto 0',
                borderRadius: '10px',
                boxShadow: `0 0 15px ${config.glowColor}`,
              }} />
            </div>

            {/* Roast Box - FIXED VISIBILITY */}
            <div style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              marginBottom: '28px',
              animation: 'fadeInUp 1s ease-out 0.4s backwards',
            }}>
              <div style={{
                background: 'rgba(0,0,0,0.65)',
                backdropFilter: 'blur(15px)',
                border: `3px solid ${config.borderColor}70`,
                borderRadius: '20px',
                padding: '32px 24px 36px 24px',
                boxShadow: `
                  0 12px 40px rgba(0,0,0,0.7),
                  inset 0 0 40px rgba(255,255,255,0.05),
                  0 0 30px ${config.shadowColor}
                `,
                position: 'relative',
                overflow: 'visible',
              }}>
                {/* Quote Icon */}
                <div style={{
                  position: 'absolute',
                  top: '-12px',
                  left: '20px',
                  fontSize: '2.5rem',
                  filter: `drop-shadow(0 0 15px ${config.glowColor})`,
                }}>
                  💬
                </div>

                <p style={{
                  margin: 0,
                  fontSize: '1.35rem',
                  lineHeight: 1.7,
                  fontWeight: '700',
                  color: '#fff',
                  textAlign: 'center',
                  textShadow: '0 3px 12px rgba(0,0,0,0.9)',
                  paddingBottom: '8px',
                  wordWrap: 'break-word',
                  overflowWrap: 'break-word',
                  hyphens: 'auto',
                  minHeight: '90px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  {aura.roast}
                </p>
              </div>
            </div>

            {/* Footer - Clean */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '18px 0 0 0',
              borderTop: `2px solid ${config.borderColor}30`,
              animation: 'fadeIn 1.2s ease-out 0.6s backwards',
            }}>
              <div style={{
                fontSize: '0.7rem',
                color: config.textColor,
                fontWeight: '800',
                letterSpacing: '1.5px',
                opacity: 0.85,
                textTransform: 'uppercase',
              }}>
                {aura.challenge}
              </div>
              
              <div style={{
                fontSize: '0.65rem',
                color: 'rgba(255,255,255,0.4)',
                fontWeight: '700',
                letterSpacing: '1px',
                textTransform: 'uppercase',
              }}>
                AuraPro
              </div>
            </div>
          </div>

          {/* Animated Corner Accents */}
          {[
            { top: '12px', left: '12px', rotate: 0 },
            { top: '12px', right: '12px', rotate: 90 },
            { bottom: '12px', left: '12px', rotate: 270 },
            { bottom: '12px', right: '12px', rotate: 180 },
          ].map((pos, i) => (
            <div key={i} style={{
              position: 'absolute',
              ...pos,
              width: '40px',
              height: '40px',
              zIndex: 20,
              opacity: 0.9,
              animation: `cornerPulse 3s ease-in-out infinite ${i * 0.5}s`,
            }}>
              <svg width="40" height="40" viewBox="0 0 40 40" style={{
                transform: `rotate(${pos.rotate}deg)`,
              }}>
                <path
                  d="M 0 8 L 0 0 L 8 0"
                  stroke={config.borderColor}
                  strokeWidth="3"
                  fill="none"
                  strokeLinecap="round"
                  filter={`drop-shadow(0 0 8px ${config.glowColor})`}
                />
                <circle
                  cx="0"
                  cy="0"
                  r="2"
                  fill={config.glowColor}
                  filter={`drop-shadow(0 0 6px ${config.glowColor})`}
                />
              </svg>
            </div>
          ))}
        </div>

        {/* Share Buttons - Gen Z Style */}
        <div style={{ 
          width: '360px', 
          display: 'flex', 
          flexDirection: 'column', 
          gap: '14px' 
        }}>
          <button
            onClick={shareToInstagram}
            disabled={isSharing}
            style={{
              width: '100%',
              padding: '18px',
              background: 'linear-gradient(135deg, #833AB4, #FD1D1D, #F77737)',
              border: 'none',
              borderRadius: '16px',
              color: '#fff',
              fontSize: '1.05rem',
              fontWeight: '900',
              cursor: isSharing ? 'not-allowed' : 'pointer',
              opacity: isSharing ? 0.7 : 1,
              boxShadow: '0 10px 35px rgba(131, 58, 180, 0.5)',
              transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
              fontFamily: 'inherit',
              letterSpacing: '0.5px',
            }}
            onMouseEnter={(e) => {
              if (!isSharing) {
                e.target.style.transform = 'translateY(-3px) scale(1.02)';
                e.target.style.boxShadow = '0 15px 45px rgba(131, 58, 180, 0.6)';
              }
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0) scale(1)';
              e.target.style.boxShadow = '0 10px 35px rgba(131, 58, 180, 0.5)';
            }}
          >
            {isSharing ? '⏳ Processing...' : '📸 Share to Instagram'}
          </button>

          <div style={{ display: 'flex', gap: '14px' }}>
            <button
              onClick={downloadCard}
              disabled={isSharing}
              style={{
                flex: 1,
                padding: '16px',
                background: 'rgba(255,255,255,0.1)',
                border: `2px solid ${config.borderColor}60`,
                borderRadius: '14px',
                color: '#fff',
                fontSize: '0.9rem',
                fontWeight: '800',
                cursor: 'pointer',
                transition: 'all 0.2s',
                fontFamily: 'inherit',
                backdropFilter: 'blur(10px)',
              }}
              onMouseEnter={(e) => {
                e.target.style.background = 'rgba(255,255,255,0.2)';
                e.target.style.borderColor = config.borderColor;
                e.target.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'rgba(255,255,255,0.1)';
                e.target.style.borderColor = `${config.borderColor}60`;
                e.target.style.transform = 'translateY(0)';
              }}
            >
              ⬇️ Download
            </button>

            <button
              onClick={copyLink}
              style={{
                flex: 1,
                padding: '16px',
                background: 'rgba(255,255,255,0.1)',
                border: `2px solid ${config.borderColor}60`,
                borderRadius: '14px',
                color: '#fff',
                fontSize: '0.9rem',
                fontWeight: '800',
                cursor: 'pointer',
                transition: 'all 0.2s',
                fontFamily: 'inherit',
                backdropFilter: 'blur(10px)',
              }}
              onMouseEnter={(e) => {
                e.target.style.background = 'rgba(255,255,255,0.2)';
                e.target.style.borderColor = config.borderColor;
                e.target.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'rgba(255,255,255,0.1)';
                e.target.style.borderColor = `${config.borderColor}60`;
                e.target.style.transform = 'translateY(0)';
              }}
            >
              🔗 Copy
            </button>
          </div>

          <p style={{
            textAlign: 'center',
            fontSize: '0.7rem',
            color: 'rgba(255,255,255,0.45)',
            margin: '8px 0 0 0',
            fontWeight: '700',
            letterSpacing: '0.5px',
          }}>
            Tag @aurapro on Instagram 📱
          </p>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-15px); }
        }

        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }

        @keyframes glow {
          0%, 100% { box-shadow: 0 0 30px ${config.shadowColor}, inset 0 0 20px ${config.glowColor}20; }
          50% { box-shadow: 0 0 50px ${config.shadowColor}, inset 0 0 30px ${config.glowColor}30; }
        }

        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }

        @keyframes glitch {
          0%, 90%, 100% { transform: translate(0); }
          92% { transform: translate(-2px, 2px); }
          94% { transform: translate(2px, -2px); }
          96% { transform: translate(-2px, -2px); }
        }

        @keyframes grain {
          0%, 100% { transform: translate(0, 0); }
          10% { transform: translate(-5%, -10%); }
          30% { transform: translate(3%, -15%); }
          50% { transform: translate(12%, 9%); }
          70% { transform: translate(9%, 4%); }
          90% { transform: translate(-1%, 7%); }
        }

        @keyframes fadeInDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes scoreGlow {
          0%, 100% { 
            text-shadow: 
              0 0 50px ${config.glowColor},
              0 0 100px ${config.glowColor},
              0 8px 25px rgba(0,0,0,0.8);
          }
          50% { 
            text-shadow: 
              0 0 80px ${config.glowColor},
              0 0 150px ${config.glowColor},
              0 8px 25px rgba(0,0,0,0.8);
          }
        }

        @keyframes cornerPulse {
          0%, 100% { opacity: 0.9; }
          50% { opacity: 0.5; }
        }

        @keyframes bounce {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
        }
      `}</style>
    </>
  );
};

export default AuraCard;
