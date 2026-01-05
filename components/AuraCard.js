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
        backgroundColor: '#0a0a0a',
        scale: 2,
        useCORS: true,
        logging: false,
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
        link.download = `aura-card-${aura.rarity}-${Date.now()}.png`;
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
      const file = new File([blob], 'aura-card.png', { type: 'image/png' });

      if (navigator.share && navigator.canShare?.({ files: [file] })) {
        await navigator.share({ files: [file], title: `My Aura: ${aura.rarity.toUpperCase()}` });
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
      await navigator.clipboard.writeText('https://aura-roast.com');
      setShareMessage('✅ Link copied!');
      setTimeout(() => setShareMessage(''), 2000);
    } catch {
      setShareMessage('❌ Failed to copy');
    }
  };

  // ============================================
  // TIER CONFIG
  // ============================================
  const getTierConfig = (rarity) => {
    switch (rarity) {
      case 'legendary':
        return {
          color: '#FFD700',
          colorRGB: '255, 215, 0',
          headerText: "👑 THE TOP 1% 👑",
          tierLabel: "LEGENDARY",
          tierSubtext: "YOU ARE THE STANDARD",
          tierIcon: "👑",
          motivationText: "Others wish they were you.",
        };
      case 'epic':
        return {
          color: '#00FFFF',
          colorRGB: '0, 255, 255',
          headerText: "⚡ TOP 6% - RARE ⚡",
          tierLabel: "EPIC",
          tierSubtext: "BUILT DIFFERENT",
          tierIcon: "⚡",
          motivationText: "One step below God.",
        };
      case 'mid':
        return {
          color: '#FFFFFF',
          colorRGB: '255, 255, 255',
          headerText: "YOU'RE... OKAY",
          tierLabel: "MID",
          tierSubtext: "MAIN CHARACTER... KINDA",
          tierIcon: "🔥",
          motivationText: "Average. Like everyone else.",
        };
      case 'noob':
        return {
          color: '#FF8C00',
          colorRGB: '255, 140, 0',
          headerText: "⚠️ NEEDS WORK ⚠️",
          tierLabel: "NOOB",
          tierSubtext: "POTENTIAL_NOT_FOUND",
          tierIcon: "💀",
          motivationText: "// warning: aura_weak",
        };
      case 'npc':
      default:
        return {
          color: '#FF0000',
          colorRGB: '255, 0, 0',
          headerText: "// CRITICAL_ERROR",
          tierLabel: "NPC",
          tierSubtext: "EXISTENCE_404",
          tierIcon: "💀",
          motivationText: "// fatal: you_dont_matter",
        };
    }
  };

  const config = getTierConfig(aura.rarity);

  // ============================================
  // CYBERNETIC HUD BORDER (Static & Lightweight)
  // ============================================
  const CyberneticBorder = () => (
    <>
      {/* Outer Glow - Static */}
      <div style={{
        position: 'absolute',
        top: '-4px',
        left: '-4px',
        right: '-4px',
        bottom: '-4px',
        borderRadius: '20px',
        boxShadow: `
          0 0 20px rgba(${config.colorRGB}, 0.4),
          0 0 40px rgba(${config.colorRGB}, 0.2),
          inset 0 0 20px rgba(${config.colorRGB}, 0.05)
        `,
        zIndex: 1
      }} />

      {/* Main Border */}
      <div style={{
        position: 'absolute',
        top: '-2px',
        left: '-2px',
        right: '-2px',
        bottom: '-2px',
        borderRadius: '18px',
        border: `2px solid ${config.color}`,
        boxShadow: `0 0 10px rgba(${config.colorRGB}, 0.5)`,
        zIndex: 2
      }} />

      {/* Inner Dark Background */}
      <div style={{
        position: 'absolute',
        top: '0',
        left: '0',
        right: '0',
        bottom: '0',
        borderRadius: '16px',
        background: 'linear-gradient(180deg, #0a0a0a 0%, #050505 100%)',
        zIndex: 3
      }} />

      {/* Top HUD Line */}
      <div style={{
        position: 'absolute',
        top: '8px',
        left: '20px',
        right: '20px',
        height: '1px',
        background: `linear-gradient(90deg, transparent, ${config.color}, transparent)`,
        boxShadow: `0 0 8px rgba(${config.colorRGB}, 0.6)`,
        zIndex: 10
      }} />

      {/* Bottom HUD Line */}
      <div style={{
        position: 'absolute',
        bottom: '8px',
        left: '20px',
        right: '20px',
        height: '1px',
        background: `linear-gradient(90deg, transparent, ${config.color}, transparent)`,
        boxShadow: `0 0 8px rgba(${config.colorRGB}, 0.6)`,
        zIndex: 10
      }} />

      {/* Corner Brackets - Top Left */}
      <div style={{
        position: 'absolute',
        top: '6px',
        left: '6px',
        width: '20px',
        height: '20px',
        borderTop: `2px solid ${config.color}`,
        borderLeft: `2px solid ${config.color}`,
        boxShadow: `
          -2px -2px 8px rgba(${config.colorRGB}, 0.4),
          inset 1px 1px 4px rgba(${config.colorRGB}, 0.2)
        `,
        zIndex: 10
      }} />

      {/* Corner Brackets - Top Right */}
      <div style={{
        position: 'absolute',
        top: '6px',
        right: '6px',
        width: '20px',
        height: '20px',
        borderTop: `2px solid ${config.color}`,
        borderRight: `2px solid ${config.color}`,
        boxShadow: `
          2px -2px 8px rgba(${config.colorRGB}, 0.4),
          inset -1px 1px 4px rgba(${config.colorRGB}, 0.2)
        `,
        zIndex: 10
      }} />

      {/* Corner Brackets - Bottom Left */}
      <div style={{
        position: 'absolute',
        bottom: '6px',
        left: '6px',
        width: '20px',
        height: '20px',
        borderBottom: `2px solid ${config.color}`,
        borderLeft: `2px solid ${config.color}`,
        boxShadow: `
          -2px 2px 8px rgba(${config.colorRGB}, 0.4),
          inset 1px -1px 4px rgba(${config.colorRGB}, 0.2)
        `,
        zIndex: 10
      }} />

      {/* Corner Brackets - Bottom Right */}
      <div style={{
        position: 'absolute',
        bottom: '6px',
        right: '6px',
        width: '20px',
        height: '20px',
        borderBottom: `2px solid ${config.color}`,
        borderRight: `2px solid ${config.color}`,
        boxShadow: `
          2px 2px 8px rgba(${config.colorRGB}, 0.4),
          inset -1px -1px 4px rgba(${config.colorRGB}, 0.2)
        `,
        zIndex: 10
      }} />

      {/* Corner Dots */}
      {[
        { top: '12px', left: '12px' },
        { top: '12px', right: '12px' },
        { bottom: '12px', left: '12px' },
        { bottom: '12px', right: '12px' }
      ].map((pos, i) => (
        <div key={i} style={{
          position: 'absolute',
          ...pos,
          width: '4px',
          height: '4px',
          background: config.color,
          borderRadius: '50%',
          boxShadow: `0 0 6px ${config.color}`,
          zIndex: 11
        }} />
      ))}

      {/* Side Accent Lines - Left */}
      <div style={{
        position: 'absolute',
        left: '4px',
        top: '50%',
        transform: 'translateY(-50%)',
        width: '2px',
        height: '60px',
        background: `linear-gradient(180deg, transparent, ${config.color}, transparent)`,
        boxShadow: `0 0 6px rgba(${config.colorRGB}, 0.5)`,
        zIndex: 10
      }} />

      {/* Side Accent Lines - Right */}
      <div style={{
        position: 'absolute',
        right: '4px',
        top: '50%',
        transform: 'translateY(-50%)',
        width: '2px',
        height: '60px',
        background: `linear-gradient(180deg, transparent, ${config.color}, transparent)`,
        boxShadow: `0 0 6px rgba(${config.colorRGB}, 0.5)`,
        zIndex: 10
      }} />

      {/* Tech Pattern - Top */}
      <svg style={{
        position: 'absolute',
        top: '15px',
        left: '30px',
        width: '60px',
        height: '12px',
        zIndex: 10
      }} viewBox="0 0 60 12">
        <rect x="0" y="5" width="8" height="2" fill={config.color} opacity="0.6"/>
        <rect x="12" y="5" width="4" height="2" fill={config.color} opacity="0.8"/>
        <rect x="20" y="5" width="12" height="2" fill={config.color} opacity="0.4"/>
        <rect x="36" y="5" width="6" height="2" fill={config.color} opacity="0.6"/>
        <rect x="46" y="5" width="14" height="2" fill={config.color} opacity="0.3"/>
      </svg>

      {/* Tech Pattern - Bottom */}
      <svg style={{
        position: 'absolute',
        bottom: '15px',
        right: '30px',
        width: '60px',
        height: '12px',
        zIndex: 10
      }} viewBox="0 0 60 12">
        <rect x="0" y="5" width="14" height="2" fill={config.color} opacity="0.3"/>
        <rect x="18" y="5" width="6" height="2" fill={config.color} opacity="0.6"/>
        <rect x="28" y="5" width="12" height="2" fill={config.color} opacity="0.4"/>
        <rect x="44" y="5" width="4" height="2" fill={config.color} opacity="0.8"/>
        <rect x="52" y="5" width="8" height="2" fill={config.color} opacity="0.6"/>
      </svg>

      {/* Legendary Crown */}
      {aura.rarity === 'legendary' && (
        <div style={{
          position: 'absolute',
          top: '-25px',
          left: '50%',
          transform: 'translateX(-50%)',
          fontSize: '35px',
          filter: `drop-shadow(0 0 10px ${config.color})`,
          zIndex: 20
        }}>
          👑
        </div>
      )}
    </>
  );

  // ============================================
  // SHARE MODAL
  // ============================================
  const ShareModal = () => (
    <div style={{
      position: 'fixed',
      top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(0,0,0,0.9)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
      padding: '20px',
    }}>
      <div style={{
        background: '#1a1a1a',
        borderRadius: '16px',
        padding: '25px',
        maxWidth: '320px',
        width: '100%',
        border: `1px solid ${config.color}50`,
      }}>
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <span style={{ fontSize: '2.5rem' }}>📸</span>
          <h3 style={{ margin: '10px 0', color: config.color, fontSize: '1.1rem' }}>
            Share to Instagram
          </h3>
          <p style={{ margin: 0, color: 'rgba(255,255,255,0.6)', fontSize: '0.8rem' }}>
            Card downloaded! Open Instagram to share.
          </p>
        </div>

        <a
          href="instagram://app"
          style={{
            display: 'block',
            padding: '12px',
            background: 'linear-gradient(45deg, #833AB4, #FD1D1D, #F77737)',
            borderRadius: '10px',
            color: '#fff',
            fontSize: '0.9rem',
            fontWeight: '700',
            textAlign: 'center',
            textDecoration: 'none',
            marginBottom: '10px',
          }}
        >
          📱 Open Instagram
        </a>

        <button
          onClick={() => setShowShareModal(false)}
          style={{
            width: '100%',
            padding: '10px',
            background: 'rgba(255,255,255,0.1)',
            border: 'none',
            borderRadius: '10px',
            color: '#fff',
            fontSize: '0.85rem',
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
          border: `1px solid ${config.color}`,
          borderRadius: '10px',
          padding: '10px 20px',
          color: '#fff',
          fontSize: '0.85rem',
          fontWeight: '600',
          zIndex: 10000,
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
            width: '340px',
            minHeight: '620px',
            borderRadius: '16px',
            overflow: 'visible',
            background: 'transparent',
            color: '#FFFFFF',
            fontFamily: aura.rarity === 'legendary' ? '"Cinzel", serif' : 
                        aura.rarity === 'npc' || aura.rarity === 'noob' ? '"Courier New", monospace' : 
                        '"Inter", sans-serif',
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
            transition: 'opacity 0.4s, transform 0.4s',
          }}
        >
          
          {/* Cybernetic Border */}
          <CyberneticBorder />
          
          {/* CONTENT */}
          <div style={{
            position: 'relative',
            zIndex: 15,
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
            minHeight: '620px',
            padding: '25px 20px',
          }}>
            
            {/* Header */}
            <div style={{
              textAlign: 'center',
              padding: '12px 0',
              marginBottom: '10px',
              background: `linear-gradient(90deg, transparent, rgba(${config.colorRGB}, 0.15), transparent)`,
              borderRadius: '6px',
            }}>
              <span style={{
                fontSize: '0.75rem',
                fontWeight: '700',
                letterSpacing: '2px',
                color: config.color,
                textShadow: `0 0 10px rgba(${config.colorRGB}, 0.5)`,
              }}>
                {config.headerText}
              </span>
            </div>

            {/* Tier Icon & Label */}
            <div style={{ textAlign: 'center', marginBottom: '15px' }}>
              <div style={{
                fontSize: '2.5rem',
                marginBottom: '8px',
                filter: `drop-shadow(0 0 15px ${config.color})`,
              }}>
                {config.tierIcon}
              </div>
              
              <h1 style={{
                margin: '0',
                fontSize: '2.2rem',
                fontWeight: '900',
                letterSpacing: '5px',
                color: config.color,
                textShadow: `0 0 20px ${config.color}`,
              }}>
                {config.tierLabel}
              </h1>
              
              <p style={{
                margin: '8px 0 0 0',
                fontSize: '0.65rem',
                letterSpacing: '2px',
                color: `rgba(${config.colorRGB}, 0.7)`,
              }}>
                {config.tierSubtext}
              </p>
            </div>

            {/* Score */}
            <div style={{
              textAlign: 'center',
              margin: '20px 0',
            }}>
              <div style={{
                fontSize: '4.5rem',
                fontWeight: '900',
                lineHeight: 1,
                color: config.color,
                textShadow: `0 0 30px ${config.color}`,
              }}>
                {aura.score}
              </div>
              
              <div style={{
                fontSize: '0.65rem',
                color: config.color,
                letterSpacing: '3px',
                marginTop: '8px',
                opacity: 0.7,
              }}>
                AURA SCORE
              </div>
            </div>

            {/* Roast Box */}
            <div style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
            }}>
              <div style={{
                background: `rgba(${config.colorRGB}, 0.08)`,
                border: `1px solid rgba(${config.colorRGB}, 0.3)`,
                borderRadius: '10px',
                padding: '16px',
                position: 'relative',
              }}>
                <div style={{
                  position: 'absolute',
                  top: '-10px',
                  left: '16px',
                  background: '#0a0a0a',
                  padding: '0 8px',
                  color: config.color,
                  fontSize: '0.9rem',
                }}>
                  💬
                </div>
                
                <p style={{
                  margin: 0,
                  fontSize: '0.9rem',
                  lineHeight: 1.6,
                  color: 'rgba(255,255,255,0.9)',
                  fontStyle: 'italic',
                }}>
                  {aura.roast}
                </p>
              </div>
            </div>

            {/* Motivation */}
            <div style={{
              textAlign: 'center',
              marginTop: '15px',
              padding: '10px',
              borderTop: `1px solid rgba(${config.colorRGB}, 0.2)`,
            }}>
              <p style={{
                margin: 0,
                fontSize: '0.75rem',
                color: config.color,
                fontWeight: '600',
              }}>
                {config.motivationText}
              </p>
            </div>

            {/* Footer */}
            <div style={{
              marginTop: '12px',
              padding: '8px 0',
              borderTop: `1px solid rgba(${config.colorRGB}, 0.15)`,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
              <div style={{
                fontSize: '0.5rem',
                color: config.color,
                letterSpacing: '1px',
                maxWidth: '55%',
                lineHeight: 1.3,
                opacity: 0.7,
              }}>
                {aura.challenge}
              </div>
              
              <div style={{
                fontSize: '0.55rem',
                color: 'rgba(255,255,255,0.3)',
                letterSpacing: '1px',
              }}>
                aura-roast.com
              </div>
            </div>
          </div>
        </div>

        {/* SHARE BUTTONS */}
        <div style={{ width: '340px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <button
            onClick={shareToInstagram}
            disabled={isSharing}
            style={{
              width: '100%',
              padding: '12px',
              background: 'linear-gradient(45deg, #833AB4, #FD1D1D, #F77737)',
              border: 'none',
              borderRadius: '10px',
              color: '#fff',
              fontSize: '0.9rem',
              fontWeight: '700',
              cursor: isSharing ? 'wait' : 'pointer',
              opacity: isSharing ? 0.7 : 1,
            }}
          >
            {isSharing ? '⏳ Processing...' : '📸 Share to Instagram'}
          </button>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              onClick={downloadCard}
              disabled={isSharing}
              style={{
                flex: 1,
                padding: '10px',
                background: 'rgba(255,255,255,0.1)',
                border: `1px solid rgba(${config.colorRGB}, 0.4)`,
                borderRadius: '10px',
                color: '#fff',
                fontSize: '0.8rem',
                fontWeight: '600',
                cursor: 'pointer',
              }}
            >
              ⬇️ Download
            </button>

            <button
              onClick={copyLink}
              style={{
                flex: 1,
                padding: '10px',
                background: 'rgba(255,255,255,0.1)',
                border: `1px solid rgba(${config.colorRGB}, 0.4)`,
                borderRadius: '10px',
                color: '#fff',
                fontSize: '0.8rem',
                fontWeight: '600',
                cursor: 'pointer',
              }}
            >
              🔗 Copy Link
            </button>
          </div>

          <p style={{
            textAlign: 'center',
            fontSize: '0.65rem',
            color: 'rgba(255,255,255,0.3)',
            margin: '3px 0 0 0',
          }}>
            📱 Tag @auraroast
          </p>
        </div>
      </div>
    </>
  );
};

export default AuraCard;
