import React, { useState, useEffect } from 'react';
import ChatInterface from './components/ChatInterface';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, Wifi, WifiOff, Settings, Moon, Sun, Minimize2, Maximize2 } from 'lucide-react';
import axios from 'axios';

const App = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [backendHealth, setBackendHealth] = useState(null);

  // Check backend connection on component mount
  useEffect(() => {
    checkBackendHealth();
    const interval = setInterval(checkBackendHealth, 30000); // Check every 30 seconds
    
    return () => clearInterval(interval);
  }, []);

  const checkBackendHealth = async () => {
    try {
      const response = await axios.get('/api/health', { timeout: 5000 });
      setBackendHealth(response.data);
      setIsConnected(true);
    } catch (error) {
      console.error('Backend health check failed:', error);
      setIsConnected(false);
      setBackendHealth(null);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    localStorage.setItem('darkMode', !darkMode);
  };

  const toggleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

  // Loading screen
  if (isLoading) {
    return (
      <div className="loading-screen">
        <motion.div 
          className="loading-content"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div 
            className="loading-icon"
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          >
            <Bot size={48} />
          </motion.div>
          <h2>AI Virtual Assistant</h2>
          <p>Initializing NLP models...</p>
          <div className="loading-bar">
            <motion.div 
              className="loading-progress"
              initial={{ width: 0 }}
              animate={{ width: "100%" }}
              transition={{ duration: 2, ease: "easeInOut" }}
            />
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className={`app ${darkMode ? 'dark' : 'light'}`}>
      <AnimatePresence>
        {!isMinimized && (
          <motion.div 
            className="app-container"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {/* Header */}
            <motion.header 
              className="app-header"
              initial={{ y: -50 }}
              animate={{ y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <div className="header-left">
                <div className="app-logo">
                  <Bot size={28} />
                </div>
                <div className="app-info">
                  <h1>AI Virtual Assistant</h1>
                  <div className="connection-status">
                    {isConnected ? (
                      <div className="status-connected">
                        <Wifi size={14} />
                        <span>Connected</span>
                      </div>
                    ) : (
                      <div className="status-disconnected">
                        <WifiOff size={14} />
                        <span>Disconnected</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="header-controls">
                <motion.button 
                  className="control-btn"
                  onClick={toggleDarkMode}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                >
                  {darkMode ? <Sun size={18} /> : <Moon size={18} />}
                </motion.button>
                
                <motion.button 
                  className="control-btn"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  title="Settings"
                >
                  <Settings size={18} />
                </motion.button>
                
                <motion.button 
                  className="control-btn"
                  onClick={toggleMinimize}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  title="Minimize"
                >
                  <Minimize2 size={18} />
                </motion.button>
              </div>
            </motion.header>

            {/* Main Content */}
            <main className="app-main">
              {isConnected ? (
                <ChatInterface 
                  darkMode={darkMode}
                  backendHealth={backendHealth}
                />
              ) : (
                <motion.div 
                  className="connection-error"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <WifiOff size={64} />
                  <h2>Connection Error</h2>
                  <p>Unable to connect to the AI backend service.</p>
                  <p>Please ensure the Flask server is running on port 5000.</p>
                  <motion.button 
                    className="retry-btn"
                    onClick={checkBackendHealth}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Retry Connection
                  </motion.button>
                </motion.div>
              )}
            </main>

            {/* Footer */}
            <motion.footer 
              className="app-footer"
              initial={{ y: 50 }}
              animate={{ y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              <div className="footer-content">
                <span>Powered by React, Flask, spaCy & HuggingFace</span>
                {backendHealth && (
                  <div className="model-status">
                    <span className={`model-indicator ${backendHealth.models_loaded?.spacy ? 'loaded' : 'error'}`}>
                      spaCy
                    </span>
                    <span className={`model-indicator ${backendHealth.models_loaded?.transformers ? 'loaded' : 'error'}`}>
                      Transformers
                    </span>
                    <span className={`model-indicator ${backendHealth.models_loaded?.nltk ? 'loaded' : 'error'}`}>
                      NLTK
                    </span>
                  </div>
                )}
              </div>
            </motion.footer>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Minimized View */}
      <AnimatePresence>
        {isMinimized && (
          <motion.div 
            className="minimized-view"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <motion.button 
              className="restore-btn"
              onClick={toggleMinimize}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Bot size={24} />
              <Maximize2 size={16} className="restore-icon" />
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default App;