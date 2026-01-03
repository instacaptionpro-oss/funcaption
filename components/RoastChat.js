import { useState, useEffect, useRef } from 'react';

const RoastChat = ({ subject, mood, initialRoast, onClose }) => {
  const [messages, setMessages] = useState([
    { id: 1, text: initialRoast || "Let's get roasted! Say something...", sender: 'ai' }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // High-quality fallback roasts
  const getFallbackRoast = (userInput) => {
    const fallbacks = [
      `"${userInput}"? That's the best you got? My grandma's insults hit harder, and she's been dead for 10 years.`,
      `"${userInput}" - Wow, you really typed that out, read it, and still hit send? Bold move for someone with zero self-awareness.`,
      `"${userInput}"? I've seen better comebacks from a boomerang with a broken arm. Absolutely pathetic.`,
      `Did you really just say "${userInput}"? Even autocorrect is embarrassed to be associated with you.`,
      `"${userInput}" - That's not a statement, that's a cry for help. Get therapy, not roasts.`,
      `"${userInput}"? You couldn't roast a marshmallow without setting yourself on fire, genius.`,
      `Imagine thinking "${userInput}" was worth anyone's time. Couldn't be me. Actually couldn't be anyone with brain cells.`,
      `"${userInput}" - This is why your parents changed the WiFi password and "forgot" to tell you.`
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

    setMessages(prev => [...prev, userMessage]);
    const userInput = inputValue;
    setInputValue('');
    setIsLoading(true);
    setError(null);

    try {
      // Call your backend API route
      const response = await fetch('/api/roast', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userInput: userInput,
          subject: subject,
          mood: mood
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to get roast');
      }

      if (!data.roast) {
        throw new Error('No roast received');
      }

      const aiMessage = {
        id: Date.now() + 1,
        text: data.roast,
        sender: 'ai'
      };

      setMessages(prev => [...prev, aiMessage]);

    } catch (error) {
      console.error("Roast chat error:", error);
      setError(error.message);
      
      // Use high-quality fallback
      const aiMessage = {
        id: Date.now() + 1,
        text: getFallbackRoast(userInput),
        sender: 'ai'
      };
      
      setMessages(prev => [...prev, aiMessage]);
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

  return (
    <div style={{
      position: 'fixed',
      top: '0',
      left: '0',
      right: '0',
      bottom: '0',
      background: 'linear-gradient(180deg, #0a0a0a 0%, #1a0a0a 100%)',
      zIndex: '10000',
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* Header */}
      <div style={{
        padding: '15px 20px',
        background: 'linear-gradient(90deg, #8B0000, #DC143C, #FF4500)',
        color: 'white',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        boxShadow: '0 4px 20px rgba(139, 0, 0, 0.5)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '1.5rem' }}>🔥</span>
          <h3 style={{ margin: '0', fontSize: '1.2rem', fontWeight: '700', letterSpacing: '2px' }}>
            ROAST CHAT
          </h3>
          <span style={{ fontSize: '1.5rem' }}>🔥</span>
        </div>
        <button
          onClick={onClose}
          style={{
            background: 'rgba(255,255,255,0.2)',
            border: 'none',
            color: 'white',
            fontSize: '1.3rem',
            cursor: 'pointer',
            width: '35px',
            height: '35px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'background 0.2s'
          }}
          onMouseOver={(e) => e.target.style.background = 'rgba(255,255,255,0.3)'}
          onMouseOut={(e) => e.target.style.background = 'rgba(255,255,255,0.2)'}
        >
          ×
        </button>
      </div>

      {/* Error Banner */}
      {error && (
        <div style={{
          padding: '10px 20px',
          background: 'rgba(255, 193, 7, 0.2)',
          borderBottom: '1px solid #FFC107',
          color: '#FFC107',
          fontSize: '0.85rem',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <span>⚠️</span>
          <span>AI temporarily unavailable - using backup roasts</span>
          <button 
            onClick={() => setError(null)}
            style={{
              marginLeft: 'auto',
              background: 'none',
              border: 'none',
              color: '#FFC107',
              cursor: 'pointer'
            }}
          >
            ×
          </button>
        </div>
      )}

      {/* Subject Info */}
      {subject && (
        <div style={{
          padding: '10px 20px',
          background: 'rgba(139, 0, 0, 0.3)',
          borderBottom: '1px solid rgba(255, 69, 0, 0.3)',
          color: '#FF6B6B',
          fontSize: '0.85rem'
        }}>
          🎯 Roasting: <strong>{subject}</strong>
          {mood && <span style={{ marginLeft: '15px' }}>💀 Mood: <strong>{mood}</strong></span>}
        </div>
      )}

      {/* Messages Container */}
      <div style={{
        flex: '1',
        overflowY: 'auto',
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '15px'
      }}>
        {messages.map((message) => (
          <div
            key={message.id}
            style={{
              alignSelf: message.sender === 'user' ? 'flex-end' : 'flex-start',
              maxWidth: '85%',
              animation: 'fadeIn 0.3s ease-out'
            }}
          >
            {/* Sender Label */}
            <div style={{
              fontSize: '0.7rem',
              color: message.sender === 'user' ? '#4A9FFF' : '#FF6B6B',
              marginBottom: '5px',
              textAlign: message.sender === 'user' ? 'right' : 'left',
              textTransform: 'uppercase',
              letterSpacing: '1px'
            }}>
              {message.sender === 'user' ? '🎤 You' : '🔥 Roast Master'}
            </div>
            
            {/* Message Bubble */}
            <div style={{
              background: message.sender === 'user' 
                ? 'linear-gradient(135deg, #1E3A5F, #2E5A8F)' 
                : 'linear-gradient(135deg, #5C1515, #8B2020, #A52A2A)',
              color: 'white',
              padding: '14px 18px',
              borderRadius: message.sender === 'user' 
                ? '20px 5px 20px 20px' 
                : '5px 20px 20px 20px',
              boxShadow: message.sender === 'user'
                ? '0 4px 15px rgba(30, 58, 95, 0.4)'
                : '0 4px 15px rgba(139, 32, 32, 0.5), 0 0 20px rgba(255, 69, 0, 0.2)',
              border: message.sender === 'ai' ? '1px solid rgba(255, 69, 0, 0.3)' : 'none'
            }}>
              <p style={{ 
                margin: '0', 
                fontSize: '1rem', 
                lineHeight: '1.5',
                wordBreak: 'break-word'
              }}>
                {message.text}
              </p>
            </div>
          </div>
        ))}
        
        {/* Loading State */}
        {isLoading && (
          <div style={{
            alignSelf: 'flex-start',
            maxWidth: '85%'
          }}>
            <div style={{
              fontSize: '0.7rem',
              color: '#FF6B6B',
              marginBottom: '5px',
              textTransform: 'uppercase',
              letterSpacing: '1px'
            }}>
              🔥 Roast Master
            </div>
            <div style={{
              background: 'linear-gradient(135deg, #5C1515, #8B2020)',
              color: 'white',
              padding: '14px 18px',
              borderRadius: '5px 20px 20px 20px',
              boxShadow: '0 4px 15px rgba(139, 32, 32, 0.5)',
              border: '1px solid rgba(255, 69, 0, 0.3)',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}>
              <div style={{
                display: 'flex',
                gap: '4px'
              }}>
                <span style={{ 
                  animation: 'bounce 1s infinite',
                  animationDelay: '0ms'
                }}>🔥</span>
                <span style={{ 
                  animation: 'bounce 1s infinite',
                  animationDelay: '150ms'
                }}>🔥</span>
                <span style={{ 
                  animation: 'bounce 1s infinite',
                  animationDelay: '300ms'
                }}>🔥</span>
              </div>
              <span style={{ fontSize: '0.95rem' }}>Cooking up something savage...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div style={{
        padding: '15px 20px',
        background: 'rgba(15, 15, 15, 0.98)',
        borderTop: '1px solid rgba(139, 0, 0, 0.5)'
      }}>
        <div style={{
          display: 'flex',
          gap: '12px',
          alignItems: 'flex-end'
        }}>
          <textarea
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Say something to get brutally roasted... 💀"
            style={{
              flex: '1',
              padding: '14px 18px',
              borderRadius: '25px',
              border: '2px solid rgba(139, 0, 0, 0.6)',
              background: 'rgba(30, 30, 30, 0.9)',
              color: 'white',
              fontSize: '1rem',
              outline: 'none',
              resize: 'none',
              height: '52px',
              fontFamily: 'inherit',
              transition: 'border-color 0.2s, box-shadow 0.2s'
            }}
            onFocus={(e) => {
              e.target.style.borderColor = '#FF4500';
              e.target.style.boxShadow = '0 0 15px rgba(255, 69, 0, 0.3)';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = 'rgba(139, 0, 0, 0.6)';
              e.target.style.boxShadow = 'none';
            }}
            disabled={isLoading}
          />
          <button
            onClick={sendMessage}
            disabled={isLoading || !inputValue.trim()}
            style={{
              padding: '14px 28px',
              background: isLoading || !inputValue.trim() 
                ? 'linear-gradient(135deg, #444, #555)' 
                : 'linear-gradient(135deg, #8B0000, #DC143C, #FF4500)',
              color: 'white',
              border: 'none',
              borderRadius: '25px',
              fontWeight: '700',
              fontSize: '1rem',
              cursor: isLoading || !inputValue.trim() ? 'not-allowed' : 'pointer',
              boxShadow: isLoading || !inputValue.trim() 
                ? 'none' 
                : '0 4px 20px rgba(139, 0, 0, 0.5)',
              transition: 'transform 0.2s, box-shadow 0.2s',
              letterSpacing: '1px'
            }}
            onMouseOver={(e) => {
              if (!isLoading && inputValue.trim()) {
                e.target.style.transform = 'scale(1.05)';
              }
            }}
            onMouseOut={(e) => {
              e.target.style.transform = 'scale(1)';
            }}
          >
            {isLoading ? '🔥' : 'ROAST ME'}
          </button>
        </div>
        
        {/* Hint Text */}
        <p style={{
          margin: '10px 0 0 0',
          fontSize: '0.75rem',
          color: 'rgba(255, 255, 255, 0.4)',
          textAlign: 'center'
        }}>
          Press Enter to send • Be prepared to get destroyed 💀
        </p>
      </div>

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
      `}</style>
    </div>
  );
};

export default RoastChat;
