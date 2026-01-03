import { useState, useEffect, useRef } from 'react';

const RoastChat = ({ subject, mood, initialRoast, onClose }) => {
  const [messages, setMessages] = useState([
    { 
      id: 1, 
      text: initialRoast || "Alright, let's fucking go. Say something so I can destroy you. 💀", 
      sender: 'ai' 
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [debugInfo, setDebugInfo] = useState(null); // For debugging
  const [roastCount, setRoastCount] = useState(0);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // BRUTAL fallback roasts
  const getFallbackRoast = (userInput) => {
    const fallbacks = [
      `"${userInput}"? That's the shit you came up with? Holy fuck, I've seen better comebacks from a guy in a coma.`,
      `Bro really said "${userInput}" like it meant something 💀 The absolute audacity. You're not a disappointment, you're a fucking catastrophe.`,
      `"${userInput}" - Did your last brain cell write that before it died of loneliness? Pathetic.`,
      `Jesus Christ, "${userInput}"? That's what you're bringing? No wonder everyone leaves you on read.`,
      `"${userInput}" holy shit 😭 You typed that out and thought "yeah this is fire"? The only fire here is the dumpster you crawled out of.`,
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
    setDebugInfo(null);

    try {
      console.log("🚀 Sending request to /api/roastchat...");
      console.log("Payload:", { userInput, subject, mood });

      // ⚠️ IMPORTANT: Make sure this matches your API file name!
      const response = await fetch('/api/roastchat', {
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

      console.log("Response status:", response.status);

      const data = await response.json();
      console.log("Response data:", data);

      // Store debug info
      setDebugInfo({
        status: response.status,
        ok: response.ok,
        data: data
      });

      if (!response.ok) {
        throw new Error(data.error || data.details || `HTTP ${response.status}`);
      }

      if (!data.roast) {
        throw new Error('No roast in response');
      }

      console.log("✅ AI Roast received:", data.roast);

      const aiMessage = {
        id: Date.now() + 1,
        text: data.roast,
        sender: 'ai',
        isFromAI: true // Mark as real AI response
      };

      setMessages(prev => [...prev, aiMessage]);
      setRoastCount(prev => prev + 1);

    } catch (error) {
      console.error("❌ Roast chat error:", error);
      setError(error.message);
      
      // Use fallback
      const aiMessage = {
        id: Date.now() + 1,
        text: getFallbackRoast(userInput),
        sender: 'ai',
        isFromAI: false // Mark as fallback
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
        alignItems: 'center'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '1.8rem' }}>🔥</span>
          <div>
            <h3 style={{ margin: '0', fontSize: '1.1rem', fontWeight: '900', letterSpacing: '3px' }}>
              ROAST ZONE
            </h3>
            <span style={{ fontSize: '0.65rem', color: '#FF6B6B' }}>
              💀 {roastCount} BURNS
            </span>
          </div>
        </div>
        
        <button
          onClick={onClose}
          style={{
            background: 'rgba(255,255,255,0.1)',
            border: 'none',
            color: 'white',
            fontSize: '1.2rem',
            cursor: 'pointer',
            width: '36px',
            height: '36px',
            borderRadius: '50%'
          }}
        >
          ×
        </button>
      </div>

      {/* Debug Banner - Remove in production */}
      {debugInfo && (
        <div style={{
          padding: '8px 15px',
          background: '#1a1a2e',
          borderBottom: '1px solid #333',
          color: '#00ff00',
          fontSize: '0.7rem',
          fontFamily: 'monospace'
        }}>
          <strong>DEBUG:</strong> Status: {debugInfo.status} | OK: {debugInfo.ok ? 'YES' : 'NO'} | 
          {debugInfo.data?.success ? ' ✅ AI Response' : ' ❌ Error: ' + (debugInfo.data?.error || 'Unknown')}
        </div>
      )}

      {/* Error Banner */}
      {error && (
        <div style={{
          padding: '10px 20px',
          background: 'rgba(255, 50, 50, 0.2)',
          borderBottom: '1px solid #ff4444',
          color: '#ff6b6b',
          fontSize: '0.8rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <span>⚠️ API Error: {error} (using fallback)</span>
          <button 
            onClick={() => setError(null)}
            style={{ background: 'none', border: 'none', color: '#ff6b6b', cursor: 'pointer' }}
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
        gap: '15px'
      }}>
        {messages.map((message) => (
          <div
            key={message.id}
            style={{
              alignSelf: message.sender === 'user' ? 'flex-end' : 'flex-start',
              maxWidth: '85%'
            }}
          >
            {/* Sender Label */}
            <div style={{
              fontSize: '0.68rem',
              color: message.sender === 'user' ? '#6B9FFF' : '#FF5C5C',
              marginBottom: '5px',
              textAlign: message.sender === 'user' ? 'right' : 'left'
            }}>
              {message.sender === 'user' ? 'YOU 🎤' : '💀 ROAST MASTER'}
              {message.isFromAI === false && message.sender === 'ai' && (
                <span style={{ color: '#FFD700', marginLeft: '8px' }}>(fallback)</span>
              )}
              {message.isFromAI === true && (
                <span style={{ color: '#00FF00', marginLeft: '8px' }}>✓ AI</span>
              )}
            </div>
            
            {/* Message Bubble */}
            <div style={{
              background: message.sender === 'user' 
                ? 'linear-gradient(135deg, #1a2a4a, #2a3a5a)' 
                : 'linear-gradient(135deg, #2a0a0a, #4a1515)',
              color: 'white',
              padding: '14px 18px',
              borderRadius: message.sender === 'user' ? '20px 5px 20px 20px' : '5px 20px 20px 20px',
              border: message.sender === 'ai' ? '1px solid rgba(255, 69, 0, 0.4)' : 'none'
            }}>
              <p style={{ margin: '0', fontSize: '1rem', lineHeight: '1.5', whiteSpace: 'pre-wrap' }}>
                {message.text}
              </p>
            </div>
          </div>
        ))}
        
        {/* Loading State */}
        {isLoading && (
          <div style={{ alignSelf: 'flex-start', maxWidth: '85%' }}>
            <div style={{
              fontSize: '0.68rem',
              color: '#FF5C5C',
              marginBottom: '5px'
            }}>
              💀 ROAST MASTER
            </div>
            <div style={{
              background: 'linear-gradient(135deg, #2a0a0a, #4a1515)',
              color: 'white',
              padding: '14px 18px',
              borderRadius: '5px 20px 20px 20px',
              border: '1px solid rgba(255, 69, 0, 0.4)'
            }}>
              <span>🔥🔥🔥 Crafting something brutal...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div style={{
        padding: '15px 20px',
        background: 'rgba(15, 10, 10, 0.98)',
        borderTop: '2px solid rgba(139, 0, 0, 0.6)'
      }}>
        <div style={{ display: 'flex', gap: '12px' }}>
          <textarea
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Talk shit and find out... 💀"
            style={{
              flex: '1',
              padding: '14px 18px',
              borderRadius: '25px',
              border: '2px solid rgba(139, 0, 0, 0.6)',
              background: 'rgba(25, 15, 15, 0.95)',
              color: 'white',
              fontSize: '1rem',
              outline: 'none',
              resize: 'none',
              height: '52px'
            }}
            disabled={isLoading}
          />
          <button
            onClick={sendMessage}
            disabled={isLoading || !inputValue.trim()}
            style={{
              padding: '14px 28px',
              background: isLoading || !inputValue.trim() 
                ? '#444' 
                : 'linear-gradient(135deg, #8B0000, #FF2200)',
              color: 'white',
              border: 'none',
              borderRadius: '25px',
              fontWeight: '800',
              cursor: isLoading || !inputValue.trim() ? 'not-allowed' : 'pointer'
            }}
          >
            {isLoading ? '🔥' : 'SEND IT'}
          </button>
        </div>
        
        <p style={{
          margin: '10px 0 0',
          fontSize: '0.7rem',
          color: 'rgba(255,255,255,0.4)',
          textAlign: 'center'
        }}>
          Press Enter to send • No limits. No mercy. 💀
        </p>
      </div>
    </div>
  );
};

export default RoastChat;
