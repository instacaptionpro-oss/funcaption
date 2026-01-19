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
        backgroundColor: '#000000',
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
          primaryColor: '#FFD700',
          secondaryColor: '#FFA500',
          glowColor: 'rgba(255, 215, 0, 0.6)',
          tierLabel: "LEGENDARY",
          tierIcon: "👑",
        };
      case 'epic':
        return {
          primaryColor: '#00FFFF',
          secondaryColor: '#1E90FF',
          glowColor: 'rgba(0, 255, 255, 0.6)',
          tierLabel: "EPIC",
          tierIcon: "⚡",
        };
      case 'mid':
        return {
          primaryColor: '#FFFFFF',
          secondaryColor: '#BDBDBD',
          glowColor: 'rgba(255, 255, 255, 0.5)',
          tierLabel: "MID",
          tierIcon: "🔥",
        };
      case 'noob':
        return {
          primaryColor: '#FF8C00',
          secondaryColor: '#FF6347',
          glowColor: 'rgba(255, 140, 0, 0.6)',
          tierLabel: "NOOB",
          tierIcon: "😬",
        };
      case 'npc':
      default:
        return {
          primaryColor: '#FF0000',
          secondaryColor: '#DC143C',
          glowColor: 'rgba(255, 0, 0, 0.7)',
          tierLabel: "BOT",
          tierIcon: "💀",
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
    }}>
      <div style={{
        background: '#0a0a0a',
        borderRadius: '20px',
        padding: '30px',
        maxWidth: '340px',
        width: '100%',
        border: `2px solid ${config.primaryColor}`,
        boxShadow: `0 0 40px ${config.glowColor}`,
      }}>
        <div style={{ textAlign: 'center', marginBottom: '25px' }}>
          <div style={{ fontSize: '3.5rem', marginBottom: '15px' }}>📸</div>
          <h3 style={{ 
            margin: '0 0 10px 0', 
            color: config.primaryColor, 
            fontSize: '1.3rem',
            fontWeight: '800',
          }}>
            Card Downloaded!
          </h3>
          <p style={{ margin: 0, color: 'rgba(255,255,255,0.7)', fontSize: '0.85rem' }}>
            Open Instagram & share to your story
          </p>
        </div>

        <a
          href="instagram://story-camera"
          style={{
            display: 'block',
            padding: '16px',
            background: 'linear-gradient(135deg, #833AB4, #FD1D1D, #F77737)',
            borderRadius: '14px',
            color: '#fff',
            fontSize: '1rem',
            fontWeight: '800',
            textAlign: 'center',
            textDecoration: 'none',
            marginBottom: '12px',
          }}
        >
          📱 Open Instagram
        </a>

        <button
          onClick={() => setShowShareModal(false)}
          style={{
            width: '100%',
            padding: '14px',
            background: 'rgba(255,255,255,0.1)',
            border: '1px solid rgba(255,255,255,0.2)',
            borderRadius: '12px',
            color: '#fff',
            fontSize: '0.9rem',
            fontWeight: '600',
            cursor: 'pointer',
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
          border: `2px solid ${config.primaryColor}`,
          borderRadius: '12px',
          padding: '12px 24px',
          color: '#fff',
          fontSize: '0.9rem',
          fontWeight: '700',
          zIndex: 10000,
          boxShadow: `0 0 30px ${config.glowColor}`,
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
        {/* THE CARD */}
        <div 
          ref={cardRef}
          style={{
            position: 'relative',
            width: '360px',
            height: '640px',
            borderRadius: '20px',
            overflow: 'hidden',
            background: '#000000',
            fontFamily: '"Inter", -apple-system, sans-serif',
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'scale(1)' : 'scale(0.95)',
            transition: 'all 0.5s ease',
            boxShadow: `0 20px 60px rgba(0,0,0,0.8), 0 0 100px ${config.glowColor}`,
          }}
        >
          
          {/* Circuit Board Pattern Background */}
          <svg style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            opacity: 0.15,
          }}>
            <defs>
              <pattern id="circuit" x="0" y="0" width="80" height="80" patternUnits="userSpaceOnUse">
                {/* Horizontal lines */}
                <line x1="0" y1="20" x2="80" y2="20" stroke={config.primaryColor} strokeWidth="1"/>
                <line x1="0" y1="60" x2="80" y2="60" stroke={config.primaryColor} strokeWidth="1"/>
                {/* Vertical lines */}
                <line x1="20" y1="0" x2="20" y2="80" stroke={config.primaryColor} strokeWidth="1"/>
                <line x1="60" y1="0" x2="60" y2="80" stroke={config.primaryColor} strokeWidth="1"/>
                {/* Connection points */}
                <circle cx="20" cy="20" r="2" fill={config.primaryColor}/>
                <circle cx="60" cy="20" r="2" fill={config.primaryColor}/>
                <circle cx="20" cy="60" r="2" fill={config.primaryColor}/>
                <circle cx="60" cy="60" r="2" fill={config.primaryColor}/>
                {/* Small traces */}
                <line x1="20" y1="20" x2="40" y2="40" stroke={config.primaryColor} strokeWidth="0.5" opacity="0.5"/>
                <line x1="60" y1="20" x2="40" y2="40" stroke={config.primaryColor} strokeWidth="0.5" opacity="0.5"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#circuit)"/>
          </svg>

          {/* Glow Lines (Microchip Wires) */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '1px',
            background: `linear-gradient(90deg, transparent, ${config.primaryColor}, transparent)`,
            boxShadow: `0 0 10px ${config.glowColor}`,
          }} />
          <div style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '1px',
            background: `linear-gradient(90deg, transparent, ${config.primaryColor}, transparent)`,
            boxShadow: `0 0 10px ${config.glowColor}`,
          }} />

          {/* Content */}
          <div style={{
            position: 'relative',
            zIndex: 10,
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
            padding: '28px 24px',
          }}>
            
            {/* Tier Icon */}
            <div style={{
              textAlign: 'center',
              marginBottom: '12px',
            }}>
              <div style={{
                fontSize: '3.5rem',
                filter: `drop-shadow(0 0 20px ${config.primaryColor})`,
              }}>
                {config.tierIcon}
              </div>
            </div>

            {/* Tier Label */}
            <div style={{
              textAlign: 'center',
              marginBottom: '20px',
            }}>
              <h1 style={{
                margin: '0',
                fontSize: '2.5rem',
                fontWeight: '900',
                letterSpacing: '6px',
                color: config.primaryColor,
                textShadow: `0 0 30px ${config.glowColor}, 0 0 60px ${config.glowColor}`,
              }}>
                {config.tierLabel}
              </h1>
            </div>

            {/* Score */}
            <div style={{
              textAlign: 'center',
              marginBottom: '24px',
              padding: '20px',
              background: 'rgba(0,0,0,0.6)',
              borderRadius: '16px',
              border: `2px solid ${config.primaryColor}40`,
            }}>
              <div style={{
                fontSize: '0.7rem',
                color: config.primaryColor,
                letterSpacing: '3px',
                fontWeight: '700',
                marginBottom: '8px',
                opacity: 0.8,
              }}>
                AURA SCORE
              </div>
              <div style={{
                fontSize: '5rem',
                fontWeight: '900',
                lineHeight: 1,
                color: config.primaryColor,
                textShadow: `0 0 40px ${config.glowColor}`,
              }}>
                {aura.score}
              </div>
            </div>

            {/* Roast Box - MAXIMUM VISIBILITY */}
            <div style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              marginBottom: '20px',
              minHeight: '180px',
            }}>
              <div style={{
                background: 'rgba(0,0,0,0.7)',
                border: `2px solid ${config.primaryColor}60`,
                borderRadius: '16px',
                padding: '28px 20px',
                boxShadow: `0 0 30px ${config.glowColor}`,
              }}>
                <div style={{
                  fontSize: '0.8rem',
                  color: config.primaryColor,
                  marginBottom: '12px',
                  textAlign: 'center',
                  opacity: 0.7,
                  letterSpacing: '2px',
                  fontWeight: '600',
                }}>
                  💬 ROAST
                </div>
                
                <p style={{
                  margin: 0,
                  fontSize: '1.25rem',
                  lineHeight: 1.75,
                  fontWeight: '700',
                  color: '#FFFFFF',
                  textAlign: 'center',
                  textShadow: '0 2px 10px rgba(0,0,0,0.8)',
                  wordWrap: 'break-word',
                  overflowWrap: 'break-word',
                  whiteSpace: 'pre-wrap',
                }}>
                  {aura.roast}
                </p>
              </div>
            </div>

            {/* Footer */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '16px 0 0 0',
              borderTop: `1px solid ${config.primaryColor}30`,
            }}>
              <div style={{
                fontSize: '0.65rem',
                color: config.primaryColor,
                fontWeight: '700',
                letterSpacing: '1px',
                opacity: 0.8,
              }}>
                {aura.challenge}
              </div>
              
              <div style={{
                fontSize: '0.6rem',
                color: 'rgba(255,255,255,0.4)',
                fontWeight: '600',
              }}>
                AURAPRO
              </div>
            </div>
          </div>

          {/* Corner Accents */}
          {[
            { top: '10px', left: '10px' },
            { top: '10px', right: '10px' },
            { bottom: '10px', left: '10px' },
            { bottom: '10px', right: '10px' },
          ].map((pos, i) => (
            <div key={i} style={{
              position: 'absolute',
              ...pos,
              width: '20px',
              height: '20px',
              border: `2px solid ${config.primaryColor}`,
              borderRight: pos.left ? 'none' : undefined,
              borderLeft: pos.right ? 'none' : undefined,
              borderBottom: pos.top ? 'none' : undefined,
              borderTop: pos.bottom ? 'none' : undefined,
              boxShadow: `0 0 10px ${config.glowColor}`,
              zIndex: 20,
            }} />
          ))}
        </div>

        {/* Share Buttons */}
        <div style={{ width: '360px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <button
            onClick={shareToInstagram}
            disabled={isSharing}
            style={{
              width: '100%',
              padding: '16px',
              background: 'linear-gradient(135deg, #833AB4, #FD1D1D, #F77737)',
              border: 'none',
              borderRadius: '14px',
              color: '#fff',
              fontSize: '1rem',
              fontWeight: '800',
              cursor: isSharing ? 'not-allowed' : 'pointer',
              opacity: isSharing ? 0.7 : 1,
              fontFamily: 'inherit',
            }}
          >
            {isSharing ? '⏳ Processing...' : '📸 Share to Instagram'}
          </button>

          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              onClick={downloadCard}
              disabled={isSharing}
              style={{
                flex: 1,
                padding: '14px',
                background: 'rgba(255,255,255,0.1)',
                border: `2px solid ${config.primaryColor}50`,
                borderRadius: '12px',
                color: '#fff',
                fontSize: '0.85rem',
                fontWeight: '700',
                cursor: 'pointer',
                fontFamily: 'inherit',
              }}
            >
              ⬇️ Download
            </button>

            <button
              onClick={copyLink}
              style={{
                flex: 1,
                padding: '14px',
                background: 'rgba(255,255,255,0.1)',
                border: `2px solid ${config.primaryColor}50`,
                borderRadius: '12px',
                color: '#fff',
                fontSize: '0.85rem',
                fontWeight: '700',
                cursor: 'pointer',
                fontFamily: 'inherit',
              }}
            >
              🔗 Copy
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default AuraCard;
