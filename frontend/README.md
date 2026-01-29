# AI-Powered Virtual Assistant

A full-stack AI chatbot application built with React frontend and Flask backend, featuring real-time NLP interaction using spaCy and HuggingFace transformers.

## 🚀 Features

- **Real-time Chat Interface**: Modern, responsive chat UI with typing indicators
- **Advanced NLP Processing**: Powered by spaCy and HuggingFace transformers
- **Intent Recognition**: Intelligent understanding of user queries
- **Entity Extraction**: Automatic extraction of important information from messages
- **Sentiment Analysis**: Real-time sentiment detection
- **Contextual Responses**: Smart response generation based on conversation context
- **RESTful API**: Clean backend architecture with Flask
- **Responsive Design**: Works seamlessly on desktop and mobile devices

## 🛠 Tech Stack

### Frontend
- **React 18.2+**: Modern React with hooks
- **Axios**: HTTP client for API communication
- **CSS3**: Custom styling with gradients and animations
- **Responsive Design**: Mobile-first approach

### Backend
- **Flask**: Lightweight Python web framework
- **spaCy**: Industrial-strength NLP library
- **HuggingFace Transformers**: State-of-the-art ML models
- **Flask-CORS**: Cross-origin resource sharing
- **RESTful API**: Clean API design

## 📁 Project Structure

```
ai-virtual-assistant/
├── backend/
│   ├── app.py                    # Main Flask application
│   ├── requirements.txt          # Python dependencies
│   ├── models/
│   │   └── nlp_processor.py     # NLP processing logic
│   └── utils/
│       └── response_generator.py # Response generation utilities
├── frontend/
│   ├── public/
│   │   └── index.html           # HTML template
│   ├── src/
│   │   ├── App.js               # Main React component
│   │   ├── index.js             # React entry point
│   │   ├── components/
│   │   │   ├── ChatInterface.js  # Main chat component
│   │   │   ├── MessageBubble.js  # Individual message component
│   │   │   └── TypingIndicator.js # Typing animation component
│   │   └── styles/
│   │       └── App.css          # Application styles
│   ├── package.json             # Node.js dependencies
│   └── package-lock.json        # Dependency lock file
└── README.md                    # Project documentation
```

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v14 or higher)
- **Python** (v3.8 or higher)
- **npm** or **yarn**

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Create a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install Python dependencies:
```bash
pip install -r requirements.txt
```

4. Download spaCy language model:
```bash
python -m spacy download en_core_web_sm
```

5. Start the Flask server:
```bash
python app.py
```

The backend will be running on `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install Node.js dependencies:
```bash
npm install
```

3. Start the React development server:
```bash
npm start
```

The frontend will be running on `http://localhost:3000`

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the backend directory:

```env
FLASK_ENV=development
FLASK_DEBUG=True
PORT=5000
HUGGINGFACE_API_KEY=your_huggingface_api_key_here
```

### API Endpoints

- `POST /api/chat` - Send message to the AI assistant
- `GET /api/health` - Health check endpoint

## 📡 API Usage

### Send Message
```bash
curl -X POST http://localhost:5000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "Hello, how are you?"}'
```

### Response Format
```json
{
  "response": "Hello! I'm doing well, thank you for asking. How can I help you today?",
  "intent": "greeting",
  "entities": [],
  "sentiment": {
    "label": "POSITIVE",
    "score": 0.9998
  },
  "processing_time": 0.15
}
```

## 🎨 Features in Detail

### Chat Interface
- Real-time messaging with smooth animations
- Typing indicators for better UX
- Auto-scrolling to latest messages
- Responsive design for all screen sizes

### NLP Processing
- **Intent Recognition**: Classifies user queries into categories
- **Named Entity Recognition**: Extracts people, places, organizations
- **Sentiment Analysis**: Determines emotional tone
- **Context Awareness**: Maintains conversation context

### Response Generation
- **Template-based responses**: For common queries
- **AI-generated responses**: Using HuggingFace models
- **Context-aware replies**: Based on conversation history
- **Fallback mechanisms**: Graceful handling of unknown queries

## 🚀 Deployment

### Local Development
1. Follow the setup instructions above
2. Both frontend and backend will run on localhost

### Production Deployment

#### Backend (Flask)
- Deploy to platforms like Heroku, Railway, or Render
- Set environment variables for production
- Use gunicorn for production WSGI server

#### Frontend (React)
- Build the production version: `npm run build`
- Deploy to platforms like Vercel, Netlify, or AWS S3
- Update API endpoints to point to production backend

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit changes: `git commit -am 'Add new feature'`
4. Push to branch: `git push origin feature-name`
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🔧 Troubleshooting

### Common Issues

1. **CORS Errors**: Ensure Flask-CORS is installed and configured
2. **Model Loading Issues**: Verify spaCy model is downloaded
3. **Port Conflicts**: Change ports in configuration if needed
4. **API Connection**: Check backend is running on correct port

### Performance Optimization

- Implement response caching
- Use lazy loading for NLP models
- Optimize bundle size with code splitting
- Add service worker for offline functionality

## 📊 Analytics & Monitoring

- Implement logging for chat interactions
- Monitor API response times
- Track user engagement metrics
- Set up error monitoring with Sentry

## 🛡 Security Considerations

- Input validation and sanitization
- Rate limiting for API endpoints
- Secure API key management
- Content filtering for inappropriate messages

## 📈 Future Enhancements

- Voice input/output capabilities
- Multi-language support
- Conversation history persistence
- Advanced AI model integration
- User authentication system
- Custom training data integration

---

**Built with ❤️ using React, Flask, spaCy, and HuggingFace**