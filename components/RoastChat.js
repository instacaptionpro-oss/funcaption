// /components/RoastChat.js

import { useState, useEffect, useRef } from 'react';

const RoastChat = ({ subject, mood, initialRoast, onClose }) => {
  const [messages, setMessages] = useState([
    { 
      id: 1, 
      text: initialRoast || "Alright, let's fucking go. Say something so I can destroy you. Don't be shy, I've seen worse... actually, looking at you, maybe I haven't. 💀", 
      sender: 'ai',
      isFromAI: true
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [roastCount, setRoastCount] = useState(0);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // BRUTAL unfiltered fallback roasts
  const getFallbackRoast = (userInput) => {
    const fallbacks = [
      `"${userInput}"? That's the shit you came up with? Holy fuck, I've seen better comebacks from a guy in a coma. Your brain must be running on Internet Explorer.`,
      
      `Bro really said "${userInput}" like it meant something 💀 The absolute audacity of someone with your track record. You're not a disappointment, you're a fucking catastrophe.`,
      
      `"${userInput}" - Did your last brain cell write that before it died of loneliness? Even autocorrect gave up on your dumbass. Pathetic doesn't even begin to cover it.`,
      
      `Jesus Christ, "${userInput}"? That's what you're bringing to the table? No wonder everyone leaves you on read. Your existence is a typo God forgot to delete.`,
      
      `"${userInput}" holy shit 😭 You typed that out, looked at it, and thought "yeah this is fire"? Bitch, the only fire here is the dumpster you crawled out of.`,
      
      `Imagine having the balls to say "${userInput}" when you look like that and live like this. The delusion is almost impressive. Almost.`,
      
      `"${userInput}"? That's cute. You know what else is cute? The way you think anyone gives a fuck. Spoiler: they don't. They never did.`,
      
      `Bro said "${userInput}" 💀💀💀 I'm actually speechless at how stupid that was. And I'm never speechless. Congratulations, you've achieved peak dumbassery.`,
      
      `"${userInput}" - This is why your parents drink. This is why your ex left. This is why you're alone on a Friday night talking to an AI for validation. Tragic.`,
      
      `Holy fuck, "${userInput}"? Even for you, this is embarrassing. Your family tree must be a circle because there's no way natural selection allowed this.`
    ];
    return fallbacks[Math.floor(Math.random() * fallbacks.length)];
  };

  const sendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage = {
      id: Date.now(),
      text: inputValue,
      sender: 'user'
    };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    const userInput = inputValue;
    setInputValue('');
    setIsLoading(true);
    setError(null);

    try {
      console.log("🚀 Sending request to /api/roast-chat...");

      // ✅ CORRECT URL - matches the file name: roast-chat.js
      const response = await fetch('/api/roast-chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userInput: userInput,
          subject: subject,
          mood: mood,
          conversationHistory: updatedMessages.slice(-8)
        }),
      });

      console.log("📨 Response status:", response.status);

      const data = await response.json();
      
      console.log("📦 Response data:", data);

      if (!response.ok) {
        throw new Error(data.error || data.details || `HTTP ${response.status}`);
      }

      if (!data.roast) {
        throw new Error('No roast in response');
      }

      console.log("✅ AI Roast received:", data.roast.substring(0, 50) + "...");

      const aiMessage = {
        id: Date.now() + 1,
        text: data.roast,
        sender: 'ai',
        isFromAI: true
      };

      setMessages(prev => [...prev, aiMessage]);
      setRoastCount(prev => prev + 1);

    } catch (error) {
      console.error("❌ Roast chat error:", error.message);
      setError(error.message);
      
      // Use fallback
      const aiMessage = {
        id: Date.now() + 1,
        text: getFallbackRoast(userInput),
        sender: 'ai',
        isFromAI: false
      };
      
      setMessages(prev => [...prev, aiMessage]);
      setRoastCount(prev => prev + 1);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // Get roast intensity label
  const getIntensityLabel = () => {
    if (roastCount === 0) return { text: "WARMING UP", color: "#FFD700" };
    if (roastCount < 3) return { text: "GETTING SPICY", color: "#FF8C00" };
    if (roastCount < 6) return { text: "ON FIRE", color: "#FF4500" };
    if (roastCount < 10) return { text: "NUCLEAR", color: "#DC143C" };
    return { text: "EXTINCTION LEVEL", color: "#8B0000" };
  };

  const intensity = getIntensityLabel();

  return (
    <div style={{
      position: 'fixed',
      top: '0',
      left: '0',
      right: '0',
      bottom: '0',
      background: 'linear-gradient(180deg, #0a0505 0%, #150808 50%, #0a0505 100%)',
      zIndex: '10000',
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* Header */}
      <div style={{
        padding: '12px 20px',
        background: 'linear-gradient(90deg, #1a0000, #3d0000, #1a0000)',
        borderBottom: '2px solid #8B0000',
        color: 'white',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        boxShadow: '0 4px 30px rgba(139, 0, 0, 0.6)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '1.8rem', filter: 'drop-shadow(0 0 10px #FF4500)' }}>🔥</span>
          <div>
            <h3 style={{ 
              margin: '0', 
              fontSize: '1.1rem', 
              fontWeight: '900', 
              letterSpacing: '3px',
              textShadow: '0 0 10px rgba(255, 69, 0, 0.5)'
            }}>
              ROAST ZONE
            </h3>
            <span style={{ 
              fontSize: '0.65rem', 
              color: intensity.color,
              letterSpacing: '2px',
              fontWeight: '700'
            }}>
              ⚡ {intensity.text}
            </span>
          </div>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          {/* Roast Counter */}
          <div style={{
            background: 'rgba(139, 0, 0, 0.5)',
            padding: '5px 12px',
            borderRadius: '15px',
            fontSize: '0.75rem',
            border: '1px solid #FF4500'
          }}>
            💀 {roastCount} BURNS
          </div>
          
          <button
            onClick={onClose}
            style={{
              background: 'rgba(255,255,255,0.1)',
              border: '1px solid rgba(255,255,255,0.3)',
              color: 'white',
              fontSize: '1.2rem',
              cursor: 'pointer',
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s'
            }}
          >
            ×
          </button>
        </div>
      </div>

      {/* Warning Banner */}
      <div style={{
        padding: '8px 20px',
        background: 'linear-gradient(90deg, rgba(139, 0, 0, 0.3), rgba(255, 69, 0, 0.2), rgba(139, 0, 0, 0.3))',
        borderBottom: '1px solid rgba(255, 69, 0, 0.3)',
        color: '#FF6B6B',
        fontSize: '0.7rem',
        textAlign: 'center',
        letterSpacing: '1px',
        textTransform: 'uppercase'
      }}>
        ⚠️ EXPLICIT CONTENT • NO FILTER ZONE • ENTER AT YOUR OWN RISK ⚠️
      </div>

      {/* Subject Info */}
      {subject && (
        <div style={{
          padding: '10px 20px',
          background: 'rgba(0, 0, 0, 0.5)',
          borderBottom: '1px solid rgba(255, 69, 0, 0.2)',
          color: '#FF8C69',
          fontSize: '0.8rem',
          display: 'flex',
          alignItems: 'center',
          gap: '10px'
        }}>
          <span>🎯</span>
          <span>Target: <strong style={{ color: '#FF4500' }}>{subject}</strong></span>
          {mood && (
            <>
              <span style={{ opacity: 0.5 }}>|</span>
              <span>Mode: <strong style={{ color: '#FFD700' }}>{mood}</strong></span>
            </>
          )}
        </div>
      )}

      {/* Error Banner */}
      {error && (
        <div style={{
          padding: '10px 20px',
          background: 'rgba(255, 50, 50, 0.2)',
          borderBottom: '1px solid #FF4444',
          color: '#FF6B6B',
          fontSize: '0.8rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <span>⚠️ API Error: {error} (using fallback)</span>
          <button 
            onClick={() => setError(null)}
            style={{ 
              background: 'none', 
              border: 'none', 
              color: '#FF6B6B', 
              cursor: 'pointer',
              fontSize: '1.2rem'
            }}
          >
            ×
          </button>
        </div>
      )}

      {/* Messages Container */}
      <div style={{
        flex: '1',
        overflowY: 'auto',
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '18px',
        background: 'radial-gradient(ellipse at center, rgba(139, 0, 0, 0.1) 0%, transparent 70%)'
      }}>
        {messages.map((message) => (
          <div
            key={message.id}
            style={{
              alignSelf: message.sender === 'user' ? 'flex-end' : 'flex-start',
              maxWidth: '88%',
              animation: 'slideIn 0.3s ease-out'
            }}
          >
            {/* Sender Label */}
            <div style={{
              fontSize: '0.68rem',
              color: message.sender === 'user' ? '#6B9FFF' : '#FF5C5C',
              marginBottom: '6px',
              textAlign: message.sender === 'user' ? 'right' : 'left',
              textTransform: 'uppercase',
              letterSpacing: '1.5px',
              fontWeight: '600',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              justifyContent: message.sender === 'user' ? 'flex-end' : 'flex-start'
            }}>
              {message.sender === 'user' ? (
                <>YOU 🎤</>
              ) : (
                <>
                  💀 ROAST MASTER
                  {message.isFromAI === true && (
                    <span style={{ color: '#00FF00', marginLeft: '5px' }}>✓ AI</span>
                  )}
                  {message.isFromAI === false && (
                    <span style={{ color: '#FFD700', marginLeft: '5px' }}>(fallback)</span>
                  )}
                </>
              )}
            </div>
            
            {/* Message Bubble */}
            <div style={{
              background: message.sender === 'user' 
                ? 'linear-gradient(135deg, #1a2a4a, #2a3a5a)' 
                : 'linear-gradient(135deg, #2a0a0a, #4a1515, #3a1010)',
              color: 'white',
              padding: '16px 20px',
              borderRadius: message.sender === 'user' 
                ? '22px 6px 22px 22px' 
                : '6px 22px 22px 22px',
              boxShadow: message.sender === 'user'
                ? '0 5px 20px rgba(30, 58, 95, 0.4)'
                : '0 5px 25px rgba(139, 0, 0, 0.5), inset 0 1px 0 rgba(255, 100, 100, 0.1)',
              border: message.sender === 'ai' 
                ? '1px solid rgba(255, 69, 0, 0.4)' 
                : '1px solid rgba(100, 150, 255, 0.2)',
              position: 'relative'
            }}>
              {/* Fire indicator for AI messages */}
              {message.sender === 'ai' && (
                <div style={{
                  position: 'absolute',
                  top: '-8px',
                  left: '15px',
                  fontSize: '1rem'
                }}>
                  🔥
                </div>
              )}
              
              <p style={{ 
                margin: '0', 
                fontSize: '1rem', 
                lineHeight: '1.6',
                wordBreak: 'break-word',
                whiteSpace: 'pre-wrap'
              }}>
                {message.text}
              </p>
            </div>
          </div>
        ))}
        
        {/* Loading State */}
        {isLoading && (
          <div style={{ alignSelf: 'flex-start', maxWidth: '88%' }}>
            <div style={{
              fontSize: '0.68rem',
              color: '#FF5C5C',
              marginBottom: '6px',
              textTransform: 'uppercase',
              letterSpacing: '1.5px',
              fontWeight: '600'
            }}>
              💀 ROAST MASTER
            </div>
            <div style={{
              background: 'linear-gradient(135deg, #2a0a0a, #4a1515)',
              color: 'white',
              padding: '16px 20px',
              borderRadius: '6px 22px 22px 22px',
              boxShadow: '0 5px 25px rgba(139, 0, 0, 0.5)',
              border: '1px solid rgba(255, 69, 0, 0.4)',
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}>
              <div style={{ display: 'flex', gap: '5px' }}>
                {['🔥', '💀', '🔥'].map((emoji, i) => (
                  <span 
                    key={i}
                    style={{ 
                      animation: `pulse 1s ease-in-out infinite`,
                      animationDelay: `${i * 0.2}s`,
                      display: 'inline-block'
                    }}
                  >
                    {emoji}
                  </span>
                ))}
              </div>
              <span style={{ 
                fontSize: '0.95rem',
                color: '#FF8C69'
              }}>
                Crafting something brutal...
              </span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div style={{
        padding: '15px 20px 20px',
        background: 'linear-gradient(180deg, rgba(20, 8, 8, 0.95), rgba(10, 5, 5, 0.98))',
        borderTop: '2px solid rgba(139, 0, 0, 0.6)'
      }}>
        <div style={{
          display: 'flex',
          gap: '12px',
          alignItems: 'flex-end'
        }}>
          <div style={{ flex: 1, position: 'relative' }}>
            <textarea
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Talk shit and find out... 💀"
              style={{
                width: '100%',
                padding: '15px 20px',
                paddingRight: '50px',
                borderRadius: '25px',
                border: '2px solid rgba(139, 0, 0, 0.6)',
                background: 'rgba(25, 15, 15, 0.95)',
                color: 'white',
                fontSize: '1rem',
                outline: 'none',
                resize: 'none',
                height: '55px',
                fontFamily: 'inherit',
                transition: 'all 0.3s',
                boxSizing: 'border-box'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#FF4500';
                e.target.style.boxShadow = '0 0 20px rgba(255, 69, 0, 0.4), inset 0 0 10px rgba(255, 69, 0, 0.1)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = 'rgba(139, 0, 0, 0.6)';
                e.target.style.boxShadow = 'none';
              }}
              disabled={isLoading}
            />
            {/* Enter hint */}
            <span style={{
              position: 'absolute',
              right: '15px',
              bottom: '18px',
              fontSize: '0.7rem',
              color: 'rgba(255,255,255,0.3)'
            }}>
              {inputValue.length > 0 ? '↵' : ''}
            </span>
          </div>
          
          <button
            onClick={sendMessage}
            disabled={isLoading || !inputValue.trim()}
            style={{
              padding: '15px 30px',
              background: isLoading || !inputValue.trim() 
                ? 'linear-gradient(135deg, #333, #444)' 
                : 'linear-gradient(135deg, #8B0000, #CC0000, #FF2200)',
              color: 'white',
              border: 'none',
              borderRadius: '25px',
              fontWeight: '800',
              fontSize: '0.95rem',
              cursor: isLoading || !inputValue.trim() ? 'not-allowed' : 'pointer',
              boxShadow: isLoading || !inputValue.trim() 
                ? 'none' 
                : '0 5px 25px rgba(200, 0, 0, 0.5), 0 0 40px rgba(255, 69, 0, 0.2)',
              transition: 'all 0.2s',
              letterSpacing: '2px',
              textTransform: 'uppercase',
              minWidth: '130px'
            }}
          >
            {isLoading ? (
              <span style={{ fontSize: '1.2rem' }}>🔥</span>
            ) : (
              'SEND IT'
            )}
          </button>
        </div>
        
        {/* Bottom hint */}
        <div style={{
          marginTop: '12px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: '0.7rem',
          color: 'rgba(255, 255, 255, 0.35)'
        }}>
          <span>⌨️ Enter to send • Shift+Enter for new line</span>
          <span style={{ color: '#FF6B6B' }}>No limits. No mercy. 💀</span>
        </div>
      </div>

      {/* CSS Animations */}
      <style jsx global>{`
        @keyframes slideIn {
          from { 
            opacity: 0; 
            transform: translateY(15px) scale(0.98); 
          }
          to { 
            opacity: 1; 
            transform: translateY(0) scale(1); 
          }
        }
        
        @keyframes pulse {
          0%, 100% { 
            transform: scale(1); 
            opacity: 1;
          }
          50% { 
            transform: scale(1.3); 
            opacity: 0.7;
          }
        }
        
        /* Custom Scrollbar */
        ::-webkit-scrollbar {
          width: 8px;
        }
        
        ::-webkit-scrollbar-track {
          background: rgba(20, 10, 10, 0.5);
        }
        
        ::-webkit-scrollbar-thumb {
          background: linear-gradient(180deg, #8B0000, #FF4500);
          border-radius: 4px;
        }
        
        ::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(180deg, #AA0000, #FF6622);
        }
      `}</style>
    </div>
  );
};

export default RoastChat;
