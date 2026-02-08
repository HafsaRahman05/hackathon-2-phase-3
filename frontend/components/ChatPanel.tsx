/**
 * ChatPanel component - AI chatbot interface for natural language todo management.
 * Phase 3: AI-Driven Todo Chatbot with real-time task updates
 */
import { useState, useRef, useEffect, FormEvent } from 'react';
import { api, Task } from '../lib/api';
import { authClient } from '../lib/auth';

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
  const [tasks, setTasks] = useState<Task[]>([]); // Local task state
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

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

    const user = authClient.getUserFromToken();
    if (!user) {
      alert("Please login to use the chat");
      return;
    }

    const userMessage: Message = { role: 'user', content: input, timestamp: new Date() };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      let assistantResponse = "";
      const command = input.toLowerCase().trim();

      // -------------- BASIC COMMANDS -----------------
      if (command.startsWith("add ")) {
        // Add Task
        const title = input.slice(4).trim();
        const newTask = await api.createTask(user.id, { title });
        setTasks(prev => [...prev, newTask]); // Update local state
        assistantResponse = `✅ Task added: ${newTask.title}`;

      } else if (command.includes("list")) {
        // List Tasks
        if (tasks.length === 0) assistantResponse = "Your todo list is empty.";
        else assistantResponse = tasks
          .map(t => `- ${t.title} ${t.is_completed ? "(completed)" : ""}`)
          .join("\n");

      } else if (command.startsWith("complete ")) {
        // Complete Task
        const title = input.slice(9).trim();
        const task = tasks.find(t => t.title.toLowerCase() === title.toLowerCase());
        if (!task) assistantResponse = `❌ Task not found: ${title}`;
        else {
          const updatedTask = await api.toggleTaskCompletion(user.id, task.id, true);
          setTasks(prev => prev.map(t => t.id === task.id ? updatedTask : t));
          assistantResponse = `✅ Task completed: ${updatedTask.title}`;
        }

      } else if (command.startsWith("delete ")) {
        // Delete Task
        const title = input.slice(7).trim();
        const task = tasks.find(t => t.title.toLowerCase() === title.toLowerCase());
        if (!task) assistantResponse = `❌ Task not found: ${title}`;
        else {
          await api.deleteTask(user.id, task.id);
          setTasks(prev => prev.filter(t => t.id !== task.id));
          assistantResponse = `❌ Task deleted: ${task.title}`;
        }

      } else if (command.startsWith("update ")) {
        // Update Task
        // Example: "update buy milk to buy almond milk"
        const match = input.match(/^update (.+?) to (.+)$/i);
        if (!match) {
          assistantResponse = "❌ Invalid update command. Use: update <old title> to <new title>";
        } else {
          const oldTitle = match[1].trim();
          const newTitle = match[2].trim();
          const task = tasks.find(t => t.title.toLowerCase() === oldTitle.toLowerCase());
          if (!task) assistantResponse = `❌ Task not found: ${oldTitle}`;
          else {
            const updatedTask = await api.updateTask(user.id, task.id, { title: newTitle });
            setTasks(prev => prev.map(t => t.id === task.id ? updatedTask : t));
            assistantResponse = `✅ Task updated: ${oldTitle} → ${newTitle}`;
          }
        }

      } else {
        // Default: send to MCP AI server
        const response = await fetch(`${MCP_SERVER_URL}/api/chat`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
          body: JSON.stringify({ message: input })
        });
        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error || "Failed to get response");
        }
        const data = await response.json();
        assistantResponse = data.response;
      }

      const assistantMessage: Message = { role: 'assistant', content: assistantResponse, timestamp: new Date() };
      setMessages(prev => [...prev, assistantMessage]);

    } catch (err: any) {
      console.error(err);
      setMessages(prev => [...prev, { role: 'assistant', content: 'Error: ' + err.message, timestamp: new Date() }]);
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
      <div style={{ flex: 1, overflowY: 'auto', padding: '15px', backgroundColor: '#f9f9f9' }}>
        {messages.length === 0 ? (
          <div>
            <p style={{ marginBottom: '10px', color: '#666' }}>Try these commands:</p>
            {exampleCommands.map((cmd, idx) => (
              <div key={idx} onClick={() => handleExampleClick(cmd)} style={{
                padding: '8px 12px',
                marginBottom: '8px',
                backgroundColor: '#e3f2fd',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '13px',
                color: '#1976d2'
              }}>
                {cmd}
              </div>
            ))}
          </div>
        ) : (
          messages.map((msg, idx) => (
            <div key={idx} style={{
              marginBottom: '15px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: msg.role === 'user' ? 'flex-end' : 'flex-start'
            }}>
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
      <form onSubmit={sendMessage} style={{ padding: '15px', borderTop: '1px solid #ddd', backgroundColor: 'white' }}>
        <div style={{ display: 'flex', gap: '10px' }}>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a command..."
            disabled={loading}
            style={{ flex: 1, padding: '10px', fontSize: '14px', border: '1px solid #ddd', borderRadius: '4px' }}
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
