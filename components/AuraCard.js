import { useState } from 'react';

const AuraCard = ({ aura }) => {
  // Logic to determine the style and the specific "Bait" header text
  const getTierData = (rarity) => {
    const r = rarity.toLowerCase();
    switch (r) {
      case 'legendary':
        return {
          background: 'linear-gradient(135deg, #FFD700 0%, #000000 100%)',
          border: '3px solid #FFD700',
          accent: '#FFD700',
          header: "DARE TO MATCH MY SCORE? TRY IT, LOSERS.",
          icon: "👑"
        };
      case 'epic':
        return {
          background: 'linear-gradient(135deg, #4B0082 0%, #00BFFF 100%)',
          border: '3px solid #00BFFF',
          accent: '#00BFFF',
          header: "DARE TO MATCH MY SCORE? TRY IT, LOSERS.",
          icon: "⚡"
        };
      case 'mid':
        return {
          background: 'linear-gradient(135deg, #2F4F4F 0%, #000000 100%)',
          border: '3px solid #4F4F4F',
          accent: '#888888',
          header: "FUTURE SO DARK THAT EVEN GOOGLE MAPS CANT FIND IT.",
          icon: "😐"
        };
      case 'noob':
        return {
          background: 'linear-gradient(135deg, #FF4500 0%, #000000 100%)',
          border: '3px solid #FF4500',
          accent: '#FF4500',
          header: "FUTURE SO DARK THAT EVEN GOOGLE MAPS CANT FIND IT.",
          icon: "⚠️"
        };
      case 'npc':
      default:
        return {
          background: 'linear-gradient(135deg, #8B0000 0%, #000000 100%)',
          border: '3px solid #FF0000',
          accent: '#FF0000',
          header: "FUTURE SO DARK THAT EVEN GOOGLE MAPS CANT FIND IT.",
          icon: "💀"
        };
    }
  };

  const tier = getTierData(aura.rarity);

  // Danger sticker component
  const DangerSticker = () => (
    <div style={{
      position: 'absolute',
      top: '10px',
      right: '10px',
      width: '30px',
      height: '30px',
      background: 'rgba(255, 0, 0, 0.8)',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '1.2rem',
      boxShadow: '0 0 10px rgba(255, 0, 0, 0.5)',
      transform: 'rotate(15deg)',
      border: '2px solid white'
    }}>
      ⚠️
    </div>
  );

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
      
      {/* 1. The Header (BAIT) */}
      <div style={{
        fontSize: '1rem',
        fontWeight: 'bold',
        marginBottom: '15px',
        color: tier.accent,
        textTransform: 'uppercase'
      }}>
        {tier.header}
      </div>

      {/* 2. Rarity Icon & Name */}
      <div style={{ fontSize: '2rem', marginBottom: '5px' }}>{tier.icon}</div>
      <h2 style={{ 
        fontSize: '1.8rem', 
        margin: '0', 
        letterSpacing: '3px',
        textShadow: `0 0 10px ${tier.accent}`
      }}>
        {aura.rarity.toUpperCase()}
      </h2>

      {/* 3. Score (Centerpiece) */}
      <div style={{
        fontSize: '5rem',
        fontWeight: '900',
        margin: '20px 0',
        textShadow: `0 0 20px ${tier.accent}`
      }}>
        {aura.score}
      </div>

      {/* 4. The Roast (Savage AI Switch) - SMALLER and more savage */}
      <div style={{
        marginTop: 'auto',
        background: 'rgba(0,0,0,0.4)',
        padding: '15px',
        borderRadius: '10px',
        border: `1px solid ${tier.accent}`,
        fontSize: '0.9rem',
        lineHeight: '1.2'
      }}>
        {aura.roast}
      </div>

      {/* 5. NPC Enhancement with Danger Stickers for NPC/Noob tiers */}
      {(aura.rarity === 'npc' || aura.rarity === 'noob') && (
        <>
          <DangerSticker />
          <div style={{
            position: 'absolute',
            bottom: '70px',
            left: '10px',
            width: '25px',
            height: '25px',
            background: 'rgba(255, 0, 0, 0.8)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1rem',
            boxShadow: '0 0 8px rgba(255, 0, 0, 0.5)',
            transform: 'rotate(-10deg)',
            border: '2px solid white'
          }}>
            ⚠️
          </div>
          <div style={{
            position: 'absolute',
            bottom: '100px',
            right: '15px',
            width: '20px',
            height: '20px',
            background: 'rgba(255, 0, 0, 0.8)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '0.8rem',
            boxShadow: '0 0 6px rgba(255, 0, 0, 0.5)',
            transform: 'rotate(5deg)',
            border: '2px solid white'
          }}>
            ⚠️
          </div>
        </>
      )}

      {/* 6. Footer */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: '15px',
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
