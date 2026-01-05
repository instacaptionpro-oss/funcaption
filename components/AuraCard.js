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
        setShareMessage('✅ Downloaded! Now share on Instagram');
        setTimeout(() => setShareMessage(''), 3000);
      }
    } catch (error) {
      console.error('Download error:', error);
      setShareMessage('❌ Download failed. Try again.');
      setTimeout(() => setShareMessage(''), 3000);
    }
    setIsSharing(false);
  };

  const shareToInstagramStory = async () => {
    setIsSharing(true);
    try {
      const canvas = await captureCard();
      if (!canvas) throw new Error('Failed to capture');

      const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png'));
      const file = new File([blob], 'aura-card.png', { type: 'image/png' });

      if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: `My Aura: ${aura.rarity.toUpperCase()}`,
          text: `I got ${aura.rarity.toUpperCase()} tier with ${aura.score} aura! 🔥 Check yours at aura-roast.com`,
        });
        setShareMessage('✅ Shared successfully!');
      } else {
        await downloadCard();
        setShowShareModal(true);
      }
    } catch (error) {
      if (error.name !== 'AbortError') {
        console.error('Share error:', error);
        await downloadCard();
        setShowShareModal(true);
      }
    }
    setIsSharing(false);
    setTimeout(() => setShareMessage(''), 3000);
  };

  const shareToInstagramFeed = async () => {
    setIsSharing(true);
    try {
      const canvas = await captureCard();
      if (!canvas) throw new Error('Failed to capture');

      const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png'));
      const file = new File([blob], 'aura-card.png', { type: 'image/png' });

      if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: `My Aura: ${aura.rarity.toUpperCase()}`,
          text: `I got ${aura.rarity.toUpperCase()} tier with ${aura.score} aura! 🔥\n\nCheck yours at aura-roast.com`,
        });
        setShareMessage('✅ Shared successfully!');
      } else {
        await downloadCard();
        setShowShareModal(true);
      }
    } catch (error) {
      if (error.name !== 'AbortError') {
        console.error('Share error:', error);
        await downloadCard();
        setShowShareModal(true);
      }
    }
    setIsSharing(false);
    setTimeout(() => setShareMessage(''), 3000);
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText('https://aura-roast.com');
      setShareMessage('✅ Link copied!');
      setTimeout(() => setShareMessage(''), 2000);
    } catch (error) {
      setShareMessage('❌ Failed to copy');
      setTimeout(() => setShareMessage(''), 2000);
    }
  };

  // ============================================
  // SHARE MODAL COMPONENT
  // ============================================
  const ShareModal = () => (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0,0,0,0.9)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
      padding: '20px',
    }}>
      <div style={{
        background: 'linear-gradient(180deg, #1a1a1a, #0a0a0a)',
        borderRadius: '20px',
        padding: '30px',
        maxWidth: '350px',
        width: '100%',
        border: `2px solid ${config.accentColor}50`,
        boxShadow: `0 0 50px ${config.accentColor}30`,
      }}>
        <div style={{ textAlign: 'center', marginBottom: '25px' }}>
          <span style={{ fontSize: '3rem' }}>📸</span>
          <h3 style={{
            margin: '15px 0 10px 0',
            color: config.accentColor,
            fontSize: '1.3rem',
            fontWeight: '800',
          }}>
            Share to Instagram
          </h3>
          <p style={{
            margin: 0,
            color: 'rgba(255,255,255,0.6)',
            fontSize: '0.85rem',
          }}>
            Your card has been downloaded!
          </p>
        </div>

        <div style={{
          background: 'rgba(255,255,255,0.05)',
          borderRadius: '12px',
          padding: '20px',
          marginBottom: '20px',
        }}>
          <p style={{
            margin: '0 0 15px 0',
            color: '#fff',
            fontSize: '0.9rem',
            fontWeight: '600',
          }}>
            📋 How to share:
          </p>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {['Open Instagram app', 'Create new Story or Post', 'Select your downloaded Aura Card', 'Tag @auraroast 🔥'].map((step, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                <span style={{
                  background: config.accentColor,
                  color: '#000',
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.75rem',
                  fontWeight: '800',
                  flexShrink: 0,
                }}>{i + 1}</span>
                <span style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.85rem' }}>
                  {step}
                </span>
              </div>
            ))}
          </div>
        </div>

        <a
          href="instagram://app"
          style={{
            display: 'block',
            width: '100%',
            padding: '14px',
            background: 'linear-gradient(45deg, #833AB4, #FD1D1D, #F77737)',
            border: 'none',
            borderRadius: '12px',
            color: '#fff',
            fontSize: '1rem',
            fontWeight: '700',
            textAlign: 'center',
            textDecoration: 'none',
            cursor: 'pointer',
            marginBottom: '12px',
          }}
          onClick={() => {
            setTimeout(() => {
              window.open('https://instagram.com', '_blank');
            }, 500);
          }}
        >
          📱 Open Instagram
        </a>

        <button
          onClick={() => setShowShareModal(false)}
          style={{
            width: '100%',
            padding: '12px',
            background: 'rgba(255,255,255,0.1)',
            border: '1px solid rgba(255,255,255,0.2)',
            borderRadius: '12px',
            color: '#fff',
            fontSize: '0.9rem',
            cursor: 'pointer',
          }}
        >
          Close
        </button>
      </div>
    </div>
  );

  // ============================================
  // LEGENDARY - AGGRESSIVE GOLD PLASMA BORDER
  // ============================================
  const LegendaryCard = () => (
    <>
      {/* LAYER 1: Outer Massive Glow */}
      <div style={{
        position: 'absolute',
        top: '-15px',
        left: '-15px',
        right: '-15px',
        bottom: '-15px',
        borderRadius: '28px',
        background: 'transparent',
        boxShadow: `
          0 0 40px rgba(255, 215, 0, 0.8),
          0 0 80px rgba(255, 215, 0, 0.6),
          0 0 120px rgba(255, 215, 0, 0.4),
          0 0 200px rgba(255, 215, 0, 0.2),
          inset 0 0 60px rgba(255, 215, 0, 0.1)
        `,
        animation: 'legendaryMegaPulse 2s ease-in-out infinite',
        zIndex: 1
      }} />

      {/* LAYER 2: Plasma Energy Ring 1 */}
      <div style={{
        position: 'absolute',
        top: '-10px',
        left: '-10px',
        right: '-10px',
        bottom: '-10px',
        borderRadius: '26px',
        background: `conic-gradient(
          from 0deg,
          #FFD700, #FFA500, #FF8C00, #FFD700, #FFEC8B, 
          #FFA500, #FFD700, #FF8C00, #FFD700
        )`,
        animation: 'plasmaRotate 3s linear infinite',
        zIndex: 2
      }} />

      {/* LAYER 3: Plasma Energy Ring 2 (Counter-rotate) */}
      <div style={{
        position: 'absolute',
        top: '-8px',
        left: '-8px',
        right: '-8px',
        bottom: '-8px',
        borderRadius: '24px',
        background: `conic-gradient(
          from 180deg,
          transparent, #FFD700, transparent, #FFA500, 
          transparent, #FFD700, transparent, #FFA500
        )`,
        animation: 'plasmaRotateReverse 2s linear infinite',
        opacity: 0.7,
        zIndex: 3
      }} />

      {/* LAYER 4: Electric Arc Border */}
      <div style={{
        position: 'absolute',
        top: '-6px',
        left: '-6px',
        right: '-6px',
        bottom: '-6px',
        borderRadius: '22px',
        background: `
          linear-gradient(90deg, #FFD700, #FFA500, #FFEC8B, #FFD700, #FFA500, #FFD700)
        `,
        backgroundSize: '300% 100%',
        animation: 'electricFlowFast 1.5s linear infinite',
        zIndex: 4
      }} />

      {/* LAYER 5: Plasma Crack Overlay */}
      <div style={{
        position: 'absolute',
        top: '-5px',
        left: '-5px',
        right: '-5px',
        bottom: '-5px',
        borderRadius: '21px',
        background: `
          radial-gradient(ellipse at 10% 10%, rgba(255, 255, 200, 1) 0%, transparent 20%),
          radial-gradient(ellipse at 90% 20%, rgba(255, 200, 100, 0.9) 0%, transparent 25%),
          radial-gradient(ellipse at 20% 80%, rgba(255, 255, 150, 0.8) 0%, transparent 20%),
          radial-gradient(ellipse at 85% 90%, rgba(255, 180, 50, 0.9) 0%, transparent 25%),
          radial-gradient(ellipse at 50% 50%, rgba(255, 215, 0, 0.5) 0%, transparent 50%)
        `,
        animation: 'plasmaShiftAggressive 1.5s ease-in-out infinite',
        zIndex: 5
      }} />

      {/* LAYER 6: Inner Dark Core */}
      <div style={{
        position: 'absolute',
        top: '3px',
        left: '3px',
        right: '3px',
        bottom: '3px',
        borderRadius: '16px',
        background: 'radial-gradient(ellipse at center, #1a1000 0%, #0a0a0a 100%)',
        zIndex: 6
      }} />

      {/* LAYER 7: Inner Glow Edge */}
      <div style={{
        position: 'absolute',
        top: '4px',
        left: '4px',
        right: '4px',
        bottom: '4px',
        borderRadius: '15px',
        background: 'transparent',
        boxShadow: 'inset 0 0 30px rgba(255, 215, 0, 0.3), inset 0 0 60px rgba(255, 215, 0, 0.1)',
        zIndex: 7
      }} />

      {/* Electric Lightning Bolts SVG */}
      <svg style={{
        position: 'absolute',
        top: '-15px',
        left: '-15px',
        width: 'calc(100% + 30px)',
        height: 'calc(100% + 30px)',
        zIndex: 8,
        pointerEvents: 'none',
        overflow: 'visible'
      }} viewBox="0 0 370 650">
        <defs>
          <linearGradient id="goldLightning" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFEC8B" />
            <stop offset="50%" stopColor="#FFD700" />
            <stop offset="100%" stopColor="#FFA500" />
          </linearGradient>
          <filter id="goldGlow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        
        {/* Top Lightning Arcs */}
        <path d="M50,15 Q100,5 150,15 Q200,25 250,15 Q300,5 320,15" 
          stroke="url(#goldLightning)" strokeWidth="3" fill="none" filter="url(#goldGlow)"
          style={{ animation: 'lightningFlicker 0.5s ease-in-out infinite' }} />
        
        {/* Bottom Lightning Arcs */}
        <path d="M50,635 Q100,645 150,635 Q200,625 250,635 Q300,645 320,635" 
          stroke="url(#goldLightning)" strokeWidth="3" fill="none" filter="url(#goldGlow)"
          style={{ animation: 'lightningFlicker 0.5s ease-in-out infinite 0.25s' }} />
        
        {/* Left Lightning */}
        <path d="M15,100 Q5,200 15,300 Q25,400 15,500" 
          stroke="url(#goldLightning)" strokeWidth="2" fill="none" filter="url(#goldGlow)"
          style={{ animation: 'lightningFlicker 0.3s ease-in-out infinite 0.1s' }} />
        
        {/* Right Lightning */}
        <path d="M355,100 Q365,200 355,300 Q345,400 355,500" 
          stroke="url(#goldLightning)" strokeWidth="2" fill="none" filter="url(#goldGlow)"
          style={{ animation: 'lightningFlicker 0.3s ease-in-out infinite 0.2s' }} />
        
        {/* Corner Energy Bursts */}
        <circle cx="20" cy="20" r="8" fill="#FFD700" filter="url(#goldGlow)">
          <animate attributeName="r" values="8;12;8" dur="1s" repeatCount="indefinite"/>
          <animate attributeName="opacity" values="1;0.5;1" dur="1s" repeatCount="indefinite"/>
        </circle>
        <circle cx="350" cy="20" r="8" fill="#FFD700" filter="url(#goldGlow)">
          <animate attributeName="r" values="8;12;8" dur="1s" repeatCount="indefinite" begin="0.25s"/>
          <animate attributeName="opacity" values="1;0.5;1" dur="1s" repeatCount="indefinite" begin="0.25s"/>
        </circle>
        <circle cx="20" cy="630" r="8" fill="#FFD700" filter="url(#goldGlow)">
          <animate attributeName="r" values="8;12;8" dur="1s" repeatCount="indefinite" begin="0.5s"/>
          <animate attributeName="opacity" values="1;0.5;1" dur="1s" repeatCount="indefinite" begin="0.5s"/>
        </circle>
        <circle cx="350" cy="630" r="8" fill="#FFD700" filter="url(#goldGlow)">
          <animate attributeName="r" values="8;12;8" dur="1s" repeatCount="indefinite" begin="0.75s"/>
          <animate attributeName="opacity" values="1;0.5;1" dur="1s" repeatCount="indefinite" begin="0.75s"/>
        </circle>
      </svg>
      
      {/* Floating Crown */}
      <div style={{
        position: 'absolute',
        top: '-35px',
        left: '50%',
        transform: 'translateX(-50%)',
        fontSize: '45px',
        zIndex: 20,
        filter: 'drop-shadow(0 0 25px rgba(255, 215, 0, 1)) drop-shadow(0 0 50px rgba(255, 215, 0, 0.8))',
        animation: 'crownFloat 2s ease-in-out infinite'
      }}>
        👑
      </div>
      
      {/* Aggressive Floating Particles */}
      {Array.from({ length: 30 }, (_, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            left: `${5 + Math.random() * 90}%`,
            top: `${5 + Math.random() * 90}%`,
            width: `${3 + Math.random() * 5}px`,
            height: `${3 + Math.random() * 5}px`,
            borderRadius: '50%',
            background: i % 3 === 0 ? '#FFEC8B' : i % 3 === 1 ? '#FFD700' : '#FFA500',
            boxShadow: `0 0 10px ${i % 3 === 0 ? '#FFEC8B' : '#FFD700'}, 0 0 20px rgba(255, 215, 0, 0.5)`,
            animation: `particleOrbit ${2 + Math.random() * 3}s ease-in-out ${Math.random() * 2}s infinite`,
            zIndex: 9
          }}
        />
      ))}
      
      {/* Top Energy Bar */}
      <div style={{
        position: 'absolute',
        top: '0',
        left: '15px',
        right: '15px',
        height: '4px',
        background: 'linear-gradient(90deg, transparent, #FFD700, #FFEC8B, #FFD700, transparent)',
        boxShadow: '0 0 20px #FFD700, 0 0 40px rgba(255, 215, 0, 0.8)',
        animation: 'energyBarPulse 1s ease-in-out infinite',
        zIndex: 10
      }} />
      
      {/* Bottom Energy Bar */}
      <div style={{
        position: 'absolute',
        bottom: '0',
        left: '15px',
        right: '15px',
        height: '4px',
        background: 'linear-gradient(90deg, transparent, #FFA500, #FFD700, #FFA500, transparent)',
        boxShadow: '0 0 20px #FFD700, 0 0 40px rgba(255, 215, 0, 0.8)',
        animation: 'energyBarPulse 1s ease-in-out infinite reverse',
        zIndex: 10
      }} />
    </>
  );

  // ============================================
  // EPIC - AGGRESSIVE CYAN/PURPLE PLASMA BORDER
  // ============================================
  const EpicCard = () => (
    <>
      {/* LAYER 1: Outer Massive Glow */}
      <div style={{
        position: 'absolute',
        top: '-15px',
        left: '-15px',
        right: '-15px',
        bottom: '-15px',
        borderRadius: '28px',
        boxShadow: `
          0 0 40px rgba(0, 255, 255, 0.7),
          0 0 80px rgba(148, 0, 211, 0.5),
          0 0 120px rgba(0, 255, 255, 0.3),
          0 0 180px rgba(148, 0, 211, 0.2)
        `,
        animation: 'epicMegaPulse 2s ease-in-out infinite',
        zIndex: 1
      }} />

      {/* LAYER 2: Plasma Energy Ring 1 */}
      <div style={{
        position: 'absolute',
        top: '-10px',
        left: '-10px',
        right: '-10px',
        bottom: '-10px',
        borderRadius: '26px',
        background: `conic-gradient(
          from 0deg,
          #00FFFF, #9400D3, #00BFFF, #8A2BE2, #00FFFF, 
          #9400D3, #00FFFF, #8A2BE2, #00FFFF
        )`,
        animation: 'plasmaRotate 2.5s linear infinite',
        zIndex: 2
      }} />

      {/* LAYER 3: Plasma Energy Ring 2 (Counter-rotate) */}
      <div style={{
        position: 'absolute',
        top: '-8px',
        left: '-8px',
        right: '-8px',
        bottom: '-8px',
        borderRadius: '24px',
        background: `conic-gradient(
          from 90deg,
          transparent, #00FFFF, transparent, #9400D3, 
          transparent, #00FFFF, transparent, #9400D3
        )`,
        animation: 'plasmaRotateReverse 1.5s linear infinite',
        opacity: 0.8,
        zIndex: 3
      }} />

      {/* LAYER 4: Electric Arc Border */}
      <div style={{
        position: 'absolute',
        top: '-6px',
        left: '-6px',
        right: '-6px',
        bottom: '-6px',
        borderRadius: '22px',
        background: `
          linear-gradient(90deg, #00FFFF, #9400D3, #00BFFF, #8A2BE2, #00FFFF, #9400D3)
        `,
        backgroundSize: '300% 100%',
        animation: 'electricFlowFast 1.2s linear infinite',
        zIndex: 4
      }} />

      {/* LAYER 5: Plasma Crack Overlay */}
      <div style={{
        position: 'absolute',
        top: '-5px',
        left: '-5px',
        right: '-5px',
        bottom: '-5px',
        borderRadius: '21px',
        background: `
          radial-gradient(ellipse at 10% 10%, rgba(0, 255, 255, 1) 0%, transparent 20%),
          radial-gradient(ellipse at 90% 15%, rgba(148, 0, 211, 0.9) 0%, transparent 25%),
          radial-gradient(ellipse at 15% 85%, rgba(0, 191, 255, 0.8) 0%, transparent 20%),
          radial-gradient(ellipse at 90% 90%, rgba(138, 43, 226, 0.9) 0%, transparent 25%),
          radial-gradient(ellipse at 50% 50%, rgba(0, 255, 255, 0.4) 0%, transparent 40%)
        `,
        animation: 'plasmaShiftAggressive 1.2s ease-in-out infinite',
        zIndex: 5
      }} />

      {/* LAYER 6: Inner Dark Core */}
      <div style={{
        position: 'absolute',
        top: '3px',
        left: '3px',
        right: '3px',
        bottom: '3px',
        borderRadius: '16px',
        background: 'radial-gradient(ellipse at center, #0a0020 0%, #050010 100%)',
        zIndex: 6
      }} />

      {/* LAYER 7: Inner Glow Edge */}
      <div style={{
        position: 'absolute',
        top: '4px',
        left: '4px',
        right: '4px',
        bottom: '4px',
        borderRadius: '15px',
        boxShadow: 'inset 0 0 30px rgba(0, 255, 255, 0.3), inset 0 0 60px rgba(148, 0, 211, 0.2)',
        zIndex: 7
      }} />

      {/* Electric Lightning Bolts SVG */}
      <svg style={{
        position: 'absolute',
        top: '-15px',
        left: '-15px',
        width: 'calc(100% + 30px)',
        height: 'calc(100% + 30px)',
        zIndex: 8,
        pointerEvents: 'none',
        overflow: 'visible'
      }} viewBox="0 0 370 650">
        <defs>
          <linearGradient id="cyanLightning" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00FFFF" />
            <stop offset="50%" stopColor="#9400D3" />
            <stop offset="100%" stopColor="#00FFFF" />
          </linearGradient>
          <filter id="cyanGlow">
            <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        
        {/* Electric Arcs */}
        <path d="M30,10 L50,30 L40,50 L60,80" stroke="url(#cyanLightning)" strokeWidth="2" fill="none" filter="url(#cyanGlow)"
          style={{ animation: 'lightningFlicker 0.2s ease-in-out infinite' }} />
        <path d="M340,10 L320,30 L330,50 L310,80" stroke="url(#cyanLightning)" strokeWidth="2" fill="none" filter="url(#cyanGlow)"
          style={{ animation: 'lightningFlicker 0.2s ease-in-out infinite 0.1s' }} />
        <path d="M30,640 L50,620 L40,600 L60,570" stroke="url(#cyanLightning)" strokeWidth="2" fill="none" filter="url(#cyanGlow)"
          style={{ animation: 'lightningFlicker 0.2s ease-in-out infinite 0.15s' }} />
        <path d="M340,640 L320,620 L330,600 L310,570" stroke="url(#cyanLightning)" strokeWidth="2" fill="none" filter="url(#cyanGlow)"
          style={{ animation: 'lightningFlicker 0.2s ease-in-out infinite 0.2s' }} />
        
        {/* Energy Nodes */}
        <circle cx="185" cy="10" r="6" fill="#00FFFF" filter="url(#cyanGlow)">
          <animate attributeName="r" values="6;10;6" dur="0.8s" repeatCount="indefinite"/>
        </circle>
        <circle cx="185" cy="640" r="6" fill="#9400D3" filter="url(#cyanGlow)">
          <animate attributeName="r" values="6;10;6" dur="0.8s" repeatCount="indefinite" begin="0.4s"/>
        </circle>
      </svg>
      
      {/* Floating Particles */}
      {Array.from({ length: 25 }, (_, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            left: `${5 + Math.random() * 90}%`,
            top: `${5 + Math.random() * 90}%`,
            width: `${2 + Math.random() * 4}px`,
            height: `${2 + Math.random() * 4}px`,
            borderRadius: '50%',
            background: i % 2 === 0 ? '#00FFFF' : '#9400D3',
            boxShadow: `0 0 10px ${i % 2 === 0 ? '#00FFFF' : '#9400D3'}`,
            animation: `particleOrbit ${2 + Math.random() * 2}s ease-in-out ${Math.random() * 2}s infinite`,
            zIndex: 9
          }}
        />
      ))}
      
      {/* Energy Bars */}
      <div style={{
        position: 'absolute',
        top: '0',
        left: '15px',
        right: '15px',
        height: '4px',
        background: 'linear-gradient(90deg, transparent, #00FFFF, #9400D3, #00FFFF, transparent)',
        boxShadow: '0 0 20px #00FFFF, 0 0 40px rgba(0, 255, 255, 0.6)',
        animation: 'energyBarPulse 0.8s ease-in-out infinite',
        zIndex: 10
      }} />
      <div style={{
        position: 'absolute',
        bottom: '0',
        left: '15px',
        right: '15px',
        height: '4px',
        background: 'linear-gradient(90deg, transparent, #9400D3, #00FFFF, #9400D3, transparent)',
        boxShadow: '0 0 20px #9400D3, 0 0 40px rgba(148, 0, 211, 0.6)',
        animation: 'energyBarPulse 0.8s ease-in-out infinite reverse',
        zIndex: 10
      }} />
    </>
  );

  // ============================================
  // MID - WHITE/SILVER PLASMA BORDER
  // ============================================
  const MidCard = () => (
    <>
      {/* LAYER 1: Outer Glow */}
      <div style={{
        position: 'absolute',
        top: '-12px',
        left: '-12px',
        right: '-12px',
        bottom: '-12px',
        borderRadius: '26px',
        boxShadow: `
          0 0 30px rgba(255, 255, 255, 0.5),
          0 0 60px rgba(135, 206, 235, 0.4),
          0 0 100px rgba(255, 255, 255, 0.2)
        `,
        animation: 'midMegaPulse 3s ease-in-out infinite',
        zIndex: 1
      }} />

      {/* LAYER 2: Plasma Energy Ring */}
      <div style={{
        position: 'absolute',
        top: '-8px',
        left: '-8px',
        right: '-8px',
        bottom: '-8px',
        borderRadius: '24px',
        background: `conic-gradient(
          from 0deg,
          #FFFFFF, #87CEEB, #E0E0E0, #B0C4DE, #FFFFFF, 
          #87CEEB, #FFFFFF, #B0C4DE, #FFFFFF
        )`,
        animation: 'plasmaRotate 4s linear infinite',
        zIndex: 2
      }} />

      {/* LAYER 3: Electric Arc Border */}
      <div style={{
        position: 'absolute',
        top: '-5px',
        left: '-5px',
        right: '-5px',
        bottom: '-5px',
        borderRadius: '21px',
        background: `
          linear-gradient(90deg, #FFFFFF, #87CEEB, #FFFFFF, #B0C4DE, #FFFFFF)
        `,
        backgroundSize: '200% 100%',
        animation: 'electricFlowFast 2s linear infinite',
        zIndex: 3
      }} />

      {/* LAYER 4: Plasma Glow */}
      <div style={{
        position: 'absolute',
        top: '-4px',
        left: '-4px',
        right: '-4px',
        bottom: '-4px',
        borderRadius: '20px',
        background: `
          radial-gradient(ellipse at 20% 20%, rgba(255, 255, 255, 0.8) 0%, transparent 25%),
          radial-gradient(ellipse at 80% 80%, rgba(135, 206, 235, 0.6) 0%, transparent 25%)
        `,
        zIndex: 4
      }} />

      {/* LAYER 5: Inner Dark Core */}
      <div style={{
        position: 'absolute',
        top: '3px',
        left: '3px',
        right: '3px',
        bottom: '3px',
        borderRadius: '16px',
        background: 'linear-gradient(180deg, #0a1628, #050d18)',
        zIndex: 5
      }} />

      {/* LAYER 6: Inner Glow */}
      <div style={{
        position: 'absolute',
        top: '4px',
        left: '4px',
        right: '4px',
        bottom: '4px',
        borderRadius: '15px',
        boxShadow: 'inset 0 0 20px rgba(255, 255, 255, 0.2)',
        zIndex: 6
      }} />

      {/* Floating Particles */}
      {Array.from({ length: 15 }, (_, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            left: `${10 + Math.random() * 80}%`,
            top: `${10 + Math.random() * 80}%`,
            width: `${2 + Math.random() * 3}px`,
            height: `${2 + Math.random() * 3}px`,
            borderRadius: '50%',
            background: i % 2 === 0 ? '#FFFFFF' : '#87CEEB',
            boxShadow: '0 0 8px rgba(255, 255, 255, 0.8)',
            animation: `particleFloat ${3 + Math.random() * 3}s ease-in-out ${Math.random() * 2}s infinite`,
            zIndex: 7
          }}
        />
      ))}
      
      {/* Upgrade Hint */}
      <div style={{
        position: 'absolute',
        top: '15px',
        right: '15px',
        background: 'rgba(148, 0, 211, 0.2)',
        border: '1px solid rgba(148, 0, 211, 0.5)',
        borderRadius: '12px',
        padding: '6px 12px',
        fontSize: '0.6rem',
        color: '#9400D3',
        fontWeight: '600',
        letterSpacing: '1px',
        zIndex: 10,
        boxShadow: '0 0 15px rgba(148, 0, 211, 0.4)',
        animation: 'upgradeHintPulse 2s ease-in-out infinite'
      }}>
        ⚡ EPIC CLOSE
      </div>
      
      {/* Energy Lines */}
      <div style={{
        position: 'absolute',
        top: '0',
        left: '20px',
        right: '20px',
        height: '2px',
        background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.8), transparent)',
        boxShadow: '0 0 15px rgba(255,255,255,0.6)',
        zIndex: 10
      }} />
      <div style={{
        position: 'absolute',
        bottom: '0',
        left: '20px',
        right: '20px',
        height: '2px',
        background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.8), transparent)',
        boxShadow: '0 0 15px rgba(255,255,255,0.6)',
        zIndex: 10
      }} />
    </>
  );

  // ============================================
  // NOOB - AGGRESSIVE ORANGE PLASMA BORDER
  // ============================================
  const NoobCard = () => (
    <>
      {/* LAYER 1: Outer Massive Glow */}
      <div style={{
        position: 'absolute',
        top: '-14px',
        left: '-14px',
        right: '-14px',
        bottom: '-14px',
        borderRadius: '28px',
        boxShadow: `
          0 0 35px rgba(255, 140, 0, 0.7),
          0 0 70px rgba(255, 69, 0, 0.5),
          0 0 110px rgba(255, 140, 0, 0.3),
          0 0 160px rgba(255, 69, 0, 0.2)
        `,
        animation: 'noobMegaPulse 1.5s ease-in-out infinite',
        zIndex: 1
      }} />

      {/* LAYER 2: Plasma Energy Ring 1 */}
      <div style={{
        position: 'absolute',
        top: '-10px',
        left: '-10px',
        right: '-10px',
        bottom: '-10px',
        borderRadius: '26px',
        background: `conic-gradient(
          from 0deg,
          #FF8C00, #FF4500, #FFA500, #FF6600, #FF8C00, 
          #FF4500, #FF8C00, #FF6600, #FF8C00
        )`,
        animation: 'plasmaRotate 2s linear infinite',
        zIndex: 2
      }} />

      {/* LAYER 3: Plasma Energy Ring 2 */}
      <div style={{
        position: 'absolute',
        top: '-8px',
        left: '-8px',
        right: '-8px',
        bottom: '-8px',
        borderRadius: '24px',
        background: `conic-gradient(
          from 180deg,
          transparent, #FF8C00, transparent, #FF4500, 
          transparent, #FF8C00, transparent, #FF4500
        )`,
        animation: 'plasmaRotateReverse 1.5s linear infinite',
        opacity: 0.7,
        zIndex: 3
      }} />

      {/* LAYER 4: Electric Arc Border */}
      <div style={{
        position: 'absolute',
        top: '-6px',
        left: '-6px',
        right: '-6px',
        bottom: '-6px',
        borderRadius: '22px',
        background: `
          linear-gradient(90deg, #FF8C00, #FF4500, #FFA500, #FF6600, #FF8C00, #FF4500)
        `,
        backgroundSize: '300% 100%',
        animation: 'electricFlowFast 1.5s linear infinite',
        zIndex: 4
      }} />

      {/* LAYER 5: Plasma Crack */}
      <div style={{
        position: 'absolute',
        top: '-5px',
        left: '-5px',
        right: '-5px',
        bottom: '-5px',
        borderRadius: '21px',
        background: `
          radial-gradient(ellipse at 10% 10%, rgba(255, 200, 100, 0.9) 0%, transparent 20%),
          radial-gradient(ellipse at 90% 20%, rgba(255, 100, 0, 0.8) 0%, transparent 25%),
          radial-gradient(ellipse at 20% 90%, rgba(255, 165, 0, 0.7) 0%, transparent 20%),
          radial-gradient(ellipse at 85% 85%, rgba(255, 140, 0, 0.8) 0%, transparent 25%)
        `,
        animation: 'plasmaShiftAggressive 1s ease-in-out infinite',
        zIndex: 5
      }} />

      {/* LAYER 6: Inner Dark Core */}
      <div style={{
        position: 'absolute',
        top: '3px',
        left: '3px',
        right: '3px',
        bottom: '3px',
        borderRadius: '16px',
        background: 'linear-gradient(180deg, #1a0f00, #0f0800)',
        zIndex: 6
      }} />

      {/* LAYER 7: Inner Glow */}
      <div style={{
        position: 'absolute',
        top: '4px',
        left: '4px',
        right: '4px',
        bottom: '4px',
        borderRadius: '15px',
        boxShadow: 'inset 0 0 25px rgba(255, 140, 0, 0.3)',
        zIndex: 7
      }} />

      {/* Warning Corner Accents */}
      {[
        { top: '6px', left: '6px', borderTop: true, borderLeft: true },
        { top: '6px', right: '6px', borderTop: true, borderRight: true },
        { bottom: '6px', left: '6px', borderBottom: true, borderLeft: true },
        { bottom: '6px', right: '6px', borderBottom: true, borderRight: true },
      ].map((pos, i) => (
        <div key={i} style={{
          position: 'absolute',
          ...pos,
          width: '35px',
          height: '35px',
          borderTop: pos.borderTop ? '4px solid #FF8C00' : 'none',
          borderBottom: pos.borderBottom ? '4px solid #FF8C00' : 'none',
          borderLeft: pos.borderLeft ? '4px solid #FF8C00' : 'none',
          borderRight: pos.borderRight ? '4px solid #FF8C00' : 'none',
          boxShadow: `0 0 20px rgba(255, 140, 0, 0.7)`,
          zIndex: 10,
          animation: `cornerPulse 1.5s ease-in-out ${i * 0.2}s infinite`
        }} />
      ))}

      {/* Floating Particles */}
      {Array.from({ length: 20 }, (_, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            left: `${5 + Math.random() * 90}%`,
            top: `${5 + Math.random() * 90}%`,
            width: `${2 + Math.random() * 4}px`,
            height: `${2 + Math.random() * 4}px`,
            borderRadius: '50%',
            background: i % 2 === 0 ? '#FF8C00' : '#FF4500',
            boxShadow: `0 0 8px ${i % 2 === 0 ? '#FF8C00' : '#FF4500'}`,
            animation: `particleOrbit ${2 + Math.random() * 2}s ease-in-out ${Math.random() * 2}s infinite`,
            zIndex: 9
          }}
        />
      ))}
      
      {/* Energy Bars */}
      <div style={{
        position: 'absolute',
        top: '0',
        left: '0',
        right: '0',
        height: '5px',
        background: 'linear-gradient(90deg, transparent 5%, #FF8C00 20%, #FF4500 50%, #FF8C00 80%, transparent 95%)',
        boxShadow: '0 0 20px #FF8C00, 0 0 40px rgba(255, 140, 0, 0.6)',
        animation: 'energyBarPulse 1s ease-in-out infinite',
        zIndex: 10
      }} />
      <div style={{
        position: 'absolute',
        bottom: '0',
        left: '0',
        right: '0',
        height: '5px',
        background: 'linear-gradient(90deg, transparent 5%, #FF4500 20%, #FF8C00 50%, #FF4500 80%, transparent 95%)',
        boxShadow: '0 0 20px #FF4500, 0 0 40px rgba(255, 69, 0, 0.6)',
        animation: 'energyBarPulse 1s ease-in-out infinite reverse',
        zIndex: 10
      }} />
    </>
  );

  // ============================================
  // NPC - CORRUPTED RED GLITCH PLASMA BORDER
  // ============================================
  const NPCCard = () => (
    <>
      {/* LAYER 1: Outer Corrupted Glow */}
      <div style={{
        position: 'absolute',
        top: '-15px',
        left: '-15px',
        right: '-15px',
        bottom: '-15px',
        borderRadius: '28px',
        boxShadow: `
          0 0 40px rgba(255, 0, 0, 0.7),
          0 0 80px rgba(139, 0, 0, 0.5),
          0 0 120px rgba(255, 0, 0, 0.3),
          0 0 180px rgba(139, 0, 0, 0.2)
        `,
        animation: 'npcGlitchPulse 0.1s ease-in-out infinite',
        zIndex: 1
      }} />

      {/* LAYER 2: Glitchy Plasma Ring */}
      <div style={{
        position: 'absolute',
        top: '-10px',
        left: '-10px',
        right: '-10px',
        bottom: '-10px',
        borderRadius: '26px',
        background: `conic-gradient(
          from 0deg,
          #FF0000, #8B0000, #FF0000, #660000, #FF0000, 
          #8B0000, #FF0000, #660000, #FF0000
        )`,
        animation: 'glitchRotate 1s linear infinite',
        zIndex: 2
      }} />

      {/* LAYER 3: Broken Plasma Ring */}
      <div style={{
        position: 'absolute',
        top: '-8px',
        left: '-8px',
        right: '-8px',
        bottom: '-8px',
        borderRadius: '24px',
        background: `conic-gradient(
          from 45deg,
          transparent 0deg, #FF0000 30deg, transparent 60deg,
          #8B0000 90deg, transparent 120deg, #FF0000 150deg,
          transparent 180deg, #660000 210deg, transparent 240deg,
          #FF0000 270deg, transparent 300deg, #8B0000 330deg, transparent 360deg
        )`,
        animation: 'glitchRotateReverse 0.8s linear infinite',
        zIndex: 3
      }} />

      {/* LAYER 4: Glitchy Electric Border */}
      <div style={{
        position: 'absolute',
        top: '-6px',
        left: '-6px',
        right: '-6px',
        bottom: '-6px',
        borderRadius: '22px',
        background: `
          linear-gradient(90deg, #FF0000, #8B0000, #FF0000, #660000, #FF0000, #8B0000)
        `,
        backgroundSize: '300% 100%',
        animation: 'glitchFlowFast 0.5s linear infinite',
        zIndex: 4
      }} />

      {/* LAYER 5: Corrupted Plasma */}
      <div style={{
        position: 'absolute',
        top: '-5px',
        left: '-5px',
        right: '-5px',
        bottom: '-5px',
        borderRadius: '21px',
        background: `
          radial-gradient(ellipse at 5% 5%, rgba(255, 0, 0, 1) 0%, transparent 15%),
          radial-gradient(ellipse at 95% 10%, rgba(139, 0, 0, 0.9) 0%, transparent 20%),
          radial-gradient(ellipse at 10% 95%, rgba(255, 50, 50, 0.8) 0%, transparent 15%),
          radial-gradient(ellipse at 90% 90%, rgba(100, 0, 0, 0.9) 0%, transparent 20%)
        `,
        animation: 'corruptedPlasmaAggressive 0.5s ease-in-out infinite',
        zIndex: 5
      }} />

      {/* LAYER 6: Inner Corrupted Core */}
      <div style={{
        position: 'absolute',
        top: '3px',
        left: '3px',
        right: '3px',
        bottom: '3px',
        borderRadius: '16px',
        background: '#050000',
        zIndex: 6
      }} />

      {/* LAYER 7: Scanlines */}
      <div style={{
        position: 'absolute',
        top: '4px',
        left: '4px',
        right: '4px',
        bottom: '4px',
        borderRadius: '15px',
        background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255, 0, 0, 0.05) 2px, rgba(255, 0, 0, 0.05) 4px)',
        zIndex: 7,
        pointerEvents: 'none'
      }} />

      {/* Glitch Lines */}
      {[15, 35, 55, 75, 88].map((pos, i) => (
        <div key={i} style={{
          position: 'absolute',
          top: `${pos}%`,
          left: 0,
          right: 0,
          height: i % 2 === 0 ? '4px' : '2px',
          background: `linear-gradient(90deg, transparent ${Math.random() * 20}%, #FF0000 ${30 + Math.random() * 20}%, transparent ${70 + Math.random() * 20}%)`,
          opacity: 0.6,
          animation: `glitchLine ${0.5 + Math.random() * 0.5}s ease-in-out ${Math.random() * 0.5}s infinite`,
          zIndex: 8
        }} />
      ))}

      {/* Corrupted Corner Accents */}
      {[
        { top: '4px', left: '4px' },
        { top: '4px', right: '4px' },
        { bottom: '4px', left: '4px' },
        { bottom: '4px', right: '4px' },
      ].map((pos, i) => (
        <div key={i} style={{
          position: 'absolute',
          ...pos,
          width: '30px',
          height: '30px',
          borderTop: pos.top ? '4px solid #FF0000' : 'none',
          borderBottom: pos.bottom ? '4px solid #FF0000' : 'none',
          borderLeft: pos.left === '4px' ? '4px solid #FF0000' : 'none',
          borderRight: pos.right === '4px' ? '4px solid #FF0000' : 'none',
          boxShadow: `0 0 15px rgba(255, 0, 0, 0.8)`,
          zIndex: 10,
          animation: `glitchCorner 0.3s ease-in-out ${i * 0.1}s infinite`
        }} />
      ))}

      {/* Error X Marks */}
      <svg style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '80px',
        height: '80px',
        zIndex: 8,
        opacity: 0.08,
        pointerEvents: 'none'
      }} viewBox="0 0 100 100">
        <line x1="20" y1="20" x2="80" y2="80" stroke="#FF0000" strokeWidth="8"/>
        <line x1="80" y1="20" x2="20" y2="80" stroke="#FF0000" strokeWidth="8"/>
      </svg>

      {/* ERROR Watermark */}
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%) rotate(-20deg)',
        fontSize: '4.5rem',
        fontWeight: '900',
        color: 'rgba(255, 0, 0, 0.04)',
        letterSpacing: '15px',
        whiteSpace: 'nowrap',
        pointerEvents: 'none',
        zIndex: 8,
        fontFamily: 'monospace',
        animation: 'errorGlitch 2s ease-in-out infinite'
      }}>
        ERROR
      </div>
      
      {/* Energy Bars */}
      <div style={{
        position: 'absolute',
        top: '0',
        left: '0',
        right: '0',
        height: '5px',
        background: 'linear-gradient(90deg, transparent 5%, #FF0000 20%, #FF0000 80%, transparent 95%)',
        boxShadow: '0 0 25px #FF0000, 0 0 50px rgba(255, 0, 0, 0.6)',
        animation: 'energyFlickerFast 0.2s ease-in-out infinite',
        zIndex: 10
      }} />
      <div style={{
        position: 'absolute',
        bottom: '0',
        left: '0',
        right: '0',
        height: '5px',
        background: 'linear-gradient(90deg, transparent 5%, #8B0000 20%, #FF0000 50%, #8B0000 80%, transparent 95%)',
        boxShadow: '0 0 25px #FF0000, 0 0 50px rgba(139, 0, 0, 0.6)',
        animation: 'energyFlickerFast 0.2s ease-in-out infinite reverse',
        zIndex: 10
      }} />
    </>
  );

  // ============================================
  // TIER CONFIG
  // ============================================
  const getTierConfig = (rarity) => {
    switch (rarity) {
      case 'legendary':
        return {
          accentColor: '#FFD700',
          secondaryColor: '#FFA500',
          headerText: "👑 THE TOP 1% 👑",
          headerBg: 'linear-gradient(90deg, transparent, rgba(255, 215, 0, 0.3), transparent)',
          tierLabel: "LEGENDARY",
          tierSubtext: "YOU ARE THE STANDARD",
          tierIcon: "👑",
          ctaText: "FLEX THIS 👑",
          motivationText: "Others wish they were you.",
          fontFamily: '"Cinzel", serif',
        };
      case 'epic':
        return {
          accentColor: '#00FFFF',
          secondaryColor: '#9400D3',
          headerText: "⚡ TOP 6% - RARE ⚡",
          headerBg: 'linear-gradient(90deg, transparent, rgba(0, 255, 255, 0.2), rgba(148, 0, 211, 0.2), transparent)',
          tierLabel: "EPIC",
          tierSubtext: "BUILT DIFFERENT",
          tierIcon: "⚡",
          ctaText: "SHOW THEM ⚡",
          motivationText: "One step below God.",
          fontFamily: '"Inter", sans-serif',
        };
      case 'mid':
        return {
          accentColor: '#FFFFFF',
          secondaryColor: '#87CEEB',
          headerText: "YOU'RE... OKAY",
          headerBg: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.15), transparent)',
          tierLabel: "MID",
          tierSubtext: "MAIN CHARACTER... KINDA",
          tierIcon: "🔥",
          ctaText: "TRY FOR EPIC? 🎯",
          motivationText: "Average. Like everyone else.",
          fontFamily: '"Inter", sans-serif',
        };
      case 'noob':
        return {
          accentColor: '#FF8C00',
          secondaryColor: '#FF4500',
          headerText: "⚠️ NEEDS WORK ⚠️",
          headerBg: 'linear-gradient(90deg, transparent, rgba(255, 140, 0, 0.25), transparent)',
          tierLabel: "NOOB",
          tierSubtext: "SYSTEM_LOADING...",
          tierIcon: "💀",
          ctaText: "TRY AGAIN 🔄",
          motivationText: "// warning: potential_not_found",
          fontFamily: '"Courier New", monospace',
        };
      case 'npc':
      default:
        return {
          accentColor: '#FF0000',
          secondaryColor: '#8B0000',
          headerText: "// CRITICAL_ERROR",
          headerBg: 'linear-gradient(90deg, transparent, rgba(255, 0, 0, 0.2), transparent)',
          tierLabel: "NPC",
          tierSubtext: "BACKGROUND_PROCESS.exe",
          tierIcon: "💀",
          ctaText: "REBOOT 🔄",
          motivationText: "// fatal: existence_not_found",
          fontFamily: '"Courier New", monospace',
        };
    }
  };

  const config = getTierConfig(aura.rarity);

  const renderCardEffect = () => {
    switch (aura.rarity) {
      case 'legendary': return <LegendaryCard />;
      case 'epic': return <EpicCard />;
      case 'mid': return <MidCard />;
      case 'noob': return <NoobCard />;
      case 'npc': return <NPCCard />;
      default: return <NPCCard />;
    }
  };

  return (
    <>
      {showShareModal && <ShareModal />}
      
      {shareMessage && (
        <div style={{
          position: 'fixed',
          top: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          background: 'rgba(0,0,0,0.9)',
          border: `1px solid ${config.accentColor}`,
          borderRadius: '12px',
          padding: '12px 24px',
          color: '#fff',
          fontSize: '0.9rem',
          fontWeight: '600',
          zIndex: 10000,
          boxShadow: `0 0 20px ${config.accentColor}50`,
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
            fontFamily: config.fontFamily,
            display: 'flex',
            flexDirection: 'column',
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
            transition: 'opacity 0.5s, transform 0.5s',
          }}
        >
          
          {renderCardEffect()}
          
          {/* CONTENT LAYER */}
          <div style={{
            position: 'relative',
            zIndex: 15,
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
            minHeight: '620px',
            padding: '20px',
          }}>
            
            {/* Header */}
            <div style={{
              textAlign: 'center',
              padding: '15px 0',
              marginBottom: '10px',
              background: config.headerBg,
              borderRadius: '8px',
            }}>
              <span style={{
                fontSize: '0.8rem',
                fontWeight: '700',
                letterSpacing: '3px',
                color: config.accentColor,
                textShadow: `0 0 20px ${config.accentColor}`,
              }}>
                {config.headerText}
              </span>
            </div>

            {/* Tier Icon & Label */}
            <div style={{ textAlign: 'center', marginBottom: '15px' }}>
              <div style={{
                fontSize: '3rem',
                marginBottom: '10px',
                filter: `drop-shadow(0 0 25px ${config.accentColor})`,
              }}>
                {config.tierIcon}
              </div>
              
              <h1 style={{
                margin: '0',
                fontSize: '2.5rem',
                fontWeight: '900',
                letterSpacing: '6px',
                color: config.accentColor,
                textShadow: `0 0 30px ${config.accentColor}, 0 0 60px ${config.accentColor}50`,
              }}>
                {config.tierLabel}
              </h1>
              
              <p style={{
                margin: '10px 0 0 0',
                fontSize: '0.7rem',
                letterSpacing: '3px',
                color: config.secondaryColor,
                opacity: 0.9,
              }}>
                {config.tierSubtext}
              </p>
            </div>

            {/* Score */}
            <div style={{
              textAlign: 'center',
              margin: '25px 0',
              position: 'relative',
            }}>
              <div style={{
                fontSize: '5rem',
                fontWeight: '900',
                lineHeight: 1,
                color: config.accentColor,
                textShadow: `0 0 40px ${config.accentColor}, 0 0 80px ${config.accentColor}50`,
              }}>
                {aura.score}
              </div>
              
              <div style={{
                fontSize: '0.7rem',
                color: config.accentColor,
                letterSpacing: '4px',
                marginTop: '10px',
                opacity: 0.8,
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
                background: `${config.accentColor}10`,
                border: `1px solid ${config.accentColor}40`,
                borderRadius: '12px',
                padding: '18px',
                position: 'relative',
              }}>
                <div style={{
                  position: 'absolute',
                  top: '-12px',
                  left: '20px',
                  background: '#0a0a0a',
                  padding: '0 10px',
                  color: config.accentColor,
                  fontSize: '1rem',
                }}>
                  💬
                </div>
                
                <p style={{
                  margin: 0,
                  fontSize: '0.95rem',
                  lineHeight: 1.6,
                  color: 'rgba(255,255,255,0.95)',
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
              padding: '12px',
              borderTop: `1px solid ${config.accentColor}30`,
            }}>
              <p style={{
                margin: 0,
                fontSize: '0.8rem',
                color: config.accentColor,
                fontWeight: '600',
              }}>
                {config.motivationText}
              </p>
            </div>

            {/* Footer */}
            <div style={{
              marginTop: '15px',
              padding: '10px 0',
              borderTop: `1px solid ${config.accentColor}20`,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
              <div style={{
                fontSize: '0.5rem',
                color: config.accentColor,
                letterSpacing: '1px',
                maxWidth: '55%',
                lineHeight: 1.3,
                opacity: 0.8,
              }}>
                {aura.challenge}
              </div>
              
              <div style={{
                fontSize: '0.6rem',
                color: 'rgba(255,255,255,0.4)',
                letterSpacing: '1px',
              }}>
                aura-roast.com
              </div>
            </div>
          </div>
        </div>

        {/* SHARE BUTTONS */}
        <div style={{
          width: '340px',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
        }}>
          <button
            onClick={shareToInstagramStory}
            disabled={isSharing}
            style={{
              width: '100%',
              padding: '14px 20px',
              background: 'linear-gradient(45deg, #833AB4, #FD1D1D, #F77737)',
              border: 'none',
              borderRadius: '12px',
              color: '#fff',
              fontSize: '0.95rem',
              fontWeight: '700',
              cursor: isSharing ? 'wait' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              opacity: isSharing ? 0.7 : 1,
              transition: 'all 0.2s',
              boxShadow: '0 4px 20px rgba(131, 58, 180, 0.4)',
            }}
          >
            {isSharing ? '⏳ Processing...' : '📸 Share to Instagram Story'}
          </button>

          <button
            onClick={shareToInstagramFeed}
            disabled={isSharing}
            style={{
              width: '100%',
              padding: '14px 20px',
              background: 'linear-gradient(45deg, #405DE6, #5851DB, #833AB4)',
              border: 'none',
              borderRadius: '12px',
              color: '#fff',
              fontSize: '0.95rem',
              fontWeight: '700',
              cursor: isSharing ? 'wait' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              opacity: isSharing ? 0.7 : 1,
              transition: 'all 0.2s',
              boxShadow: '0 4px 20px rgba(64, 93, 230, 0.4)',
            }}
          >
            {isSharing ? '⏳ Processing...' : '📷 Share to Instagram Feed'}
          </button>

          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              onClick={downloadCard}
              disabled={isSharing}
              style={{
                flex: 1,
                padding: '12px 16px',
                background: 'rgba(255,255,255,0.1)',
                border: `1px solid ${config.accentColor}50`,
                borderRadius: '12px',
                color: '#fff',
                fontSize: '0.85rem',
                fontWeight: '600',
                cursor: isSharing ? 'wait' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
              }}
            >
              ⬇️ Download
            </button>

            <button
              onClick={copyLink}
              style={{
                flex: 1,
                padding: '12px 16px',
                background: 'rgba(255,255,255,0.1)',
                border: `1px solid ${config.accentColor}50`,
                borderRadius: '12px',
                color: '#fff',
                fontSize: '0.85rem',
                fontWeight: '600',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
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
          }}>
            📱 Works best on mobile • Tag @auraroast
          </p>
        </div>
      </div>

      {/* ============================================ */}
      {/* AGGRESSIVE PLASMA ANIMATIONS */}
      {/* ============================================ */}
      <style jsx global>{`
        /* LEGENDARY ANIMATIONS */
        @keyframes legendaryMegaPulse {
          0%, 100% { 
            box-shadow: 0 0 40px rgba(255, 215, 0, 0.8), 0 0 80px rgba(255, 215, 0, 0.6), 0 0 120px rgba(255, 215, 0, 0.4), 0 0 200px rgba(255, 215, 0, 0.2);
          }
          50% { 
            box-shadow: 0 0 60px rgba(255, 215, 0, 1), 0 0 100px rgba(255, 215, 0, 0.8), 0 0 150px rgba(255, 215, 0, 0.5), 0 0 250px rgba(255, 215, 0, 0.3);
          }
        }

        /* EPIC ANIMATIONS */
        @keyframes epicMegaPulse {
          0%, 100% { 
            box-shadow: 0 0 40px rgba(0, 255, 255, 0.7), 0 0 80px rgba(148, 0, 211, 0.5), 0 0 120px rgba(0, 255, 255, 0.3);
          }
          50% { 
            box-shadow: 0 0 60px rgba(0, 255, 255, 0.9), 0 0 100px rgba(148, 0, 211, 0.7), 0 0 150px rgba(0, 255, 255, 0.4);
          }
        }

        /* MID ANIMATIONS */
        @keyframes midMegaPulse {
          0%, 100% { 
            box-shadow: 0 0 30px rgba(255, 255, 255, 0.5), 0 0 60px rgba(135, 206, 235, 0.4), 0 0 100px rgba(255, 255, 255, 0.2);
          }
          50% { 
            box-shadow: 0 0 45px rgba(255, 255, 255, 0.7), 0 0 80px rgba(135, 206, 235, 0.5), 0 0 120px rgba(255, 255, 255, 0.3);
          }
        }

        /* NOOB ANIMATIONS */
        @keyframes noobMegaPulse {
          0%, 100% { 
            box-shadow: 0 0 35px rgba(255, 140, 0, 0.7), 0 0 70px rgba(255, 69, 0, 0.5), 0 0 110px rgba(255, 140, 0, 0.3);
          }
          50% { 
            box-shadow: 0 0 50px rgba(255, 140, 0, 0.9), 0 0 90px rgba(255, 69, 0, 0.7), 0 0 140px rgba(255, 140, 0, 0.4);
          }
        }

        /* NPC ANIMATIONS */
        @keyframes npcGlitchPulse {
          0%, 100% { 
            box-shadow: 0 0 40px rgba(255, 0, 0, 0.7), 0 0 80px rgba(139, 0, 0, 0.5);
            transform: translate(0, 0);
          }
          25% { 
            box-shadow: 0 0 50px rgba(255, 0, 0, 0.9), 0 0 100px rgba(139, 0, 0, 0.6);
            transform: translate(-1px, 0);
          }
          50% { 
            box-shadow: 0 0 35px rgba(255, 0, 0, 0.6), 0 0 70px rgba(139, 0, 0, 0.4);
            transform: translate(1px, 0);
          }
          75% { 
            box-shadow: 0 0 55px rgba(255, 0, 0, 0.85), 0 0 90px rgba(139, 0, 0, 0.55);
            transform: translate(0, 0);
          }
        }

        /* PLASMA ROTATION */
        @keyframes plasmaRotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        @keyframes plasmaRotateReverse {
          from { transform: rotate(360deg); }
          to { transform: rotate(0deg); }
        }

        @keyframes glitchRotate {
          0% { transform: rotate(0deg); }
          25% { transform: rotate(92deg) scale(1.01); }
          50% { transform: rotate(180deg) scale(0.99); }
          75% { transform: rotate(268deg) scale(1.01); }
          100% { transform: rotate(360deg); }
        }

        @keyframes glitchRotateReverse {
          0% { transform: rotate(360deg); }
          33% { transform: rotate(238deg) translateX(1px); }
          66% { transform: rotate(122deg) translateX(-1px); }
          100% { transform: rotate(0deg); }
        }

        /* ELECTRIC FLOW */
        @keyframes electricFlowFast {
          0% { background-position: 0% 50%; }
          100% { background-position: 300% 50%; }
        }

        @keyframes glitchFlowFast {
          0% { background-position: 0% 50%; transform: translateX(0); }
          25% { background-position: 100% 50%; transform: translateX(2px); }
          50% { background-position: 200% 50%; transform: translateX(-2px); }
          75% { background-position: 300% 50%; transform: translateX(1px); }
          100% { background-position: 0% 50%; transform: translateX(0); }
        }

        /* PLASMA SHIFT */
        @keyframes plasmaShiftAggressive {
          0%, 100% { 
            opacity: 1;
            filter: brightness(1);
          }
          25% { 
            opacity: 0.85;
            filter: brightness(1.2);
          }
          50% { 
            opacity: 1;
            filter: brightness(0.9);
          }
          75% { 
            opacity: 0.9;
            filter: brightness(1.1);
          }
        }

        @keyframes corruptedPlasmaAggressive {
          0%, 100% { 
            opacity: 1;
            transform: scale(1) translate(0, 0);
          }
          20% { 
            opacity: 0.7;
            transform: scale(1.01) translate(1px, 0);
          }
          40% { 
            opacity: 1;
            transform: scale(0.99) translate(-1px, 0);
          }
          60% { 
            opacity: 0.8;
            transform: scale(1.005) translate(0, 1px);
          }
          80% { 
            opacity: 0.9;
            transform: scale(0.995) translate(0, -1px);
          }
        }

        /* PARTICLE ANIMATIONS */
        @keyframes particleOrbit {
          0%, 100% { 
            transform: translateY(0) translateX(0) scale(1); 
            opacity: 0.9;
          }
          25% { 
            transform: translateY(-15px) translateX(10px) scale(1.2); 
            opacity: 0.6;
          }
          50% { 
            transform: translateY(-25px) translateX(-5px) scale(0.8); 
            opacity: 0.3;
          }
          75% { 
            transform: translateY(-10px) translateX(-15px) scale(1.1); 
            opacity: 0.7;
          }
        }

        @keyframes particleFloat {
          0%, 100% { 
            transform: translateY(0) translateX(0); 
            opacity: 0.8;
          }
          50% { 
            transform: translateY(-20px) translateX(10px); 
            opacity: 0.4;
          }
        }

        /* ENERGY BARS */
        @keyframes energyBarPulse {
          0%, 100% { 
            opacity: 0.9;
            box-shadow: 0 0 20px currentColor, 0 0 40px currentColor;
          }
          50% { 
            opacity: 1;
            box-shadow: 0 0 30px currentColor, 0 0 60px currentColor;
          }
        }

        @keyframes energyFlickerFast {
          0%, 100% { opacity: 1; }
          10% { opacity: 0.7; }
          20% { opacity: 1; }
          30% { opacity: 0.8; }
          40% { opacity: 1; }
          50% { opacity: 0.6; }
          60% { opacity: 1; }
          70% { opacity: 0.75; }
          80% { opacity: 1; }
          90% { opacity: 0.85; }
        }

        /* LIGHTNING */
        @keyframes lightningFlicker {
          0%, 100% { opacity: 1; filter: brightness(1); }
          10% { opacity: 0.3; filter: brightness(2); }
          20% { opacity: 1; filter: brightness(1); }
          30% { opacity: 0.6; filter: brightness(1.5); }
          40% { opacity: 1; filter: brightness(1); }
          50% { opacity: 0.2; filter: brightness(2.5); }
          60% { opacity: 1; filter: brightness(1); }
          70% { opacity: 0.5; filter: brightness(1.8); }
          80% { opacity: 1; filter: brightness(1); }
          90% { opacity: 0.4; filter: brightness(2); }
        }

        /* CROWN */
        @keyframes crownFloat {
          0%, 100% { transform: translateX(-50%) translateY(0) rotate(-5deg); }
          50% { transform: translateX(-50%) translateY(-12px) rotate(5deg); }
        }

        /* CORNERS */
        @keyframes cornerPulse {
          0%, 100% { 
            opacity: 1;
            box-shadow: 0 0 20px currentColor;
          }
          50% { 
            opacity: 0.7;
            box-shadow: 0 0 35px currentColor;
          }
        }

        @keyframes glitchCorner {
          0%, 100% { opacity: 1; transform: translate(0, 0); }
          20% { opacity: 0.5; transform: translate(2px, -1px); }
          40% { opacity: 1; transform: translate(-1px, 1px); }
          60% { opacity: 0.7; transform: translate(1px, 0); }
          80% { opacity: 0.9; transform: translate(0, -1px); }
        }

        /* GLITCH LINES */
        @keyframes glitchLine {
          0%, 100% { 
            opacity: 0.5; 
            transform: translateX(0) scaleX(1);
          }
          20% { 
            opacity: 0.8; 
            transform: translateX(-10px) scaleX(1.05);
          }
          40% { 
            opacity: 0.3; 
            transform: translateX(5px) scaleX(0.95);
          }
          60% { 
            opacity: 0.9; 
            transform: translateX(-3px) scaleX(1.02);
          }
          80% { 
            opacity: 0.4; 
            transform: translateX(8px) scaleX(0.98);
          }
        }

        /* UPGRADE HINT */
        @keyframes upgradeHintPulse {
          0%, 100% { 
            opacity: 1;
            box-shadow: 0 0 15px rgba(148, 0, 211, 0.4);
          }
          50% { 
            opacity: 0.8;
            box-shadow: 0 0 25px rgba(148, 0, 211, 0.6);
          }
        }

        /* ERROR GLITCH */
        @keyframes errorGlitch {
          0%, 100% { 
            opacity: 0.04;
            transform: translate(-50%, -50%) rotate(-20deg) scale(1);
          }
          25% { 
            opacity: 0.06;
            transform: translate(-48%, -52%) rotate(-18deg) scale(1.02);
          }
          50% { 
            opacity: 0.03;
            transform: translate(-52%, -48%) rotate(-22deg) scale(0.98);
          }
          75% { 
            opacity: 0.05;
            transform: translate(-50%, -50%) rotate(-19deg) scale(1.01);
          }
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </>
  );
};

export default AuraCard;
