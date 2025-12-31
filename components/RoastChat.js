import { useState, useEffect, useRef } from 'react';
import { OpenAI } from "openai";

const RoastChat = ({ subject, mood, initialRoast, onClose }) => {
  const [messages, setMessages] = useState([
    { id: 1, text: initialRoast || "Let's get roasted! Say something...", sender: 'ai' }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

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

    try {
      const HF_TOKEN = process.env.HF_TOKEN;
      const ROAST_MODEL = process.env.ROAST_MODEL || "meta-llama/Llama-3.3-70B-Instruct:groq";
      
      if (!HF_TOKEN) {
        throw new Error("API token not configured");
      }

      const client = new OpenAI({
        baseURL: "https://router.huggingface.co/v1",
        apiKey: HF_TOKEN,
      });

      // SIMPLIFIED PROMPT - NO JSON REQUIRED
      const chatCompletion = await client.chat.completions.create({
        model: ROAST_MODEL,
        messages: [
          {
            role: "system",
            content: `You are a brutally honest roaster. Rules:
1. Roast the user's message savagely
2. Use explicit language when appropriate
3. Be creative and witty, not just mean
4. Keep responses 2-3 lines max
5. Reference subject (${subject}) and mood (${mood}) when relevant
6. Make it personal and cutting`
          },
          {
            role: "user",
            content: `User says: "${userInput}". Roast them brutally:`
          }
        ],
        temperature: 0.95,
        max_tokens: 80
      });

      const content = chatCompletion.choices[0]?.message?.content;
      
      if (!content) {
        throw new Error("No response from AI");
      }

      const aiMessage = {
        id: Date.now() + 1,
        text: content.trim(),
        sender: 'ai'
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error("Roast chat error:", error);
      const errorMessage = {
        id: Date.now() + 1,
        text: getRandomRoast(),
        sender: 'ai'
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const getRandomRoast = () => {
    const roasts = [
      "Pathetic attempt. Try harder.",
      "Is that the best you can do?",
      "Weak sauce. Next!",
      "Not even worth roasting properly.",
      "Boring. Come back when you're interesting.",
      "This is why you're average.",
      "Do better or leave.",
      "That's your best shot? Sad.",
      "Even my disappointment is disappointed in you.",
      "Try again when you're not embarrassing yourself."
    ];
    return roasts[Math.floor(Math.random() * roasts.length)];
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
      background: 'rgba(0,0,0,0.95)',
      zIndex: '10000',
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* Header */}
      <div style={{
        padding: '15px 20px',
        background: 'linear-gradient(90deg, #8B0000, #FF0000)',
        color: 'white',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <h3 style={{ margin: '0', fontSize: '1.2rem' }}>🔥 ROAST CHAT 🔥</h3>
        <button
          onClick={onClose}
          style={{
            background: 'none',
            border: 'none',
            color: 'white',
            fontSize: '1.5rem',
            cursor: 'pointer'
          }}
        >
          ×
        </button>
      </div>

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
              maxWidth: '80%',
              background: message.sender === 'user' 
                ? 'linear-gradient(135deg, #1E90FF, #4169E1)' 
                : 'linear-gradient(135deg, #8B0000, #FF4500)',
              color: 'white',
              padding: '12px 16px',
              borderRadius: message.sender === 'user' ? '20px 5px 20px 20px' : '5px 20px 20px 20px',
              boxShadow: '0 4px 10px rgba(0,0,0,0.3)'
            }}
          >
            <p style={{ margin: '0', fontSize: '1rem', lineHeight: '1.4' }}>
              {message.text}
            </p>
          </div>
        ))}
        {isLoading && (
          <div style={{
            alignSelf: 'flex-start',
            background: 'linear-gradient(135deg, #8B0000, #FF4500)',
            color: 'white',
            padding: '12px 16px',
            borderRadius: '5px 20px 20px 20px',
            boxShadow: '0 4px 10px rgba(0,0,0,0.3)'
          }}>
            <p style={{ margin: '0', fontSize: '1rem' }}>
              🔥 Crafting roast...
            </p>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div style={{
        padding: '15px',
        background: 'rgba(20, 20, 20, 0.95)',
        borderTop: '1px solid #444'
      }}>
        <div style={{
          display: 'flex',
          gap: '10px'
        }}>
          <textarea
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Say something to get roasted..."
            style={{
              flex: '1',
              padding: '12px',
              borderRadius: '20px',
              border: '2px solid #8B0000',
              background: '#333',
              color: 'white',
              fontSize: '1rem',
              outline: 'none',
              resize: 'none',
              height: '50px'
            }}
            disabled={isLoading}
          />
          <button
            onClick={sendMessage}
            disabled={isLoading || !inputValue.trim()}
            style={{
              padding: '12px 20px',
              background: isLoading ? '#666' : 'linear-gradient(135deg, #8B0000, #FF0000)',
              color: 'white',
              border: 'none',
              borderRadius: '20px',
              fontWeight: '700',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              boxShadow: '0 4px 15px rgba(139, 0, 0, 0.4)'
            }}
          >
            {isLoading ? '🔥' : 'SEND'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default RoastChat;
