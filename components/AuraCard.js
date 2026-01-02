    import { useState } from 'react';

const AuraCard = ({ aura }) => {
  const getTierData = (rarity, score) => {
    switch (rarity) {
      case 'legendary':
        // Royal Luxury / Celestial - Deep Obsidian & 24k Liquid Gold
        return {
          background: 'linear-gradient(180deg, #0a0a0a 0%, #111111 50%, #0a0a0a 100%)',
          border: 'none',
          accent: '#FFD700',
          header: "DARE TO MATCH MY SCORE? TRY IT, LOSERS.",
          icon: "👑",
          tierName: 'PEAK ENTITY',
          fontFamily: '"Cinzel", "Times New Roman", serif',
        };
      case 'epic':
        // Cyber-Vibrant / Glitch Core - Chromatic Aberration
        return {
          background: 'linear-gradient(135deg, #0d0221 0%, #1a0533 50%, #0d0221 100%)',
          border: 'none',
          accent: '#00FFFF',
          secondaryAccent: '#FF00FF',
          header: "DARE TO MATCH MY SCORE? TRY IT, LOSERS.",
          icon: "⚡",
          tierName: 'THE ANOMALY',
          fontFamily: '"Orbitron", "Arial", sans-serif',
        };
      case 'mid':
        // Clean Glassmorphism / Corporate Sci-Fi
        return {
          background: 'linear-gradient(135deg, rgba(30, 60, 114, 0.9) 0%, rgba(42, 82, 152, 0.8) 100%)',
          border: '2px solid rgba(0, 200, 255, 0.5)',
          accent: '#00C8FF',
          header: "MAIN CHARACTER ENERGY DETECTED.",
          icon: "🔥",
          tierName: 'MAIN CHARACTER',
          fontFamily: '"Inter", "Helvetica Neue", sans-serif',
        };
      case 'noob':
        // Y2K Plastic / Warning - Hazard Orange & Yellow
        return {
          background: 'linear-gradient(135deg, #1a1200 0%, #2a1a00 50%, #1a1200 100%)',
          border: 'none',
          accent: '#FF6600',
          secondaryAccent: '#FFCC00',
          header: "FUTURE SO DARK THAT EVEN GOOGLE MAPS CANT FIND IT.",
          icon: "⚠️",
          tierName: 'THE FRAGILE',
          fontFamily: '"Arial Black", "Arial", sans-serif',
        };
      case 'npc':
      default:
        // Industrial Brutalism / Dystopian - Matte Black Obsidian
        return {
          background: 'linear-gradient(180deg, #080808 0%, #0f0f0f 50%, #080808 100%)',
          border: '3px dashed #DC143C',
          accent: '#DC143C',
          header: "FUTURE SO DARK THAT EVEN GOOGLE MAPS CANT FIND IT.",
          icon: "💀",
          tierName: 'SYSTEM DEFAULT',
          fontFamily: '"Courier New", monospace',
        };
    }
  };

  const tier = getTierData(aura.rarity, aura.score);

  // ==================== NPC EFFECTS ====================
  // Industrial Brutalism - VHS Scanlines, Digital Noise, CRT Flicker
  const NPCEffects = () => {
    if (aura.rarity !== 'npc') return null;
    
    return (
      <>
        {/* Heavy VHS Scanlines */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0, 0, 0, 0.4) 2px, rgba(0, 0, 0, 0.4) 4px)',
          pointerEvents: 'none',
          zIndex: 10
        }}></div>
        
        {/* Digital Noise Texture */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          opacity: 0.1,
          pointerEvents: 'none',
          zIndex: 11
        }}></div>
        
        {/* Corrupted Data Stream Lines */}
        <div style={{
          position: 'absolute',
          top: '18%',
          left: 0,
          right: 0,
          height: '2px',
          background: 'linear-gradient(90deg, transparent 0%, #DC143C 20%, #DC143C 80%, transparent 100%)',
          opacity: 0.7,
          boxShadow: '0 0 10px #DC143C'
        }}></div>
        <div style={{
          position: 'absolute',
          top: '45%',
          left: 0,
          right: 0,
          height: '1px',
          background: 'linear-gradient(90deg, transparent 10%, #DC143C 30%, transparent 50%, #DC143C 70%, transparent 90%)',
          opacity: 0.5
        }}></div>
        <div style={{
          position: 'absolute',
          top: '72%',
          left: 0,
          right: 0,
          height: '3px',
          background: 'linear-gradient(90deg, transparent 5%, #DC143C 25%, #DC143C 75%, transparent 95%)',
          opacity: 0.4,
          boxShadow: '0 0 8px #DC143C'
        }}></div>

        {/* CRT Flicker Overlay */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'radial-gradient(ellipse at center, transparent 0%, rgba(0,0,0,0.3) 100%)',
          pointerEvents: 'none',
          zIndex: 12
        }}></div>
      </>
    );
  };

  // ==================== NOOB EFFECTS ====================
  // Y2K Plastic / Warning - Safety Stripes, Glowing Circuits
  const NoobEffects = () => {
    if (aura.rarity !== 'noob') return null;
    
    return (
      <>
        {/* Safety Stripe Border - Top */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '18px',
          background: 'repeating-linear-gradient(45deg, #FF6600, #FF6600 10px, #FFCC00 10px, #FFCC00 20px)',
          zIndex: 5
        }}></div>
        
        {/* Safety Stripe Border - Bottom */}
        <div style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '18px',
          background: 'repeating-linear-gradient(45deg, #FF6600, #FF6600 10px, #FFCC00 10px, #FFCC00 20px)',
          zIndex: 5
        }}></div>

        {/* Safety Stripe Border - Left */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          bottom: 0,
          width: '18px',
          background: 'repeating-linear-gradient(45deg, #FF6600, #FF6600 10px, #FFCC00 10px, #FFCC00 20px)',
          zIndex: 5
        }}></div>

        {/* Safety Stripe Border - Right */}
        <div style={{
          position: 'absolute',
          top: 0,
          right: 0,
          bottom: 0,
          width: '18px',
          background: 'repeating-linear-gradient(45deg, #FF6600, #FF6600 10px, #FFCC00 10px, #FFCC00 20px)',
          zIndex: 5
        }}></div>
        
        {/* Translucent Plastic Overlay */}
        <div style={{
          position: 'absolute',
          top: '18px',
          left: '18px',
          right: '18px',
          bottom: '18px',
          background: 'linear-gradient(135deg, rgba(255, 102, 0, 0.15) 0%, rgba(255, 204, 0, 0.08) 50%, rgba(255, 102, 0, 0.15) 100%)',
          pointerEvents: 'none',
          zIndex: 1
        }}></div>
        
        {/* Glowing Circuit Lines */}
        <div style={{
          position: 'absolute',
          top: '35%',
          left: '25px',
          width: '60px',
          height: '2px',
          background: '#FF6600',
          boxShadow: '0 0 12px #FF6600, 0 0 20px #FF6600',
          opacity: 0.6
        }}></div>
        <div style={{
          position: 'absolute',
          top: '35%',
          left: '85px',
          width: '2px',
          height: '50px',
          background: '#FFCC00',
          boxShadow: '0 0 12px #FFCC00, 0 0 20px #FFCC00',
          opacity: 0.6
        }}></div>
        <div style={{
          position: 'absolute',
          bottom: '35%',
          right: '25px',
          width: '50px',
          height: '2px',
          background: '#FFCC00',
          boxShadow: '0 0 12px #FFCC00',
          opacity: 0.5
        }}></div>
        
        {/* Caution Icon - Top Left */}
        <div style={{
          position: 'absolute',
          top: '28px',
          left: '28px',
          fontSize: '1.3rem',
          zIndex: 6,
          filter: 'drop-shadow(0 0 5px #FF6600)'
        }}>⚠️</div>
        
        {/* Low Battery Icon - Top Right */}
        <div style={{
          position: 'absolute',
          top: '28px',
          right: '28px',
          fontSize: '1.1rem',
          zIndex: 6,
          filter: 'drop-shadow(0 0 5px #FFCC00)'
        }}>🪫</div>

        {/* Caution Icon - Bottom Left */}
        <div style={{
          position: 'absolute',
          bottom: '28px',
          left: '28px',
          fontSize: '1rem',
          zIndex: 6,
          opacity: 0.7
        }}>⚠️</div>
      </>
    );
  };

  // ==================== MID EFFECTS ====================
  // Clean Glassmorphism / Corporate Sci-Fi - Frosted Glass, Bokeh
  const MidEffects = () => {
    if (aura.rarity !== 'mid') return null;
    
    return (
      <>
        {/* Frosted Glass Overlay */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          background: 'rgba(255, 255, 255, 0.05)',
          pointerEvents: 'none',
          zIndex: 1
        }}></div>
        
        {/* Glowing Electric Edges */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          boxShadow: 'inset 0 0 40px rgba(0, 200, 255, 0.3), inset 0 0 80px rgba(0, 100, 255, 0.15)',
          borderRadius: '20px',
          pointerEvents: 'none',
          zIndex: 2
        }}></div>
        
        {/* Bokeh Light 1 */}
        <div style={{
          position: 'absolute',
          top: '8%',
          left: '8%',
          width: '80px',
          height: '80px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(0, 200, 255, 0.4) 0%, transparent 70%)',
          filter: 'blur(15px)',
          zIndex: 0
        }}></div>
        
        {/* Bokeh Light 2 */}
        <div style={{
          position: 'absolute',
          top: '45%',
          right: '10%',
          width: '60px',
          height: '60px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(100, 180, 255, 0.5) 0%, transparent 70%)',
          filter: 'blur(12px)',
          zIndex: 0
        }}></div>
        
        {/* Bokeh Light 3 */}
        <div style={{
          position: 'absolute',
          bottom: '15%',
          left: '15%',
          width: '70px',
          height: '70px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(0, 255, 200, 0.35) 0%, transparent 70%)',
          filter: 'blur(18px)',
          zIndex: 0
        }}></div>

        {/* Bokeh Light 4 */}
        <div style={{
          position: 'absolute',
          top: '25%',
          left: '50%',
          width: '40px',
          height: '40px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(150, 200, 255, 0.3) 0%, transparent 70%)',
          filter: 'blur(10px)',
          zIndex: 0
        }}></div>

        {/* Subtle Grid Pattern */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: 'linear-gradient(rgba(0, 200, 255, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 200, 255, 0.03) 1px, transparent 1px)',
          backgroundSize: '30px 30px',
          pointerEvents: 'none',
          zIndex: 1
        }}></div>
      </>
    );
  };

  // ==================== EPIC EFFECTS ====================
  // Cyber-Vibrant / Glitch Core - Chromatic Aberration, Holographic
  const EpicEffects = () => {
    if (aura.rarity !== 'epic') return null;
    
    return (
      <>
        {/* RGB Split Border - Cyan Layer */}
        <div style={{
          position: 'absolute',
          top: '-3px',
          left: '-3px',
          right: '3px',
          bottom: '3px',
          border: '2px solid #00FFFF',
          clipPath: 'polygon(0 0, 92% 0, 100% 8%, 100% 100%, 8% 100%, 0 92%)',
          opacity: 0.8,
          pointerEvents: 'none',
          zIndex: 3
        }}></div>
        
        {/* RGB Split Border - Magenta Layer */}
        <div style={{
          position: 'absolute',
          top: '3px',
          left: '3px',
          right: '-3px',
          bottom: '-3px',
          border: '2px solid #FF00FF',
          clipPath: 'polygon(0 0, 92% 0, 100% 8%, 100% 100%, 8% 100%, 0 92%)',
          opacity: 0.8,
          pointerEvents: 'none',
          zIndex: 3
        }}></div>
        
        {/* Holographic Code Fragments */}
        <div style={{
          position: 'absolute',
          top: '12%',
          left: '8%',
          fontSize: '0.65rem',
          fontFamily: 'monospace',
          color: '#00FFFF',
          opacity: 0.5,
          transform: 'rotate(-12deg)',
          textShadow: '0 0 10px #00FFFF',
          zIndex: 2
        }}>{'{ 0x7F3A }'}</div>
        
        <div style={{
          position: 'absolute',
          top: '22%',
          right: '10%',
          fontSize: '0.55rem',
          fontFamily: 'monospace',
          color: '#FF00FF',
          opacity: 0.45,
          transform: 'rotate(8deg)',
          textShadow: '0 0 10px #FF00FF',
          zIndex: 2
        }}>{'<ANOMALY/>'}</div>
        
        <div style={{
          position: 'absolute',
          bottom: '28%',
          left: '12%',
          fontSize: '0.6rem',
          fontFamily: 'monospace',
          color: '#00FFFF',
          opacity: 0.4,
          transform: 'rotate(5deg)',
          textShadow: '0 0 8px #00FFFF',
          zIndex: 2
        }}>{'>> ERR_0xFF'}</div>

        <div style={{
          position: 'absolute',
          top: '55%',
          left: '5%',
          fontSize: '0.5rem',
          fontFamily: 'monospace',
          color: '#FF00FF',
          opacity: 0.35,
          transform: 'rotate(-5deg)',
          zIndex: 2
        }}>{'[GLITCH]'}</div>
        
        {/* 3D Data Shards */}
        <div style={{
          position: 'absolute',
          top: '38%',
          right: '8%',
          width: '25px',
          height: '50px',
          background: 'linear-gradient(135deg, rgba(0, 255, 255, 0.4) 0%, rgba(255, 0, 255, 0.4) 100%)',
          transform: 'rotate(25deg) skewY(-15deg)',
          opacity: 0.6,
          boxShadow: '0 0 20px rgba(0, 255, 255, 0.3)',
          zIndex: 1
        }}></div>
        
        <div style={{
          position: 'absolute',
          bottom: '22%',
          right: '22%',
          width: '18px',
          height: '35px',
          background: 'linear-gradient(135deg, rgba(255, 0, 255, 0.5) 0%, rgba(0, 255, 255, 0.3) 100%)',
          transform: 'rotate(-18deg) skewX(12deg)',
          opacity: 0.5,
          boxShadow: '0 0 15px rgba(255, 0, 255, 0.3)',
          zIndex: 1
        }}></div>

        <div style={{
          position: 'absolute',
          top: '65%',
          left: '8%',
          width: '15px',
          height: '28px',
          background: 'linear-gradient(135deg, rgba(0, 255, 255, 0.35) 0%, rgba(255, 0, 255, 0.35) 100%)',
          transform: 'rotate(40deg)',
          opacity: 0.45,
          zIndex: 1
        }}></div>
        
        {/* Anamorphic Lens Flare */}
        <div style={{
          position: 'absolute',
          top: '6%',
          right: '15%',
          width: '120px',
          height: '4px',
          background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.9), transparent)',
          transform: 'rotate(-25deg)',
          filter: 'blur(2px)',
          opacity: 0.7,
          zIndex: 4
        }}></div>

        {/* Secondary Lens Flare */}
        <div style={{
          position: 'absolute',
          top: '10%',
          right: '25%',
          width: '60px',
          height: '2px',
          background: 'linear-gradient(90deg, transparent, rgba(0, 255, 255, 0.8), transparent)',
          transform: 'rotate(-25deg)',
          filter: 'blur(1px)',
          opacity: 0.5,
          zIndex: 4
        }}></div>

        {/* Holographic Shimmer Overlay */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'linear-gradient(135deg, rgba(0, 255, 255, 0.05) 0%, transparent 50%, rgba(255, 0, 255, 0.05) 100%)',
          pointerEvents: 'none',
          zIndex: 1
        }}></div>
      </>
    );
  };

  // ==================== LEGENDARY EFFECTS ====================
  // Royal Luxury / Celestial - Liquid Gold, Solar Flare, Dust Particles
  const LegendaryEffects = () => {
    if (aura.rarity !== 'legendary') return null;
    
    return (
      <>
        {/* Outer Gold Border */}
        <div style={{
          position: 'absolute',
          top: '6px',
          left: '6px',
          right: '6px',
          bottom: '6px',
          border: '2px solid #FFD700',
          borderRadius: '12px',
          pointerEvents: 'none',
          zIndex: 3,
          boxShadow: '0 0 15px rgba(255, 215, 0, 0.5)'
        }}></div>
        
        {/* Inner Gold Border */}
        <div style={{
          position: 'absolute',
          top: '14px',
          left: '14px',
          right: '14px',
          bottom: '14px',
          border: '1px solid rgba(255, 215, 0, 0.6)',
          borderRadius: '8px',
          pointerEvents: 'none',
          zIndex: 3
        }}></div>
        
        {/* Solar Flare Bloom - Top Center */}
        <div style={{
          position: 'absolute',
          top: '-30px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '200px',
          height: '100px',
          background: 'radial-gradient(ellipse, rgba(255, 215, 0, 0.5) 0%, rgba(255, 180, 0, 0.2) 40%, transparent 70%)',
          filter: 'blur(20px)',
          zIndex: 0
        }}></div>

        {/* Solar Flare Bloom - Bottom */}
        <div style={{
          position: 'absolute',
          bottom: '-20px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '150px',
          height: '60px',
          background: 'radial-gradient(ellipse, rgba(255, 215, 0, 0.3) 0%, transparent 70%)',
          filter: 'blur(15px)',
          zIndex: 0
        }}></div>
        
        {/* Floating Golden Dust Particles */}
        <div style={{
          position: 'absolute',
          top: '12%',
          left: '18%',
          width: '5px',
          height: '5px',
          borderRadius: '50%',
          background: '#FFD700',
          boxShadow: '0 0 8px #FFD700, 0 0 15px #FFD700',
          opacity: 0.9,
          zIndex: 2
        }}></div>
        <div style={{
          position: 'absolute',
          top: '20%',
          right: '22%',
          width: '4px',
          height: '4px',
          borderRadius: '50%',
          background: '#FFD700',
          boxShadow: '0 0 6px #FFD700, 0 0 12px #FFD700',
          opacity: 0.7,
          zIndex: 2
        }}></div>
        <div style={{
          position: 'absolute',
          top: '35%',
          left: '12%',
          width: '3px',
          height: '3px',
          borderRadius: '50%',
          background: '#FFD700',
          boxShadow: '0 0 5px #FFD700',
          opacity: 0.8,
          zIndex: 2
        }}></div>
        <div style={{
          position: 'absolute',
          top: '50%',
          right: '15%',
          width: '4px',
          height: '4px',
          borderRadius: '50%',
          background: '#FFD700',
          boxShadow: '0 0 7px #FFD700, 0 0 14px #FFD700',
          opacity: 0.6,
          zIndex: 2
        }}></div>
        <div style={{
          position: 'absolute',
          top: '65%',
          left: '20%',
          width: '3px',
          height: '3px',
          borderRadius: '50%',
          background: '#FFD700',
          boxShadow: '0 0 5px #FFD700',
          opacity: 0.75,
          zIndex: 2
        }}></div>
        <div style={{
          position: 'absolute',
          bottom: '25%',
          right: '25%',
          width: '5px',
          height: '5px',
          borderRadius: '50%',
          background: '#FFD700',
          boxShadow: '0 0 8px #FFD700, 0 0 16px #FFD700',
          opacity: 0.85,
          zIndex: 2
        }}></div>
        <div style={{
          position: 'absolute',
          bottom: '18%',
          left: '30%',
          width: '3px',
          height: '3px',
          borderRadius: '50%',
          background: '#FFD700',
          boxShadow: '0 0 4px #FFD700',
          opacity: 0.65,
          zIndex: 2
        }}></div>
        <div style={{
          position: 'absolute',
          top: '42%',
          left: '25%',
          width: '2px',
          height: '2px',
          borderRadius: '50%',
          background: '#FFD700',
          boxShadow: '0 0 4px #FFD700',
          opacity: 0.5,
          zIndex: 2
        }}></div>
        
        {/* Majestic Golden Glow Overlay */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          boxShadow: 'inset 0 0 60px rgba(255, 215, 0, 0.15), inset 0 0 100px rgba(255, 180, 0, 0.08)',
          borderRadius: '15px',
          pointerEvents: 'none',
          zIndex: 1
        }}></div>
      </>
    );
  };

  // Get clip path for EPIC tier (asymmetrical polygon frame)
  const getClipPath = () => {
    if (aura.rarity === 'epic') {
      return 'polygon(0 0, 92% 0, 100% 8%, 100% 100%, 8% 100%, 0 92%)';
    }
    return 'none';
  };

  // Get border radius based on tier
  const getBorderRadius = () => {
    if (aura.rarity === 'epic') return '0px';
    if (aura.rarity === 'npc') return '5px';
    if (aura.rarity === 'mid') return '20px';
    if (aura.rarity === 'legendary') return '15px';
    return '12px';
  };

  // Get box shadow based on tier
  const getBoxShadow = () => {
    switch (aura.rarity) {
      case 'legendary':
        return '0 0 50px rgba(255, 215, 0, 0.4), 0 0 100px rgba(255, 215, 0, 0.2), 0 20px 40px rgba(0,0,0,0.8)';
      case 'epic':
        return '0 0 40px rgba(0, 255, 255, 0.4), 0 0 40px rgba(255, 0, 255, 0.3), 0 0 80px rgba(0, 255, 255, 0.2), 0 15px 35px rgba(0,0,0,0.8)';
      case 'mid':
        return '0 0 50px rgba(0, 200, 255, 0.3), 0 0 80px rgba(0, 150, 255, 0.15), 0 15px 35px rgba(0,0,0,0.5)';
      case 'noob':
        return '0 0 30px rgba(255, 102, 0, 0.3), 0 10px 30px rgba(0,0,0,0.7)';
      case 'npc':
      default:
        return '0 0 20px rgba(220, 20, 60, 0.3), 0 10px 30px rgba(0,0,0,0.8)';
    }
  };

  return (
    <div style={{
      position: 'relative',
      width: '320px',
      minHeight: '580px',
      borderRadius: getBorderRadius(),
      clipPath: getClipPath(),
      overflow: 'hidden',
      background: tier.background,
      border: tier.border,
      color: '#FFFFFF',
      fontFamily: tier.fontFamily,
      display: 'flex',
      flexDirection: 'column',
      padding: aura.rarity === 'noob' ? '35px 30px' : '20px',
      textAlign: 'center',
      boxShadow: getBoxShadow()
    }}>
      
      {/* Tier-specific effects */}
      <NPCEffects />
      <NoobEffects />
      <MidEffects />
      <EpicEffects />
      <LegendaryEffects />
      
      {/* 1. The Header (BAIT) */}
      <div style={{
        fontSize: aura.rarity === 'npc' ? '0.85rem' : '0.9rem',
        fontWeight: 'bold',
        marginBottom: '15px',
        color: tier.accent,
        textTransform: 'uppercase',
        letterSpacing: aura.rarity === 'npc' ? '3px' : aura.rarity === 'legendary' ? '2px' : '1px',
        textShadow: aura.rarity === 'npc' 
          ? `0 0 15px ${tier.accent}, 0 0 30px ${tier.accent}` 
          : aura.rarity === 'legendary'
          ? `0 0 20px ${tier.accent}`
          : 'none',
        zIndex: 20
      }}>
        {tier.header}
      </div>

      {/* 2. Rarity Icon & Name */}
      <div style={{ 
        fontSize: '2.5rem', 
        marginBottom: '5px',
        zIndex: 20,
        filter: aura.rarity === 'epic' 
          ? 'drop-shadow(3px 0 0 #00FFFF) drop-shadow(-3px 0 0 #FF00FF)' 
          : aura.rarity === 'legendary'
          ? 'drop-shadow(0 0 10px #FFD700)'
          : 'none'
      }}>{tier.icon}</div>
      
      <h2 style={{ 
        fontSize: '2rem', 
        margin: '0', 
        letterSpacing: aura.rarity === 'legendary' ? '5px' : '3px',
        textShadow: aura.rarity === 'legendary' 
          ? '0 0 25px #FFD700, 0 0 50px #FFD700, 0 0 75px rgba(255, 215, 0, 0.5)'
          : aura.rarity === 'epic'
          ? '3px 0 0 #00FFFF, -3px 0 0 #FF00FF, 0 0 25px rgba(255, 0, 255, 0.6), 0 0 50px rgba(0, 255, 255, 0.4)'
          : aura.rarity === 'mid'
          ? '0 0 20px #00C8FF, 0 0 40px rgba(0, 200, 255, 0.5)'
          : aura.rarity === 'noob'
          ? '0 0 15px #FF6600, 0 0 30px rgba(255, 102, 0, 0.5)'
          : `0 0 15px ${tier.accent}, 0 0 30px ${tier.accent}`,
        color: tier.accent,
        zIndex: 20
      }}>
        {aura.title}
      </h2>
      
      {/* Tier Subtitle */}
      <div style={{
        fontSize: '0.7rem',
        letterSpacing: aura.rarity === 'legendary' ? '6px' : '4px',
        opacity: 0.8,
        marginTop: '8px',
        color: aura.rarity === 'epic' ? '#FF00FF' : tier.accent,
        textTransform: 'uppercase',
        textShadow: aura.rarity === 'npc' ? `0 0 10px ${tier.accent}` : 'none',
        zIndex: 20
      }}>
        {tier.tierName}
      </div>

      {/* 3. Score (Centerpiece) */}
      <div style={{
        fontSize: '5rem',
        fontWeight: '900',
        margin: '25px 0',
        textShadow: aura.rarity === 'legendary'
          ? '0 0 30px #FFD700, 0 0 60px #FFD700, 0 0 90px rgba(255, 215, 0, 0.6), 0 5px 0 #B8860B'
          : aura.rarity === 'epic'
          ? '5px 0 0 #00FFFF, -5px 0 0 #FF00FF, 0 0 40px rgba(0, 255, 255, 0.8), 0 0 60px rgba(255, 0, 255, 0.5)'
          : aura.rarity === 'mid'
          ? '0 0 25px #00C8FF, 0 0 50px rgba(0, 200, 255, 0.6), 0 0 75px rgba(0, 150, 255, 0.3)'
          : aura.rarity === 'noob'
          ? '0 0 20px #FF6600, 0 0 40px rgba(255, 102, 0, 0.5)'
          : `0 0 25px ${tier.accent}, 0 0 50px ${tier.accent}`,
        color: aura.rarity === 'legendary' 
          ? 'transparent'
          : aura.rarity === 'noob' 
          ? '#FF6600' 
          : '#FFFFFF',
        position: 'relative',
        zIndex: 20,
        // Metallic Gold 3D effect for Legendary
        background: aura.rarity === 'legendary' 
          ? 'linear-gradient(180deg, #FFD700 0%, #FFEC8B 25%, #FFD700 50%, #DAA520 75%, #FFD700 100%)'
          : 'none',
        WebkitBackgroundClip: aura.rarity === 'legendary' ? 'text' : 'unset',
        WebkitTextFillColor: aura.rarity === 'legendary' ? 'transparent' : 'unset',
        backgroundClip: aura.rarity === 'legendary' ? 'text' : 'unset',
      }}>
        {aura.score}
        
        {/* Score glow effect */}
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '150%',
          height: '150%',
          borderRadius: '50%',
          background: aura.rarity === 'epic' 
            ? 'radial-gradient(circle, rgba(0, 255, 255, 0.3) 0%, rgba(255, 0, 255, 0.2) 50%, transparent 70%)'
            : tier.accent,
          filter: aura.rarity === 'legendary' ? 'blur(50px)' : 'blur(30px)',
          opacity: aura.rarity === 'legendary' ? 0.5 : 0.35,
          zIndex: '-1'
        }}></div>
      </div>

      {/* 4. The Roast (Savage AI Switch) */}
      <div style={{
        marginTop: 'auto',
        background: aura.rarity === 'mid' 
          ? 'rgba(255,255,255,0.1)'
          : aura.rarity === 'legendary'
          ? 'rgba(0,0,0,0.7)'
          : aura.rarity === 'epic'
          ? 'rgba(0,0,0,0.5)'
          : 'rgba(0,0,0,0.5)',
        backdropFilter: aura.rarity === 'mid' ? 'blur(15px)' : 'none',
        WebkitBackdropFilter: aura.rarity === 'mid' ? 'blur(15px)' : 'none',
        padding: '18px',
        borderRadius: aura.rarity === 'mid' ? '15px' : '10px',
        border: aura.rarity === 'legendary' 
          ? '1px solid rgba(255, 215, 0, 0.6)'
          : aura.rarity === 'epic' 
          ? '1px solid rgba(0, 255, 255, 0.5)'
          : aura.rarity === 'mid'
          ? '1px solid rgba(0, 200, 255, 0.4)'
          : `1px solid ${tier.accent}`,
        fontSize: '0.95rem',
        lineHeight: '1.4',
        zIndex: 20,
        boxShadow: aura.rarity === 'legendary' 
          ? '0 0 20px rgba(255, 215, 0, 0.2)'
          : aura.rarity === 'epic'
          ? '0 0 15px rgba(0, 255, 255, 0.2), 0 0 15px rgba(255, 0, 255, 0.1)'
          : 'none'
      }}>
        {aura.roast}
      </div>

      {/* 5. Footer */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: '20px',
        fontSize: '0.8rem',
        zIndex: 20
      }}>
        <div style={{ 
          width: '45px', 
          height: '45px', 
          background: aura.rarity === 'legendary' 
            ? 'linear-gradient(135deg, #FFD700, #FFA500)' 
            : aura.rarity === 'epic'
            ? 'linear-gradient(135deg, #00FFFF, #FF00FF)'
            : '#FFF', 
          padding: '2px',
          borderRadius: aura.rarity === 'mid' ? '10px' : aura.rarity === 'epic' ? '0' : '3px',
          boxShadow: aura.rarity === 'legendary' 
            ? '0 0 15px rgba(255, 215, 0, 0.5)'
            : aura.rarity === 'epic'
            ? '0 0 10px rgba(0, 255, 255, 0.5)'
            : 'none'
        }}>
          {/* QR Component would go here */}
        </div>
        <span style={{ 
          opacity: 0.8,
          color: tier.accent,
          letterSpacing: aura.rarity === 'npc' ? '3px' : aura.rarity === 'legendary' ? '2px' : '1px',
          textShadow: aura.rarity === 'npc' ? `0 0 8px ${tier.accent}` : 'none',
          fontWeight: aura.rarity === 'legendary' ? '600' : 'normal'
        }}>aura-roast.com</span>
      </div>
    </div>
  );
};

export default AuraCard;
