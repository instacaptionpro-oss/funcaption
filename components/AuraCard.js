          import React from 'react';

const AuraCard = ({ aura }) => {
  // Destructuring the dynamic content from your AI
  const { score, rarity, roast } = aura;

  const theme = {
    background: 'radial-gradient(circle at center, #2b0000 0%, #000000 100%)',
    accentRed: '#ff3131',
    cardBorder: '2px solid #ff3131',
    glow: '0 0 25px rgba(255, 49, 49, 0.5)',
  };

  return (
    <div style={{
      width: '350px',
      minHeight: '600px',
      background: theme.background,
      borderRadius: '35px',
      border: theme.cardBorder,
      boxShadow: theme.glow,
      padding: '30px 25px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      color: 'white',
      fontFamily: '"Inter", "Arial Black", sans-serif',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Texture Overlay */}
      <div style={{
        position: 'absolute',
        top: 0, left: 0, right: 0, bottom: 0,
        opacity: 0.15,
        backgroundImage: 'url("https://www.transparenttextures.com/patterns/asfalt-dark.png")',
        pointerEvents: 'none'
      }} />

      {/* 1. THE TOP WARNING (CORRECTED TEXT) */}
      <h1 style={{
        color: theme.accentRed,
        fontSize: '1.9rem',
        fontWeight: '900',
        textAlign: 'center',
        lineHeight: '1.1',
        textTransform: 'uppercase',
        marginTop: '10px',
        letterSpacing: '-1px',
        zIndex: 1
      }}>
        FUTURE SO DARK THAT EVEN<br/>GOOGLE MAPS CANT FIND IT.
      </h1>

      {/* 2. INSTAGRAM LOGO */}
      <div style={{
        width: '95px',
        height: '95px',
        borderRadius: '50%',
        background: 'linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        border: '3px solid white',
        margin: '35px 0',
        boxShadow: '0 0 15px rgba(255,255,255,0.2)',
        zIndex: 1
      }}>
        <img 
          src="https://upload.wikimedia.org/wikipedia/commons/a/a5/Instagram_icon.png" 
          alt="IG" 
          style={{ width: '55%', height: '55%' }} 
        />
      </div>

      {/* 3. AURA LEVEL SECTION */}
      <div style={{ margin: '10px 0', textAlign: 'center', width: '100%', zIndex: 1 }}>
        <div style={{ fontSize: '1rem', fontWeight: '800', letterSpacing: '4px', opacity: 0.7 }}>
          AURA LEVEL
        </div>
        
        <div style={{
          fontSize: '8rem',
          fontWeight: '900',
          color: theme.accentRed,
          lineHeight: '1',
          margin: '0',
          fontFamily: 'Impact, sans-serif'
        }}>
          {score}
        </div>

        <div style={{
          fontSize: '1.6rem',
          fontWeight: '900',
          fontStyle: 'italic',
          color: theme.accentRed,
          letterSpacing: '1px',
          textTransform: 'uppercase',
          marginTop: '5px'
        }}>
          {rarity}
        </div>
      </div>

      {/* 4. THE SAVAGE ROAST BOX */}
      <div style={{
        width: '100%',
        border: `2px solid ${theme.accentRed}`,
        borderRadius: '20px',
        padding: '20px',
        marginTop: 'auto',
        textAlign: 'left',
        background: 'rgba(0,0,0,0.4)',
        zIndex: 1
      }}>
        <div style={{ color: theme.accentRed, fontSize: '1.1rem', fontWeight: '900', marginBottom: '6px' }}>
          "THE SAVAGE ROAST
        </div>
        <div style={{ fontSize: '1.05rem', fontStyle: 'italic', lineHeight: '1.4', opacity: 0.95 }}>
          {roast}
        </div>
      </div>

      {/* 5. MINIMAL FOOTER */}
      <div style={{
        marginTop: '25px',
        fontSize: '0.7rem',
        opacity: 0.4,
        letterSpacing: '2px',
        fontWeight: 'bold',
        zIndex: 1
      }}>
        AURA-ROAST.COM
      </div>
    </div>
  );
};

export default AuraCard;
