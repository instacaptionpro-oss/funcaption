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
      console.error('Error:', error);
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
        await navigator.share({ files: [file], title: `Aura: ${aura.rarity}` });
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
      await navigator.clipboard.writeText('https://aurapro.app');
      setShareMessage('✅ Copied!');
      setTimeout(() => setShareMessage(''), 2000);
    } catch {
      setShareMessage('❌ Failed');
    }
  };

  const getTierConfig = (rarity) => {
    const configs = {
      legendary: { color: '#FFD700', label: 'LEGENDARY', icon: '👑', badge: 'TOP 1%' },
      epic: { color: '#00FFFF', label: 'EPIC', icon: '⚡', badge: 'TOP 6%' },
      mid: { color: '#FFFFFF', label: 'MID', icon: '🔥', badge: 'AVERAGE' },
      noob: { color: '#FF8C00', label: 'NOOB', icon: '😬', badge: 'NEEDS WORK' },
      npc: { color: '#FF0000', label: 'BOT', icon: '💀', badge: 'BOTTOM 20%' },
    };
    return configs[rarity] || configs.npc;
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
        border: `2px solid ${config.color}`,
        boxShadow: `0 0 40px ${config.color}40`,
      }}>
        <div style={{ textAlign: 'center', marginBottom: '25px' }}>
          <div style={{ fontSize: '3.5rem', marginBottom: '15px' }}>📸</div>
          <h3 style={{ margin: '0 0 10px 0', color: config.color, fontSize: '1.3rem', fontWeight: '800' }}>
            Downloaded!
          </h3>
          <p style={{ margin: 0, color: '#999', fontSize: '0.85rem' }}>
            Open Instagram to share
          </p>
        </div>
        <a
          href="instagram://story-camera"
          style={{
            display: 'block',
            padding: '16px',
            background: 'linear-gradient(135deg, #833AB4, #FD1D1D, #F77737)',
            borderRadius: '12px',
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
            background: '#1a1a1a',
            border: '1px solid #333',
            borderRadius: '12px',
            color: '#999',
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
          border: `2px solid ${config.color}`,
          borderRadius: '12px',
          padding: '12px 24px',
          color: '#fff',
          fontSize: '0.9rem',
          fontWeight: '700',
          zIndex: 10000,
          boxShadow: `0 0 30px ${config.color}60`,
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
            boxShadow: `0 20px 60px rgba(0,0,0,0.8), 0 0 0 1px ${config.color}40`,
          }}
        >
          
          {/* CGI MICROCHIP CIRCUIT - RADIATING FROM CENTER */}
          <svg 
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              opacity: 0.2,
            }}
            viewBox="0 0 360 640"
          >
            {/* CENTRAL PROCESSOR AREA (where aura score will be) */}
            <rect x="100" y="250" width="160" height="140" fill="none" stroke={config.color} strokeWidth="2" opacity="0.3" />
            
            {/* CIRCUIT TRACES RADIATING FROM CENTER (like CGI chip) */}
            
            {/* TOP connections */}
            <line x1="180" y1="250" x2="180" y2="0" stroke={config.color} strokeWidth="2" opacity="0.5" />
            <line x1="150" y1="250" x2="60" y2="0" stroke={config.color} strokeWidth="1.5" opacity="0.4" />
            <line x1="210" y1="250" x2="300" y2="0" stroke={config.color} strokeWidth="1.5" opacity="0.4" />
            
            {/* BOTTOM connections */}
            <line x1="180" y1="390" x2="180" y2="640" stroke={config.color} strokeWidth="2" opacity="0.5" />
            <line x1="150" y1="390" x2="60" y2="640" stroke={config.color} strokeWidth="1.5" opacity="0.4" />
            <line x1="210" y1="390" x2="300" y2="640" stroke={config.color} strokeWidth="1.5" opacity="0.4" />
            
            {/* LEFT connections */}
            <line x1="100" y1="320" x2="0" y2="320" stroke={config.color} strokeWidth="2" opacity="0.5" />
            <line x1="100" y1="280" x2="0" y2="200" stroke={config.color} strokeWidth="1.5" opacity="0.4" />
            <line x1="100" y1="360" x2="0" y2="440" stroke={config.color} strokeWidth="1.5" opacity="0.4" />
            
            {/* RIGHT connections */}
            <line x1="260" y1="320" x2="360" y2="320" stroke={config.color} strokeWidth="2" opacity="0.5" />
            <line x1="260" y1="280" x2="360" y2="200" stroke={config.color} strokeWidth="1.5" opacity="0.4" />
            <line x1="260" y1="360" x2="360" y2="440" stroke={config.color} strokeWidth="1.5" opacity="0.4" />
            
            {/* DIAGONAL traces (CGI effect) */}
            <line x1="100" y1="250" x2="20" y2="100" stroke={config.color} strokeWidth="1" opacity="0.3" />
            <line x1="260" y1="250" x2="340" y2="100" stroke={config.color} strokeWidth="1" opacity="0.3" />
            <line x1="100" y1="390" x2="20" y2="540" stroke={config.color} strokeWidth="1" opacity="0.3" />
            <line x1="260" y1="390" x2="340" y2="540" stroke={config.color} strokeWidth="1" opacity="0.3" />
            
            {/* CONNECTION NODES (like solder points) */}
            {/* Top row */}
            {[60, 180, 300].map(x => (
              <circle key={`t${x}`} cx={x} cy="20" r="3" fill={config.color} opacity="0.6">
                <animate attributeName="opacity" values="0.6;1;0.6" dur="2s" repeatCount="indefinite" />
              </circle>
            ))}
            
            {/* Bottom row */}
            {[60, 180, 300].map(x => (
              <circle key={`b${x}`} cx={x} cy="620" r="3" fill={config.color} opacity="0.6">
                <animate attributeName="opacity" values="0.6;1;0.6" dur="2s" repeatCount="indefinite" begin="0.5s" />
              </circle>
            ))}
            
            {/* Side nodes */}
            {[200, 320, 440].map(y => (
              <circle key={`l${y}`} cx="20" cy={y} r="3" fill={config.color} opacity="0.6">
                <animate attributeName="opacity" values="0.6;1;0.6" dur="2s" repeatCount="indefinite" begin="1s" />
              </circle>
            ))}
            
            {[200, 320, 440].map(y => (
              <circle key={`r${y}`} cx="340" cy={y} r="3" fill={config.color} opacity="0.6">
                <animate attributeName="opacity" values="0.6;1;0.6" dur="2s" repeatCount="indefinite" begin="1.5s" />
              </circle>
            ))}
            
            {/* Central processor corners */}
            <circle cx="100" cy="250" r="4" fill={config.color} opacity="0.8" />
            <circle cx="260" cy="250" r="4" fill={config.color} opacity="0.8" />
            <circle cx="100" cy="390" r="4" fill={config.color} opacity="0.8" />
            <circle cx="260" cy="390" r="4" fill={config.color} opacity="0.8" />
            
            {/* Fine grid pattern inside processor area */}
            {[110, 130, 150, 170, 190, 210, 230, 250].map(x => (
              <line key={`vg${x}`} x1={x} y1="260" x2={x} y2="380" stroke={config.color} strokeWidth="0.5" opacity="0.15" />
            ))}
            {[260, 280, 300, 320, 340, 360, 380].map(y => (
              <line key={`hg${y}`} x1="110" y1={y} x2="250" y2={y} stroke={config.color} strokeWidth="0.5" opacity="0.15" />
            ))}
          </svg>

          {/* Dark overlay */}
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'radial-gradient(circle at center, transparent 30%, #000000 100%)',
          }} />

          {/* CONTENT */}
          <div style={{
            position: 'relative',
            zIndex: 10,
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
            padding: '28px 20px',
          }}>
            
            {/* Header Badge */}
            <div style={{
              textAlign: 'center',
              marginBottom: '18px',
            }}>
              <div style={{
                display: 'inline-block',
                padding: '8px 20px',
                background: `${config.color}15`,
                border: `1px solid ${config.color}`,
                borderRadius: '100px',
                fontSize: '0.7rem',
                fontWeight: '800',
                letterSpacing: '2px',
                color: config.color,
                textShadow: `0 0 10px ${config.color}`,
              }}>
                {config.badge}
              </div>
            </div>

            {/* Tier Icon + Label */}
            <div style={{
              textAlign: 'center',
              marginBottom: '18px',
            }}>
              <div style={{
                fontSize: '2.8rem',
                marginBottom: '8px',
                filter: `drop-shadow(0 0 15px ${config.color})`,
              }}>
                {config.icon}
              </div>
              <h1 style={{
                margin: 0,
                fontSize: '2rem',
                fontWeight: '900',
                letterSpacing: '5px',
                color: config.color,
                textShadow: `0 0 20px ${config.color}`,
              }}>
                {config.label}
              </h1>
            </div>

            {/* AURA SCORE - CENTRAL PROCESSOR */}
            <div style={{
              textAlign: 'center',
              marginBottom: '20px',
              padding: '28px 20px',
              background: 'rgba(0,0,0,0.8)',
              borderRadius: '16px',
              border: `2px solid ${config.color}`,
              boxShadow: `
                0 0 30px ${config.color}60,
                inset 0 0 30px ${config.color}20
              `,
              position: 'relative',
            }}>
              {/* Corner pins like actual chip */}
              {[
                {top: '-4px', left: '-4px'},
                {top: '-4px', right: '-4px'},
                {bottom: '-4px', left: '-4px'},
                {bottom: '-4px', right: '-4px'},
              ].map((pos, i) => (
                <div key={i} style={{
                  position: 'absolute',
                  ...pos,
                  width: '8px',
                  height: '8px',
                  background: config.color,
                  borderRadius: '50%',
                  boxShadow: `0 0 8px ${config.color}`,
                }} />
              ))}
              
              <div style={{
                fontSize: '0.65rem',
                color: config.color,
                letterSpacing: '3px',
                fontWeight: '700',
                marginBottom: '10px',
                opacity: 0.8,
              }}>
                AURA CORE
              </div>
              <div style={{
                fontSize: '5rem',
                fontWeight: '900',
                lineHeight: 1,
                color: config.color,
                textShadow: `
                  0 0 40px ${config.color},
                  0 0 80px ${config.color}
                `,
              }}>
                {aura.score}
              </div>
              <div style={{
                width: '50px',
                height: '2px',
                background: config.color,
                margin: '12px auto 0',
                boxShadow: `0 0 10px ${config.color}`,
              }} />
            </div>

            {/* ROAST BOX - BELOW PROCESSOR, FULLY VISIBLE */}
            <div style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'flex-start',
              marginBottom: '18px',
            }}>
              <div style={{
                background: 'rgba(0,0,0,0.6)',
                border: `1px solid ${config.color}40`,
                borderRadius: '12px',
                padding: '20px 18px 24px 18px',
                position: 'relative',
              }}>
                <div style={{
                  position: 'absolute',
                  top: '-8px',
                  left: '14px',
                  background: '#000',
                  padding: '0 6px',
                  color: config.color,
                  fontSize: '1rem',
                  opacity: 0.7,
                }}>
                  💬
                </div>
                
                <p style={{
                  margin: 0,
                  fontSize: '1.1rem',
                  lineHeight: 1.75,
                  fontWeight: '600',
                  color: '#fff',
                  textAlign: 'center',
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
              padding: '14px 0 0 0',
              borderTop: `1px solid ${config.color}30`,
            }}>
              <div style={{
                fontSize: '0.6rem',
                color: config.color,
                fontWeight: '700',
                letterSpacing: '1px',
                opacity: 0.7,
              }}>
                {aura.challenge}
              </div>
              
              <div style={{
                fontSize: '0.55rem',
                color: '#555',
                fontWeight: '600',
                letterSpacing: '0.5px',
              }}>
                AURAPRO
              </div>
            </div>
          </div>

          {/* Technical corner brackets */}
          {[
            { top: '8px', left: '8px' },
            { top: '8px', right: '8px' },
            { bottom: '8px', left: '8px' },
            { bottom: '8px', right: '8px' },
          ].map((pos, i) => (
            <div key={i} style={{
              position: 'absolute',
              ...pos,
              width: '16px',
              height: '16px',
              border: `1.5px solid ${config.color}`,
              ...(pos.top && pos.left && { borderRight: 'none', borderBottom: 'none' }),
              ...(pos.top && pos.right && { borderLeft: 'none', borderBottom: 'none' }),
              ...(pos.bottom && pos.left && { borderRight: 'none', borderTop: 'none' }),
              ...(pos.bottom && pos.right && { borderLeft: 'none', borderTop: 'none' }),
              opacity: 0.5,
            }} />
          ))}
        </div>

        {/* SHARE BUTTONS */}
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
              background: 'linear-gradient(135deg, #833AB4, #FD1D1D, #F77737)',
              border: 'none',
              borderRadius: '12px',
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
              style={{
                flex: 1,
                padding: '14px',
                background: '#1a1a1a',
                border: `1px solid ${config.color}60`,
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
                background: '#1a1a1a',
                border: `1px solid ${config.color}60`,
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

          <p style={{
            textAlign: 'center',
            fontSize: '0.7rem',
            color: '#666',
            margin: '5px 0 0 0',
            fontWeight: '600',
          }}>
            Tag @aurapro
          </p>
        </div>
      </div>
    </>
  );
};

export default AuraCard;
