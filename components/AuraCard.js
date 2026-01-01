import { useState } from 'react';

const AuraCard = ({ aura }) => {
  // Enhanced Tier Data with specific professional color palettes
  const getTierData = (rarity) => {
    const r = rarity.toLowerCase();
    switch (r) {
      case 'legendary':
        return {
          background: 'linear-gradient(180deg, #1a1a1a 0%, #000 100%)',
          accent: '#FFD700',
          glow: '0 0 40px rgba(255, 215, 0, 0.3)',
          header: "DARE TO MATCH MY SCORE? TRY IT, LOSERS.",
          label: "ROYAL STATUS",
          texture: "radial-gradient(circle at top right, rgba(255,215,0,0.1), transparent)"
        };
      case 'epic':
        return {
          background: 'linear-gradient(180deg, #0f0a1e 0%, #000 100%)',
          accent: '#BF00FF',
          glow: '0 0 40px rgba(191, 0, 255, 0.3)',
          header: "DARE TO MATCH MY SCORE? TRY IT, LOSERS.",
          label: "ELITE ENTITY",
          texture: "linear-gradient(45deg, rgba(191,0,255,0.05) 25%, transparent 25%)"
        };
      case 'mid':
        return {
          background: 'linear-gradient(180deg, #1c1c1c 0%, #000 100%)',
          accent: '#00FFCC',
          glow: '0 0 20px rgba(0, 255, 204, 0.15)',
          header: "FUTURE SO DARK THAT EVEN GOOGLE MAPS CANT FIND IT.",
          label: "AVERAGE CIVILIAN",
          texture: "none"
        };
      case 'noob':
        return {
          background: 'linear-gradient(180deg, #1a0f00 0%, #000 100%)',
          accent: '#FF4500',
          glow: '0 0 30px rgba(255, 69, 0, 0.2)',
          header: "FUTURE SO DARK THAT EVEN GOOGLE MAPS CANT FIND IT.",
          label: "TRAINEE HUMAN",
          texture: "repeating-linear-gradient(45deg, rgba(255,69,0,0.05), rgba(255,69,0,0.05) 10px, transparent 10px, transparent 20px)"
        };
      case 'npc':
      default:
        return {
          background: 'linear-gradient(180deg, #120000 0%, #000 100%)',
          accent: '#FF0000',
          glow: '0 0 50px rgba(255, 0, 0, 0.4)',
          header: "FUTURE SO DARK THAT EVEN GOOGLE MAPS CANT FIND IT.",
          label: "SYSTEM ERROR / NPC",
          texture: "url('https://www.transparenttextures.com/patterns/carbon-fibre.png')"
        };
    }
  };

  const tier = getTierData(aura.rarity);

  return (
    <div style={{
      position: 'relative',
      width: '350px',
      minHeight: '620px',
      borderRadius: '30px', // More rounded for modern look
      overflow: 'hidden',
      background: tier.background,
      color: '#FFFFFF',
      fontFamily: '"Inter", sans-serif', // Use Inter for professional look, Impact only for Score
      display: 'flex',
      flexDirection: 'column',
      padding: '25px',
      textAlign: 'center',
      border: `1px solid rgba(255,255,255,0.1)`,
      boxShadow: tier.glow,
    }}>
      {/* Background Texture Overlay */}
      <div style={{ position: 'absolute', inset: 0, background: tier.texture, opacity: 0.3, pointerEvents: 'none' }} />
      
      {/* 1. Header (The Bait) */}
      <div style={{
        fontSize: '0.65rem',
        fontWeight: '900',
        letterSpacing: '4px',
        marginBottom: '20px',
        color: tier.accent,
        textTransform: 'uppercase',
        opacity: 0.9
      }}>
        {tier.header}
      </div>

      {/* 2. PROOF SECTION (The Instagram "Scan") */}
      <div style={{
        background: 'rgba(255, 255, 255, 0.03)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: '15px',
        padding: '12px',
        textAlign: 'left',
        marginBottom: '20px',
        backdropFilter: 'blur(10px)'
      }}>
        <div style={{ fontSize: '0.6rem', color: tier.accent, fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '4px' }}>Target: @{aura.username || 'unknown'}</div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', fontWeight: '500' }}>
          <span>Followers: {aura.followers || 'N/A'}</span>
          <span style={{ opacity: 0.5 }}>Scan: Stable</span>
        </div>
      </div>

      {/* 3. Score Centerpiece */}
      <div style={{ margin: '10px 0' }}>
        <div style={{ fontSize: '0.7rem', tracking: '3px', opacity: 0.5, fontWeight: 'bold' }}>AURA LEVEL</div>
        <div style={{
          fontSize: '7rem',
          fontWeight: '900',
          fontFamily: '"Impact", sans-serif',
          lineHeight: '1',
          background: `linear-gradient(to bottom, #fff 40%, ${tier.accent} 100%)`,
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          filter: `drop-shadow(0 0 15px ${tier.accent}66)`
        }}>
          {aura.score}
        </div>
        <div style={{ 
            fontSize: '1.2rem', 
            fontWeight: '900', 
            color: tier.accent, 
            marginTop: '-10px',
            fontStyle: 'italic',
            letterSpacing: '2px'
        }}>
          {tier.label}
        </div>
      </div>

      {/* 4. Vibe/Insight */}
      <div style={{ fontSize: '0.85rem', margin: '20px 0', padding: '0 10px', opacity: 0.8, fontWeight: '300' }}>
        <strong style={{ color: tier.accent }}>VIBE:</strong> {aura.subjectInsight}
      </div>

      {/* 5. The Savage Roast (The Final Blow) */}
      <div style={{
        marginTop: 'auto',
        background: 'rgba(0, 0, 0, 0.5)',
        padding: '18px',
        borderRadius: '20px',
        border: `1px solid rgba(255,255,255,0.05)`,
        fontSize: '1rem',
        fontWeight: '500',
        lineHeight: '1.4',
        boxShadow: 'inset 0 0 20px rgba(0,0,0,0.5)'
      }}>
        "{aura.roast}"
      </div>

      {/* 6. Professional Footer */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: '20px',
        fontSize: '0.6rem',
        opacity: 0.4,
        letterSpacing: '1px'
      }}>
        <span>ENCRYPTED RESULTS</span>
        <span style={{ fontWeight: 'bold' }}>AURA-ROAST.COM</span>
      </div>
    </div>
  );
};

export default AuraCard;
