// /components/AuraCard.js

import { useState, useEffect } from 'react';

const AuraCard = ({ aura }) => {
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    setIsVisible(true);
  }, []);

  // ============================================
  // TIER CONFIGURATION
  // ============================================
  const getTierConfig = (rarity) => {
    switch (rarity) {
      case 'legendary':
        return {
          background: 'linear-gradient(180deg, #0D0D0D 0%, #1A1A1A 50%, #0D0D0D 100%)',
          cardBorder: '3px solid #FFD700',
          accentColor: '#FFD700',
          secondaryColor: '#FFA500',
          glowColor: 'rgba(255, 215, 0, 0.6)',
          headerText: "👑 THE TOP 1% 👑",
          headerBg: 'linear-gradient(90deg, #FFD700, #FFA500, #FFD700)',
          headerColor: '#000000',
          tierLabel: "LEGENDARY",
          tierSubtext: "YOU ARE THE STANDARD",
          tierIcon: "👑",
          ctaText: "FLEX THIS SHIT 👑",
          ctaColor: 'linear-gradient(90deg, #FFD700, #FFA500)',
          ctaTextColor: '#000',
          motivationText: "Others wish they were you.",
          specialEffect: 'legendary',
        };
        
      case 'epic':
        return {
          background: 'linear-gradient(135deg, #0a0015 0%, #1a0a2e 50%, #0a0015 100%)',
          cardBorder: '3px solid #9400D3',
          accentColor: '#9400D3',
          secondaryColor: '#00BFFF',
          glowColor: 'rgba(148, 0, 211, 0.5)',
          headerText: "⚡ TOP 6% - RARE ⚡",
          headerBg: 'linear-gradient(90deg, #9400D3, #00BFFF, #9400D3)',
          headerColor: '#FFFFFF',
          tierLabel: "EPIC",
          tierSubtext: "BUILT DIFFERENT",
          tierIcon: "⚡",
          ctaText: "SHOW THEM ⚡",
          ctaColor: 'linear-gradient(90deg, #9400D3, #00BFFF)',
          ctaTextColor: '#FFF',
          motivationText: "One step below God. Not bad.",
          specialEffect: 'epic',
        };
        
      case 'mid':
        return {
          background: 'linear-gradient(180deg, #0a1628 0%, #132744 50%, #0a1628 100%)',
          cardBorder: '2px solid #3B82F6',
          accentColor: '#3B82F6',
          secondaryColor: '#60A5FA',
          glowColor: 'rgba(59, 130, 246, 0.3)',
          headerText: "YOU'RE... OKAY",
          headerBg: 'linear-gradient(90deg, #1E3A5F, #3B82F6, #1E3A5F)',
          headerColor: '#FFFFFF',
          tierLabel: "MID",
          tierSubtext: "MAIN CHARACTER... KINDA",
          tierIcon: "🔥",
          ctaText: "TRY FOR EPIC? 🎯",
          ctaColor: 'linear-gradient(90deg, #3B82F6, #60A5FA)',
          ctaTextColor: '#FFF',
          motivationText: "Average. Like everyone else.",
          specialEffect: 'mid',
        };
        
      case 'noob':
        return {
          background: 'linear-gradient(180deg, #1a1200 0%, #2d1f00 50%, #1a1200 100%)',
          cardBorder: '2px dashed #F59E0B',
          accentColor: '#F59E0B',
          secondaryColor: '#FBBF24',
          glowColor: 'rgba(245, 158, 11, 0.3)',
          headerText: "⚠️ NEEDS WORK ⚠️",
          headerBg: 'repeating-linear-gradient(45deg, #F59E0B, #F59E0B 10px, #000 10px, #000 20px)',
          headerColor: '#000000',
          tierLabel: "NOOB",
          tierSubtext: "STILL IN TUTORIAL",
          tierIcon: "💀",
          ctaText: "TRY AGAIN 🔄",
          ctaColor: 'linear-gradient(90deg, #F59E0B, #FBBF24)',
          ctaTextColor: '#000',
          motivationText: "Bro... you can do better.",
          specialEffect: 'noob',
        };
        
      case 'npc':
      default:
        return {
          // CYBERPUNK NPC DESIGN - Pitch black with neon red circuits
          background: '#000000',
          cardBorder: '2px solid #FF0000',
          accentColor: '#FF0000',
          secondaryColor: '#CC0000',
          glowColor: 'rgba(255, 0, 0, 0.4)',
          headerText: "// SYSTEM_ERROR",
          headerBg: 'linear-gradient(90deg, #1a0000, #FF0000, #1a0000)',
          headerColor: '#000000',
          tierLabel: "NPC",
          tierSubtext: "BACKGROUND_CHARACTER.exe",
          tierIcon: "💀",
          ctaText: "REBOOT SYSTEM 🔄",
          ctaColor: 'linear-gradient(90deg, #FF0000, #CC0000)',
          ctaTextColor: '#000',
          motivationText: "// error: future_not_found",
          specialEffect: 'npc',
        };
    }
  };

  const config = getTierConfig(aura.rarity);

  // ============================================
  // NPC CYBERPUNK CIRCUIT EFFECT
  // ============================================
  const NPCCircuitEffect = () => {
    if (aura.rarity !== 'npc') return null;
    
    return (
      <>
        {/* Main Circuit Board Background Pattern */}
        <svg 
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            zIndex: 1,
            opacity: 0.6
          }}
          viewBox="0 0 340 620"
          preserveAspectRatio="xMidYMid slice"
        >
          {/* Horizontal Circuit Lines */}
          <line x1="0" y1="80" x2="60" y2="80" stroke="#FF0000" strokeWidth="1" opacity="0.7"/>
          <line x1="80" y1="80" x2="120" y2="80" stroke="#FF0000" strokeWidth="1" opacity="0.5"/>
          <circle cx="60" cy="80" r="3" fill="#FF0000" opacity="0.8"/>
          <circle cx="80" cy="80" r="2" fill="#FF0000" opacity="0.6"/>
          
          <line x1="280" y1="100" x2="340" y2="100" stroke="#FF0000" strokeWidth="1" opacity="0.6"/>
          <line x1="220" y1="100" x2="260" y2="100" stroke="#FF0000" strokeWidth="1" opacity="0.4"/>
          <circle cx="280" cy="100" r="3" fill="#FF0000" opacity="0.7"/>
          <circle cx="260" cy="100" r="2" fill="#FF0000" opacity="0.5"/>
          
          {/* Vertical Circuit Lines - Left Side */}
          <line x1="30" y1="120" x2="30" y2="200" stroke="#FF0000" strokeWidth="1" opacity="0.5"/>
          <line x1="30" y1="200" x2="60" y2="200" stroke="#FF0000" strokeWidth="1" opacity="0.5"/>
          <line x1="60" y1="200" x2="60" y2="280" stroke="#FF0000" strokeWidth="1" opacity="0.4"/>
          <rect x="25" y="195" width="10" height="10" fill="none" stroke="#FF0000" strokeWidth="1" opacity="0.6"/>
          
          {/* Vertical Circuit Lines - Right Side */}
          <line x1="310" y1="140" x2="310" y2="220" stroke="#FF0000" strokeWidth="1" opacity="0.5"/>
          <line x1="310" y1="220" x2="280" y2="220" stroke="#FF0000" strokeWidth="1" opacity="0.5"/>
          <line x1="280" y1="220" x2="280" y2="300" stroke="#FF0000" strokeWidth="1" opacity="0.4"/>
          <rect x="305" y="215" width="10" height="10" fill="none" stroke="#FF0000" strokeWidth="1" opacity="0.6"/>
          
          {/* Microchip Patterns - Top Left */}
          <rect x="15" y="400" width="30" height="40" fill="none" stroke="#FF0000" strokeWidth="1" opacity="0.5"/>
          <line x1="15" y1="410" x2="0" y2="410" stroke="#FF0000" strokeWidth="1" opacity="0.4"/>
          <line x1="15" y1="420" x2="0" y2="420" stroke="#FF0000" strokeWidth="1" opacity="0.4"/>
          <line x1="15" y1="430" x2="0" y2="430" stroke="#FF0000" strokeWidth="1" opacity="0.4"/>
          <line x1="45" y1="410" x2="60" y2="410" stroke="#FF0000" strokeWidth="1" opacity="0.4"/>
          <line x1="45" y1="420" x2="60" y2="420" stroke="#FF0000" strokeWidth="1" opacity="0.4"/>
          <line x1="45" y1="430" x2="60" y2="430" stroke="#FF0000" strokeWidth="1" opacity="0.4"/>
          
          {/* Microchip Patterns - Top Right */}
          <rect x="295" y="380" width="30" height="40" fill="none" stroke="#FF0000" strokeWidth="1" opacity="0.5"/>
          <line x1="325" y1="390" x2="340" y2="390" stroke="#FF0000" strokeWidth="1" opacity="0.4"/>
          <line x1="325" y1="400" x2="340" y2="400" stroke="#FF0000" strokeWidth="1" opacity="0.4"/>
          <line x1="325" y1="410" x2="340" y2="410" stroke="#FF0000" strokeWidth="1" opacity="0.4"/>
          <line x1="295" y1="390" x2="280" y2="390" stroke="#FF0000" strokeWidth="1" opacity="0.4"/>
          <line x1="295" y1="400" x2="280" y2="400" stroke="#FF0000" strokeWidth="1" opacity="0.4"/>
          <line x1="295" y1="410" x2="280" y2="410" stroke="#FF0000" strokeWidth="1" opacity="0.4"/>
          
          {/* Bottom Circuit Patterns */}
          <line x1="0" y1="520" x2="80" y2="520" stroke="#FF0000" strokeWidth="1" opacity="0.5"/>
          <line x1="80" y1="520" x2="80" y2="560" stroke="#FF0000" strokeWidth="1" opacity="0.4"/>
          <circle cx="80" cy="520" r="3" fill="#FF0000" opacity="0.6"/>
          
          <line x1="260" y1="540" x2="340" y2="540" stroke="#FF0000" strokeWidth="1" opacity="0.5"/>
          <line x1="260" y1="540" x2="260" y2="500" stroke="#FF0000" strokeWidth="1" opacity="0.4"/>
          <circle cx="260" cy="540" r="3" fill="#FF0000" opacity="0.6"/>
          
          {/* Diagonal Tech Lines */}
          <line x1="0" y1="160" x2="40" y2="200" stroke="#FF0000" strokeWidth="1" opacity="0.3"/>
          <line x1="300" y1="450" x2="340" y2="490" stroke="#FF0000" strokeWidth="1" opacity="0.3"/>
          
          {/* Small Data Nodes */}
          <circle cx="100" cy="150" r="2" fill="#FF0000" opacity="0.5"/>
          <circle cx="240" cy="170" r="2" fill="#FF0000" opacity="0.4"/>
          <circle cx="50" cy="350" r="2" fill="#FF0000" opacity="0.5"/>
          <circle cx="290" cy="320" r="2" fill="#FF0000" opacity="0.4"/>
          <circle cx="70" cy="480" r="2" fill="#FF0000" opacity="0.5"/>
          <circle cx="270" cy="460" r="2" fill="#FF0000" opacity="0.4"/>
          
          {/* Corner Tech Accents */}
          <path d="M 10 10 L 10 40 M 10 10 L 40 10" stroke="#FF0000" strokeWidth="2" opacity="0.7"/>
          <path d="M 330 10 L 330 40 M 330 10 L 300 10" stroke="#FF0000" strokeWidth="2" opacity="0.7"/>
          <path d="M 10 610 L 10 580 M 10 610 L 40 610" stroke="#FF0000" strokeWidth="2" opacity="0.7"/>
          <path d="M 330 610 L 330 580 M 330 610 L 300 610" stroke="#FF0000" strokeWidth="2" opacity="0.7"/>
        </svg>

        {/* Top Glowing Bar */}
        <div style={{
          position: 'absolute',
          top: '0',
          left: '0',
          right: '0',
          height: '3px',
          background: 'linear-gradient(90deg, transparent, #FF0000, #FF0000, transparent)',
          boxShadow: '0 0 15px #FF0000, 0 0 30px #FF0000',
          zIndex: 5
        }} />
        
        {/* Bottom Glowing Bar */}
        <div style={{
          position: 'absolute',
          bottom: '0',
          left: '0',
          right: '0',
          height: '3px',
          background: 'linear-gradient(90deg, transparent, #FF0000, #FF0000, transparent)',
          boxShadow: '0 0 15px #FF0000, 0 0 30px #FF0000',
          zIndex: 5
        }} />
        
        {/* Scanline Effect */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255, 0, 0, 0.03) 2px, rgba(255, 0, 0, 0.03) 4px)',
          pointerEvents: 'none',
          zIndex: 6
        }} />
        
        {/* Glitch Lines */}
        <div style={{
          position: 'absolute',
          top: '25%',
          left: 0,
          right: 0,
          height: '1px',
          background: '#FF0000',
          opacity: 0.3,
          boxShadow: '0 0 10px #FF0000',
          zIndex: 4
        }} />
        <div style={{
          position: 'absolute',
          top: '75%',
          left: 0,
          right: 0,
          height: '1px',
          background: '#FF0000',
          opacity: 0.2,
          boxShadow: '0 0 8px #FF0000',
          zIndex: 4
        }} />
        
        {/* Corner Geometric Accents */}
        <div style={{
          position: 'absolute',
          top: '8px',
          left: '8px',
          width: '20px',
          height: '20px',
          borderTop: '2px solid #FF0000',
          borderLeft: '2px solid #FF0000',
          zIndex: 10,
          boxShadow: '-2px -2px 10px rgba(255, 0, 0, 0.5)'
        }} />
        <div style={{
          position: 'absolute',
          top: '8px',
          right: '8px',
          width: '20px',
          height: '20px',
          borderTop: '2px solid #FF0000',
          borderRight: '2px solid #FF0000',
          zIndex: 10,
          boxShadow: '2px -2px 10px rgba(255, 0, 0, 0.5)'
        }} />
        <div style={{
          position: 'absolute',
          bottom: '8px',
          left: '8px',
          width: '20px',
          height: '20px',
          borderBottom: '2px solid #FF0000',
          borderLeft: '2px solid #FF0000',
          zIndex: 10,
          boxShadow: '-2px 2px 10px rgba(255, 0, 0, 0.5)'
        }} />
        <div style={{
          position: 'absolute',
          bottom: '8px',
          right: '8px',
          width: '20px',
          height: '20px',
          borderBottom: '2px solid #FF0000',
          borderRight: '2px solid #FF0000',
          zIndex: 10,
          boxShadow: '2px 2px 10px rgba(255, 0, 0, 0.5)'
        }} />
        
        {/* Pulsing Glow Overlay */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          boxShadow: 'inset 0 0 100px rgba(255, 0, 0, 0.1)',
          pointerEvents: 'none',
          zIndex: 3,
          animation: 'npcPulse 3s ease-in-out infinite'
        }} />
      </>
    );
  };

  // ============================================
  // LEGENDARY EFFECTS
  // ============================================
  const LegendaryEffects = () => {
    if (aura.rarity !== 'legendary') return null;
    
    return (
      <>
        {/* Floating Gold Particles */}
        {Array.from({ length: 15 }, (_, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${Math.random() * 4 + 2}px`,
              height: `${Math.random() * 4 + 2}px`,
              borderRadius: '50%',
              background: '#FFD700',
              boxShadow: '0 0 10px #FFD700',
              animation: `float ${2 + Math.random() * 3}s ease-in-out ${Math.random() * 2}s infinite`,
              zIndex: 2
            }}
          />
        ))}
        
        {/* Crown at top */}
        <div style={{
          position: 'absolute',
          top: '-20px',
          left: '50%',
          transform: 'translateX(-50%)',
          fontSize: '35px',
          zIndex: 10,
          filter: 'drop-shadow(0 0 15px rgba(255, 215, 0, 0.8))',
          animation: 'bounce 2s ease-in-out infinite'
        }}>
          👑
        </div>
        
        {/* Premium shine */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: '-100%',
          width: '100%',
          height: '100%',
          background: 'linear-gradient(90deg, transparent, rgba(255,215,0,0.1), transparent)',
          animation: 'shine 4s ease-in-out infinite',
          zIndex: 3
        }} />
      </>
    );
  };

  // ============================================
  // EPIC EFFECTS
  // ============================================
  const EpicEffects = () => {
    if (aura.rarity !== 'epic') return null;
    
    return (
      <>
        {/* Purple/Cyan particles */}
        {Array.from({ length: 10 }, (_, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${Math.random() * 3 + 2}px`,
              height: `${Math.random() * 3 + 2}px`,
              borderRadius: '50%',
              background: i % 2 === 0 ? '#9400D3' : '#00BFFF',
              boxShadow: `0 0 8px ${i % 2 === 0 ? '#9400D3' : '#00BFFF'}`,
              animation: `float ${2 + Math.random() * 2}s ease-in-out ${Math.random() * 2}s infinite`,
              zIndex: 2
            }}
          />
        ))}
        
        {/* Chromatic aberration effect */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: '-100%',
          width: '100%',
          height: '100%',
          background: 'linear-gradient(90deg, transparent, rgba(148,0,211,0.1), transparent)',
          animation: 'shine 3s ease-in-out infinite',
          zIndex: 3
        }} />
      </>
    );
  };

  // ============================================
  // MID EFFECTS
  // ============================================
  const MidEffects = () => {
    if (aura.rarity !== 'mid') return null;
    
    return (
      <>
        {/* Subtle blue glow */}
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '200px',
          height: '200px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(59, 130, 246, 0.2) 0%, transparent 70%)',
          zIndex: 1
        }} />
        
        {/* "Epic is close" hint */}
        <div style={{
          position: 'absolute',
          top: '15px',
          right: '15px',
          background: 'rgba(148, 0, 211, 0.2)',
          border: '1px solid rgba(148, 0, 211, 0.5)',
          borderRadius: '15px',
          padding: '5px 10px',
          fontSize: '0.6rem',
          color: '#9400D3',
          zIndex: 10
        }}>
          ⚡ EPIC is close...
        </div>
      </>
    );
  };

  // ============================================
  // NOOB EFFECTS
  // ============================================
  const NoobEffects = () => {
    if (aura.rarity !== 'noob') return null;
    
    return (
      <>
        {/* Warning stripes top */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '6px',
          background: 'repeating-linear-gradient(90deg, #F59E0B 0px, #F59E0B 15px, #000 15px, #000 30px)',
          zIndex: 5
        }} />
        
        {/* Warning stripes bottom */}
        <div style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '6px',
          background: 'repeating-linear-gradient(90deg, #F59E0B 0px, #F59E0B 15px, #000 15px, #000 30px)',
          zIndex: 5
        }} />
        
        {/* Warning icons */}
        <div style={{
          position: 'absolute',
          top: '15px',
          left: '15px',
          fontSize: '1.2rem',
          zIndex: 10
        }}>⚠️</div>
        <div style={{
          position: 'absolute',
          top: '15px',
          right: '15px',
          fontSize: '1.2rem',
          zIndex: 10
        }}>⚠️</div>
      </>
    );
  };

  // ============================================
  // MAIN CARD RENDER
  // ============================================
  return (
    <div style={{
      position: 'relative',
      width: '340px',
      minHeight: '620px',
      borderRadius: aura.rarity === 'npc' ? '4px' : aura.rarity === 'legendary' ? '16px' : '12px',
      overflow: 'hidden',
      background: config.background,
      border: config.cardBorder,
      color: '#FFFFFF',
      fontFamily: aura.rarity === 'npc' 
        ? '"Courier New", monospace' 
        : aura.rarity === 'legendary' 
        ? '"Cinzel", serif' 
        : '"Inter", sans-serif',
      display: 'flex',
      flexDirection: 'column',
      boxShadow: `0 20px 60px rgba(0,0,0,0.8), 0 0 40px ${config.glowColor}`,
      opacity: isVisible ? 1 : 0,
      transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
      transition: 'opacity 0.5s, transform 0.5s',
    }}>
      
      {/* Tier-specific effects */}
      <NPCCircuitEffect />
      <LegendaryEffects />
      <EpicEffects />
      <MidEffects />
      <NoobEffects />
      
      {/* ============================================ */}
      {/* HEADER */}
      {/* ============================================ */}
      <div style={{
        background: config.headerBg,
        color: config.headerColor,
        padding: aura.rarity === 'npc' ? '15px 20px' : '12px 20px',
        textAlign: 'center',
        fontWeight: '800',
        fontSize: aura.rarity === 'npc' ? '0.8rem' : '0.85rem',
        letterSpacing: aura.rarity === 'npc' ? '3px' : '2px',
        position: 'relative',
        zIndex: 10,
        textShadow: aura.rarity === 'npc' ? '0 0 10px #FF0000' : 'none'
      }}>
        {config.headerText}
      </div>

      {/* ============================================ */}
      {/* MAIN CONTENT */}
      {/* ============================================ */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        padding: '25px 20px',
        position: 'relative',
        zIndex: 8,
      }}>
        
        {/* Tier Icon & Label */}
        <div style={{ textAlign: 'center', marginBottom: '15px' }}>
          <div style={{
            fontSize: aura.rarity === 'npc' ? '2.5rem' : '3rem',
            marginBottom: '5px',
            filter: aura.rarity === 'npc' 
              ? 'drop-shadow(0 0 20px #FF0000)'
              : aura.rarity === 'legendary' 
              ? 'drop-shadow(0 0 20px rgba(255, 215, 0, 0.8))'
              : 'none',
          }}>
            {config.tierIcon}
          </div>
          
          <h1 style={{
            margin: '0',
            fontSize: aura.rarity === 'npc' ? '2.2rem' : '2.5rem',
            fontWeight: '900',
            letterSpacing: aura.rarity === 'npc' ? '6px' : '4px',
            color: config.accentColor,
            textShadow: aura.rarity === 'npc' 
              ? '0 0 20px #FF0000, 0 0 40px #FF0000'
              : `0 0 30px ${config.glowColor}`,
          }}>
            {config.tierLabel}
          </h1>
          
          <p style={{
            margin: '8px 0 0 0',
            fontSize: '0.7rem',
            letterSpacing: '3px',
            color: config.secondaryColor,
            opacity: 0.9,
            fontFamily: aura.rarity === 'npc' ? 'monospace' : 'inherit'
          }}>
            {config.tierSubtext}
          </p>
        </div>

        {/* ============================================ */}
        {/* SCORE */}
        {/* ============================================ */}
        <div style={{
          textAlign: 'center',
          margin: '20px 0',
          position: 'relative',
        }}>
          {/* Score Background Glow */}
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '160px',
            height: '160px',
            borderRadius: '50%',
            background: `radial-gradient(circle, ${config.glowColor} 0%, transparent 70%)`,
            filter: 'blur(20px)',
            zIndex: -1,
          }} />
          
          {/* Score Number */}
          <div style={{
            fontSize: aura.rarity === 'npc' ? '4.5rem' : '5rem',
            fontWeight: '900',
            lineHeight: 1,
            color: config.accentColor,
            textShadow: aura.rarity === 'npc'
              ? '0 0 30px #FF0000, 0 0 60px #FF0000'
              : `0 0 30px ${config.glowColor}`,
            fontFamily: aura.rarity === 'npc' ? '"Courier New", monospace' : 'inherit'
          }}>
            {aura.score}
          </div>
          
          <div style={{
            fontSize: '0.7rem',
            color: config.accentColor,
            letterSpacing: '4px',
            marginTop: '8px',
            opacity: 0.8,
            fontFamily: aura.rarity === 'npc' ? 'monospace' : 'inherit'
          }}>
            {aura.rarity === 'npc' ? '// AURA_LEVEL' : 'AURA SCORE'}
          </div>
        </div>

        {/* ============================================ */}
        {/* ROAST BOX */}
        {/* ============================================ */}
        <div style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
        }}>
          <div style={{
            background: aura.rarity === 'npc' 
              ? 'rgba(255, 0, 0, 0.05)' 
              : 'rgba(0, 0, 0, 0.4)',
            border: aura.rarity === 'npc'
              ? '1px solid rgba(255, 0, 0, 0.4)'
              : `1px solid ${config.accentColor}40`,
            borderRadius: aura.rarity === 'npc' ? '0' : '12px',
            padding: '18px',
            position: 'relative',
          }}>
            {/* Quote Icon */}
            <div style={{
              position: 'absolute',
              top: '-12px',
              left: '20px',
              background: config.background,
              padding: '0 8px',
              color: config.accentColor,
              fontSize: '1rem',
            }}>
              {aura.rarity === 'npc' ? '>' : '💬'}
            </div>
            
            <p style={{
              margin: 0,
              fontSize: '0.95rem',
              lineHeight: 1.6,
              color: 'rgba(255,255,255,0.95)',
              fontStyle: aura.rarity === 'npc' ? 'normal' : 'italic',
              fontFamily: aura.rarity === 'npc' ? 'monospace' : 'inherit'
            }}>
              {aura.roast}
            </p>
          </div>
        </div>

        {/* ============================================ */}
        {/* MOTIVATION TEXT */}
        {/* ============================================ */}
        <div style={{
          textAlign: 'center',
          marginTop: '15px',
          padding: '10px',
          borderTop: `1px solid rgba(255,255,255,0.1)`,
        }}>
          <p style={{
            margin: 0,
            fontSize: '0.8rem',
            color: config.accentColor,
            fontWeight: '600',
            fontFamily: aura.rarity === 'npc' ? 'monospace' : 'inherit'
          }}>
            {config.motivationText}
          </p>
        </div>

        {/* ============================================ */}
        {/* CTA BUTTON */}
        {/* ============================================ */}
        <button style={{
          width: '100%',
          marginTop: '15px',
          padding: '14px 20px',
          background: config.ctaColor,
          border: aura.rarity === 'npc' ? '1px solid #FF0000' : 'none',
          borderRadius: aura.rarity === 'npc' ? '0' : '12px',
          color: config.ctaTextColor,
          fontSize: '0.9rem',
          fontWeight: '800',
          letterSpacing: '1px',
          cursor: 'pointer',
          boxShadow: `0 5px 20px ${config.glowColor}`,
          fontFamily: aura.rarity === 'npc' ? 'monospace' : 'inherit',
          textTransform: aura.rarity === 'npc' ? 'uppercase' : 'none'
        }}>
          {config.ctaText}
        </button>
      </div>

      {/* ============================================ */}
      {/* FOOTER */}
      {/* ============================================ */}
      <div style={{
        padding: '15px 20px',
        borderTop: `1px solid ${config.accentColor}30`,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        background: aura.rarity === 'npc' ? 'rgba(255, 0, 0, 0.05)' : 'rgba(0,0,0,0.3)',
        position: 'relative',
        zIndex: 10,
      }}>
        <div style={{
          fontSize: '0.5rem',
          color: config.accentColor,
          letterSpacing: '1px',
          maxWidth: '55%',
          lineHeight: 1.3,
          fontFamily: aura.rarity === 'npc' ? 'monospace' : 'inherit'
        }}>
          {aura.challenge}
        </div>
        
        <div style={{
          fontSize: '0.6rem',
          color: 'rgba(255,255,255,0.5)',
          letterSpacing: '1px',
        }}>
          aura-roast.com
        </div>
      </div>

      {/* ============================================ */}
      {/* CSS ANIMATIONS */}
      {/* ============================================ */}
      <style jsx global>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) translateX(0); opacity: 0.8; }
          50% { transform: translateY(-15px) translateX(5px); opacity: 0.4; }
        }
        
        @keyframes bounce {
          0%, 100% { transform: translateX(-50%) translateY(0); }
          50% { transform: translateX(-50%) translateY(-8px); }
        }
        
        @keyframes shine {
          0% { left: -100%; }
          50%, 100% { left: 200%; }
        }
        
        @keyframes npcPulse {
          0%, 100% { box-shadow: inset 0 0 100px rgba(255, 0, 0, 0.1); }
          50% { box-shadow: inset 0 0 150px rgba(255, 0, 0, 0.15); }
        }
        
        @keyframes glitch {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-2px); }
          75% { transform: translateX(2px); }
        }
      `}</style>
    </div>
  );
};

export default AuraCard;
