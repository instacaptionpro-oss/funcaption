// /components/AuraCard.js

import { useState, useEffect, useRef } from 'react';

const AuraCard = ({ aura }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [shareMessage, setShareMessage] = useState('');
  const cardRef = useRef(null);
  
  useEffect(() => {
    setIsVisible(true);
  }, []);

  // ============================================
  // SHARE FUNCTIONS
  // ============================================

  const captureCard = async () => {
    try {
      const html2canvas = (await import('html2canvas')).default;
      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: '#0a0a0a',
        scale: 2,
        useCORS: true,
        logging: false,
      });
      return canvas;
    } catch (error) {
      console.error('Error capturing card:', error);
      return null;
    }
  };

  const downloadCard = async () => {
    setIsSharing(true);
    try {
      const canvas = await captureCard();
      if (canvas) {
        const link = document.createElement('a');
        link.download = `aura-card-${aura.rarity}-${Date.now()}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
        setShareMessage('✅ Downloaded! Now share on Instagram');
        setTimeout(() => setShareMessage(''), 3000);
      }
    } catch (error) {
      console.error('Download error:', error);
      setShareMessage('❌ Download failed. Try again.');
      setTimeout(() => setShareMessage(''), 3000);
    }
    setIsSharing(false);
  };

  const shareToInstagramStory = async () => {
    setIsSharing(true);
    try {
      const canvas = await captureCard();
      if (!canvas) throw new Error('Failed to capture');

      const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png'));
      const file = new File([blob], 'aura-card.png', { type: 'image/png' });

      if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: `My Aura: ${aura.rarity.toUpperCase()}`,
          text: `I got ${aura.rarity.toUpperCase()} tier with ${aura.score} aura! 🔥 Check yours at aura-roast.com`,
        });
        setShareMessage('✅ Shared successfully!');
      } else {
        await downloadCard();
        setShowShareModal(true);
      }
    } catch (error) {
      if (error.name !== 'AbortError') {
        console.error('Share error:', error);
        await downloadCard();
        setShowShareModal(true);
      }
    }
    setIsSharing(false);
    setTimeout(() => setShareMessage(''), 3000);
  };

  const shareToInstagramFeed = async () => {
    setIsSharing(true);
    try {
      const canvas = await captureCard();
      if (!canvas) throw new Error('Failed to capture');

      const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png'));
      const file = new File([blob], 'aura-card.png', { type: 'image/png' });

      if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: `My Aura: ${aura.rarity.toUpperCase()}`,
          text: `I got ${aura.rarity.toUpperCase()} tier with ${aura.score} aura! 🔥\n\nCheck yours at aura-roast.com`,
        });
        setShareMessage('✅ Shared successfully!');
      } else {
        await downloadCard();
        setShowShareModal(true);
      }
    } catch (error) {
      if (error.name !== 'AbortError') {
        console.error('Share error:', error);
        await downloadCard();
        setShowShareModal(true);
      }
    }
    setIsSharing(false);
    setTimeout(() => setShareMessage(''), 3000);
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText('https://aura-roast.com');
      setShareMessage('✅ Link copied!');
      setTimeout(() => setShareMessage(''), 2000);
    } catch (error) {
      setShareMessage('❌ Failed to copy');
      setTimeout(() => setShareMessage(''), 2000);
    }
  };

  // ============================================
  // TIER CONFIG
  // ============================================
  const getTierConfig = (rarity) => {
    switch (rarity) {
      case 'legendary':
        return {
          accentColor: '#FFD700',
          secondaryColor: '#FFA500',
          glowColor: 'rgba(255, 215, 0,',
          plasmaColors: ['#FFD700', '#FFA500', '#FFEC8B', '#FFB347', '#FFD700'],
          headerText: "👑 THE TOP 1% 👑",
          headerBg: 'linear-gradient(90deg, transparent, rgba(255, 215, 0, 0.3), transparent)',
          tierLabel: "LEGENDARY",
          tierSubtext: "YOU ARE THE STANDARD",
          tierIcon: "👑",
          ctaText: "FLEX THIS 👑",
          motivationText: "Others wish they were you.",
          fontFamily: '"Cinzel", serif',
          filterId: 'legendaryPlasma',
          arcCount: 12,
          tendrilCount: 8,
        };
      case 'epic':
        return {
          accentColor: '#00FFFF',
          secondaryColor: '#9400D3',
          glowColor: 'rgba(0, 255, 255,',
          plasmaColors: ['#00FFFF', '#9400D3', '#00BFFF', '#8A2BE2', '#00FFFF'],
          headerText: "⚡ TOP 6% - RARE ⚡",
          headerBg: 'linear-gradient(90deg, transparent, rgba(0, 255, 255, 0.2), rgba(148, 0, 211, 0.2), transparent)',
          tierLabel: "EPIC",
          tierSubtext: "BUILT DIFFERENT",
          tierIcon: "⚡",
          ctaText: "SHOW THEM ⚡",
          motivationText: "One step below God.",
          fontFamily: '"Inter", sans-serif',
          filterId: 'epicPlasma',
          arcCount: 10,
          tendrilCount: 6,
        };
      case 'mid':
        return {
          accentColor: '#FFFFFF',
          secondaryColor: '#87CEEB',
          glowColor: 'rgba(255, 255, 255,',
          plasmaColors: ['#FFFFFF', '#87CEEB', '#E0E0E0', '#B0C4DE', '#FFFFFF'],
          headerText: "YOU'RE... OKAY",
          headerBg: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.15), transparent)',
          tierLabel: "MID",
          tierSubtext: "MAIN CHARACTER... KINDA",
          tierIcon: "🔥",
          ctaText: "TRY FOR EPIC? 🎯",
          motivationText: "Average. Like everyone else.",
          fontFamily: '"Inter", sans-serif',
          filterId: 'midPlasma',
          arcCount: 6,
          tendrilCount: 4,
        };
      case 'noob':
        return {
          accentColor: '#FF8C00',
          secondaryColor: '#FF4500',
          glowColor: 'rgba(255, 140, 0,',
          plasmaColors: ['#FF8C00', '#FF4500', '#FFA500', '#FF6600', '#FF8C00'],
          headerText: "⚠️ NEEDS WORK ⚠️",
          headerBg: 'linear-gradient(90deg, transparent, rgba(255, 140, 0, 0.25), transparent)',
          tierLabel: "NOOB",
          tierSubtext: "SYSTEM_LOADING...",
          tierIcon: "💀",
          ctaText: "TRY AGAIN 🔄",
          motivationText: "// warning: potential_not_found",
          fontFamily: '"Courier New", monospace',
          filterId: 'noobPlasma',
          arcCount: 8,
          tendrilCount: 5,
        };
      case 'npc':
      default:
        return {
          accentColor: '#FF0000',
          secondaryColor: '#8B0000',
          glowColor: 'rgba(255, 0, 0,',
          plasmaColors: ['#FF0000', '#8B0000', '#FF4444', '#660000', '#FF0000'],
          headerText: "// CRITICAL_ERROR",
          headerBg: 'linear-gradient(90deg, transparent, rgba(255, 0, 0, 0.2), transparent)',
          tierLabel: "NPC",
          tierSubtext: "BACKGROUND_PROCESS.exe",
          tierIcon: "💀",
          ctaText: "REBOOT 🔄",
          motivationText: "// fatal: existence_not_found",
          fontFamily: '"Courier New", monospace',
          filterId: 'npcPlasma',
          arcCount: 10,
          tendrilCount: 6,
        };
    }
  };

  const config = getTierConfig(aura.rarity);

  // ============================================
  // ORGANIC PLASMA BORDER COMPONENT
  // ============================================
  const OrganicPlasmaBorder = () => {
    // Generate random arc paths for plasma ball effect
    const generateArcPath = (index, total) => {
      const startAngle = (index / total) * 360;
      const endAngle = startAngle + 30 + Math.random() * 60;
      const radius = 170 + Math.random() * 15;
      const innerRadius = 155 + Math.random() * 10;
      
      const startX = 185 + Math.cos((startAngle * Math.PI) / 180) * radius;
      const startY = 325 + Math.sin((startAngle * Math.PI) / 180) * radius;
      const endX = 185 + Math.cos((endAngle * Math.PI) / 180) * innerRadius;
      const endY = 325 + Math.sin((endAngle * Math.PI) / 180) * innerRadius;
      
      // Create wavy bezier curve
      const cp1x = startX + (Math.random() - 0.5) * 40;
      const cp1y = startY + (Math.random() - 0.5) * 40;
      const cp2x = endX + (Math.random() - 0.5) * 40;
      const cp2y = endY + (Math.random() - 0.5) * 40;
      
      return `M ${startX} ${startY} C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${endX} ${endY}`;
    };

    // Generate tendril paths (organic plasma strands)
    const generateTendrilPath = (index) => {
      const angle = (index / config.tendrilCount) * 360;
      const startRadius = 165;
      const endRadius = 175 + Math.random() * 10;
      
      const startX = 185 + Math.cos((angle * Math.PI) / 180) * startRadius;
      const startY = 325 + Math.sin((angle * Math.PI) / 180) * startRadius;
      
      // Create organic wavy tendril
      let path = `M ${startX} ${startY}`;
      const segments = 4 + Math.floor(Math.random() * 3);
      
      for (let i = 1; i <= segments; i++) {
        const progress = i / segments;
        const currentRadius = startRadius + (endRadius - startRadius) * progress;
        const angleOffset = (Math.random() - 0.5) * 20;
        const x = 185 + Math.cos(((angle + angleOffset) * Math.PI) / 180) * currentRadius;
        const y = 325 + Math.sin(((angle + angleOffset) * Math.PI) / 180) * currentRadius;
        const cpx = x + (Math.random() - 0.5) * 30;
        const cpy = y + (Math.random() - 0.5) * 30;
        path += ` Q ${cpx} ${cpy}, ${x} ${y}`;
      }
      
      return path;
    };

    return (
      <>
        {/* SVG FILTERS FOR ORGANIC PLASMA EFFECT */}
        <svg style={{ position: 'absolute', width: 0, height: 0 }}>
          <defs>
            {/* Plasma Turbulence Filter */}
            <filter id={`${config.filterId}Turbulence`} x="-50%" y="-50%" width="200%" height="200%">
              <feTurbulence 
                type="fractalNoise" 
                baseFrequency="0.015" 
                numOctaves="3" 
                seed={Math.random() * 100}
                result="noise"
              >
                <animate 
                  attributeName="baseFrequency" 
                  values="0.015;0.025;0.015" 
                  dur="4s" 
                  repeatCount="indefinite"
                />
              </feTurbulence>
              <feDisplacementMap 
                in="SourceGraphic" 
                in2="noise" 
                scale="15" 
                xChannelSelector="R" 
                yChannelSelector="G"
              >
                <animate 
                  attributeName="scale" 
                  values="15;25;15" 
                  dur="3s" 
                  repeatCount="indefinite"
                />
              </feDisplacementMap>
            </filter>

            {/* High Voltage Glow Filter */}
            <filter id={`${config.filterId}Glow`} x="-100%" y="-100%" width="300%" height="300%">
              <feGaussianBlur stdDeviation="4" result="blur1"/>
              <feGaussianBlur stdDeviation="8" result="blur2"/>
              <feGaussianBlur stdDeviation="16" result="blur3"/>
              <feMerge>
                <feMergeNode in="blur3"/>
                <feMergeNode in="blur2"/>
                <feMergeNode in="blur1"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>

            {/* Electric Arc Filter */}
            <filter id={`${config.filterId}Arc`} x="-50%" y="-50%" width="200%" height="200%">
              <feTurbulence 
                type="turbulence" 
                baseFrequency="0.05" 
                numOctaves="2" 
                result="turbulence"
              >
                <animate 
                  attributeName="seed" 
                  from="0" 
                  to="100" 
                  dur="0.5s" 
                  repeatCount="indefinite"
                />
              </feTurbulence>
              <feDisplacementMap 
                in="SourceGraphic" 
                in2="turbulence" 
                scale="8" 
                xChannelSelector="R" 
                yChannelSelector="B"
              />
              <feGaussianBlur stdDeviation="1"/>
            </filter>

            {/* Plasma Gradient */}
            <linearGradient id={`${config.filterId}Gradient`} x1="0%" y1="0%" x2="100%" y2="100%">
              {config.plasmaColors.map((color, i) => (
                <stop 
                  key={i} 
                  offset={`${(i / (config.plasmaColors.length - 1)) * 100}%`} 
                  stopColor={color}
                >
                  <animate 
                    attributeName="stop-color" 
                    values={`${color};${config.plasmaColors[(i + 1) % config.plasmaColors.length]};${color}`}
                    dur="3s"
                    repeatCount="indefinite"
                  />
                </stop>
              ))}
            </linearGradient>

            {/* Radial Glow Gradient */}
            <radialGradient id={`${config.filterId}RadialGlow`} cx="50%" cy="50%" r="50%">
              <stop offset="85%" stopColor="transparent"/>
              <stop offset="95%" stopColor={config.accentColor} stopOpacity="0.3"/>
              <stop offset="100%" stopColor={config.accentColor} stopOpacity="0.8"/>
            </radialGradient>
          </defs>
        </svg>

        {/* LAYER 1: Deep Outer Glow (High-Voltage Bloom) */}
        <div style={{
          position: 'absolute',
          top: '-30px',
          left: '-30px',
          right: '-30px',
          bottom: '-30px',
          borderRadius: '40px',
          background: `radial-gradient(ellipse at center, transparent 60%, ${config.glowColor} 0.1) 80%, ${config.glowColor} 0.3) 100%)`,
          boxShadow: `
            0 0 60px ${config.glowColor} 0.4),
            0 0 100px ${config.glowColor} 0.3),
            0 0 150px ${config.glowColor} 0.2),
            0 0 200px ${config.glowColor} 0.1),
            inset 0 0 100px ${config.glowColor} 0.05)
          `,
          animation: 'deepGlowPulse 2s ease-in-out infinite',
          zIndex: 1
        }} />

        {/* LAYER 2: Plasma Field (Organic Movement) */}
        <div style={{
          position: 'absolute',
          top: '-15px',
          left: '-15px',
          right: '-15px',
          bottom: '-15px',
          borderRadius: '30px',
          background: `conic-gradient(from 0deg, ${config.plasmaColors.join(', ')})`,
          filter: `url(#${config.filterId}Turbulence)`,
          opacity: 0.8,
          animation: 'plasmaFieldRotate 8s linear infinite',
          zIndex: 2
        }} />

        {/* LAYER 3: Secondary Plasma Field (Counter-rotate) */}
        <div style={{
          position: 'absolute',
          top: '-12px',
          left: '-12px',
          right: '-12px',
          bottom: '-12px',
          borderRadius: '28px',
          background: `conic-gradient(from 180deg, ${[...config.plasmaColors].reverse().join(', ')})`,
          filter: `url(#${config.filterId}Turbulence)`,
          opacity: 0.5,
          animation: 'plasmaFieldRotateReverse 6s linear infinite',
          zIndex: 3
        }} />

        {/* LAYER 4: Electric Ionized Edge */}
        <div style={{
          position: 'absolute',
          top: '-8px',
          left: '-8px',
          right: '-8px',
          bottom: '-8px',
          borderRadius: '24px',
          border: `3px solid transparent`,
          background: `linear-gradient(#0a0a0a, #0a0a0a) padding-box, 
                       linear-gradient(90deg, ${config.plasmaColors.join(', ')}) border-box`,
          backgroundSize: '400% 400%',
          animation: 'electricEdgeFlow 2s linear infinite',
          zIndex: 4
        }} />

        {/* LAYER 5: Inner Dark Core */}
        <div style={{
          position: 'absolute',
          top: '2px',
          left: '2px',
          right: '2px',
          bottom: '2px',
          borderRadius: '16px',
          background: 'radial-gradient(ellipse at center, #0f0f0f 0%, #050505 100%)',
          zIndex: 5
        }} />

        {/* LAYER 6: Inner Edge Glow */}
        <div style={{
          position: 'absolute',
          top: '3px',
          left: '3px',
          right: '3px',
          bottom: '3px',
          borderRadius: '15px',
          boxShadow: `
            inset 0 0 30px ${config.glowColor} 0.2),
            inset 0 0 60px ${config.glowColor} 0.1),
            inset 0 0 100px ${config.glowColor} 0.05)
          `,
          zIndex: 6
        }} />

        {/* PLASMA BALL ELECTRIC ARCS SVG */}
        <svg 
          style={{
            position: 'absolute',
            top: '-20px',
            left: '-20px',
            width: 'calc(100% + 40px)',
            height: 'calc(100% + 40px)',
            zIndex: 7,
            pointerEvents: 'none',
            overflow: 'visible'
          }} 
          viewBox="0 0 380 670"
        >
          <defs>
            <filter id={`${config.filterId}ArcGlow`} x="-100%" y="-100%" width="300%" height="300%">
              <feGaussianBlur stdDeviation="2" result="blur"/>
              <feMerge>
                <feMergeNode in="blur"/>
                <feMergeNode in="blur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>

          {/* Electric Arc Tendrils */}
          {Array.from({ length: config.tendrilCount }, (_, i) => {
            const angle = (i / config.tendrilCount) * 360;
            const delay = i * 0.2;
            return (
              <g key={`tendril-${i}`}>
                {/* Main Tendril */}
                <path
                  d={generateTendrilPath(i)}
                  stroke={config.plasmaColors[i % config.plasmaColors.length]}
                  strokeWidth="2"
                  fill="none"
                  filter={`url(#${config.filterId}ArcGlow)`}
                  style={{
                    animation: `tendrilFlicker ${0.5 + Math.random() * 0.5}s ease-in-out ${delay}s infinite`,
                    transformOrigin: 'center'
                  }}
                />
                {/* Bright Core */}
                <path
                  d={generateTendrilPath(i)}
                  stroke="#FFFFFF"
                  strokeWidth="1"
                  fill="none"
                  opacity="0.8"
                  style={{
                    animation: `tendrilFlicker ${0.3 + Math.random() * 0.3}s ease-in-out ${delay + 0.1}s infinite`
                  }}
                />
              </g>
            );
          })}

          {/* Plasma Ball Arcs (jumping electricity) */}
          {Array.from({ length: config.arcCount }, (_, i) => {
            const delay = i * 0.15;
            return (
              <path
                key={`arc-${i}`}
                d={generateArcPath(i, config.arcCount)}
                stroke={config.plasmaColors[i % config.plasmaColors.length]}
                strokeWidth="1.5"
                fill="none"
                filter={`url(#${config.filterId}ArcGlow)`}
                strokeLinecap="round"
                style={{
                  animation: `arcJump ${0.2 + Math.random() * 0.3}s ease-in-out ${delay}s infinite`,
                  opacity: 0.9
                }}
              />
            );
          })}

          {/* Bright Arc Cores */}
          {Array.from({ length: Math.floor(config.arcCount / 2) }, (_, i) => (
            <path
              key={`arc-core-${i}`}
              d={generateArcPath(i * 2, config.arcCount)}
              stroke="#FFFFFF"
              strokeWidth="0.5"
              fill="none"
              opacity="0.7"
              style={{
                animation: `arcFlash ${0.15 + Math.random() * 0.2}s ease-in-out ${i * 0.2}s infinite`
              }}
            />
          ))}

          {/* Energy Nodes at corners */}
          {[
            { cx: 25, cy: 25 },
            { cx: 355, cy: 25 },
            { cx: 25, cy: 645 },
            { cx: 355, cy: 645 }
          ].map((pos, i) => (
            <g key={`node-${i}`}>
              <circle
                cx={pos.cx}
                cy={pos.cy}
                r="8"
                fill={config.accentColor}
                filter={`url(#${config.filterId}ArcGlow)`}
              >
                <animate 
                  attributeName="r" 
                  values="6;10;6" 
                  dur={`${0.8 + i * 0.1}s`} 
                  repeatCount="indefinite"
                />
                <animate 
                  attributeName="opacity" 
                  values="1;0.5;1" 
                  dur={`${0.5 + i * 0.1}s`} 
                  repeatCount="indefinite"
                />
              </circle>
              <circle
                cx={pos.cx}
                cy={pos.cy}
                r="4"
                fill="#FFFFFF"
              >
                <animate 
                  attributeName="r" 
                  values="3;5;3" 
                  dur={`${0.6 + i * 0.1}s`} 
                  repeatCount="indefinite"
                />
              </circle>
            </g>
          ))}

          {/* Perimeter Plasma Orbs */}
          {Array.from({ length: 16 }, (_, i) => {
            const angle = (i / 16) * 360;
            const radius = 178;
            const cx = 190 + Math.cos((angle * Math.PI) / 180) * radius;
            const cy = 335 + Math.sin((angle * Math.PI) / 180) * radius;
            return (
              <circle
                key={`orb-${i}`}
                cx={cx}
                cy={cy}
                r="3"
                fill={config.plasmaColors[i % config.plasmaColors.length]}
                filter={`url(#${config.filterId}ArcGlow)`}
              >
                <animate 
                  attributeName="r" 
                  values="2;4;2" 
                  dur={`${1 + (i * 0.1)}s`} 
                  repeatCount="indefinite"
                  begin={`${i * 0.1}s`}
                />
                <animate 
                  attributeName="opacity" 
                  values="0.8;0.3;0.8" 
                  dur={`${0.8 + (i * 0.05)}s`} 
                  repeatCount="indefinite"
                  begin={`${i * 0.05}s`}
                />
              </circle>
            );
          })}
        </svg>

        {/* Floating Plasma Particles */}
        {Array.from({ length: 20 }, (_, i) => (
          <div
            key={`particle-${i}`}
            style={{
              position: 'absolute',
              left: `${10 + Math.random() * 80}%`,
              top: `${10 + Math.random() * 80}%`,
              width: `${2 + Math.random() * 4}px`,
              height: `${2 + Math.random() * 4}px`,
              borderRadius: '50%',
              background: config.plasmaColors[i % config.plasmaColors.length],
              boxShadow: `
                0 0 ${5 + Math.random() * 10}px ${config.plasmaColors[i % config.plasmaColors.length]},
                0 0 ${10 + Math.random() * 20}px ${config.glowColor} 0.5)
              `,
              animation: `plasmaParticleFloat ${3 + Math.random() * 4}s ease-in-out ${Math.random() * 2}s infinite`,
              zIndex: 8
            }}
          />
        ))}

        {/* Top Energy Bar */}
        <div style={{
          position: 'absolute',
          top: '-2px',
          left: '30px',
          right: '30px',
          height: '4px',
          background: `linear-gradient(90deg, transparent, ${config.accentColor}, ${config.secondaryColor}, ${config.accentColor}, transparent)`,
          borderRadius: '2px',
          boxShadow: `
            0 0 10px ${config.accentColor},
            0 0 20px ${config.accentColor},
            0 0 40px ${config.glowColor} 0.5)
          `,
          animation: 'energyBarFlow 2s ease-in-out infinite',
          zIndex: 10
        }} />

        {/* Bottom Energy Bar */}
        <div style={{
          position: 'absolute',
          bottom: '-2px',
          left: '30px',
          right: '30px',
          height: '4px',
          background: `linear-gradient(90deg, transparent, ${config.secondaryColor}, ${config.accentColor}, ${config.secondaryColor}, transparent)`,
          borderRadius: '2px',
          boxShadow: `
            0 0 10px ${config.secondaryColor},
            0 0 20px ${config.secondaryColor},
            0 0 40px ${config.glowColor} 0.5)
          `,
          animation: 'energyBarFlow 2s ease-in-out infinite reverse',
          zIndex: 10
        }} />

        {/* Left Energy Bar */}
        <div style={{
          position: 'absolute',
          left: '-2px',
          top: '30px',
          bottom: '30px',
          width: '4px',
          background: `linear-gradient(180deg, transparent, ${config.accentColor}, ${config.secondaryColor}, ${config.accentColor}, transparent)`,
          borderRadius: '2px',
          boxShadow: `
            0 0 10px ${config.accentColor},
            0 0 20px ${config.accentColor}
          `,
          animation: 'energyBarFlowVertical 2.5s ease-in-out infinite',
          zIndex: 10
        }} />

        {/* Right Energy Bar */}
        <div style={{
          position: 'absolute',
          right: '-2px',
          top: '30px',
          bottom: '30px',
          width: '4px',
          background: `linear-gradient(180deg, transparent, ${config.secondaryColor}, ${config.accentColor}, ${config.secondaryColor}, transparent)`,
          borderRadius: '2px',
          boxShadow: `
            0 0 10px ${config.secondaryColor},
            0 0 20px ${config.secondaryColor}
          `,
          animation: 'energyBarFlowVertical 2.5s ease-in-out infinite reverse',
          zIndex: 10
        }} />

        {/* Corner Plasma Bursts */}
        {[
          { top: '-5px', left: '-5px' },
          { top: '-5px', right: '-5px' },
          { bottom: '-5px', left: '-5px' },
          { bottom: '-5px', right: '-5px' }
        ].map((pos, i) => (
          <div
            key={`corner-${i}`}
            style={{
              position: 'absolute',
              ...pos,
              width: '20px',
              height: '20px',
              background: `radial-gradient(circle, ${config.accentColor} 0%, transparent 70%)`,
              borderRadius: '50%',
              boxShadow: `
                0 0 15px ${config.accentColor},
                0 0 30px ${config.glowColor} 0.6),
                0 0 45px ${config.glowColor} 0.3)
              `,
              animation: `cornerBurst ${1 + i * 0.2}s ease-in-out ${i * 0.15}s infinite`,
              zIndex: 11
            }}
          />
        ))}

        {/* Tier-specific decorations */}
        {aura.rarity === 'legendary' && (
          <div style={{
            position: 'absolute',
            top: '-40px',
            left: '50%',
            transform: 'translateX(-50%)',
            fontSize: '50px',
            filter: `drop-shadow(0 0 20px ${config.accentColor}) drop-shadow(0 0 40px ${config.accentColor})`,
            animation: 'crownFloat 2s ease-in-out infinite',
            zIndex: 20
          }}>
            👑
          </div>
        )}

        {aura.rarity === 'npc' && (
          <>
            {/* Glitch Scanlines */}
            <div style={{
              position: 'absolute',
              top: '3px',
              left: '3px',
              right: '3px',
              bottom: '3px',
              borderRadius: '15px',
              background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255, 0, 0, 0.03) 2px, rgba(255, 0, 0, 0.03) 4px)',
              animation: 'scanlineMove 0.5s linear infinite',
              zIndex: 9,
              pointerEvents: 'none'
            }} />
            {/* ERROR Watermark */}
            <div style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%) rotate(-20deg)',
              fontSize: '4rem',
              fontWeight: '900',
              color: 'rgba(255, 0, 0, 0.05)',
              letterSpacing: '15px',
              whiteSpace: 'nowrap',
              pointerEvents: 'none',
              zIndex: 9,
              fontFamily: 'monospace',
              animation: 'glitchText 2s ease-in-out infinite'
            }}>
              ERROR
            </div>
          </>
        )}
      </>
    );
  };

  // ============================================
  // SHARE MODAL
  // ============================================
  const ShareModal = () => (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0,0,0,0.9)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
      padding: '20px',
    }}>
      <div style={{
        background: 'linear-gradient(180deg, #1a1a1a, #0a0a0a)',
        borderRadius: '20px',
        padding: '30px',
        maxWidth: '350px',
        width: '100%',
        border: `2px solid ${config.accentColor}50`,
        boxShadow: `0 0 50px ${config.glowColor} 0.3)`,
      }}>
        <div style={{ textAlign: 'center', marginBottom: '25px' }}>
          <span style={{ fontSize: '3rem' }}>📸</span>
          <h3 style={{
            margin: '15px 0 10px 0',
            color: config.accentColor,
            fontSize: '1.3rem',
            fontWeight: '800',
          }}>
            Share to Instagram
          </h3>
          <p style={{
            margin: 0,
            color: 'rgba(255,255,255,0.6)',
            fontSize: '0.85rem',
          }}>
            Your card has been downloaded!
          </p>
        </div>

        <div style={{
          background: 'rgba(255,255,255,0.05)',
          borderRadius: '12px',
          padding: '20px',
          marginBottom: '20px',
        }}>
          <p style={{ margin: '0 0 15px 0', color: '#fff', fontSize: '0.9rem', fontWeight: '600' }}>
            📋 How to share:
          </p>
          
          {['Open Instagram app', 'Create new Story or Post', 'Select your downloaded Aura Card', 'Tag @auraroast 🔥'].map((step, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', marginBottom: '10px' }}>
              <span style={{
                background: config.accentColor,
                color: '#000',
                width: '24px',
                height: '24px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.75rem',
                fontWeight: '800',
                flexShrink: 0,
              }}>{i + 1}</span>
              <span style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.85rem' }}>{step}</span>
            </div>
          ))}
        </div>

        <a
          href="instagram://app"
          style={{
            display: 'block',
            width: '100%',
            padding: '14px',
            background: 'linear-gradient(45deg, #833AB4, #FD1D1D, #F77737)',
            border: 'none',
            borderRadius: '12px',
            color: '#fff',
            fontSize: '1rem',
            fontWeight: '700',
            textAlign: 'center',
            textDecoration: 'none',
            cursor: 'pointer',
            marginBottom: '12px',
          }}
          onClick={() => setTimeout(() => window.open('https://instagram.com', '_blank'), 500)}
        >
          📱 Open Instagram
        </a>

        <button
          onClick={() => setShowShareModal(false)}
          style={{
            width: '100%',
            padding: '12px',
            background: 'rgba(255,255,255,0.1)',
            border: '1px solid rgba(255,255,255,0.2)',
            borderRadius: '12px',
            color: '#fff',
            fontSize: '0.9rem',
            cursor: 'pointer',
          }}
        >
          Close
        </button>
      </div>
    </div>
  );

  return (
    <>
      {showShareModal && <ShareModal />}
      
      {shareMessage && (
        <div style={{
          position: 'fixed',
          top: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          background: 'rgba(0,0,0,0.9)',
          border: `1px solid ${config.accentColor}`,
          borderRadius: '12px',
          padding: '12px 24px',
          color: '#fff',
          fontSize: '0.9rem',
          fontWeight: '600',
          zIndex: 10000,
          boxShadow: `0 0 20px ${config.glowColor} 0.5)`,
        }}>
          {shareMessage}
        </div>
      )}

      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '20px',
      }}>
        {/* THE CARD */}
        <div 
          ref={cardRef}
          style={{
            position: 'relative',
            width: '340px',
            minHeight: '620px',
            borderRadius: '16px',
            overflow: 'visible',
            background: 'transparent',
            color: '#FFFFFF',
            fontFamily: config.fontFamily,
            display: 'flex',
            flexDirection: 'column',
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
            transition: 'opacity 0.5s, transform 0.5s',
          }}
        >
          
          {/* Organic Plasma Border */}
          <OrganicPlasmaBorder />
          
          {/* CONTENT LAYER */}
          <div style={{
            position: 'relative',
            zIndex: 15,
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
            minHeight: '620px',
            padding: '20px',
          }}>
            
            {/* Header */}
            <div style={{
              textAlign: 'center',
              padding: '15px 0',
              marginBottom: '10px',
              background: config.headerBg,
              borderRadius: '8px',
            }}>
              <span style={{
                fontSize: '0.8rem',
                fontWeight: '700',
                letterSpacing: '3px',
                color: config.accentColor,
                textShadow: `0 0 20px ${config.accentColor}`,
              }}>
                {config.headerText}
              </span>
            </div>

            {/* Tier Icon & Label */}
            <div style={{ textAlign: 'center', marginBottom: '15px' }}>
              <div style={{
                fontSize: '3rem',
                marginBottom: '10px',
                filter: `drop-shadow(0 0 25px ${config.accentColor})`,
              }}>
                {config.tierIcon}
              </div>
              
              <h1 style={{
                margin: '0',
                fontSize: '2.5rem',
                fontWeight: '900',
                letterSpacing: '6px',
                color: config.accentColor,
                textShadow: `0 0 30px ${config.accentColor}, 0 0 60px ${config.glowColor} 0.5)`,
              }}>
                {config.tierLabel}
              </h1>
              
              <p style={{
                margin: '10px 0 0 0',
                fontSize: '0.7rem',
                letterSpacing: '3px',
                color: config.secondaryColor,
                opacity: 0.9,
              }}>
                {config.tierSubtext}
              </p>
            </div>

            {/* Score */}
            <div style={{
              textAlign: 'center',
              margin: '25px 0',
              position: 'relative',
            }}>
              <div style={{
                fontSize: '5rem',
                fontWeight: '900',
                lineHeight: 1,
                color: config.accentColor,
                textShadow: `0 0 40px ${config.accentColor}, 0 0 80px ${config.glowColor} 0.5)`,
              }}>
                {aura.score}
              </div>
              
              <div style={{
                fontSize: '0.7rem',
                color: config.accentColor,
                letterSpacing: '4px',
                marginTop: '10px',
                opacity: 0.8,
              }}>
                AURA SCORE
              </div>
            </div>

            {/* Roast Box */}
            <div style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
            }}>
              <div style={{
                background: `${config.glowColor} 0.1)`,
                border: `1px solid ${config.glowColor} 0.4)`,
                borderRadius: '12px',
                padding: '18px',
                position: 'relative',
              }}>
                <div style={{
                  position: 'absolute',
                  top: '-12px',
                  left: '20px',
                  background: '#0a0a0a',
                  padding: '0 10px',
                  color: config.accentColor,
                  fontSize: '1rem',
                }}>
                  💬
                </div>
                
                <p style={{
                  margin: 0,
                  fontSize: '0.95rem',
                  lineHeight: 1.6,
                  color: 'rgba(255,255,255,0.95)',
                  fontStyle: 'italic',
                }}>
                  {aura.roast}
                </p>
              </div>
            </div>

            {/* Motivation */}
            <div style={{
              textAlign: 'center',
              marginTop: '15px',
              padding: '12px',
              borderTop: `1px solid ${config.glowColor} 0.3)`,
            }}>
              <p style={{
                margin: 0,
                fontSize: '0.8rem',
                color: config.accentColor,
                fontWeight: '600',
              }}>
                {config.motivationText}
              </p>
            </div>

            {/* Footer */}
            <div style={{
              marginTop: '15px',
              padding: '10px 0',
              borderTop: `1px solid ${config.glowColor} 0.2)`,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
              <div style={{
                fontSize: '0.5rem',
                color: config.accentColor,
                letterSpacing: '1px',
                maxWidth: '55%',
                lineHeight: 1.3,
                opacity: 0.8,
              }}>
                {aura.challenge}
              </div>
              
              <div style={{
                fontSize: '0.6rem',
                color: 'rgba(255,255,255,0.4)',
                letterSpacing: '1px',
              }}>
                aura-roast.com
              </div>
            </div>
          </div>
        </div>

        {/* SHARE BUTTONS */}
        <div style={{ width: '340px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <button
            onClick={shareToInstagramStory}
            disabled={isSharing}
            style={{
              width: '100%',
              padding: '14px 20px',
              background: 'linear-gradient(45deg, #833AB4, #FD1D1D, #F77737)',
              border: 'none',
              borderRadius: '12px',
              color: '#fff',
              fontSize: '0.95rem',
              fontWeight: '700',
              cursor: isSharing ? 'wait' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              opacity: isSharing ? 0.7 : 1,
              boxShadow: '0 4px 20px rgba(131, 58, 180, 0.4)',
            }}
          >
            {isSharing ? '⏳ Processing...' : '📸 Share to Instagram Story'}
          </button>

          <button
            onClick={shareToInstagramFeed}
            disabled={isSharing}
            style={{
              width: '100%',
              padding: '14px 20px',
              background: 'linear-gradient(45deg, #405DE6, #5851DB, #833AB4)',
              border: 'none',
              borderRadius: '12px',
              color: '#fff',
              fontSize: '0.95rem',
              fontWeight: '700',
              cursor: isSharing ? 'wait' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              opacity: isSharing ? 0.7 : 1,
              boxShadow: '0 4px 20px rgba(64, 93, 230, 0.4)',
            }}
          >
            {isSharing ? '⏳ Processing...' : '📷 Share to Instagram Feed'}
          </button>

          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              onClick={downloadCard}
              disabled={isSharing}
              style={{
                flex: 1,
                padding: '12px 16px',
                background: 'rgba(255,255,255,0.1)',
                border: `1px solid ${config.glowColor} 0.5)`,
                borderRadius: '12px',
                color: '#fff',
                fontSize: '0.85rem',
                fontWeight: '600',
                cursor: isSharing ? 'wait' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
              }}
            >
              ⬇️ Download
            </button>

            <button
              onClick={copyLink}
              style={{
                flex: 1,
                padding: '12px 16px',
                background: 'rgba(255,255,255,0.1)',
                border: `1px solid ${config.glowColor} 0.5)`,
                borderRadius: '12px',
                color: '#fff',
                fontSize: '0.85rem',
                fontWeight: '600',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
              }}
            >
              🔗 Copy Link
            </button>
          </div>

          <p style={{
            textAlign: 'center',
            fontSize: '0.7rem',
            color: 'rgba(255,255,255,0.4)',
            margin: '5px 0 0 0',
          }}>
            📱 Works best on mobile • Tag @auraroast
          </p>
        </div>
      </div>

      {/* ============================================ */}
      {/* ORGANIC PLASMA ANIMATIONS */}
      {/* ============================================ */}
      <style jsx global>{`
        /* Deep Glow Pulse */
        @keyframes deepGlowPulse {
          0%, 100% { 
            opacity: 1;
            transform: scale(1);
          }
          50% { 
            opacity: 0.8;
            transform: scale(1.02);
          }
        }

        /* Plasma Field Rotation */
        @keyframes plasmaFieldRotate {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        @keyframes plasmaFieldRotateReverse {
          0% { transform: rotate(360deg); }
          100% { transform: rotate(0deg); }
        }

        /* Electric Edge Flow */
        @keyframes electricEdgeFlow {
          0% { background-position: 0% 50%; }
          100% { background-position: 400% 50%; }
        }

        /* Tendril Flicker */
        @keyframes tendrilFlicker {
          0%, 100% { 
            opacity: 0.9;
            stroke-width: 2;
          }
          10% { opacity: 0.3; stroke-width: 1; }
          20% { opacity: 0.95; stroke-width: 2.5; }
          30% { opacity: 0.5; stroke-width: 1.5; }
          40% { opacity: 1; stroke-width: 2; }
          50% { opacity: 0.4; stroke-width: 1; }
          60% { opacity: 0.85; stroke-width: 2; }
          70% { opacity: 0.6; stroke-width: 1.5; }
          80% { opacity: 0.95; stroke-width: 2.5; }
          90% { opacity: 0.7; stroke-width: 1.8; }
        }

        /* Arc Jump */
        @keyframes arcJump {
          0%, 100% { 
            opacity: 0;
            transform: scale(0.8);
          }
          10% { 
            opacity: 1;
            transform: scale(1);
          }
          30% { 
            opacity: 0.8;
            transform: scale(1.1);
          }
          50% { 
            opacity: 0.2;
            transform: scale(0.9);
          }
          70% { 
            opacity: 0.9;
            transform: scale(1.05);
          }
          90% { 
            opacity: 0.5;
            transform: scale(0.95);
          }
        }

        /* Arc Flash */
        @keyframes arcFlash {
          0%, 100% { opacity: 0; }
          5% { opacity: 1; }
          15% { opacity: 0.2; }
          25% { opacity: 0.8; }
          35% { opacity: 0; }
          50% { opacity: 1; }
          60% { opacity: 0.3; }
          75% { opacity: 0; }
          85% { opacity: 0.9; }
          95% { opacity: 0.1; }
        }

        /* Plasma Particle Float */
        @keyframes plasmaParticleFloat {
          0%, 100% { 
            transform: translateY(0) translateX(0) scale(1); 
            opacity: 0.8;
          }
          25% { 
            transform: translateY(-20px) translateX(15px) scale(1.2); 
            opacity: 0.5;
          }
          50% { 
            transform: translateY(-10px) translateX(-10px) scale(0.8); 
            opacity: 0.3;
          }
          75% { 
            transform: translateY(-25px) translateX(5px) scale(1.1); 
            opacity: 0.6;
          }
        }

        /* Energy Bar Flow */
        @keyframes energyBarFlow {
          0%, 100% { 
            opacity: 0.8;
            transform: scaleX(1);
          }
          50% { 
            opacity: 1;
            transform: scaleX(1.02);
          }
        }

        /* Energy Bar Vertical Flow */
        @keyframes energyBarFlowVertical {
          0%, 100% { 
            opacity: 0.8;
            transform: scaleY(1);
          }
          50% { 
            opacity: 1;
            transform: scaleY(1.02);
          }
        }

        /* Corner Burst */
        @keyframes cornerBurst {
          0%, 100% { 
            opacity: 1;
            transform: scale(1);
          }
          25% { 
            opacity: 0.6;
            transform: scale(1.3);
          }
          50% { 
            opacity: 0.9;
            transform: scale(0.9);
          }
          75% { 
            opacity: 0.7;
            transform: scale(1.2);
          }
        }

        /* Crown Float */
        @keyframes crownFloat {
          0%, 100% { 
            transform: translateX(-50%) translateY(0) rotate(-3deg); 
          }
          50% { 
            transform: translateX(-50%) translateY(-15px) rotate(3deg); 
          }
        }

        /* Scanline Move (NPC) */
        @keyframes scanlineMove {
          0% { background-position: 0 0; }
          100% { background-position: 0 100px; }
        }

        /* Glitch Text (NPC) */
        @keyframes glitchText {
          0%, 100% { 
            opacity: 0.05;
            transform: translate(-50%, -50%) rotate(-20deg) scale(1);
          }
          10% { 
            opacity: 0.08;
            transform: translate(-48%, -52%) rotate(-18deg) scale(1.02);
          }
          20% { 
            opacity: 0.03;
            transform: translate(-52%, -48%) rotate(-22deg) scale(0.98);
          }
          30% { 
            opacity: 0.07;
            transform: translate(-50%, -50%) rotate(-19deg) scale(1.01);
          }
          40% { 
            opacity: 0.04;
            transform: translate(-51%, -49%) rotate(-21deg) scale(0.99);
          }
          50% { 
            opacity: 0.06;
            transform: translate(-49%, -51%) rotate(-20deg) scale(1.03);
          }
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </>
  );
};

export default AuraCard;
