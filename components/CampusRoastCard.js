// components/CampusRoastCard.js

import { useRef } from 'react';
import html2canvas from 'html2canvas';

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

  // Download function
  const downloadAsImage = async () => {
    if (!cardRef.current) return;

    try {
      // Hide the action buttons temporarily
      const actionButtons = cardRef.current.nextElementSibling;
      if (actionButtons) actionButtons.style.display = 'none';

      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: '#000000',
        scale: 2, // Higher quality
        logging: false,
        useCORS: true,
        allowTaint: true
      });

      // Show buttons again
      if (actionButtons) actionButtons.style.display = 'grid';

      // Convert to image and download
      const image = canvas.toDataURL('image/png', 1.0);
      const link = document.createElement('a');
      link.download = `${userData.college.replace(/\s+/g, '-')}-roast.png`;
      link.href = image;
      link.click();
    } catch (error) {
      console.error('Error downloading image:', error);
      alert('Failed to download image. Please try again.');
    }
  };

  return (
    <div style={{ animation: 'fadeInUp 0.6s ease' }}>
      {/* Main Result Card */}
      <div 
        ref={cardRef}
        style={{
          background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.9), rgba(10, 10, 10, 0.95))',
          border: `2px solid ${templateColor}`,
          borderRadius: '20px',
          padding: '24px 20px',
          marginBottom: '20px',
          boxShadow: `0 15px 40px ${templateColor}40`,
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
            marginBottom: '20px',
            paddingBottom: '16px',
            borderBottom: `1px solid ${templateColor}30`
          }}>
            <div style={{ fontSize: '2rem', marginBottom: '6px' }}>
              {selectedTemplate?.emoji || '⚔️'}
            </div>
            <h2 style={{
              fontSize: '1.3rem',
              fontWeight: '900',
              background: `linear-gradient(135deg, ${templateColor}, #fff)`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              margin: '0 0 6px 0',
              letterSpacing: '0.5px'
            }}>
              {selectedTemplate?.label || 'BATTLE RESULT'}
            </h2>
            <p style={{
              color: 'rgba(255, 255, 255, 0.5)',
              fontSize: '0.8rem',
              margin: 0,
              fontWeight: '600',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>
              {result.topic}
            </p>
          </div>

          {/* College Cards Container */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr',
            gap: '12px',
            marginBottom: '20px'
          }}>
            
            {/* YOUR COLLEGE CARD */}
            <div style={{
              background: `linear-gradient(135deg, ${templateColor}15, ${templateColor}05)`,
              border: `2px solid ${templateColor}`,
              borderRadius: '14px',
              padding: '16px',
              position: 'relative',
              overflow: 'hidden'
            }}>
              {/* Card Glow */}
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '3px',
                background: `linear-gradient(90deg, transparent, ${templateColor}, transparent)`,
                animation: 'shimmer 2s infinite'
              }} />

              <div style={{
                fontSize: '0.65rem',
                color: templateColor,
                fontWeight: '700',
                marginBottom: '8px',
                letterSpacing: '1px',
                textTransform: 'uppercase'
              }}>
                🎓 Your College
              </div>
              
              <div style={{
                fontSize: '1.1rem',
                color: '#fff',
                fontWeight: '800',
                marginBottom: '4px',
                lineHeight: '1.2'
              }}>
                {userData.college}
              </div>
              
              <div style={{
                fontSize: '0.75rem',
                color: 'rgba(255, 255, 255, 0.6)',
                marginBottom: '14px',
                fontWeight: '600'
              }}>
                {userData.branch} Branch
              </div>

              {/* Score Display */}
              <div style={{
                display: 'flex',
                alignItems: 'baseline',
                gap: '6px',
                marginBottom: '10px'
              }}>
                <div style={{
                  fontSize: '2.2rem',
                  color: templateColor,
                  fontWeight: '900',
                  fontFamily: 'monospace',
                  textShadow: `0 0 15px ${templateColor}80`
                }}>
                  {result.yourScore}
                </div>
                <div style={{
                  fontSize: '1rem',
                  color: 'rgba(255, 255, 255, 0.5)',
                  fontWeight: '700'
                }}>
                  /100
                </div>
              </div>

              {/* Progress Bar */}
              <div style={{
                background: 'rgba(0, 0, 0, 0.5)',
                height: '10px',
                borderRadius: '6px',
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
              fontSize: '1.4rem',
              fontWeight: '900',
              color: '#FF4500',
              margin: '4px 0',
              position: 'relative'
            }}>
              <div style={{
                display: 'inline-block',
                padding: '6px 16px',
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
              borderRadius: '14px',
              padding: '16px',
              position: 'relative',
              overflow: 'hidden'
            }}>
              {result.rivalScore > result.yourScore && (
                <div style={{
                  position: 'absolute',
                  top: '10px',
                  right: '10px',
                  fontSize: '1.5rem',
                  animation: 'bounce 1s infinite'
                }}>
                  👑
                </div>
              )}

              <div style={{
                fontSize: '0.65rem',
                color: '#FFD700',
                fontWeight: '700',
                marginBottom: '8px',
                letterSpacing: '1px',
                textTransform: 'uppercase'
              }}>
                🏆 Rival / Benchmark
              </div>
              
              <div style={{
                fontSize: '1.1rem',
                color: '#fff',
                fontWeight: '800',
                marginBottom: '4px',
                lineHeight: '1.2'
              }}>
                {battleData.rivalCollege}
              </div>
              
              <div style={{
                fontSize: '0.75rem',
                color: 'rgba(255, 255, 255, 0.6)',
                marginBottom: '14px',
                fontWeight: '600'
              }}>
                {userData.branch} Branch
              </div>

              {/* Score Display */}
              <div style={{
                display: 'flex',
                alignItems: 'baseline',
                gap: '6px',
                marginBottom: '10px'
              }}>
                <div style={{
                  fontSize: '2.2rem',
                  color: '#FFD700',
                  fontWeight: '900',
                  fontFamily: 'monospace',
                  textShadow: '0 0 15px rgba(255, 215, 0, 0.8)'
                }}>
                  {result.rivalScore}
                </div>
                <div style={{
                  fontSize: '1rem',
                  color: 'rgba(255, 255, 255, 0.5)',
                  fontWeight: '700'
                }}>
                  /100
                </div>
              </div>

              {/* Progress Bar */}
              <div style={{
                background: 'rgba(0, 0, 0, 0.5)',
                height: '10px',
                borderRadius: '6px',
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

          {/* Comparisons Section - COMPACT */}
          {result.comparisons && result.comparisons.length > 0 && (
            <div style={{
              background: 'rgba(255, 255, 255, 0.03)',
              borderRadius: '12px',
              padding: '14px',
              marginBottom: '16px',
              border: '1px solid rgba(255, 255, 255, 0.1)'
            }}>
              <div style={{
                fontSize: '0.7rem',
                color: 'rgba(255, 255, 255, 0.6)',
                fontWeight: '700',
                marginBottom: '10px',
                textAlign: 'center',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}>
                📊 Comparison
              </div>
              
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '8px'
              }}>
                {result.comparisons.slice(0, 3).map((comp, index) => (
                  <div 
                    key={index}
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '1fr auto 1fr',
                      gap: '8px',
                      alignItems: 'center',
                      padding: '10px',
                      background: 'rgba(0, 0, 0, 0.3)',
                      borderRadius: '8px',
                      border: '1px solid rgba(255, 255, 255, 0.05)',
                      fontSize: '0.8rem'
                    }}
                  >
                    <div style={{
                      textAlign: 'right',
                      padding: '6px',
                      background: comp.winner === 'you' ? `${templateColor}20` : 'transparent',
                      borderRadius: '6px',
                      color: comp.winner === 'you' ? templateColor : 'rgba(255, 255, 255, 0.7)',
                      fontWeight: '700'
                    }}>
                      {comp.yours}
                    </div>

                    <div style={{
                      textAlign: 'center',
                      minWidth: '60px'
                    }}>
                      <div style={{
                        fontSize: '0.65rem',
                        color: 'rgba(255, 255, 255, 0.5)',
                        fontWeight: '600',
                        marginBottom: '2px'
                      }}>
                        {comp.metric}
                      </div>
                      <div style={{ fontSize: '1rem' }}>
                        {comp.winner === 'you' ? '✓' : '✗'}
                      </div>
                    </div>

                    <div style={{
                      textAlign: 'left',
                      padding: '6px',
                      background: comp.winner === 'rival' ? 'rgba(255, 215, 0, 0.15)' : 'transparent',
                      borderRadius: '6px',
                      color: comp.winner === 'rival' ? '#FFD700' : 'rgba(255, 255, 255, 0.7)',
                      fontWeight: '700'
                    }}>
                      {comp.theirs}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* THE ROAST - COMPACT & SCROLLABLE */}
          <div style={{
            background: 'linear-gradient(135deg, rgba(255, 69, 0, 0.2), rgba(255, 69, 0, 0.05))',
            border: '2px solid #FF4500',
            borderRadius: '14px',
            padding: '16px',
            position: 'relative',
            overflow: 'hidden',
            maxHeight: '180px',
            overflowY: 'auto'
          }}>
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

            <div style={{ position: 'relative', zIndex: 1 }}>
              <div style={{
                fontSize: '0.75rem',
                color: '#FF4500',
                fontWeight: '700',
                marginBottom: '10px',
                textAlign: 'center',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px'
              }}>
                <span style={{ fontSize: '1.2rem' }}>💀</span>
                <span style={{ letterSpacing: '0.5px', textTransform: 'uppercase' }}>
                  THE ROAST
                </span>
                <span style={{ fontSize: '1.2rem' }}>💀</span>
              </div>
              
              <p style={{
                fontSize: '0.9rem',
                lineHeight: '1.5',
                color: '#fff',
                margin: 0,
                fontWeight: '600',
                whiteSpace: 'pre-wrap',
                textAlign: 'left',
                textShadow: '0 2px 8px rgba(0, 0, 0, 0.5)'
              }}>
                {result.roast}
              </p>
            </div>
          </div>

          {/* Model Credit */}
          {result.modelUsed && (
            <div style={{
              textAlign: 'center',
              marginTop: '12px',
              fontSize: '0.65rem',
              color: 'rgba(255, 255, 255, 0.3)',
              fontWeight: '600'
            }}>
              Powered by {result.modelUsed}
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons - NOW WITH 3 BUTTONS */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '10px'
      }}>
        <button
          onClick={downloadAsImage}
          style={{
            padding: '14px',
            background: 'linear-gradient(135deg, #9333ea, #7e22ce)',
            border: 'none',
            borderRadius: '12px',
            color: '#fff',
            fontSize: '0.9rem',
            fontWeight: '800',
            cursor: 'pointer',
            fontFamily: 'inherit',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            boxShadow: '0 6px 20px rgba(147, 51, 234, 0.4)',
            transition: 'all 0.3s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 8px 28px rgba(147, 51, 234, 0.6)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 6px 20px rgba(147, 51, 234, 0.4)';
          }}
        >
          <span style={{ fontSize: '1.1rem' }}>📥</span>
          Download
        </button>

        <button
          onClick={onShare}
          style={{
            padding: '14px',
            background: `linear-gradient(135deg, ${templateColor}, ${templateColor}cc)`,
            border: 'none',
            borderRadius: '12px',
            color: '#000',
            fontSize: '0.9rem',
            fontWeight: '800',
            cursor: 'pointer',
            fontFamily: 'inherit',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            boxShadow: `0 6px 20px ${templateColor}40`,
            transition: 'all 0.3s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = `0 8px 28px ${templateColor}60`;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = `0 6px 20px ${templateColor}40`;
          }}
        >
          <span style={{ fontSize: '1.1rem' }}>📱</span>
          Share
        </button>
        
        <button
          onClick={onNewBattle}
          style={{
            padding: '14px',
            background: '#222',
            border: '1px solid #666',
            borderRadius: '12px',
            color: '#fff',
            fontSize: '0.9rem',
            fontWeight: '800',
            cursor: 'pointer',
            fontFamily: 'inherit',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
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
          <span style={{ fontSize: '1.1rem' }}>🔄</span>
          New Battle
        </button>
      </div>

      {/* Animations & Scrollbar */}
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
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
            transform: translateY(-8px);
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

        div::-webkit-scrollbar {
          width: 5px;
          height: 5px;
        }
        
        div::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.3);
          border-radius: 10px;
        }
        
        div::-webkit-scrollbar-thumb {
          background: #FF4500;
          border-radius: 10px;
        }

        div::-webkit-scrollbar-thumb:hover {
          background: #FF6347;
        }
      `}</style>
    </div>
  );
            }
