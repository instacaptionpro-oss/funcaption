import { useState } from 'react';

const AuraCard = ({ aura, onRoastChat, onTryAgain }) => {
  const [isAnimating, setIsAnimating] = useState(false);

  // Color schemes based on 60-30-10 rule
  const getColorScheme = (rarity) => {
    switch (rarity) {
      case 'legendary':
        return {
          primary: '#FFD700',    // Gold 60%
          secondary: '#8B0000',  // Dark Red 30%
          accent: '#000000',     // Black 10%
          bgGradient: 'linear-gradient(135deg, #FFD700 0%, #8B0000 50%, #000000 100%)',
          textColor: '#FFFFFF'
        };
      case 'epic':
        return {
          primary: '#9400D3',    // Violet 60%
          secondary: '#00BFFF',  // Electric Blue 30%
          accent: '#FFFFFF',     // White 10%
          bgGradient: 'linear-gradient(135deg, #9400D3 0%, #00BFFF 50%, #FFFFFF 100%)',
          textColor: '#FFFFFF'
        };
      case 'mid':
        return {
          primary: '#FF4500',    // OrangeRed 60%
          secondary: '#2F4F4F',  // Dark Slate Gray 30%
          accent: '#FFFF00',     // Yellow 10%
          bgGradient: 'linear-gradient(135deg, #FF4500 0%, #2F4F4F 50%, #FFFF00 100%)',
          textColor: '#FFFFFF'
        };
      case 'noob':
        return {
          primary: '#1E90FF',    // DodgerBlue 60%
          secondary: '#32CD32',  // LimeGreen 30%
          accent: '#FFD700',     // Gold 10%
          bgGradient: 'linear-gradient(135deg, #1E90FF 0%, #32CD32 50%, #FFD700 100%)',
          textColor: '#FFFFFF'
        };
      case 'npc':
      default:
        return {
          primary: '#696969',    // DimGray 60%
          secondary: '#2F4F4F',  // DarkSlateGray 30%
          accent: '#000000',     // Black 10%
          bgGradient: 'linear-gradient(135deg, #696969 0%, #2F4F4F 50%, #000000 100%)',
          textColor: '#FFFFFF'
        };
    }
  };

  const colors = getColorScheme(aura.rarity);

  const handleRoastChat = () => {
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 300);
    onRoastChat();
  };

  return (
    <div style={{
      position: 'relative',
      width: '300px',
      height: '500px',
      borderRadius: '20px',
      overflow: 'hidden',
      boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
      background: colors.bgGradient,
      border: `3px solid ${colors.primary}`,
      transform: isAnimating ? 'scale(0.98)' : 'scale(1)',
      transition: 'transform 0.2s ease'
    }}>
      {/* Challenge Header */}
      <div style={{
        padding: '30px 20px 15px',
        textAlign: 'center'
      }}>
        <h2 style={{
          fontSize: '0.9rem',
          fontWeight: '800',
          color: colors.textColor,
          textTransform: 'uppercase',
          letterSpacing: '1px',
          margin: '0 0 5px',
          textShadow: '1px 1px 2px rgba(0,0,0,0.5)'
        }}>
          {aura.challenge}
        </h2>
      </div>

      {/* Tier Badge */}
      <div style={{
        position: 'absolute',
        top: '20px',
        right: '20px',
        background: colors.accent,
        color: colors.primary,
        padding: '6px 12px',
        borderRadius: '15px',
        fontSize: '0.8rem',
        fontWeight: '800',
        boxShadow: '0 4px 10px rgba(0,0,0,0.3)'
      }}>
        {aura.title}
      </div>

      {/* Score Circle */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        margin: '15px 0'
      }}>
        <div style={{
          width: '140px',
          height: '140px',
          borderRadius: '50%',
          background: `conic-gradient(${colors.primary} 0% ${aura.score}%, ${colors.secondary} ${aura.score}% 100%)`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 0 30px rgba(0,0,0,0.5)'
        }}>
          <div style={{
            width: '120px',
            height: '120px',
            borderRadius: '50%',
            background: 'rgba(0,0,0,0.8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <span style={{
              fontSize: '2.5rem',
              fontWeight: '900',
              color: colors.primary,
              textShadow: `0 0 10px ${colors.accent}`
            }}>
              {aura.score}
            </span>
          </div>
        </div>
      </div>

      {/* Roast Content */}
      <div style={{
        padding: '20px',
        margin: '20px 0',
        background: 'rgba(0,0,0,0.3)',
        borderRadius: '15px',
        border: `1px solid ${colors.secondary}`
      }}>
        <p style={{
          fontSize: '1rem',
          color: colors.textColor,
          textAlign: 'center',
          margin: '0',
          lineHeight: '1.4',
          fontWeight: '500'
        }}>
          {aura.roast}
        </p>
      </div>

      {/* Action Buttons */}
      <div style={{
        padding: '0 20px 20px',
        display: 'flex',
        gap: '10px'
      }}>
        <button
          onClick={handleRoastChat}
          style={{
            flex: 1,
            padding: '12px',
            background: 'rgba(255,255,255,0.2)',
            color: colors.textColor,
            border: `2px solid ${colors.textColor}`,
            borderRadius: '12px',
            fontWeight: '700',
            cursor: 'pointer',
            fontSize: '0.9rem'
          }}
        >
          <|fim_middle|>
