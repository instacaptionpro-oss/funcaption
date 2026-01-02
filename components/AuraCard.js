          import { useState } from 'react';

const AuraCard = ({ aura }) => {
  // Logic to determine the style for each specific tier with unique designs
  const getTierData = (rarity, score) => {
    switch (rarity) {
      case 'legendary':
        return {
          background: 'linear-gradient(135deg, #FFD700 0%, #000000 100%)',
          border: '4px solid #FFD700',
          accent: '#FFD700',
          header: "DARE TO MATCH MY SCORE? TRY IT, LOSERS.",
          icon: "👑",
          ornament: 'gold',
          glitch: false
        };
      case 'epic':
        return {
          background: 'linear-gradient(135deg, #9400D3 0%, #00BFFF 100%)',
          border: '4px solid #9400D3',
          accent: '#9400D3',
          header: "DARE TO MATCH MY SCORE? TRY IT, LOSERS.",
          icon: "⚡",
          ornament: 'purple',
          glitch: false
        };
      case 'mid':
        return {
          background: 'linear-gradient(135deg, #FF4500 0%, #8B0000 100%)',
          border: '4px solid #FF4500',
          accent: '#FF4500',
          header: "FUTURE SO DARK THAT EVEN GOOGLE MAPS CANT FIND IT.",
          icon: "⚠️",
          ornament: 'orange',
          glitch: false
        };
      case 'noob':
        return {
          background: 'linear-gradient(135deg, #FF0000 0%, #8B0000 100%)',
          border: '4px solid #FF0000',
          accent: '#FF0000',
          header: "FUTURE SO DARK THAT EVEN GOOGLE MAPS CANT FIND IT.",
          icon: "💀",
          ornament: 'red',
          glitch: true // RED CONTAINS GLITCH
        };
      case 'npc':
      default:
        return {
          background: 'linear-gradient(135deg, #000000 0%, #8B0000 100%)',
          border: '4px solid #FF0000',
          accent: '#FF0000',
          header: "FUTURE SO DARK THAT EVEN GOOGLE MAPS CANT FIND IT.",
          icon: "☠️",
          ornament: 'black',
          glitch: true // BLACK CONTAINS GLITCH
        };
    }
  };

  const tier = getTierData(aura.rarity, aura.score);

  // Glitch effect component for red/black tiers
  const GlitchEffect = () => {
    if (!tier.glitch) return null;
    
    return (
      <>
        {/* Horizontal glitch lines */}
        <div style={{
          position: 'absolute',
          top: '20%',
          left: '0',
          right: '0',
          height: '2px',
          background: 'rgba(255, 255, 255, 0.3)',
          opacity: '0.7'
        }}></div>
        <div style={{
          position: 'absolute',
          top: '40%',
          left: '0',
          right: '0',
          height: '1px',
          background: 'rgba(0, 255, 0, 0.2)',
          opacity: '0.5'
        }}></div>
        <div style={{
          position: 'absolute',
          top: '60%',
          left: '0',
          right: '0',
          height: '3px',
          background: 'rgba(255, 0, 0, 0.4)',
          opacity: '0.6'
        }}></div>
        <div style={{
          position: 'absolute',
          top: '80%',
          left: '0',
          right: '0',
          height: '1px',
          background: 'rgba(0, 0, 255, 0.3)',
          opacity: '0.4'
        }}></div>
        
        {/* Vertical glitch effect */}
        <div style={{
          position: 'absolute',
          top: '0',
          left: '30%',
          width: '1px',
          height: '100%',
          background: 'rgba(255, 255, 0, 0.2)',
          opacity: '0.5'
        }}></div>
      </>
    );
  };

  // Hazard stripe pattern for certain tiers
  const HazardStripes = () => {
    if (aura.rarity !== 'mid') return null;
    
    return (
      <div style={{
        position: 'absolute',
        top: '0',
        left: '0',
        right: '0',
        height: '20px',
        background: 'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(0,0,0,0.3) 10px, rgba(0,0,0,0.3) 20px)',
        opacity: '0.4'
      }}></div>
    );
  };

  // Cyberpunk circuit pattern for Epic tier
  const CircuitPattern = () => {
    if (aura.rarity !== 'epic') return null;
    
    return (
      <div style={{
        position: 'absolute',
        top: '0',
        left: '0',
        right: '0',
        height: '20px',
        background: 'repeating-linear-gradient(90deg, transparent, transparent 5px, rgba(0,191,255,0.3) 5px, rgba(0,191,255,0.3) 10px)',
        opacity: '0.5'
      }}></div>
    );
  };

  return (
    <div style={{
      position: 'relative',
      width: '320px',
      minHeight: '580px',
      borderRadius: '15px',
      overflow: 'hidden',
      background: tier.background,
      border: tier.border,
      color: '#FFFFFF',
      fontFamily: '"Impact", sans-serif',
      display: 'flex',
      flexDirection: 'column',
      padding: '20px',
      textAlign: 'center',
      boxShadow: '0 10px 30px rgba(0,0,0,0.8)'
    }}>
      
      {/* Tier-specific patterns */}
      <GlitchEffect />
      <HazardStripes />
      <CircuitPattern />
      
      {/* 1. The Header (BAIT) */}
      <div style={{
        fontSize: '0.9rem',
        fontWeight: 'bold',
        marginBottom: '15px',
        color: tier.accent,
        textTransform: 'uppercase',
        letterSpacing: '1px'
      }}>
        {tier.header}
      </div>

      {/* 2. Rarity Icon & Name */}
      <div style={{ fontSize: '2.5rem', marginBottom: '5px' }}>{tier.icon}</div>
      <h2 style={{ 
        fontSize: '2rem', 
        margin: '0', 
        letterSpacing: '3px',
        textShadow: `0 0 10px ${tier.accent}`,
        color: tier.accent
      }}>
        {aura.title}
      </h2>

      {/* 3. Score (Centerpiece) */}
      <div style={{
        fontSize: '5rem',
        fontWeight: '900',
        margin: '25px 0',
        textShadow: `0 0 20px ${tier.accent}`,
        color: '#FFFFFF',
        position: 'relative'
      }}>
        {aura.score}
        {/* Score glow effect */}
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '120%',
          height: '120%',
          borderRadius: '50%',
          background: tier.accent,
          filter: 'blur(20px)',
          opacity: '0.3',
          zIndex: '-1'
        }}></div>
      </div>

      {/* 4. The Roast (Savage AI Switch) */}
      <div style={{
        marginTop: 'auto',
        background: 'rgba(0,0,0,0.4)',
        padding: '15px',
        borderRadius: '10px',
        border: `1px solid ${tier.accent}`,
        fontSize: '0.95rem',
        lineHeight: '1.3'
      }}>
        {aura.roast}
      </div>

      {/* 5. Footer */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: '20px',
        fontSize: '0.8rem'
      }}>
        <div style={{ width: '45px', height: '45px', background: '#FFF', padding: '2px' }}>
          {/* QR Component would go here */}
        </div>
        <span style={{ opacity: 0.7 }}>aura-roast.com</span>
      </div>
    </div>
  );
};

export default AuraCard;
