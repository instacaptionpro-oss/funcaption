import { useState } from 'react';

const AuraCard = ({ aura }) => {
  // Tier-specific styling based on your requirements
  const getTierStyle = (rarity, score) => {
    switch (rarity) {
      case 'legendary':
        return {
          background: 'linear-gradient(135deg, #FFD700 0%, #000000 100%)',
          border: '3px solid #FFD700',
          textColor: '#FFFFFF',
          tierFont: 'bold 1.8rem serif',
          ornament: 'ornate'
        };
      case 'epic':
        return {
          background: 'linear-gradient(135deg, #4B0082 0%, #00BFFF 100%)',
          border: '3px solid #9400D3',
          textColor: '#FFFFFF',
          tierFont: 'bold 1.8rem monospace',
          ornament: 'cyberpunk'
        };
      case 'mid':
        return {
          background: 'linear-gradient(135deg, #2F4F4F 0%, #696969 100%)',
          border: '3px solid #4F4F4F',
          textColor: '#FFFFFF',
          tierFont: 'bold 1.8rem sans-serif',
          ornament: 'metal'
        };
      case 'noob':
        return {
          background: 'linear-gradient(135deg, #FF4500 0%, #000000 100%)',
          border: '3px solid #FF4500',
          textColor: '#FFFFFF',
          tierFont: 'bold 1.8rem sans-serif',
          ornament: 'hazard'
        };
      case 'npc':
      default:
        return {
          background: 'linear-gradient(135deg, #8B0000 0%, #000000 100%)',
          border: '3px solid #8B0000',
          textColor: '#FFFFFF',
          tierFont: 'bold 1.8rem sans-serif',
          ornament: 'glitch'
        };
    }
  };

  const tierStyle = getTierStyle(aura.rarity, aura.score);

  // Ornament patterns based on tier
  const renderOrnament = () => {
    switch (tierStyle.ornament) {
      case 'ornate':
        return (
          <div style={{
            position: 'absolute',
            top: '0',
            left: '0',
            right: '0',
            height: '20px',
            background: 'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,0.1) 10px, rgba(255,255,255,0.1) 20px)',
            opacity: '0.3'
          }}></div>
        );
      case 'cyberpunk':
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
      case 'hazard':
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
      case 'glitch':
        return (
          <>
            <div style={{
              position: 'absolute',
              top: '5px',
              left: '5px',
              right: '10px',
              height: '2px',
              background: 'rgba(255,0,0,0.5)',
              opacity: '0.7'
            }}></div>
            <div style={{
              position: 'absolute',
              top: '15px',
              left: '10px',
              right: '5px',
              height: '1px',
              background: 'rgba(0,255,0,0.3)',
              opacity: '0.5'
            }}></div>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div style={{
      position: 'relative',
      width: '320px',
      minHeight: '450px',
      borderRadius: '25px',
      overflow: 'hidden',
      boxShadow: '0 25px 60px rgba(0,0,0,0.7)',
      background: tierStyle.background,
      border: tierStyle.border,
      fontFamily: 'Inter, sans-serif'
    }}>
      {/* Ornament Patterns */}
      {renderOrnament()}

      {/* Tier Name - Middle Top */}
      <div style={{
        padding: '30px 20px 10px',
        textAlign: 'center'
      }}>
        <h2 style={{
          fontSize: '1.8rem',
          fontWeight: '800',
          color: tierStyle.textColor,
          textTransform: 'uppercase',
          letterSpacing: '2px',
          margin: '0',
          textShadow: '2px 2px 4px rgba(0,0,0,0.5)'
        }}>
          {aura.title}
        </h2>
      </div>

      {/* Aura Score - Center */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        margin: '20px 0',
        padding: '20px 0'
      }}>
        <div style={{
          width: '160px',
          height: '160px',
          borderRadius: '50%',
          background: 'rgba(0,0,0,0.3)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          border: `3px solid ${tierStyle.textColor}`,
          boxShadow: '0 0 40px rgba(0,0,0,0.5)'
        }}>
          <span style={{
            fontSize: '4rem',
            fontWeight: '900',
            color: tierStyle.textColor,
            textShadow: `0 0 20px ${tierStyle.textColor === '#FFFFFF' ? '#FFD700' : '#FFFFFF'}`
          }}>
            {aura.score}
          </span>
        </div>
      </div>

      {/* VIBE Section - Upper Middle */}
      <div style={{
        padding: '0 25px',
        margin: '15px 0',
        textAlign: 'center'
      }}>
        <div style={{
          fontSize: '0.9rem',
          color: tierStyle.textColor,
          fontWeight: '700',
          marginBottom: '8px',
          opacity: '0.9'
        }}>
          VIBE:
        </div>
        <div style={{
          fontSize: '1rem',
          color: tierStyle.textColor,
          fontStyle: 'italic',
          lineHeight: '1.4',
          padding: '10px',
          background: 'rgba(0,0,0,0.2)',
          borderRadius: '12px',
          border: `1px solid rgba(255,255,255,0.1)`
        }}>
          {aura.subjectInsight || "Your energy is unmatched"}
        </div>
      </div>

      {/* Savage Roast - Lower Middle */}
      <div style={{
        padding: '0 25px 30px',
        textAlign: 'center'
      }}>
        <div style={{
          fontSize: '1.1rem',
          color: tierStyle.textColor,
          lineHeight: '1.5',
          fontWeight: '600',
          padding: '20px',
          background: 'rgba(0,0,0,0.3)',
          borderRadius: '15px',
          border: `1px solid rgba(255,255,255,0.1)`,
          boxShadow: '0 5px 15px rgba(0,0,0,0.3)'
        }}>
          {aura.roast}
        </div>
      </div>

      {/* Hashtag Footer */}
      <div style={{
        position: 'absolute',
        bottom: '15px',
        left: '0',
        right: '0',
        textAlign: 'center'
      }}>
        <p style={{
          fontSize: '0.85rem',
          color: tierStyle.textColor,
          opacity: '0.7',
          margin: '0'
        }}>
          #AuraScore #{aura.title}Vibes
        </p>
      </div>
    </div>
  );
};

export default AuraCard;
