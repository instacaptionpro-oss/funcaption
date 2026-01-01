import React from 'react';

const AuraCard = ({ aura }) => {
  // Destructuring the dynamic content from your AI
  const { score, rarity, subjectInsight, secondaryInsight, roast, instagramHandle } = aura;

  const theme = {
    background: 'radial-gradient(circle at center, #2b0000 0%, #000000 100%)',
    accentRed: '#ff3131',
    cardBorder: '2px solid #ff3131',
    glow: '0 0 25px rgba(255, 49, 49, 0.5)',
  };

  return (
    <div style={{
      width: '350px',
      minHeight: '720px',
      background: theme.background,
      borderRadius: '35px',
      border: theme.cardBorder,
      boxShadow: theme.glow,
      padding: '25px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      color: 'white',
      fontFamily: '"Inter", "Arial Black", sans-serif',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Background Texture Overlay for that "History-Maker" feel */}
      <div style={{
        position: 'absolute',
        top: 0, left: 0, right: 0, bottom: 0,
        opacity: 0.15,
        backgroundImage: 'url("https://www.transparenttextures.com/patterns/asfalt-dark.png")',
        pointerEvents: 'none'
      }} />

      {/* 1. THE TOP WARNING (Fixed Design) */}
      <h1 style={{
        color: theme.accentRed,
        fontSize: '1.9rem',
        fontWeight: '900',
        textAlign: 'center',
        lineHeight: '1.1',
        textTransform: 'uppercase',
        marginTop: '20px',
        letterSpacing: '-1px'
      }}>
        FUTURE SO DARK THAT EVEN<br/>GOOGLE MAPS FIND IT.
      </h1>

      {/* 2. INSTAGRAM LOGO (The Proof) */}
      <div style={{
        width: '90px',
        height: '90px',
        borderRadius: '50%',
        background: 'linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        border: '3px solid white',
        margin: '25px 0 10px 0',
        boxShadow: '0 0 15px rgba(255,255,255,0.2)'
      }}>
        <img 
          src="https://upload.wikimedia.org/wikipedia/commons/a/a5/Instagram_icon.png" 
          alt="IG" 
          style={{ width: '55%', height: '55%' }} 
        />
      </div>

      {/* 3. VIBE 1 (AI Content) */}
      <p style={{
        fontSize: '1rem',
        textAlign: 'center',
        margin: '10px 0',
        fontWeight: '400',
        opacity: 0.9,
        maxWidth: '90%'
      }}>
        VIBE: {subjectInsight}
      </p>

      {/* 4. AURA LEVEL SECTION */}
      <div style={{ margin: '15px 0', textAlign: 'center', width: '100%' }}>
        <div style={{ fontSize: '0.9rem', fontWeight: '800', letterSpacing: '3px', opacity: 0.7 }}>
          AURA LEVEL
        </div>
        
        {/* BIG SCORE */}
        <div style={{
          fontSize: '7.5rem',
          fontWeight: '900',
          color: theme.accentRed,
          lineHeight: '1',
          margin: '0',
          fontFamily: 'Impact, sans-serif'
        }}>
          {score}
        </div>

        {/* DYNAMIC TIER NAME (e.g., "GLITCH IN REALITY", "LEGENDARY", etc.) */}
        <div style={{
          fontSize: '1.5rem',
          fontWeight: '900',
          fontStyle: 'italic',
          color: theme.accentRed,
          letterSpacing: '1px',
          textTransform: 'uppercase'
        }}>
          {rarity}
        </div>
      </div>

      {/* 5. VIBE 2 (Dynamic Insight) */}
      <div style={{ margin: '10px 0', fontSize: '0.9rem', textAlign: 'center', opacity: 0.8 }}>
        <span style={{ color: theme.accentRed, fontWeight: 'bold' }}>VIBE:</span> {secondaryInsight}
      </div>

      {/* 6. THE SAVAGE ROAST BOX (Fixed Styling, Dynamic Content) */}
      <div style={{
        width: '100%',
        border: `2px solid ${theme.accentRed}`,
        borderRadius: '18px',
        padding: '15px',
        marginTop: 'auto',
        textAlign: 'left',
        background: 'rgba(0,0,0,0.3)'
      }}>
        <div style={{ color: theme.accentRed, fontSize: '1rem', fontWeight: '900', marginBottom: '4px' }}>
          "THE SAVAGE ROAST
        </div>
        <div style={{ fontSize: '0.95rem', fontStyle: 'italic', lineHeight: '1.3' }}>
          {roast}
        </div>
      </div>

      {/* 7. ERROR FOOTER (Fixed Design) */}
      <div style={{
        width: 'calc(100% + 40px)',
        background: theme.accentRed,
        color: 'black',
        fontWeight: '900',
        padding: '10px 0',
        margin: '20px -20px -25px -20px',
        textAlign: 'center',
        fontSize: '1.1rem',
        letterSpacing: '1px'
      }}>
        ERROR 404: AURA NOT FOUND
      </div>
    </div>
  );
};

export default AuraCard;
