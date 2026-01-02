import { useState } from 'react';

const AuraCard = ({ aura }) => {
  const syncValue = aura.sync || 15;

  const getTierLayout = (rarity) => {
    switch (rarity.toLowerCase()) {
      case 'legendary':
        return {
          type: 'PREMIUM',
          bg: 'linear-gradient(145deg, #111 0%, #000 100%)',
          accent: '#FFD700',
          border: 'double 4px transparent',
          customStyle: {
            backgroundImage: 'linear-gradient(#000, #000), radial-gradient(circle at top left, #FFD700, #AA8900)',
            backgroundOrigin: 'border-box',
            backgroundClip: 'padding-box, border-box',
            boxShadow: '0 0 40px rgba(255, 215, 0, 0.2)'
          },
          label: "ROYALTY_STATUS",
          showScanlines: false,
          glitchAmount: 0
        };
      case 'glitch':
        return {
          type: 'ANOMALY',
          bg: '#000',
          accent: '#00ffff',
          border: '1px solid #00ffff',
          customStyle: {
            boxShadow: 'inset 0 0 20px rgba(0, 255, 255, 0.2), 0 0 15px rgba(0, 255, 255, 0.4)',
            clipPath: 'polygon(0% 5%, 5% 0%, 100% 0%, 100% 95%, 95% 100%, 0% 100%)' // Angled corners
          },
          label: "ERROR: REALITY_CHECK",
          showScanlines: true,
          glitchAmount: 3
        };
      case 'npc':
      default:
        return {
          type: 'SYSTEM',
          bg: '#0a0000',
          accent: '#ff3131',
          border: '2px solid #ff3131',
          customStyle: {
            borderStyle: 'dashed',
            opacity: 0.9
          },
          label: "DEFAULT_ENTITY_ID",
          showScanlines: true,
          glitchAmount: 1
        };
    }
  };

  const style = getTierLayout(aura.rarity);

  return (
    <div className={`card-frame ${style.type}`} style={{
      width: '320px',
      height: '580px',
      background: style.bg,
      color: 'white',
      padding: '20px',
      position: 'relative',
      display: 'flex',
      flexDirection: 'column',
      fontFamily: '"JetBrains Mono", monospace',
      ...style.customStyle
    }}>
      {/* 1. TIER-SPECIFIC OVERLAYS */}
      {style.showScanlines && <div className="scanlines" />}
      
      {/* 2. HEADER: Each tier has a unique metadata layout */}
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.6rem', color: style.accent }}>
        <span>{style.label}</span>
        <span>{aura.rarity === 'legendary' ? '★★★' : 'REV_0.2'}</span>
      </div>

      {/* 3. SCORE: Dynamic shadow per tier */}
      <div style={{ margin: '40px 0', textAlign: 'center' }}>
        <h1 style={{
          fontSize: '7rem',
          margin: 0,
          fontWeight: '900',
          color: 'white',
          textShadow: aura.rarity === 'glitch' 
            ? `3px 3px #ff00ff, -3px -3px #00ffff` // RGB Split for Glitch
            : `0 0 20px ${style.accent}` // Glow for others
        }}>
          {aura.score}
        </h1>
        <div style={{ letterSpacing: '4px', fontSize: '0.8rem', opacity: 0.7 }}>AURA_POINTS</div>
      </div>

      {/* 4. SYNC METER: Distinct visual for each */}
      <div style={{ marginBottom: '20px' }}>
        <div style={{ fontSize: '0.6rem', marginBottom: '4px', textAlign: 'left' }}>SYNCHRONIZATION</div>
        <div style={{ height: '2px', background: 'rgba(255,255,255,0.1)' }}>
          <div style={{ 
            height: '100%', 
            width: `${syncValue}%`, 
            background: style.accent,
            boxShadow: `0 0 8px ${style.accent}`
          }} />
        </div>
      </div>

      {/* 5. ROAST BOX: Unique border per tier */}
      <div style={{
        flex: 1,
        padding: '15px',
        fontSize: '0.9rem',
        textAlign: 'left',
        background: 'rgba(255,255,255,0.03)',
        borderLeft: `3px solid ${style.accent}`,
        fontStyle: aura.rarity === 'npc' ? 'normal' : 'italic'
      }}>
        {aura.roast}
      </div>

      {/* CSS For Unique Effects */}
      <style jsx>{`
        .scanlines {
          position: absolute; inset: 0; pointer-events: none; z-index: 5;
          background: linear-gradient(to bottom, rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.2) 50%);
          background-size: 100% 4px;
        }
        .ANOMALY { animation: jitter 0.2s infinite; }
        @keyframes jitter {
          0% { transform: translate(0); }
          50% { transform: translate(1px, -1px); }
          100% { transform: translate(0); }
        }
      `}</style>
    </div>
  );
};

export default AuraCard;
