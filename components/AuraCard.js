import { useState, useEffect } from 'react';

const AuraCard = ({ aura }) => {
  const [glitchOffset, setGlitchOffset] = useState(0);

  // Sync Score Logic: If not provided, we calculate a mock one for the demo
  const syncValue = aura.sync || Math.floor(Math.random() * 40) + 10; 

  const getTierData = (rarity) => {
    switch (rarity.toLowerCase()) {
      case 'legendary':
        return {
          bg: 'linear-gradient(135deg, #1a1a1a 0%, #000 100%)',
          border: '2px solid #FFD700',
          accent: '#FFD700',
          shadow: '0 0 30px rgba(255, 215, 0, 0.4)',
          header: "SYSTEM BREAKER: LEGENDARY STATUS",
          tag: "GLITCH IN REALITY",
          noiseOpacity: 0.15
        };
      case 'npc':
      default:
        return {
          bg: 'linear-gradient(135deg, #150000 0%, #000 100%)',
          border: '2px solid #ff3131',
          accent: '#ff3131',
          shadow: '0 0 25px rgba(255, 49, 49, 0.3)',
          header: "FUTURE SO DARK EVEN GOOGLE MAPS CAN'T FIND IT",
          tag: "DEFAULT ENTITY (NPC)",
          noiseOpacity: 0.2
        };
    }
  };

  const theme = getTierData(aura.rarity);

  return (
    <div className="aura-container" style={{
      position: 'relative',
      width: '340px',
      height: '620px',
      background: theme.bg,
      border: theme.border,
      borderRadius: '2px', // Sharp edges look more "tech"
      boxShadow: theme.shadow,
      overflow: 'hidden',
      fontFamily: '"JetBrains Mono", "Courier New", monospace',
      display: 'flex',
      flexDirection: 'column',
      padding: '24px',
      color: 'white'
    }}>
      {/* 1. DIGITAL OVERLAYS (THE PEAK STUFF) */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        opacity: theme.noiseOpacity,
        pointerEvents: 'none'
      }} />
      
      {/* Scanline Effect */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06))',
        backgroundSize: '100% 4px, 3px 100%',
        pointerEvents: 'none',
        zIndex: 10
      }} />

      {/* 2. HEADER STRIP */}
      <div style={{
        fontSize: '0.65rem',
        textAlign: 'left',
        borderBottom: `1px solid ${theme.accent}`,
        paddingBottom: '8px',
        marginBottom: '20px',
        color: theme.accent,
        display: 'flex',
        justifyContent: 'space-between'
      }}>
        <span>ID: {Math.random().toString(36).substr(2, 9).toUpperCase()}</span>
        <span style={{ fontWeight: 'bold' }}>LIVE_DECRYPT_02.01.26</span>
      </div>

      <div style={{ fontSize: '0.7rem', color: '#888', marginBottom: '4px', textAlign: 'left' }}>
        {theme.header}
      </div>

      {/* 3. RARITY TAG */}
      <div style={{
        background: theme.accent,
        color: 'black',
        fontSize: '0.8rem',
        fontWeight: '900',
        padding: '4px 10px',
        alignSelf: 'flex-start',
        transform: 'skew(-15deg)',
        marginBottom: '30px'
      }}>
        <span style={{ transform: 'skew(15deg)', display: 'inline-block' }}>{theme.tag}</span>
      </div>

      {/* 4. MAIN SCORE (MASSIVE) */}
      <div style={{ position: 'relative', margin: '20px 0' }}>
        <h1 style={{
          fontSize: '9rem',
          margin: 0,
          lineHeight: 0.8,
          fontWeight: '900',
          textAlign: 'center',
          color: 'white',
          textShadow: `4px 0px ${theme.accent}, -4px 0px #00ffff`
        }}>
          {aura.score}
        </h1>
        <div style={{ fontSize: '1rem', color: theme.accent, fontWeight: 'bold' }}>AURA POINTS</div>
      </div>

      {/* 5. SYNCHRONIZATION METER */}
      <div style={{ margin: '30px 0', textAlign: 'left' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', marginBottom: '6px' }}>
          <span>SYNCHRONIZATION</span>
          <span>{syncValue}%</span>
        </div>
        <div style={{ height: '4px', background: 'rgba(255,255,255,0.1)', width: '100%' }}>
          <div style={{ height: '100%', width: `${syncValue}%`, background: theme.accent, boxShadow: `0 0 10px ${theme.accent}` }} />
        </div>
      </div>

      {/* 6. SAVAGE ROAST BLOCK */}
      <div style={{
        flex: 1,
        borderLeft: `2px solid ${theme.accent}`,
        paddingLeft: '15px',
        textAlign: 'left',
        fontSize: '0.95rem',
        lineHeight: '1.4',
        marginTop: '10px',
        fontStyle: 'italic',
        color: '#eee'
      }}>
        {aura.roast}
      </div>

      {/* 7. FOOTER */}
      <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div style={{ textAlign: 'left' }}>
          <div style={{ fontSize: '0.6rem', color: '#666' }}>VERIFIED BY</div>
          <div style={{ fontSize: '0.8rem', fontWeight: 'bold' }}>AURA_ENGINE_V1</div>
        </div>
        <div style={{ fontSize: '0.7rem', color: theme.accent }}>WWW.AURAMETER.COM</div>
      </div>

      {/* ANIMATION STYLES */}
      <style jsx>{`
        @keyframes shine {
          from { left: -100%; }
          to { left: 100%; }
        }
        .aura-container::after {
          content: "";
          position: absolute;
          top: 0; left: 0; width: 100%; height: 100%;
          background: linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.1) 50%), 
                      linear-gradient(90deg, rgba(255, 0, 0, 0.05), rgba(0, 255, 0, 0.02), rgba(0, 255, 0, 0.05));
          background-size: 100% 2px, 2px 100%;
          pointer-events: none;
        }
      `}</style>
    </div>
  );
};

export default AuraCard;
