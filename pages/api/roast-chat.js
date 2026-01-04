// /components/RoastChat.js

import { useState, useEffect, useRef } from 'react';

const RoastChat = ({ subject, mood, initialRoast, onClose }) => {
  const [messages, setMessages] = useState([
    { 
      id: 1, 
      text: initialRoast || "Yo, let's fucking go. Say something so I can destroy you. Don't be shy, I've roasted worse... actually looking at you, maybe not. 💀", 
      sender: 'ai',
      isFromAI: true
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [roastCount, setRoastCount] = useState(0);
  const [showExamples, setShowExamples] = useState(true);
  const messagesEndRef = useRef(null);

  // ============================================
  // EXAMPLE PROMPTS - Like Gemini/ChatGPT
  // ============================================
  const examplePrompts = [
    { text: "I think I'm really good looking", emoji: "😏" },
    { text: "I'm smarter than most people", emoji: "🧠" },
    { text: "My ex was wrong about me", emoji: "💔" },
    { text: "I have lots of friends", emoji: "👥" },
    { text: "I'm actually pretty successful", emoji: "💰" },
    { text: "I'm a nice person", emoji: "😇" },
    { text: "People are just jealous of me", emoji: "😤" },
    { text: "I'm built different", emoji: "💪" },
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Hide examples after first message
  useEffect(() => {
    if (messages.length > 1) {
      setShowExamples(false);
    }
  }, [messages]);

  // ============================================
  // BRUTAL FALLBACK ROASTS
  // ============================================
  const getFallbackRoast = (userInput) => {
    const fallbacks = [
      `"${userInput}"? Bro that's the dumbest shit I've heard all day. Your brain is smoother than a fucking bowling ball. 💀`,
      `You really typed "${userInput}" with your whole chest? This is why nobody loves you bro. Not even your mom's favorite. 😭`,
      `"${userInput}"? Holy shit the delusion is STRONG. Your confidence is higher than your IQ and that's not a compliment.`,
      `Bro said "${userInput}" like anyone gives a fuck 💀 Spoiler: nobody does. Your notifications are drier than your personality.`,
      `"${userInput}"? This is why your ex upgraded bro. You're the 'before' photo in everyone's glow-up story. 😭`,
      `"${userInput}"? Even autocorrect is embarrassed by your dumbass. Holy shit just stop.`,
      `"${userInput}"? Bro the audacity 💀 You're not built different, you're just built wrong. Your dad knew, that's why he left.`,
      `You said "${userInput}" like it's impressive? 😭 Bro your future is darker than your browser history and we both know that's BAD.`
    ];
    return fallbacks[Math.floor(Math.random() * fallbacks.length)];
  };

  // ============================================
  // SEND MESSAGE
  // ============================================
  const sendMessage = async (messageText = null) => {
    const textToSend = messageText || inputValue;
    if (!textToSend.trim() || isLoading) return;

    // Hide examples when user sends first message
    setShowExamples(false);

    const userMessage = {
      id: Date.now(),
      text: textToSend,
      sender: 'user'
    };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInputValue('');
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/roast-chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userInput: textToSend,
          subject: subject,
          mood: mood,
          conversationHistory: updatedMessages.slice(-8)
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to get roast');
      }

      if (!data.roast) {
        throw new Error('No roast in response');
      }

      const aiMessage = {
        id: Date.now() + 1,
        text: data.roast,
        sender: 'ai',
        isFromAI: true
      };

      setMessages(prev => [...prev, aiMessage]);
      setRoastCount(prev => prev + 1);

    } catch (error) {
      console.error("Roast chat error:", error.message);
      setError(error.message);
      
      const aiMessage = {
        id: Date.now() + 1,
        text: getFallbackRoast(textToSend),
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

  // Handle example prompt click
  const handleExampleClick = (exampleText) => {
    sendMessage(exampleText);
  };

  // Get intensity label
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
      {/* ============================================ */}
      {/* HEADER */}
      {/* ============================================ */}
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
              justifyContent: 'center'
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
        ⚠️ NO FILTER • EXPLICIT CONTENT • ZERO MERCY ⚠️
      </div>

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
          <span>⚠️ Using backup roasts</span>
          <button 
            onClick={() => setError(null)}
            style={{ background: 'none', border: 'none', color: '#FF6B6B', cursor: 'pointer', fontSize: '1.2rem' }}
          >×</button>
        </div>
      )}

      {/* ============================================ */}
      {/* MESSAGES CONTAINER */}
      {/* ============================================ */}
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
              fontWeight: '600'
            }}>
              {message.sender === 'user' ? 'YOU 🎤' : '💀 ROAST MASTER'}
            </div>
            
            {/* Message Bubble */}
            <div style={{
              background: message.sender === 'user' 
                ? 'linear-gradient(135deg, #1a2a4a, #2a3a5a)' 
                : 'linear-gradient(135deg, #2a0a0a, #4a1515, #3a1010)',
              color: 'white',
              padding: '16px 20px',
              borderRadius: message.sender === 'user' ? '22px 6px 22px 22px' : '6px 22px 22px 22px',
              boxShadow: message.sender === 'user'
                ? '0 5px 20px rgba(30, 58, 95, 0.4)'
                : '0 5px 25px rgba(139, 0, 0, 0.5)',
              border: message.sender === 'ai' ? '1px solid rgba(255, 69, 0, 0.4)' : '1px solid rgba(100, 150, 255, 0.2)',
              position: 'relative'
            }}>
              {message.sender === 'ai' && (
                <div style={{ position: 'absolute', top: '-8px', left: '15px', fontSize: '1rem' }}>🔥</div>
              )}
              
              <p style={{ margin: '0', fontSize: '1rem', lineHeight: '1.6', whiteSpace: 'pre-wrap' }}>
                {message.text}
              </p>
            </div>
          </div>
        ))}
        
        {/* ============================================ */}
        {/* EXAMPLE PROMPTS - Like Gemini */}
        {/* ============================================ */}
        {showExamples && messages.length === 1 && (
          <div style={{
            marginTop: '20px',
            padding: '20px',
            background: 'rgba(0, 0, 0, 0.3)',
            borderRadius: '16px',
            border: '1px solid rgba(255, 69, 0, 0.2)'
          }}>
            <p style={{
              margin: '0 0 15px 0',
              color: '#FF8C69',
              fontSize: '0.85rem',
              fontWeight: '600',
              textAlign: 'center'
            }}>
              💡 Try saying something like:
            </p>
            
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '10px',
              justifyContent: 'center'
            }}>
              {examplePrompts.map((example, index) => (
                <button
                  key={index}
                  onClick={() => handleExampleClick(example.text)}
                  style={{
                    background: 'linear-gradient(135deg, rgba(139, 0, 0, 0.4), rgba(80, 0, 0, 0.6))',
                    border: '1px solid rgba(255, 69, 0, 0.4)',
                    borderRadius: '20px',
                    padding: '10px 16px',
                    color: '#FFFFFF',
                    fontSize: '0.85rem',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                  onMouseOver={(e) => {
                    e.target.style.background = 'linear-gradient(135deg, rgba(200, 0, 0, 0.5), rgba(139, 0, 0, 0.7))';
                    e.target.style.transform = 'scale(1.05)';
                    e.target.style.boxShadow = '0 5px 20px rgba(255, 69, 0, 0.3)';
                  }}
                  onMouseOut={(e) => {
                    e.target.style.background = 'linear-gradient(135deg, rgba(139, 0, 0, 0.4), rgba(80, 0, 0, 0.6))';
                    e.target.style.transform = 'scale(1)';
                    e.target.style.boxShadow = 'none';
                  }}
                >
                  <span>{example.emoji}</span>
                  <span>"{example.text}"</span>
                </button>
              ))}
            </div>
            
            <p style={{
              margin: '15px 0 0 0',
              color: 'rgba(255, 255, 255, 0.4)',
              fontSize: '0.7rem',
              textAlign: 'center'
            }}>
              👆 Click any to get roasted instantly
            </p>
          </div>
        )}
        
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
              <span style={{ animation: 'pulse 1s infinite' }}>🔥</span>
              <span style={{ animation: 'pulse 1s infinite 0.2s' }}>💀</span>
              <span style={{ animation: 'pulse 1s infinite 0.4s' }}>🔥</span>
              <span style={{ color: '#FF8C69', marginLeft: '5px' }}>Cooking up something brutal...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* ============================================ */}
      {/* INPUT AREA */}
      {/* ============================================ */}
      <div style={{
        padding: '15px 20px 20px',
        background: 'linear-gradient(180deg, rgba(20, 8, 8, 0.95), rgba(10, 5, 5, 0.98))',
        borderTop: '2px solid rgba(139, 0, 0, 0.6)'
      }}>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-end' }}>
          <div style={{ flex: 1, position: 'relative' }}>
            <textarea
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Talk shit and find out... 💀"
              style={{
                width: '100%',
                padding: '15px 20px',
                borderRadius: '25px',
                border: '2px solid rgba(139, 0, 0, 0.6)',
                background: 'rgba(25, 15, 15, 0.95)',
                color: 'white',
                fontSize: '1rem',
                outline: 'none',
                resize: 'none',
                height: '55px',
                fontFamily: 'inherit',
                boxSizing: 'border-box'
              }}
              disabled={isLoading}
            />
          </div>
          
          <button
            onClick={() => sendMessage()}
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
              boxShadow: isLoading || !inputValue.trim() ? 'none' : '0 5px 25px rgba(200, 0, 0, 0.5)',
              letterSpacing: '2px',
              minWidth: '130px'
            }}
          >
            {isLoading ? '🔥' : 'SEND IT'}
          </button>
        </div>
        
        <div style={{
          marginTop: '12px',
          display: 'flex',
          justifyContent: 'space-between',
          fontSize: '0.7rem',
          color: 'rgba(255, 255, 255, 0.35)'
        }}>
          <span>⌨️ Enter to send</span>
          <span style={{ color: '#FF6B6B' }}>No limits. No mercy. 💀</span>
        </div>
      </div>

      {/* CSS Animations */}
      <style jsx global>{`
        @keyframes slideIn {
          from { opacity: 0; transform: translateY(15px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.3); opacity: 0.7; }
        }
      `}</style>
    </div>
  );
};

export default RoastChat;
