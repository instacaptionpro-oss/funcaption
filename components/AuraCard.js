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

  // ============================================
  // SHARE FUNCTIONS
  // ============================================
  const captureCard = async () => {
    try {
      const html2canvas = (await import('html2canvas')).default;
      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: null,
        scale: 3, // Higher quality for IG
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
      setShareMessage('❌ Download failed');
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
      const file = new File([blob], 'aurapro-card.png', { type: 'image/png' });

      if (navigator.share && navigator.canShare?.({ files: [file] })) {
        await navigator.share({ 
          files: [file], 
          title: `My Aura: ${aura.rarity.toUpperCase()} 🔥`,
          text: `I got ${aura.score} aura score! 💀`
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
      setShareMessage('❌ Failed to copy');
    }
  };

  // ============================================
  // TIER CONFIG (Enhanced)
  // ============================================
  const getTierConfig = (rarity) => {
    switch (rarity) {
      case 'legendary':
        return {
          gradient: 'linear-gradient(135deg, #FFD700 0%, #FFA500 50%, #FF8C00 100%)',
          glowColor: '#FFD700',
          textColor: '#FFD700',
          shadowColor: 'rgba(255, 215, 0, 0.6)',
          borderColor: '#FFD700',
          tierLabel: "LEGENDARY",
          tierIcon: "👑",
          headerBadge: "TOP 1%",
        };
      case 'epic':
        return {
          gradient: 'linear-gradient(135deg, #00FFFF 0%, #00CED1 50%, #1E90FF 100%)',
          glowColor: '#00FFFF',
          textColor: '#00FFFF',
          shadowColor: 'rgba(0, 255, 255, 0.6)',
          borderColor: '#00FFFF',
          tierLabel: "EPIC",
          tierIcon: "⚡",
          headerBadge: "TOP 6%",
        };
      case 'mid':
        return {
          gradient: 'linear-gradient(135deg, #FFFFFF 0%, #D3D3D3 50%, #A9A9A9 100%)',
          glowColor: '#FFFFFF',
          textColor: '#FFFFFF',
          shadowColor: 'rgba(255, 255, 255, 0.5)',
          borderColor: '#FFFFFF',
          tierLabel: "MID",
          tierIcon: "🔥",
          headerBadge: "AVERAGE",
        };
      case 'noob':
        return {
          gradient: 'linear-gradient(135deg, #FF8C00 0%, #FF6347 50%, #FF4500 100%)',
          glowColor: '#FF8C00',
          textColor: '#FF8C00',
          shadowColor: 'rgba(255, 140, 0, 0.6)',
          borderColor: '#FF8C00',
          tierLabel: "NOOB",
          tierIcon: "😬",
          headerBadge: "NEEDS WORK",
        };
      case 'npc':
      default:
        return {
          gradient: 'linear-gradient(135deg, #FF0000 0%, #DC143C 50%, #8B0000 100%)',
          glowColor: '#FF0000',
          textColor: '#FF0000',
          shadowColor: 'rgba(255, 0, 0, 0.7)',
          borderColor: '#FF0000',
          tierLabel: "BOT",
          tierIcon: "💀",
          headerBadge: "BOTTOM 20%",
        };
    }
  };

  const config = getTierConfig(aura.rarity);

  // ============================================
  // SHARE MODAL
  // ============================================
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
      backdropFilter: 'blur(10px)',
    }}>
      <div style={{
        background: 'linear-gradient(135deg, #1a1a1a 0%, #0a0a0a 100%)',
        borderRadius: '20px',
        padding: '30px',
        maxWidth: '340px',
        width: '100%',
        border: `2px solid ${config.borderColor}`,
        boxShadow: `0 0 40px ${config.shadowColor}`,
      }}>
        <div style={{ textAlign: 'center', marginBottom: '25px' }}>
          <div style={{ 
            fontSize: '3.5rem', 
            marginBottom: '15px',
            filter: `drop-shadow(0 0 20px ${config.glowColor})`
          }}>
            📸
          </div>
          <h3 style={{ 
            margin: '0 0 10px 0', 
            color: config.textColor, 
            fontSize: '1.3rem',
            fontWeight: '800',
            textShadow: `0 0 20px ${config.shadowColor}`
          }}>
            Card Downloaded!
          </h3>
          <p style={{ 
            margin: 0, 
            color: 'rgba(255,255,255,0.7)', 
            fontSize: '0.85rem',
            lineHeight: '1.5'
          }}>
            Now open Instagram and share to your story 🔥
          </p>
        </div>

        <a
          href="instagram://story-camera"
          style={{
            display: 'block',
            padding: '16px',
            background: 'linear-gradient(45deg, #833AB4, #FD1D1D, #F77737)',
            borderRadius: '12px',
            color: '#fff',
            fontSize: '1rem',
            fontWeight: '800',
            textAlign: 'center',
            textDecoration: 'none',
            marginBottom: '12px',
            boxShadow: '0 8px 25px rgba(131, 58, 180, 0.4)',
            transition: 'transform 0.2s',
          }}
          onMouseEnter={(e) => e.target.style.transform = 'scale(1.02)'}
          onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
        >
          📱 Open Instagram
        </a>

        <button
          onClick={() => setShowShareModal(false)}
          style={{
            width: '100%',
            padding: '14px',
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '12px',
            color: 'rgba(255,255,255,0.7)',
            fontSize: '0.9rem',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.2s',
          }}
          onMouseEnter={(e) => {
            e.target.style.background = 'rgba(255,255,255,0.1)';
            e.target.style.color = '#fff';
          }}
          onMouseLeave={(e) => {
            e.target.style.background = 'rgba(255,255,255,0.05)';
            e.target.style.color = 'rgba(255,255,255,0.7)';
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
          borderRadius: '12px',
          padding: '12px 24px',
          color: '#fff',
          fontSize: '0.9rem',
          fontWeight: '700',
          zIndex: 10000,
          boxShadow: `0 0 30px ${config.shadowColor}`,
        }}>
          {shareMessage}
        </div>
      )}

      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '20px',
      }}>
        {/* ============================================ */}
        {/* THE CARD - Instagram Story Size (9:16) */}
        {/* ============================================ */}
        <div 
          ref={cardRef}
          style={{
            position: 'relative',
            width: '360px',
            height: '640px', // 9:16 ratio - PERFECT for IG story
            borderRadius: '20px',
            overflow: 'hidden',
            background: config.gradient,
            fontFamily: '"Inter", -apple-system, sans-serif',
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'scale(1)' : 'scale(0.95)',
            transition: 'all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)',
            boxShadow: `
              0 20px 60px rgba(0,0,0,0.5),
              0 0 80px ${config.shadowColor},
              inset 0 0 100px rgba(0,0,0,0.3)
            `,
          }}
        >
          
          {/* Noise Texture Overlay */}
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E")',
            opacity: 0.03,
            pointerEvents: 'none',
          }} />

          {/* Dark Overlay for Contrast */}
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(180deg, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.8) 100%)',
          }} />

          {/* Main Content Container */}
          <div style={{
            position: 'relative',
            zIndex: 10,
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
            padding: '30px 25px',
          }}>
            
            {/* Header Badge */}
            <div style={{
              textAlign: 'center',
              marginBottom: '20px',
            }}>
              <div style={{
                display: 'inline-block',
                padding: '8px 20px',
                background: `linear-gradient(135deg, ${config.glowColor}30, ${config.glowColor}10)`,
                border: `2px solid ${config.borderColor}`,
                borderRadius: '100px',
                fontSize: '0.7rem',
                fontWeight: '800',
                letterSpacing: '2px',
                color: config.textColor,
                textShadow: `0 0 15px ${config.shadowColor}`,
                boxShadow: `0 0 20px ${config.shadowColor}`,
              }}>
                {config.headerBadge}
              </div>
            </div>

            {/* Tier Icon */}
            <div style={{
              textAlign: 'center',
              marginBottom: '15px',
            }}>
              <div style={{
                fontSize: '4rem',
                filter: `drop-shadow(0 0 25px ${config.glowColor})`,
                animation: 'float 3s ease-in-out infinite',
              }}>
                {config.tierIcon}
              </div>
            </div>

            {/* Tier Label */}
            <div style={{
              textAlign: 'center',
              marginBottom: '25px',
            }}>
              <h1 style={{
                margin: '0',
                fontSize: '2.8rem',
                fontWeight: '900',
                letterSpacing: '6px',
                color: config.textColor,
                textShadow: `
                  0 0 30px ${config.glowColor},
                  0 0 60px ${config.glowColor},
                  0 4px 10px rgba(0,0,0,0.5)
                `,
                WebkitTextStroke: `1px ${config.borderColor}`,
              }}>
                {config.tierLabel}
              </h1>
            </div>

            {/* Aura Score - BIG */}
            <div style={{
              textAlign: 'center',
              marginBottom: '30px',
              padding: '20px',
              background: 'rgba(0,0,0,0.4)',
              borderRadius: '20px',
              border: `2px solid ${config.borderColor}40`,
            }}>
              <div style={{
                fontSize: '0.75rem',
                color: config.textColor,
                letterSpacing: '3px',
                fontWeight: '700',
                marginBottom: '10px',
                opacity: 0.8,
              }}>
                AURA SCORE
              </div>
              <div style={{
                fontSize: '5.5rem',
                fontWeight: '900',
                lineHeight: 1,
                color: config.textColor,
                textShadow: `
                  0 0 40px ${config.glowColor},
                  0 0 80px ${config.glowColor},
                  0 6px 15px rgba(0,0,0,0.6)
                `,
              }}>
                {aura.score}
              </div>
            </div>

            {/* Roast - BIGGER & BOLD (2-3 lines max) */}
            <div style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              marginBottom: '20px',
            }}>
              <div style={{
                background: 'rgba(0,0,0,0.5)',
                backdropFilter: 'blur(10px)',
                border: `2px solid ${config.borderColor}60`,
                borderRadius: '16px',
                padding: '20px',
                boxShadow: `
                  0 8px 30px rgba(0,0,0,0.6),
                  inset 0 0 30px rgba(255,255,255,0.05)
                `,
              }}>
                <p style={{
                  margin: 0,
                  fontSize: '1.3rem', // BIGGER (was 0.9rem)
                  lineHeight: 1.5,
                  fontWeight: '700', // BOLD
                  color: '#fff',
                  textAlign: 'center',
                  textShadow: '0 2px 8px rgba(0,0,0,0.8)',
                }}>
                  {aura.roast}
                </p>
              </div>
            </div>

            {/* Footer - Minimal */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '15px 0 0 0',
              borderTop: `1px solid ${config.borderColor}30`,
            }}>
              <div style={{
                fontSize: '0.65rem',
                color: config.textColor,
                fontWeight: '700',
                letterSpacing: '1px',
                opacity: 0.8,
              }}>
                {aura.challenge}
              </div>
              
              <div style={{
                fontSize: '0.6rem',
                color: 'rgba(255,255,255,0.5)',
                fontWeight: '600',
                letterSpacing: '0.5px',
              }}>
                AURAPRO
              </div>
            </div>
          </div>

          {/* Corner Accents - Minimal */}
          {[
            { top: '10px', left: '10px', borderTop: true, borderLeft: true },
            { top: '10px', right: '10px', borderTop: true, borderRight: true },
            { bottom: '10px', left: '10px', borderBottom: true, borderLeft: true },
            { bottom: '10px', right: '10px', borderBottom: true, borderRight: true },
          ].map((pos, i) => (
            <div key={i} style={{
              position: 'absolute',
              ...pos,
              width: '30px',
              height: '30px',
              borderColor: config.borderColor,
              borderStyle: 'solid',
              borderWidth: '0',
              ...(pos.borderTop && { borderTopWidth: '3px' }),
              ...(pos.borderBottom && { borderBottomWidth: '3px' }),
              ...(pos.borderLeft && { borderLeftWidth: '3px' }),
              ...(pos.borderRight && { borderRightWidth: '3px' }),
              boxShadow: `0 0 15px ${config.shadowColor}`,
              zIndex: 20,
            }} />
          ))}
        </div>

        {/* ============================================ */}
        {/* SHARE BUTTONS */}
        {/* ============================================ */}
        <div style={{ 
          width: '360px', 
          display: 'flex', 
          flexDirection: 'column', 
          gap: '12px' 
        }}>
          <button
            onClick={shareToInstagram}
            disabled={isSharing}
            style={{
              width: '100%',
              padding: '16px',
              background: 'linear-gradient(45deg, #833AB4, #FD1D1D, #F77737)',
              border: 'none',
              borderRadius: '14px',
              color: '#fff',
              fontSize: '1rem',
              fontWeight: '800',
              cursor: isSharing ? 'not-allowed' : 'pointer',
              opacity: isSharing ? 0.7 : 1,
              boxShadow: '0 8px 25px rgba(131, 58, 180, 0.4)',
              transition: 'all 0.2s',
              fontFamily: 'inherit',
            }}
            onMouseEnter={(e) => {
              if (!isSharing) e.target.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0)';
            }}
          >
            {isSharing ? '⏳ Processing...' : '📸 Share to Instagram Story'}
          </button>

          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              onClick={downloadCard}
              disabled={isSharing}
              style={{
                flex: 1,
                padding: '14px',
                background: 'rgba(255,255,255,0.08)',
                border: `2px solid ${config.borderColor}50`,
                borderRadius: '12px',
                color: '#fff',
                fontSize: '0.85rem',
                fontWeight: '700',
                cursor: 'pointer',
                transition: 'all 0.2s',
                fontFamily: 'inherit',
              }}
              onMouseEnter={(e) => {
                e.target.style.background = 'rgba(255,255,255,0.15)';
                e.target.style.borderColor = `${config.borderColor}80`;
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'rgba(255,255,255,0.08)';
                e.target.style.borderColor = `${config.borderColor}50`;
              }}
            >
              ⬇️ Download
            </button>

            <button
              onClick={copyLink}
              style={{
                flex: 1,
                padding: '14px',
                background: 'rgba(255,255,255,0.08)',
                border: `2px solid ${config.borderColor}50`,
                borderRadius: '12px',
                color: '#fff',
                fontSize: '0.85rem',
                fontWeight: '700',
                cursor: 'pointer',
                transition: 'all 0.2s',
                fontFamily: 'inherit',
              }}
              onMouseEnter={(e) => {
                e.target.style.background = 'rgba(255,255,255,0.15)';
                e.target.style.borderColor = `${config.borderColor}80`;
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'rgba(255,255,255,0.08)';
                e.target.style.borderColor = `${config.borderColor}50`;
              }}
            >
              🔗 Copy Link
            </button>
          </div>

          <p style={{
            textAlign: 'center',
            fontSize: '0.7rem',
            color: 'rgba(255,255,255,0.4)',
            margin: '5px 0 0 0',
            fontWeight: '600',
          }}>
            📱 Tag @aurapro on Instagram
          </p>
        </div>
      </div>

      {/* Animations */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
      `}</style>
    </>
  );
};

export default AuraCard;
