import React, { useState } from 'react';

const MessageBubble = ({ message, showAnalysis = false }) => {
  const [showDetails, setShowDetails] = useState(false);

  const formatTime = (timestamp) => {
    const now = new Date();
    const messageTime = new Date(timestamp);
    const diffInMinutes = Math.floor((now - messageTime) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return messageTime.toLocaleDateString();
  };

  const getSentimentEmoji = (sentiment) => {
    switch(sentiment) {
      case 'positive': return '😊';
      case 'negative': return '😔';
      case 'neutral': return '😐';
      default: return '🤖';
    }
  };

  const getIntentEmoji = (intent) => {
    switch(intent) {
      case 'greeting': return '👋';
      case 'question': return '❓';
      case 'request_help': return '🆘';
      case 'weather': return '🌤️';
      case 'time_date': return '⏰';
      case 'goodbye': return '👋';
      case 'compliment': return '👍';
      case 'complaint': return '😞';
      default: return '💬';
    }
  };

  const renderAnalysis = () => {
    if (!message.analysis || !showDetails) return null;

    const { intent, sentiment, entities, keywords, text_stats } = message.analysis;

    return (
      <div style={{
        marginTop: '12px',
        padding: '12px',
        background: 'rgba(255, 255, 255, 0.05)',
        borderRadius: '8px',
        fontSize: '12px',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        animation: 'fadeIn 0.3s ease-out'
      }}>
        <div style={{ display: 'grid', gap: '8px' }}>
          {intent && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span>{getIntentEmoji(intent.primary)}</span>
              <span style={{ opacity: 0.8 }}>Intent:</span>
              <span style={{ 
                background: 'rgba(124, 58, 237, 0.2)', 
                padding: '2px 8px', 
                borderRadius: '12px',
                color: '#a78bfa'
              }}>
                {intent.primary}
              </span>
              <span style={{ opacity: 0.6 }}>
                ({Math.round(intent.confidence * 100)}%)
              </span>
            </div>
          )}
          
          {sentiment && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span>{getSentimentEmoji(sentiment.sentiment)}</span>
              <span style={{ opacity: 0.8 }}>Sentiment:</span>
              <span style={{ 
                background: sentiment.sentiment === 'positive' ? 'rgba(34, 197, 94, 0.2)' : 
                           sentiment.sentiment === 'negative' ? 'rgba(239, 68, 68, 0.2)' : 
                           'rgba(107, 114, 128, 0.2)',
                padding: '2px 8px', 
                borderRadius: '12px',
                color: sentiment.sentiment === 'positive' ? '#4ade80' : 
                       sentiment.sentiment === 'negative' ? '#f87171' : '#9ca3af'
              }}>
                {sentiment.sentiment}
              </span>
              {sentiment.confidence && (
                <span style={{ opacity: 0.6 }}>
                  ({Math.round(sentiment.confidence * 100)}%)
                </span>
              )}
            </div>
          )}

          {entities && entities.length > 0 && (
            <div>
              <div style={{ opacity: 0.8, marginBottom: '4px' }}>🏷️ Entities:</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                {entities.slice(0, 3).map((entity, index) => (
                  <span key={index} style={{
                    background: 'rgba(236, 72, 153, 0.2)',
                    color: '#f472b6',
                    padding: '2px 6px',
                    borderRadius: '8px',
                    fontSize: '11px'
                  }}>
                    {entity.text} ({entity.label})
                  </span>
                ))}
              </div>
            </div>
          )}

          {keywords && keywords.length > 0 && (
            <div>
              <div style={{ opacity: 0.8, marginBottom: '4px' }}>🔑 Keywords:</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                {keywords.slice(0, 4).map((keyword, index) => (
                  <span key={index} style={{
                    background: 'rgba(20, 184, 166, 0.2)',
                    color: '#5eead4',
                    padding: '2px 6px',
                    borderRadius: '8px',
                    fontSize: '11px'
                  }}>
                    {keyword.word}
                  </span>
                ))}
              </div>
            </div>
          )}

          {text_stats && (
            <div style={{ display: 'flex', gap: '12px', opacity: 0.7, fontSize: '11px' }}>
              <span>📊 {text_stats.word_count} words</span>
              <span>📝 {text_stats.character_count} chars</span>
              <span>📄 {text_stats.sentence_count} sentences</span>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className={`message-bubble ${message.sender}`}>
      <div style={{ position: 'relative' }}>
        {/* Message Content */}
        <div style={{ marginBottom: '8px' }}>
          {message.text}
        </div>

        {/* Message Footer */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          opacity: 0.7,
          fontSize: '11px',
          marginTop: '8px'
        }}>
          <span>{formatTime(message.timestamp)}</span>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {message.processingTime && (
              <span>⚡ {message.processingTime}s</span>
            )}
            
            {message.analysis && showAnalysis && (
              <button
                onClick={() => setShowDetails(!showDetails)}
                style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '12px',
                  padding: '2px 8px',
                  color: 'inherit',
                  fontSize: '10px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
                onMouseOver={(e) => {
                  e.target.style.background = 'rgba(255, 255, 255, 0.2)';
                }}
                onMouseOut={(e) => {
                  e.target.style.background = 'rgba(255, 255, 255, 0.1)';
                }}
              >
                {showDetails ? '🔼 Hide' : '🔽 Analysis'}
              </button>
            )}
            
            {message.isError && (
              <span style={{ color: '#fca5a5' }}>❌</span>
            )}
          </div>
        </div>

        {/* Analysis Details */}
        {renderAnalysis()}
      </div>
    </div>
  );
};

export default MessageBubble;