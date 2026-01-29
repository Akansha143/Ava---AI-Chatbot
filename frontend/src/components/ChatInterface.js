import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import MessageBubble from './MessageBubble';
import TypingIndicator from './TypingIndicator';

const ChatInterface = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "🚀 Hello! I'm Claude, your AI assistant powered by advanced NLP models. I can help you with questions, text analysis, and much more. How can I assist you today?",
      sender: 'assistant',
      timestamp: new Date(),
      analysis: null
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [modelStatus, setModelStatus] = useState({
    spacy: false,
    transformers: false,
    nltk: false
  });
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Check connection and model status on mount
  useEffect(() => {
    checkConnection();
    checkModelStatus();
  }, []);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const checkConnection = async () => {
    try {
      const response = await axios.get('/api/health');
      setIsConnected(true);
      setError(null);
    } catch (error) {
      setIsConnected(false);
      setError('Unable to connect to AI backend. Please check if the server is running.');
    }
  };

  const checkModelStatus = async () => {
    try {
      const response = await axios.get('/api/models/status');
      setModelStatus({
        spacy: response.data.spacy,
        transformers: response.data.transformers,
        nltk: response.data.nltk
      });
    } catch (error) {
      console.error('Error checking model status:', error);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ 
      behavior: 'smooth',
      block: 'end'
    });
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isTyping) return;

    const userMessage = {
      id: Date.now(),
      text: inputMessage,
      sender: 'user',
      timestamp: new Date(),
      analysis: null
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);
    setError(null);

    try {
      // Add a small delay for better UX
      await new Promise(resolve => setTimeout(resolve, 500));

      const response = await axios.post('/api/chat', {
        message: inputMessage
      });

      const aiMessage = {
        id: Date.now() + 1,
        text: response.data.response,
        sender: 'assistant',
        timestamp: new Date(),
        analysis: response.data.analysis || null,
        processingTime: response.data.processing_time
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      
      let errorMessage = "I apologize, but I'm having trouble processing your message right now. ";
      
      if (error.response?.status === 500) {
        errorMessage += "There seems to be a server issue. Please try again in a moment.";
      } else if (error.code === 'ECONNABORTED' || error.code === 'NETWORK_ERROR') {
        errorMessage += "Please check your internet connection and try again.";
      } else {
        errorMessage += "Please try again or rephrase your question.";
      }

      const errorMsg = {
        id: Date.now() + 1,
        text: errorMessage,
        sender: 'assistant',
        timestamp: new Date(),
        analysis: null,
        isError: true
      };

      setMessages(prev => [...prev, errorMsg]);
      setError('Message failed to send. Please try again.');
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleClearChat = () => {
    setMessages([{
      id: 1,
      text: "🚀 Hello! I'm Claude, your AI assistant. How can I help you today?",
      sender: 'assistant',
      timestamp: new Date(),
      analysis: null
    }]);
    setError(null);
    
    // Clear backend conversation history
    axios.post('/api/conversation/clear').catch(console.error);
  };

  const handleRetryConnection = () => {
    setError(null);
    checkConnection();
    checkModelStatus();
  };

  const getCharacterCount = () => {
    return inputMessage.length;
  };

  const getPlaceholderText = () => {
    if (!isConnected) {
      return "Connecting to AI assistant...";
    }
    if (isTyping) {
      return "AI is thinking...";
    }
    return "Type your message...";
  };

  return (
    <div className="chat-container">
      {/* Floating Action Buttons */}
      <div className="floating-actions">
        <button 
          className="action-btn" 
          onClick={handleClearChat}
          title="Clear Chat"
        >
          🗑️
        </button>
        <button 
          className="action-btn" 
          onClick={handleRetryConnection}
          title="Retry Connection"
        >
          🔄
        </button>
      </div>

      {/* Header */}
      <div className="chat-header">
        <h1>AI Assistant</h1>
        <p>Powered by React, Flask, spaCy & HuggingFace</p>
        
        {/* Connection Status */}
        <div style={{ 
          marginTop: '12px', 
          display: 'flex', 
          justifyContent: 'center', 
          gap: '16px',
          fontSize: '14px'
        }}>
          <span style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '6px',
            opacity: isConnected ? 1 : 0.6
          }}>
            <div className={`status-dot ${isConnected ? 'active' : 'inactive'}`}></div>
            {isConnected ? 'Connected' : 'Disconnected'}
          </span>
        </div>
      </div>

      {/* Messages Container */}
      <div className="messages-container">
        {/* Error Banner */}
        {error && (
          <div className="error-message">
            <strong>⚠️ Error:</strong> {error}
            <button 
              onClick={() => setError(null)}
              style={{
                marginLeft: '12px',
                background: 'none',
                border: 'none',
                color: 'inherit',
                cursor: 'pointer',
                fontSize: '16px'
              }}
            >
              ✕
            </button>
          </div>
        )}

        {/* Messages */}
        {messages.map((message) => (
          <MessageBubble 
            key={message.id} 
            message={message} 
            showAnalysis={true}
          />
        ))}

        {/* Typing Indicator */}
        {isTyping && <TypingIndicator />}
        
        {/* Scroll anchor */}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Container */}
      <div className="input-container">
        <div className="input-wrapper">
          <input
            ref={inputRef}
            type="text"
            className="message-input"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={getPlaceholderText()}
            disabled={isTyping || !isConnected}
            maxLength={2000}
            autoFocus
          />
          <button
            className="send-button"
            onClick={handleSendMessage}
            disabled={!inputMessage.trim() || isTyping || !isConnected}
          >
            {isTyping ? (
              <span>⏳</span>
            ) : (
              <span>Send ✨</span>
            )}
          </button>
        </div>
        
        {/* Character Count & Model Status */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginTop: '12px',
          fontSize: '12px',
          color: 'rgba(255, 255, 255, 0.6)'
        }}>
          <div>
            {getCharacterCount()}/2000
          </div>
          
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <span style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '4px',
              opacity: modelStatus.spacy ? 1 : 0.4
            }}>
              <div className={`status-dot ${modelStatus.spacy ? 'active' : 'inactive'}`}></div>
              spaCy
            </span>
            <span style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '4px',
              opacity: modelStatus.transformers ? 1 : 0.4
            }}>
              <div className={`status-dot ${modelStatus.transformers ? 'active' : 'inactive'}`}></div>
              Transformers
            </span>
            <span style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '4px',
              opacity: modelStatus.nltk ? 1 : 0.4
            }}>
              <div className={`status-dot ${modelStatus.nltk ? 'active' : 'inactive'}`}></div>
              NLTK
            </span>
          </div>
        </div>
      </div>

      {/* Status Indicators */}
      <div className="status-indicators">
        <div className={`status-dot ${isConnected ? 'active' : 'inactive'}`}></div>
      </div>
    </div>
  );
};

export default ChatInterface;