// components/CampusRoastCard.js

import { useRef } from 'react';

export default function CampusRoastCard({ 
  result, 
  userData, 
  battleData, 
  selectedTemplate,
  onShare,
  onNewBattle 
}) {
  const cardRef = useRef(null);

  if (!result) return null;

  const templateColor = selectedTemplate?.color || '#00FFFF';

  return (
    <div style={{ animation: 'fadeInUp 0.6s ease' }}>
      {/* Main Result Card */}
      <div 
        ref={cardRef}
        style={{
          background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.9), rgba(10, 10, 10, 0.95))',
          border: `2px solid ${templateColor}`,
          borderRadius: '24px',
          padding: '32px 28px',
          marginBottom: '24px',
          boxShadow: `0 20px 60px ${templateColor}40`,
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        {/* Gradient Glow Background */}
        <div style={{
          position: 'absolute',
          top: '-50%',
          left: '-50%',
          width: '200%',
          height: '200%',
          background: `radial-gradient(circle, ${templateColor}20 0%, transparent 70%)`,
          animation: 'rotate 8s linear infinite',
          pointerEvents: 'none'
        }} />

        {/* Content Container */}
        <div style={{ position: 'relative', zIndex: 1 }}>
          
          {/* Header */}
          <div style={{
            textAlign: 'center',
            marginBottom: '28px',
            paddingBottom: '20px',
            borderBottom: `1px solid ${templateColor}30`
          }}>
            <div style={{
              fontSize: '2.5rem',
              marginBottom: '8px'
            }}>
              {selectedTemplate?.emoji || '⚔️'}
            </div>
            <h2 style={{
              fontSize: '1.6rem',
              fontWeight: '900',
              background: `linear-gradient(135deg, ${templateColor}, #fff)`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              margin: '0 0 8px 0',
              letterSpacing: '0.5px'
            }}>
              {selectedTemplate?.label || 'BATTLE RESULT'}
            </h2>
            <p style={{
              color: 'rgba(255, 255, 255, 0.5)',
              fontSize: '0.85rem',
              margin: 0,
              fontWeight: '600',
              textTransform: 'uppercase',
              letterSpacing: '1px'
            }}>
              {result.topic}
            </p>
          </div>

          {/* College Cards Container */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr',
            gap: '16px',
            marginBottom: '28px'
          }}>
            
            {/* YOUR COLLEGE CARD */}
            <div style={{
              background: `linear-gradient(135deg, ${templateColor}15, ${templateColor}05)`,
              border: `2px solid ${templateColor}`,
              borderRadius: '18px',
              padding: '24px',
              position: 'relative',
              overflow: 'hidden'
            }}>
              {/* Card Glow */}
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '4px',
                background: `linear-gradient(90deg, transparent, ${templateColor}, transparent)`,
                animation: 'shimmer 2s infinite'
              }} />

              <div style={{
                fontSize: '0.7rem',
                color: templateColor,
                fontWeight: '700',
                marginBottom: '10px',
                letterSpacing: '1.5px',
                textTransform: 'uppercase'
              }}>
                🎓 Your College
              </div>
              
              <div style={{
                fontSize: '1.4rem',
                color: '#fff',
                fontWeight: '800',
                marginBottom: '6px',
                lineHeight: '1.2'
              }}>
                {userData.college}
              </div>
              
              <div style={{
                fontSize: '0.85rem',
                color: 'rgba(255, 255, 255, 0.6)',
                marginBottom: '18px',
                fontWeight: '600'
              }}>
                {userData.branch} Branch
              </div>

              {/* Score Display */}
              <div style={{
                display: 'flex',
                alignItems: 'baseline',
                gap: '8px',
                marginBottom: '14px'
              }}>
                <div style={{
                  fontSize: '3rem',
                  color: templateColor,
                  fontWeight: '900',
                  fontFamily: 'monospace',
                  textShadow: `0 0 20px ${templateColor}80`
                }}>
                  {result.yourScore}
                </div>
                <div style={{
                  fontSize: '1.2rem',
                  color: 'rgba(255, 255, 255, 0.5)',
                  fontWeight: '700'
                }}>
                  /100
                </div>
              </div>

              {/* Progress Bar */}
              <div style={{
                background: 'rgba(0, 0, 0, 0.5)',
                height: '14px',
                borderRadius: '8px',
                overflow: 'hidden',
                border: `1px solid ${templateColor}40`,
                position: 'relative'
              }}>
                <div style={{
                  width: `${result.yourScore}%`,
                  height: '100%',
                  background: `linear-gradient(90deg, ${templateColor}, ${templateColor}cc)`,
                  transition: 'width 1.5s cubic-bezier(0.34, 1.56, 0.64, 1)',
                  position: 'relative',
                  overflow: 'hidden'
                }}>
                  {/* Animated shine */}
                  <div style={{
                    position: 'absolute',
                    top: 0,
                    left: '-100%',
                    width: '100%',
                    height: '100%',
                    background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent)',
                    animation: 'shine 2s infinite'
                  }} />
                </div>
              </div>
            </div>

            {/* VS DIVIDER */}
            <div style={{
              textAlign: 'center',
              fontSize: '1.8rem',
              fontWeight: '900',
              color: '#FF4500',
              margin: '8px 0',
              position: 'relative'
            }}>
              <div style={{
                display: 'inline-block',
                padding: '8px 20px',
                background: 'rgba(255, 69, 0, 0.1)',
                border: '2px solid #FF4500',
                borderRadius: '50px',
                animation: 'pulse 2s infinite'
              }}>
                ⚔️ VS
              </div>
            </div>

            {/* RIVAL COLLEGE CARD */}
            <div style={{
              background: 'linear-gradient(135deg, rgba(255, 215, 0, 0.15), rgba(255, 215, 0, 0.05))',
              border: '2px solid #FFD700',
              borderRadius: '18px',
              padding: '24px',
              position: 'relative',
              overflow: 'hidden'
            }}>
              {/* Winner Crown (if rival wins) */}
              {result.rivalScore > result.yourScore && (
                <div style={{
                  position: 'absolute',
                  top: '12px',
                  right: '12px',
                  fontSize: '1.8rem',
                  animation: 'bounce 1s infinite'
                }}>
                  👑
                </div>
              )}

              <div style={{
                fontSize: '0.7rem',
                color: '#FFD700',
                fontWeight: '700',
                marginBottom: '10px',
                letterSpacing: '1.5px',
                textTransform: 'uppercase'
              }}>
                🏆 Rival / Benchmark
              </div>
              
              <div style={{
                fontSize: '1.4rem',
                color: '#fff',
                fontWeight: '800',
                marginBottom: '6px',
                lineHeight: '1.2'
              }}>
                {battleData.rivalCollege}
              </div>
              
              <div style={{
                fontSize: '0.85rem',
                color: 'rgba(255, 255, 255, 0.6)',
                marginBottom: '18px',
                fontWeight: '600'
              }}>
                {userData.branch} Branch
              </div>

              {/* Score Display */}
              <div style={{
                display: 'flex',
                alignItems: 'baseline',
                gap: '8px',
                marginBottom: '14px'
              }}>
                <div style={{
                  fontSize: '3rem',
                  color: '#FFD700',
                  fontWeight: '900',
                  fontFamily: 'monospace',
                  textShadow: '0 0 20px rgba(255, 215, 0, 0.8)'
                }}>
                  {result.rivalScore}
                </div>
                <div style={{
                  fontSize: '1.2rem',
                  color: 'rgba(255, 255, 255, 0.5)',
                  fontWeight: '700'
                }}>
                  /100
                </div>
              </div>

              {/* Progress Bar */}
              <div style={{
                background: 'rgba(0, 0, 0, 0.5)',
                height: '14px',
                borderRadius: '8px',
                overflow: 'hidden',
                border: '1px solid rgba(255, 215, 0, 0.4)',
                position: 'relative'
              }}>
                <div style={{
                  width: `${result.rivalScore}%`,
                  height: '100%',
                  background: 'linear-gradient(90deg, #FFD700, #FFA500)',
                  transition: 'width 1.5s cubic-bezier(0.34, 1.56, 0.64, 1)',
                  position: 'relative',
                  overflow: 'hidden'
                }}>
                  {/* Animated shine */}
                  <div style={{
                    position: 'absolute',
                    top: 0,
                    left: '-100%',
                    width: '100%',
                    height: '100%',
                    background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent)',
                    animation: 'shine 2s infinite 0.5s'
                  }} />
                </div>
              </div>
            </div>
          </div>

          {/* Comparisons Section */}
          {result.comparisons && result.comparisons.length > 0 && (
            <div style={{
              background: 'rgba(255, 255, 255, 0.03)',
              borderRadius: '16px',
              padding: '20px',
              marginBottom: '24px',
              border: '1px solid rgba(255, 255, 255, 0.1)'
            }}>
              <div style={{
                fontSize: '0.8rem',
                color: 'rgba(255, 255, 255, 0.6)',
                fontWeight: '700',
                marginBottom: '16px',
                textAlign: 'center',
                textTransform: 'uppercase',
                letterSpacing: '1px'
              }}>
                📊 Detailed Comparison
              </div>
              
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '12px'
              }}>
                {result.comparisons.map((comp, index) => (
                  <div 
                    key={index}
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '1fr auto 1fr',
                      gap: '12px',
                      alignItems: 'center',
                      padding: '14px',
                      background: 'rgba(0, 0, 0, 0.3)',
                      borderRadius: '10px',
                      border: '1px solid rgba(255, 255, 255, 0.05)'
                    }}
                  >
                    {/* Your Value */}
                    <div style={{
                      textAlign: 'right',
                      padding: '8px 12px',
                      background: comp.winner === 'you' 
                        ? `${templateColor}20` 
                        : 'rgba(255, 255, 255, 0.03)',
                      borderRadius: '8px',
                      border: comp.winner === 'you' 
                        ? `1px solid ${templateColor}60` 
                        : '1px solid transparent'
                    }}>
                      <div style={{
                        fontSize: '0.95rem',
                        fontWeight: '700',
                        color: comp.winner === 'you' ? templateColor : 'rgba(255, 255, 255, 0.8)'
                      }}>
                        {comp.yours}
                      </div>
                      {comp.winner === 'you' && (
                        <div style={{
                          fontSize: '0.7rem',
                          color: templateColor,
                          marginTop: '4px',
                          fontWeight: '600'
                        }}>
                          ✓ Better
                        </div>
                      )}
                    </div>

                    {/* Metric Name */}
                    <div style={{
                      textAlign: 'center',
                      minWidth: '80px'
                    }}>
                      <div style={{
                        fontSize: '0.75rem',
                        color: 'rgba(255, 255, 255, 0.5)',
                        fontWeight: '600',
                        marginBottom: '4px'
                      }}>
                        {comp.metric}
                      </div>
                      <div style={{
                        fontSize: '1.2rem'
                      }}>
                        {comp.winner === 'you' ? '✓' : '✗'}
                      </div>
                    </div>

                    {/* Rival Value */}
                    <div style={{
                      textAlign: 'left',
                      padding: '8px 12px',
                      background: comp.winner === 'rival' 
                        ? 'rgba(255, 215, 0, 0.15)' 
                        : 'rgba(255, 255, 255, 0.03)',
                      borderRadius: '8px',
                      border: comp.winner === 'rival' 
                        ? '1px solid rgba(255, 215, 0, 0.4)' 
                        : '1px solid transparent'
                    }}>
                      <div style={{
                        fontSize: '0.95rem',
                        fontWeight: '700',
                        color: comp.winner === 'rival' ? '#FFD700' : 'rgba(255, 255, 255, 0.8)'
                      }}>
                        {comp.theirs}
                      </div>
                      {comp.winner === 'rival' && (
                        <div style={{
                          fontSize: '0.7rem',
                          color: '#FFD700',
                          marginTop: '4px',
                          fontWeight: '600'
                        }}>
                          ✓ Better
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* THE ROAST - Main Event */}
          <div style={{
            background: 'linear-gradient(135deg, rgba(255, 69, 0, 0.2), rgba(255, 69, 0, 0.05))',
            border: '2px solid #FF4500',
            borderRadius: '18px',
            padding: '24px',
            position: 'relative',
            overflow: 'hidden'
          }}>
            {/* Fire animation background */}
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '100%',
              background: 'linear-gradient(45deg, transparent 30%, rgba(255, 69, 0, 0.1) 50%, transparent 70%)',
              backgroundSize: '200% 200%',
              animation: 'fireGlow 3s ease infinite',
              pointerEvents: 'none'
            }} />

            <div style={{
              position: 'relative',
              zIndex: 1
            }}>
              <div style={{
                fontSize: '0.85rem',
                color: '#FF4500',
                fontWeight: '700',
                marginBottom: '16px',
                textAlign: 'center',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}>
                <span style={{ fontSize: '1.5rem' }}>💀</span>
                <span style={{ letterSpacing: '1px', textTransform: 'uppercase' }}>
                  THE SAVAGE ROAST
                </span>
                <span style={{ fontSize: '1.5rem' }}>💀</span>
              </div>
              
              <p style={{
                fontSize: '1.15rem',
                lineHeight: '1.8',
                color: '#fff',
                margin: 0,
                fontWeight: '600',
                whiteSpace: 'pre-wrap',
                textAlign: 'center',
                textShadow: '0 2px 10px rgba(0, 0, 0, 0.5)'
              }}>
                {result.roast}
              </p>
            </div>
          </div>

          {/* Model Credit */}
          {result.modelUsed && (
            <div style={{
              textAlign: 'center',
              marginTop: '16px',
              fontSize: '0.7rem',
              color: 'rgba(255, 255, 255, 0.3)',
              fontWeight: '600'
            }}>
              Generated by {result.modelUsed}
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: '14px'
      }}>
        <button
          onClick={onShare}
          style={{
            padding: '18px',
            background: `linear-gradient(135deg, ${templateColor}, ${templateColor}cc)`,
            border: 'none',
            borderRadius: '14px',
            color: '#000',
            fontSize: '1rem',
            fontWeight: '800',
            cursor: 'pointer',
            fontFamily: 'inherit',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            boxShadow: `0 8px 24px ${templateColor}40`,
            transition: 'all 0.3s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = `0 12px 32px ${templateColor}60`;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = `0 8px 24px ${templateColor}40`;
          }}
        >
          <span style={{ fontSize: '1.2rem' }}>📱</span>
          Share Roast
        </button>
        
        <button
          onClick={onNewBattle}
          style={{
            padding: '18px',
            background: '#222',
            border: '1px solid #666',
            borderRadius: '14px',
            color: '#fff',
            fontSize: '1rem',
            fontWeight: '800',
            cursor: 'pointer',
            fontFamily: 'inherit',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            transition: 'all 0.3s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = '#333';
            e.currentTarget.style.borderColor = '#888';
            e.currentTarget.style.transform = 'translateY(-2px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = '#222';
            e.currentTarget.style.borderColor = '#666';
            e.currentTarget.style.transform = 'translateY(0)';
          }}
        >
          <span style={{ fontSize: '1.2rem' }}>🔄</span>
          New Battle
        </button>
      </div>

      {/* Animations */}
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes rotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        @keyframes pulse {
          0%, 100% {
            transform: scale(1);
            opacity: 1;
          }
          50% {
            transform: scale(1.05);
            opacity: 0.9;
          }
        }

        @keyframes bounce {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }

        @keyframes shine {
          0% { left: -100%; }
          100% { left: 100%; }
        }

        @keyframes fireGlow {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }
      `}</style>
    </div>
  );
            }
