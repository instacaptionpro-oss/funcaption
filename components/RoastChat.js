// /components/RoastChat.js

import { useState, useEffect, useRef } from 'react';

const RoastChat = ({ subject, mood, initialRoast, onClose }) => {
  const [messages, setMessages] = useState([
    { 
      id: 1, 
      text: initialRoast || "Yo, let's fucking go. Say something so I can destroy you. Click an example below or type your own shit. 💀", 
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
  // 3 EXAMPLE PROMPTS - Simple & Clear
  // ============================================
  const examplePrompts = [
    {
      text: "I think I'm really good looking",
      emoji: "😏",
      color: "#FF6B6B"
    },
    {
      text: "I'm smarter than most people",
      emoji: "🧠",
      color: "#9B59B6"
    },
    {
      text: "My ex was wrong about me",
      emoji: "💔",
      color: "#3498DB"
    }
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Fallback roasts
  const getFallbackRoast = (userInput) => {
    const fallbacks = [
      `"${userInput}"? Bro that's the dumbest shit I've heard all day. 💀`,
      `You really typed "${userInput}"? This is why nobody loves you. 😭`,
      `"${userInput}"? Holy shit the delusion is strong.`,
      `Bro said "${userInput}" like anyone gives a fuck 💀`,
      `"${userInput}"? This is why your ex upgraded. 😭`,
      `"${userInput}"? Even autocorrect gives up on you.`,
      `"${userInput}"? Bro the audacity 💀`,
      `"${userInput}"? Your future is darker than your browser history. 😭`
    ];
    return fallbacks[Math.floor(Math.random() * fallbacks.length)];
  };

  // Send message
  const sendMessage = async (messageText = null) => {
    const textToSend = messageText || inputValue;
    if (!textToSend || !textToSend.trim() || isLoading) return;

    // Hide examples after first message
    setShowExamples(false);

    const userMessage = {
      id: Date.now(),
      text: textToSend.trim(),
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
          userInput: textToSend.trim(),
          subject: subject || '',
          mood: mood || '',
          conversationHistory: updatedMessages.slice(-8).map(m => ({
            text: m.text,
            sender: m.sender
          }))
        }),
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      let data;
      try {
        const text = await response.text();
        data = JSON.parse(text);
      } catch (parseError) {
        throw new Error("Invalid response");
      }

      if (!data.roast) {
        throw new Error('No roast');
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
      console.error("Error:", error.message);
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

  // Handle example click
  const handleExampleClick = (exampleText) => {
    sendMessage(exampleText);
  };

  // Intensity label
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
        alignItems: 'center'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '1.8rem' }}>🔥</span>
          <div>
            <h3 style={{ margin: '0', fontSize: '1.1rem', fontWeight: '900', letterSpacing: '3px' }}>
              ROAST ZONE
            </h3>
            <span style={{ fontSize: '0.65rem', color: intensity.color, letterSpacing: '2px', fontWeight: '700' }}>
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
          
          <button onClick={onClose} style={{
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
          }}>
            ×
          </button>
        </div>
      </div>

      {/* Warning Banner */}
      <div style={{
        padding: '8px 20px',
        background: 'rgba(139, 0, 0, 0.3)',
        borderBottom: '1px solid rgba(255, 69, 0, 0.3)',
        color: '#FF6B6B',
        fontSize: '0.7rem',
        textAlign: 'center',
        letterSpacing: '1px'
      }}>
        ⚠️ NO FILTER • EXPLICIT CONTENT • ZERO MERCY ⚠️
      </div>

      {/* ============================================ */}
      {/* MESSAGES CONTAINER */}
      {/* ============================================ */}
      <div style={{
        flex: '1',
        overflowY: 'auto',
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '18px'
      }}>
        {/* Messages */}
        {messages.map((message) => (
          <div key={message.id} style={{
            alignSelf: message.sender === 'user' ? 'flex-end' : 'flex-start',
            maxWidth: '88%'
          }}>
            <div style={{
              fontSize: '0.68rem',
              color: message.sender === 'user' ? '#6B9FFF' : '#FF5C5C',
              marginBottom: '6px',
              textAlign: message.sender === 'user' ? 'right' : 'left',
              fontWeight: '600',
              letterSpacing: '1px'
            }}>
              {message.sender === 'user' ? 'YOU 🎤' : '💀 ROAST MASTER'}
            </div>
            
            <div style={{
              background: message.sender === 'user' 
                ? 'linear-gradient(135deg, #1a2a4a, #2a3a5a)' 
                : 'linear-gradient(135deg, #2a0a0a, #4a1515)',
              color: 'white',
              padding: '16px 20px',
              borderRadius: message.sender === 'user' ? '22px 6px 22px 22px' : '6px 22px 22px 22px',
              border: message.sender === 'ai' ? '1px solid rgba(255, 69, 0, 0.4)' : 'none',
              boxShadow: message.sender === 'ai' ? '0 5px 20px rgba(139, 0, 0, 0.3)' : 'none'
            }}>
              <p style={{ margin: '0', fontSize: '1rem', lineHeight: '1.6' }}>
                {message.text}
              </p>
            </div>
          </div>
        ))}
        
        {/* ============================================ */}
        {/* EXAMPLE PROMPTS - 3 Big Buttons */}
        {/* ============================================ */}
        {showExamples && (
          <div style={{
            marginTop: '10px',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px'
          }}>
            {/* Header */}
            <div style={{
              textAlign: 'center',
              marginBottom: '5px'
            }}>
              <p style={{
                margin: '0',
                color: '#FF8C69',
                fontSize: '0.9rem',
                fontWeight: '700'
              }}>
                👇 TAP TO TRY 👇
              </p>
              <p style={{
                margin: '5px 0 0 0',
                color: 'rgba(255,255,255,0.5)',
                fontSize: '0.75rem'
              }}>
                Click any example to see how I roast
              </p>
            </div>

            {/* 3 Example Buttons */}
            {examplePrompts.map((example, index) => (
              <button
                key={index}
                onClick={() => handleExampleClick(example.text)}
                style={{
                  width: '100%',
                  padding: '18px 20px',
                  background: 'linear-gradient(135deg, rgba(30, 30, 30, 0.9), rgba(50, 20, 20, 0.9))',
                  border: `2px solid ${example.color}`,
                  borderRadius: '16px',
                  color: '#FFFFFF',
                  fontSize: '1rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '15px',
                  transition: 'all 0.2s ease',
                  textAlign: 'left'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = 'scale(1.02)';
                  e.currentTarget.style.boxShadow = `0 5px 25px ${example.color}40`;
                  e.currentTarget.style.background = 'linear-gradient(135deg, rgba(50, 30, 30, 0.95), rgba(70, 30, 30, 0.95))';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'scale(1)';
                  e.currentTarget.style.boxShadow = 'none';
                  e.currentTarget.style.background = 'linear-gradient(135deg, rgba(30, 30, 30, 0.9), rgba(50, 20, 20, 0.9))';
                }}
              >
                {/* Emoji */}
                <span style={{
                  fontSize: '1.8rem',
                  width: '45px',
                  height: '45px',
                  background: `${example.color}30`,
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  {example.emoji}
                </span>
                
                {/* Text */}
                <div style={{ flex: 1 }}>
                  <p style={{
                    margin: '0',
                    fontSize: '1rem',
                    fontWeight: '600',
                    color: '#FFFFFF'
                  }}>
                    "{example.text}"
                  </p>
                  <p style={{
                    margin: '4px 0 0 0',
                    fontSize: '0.75rem',
                    color: example.color
                  }}>
                    Tap to send →
                  </p>
                </div>

                {/* Arrow */}
                <span style={{
                  fontSize: '1.2rem',
                  color: example.color
                }}>
                  ▶
                </span>
              </button>
            ))}

            {/* Or type your own */}
            <div style={{
              textAlign: 'center',
              marginTop: '10px',
              padding: '15px',
              background: 'rgba(0,0,0,0.3)',
              borderRadius: '12px',
              border: '1px dashed rgba(255,255,255,0.2)'
            }}>
              <p style={{
                margin: '0',
                color: 'rgba(255,255,255,0.6)',
                fontSize: '0.85rem'
              }}>
                Or type your own message below ⌨️
              </p>
            </div>
          </div>
        )}
        
        {/* Loading State */}
        {isLoading && (
          <div style={{ alignSelf: 'flex-start', maxWidth: '88%' }}>
            <div style={{
              fontSize: '0.68rem',
              color: '#FF5C5C',
              marginBottom: '6px',
              fontWeight: '600'
            }}>
              💀 ROAST MASTER
            </div>
            <div style={{
              background: 'linear-gradient(135deg, #2a0a0a, #4a1515)',
              color: 'white',
              padding: '16px 20px',
              borderRadius: '6px 22px 22px 22px',
              border: '1px solid rgba(255, 69, 0, 0.4)',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}>
              <span style={{ animation: 'spin 1s linear infinite' }}>🔥</span>
              <span style={{ color: '#FF8C69' }}>Cooking up something brutal...</span>
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
        <div style={{ display: 'flex', gap: '12px' }}>
          <textarea
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Talk shit and find out... 💀"
            style={{
              flex: 1,
              padding: '15px 20px',
              borderRadius: '25px',
              border: '2px solid rgba(139, 0, 0, 0.6)',
              background: 'rgba(25, 15, 15, 0.95)',
              color: 'white',
              fontSize: '1rem',
              outline: 'none',
              resize: 'none',
              height: '55px',
              fontFamily: 'inherit'
            }}
            disabled={isLoading}
          />
          
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
              minWidth: '120px',
              transition: 'all 0.2s'
            }}
          >
            {isLoading ? '🔥' : 'SEND'}
          </button>
        </div>
        
        <div style={{
          marginTop: '10px',
          display: 'flex',
          justifyContent: 'space-between',
          fontSize: '0.7rem',
          color: 'rgba(255, 255, 255, 0.4)'
        }}>
          <span>⌨️ Press Enter to send</span>
          <span style={{ color: '#FF6B6B' }}>No limits. No mercy. 💀</span>
        </div>
      </div>

      {/* ============================================ */}
      {/* CSS ANIMATIONS */}
      {/* ============================================ */}
      <style jsx global>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default RoastChat;
