/**
 * ChatPanel component - AI chatbot interface for natural language todo management.
 * Phase 3: AI-Driven Todo Chatbot
 */
import { useState, useRef, useEffect, FormEvent } from 'react';

const MCP_SERVER_URL = process.env.NEXT_PUBLIC_MCP_SERVER_URL || 'http://localhost:5000';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface ChatPanelProps {
  token: string | null;
}

export default function ChatPanel({ token }: ChatPanelProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Example commands to display
  const exampleCommands = [
    "add buy groceries",
    "list my todos",
    "complete buy groceries",
    "update buy milk to buy almond milk",
    "delete the groceries task"
  ];

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (e?: FormEvent) => {
    if (e) e.preventDefault();

    if (!input.trim() || loading) return;

    if (!token) {
      alert('Please login to use the chat');
      return;
    }

    const userMessage: Message = {
      role: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const response = await fetch(`${MCP_SERVER_URL}/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ message: input })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to get response');
      }

      const data = await response.json();

      const assistantMessage: Message = {
        role: 'assistant',
        content: data.response,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (err: any) {
      console.error('Chat error:', err);

      const errorMessage: Message = {
        role: 'assistant',
        content: err.message.includes('401')
          ? 'Session expired. Please login again.'
          : 'Unable to connect to AI service. Please try again.',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleExampleClick = (command: string) => {
    setInput(command);
  };

  return (
    <div style={{
      position: 'fixed',
      bottom: isOpen ? '0' : '-400px',
      right: '20px',
      width: '400px',
      height: '500px',
      backgroundColor: 'white',
      border: '1px solid #ccc',
      borderRadius: '8px 8px 0 0',
      boxShadow: '0 -2px 10px rgba(0,0,0,0.1)',
      display: 'flex',
      flexDirection: 'column',
      transition: 'bottom 0.3s ease',
      zIndex: 1000
    }}>
      {/* Header */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        style={{
          padding: '15px',
          backgroundColor: '#007bff',
          color: 'white',
          cursor: 'pointer',
          borderRadius: '8px 8px 0 0',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}
      >
        <strong>AI Todo Assistant</strong>
        <span style={{ fontSize: '20px' }}>{isOpen ? '▼' : '▲'}</span>
      </div>

      {/* Messages Area */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: '15px',
        backgroundColor: '#f9f9f9'
      }}>
        {messages.length === 0 ? (
          <div>
            <p style={{ marginBottom: '10px', color: '#666' }}>
              Try these commands:
            </p>
            {exampleCommands.map((cmd, idx) => (
              <div
                key={idx}
                onClick={() => handleExampleClick(cmd)}
                style={{
                  padding: '8px 12px',
                  marginBottom: '8px',
                  backgroundColor: '#e3f2fd',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '13px',
                  color: '#1976d2'
                }}
              >
                {cmd}
              </div>
            ))}
          </div>
        ) : (
          messages.map((msg, idx) => (
            <div
              key={idx}
              style={{
                marginBottom: '15px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: msg.role === 'user' ? 'flex-end' : 'flex-start'
              }}
            >
              <div style={{
                maxWidth: '80%',
                padding: '10px 15px',
                borderRadius: '8px',
                backgroundColor: msg.role === 'user' ? '#007bff' : '#e9ecef',
                color: msg.role === 'user' ? 'white' : '#333',
                fontSize: '14px',
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word'
              }}>
                {msg.content}
              </div>
              <div style={{
                fontSize: '11px',
                color: '#999',
                marginTop: '4px',
                paddingLeft: msg.role === 'user' ? '0' : '15px',
                paddingRight: msg.role === 'user' ? '15px' : '0'
              }}>
                {msg.timestamp.toLocaleTimeString()}
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <form onSubmit={sendMessage} style={{
        padding: '15px',
        borderTop: '1px solid #ddd',
        backgroundColor: 'white'
      }}>
        <div style={{ display: 'flex', gap: '10px' }}>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a command..."
            disabled={loading}
            style={{
              flex: 1,
              padding: '10px',
              fontSize: '14px',
              border: '1px solid #ddd',
              borderRadius: '4px'
            }}
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            style={{
              padding: '10px 20px',
              backgroundColor: loading ? '#ccc' : '#007bff',
              color: 'white',
              border: 'none',
              cursor: loading ? 'not-allowed' : 'pointer',
              borderRadius: '4px',
              fontSize: '14px'
            }}
          >
            {loading ? '...' : 'Send'}
          </button>
        </div>
      </form>
    </div>
  );
}
