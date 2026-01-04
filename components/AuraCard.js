// /components/AuraCard.js

import { useState, useEffect } from 'react';

const AuraCard = ({ aura }) => {
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    setIsVisible(true);
  }, []);

  // ============================================
  // LEGENDARY - Gold Neon Electric Border
  // ============================================
  const LegendaryCard = () => (
    <>
      {/* Outer Glow Layer */}
      <div style={{
        position: 'absolute',
        top: '-8px',
        left: '-8px',
        right: '-8px',
        bottom: '-8px',
        borderRadius: '24px',
        background: 'transparent',
        boxShadow: `
          0 0 30px rgba(255, 215, 0, 0.6),
          0 0 60px rgba(255, 215, 0, 0.4),
          0 0 100px rgba(255, 215, 0, 0.2),
          inset 0 0 30px rgba(255, 215, 0, 0.1)
        `,
        animation: 'legendaryPulse 3s ease-in-out infinite',
        zIndex: 1
      }} />
      
      {/* Electric Plasma Border - Layer 1 */}
      <div style={{
        position: 'absolute',
        top: '-4px',
        left: '-4px',
        right: '-4px',
        bottom: '-4px',
        borderRadius: '20px',
        background: `
          linear-gradient(90deg, #FFD700, #FFA500, #FFD700, #FFA500, #FFD700)
        `,
        backgroundSize: '200% 100%',
        animation: 'electricFlow 2s linear infinite',
        zIndex: 2
      }} />
      
      {/* Plasma Crack Effect - Layer 2 */}
      <div style={{
        position: 'absolute',
        top: '-3px',
        left: '-3px',
        right: '-3px',
        bottom: '-3px',
        borderRadius: '19px',
        background: `
          radial-gradient(ellipse at 20% 20%, rgba(255, 255, 200, 0.8) 0%, transparent 30%),
          radial-gradient(ellipse at 80% 30%, rgba(255, 200, 100, 0.6) 0%, transparent 25%),
          radial-gradient(ellipse at 40% 80%, rgba(255, 255, 150, 0.7) 0%, transparent 20%),
          radial-gradient(ellipse at 90% 90%, rgba(255, 180, 50, 0.5) 0%, transparent 30%),
          linear-gradient(135deg, #FFD700, #B8860B, #FFD700)
        `,
        animation: 'plasmaShift 4s ease-in-out infinite',
        zIndex: 3
      }} />
      
      {/* Inner Dark Layer */}
      <div style={{
        position: 'absolute',
        top: '2px',
        left: '2px',
        right: '2px',
        bottom: '2px',
        borderRadius: '16px',
        background: '#0a0a0a',
        zIndex: 4
      }} />
      
      {/* Circuit Board Pattern */}
      <svg style={{
        position: 'absolute',
        top: '4px',
        left: '4px',
        width: 'calc(100% - 8px)',
        height: 'calc(100% - 8px)',
        borderRadius: '14px',
        zIndex: 5,
        opacity: 0.15
      }} viewBox="0 0 340 620">
        {/* Golden Circuits */}
        <defs>
          <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFD700" />
            <stop offset="50%" stopColor="#FFA500" />
            <stop offset="100%" stopColor="#FFD700" />
          </linearGradient>
        </defs>
        
        {/* Horizontal Lines */}
        <line x1="0" y1="50" x2="80" y2="50" stroke="url(#goldGrad)" strokeWidth="1"/>
        <line x1="260" y1="60" x2="340" y2="60" stroke="url(#goldGrad)" strokeWidth="1"/>
        <line x1="0" y1="560" x2="100" y2="560" stroke="url(#goldGrad)" strokeWidth="1"/>
        <line x1="240" y1="570" x2="340" y2="570" stroke="url(#goldGrad)" strokeWidth="1"/>
        
        {/* Vertical Lines */}
        <line x1="30" y1="80" x2="30" y2="180" stroke="url(#goldGrad)" strokeWidth="1"/>
        <line x1="310" y1="100" x2="310" y2="200" stroke="url(#goldGrad)" strokeWidth="1"/>
        
        {/* Connection Nodes */}
        <circle cx="80" cy="50" r="4" fill="#FFD700"/>
        <circle cx="260" cy="60" r="4" fill="#FFD700"/>
        <circle cx="30" cy="80" r="3" fill="#FFD700"/>
        <circle cx="310" cy="100" r="3" fill="#FFD700"/>
        
        {/* Chip Patterns */}
        <rect x="15" y="400" width="40" height="50" fill="none" stroke="url(#goldGrad)" strokeWidth="1"/>
        <rect x="285" y="420" width="40" height="50" fill="none" stroke="url(#goldGrad)" strokeWidth="1"/>
      </svg>
      
      {/* Floating Crown */}
      <div style={{
        position: 'absolute',
        top: '-30px',
        left: '50%',
        transform: 'translateX(-50%)',
        fontSize: '40px',
        zIndex: 20,
        filter: 'drop-shadow(0 0 20px rgba(255, 215, 0, 0.9))',
        animation: 'crownFloat 3s ease-in-out infinite'
      }}>
        👑
      </div>
      
      {/* Floating Gold Particles */}
      {Array.from({ length: 20 }, (_, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            left: `${10 + Math.random() * 80}%`,
            top: `${10 + Math.random() * 80}%`,
            width: `${2 + Math.random() * 4}px`,
            height: `${2 + Math.random() * 4}px`,
            borderRadius: '50%',
            background: '#FFD700',
            boxShadow: '0 0 6px #FFD700, 0 0 12px rgba(255, 215, 0, 0.5)',
            animation: `particleFloat ${3 + Math.random() * 4}s ease-in-out ${Math.random() * 2}s infinite`,
            zIndex: 6
          }}
        />
      ))}
      
      {/* Top Energy Line */}
      <div style={{
        position: 'absolute',
        top: '10px',
        left: '20px',
        right: '20px',
        height: '2px',
        background: 'linear-gradient(90deg, transparent, #FFD700, transparent)',
        boxShadow: '0 0 10px #FFD700',
        animation: 'energyPulse 2s ease-in-out infinite',
        zIndex: 10
      }} />
      
      {/* Bottom Energy Line */}
      <div style={{
        position: 'absolute',
        bottom: '10px',
        left: '20px',
        right: '20px',
        height: '2px',
        background: 'linear-gradient(90deg, transparent, #FFD700, transparent)',
        boxShadow: '0 0 10px #FFD700',
        animation: 'energyPulse 2s ease-in-out infinite reverse',
        zIndex: 10
      }} />
    </>
  );

  // ============================================
  // EPIC - Cyan/Blue Electric Neon Border
  // ============================================
  const EpicCard = () => (
    <>
      {/* Outer Glow */}
      <div style={{
        position: 'absolute',
        top: '-8px',
        left: '-8px',
        right: '-8px',
        bottom: '-8px',
        borderRadius: '24px',
        boxShadow: `
          0 0 25px rgba(0, 255, 255, 0.5),
          0 0 50px rgba(148, 0, 211, 0.4),
          0 0 80px rgba(0, 191, 255, 0.3)
        `,
        animation: 'epicPulse 2.5s ease-in-out infinite',
        zIndex: 1
      }} />
      
      {/* Electric Border - Cyan Layer */}
      <div style={{
        position: 'absolute',
        top: '-4px',
        left: '-4px',
        right: '-4px',
        bottom: '-4px',
        borderRadius: '20px',
        background: `
          linear-gradient(90deg, #00FFFF, #9400D3, #00BFFF, #9400D3, #00FFFF)
        `,
        backgroundSize: '300% 100%',
        animation: 'electricFlow 3s linear infinite',
        zIndex: 2
      }} />
      
      {/* Plasma Crack Layer */}
      <div style={{
        position: 'absolute',
        top: '-3px',
        left: '-3px',
        right: '-3px',
        bottom: '-3px',
        borderRadius: '19px',
        background: `
          radial-gradient(ellipse at 15% 15%, rgba(0, 255, 255, 0.9) 0%, transparent 25%),
          radial-gradient(ellipse at 85% 25%, rgba(148, 0, 211, 0.8) 0%, transparent 30%),
          radial-gradient(ellipse at 25% 85%, rgba(0, 191, 255, 0.7) 0%, transparent 25%),
          radial-gradient(ellipse at 75% 75%, rgba(138, 43, 226, 0.6) 0%, transparent 30%),
          linear-gradient(135deg, #00FFFF, #9400D3, #00BFFF)
        `,
        animation: 'epicPlasma 5s ease-in-out infinite',
        zIndex: 3
      }} />
      
      {/* Inner Dark */}
      <div style={{
        position: 'absolute',
        top: '2px',
        left: '2px',
        right: '2px',
        bottom: '2px',
        borderRadius: '16px',
        background: 'linear-gradient(180deg, #0a0015, #050010)',
        zIndex: 4
      }} />
      
      {/* Circuit Pattern */}
      <svg style={{
        position: 'absolute',
        top: '4px',
        left: '4px',
        width: 'calc(100% - 8px)',
        height: 'calc(100% - 8px)',
        borderRadius: '14px',
        zIndex: 5,
        opacity: 0.2
      }} viewBox="0 0 340 620">
        <defs>
          <linearGradient id="epicGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00FFFF" />
            <stop offset="50%" stopColor="#9400D3" />
            <stop offset="100%" stopColor="#00BFFF" />
          </linearGradient>
        </defs>
        
        <line x1="0" y1="60" x2="90" y2="60" stroke="url(#epicGrad)" strokeWidth="1.5"/>
        <line x1="250" y1="70" x2="340" y2="70" stroke="url(#epicGrad)" strokeWidth="1.5"/>
        <line x1="25" y1="90" x2="25" y2="200" stroke="url(#epicGrad)" strokeWidth="1"/>
        <line x1="315" y1="110" x2="315" y2="220" stroke="url(#epicGrad)" strokeWidth="1"/>
        
        <circle cx="90" cy="60" r="5" fill="#00FFFF">
          <animate attributeName="opacity" values="1;0.4;1" dur="2s" repeatCount="indefinite"/>
        </circle>
        <circle cx="250" cy="70" r="5" fill="#9400D3">
          <animate attributeName="opacity" values="1;0.4;1" dur="2.5s" repeatCount="indefinite"/>
        </circle>
        
        <rect x="10" y="420" width="45" height="55" fill="none" stroke="url(#epicGrad)" strokeWidth="1.5"/>
        <rect x="285" y="400" width="45" height="55" fill="none" stroke="url(#epicGrad)" strokeWidth="1.5"/>
      </svg>
      
      {/* Floating Particles */}
      {Array.from({ length: 15 }, (_, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            left: `${10 + Math.random() * 80}%`,
            top: `${10 + Math.random() * 80}%`,
            width: `${2 + Math.random() * 3}px`,
            height: `${2 + Math.random() * 3}px`,
            borderRadius: '50%',
            background: i % 2 === 0 ? '#00FFFF' : '#9400D3',
            boxShadow: `0 0 8px ${i % 2 === 0 ? '#00FFFF' : '#9400D3'}`,
            animation: `particleFloat ${2 + Math.random() * 3}s ease-in-out ${Math.random() * 2}s infinite`,
            zIndex: 6
          }}
        />
      ))}
      
      {/* Energy Lines */}
      <div style={{
        position: 'absolute',
        top: '12px',
        left: '25px',
        right: '25px',
        height: '2px',
        background: 'linear-gradient(90deg, transparent, #00FFFF, #9400D3, #00FFFF, transparent)',
        boxShadow: '0 0 15px rgba(0, 255, 255, 0.8)',
        animation: 'energyPulse 1.5s ease-in-out infinite',
        zIndex: 10
      }} />
      <div style={{
        position: 'absolute',
        bottom: '12px',
        left: '25px',
        right: '25px',
        height: '2px',
        background: 'linear-gradient(90deg, transparent, #9400D3, #00FFFF, #9400D3, transparent)',
        boxShadow: '0 0 15px rgba(148, 0, 211, 0.8)',
        animation: 'energyPulse 1.5s ease-in-out infinite reverse',
        zIndex: 10
      }} />
    </>
  );

  // ============================================
  // MID - White/Silver Neon Electric Border
  // ============================================
  const MidCard = () => (
    <>
      {/* Outer Glow */}
      <div style={{
        position: 'absolute',
        top: '-6px',
        left: '-6px',
        right: '-6px',
        bottom: '-6px',
        borderRadius: '22px',
        boxShadow: `
          0 0 20px rgba(255, 255, 255, 0.4),
          0 0 40px rgba(59, 130, 246, 0.3),
          0 0 60px rgba(255, 255, 255, 0.2)
        `,
        animation: 'midPulse 4s ease-in-out infinite',
        zIndex: 1
      }} />
      
      {/* Electric Border */}
      <div style={{
        position: 'absolute',
        top: '-3px',
        left: '-3px',
        right: '-3px',
        bottom: '-3px',
        borderRadius: '19px',
        background: `
          linear-gradient(90deg, #FFFFFF, #87CEEB, #FFFFFF, #B0C4DE, #FFFFFF)
        `,
        backgroundSize: '200% 100%',
        animation: 'electricFlow 4s linear infinite',
        zIndex: 2
      }} />
      
      {/* Subtle Plasma */}
      <div style={{
        position: 'absolute',
        top: '-2px',
        left: '-2px',
        right: '-2px',
        bottom: '-2px',
        borderRadius: '18px',
        background: `
          radial-gradient(ellipse at 20% 20%, rgba(255, 255, 255, 0.6) 0%, transparent 30%),
          radial-gradient(ellipse at 80% 80%, rgba(135, 206, 235, 0.5) 0%, transparent 30%),
          linear-gradient(135deg, #E0E0E0, #FFFFFF, #D0D0D0)
        `,
        zIndex: 3
      }} />
      
      {/* Inner Dark */}
      <div style={{
        position: 'absolute',
        top: '2px',
        left: '2px',
        right: '2px',
        bottom: '2px',
        borderRadius: '15px',
        background: 'linear-gradient(180deg, #0a1628, #050d18)',
        zIndex: 4
      }} />
      
      {/* Circuit Pattern */}
      <svg style={{
        position: 'absolute',
        top: '4px',
        left: '4px',
        width: 'calc(100% - 8px)',
        height: 'calc(100% - 8px)',
        borderRadius: '13px',
        zIndex: 5,
        opacity: 0.12
      }} viewBox="0 0 340 620">
        <line x1="0" y1="55" x2="70" y2="55" stroke="#FFFFFF" strokeWidth="1"/>
        <line x1="270" y1="65" x2="340" y2="65" stroke="#FFFFFF" strokeWidth="1"/>
        <line x1="20" y1="80" x2="20" y2="160" stroke="#87CEEB" strokeWidth="1"/>
        <line x1="320" y1="90" x2="320" y2="170" stroke="#87CEEB" strokeWidth="1"/>
        
        <circle cx="70" cy="55" r="4" fill="#FFFFFF" opacity="0.8"/>
        <circle cx="270" cy="65" r="4" fill="#FFFFFF" opacity="0.8"/>
        
        <rect x="12" y="430" width="35" height="45" fill="none" stroke="#B0C4DE" strokeWidth="1"/>
        <rect x="293" y="440" width="35" height="45" fill="none" stroke="#B0C4DE" strokeWidth="1"/>
      </svg>
      
      {/* Upgrade Hint */}
      <div style={{
        position: 'absolute',
        top: '15px',
        right: '15px',
        background: 'rgba(148, 0, 211, 0.15)',
        border: '1px solid rgba(148, 0, 211, 0.4)',
        borderRadius: '12px',
        padding: '6px 12px',
        fontSize: '0.6rem',
        color: '#9400D3',
        fontWeight: '600',
        letterSpacing: '1px',
        zIndex: 10,
        boxShadow: '0 0 10px rgba(148, 0, 211, 0.3)'
      }}>
        ⚡ EPIC CLOSE
      </div>
      
      {/* Energy Lines */}
      <div style={{
        position: 'absolute',
        top: '10px',
        left: '20px',
        right: '20px',
        height: '1px',
        background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.6), transparent)',
        boxShadow: '0 0 8px rgba(255,255,255,0.5)',
        zIndex: 10
      }} />
      <div style={{
        position: 'absolute',
        bottom: '10px',
        left: '20px',
        right: '20px',
        height: '1px',
        background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.6), transparent)',
        boxShadow: '0 0 8px rgba(255,255,255,0.5)',
        zIndex: 10
      }} />
    </>
  );

  // ============================================
  // NOOB - Orange Electric Neon Border
  // ============================================
  const NoobCard = () => (
    <>
      {/* Outer Glow */}
      <div style={{
        position: 'absolute',
        top: '-7px',
        left: '-7px',
        right: '-7px',
        bottom: '-7px',
        borderRadius: '22px',
        boxShadow: `
          0 0 25px rgba(255, 140, 0, 0.5),
          0 0 50px rgba(255, 69, 0, 0.4),
          0 0 80px rgba(255, 165, 0, 0.2)
        `,
        animation: 'noobPulse 2s ease-in-out infinite',
        zIndex: 1
      }} />
      
      {/* Electric Border */}
      <div style={{
        position: 'absolute',
        top: '-4px',
        left: '-4px',
        right: '-4px',
        bottom: '-4px',
        borderRadius: '20px',
        background: `
          linear-gradient(90deg, #FF8C00, #FF4500, #FFA500, #FF6600, #FF8C00)
        `,
        backgroundSize: '200% 100%',
        animation: 'electricFlow 2.5s linear infinite',
        zIndex: 2
      }} />
      
      {/* Plasma Crack Layer */}
      <div style={{
        position: 'absolute',
        top: '-3px',
        left: '-3px',
        right: '-3px',
        bottom: '-3px',
        borderRadius: '19px',
        background: `
          radial-gradient(ellipse at 10% 10%, rgba(255, 200, 100, 0.8) 0%, transparent 25%),
          radial-gradient(ellipse at 90% 20%, rgba(255, 100, 0, 0.7) 0%, transparent 30%),
          radial-gradient(ellipse at 20% 90%, rgba(255, 165, 0, 0.6) 0%, transparent 25%),
          radial-gradient(ellipse at 85% 85%, rgba(255, 140, 0, 0.7) 0%, transparent 30%),
          linear-gradient(135deg, #FF8C00, #FF4500, #FFA500)
        `,
        animation: 'noobPlasma 3s ease-in-out infinite',
        zIndex: 3
      }} />
      
      {/* Inner Dark */}
      <div style={{
        position: 'absolute',
        top: '2px',
        left: '2px',
        right: '2px',
        bottom: '2px',
        borderRadius: '16px',
        background: 'linear-gradient(180deg, #1a0f00, #0f0800)',
        zIndex: 4
      }} />
      
      {/* Circuit Pattern */}
      <svg style={{
        position: 'absolute',
        top: '4px',
        left: '4px',
        width: 'calc(100% - 8px)',
        height: 'calc(100% - 8px)',
        borderRadius: '14px',
        zIndex: 5,
        opacity: 0.2
      }} viewBox="0 0 340 620">
        <defs>
          <linearGradient id="orangeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FF8C00" />
            <stop offset="50%" stopColor="#FF4500" />
            <stop offset="100%" stopColor="#FFA500" />
          </linearGradient>
        </defs>
        
        <line x1="0" y1="55" x2="80" y2="55" stroke="url(#orangeGrad)" strokeWidth="1.5"/>
        <line x1="260" y1="65" x2="340" y2="65" stroke="url(#orangeGrad)" strokeWidth="1.5"/>
        <line x1="25" y1="85" x2="25" y2="180" stroke="url(#orangeGrad)" strokeWidth="1"/>
        <line x1="315" y1="95" x2="315" y2="190" stroke="url(#orangeGrad)" strokeWidth="1"/>
        
        <circle cx="80" cy="55" r="5" fill="#FF8C00">
          <animate attributeName="opacity" values="1;0.3;1" dur="1.5s" repeatCount="indefinite"/>
        </circle>
        <circle cx="260" cy="65" r="5" fill="#FF4500">
          <animate attributeName="opacity" values="1;0.3;1" dur="2s" repeatCount="indefinite"/>
        </circle>
        
        <rect x="10" y="430" width="45" height="55" fill="none" stroke="url(#orangeGrad)" strokeWidth="1.5"/>
        <rect x="285" y="420" width="45" height="55" fill="none" stroke="url(#orangeGrad)" strokeWidth="1.5"/>
        
        {/* Warning symbols */}
        <polygon points="170,100 180,118 160,118" fill="none" stroke="#FF4500" strokeWidth="1.5"/>
        <line x1="170" y1="106" x2="170" y2="112" stroke="#FF4500" strokeWidth="1.5"/>
        <circle cx="170" cy="115" r="1" fill="#FF4500"/>
      </svg>
      
      {/* Warning Corner Accents */}
      <div style={{
        position: 'absolute',
        top: '8px',
        left: '8px',
        width: '30px',
        height: '30px',
        borderTop: '3px solid #FF8C00',
        borderLeft: '3px solid #FF8C00',
        borderRadius: '4px 0 0 0',
        boxShadow: '-3px -3px 15px rgba(255, 140, 0, 0.5)',
        zIndex: 10
      }} />
      <div style={{
        position: 'absolute',
        top: '8px',
        right: '8px',
        width: '30px',
        height: '30px',
        borderTop: '3px solid #FF8C00',
        borderRight: '3px solid #FF8C00',
        borderRadius: '0 4px 0 0',
        boxShadow: '3px -3px 15px rgba(255, 140, 0, 0.5)',
        zIndex: 10
      }} />
      <div style={{
        position: 'absolute',
        bottom: '8px',
        left: '8px',
        width: '30px',
        height: '30px',
        borderBottom: '3px solid #FF8C00',
        borderLeft: '3px solid #FF8C00',
        borderRadius: '0 0 0 4px',
        boxShadow: '-3px 3px 15px rgba(255, 140, 0, 0.5)',
        zIndex: 10
      }} />
      <div style={{
        position: 'absolute',
        bottom: '8px',
        right: '8px',
        width: '30px',
        height: '30px',
        borderBottom: '3px solid #FF8C00',
        borderRight: '3px solid #FF8C00',
        borderRadius: '0 0 4px 0',
        boxShadow: '3px 3px 15px rgba(255, 140, 0, 0.5)',
        zIndex: 10
      }} />
      
      {/* Energy Lines */}
      <div style={{
        position: 'absolute',
        top: '0',
        left: '0',
        right: '0',
        height: '4px',
        background: 'linear-gradient(90deg, transparent, #FF8C00, #FF4500, #FF8C00, transparent)',
        boxShadow: '0 0 15px rgba(255, 140, 0, 0.8)',
        zIndex: 10
      }} />
      <div style={{
        position: 'absolute',
        bottom: '0',
        left: '0',
        right: '0',
        height: '4px',
        background: 'linear-gradient(90deg, transparent, #FF4500, #FF8C00, #FF4500, transparent)',
        boxShadow: '0 0 15px rgba(255, 69, 0, 0.8)',
        zIndex: 10
      }} />
    </>
  );

  // ============================================
  // NPC - Red Corrupted Neon Border
  // ============================================
  const NPCCard = () => (
    <>
      {/* Outer Glow - Corrupted */}
      <div style={{
        position: 'absolute',
        top: '-8px',
        left: '-8px',
        right: '-8px',
        bottom: '-8px',
        borderRadius: '20px',
        boxShadow: `
          0 0 30px rgba(255, 0, 0, 0.5),
          0 0 60px rgba(139, 0, 0, 0.4),
          0 0 90px rgba(255, 0, 0, 0.2)
        `,
        animation: 'npcFlicker 0.1s ease-in-out infinite',
        zIndex: 1
      }} />
      
      {/* Electric Border - Glitchy */}
      <div style={{
        position: 'absolute',
        top: '-4px',
        left: '-4px',
        right: '-4px',
        bottom: '-4px',
        borderRadius: '18px',
        background: `
          linear-gradient(90deg, #FF0000, #8B0000, #FF0000, #660000, #FF0000)
        `,
        backgroundSize: '300% 100%',
        animation: 'glitchFlow 1.5s linear infinite',
        zIndex: 2
      }} />
      
      {/* Corrupted Plasma Layer */}
      <div style={{
        position: 'absolute',
        top: '-3px',
        left: '-3px',
        right: '-3px',
        bottom: '-3px',
        borderRadius: '17px',
        background: `
          radial-gradient(ellipse at 5% 5%, rgba(255, 0, 0, 0.9) 0%, transparent 20%),
          radial-gradient(ellipse at 95% 15%, rgba(139, 0, 0, 0.8) 0%, transparent 25%),
          radial-gradient(ellipse at 15% 95%, rgba(255, 50, 50, 0.7) 0%, transparent 20%),
          radial-gradient(ellipse at 90% 90%, rgba(100, 0, 0, 0.8) 0%, transparent 25%),
          linear-gradient(135deg, #FF0000, #8B0000, #660000)
        `,
        animation: 'corruptedPlasma 2s ease-in-out infinite',
        zIndex: 3
      }} />
      
      {/* Inner Dark - Corrupted */}
      <div style={{
        position: 'absolute',
        top: '2px',
        left: '2px',
        right: '2px',
        bottom: '2px',
        borderRadius: '14px',
        background: '#050000',
        zIndex: 4
      }} />
      
      {/* Broken Circuit Pattern */}
      <svg style={{
        position: 'absolute',
        top: '4px',
        left: '4px',
        width: 'calc(100% - 8px)',
        height: 'calc(100% - 8px)',
        borderRadius: '12px',
        zIndex: 5,
        opacity: 0.25
      }} viewBox="0 0 340 620">
        <defs>
          <linearGradient id="redGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FF0000" />
            <stop offset="50%" stopColor="#8B0000" />
            <stop offset="100%" stopColor="#FF0000" />
          </linearGradient>
        </defs>
        
        {/* Broken Lines */}
        <line x1="0" y1="50" x2="40" y2="50" stroke="url(#redGrad)" strokeWidth="2"/>
        <line x1="55" y1="52" x2="90" y2="48" stroke="url(#redGrad)" strokeWidth="1" strokeDasharray="5,5"/>
        <line x1="250" y1="60" x2="340" y2="60" stroke="url(#redGrad)" strokeWidth="2"/>
        <line x1="200" y1="62" x2="240" y2="58" stroke="url(#redGrad)" strokeWidth="1" strokeDasharray="3,7"/>
        
        {/* Corrupted Vertical */}
        <line x1="25" y1="80" x2="25" y2="130" stroke="url(#redGrad)" strokeWidth="1.5"/>
        <line x1="27" y1="145" x2="23" y2="180" stroke="url(#redGrad)" strokeWidth="1" strokeDasharray="4,4"/>
        <line x1="315" y1="90" x2="315" y2="140" stroke="url(#redGrad)" strokeWidth="1.5"/>
        <line x1="313" y1="155" x2="317" y2="190" stroke="url(#redGrad)" strokeWidth="1" strokeDasharray="4,4"/>
        
        {/* Broken Nodes */}
        <circle cx="40" cy="50" r="4" fill="#FF0000" opacity="0.8"/>
        <circle cx="250" cy="60" r="4" fill="#8B0000" opacity="0.8"/>
        
        {/* Corrupted Chips */}
        <rect x="10" y="420" width="45" height="55" fill="none" stroke="url(#redGrad)" strokeWidth="1.5" strokeDasharray="10,5"/>
        <rect x="285" y="430" width="45" height="55" fill="none" stroke="url(#redGrad)" strokeWidth="1.5" strokeDasharray="10,5"/>
        
        {/* Error X marks */}
        <g opacity="0.6">
          <line x1="160" y1="95" x2="180" y2="115" stroke="#FF0000" strokeWidth="3"/>
          <line x1="180" y1="95" x2="160" y2="115" stroke="#FF0000" strokeWidth="3"/>
        </g>
        <g opacity="0.4">
          <line x1="155" y1="510" x2="175" y2="530" stroke="#8B0000" strokeWidth="2"/>
          <line x1="175" y1="510" x2="155" y2="530" stroke="#8B0000" strokeWidth="2"/>
        </g>
      </svg>
      
      {/* Glitch Scanlines */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        borderRadius: '14px',
        background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255, 0, 0, 0.03) 2px, rgba(255, 0, 0, 0.03) 4px)',
        zIndex: 6,
        pointerEvents: 'none'
      }} />
      
      {/* Glitch Lines */}
      <div style={{
        position: 'absolute',
        top: '18%',
        left: 0,
        right: 0,
        height: '3px',
        background: 'linear-gradient(90deg, transparent, #FF0000, transparent)',
        opacity: 0.4,
        animation: 'glitchLine 2s ease-in-out infinite',
        zIndex: 7
      }} />
      <div style={{
        position: 'absolute',
        top: '45%',
        left: 0,
        right: 0,
        height: '2px',
        background: '#8B0000',
        opacity: 0.3,
        animation: 'glitchLine 1.5s ease-in-out infinite reverse',
        zIndex: 7
      }} />
      <div style={{
        position: 'absolute',
        top: '72%',
        left: 0,
        right: 0,
        height: '3px',
        background: 'linear-gradient(90deg, transparent, #FF0000, transparent)',
        opacity: 0.35,
        animation: 'glitchLine 2.5s ease-in-out infinite',
        zIndex: 7
      }} />
      
      {/* Corrupted Corner Accents */}
      <div style={{
        position: 'absolute',
        top: '6px',
        left: '6px',
        width: '25px',
        height: '25px',
        borderTop: '3px solid #FF0000',
        borderLeft: '3px solid #FF0000',
        boxShadow: '-3px -3px 12px rgba(255, 0, 0, 0.6)',
        zIndex: 10,
        animation: 'cornerGlitch 3s ease-in-out infinite'
      }} />
      <div style={{
        position: 'absolute',
        top: '6px',
        right: '6px',
        width: '25px',
        height: '25px',
        borderTop: '3px solid #FF0000',
        borderRight: '3px solid #FF0000',
        boxShadow: '3px -3px 12px rgba(255, 0, 0, 0.6)',
        zIndex: 10,
        animation: 'cornerGlitch 3s ease-in-out infinite 0.5s'
      }} />
      <div style={{
        position: 'absolute',
        bottom: '6px',
        left: '6px',
        width: '25px',
        height: '25px',
        borderBottom: '3px solid #FF0000',
        borderLeft: '3px solid #FF0000',
        boxShadow: '-3px 3px 12px rgba(255, 0, 0, 0.6)',
        zIndex: 10,
        animation: 'cornerGlitch 3s ease-in-out infinite 1s'
      }} />
      <div style={{
        position: 'absolute',
        bottom: '6px',
        right: '6px',
        width: '25px',
        height: '25px',
        borderBottom: '3px solid #FF0000',
        borderRight: '3px solid #FF0000',
        boxShadow: '3px 3px 12px rgba(255, 0, 0, 0.6)',
        zIndex: 10,
        animation: 'cornerGlitch 3s ease-in-out infinite 1.5s'
      }} />
      
      {/* Top/Bottom Energy Bars */}
      <div style={{
        position: 'absolute',
        top: '0',
        left: '0',
        right: '0',
        height: '4px',
        background: 'linear-gradient(90deg, transparent 5%, #FF0000 20%, #FF0000 80%, transparent 95%)',
        boxShadow: '0 0 20px #FF0000, 0 0 40px rgba(255, 0, 0, 0.5)',
        zIndex: 10,
        animation: 'energyFlicker 0.5s ease-in-out infinite'
      }} />
      <div style={{
        position: 'absolute',
        bottom: '0',
        left: '0',
        right: '0',
        height: '4px',
        background: 'linear-gradient(90deg, transparent 5%, #8B0000 20%, #FF0000 50%, #8B0000 80%, transparent 95%)',
        boxShadow: '0 0 20px #FF0000, 0 0 40px rgba(139, 0, 0, 0.5)',
        zIndex: 10,
        animation: 'energyFlicker 0.5s ease-in-out infinite reverse'
      }} />
      
      {/* ERROR Watermark */}
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%) rotate(-20deg)',
        fontSize: '4rem',
        fontWeight: '900',
        color: 'rgba(255, 0, 0, 0.06)',
        letterSpacing: '20px',
        whiteSpace: 'nowrap',
        pointerEvents: 'none',
        zIndex: 6,
        fontFamily: 'monospace'
      }}>
        ERROR
      </div>
    </>
  );

  // ============================================
  // TIER CONFIG
  // ============================================
  const getTierConfig = (rarity) => {
    switch (rarity) {
      case 'legendary':
        return {
          accentColor: '#FFD700',
          secondaryColor: '#FFA500',
          headerText: "👑 THE TOP 1% 👑",
          headerBg: 'linear-gradient(90deg, transparent, rgba(255, 215, 0, 0.3), transparent)',
          tierLabel: "LEGENDARY",
          tierSubtext: "YOU ARE THE STANDARD",
          tierIcon: "👑",
          ctaText: "FLEX THIS 👑",
          motivationText: "Others wish they were you.",
          fontFamily: '"Cinzel", serif',
        };
      case 'epic':
        return {
          accentColor: '#00FFFF',
          secondaryColor: '#9400D3',
          headerText: "⚡ TOP 6% - RARE ⚡",
          headerBg: 'linear-gradient(90deg, transparent, rgba(0, 255, 255, 0.2), rgba(148, 0, 211, 0.2), transparent)',
          tierLabel: "EPIC",
          tierSubtext: "BUILT DIFFERENT",
          tierIcon: "⚡",
          ctaText: "SHOW THEM ⚡",
          motivationText: "One step below God.",
          fontFamily: '"Inter", sans-serif',
        };
      case 'mid':
        return {
          accentColor: '#FFFFFF',
          secondaryColor: '#87CEEB',
          headerText: "YOU'RE... OKAY",
          headerBg: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.15), transparent)',
          tierLabel: "MID",
          tierSubtext: "MAIN CHARACTER... KINDA",
          tierIcon: "🔥",
          ctaText: "TRY FOR EPIC? 🎯",
          motivationText: "Average. Like everyone else.",
          fontFamily: '"Inter", sans-serif',
        };
      case 'noob':
        return {
          accentColor: '#FF8C00',
          secondaryColor: '#FF4500',
          headerText: "⚠️ NEEDS WORK ⚠️",
          headerBg: 'linear-gradient(90deg, transparent, rgba(255, 140, 0, 0.25), transparent)',
          tierLabel: "NOOB",
          tierSubtext: "SYSTEM_LOADING...",
          tierIcon: "💀",
          ctaText: "TRY AGAIN 🔄",
          motivationText: "// warning: potential_not_found",
          fontFamily: '"Courier New", monospace',
        };
      case 'npc':
      default:
        return {
          accentColor: '#FF0000',
          secondaryColor: '#8B0000',
          headerText: "// CRITICAL_ERROR",
          headerBg: 'linear-gradient(90deg, transparent, rgba(255, 0, 0, 0.2), transparent)',
          tierLabel: "NPC",
          tierSubtext: "BACKGROUND_PROCESS.exe",
          tierIcon: "💀",
          ctaText: "REBOOT 🔄",
          motivationText: "// fatal: existence_not_found",
          fontFamily: '"Courier New", monospace',
        };
    }
  };

  const config = getTierConfig(aura.rarity);

  // ============================================
  // RENDER CARD EFFECT BASED ON TIER
  // ============================================
  const renderCardEffect = () => {
    switch (aura.rarity) {
      case 'legendary': return <LegendaryCard />;
      case 'epic': return <EpicCard />;
      case 'mid': return <MidCard />;
      case 'noob': return <NoobCard />;
      case 'npc': return <NPCCard />;
      default: return <NPCCard />;
    }
  };

  return (
    <div style={{
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
    }}>
      
      {/* Tier Effect Layer */}
      {renderCardEffect()}
      
      {/* ============================================ */}
      {/* CONTENT LAYER */}
      {/* ============================================ */}
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
            textShadow: `0 0 30px ${config.accentColor}, 0 0 60px ${config.accentColor}50`,
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
            textShadow: `0 0 40px ${config.accentColor}, 0 0 80px ${config.accentColor}50`,
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
            background: `${config.accentColor}10`,
            border: `1px solid ${config.accentColor}40`,
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
          borderTop: `1px solid ${config.accentColor}30`,
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

        {/* CTA Button */}
        <button style={{
          width: '100%',
          marginTop: '15px',
          padding: '14px 20px',
          background: `linear-gradient(90deg, ${config.accentColor}, ${config.secondaryColor})`,
          border: 'none',
          borderRadius: '12px',
          color: aura.rarity === 'legendary' || aura.rarity === 'noob' ? '#000' : '#FFF',
          fontSize: '0.9rem',
          fontWeight: '800',
          letterSpacing: '2px',
          cursor: 'pointer',
          boxShadow: `0 5px 30px ${config.accentColor}60`,
          textTransform: 'uppercase',
        }}>
          {config.ctaText}
        </button>

        {/* Footer */}
        <div style={{
          marginTop: '15px',
          padding: '10px 0',
          borderTop: `1px solid ${config.accentColor}20`,
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

      {/* ============================================ */}
      {/* CSS ANIMATIONS */}
      {/* ============================================ */}
      <style jsx global>{`
        @keyframes legendaryPulse {
          0%, 100% { 
            box-shadow: 0 0 30px rgba(255, 215, 0, 0.6), 0 0 60px rgba(255, 215, 0, 0.4), 0 0 100px rgba(255, 215, 0, 0.2);
          }
          50% { 
            box-shadow: 0 0 40px rgba(255, 215, 0, 0.8), 0 0 80px rgba(255, 215, 0, 0.5), 0 0 120px rgba(255, 215, 0, 0.3);
          }
        }
        
        @keyframes epicPulse {
          0%, 100% { 
            box-shadow: 0 0 25px rgba(0, 255, 255, 0.5), 0 0 50px rgba(148, 0, 211, 0.4);
          }
          50% { 
            box-shadow: 0 0 40px rgba(0, 255, 255, 0.7), 0 0 70px rgba(148, 0, 211, 0.5);
          }
        }
        
        @keyframes midPulse {
          0%, 100% { 
            box-shadow: 0 0 20px rgba(255, 255, 255, 0.4), 0 0 40px rgba(59, 130, 246, 0.3);
          }
          50% { 
            box-shadow: 0 0 30px rgba(255, 255, 255, 0.5), 0 0 60px rgba(59, 130, 246, 0.4);
          }
        }
        
        @keyframes noobPulse {
          0%, 100% { 
            box-shadow: 0 0 25px rgba(255, 140, 0, 0.5), 0 0 50px rgba(255, 69, 0, 0.4);
          }
          50% { 
            box-shadow: 0 0 40px rgba(255, 140, 0, 0.7), 0 0 70px rgba(255, 69, 0, 0.5);
          }
        }
        
        @keyframes npcFlicker {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.95; }
          75% { opacity: 1; }
          90% { opacity: 0.9; }
        }
        
        @keyframes electricFlow {
          0% { background-position: 0% 50%; }
          100% { background-position: 200% 50%; }
        }
        
        @keyframes glitchFlow {
          0% { background-position: 0% 50%; }
          25% { background-position: 100% 50%; transform: translateX(1px); }
          50% { background-position: 200% 50%; transform: translateX(-1px); }
          75% { background-position: 300% 50%; transform: translateX(1px); }
          100% { background-position: 0% 50%; transform: translateX(0); }
        }
        
        @keyframes plasmaShift {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.85; }
        }
        
        @keyframes epicPlasma {
          0%, 100% { 
            filter: hue-rotate(0deg);
            opacity: 1;
          }
          50% { 
            filter: hue-rotate(15deg);
            opacity: 0.9;
          }
        }
        
        @keyframes noobPlasma {
          0%, 100% { opacity: 1; }
          25% { opacity: 0.9; }
          50% { opacity: 1; }
          75% { opacity: 0.85; }
        }
        
        @keyframes corruptedPlasma {
          0%, 100% { opacity: 1; transform: scale(1); }
          25% { opacity: 0.85; transform: scale(1.002); }
          50% { opacity: 1; transform: scale(0.998); }
          75% { opacity: 0.9; transform: scale(1.001); }
        }
        
        @keyframes particleFloat {
          0%, 100% { 
            transform: translateY(0) translateX(0); 
            opacity: 0.8;
          }
          50% { 
            transform: translateY(-20px) translateX(10px); 
            opacity: 0.4;
          }
        }
        
        @keyframes crownFloat {
          0%, 100% { transform: translateX(-50%) translateY(0); }
          50% { transform: translateX(-50%) translateY(-10px); }
        }
        
        @keyframes energyPulse {
          0%, 100% { opacity: 0.8; }
          50% { opacity: 1; }
        }
        
        @keyframes energyFlicker {
          0%, 100% { opacity: 1; }
          25% { opacity: 0.8; }
          50% { opacity: 1; }
          75% { opacity: 0.85; }
        }
        
        @keyframes glitchLine {
          0%, 100% { 
            opacity: 0.3; 
            transform: translateX(0) scaleX(1);
          }
          25% { 
            opacity: 0.5; 
            transform: translateX(-5px) scaleX(1.02);
          }
          50% { 
            opacity: 0.2; 
            transform: translateX(3px) scaleX(0.98);
          }
          75% { 
            opacity: 0.6; 
            transform: translateX(-2px) scaleX(1.01);
          }
        }
        
        @keyframes cornerGlitch {
          0%, 100% { opacity: 1; }
          10% { opacity: 0.5; }
          20% { opacity: 1; }
          30% { opacity: 0.7; }
          40% { opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default AuraCard;
