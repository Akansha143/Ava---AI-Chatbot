import random
import logging
from datetime import datetime
import json

logger = logging.getLogger(__name__)

class ResponseGenerator:
    def __init__(self):
        self.conversation_history = []
        self.user_name = None
        self.context = {}
        
        # Define response templates based on intent
        self.intent_responses = {
            "greeting": [
                "Hello! I'm Claude, your AI assistant. How can I help you today?",
                "Hi there! I'm Claude, nice to meet you! What would you like to know?",
                "Hey! I'm Claude, your virtual assistant. What can I do for you?",
                "Hello! I'm Claude, an AI assistant here to help. What's on your mind?",
            ],
            "question": [
                "That's a great question! Let me help you with that.",
                "I'd be happy to answer that for you.",
                "Let me think about that and provide you with a helpful response.",
                "Interesting question! Here's what I can tell you:",
            ],
            "request_help": [
                "I'm here to help! I can assist with questions, analysis, explanations, and much more.",
                "Absolutely! I can help with a wide range of topics. What specific area would you like assistance with?",
                "Of course! I'm designed to help with various tasks. What do you need help with?",
            ],
            "weather": [
                "I don't have access to real-time weather data, but I'd recommend checking a weather app or website for current conditions.",
                "For accurate weather information, I'd suggest checking your local weather service or a weather app.",
            ],
            "time_date": [
                f"The current date and time is {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}.",
                f"Right now it's {datetime.now().strftime('%A, %B %d, %Y at %I:%M %p')}.",
            ],
            "goodbye": [
                "Goodbye! It was great chatting with you. Feel free to come back anytime!",
                "Take care! I'm here whenever you need assistance.",
                "See you later! Have a wonderful day!",
            ],
            "compliment": [
                "Thank you so much! I really appreciate your kind words. Is there anything else I can help you with?",
                "That's very kind of you to say! I'm glad I could be helpful.",
                "Thanks! I'm here to help whenever you need it.",
            ],
            "complaint": [
                "I apologize if I didn't meet your expectations. Could you tell me more about what went wrong so I can help better?",
                "I'm sorry about that. Let me try to help you in a different way. What specifically can I improve?",
            ]
        }
        
        # Fallback responses for unknown intents
        self.fallback_responses = [
            "I understand you're asking about {topic}. Could you provide more details so I can give you a better answer?",
            "That's interesting! Tell me more about what you'd like to know regarding {topic}.",
            "I'd like to help you with that. Could you rephrase your question or provide more context?",
            "I want to make sure I understand correctly. Are you asking about {topic}?",
        ]
        
        # Name-related responses
        self.name_responses = [
            "I'm Claude, an AI assistant created by Anthropic. I'm here to help you with questions and tasks!",
            "My name is Claude! I'm an AI assistant designed to be helpful, harmless, and honest.",
            "I'm Claude, your AI assistant. Nice to meet you! What's your name?",
            "You can call me Claude! I'm an AI created by Anthropic to assist and chat with people.",
        ]
    
    def generate_response(self, message, analysis_results=None):
        """Generate a contextual response based on message analysis"""
        try:
            # Store conversation
            self.conversation_history.append({
                "user_message": message,
                "timestamp": datetime.now().isoformat(),
                "analysis": analysis_results
            })
            
            # Extract analysis components
            if analysis_results:
                intent_data = analysis_results.get("intent", {})
                entities = analysis_results.get("entities", [])
                sentiment = analysis_results.get("sentiment", {})
                keywords = analysis_results.get("keywords", [])
                
                primary_intent = intent_data.get("primary", "general")
                sentiment_label = sentiment.get("sentiment", "neutral")
                
                # Handle specific intents
                response = self._handle_intent(primary_intent, message, entities, keywords)
                
                # Add sentiment-aware modification
                response = self._add_sentiment_context(response, sentiment_label)
                
                # Add entity context if relevant
                response = self._add_entity_context(response, entities)
                
            else:
                response = self._generate_fallback_response(message)
            
            return response
            
        except Exception as e:
            logger.error(f"Error generating response: {e}")
            return "I apologize, but I encountered an error processing your message. Could you please try again?"
    
    def _handle_intent(self, intent, message, entities, keywords):
        """Handle specific intents with appropriate responses"""
        
        # Check for name-related questions
        if self._is_asking_name(message):
            return random.choice(self.name_responses)
        
        # Check for specific question patterns
        if intent == "question":
            return self._handle_question(message, entities, keywords)
        
        # Handle other intents
        if intent in self.intent_responses:
            return random.choice(self.intent_responses[intent])
        
        # Generate contextual response for general intent
        return self._generate_contextual_response(message, keywords)
    
    def _is_asking_name(self, message):
        """Check if user is asking about the assistant's name"""
        name_patterns = [
            "what is your name", "what's your name", "who are you",
            "what are you called", "your name", "tell me your name"
        ]
        message_lower = message.lower()
        return any(pattern in message_lower for pattern in name_patterns)
    
    def _handle_question(self, message, entities, keywords):
        """Handle question-type messages more intelligently"""
        message_lower = message.lower()
        
        # Check for specific question types
        if any(word in message_lower for word in ["what", "who", "where", "when", "how", "why"]):
            if "time" in message_lower or "date" in message_lower:
                return f"The current date and time is {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}."
            
            elif "weather" in message_lower:
                return "I don't have access to real-time weather data, but I'd recommend checking a weather app for current conditions."
            
            elif self._is_asking_name(message):
                return random.choice(self.name_responses)
            
            elif "help" in message_lower or "do" in message_lower:
                return "I can help you with a wide variety of tasks including answering questions, providing explanations, analyzing text, having conversations, and much more! What would you like to explore?"
        
        # Extract topic from keywords
        if keywords:
            topic = keywords[0]["word"] if keywords else "that topic"
            return f"That's a great question about {topic}! Could you provide more specific details so I can give you the most helpful answer?"
        
        return "I'd be happy to help answer your question! Could you provide a bit more detail about what you'd like to know?"
    
    def _generate_contextual_response(self, message, keywords):
        """Generate a contextual response based on keywords"""
        if keywords and len(keywords) > 0:
            # Use the top keyword as topic
            topic = keywords[0]["word"]
            template = random.choice(self.fallback_responses)
            return template.format(topic=topic)
        
        return "I'd like to help you with that! Could you tell me more about what you're looking for?"
    
    def _add_sentiment_context(self, response, sentiment):
        """Modify response based on detected sentiment"""
        if sentiment == "negative":
            response = "I understand this might be frustrating. " + response
        elif sentiment == "positive":
            response = response + " I'm glad to help with this!"
        
        return response
    
    def _add_entity_context(self, response, entities):
        """Add context based on detected entities"""
        if entities:
            people = [e for e in entities if e["label"] in ["PERSON"]]
            places = [e for e in entities if e["label"] in ["GPE", "LOC"]]
            
            if people:
                response += f" I notice you mentioned {people[0]['text']}."
            elif places:
                response += f" I see you're asking about {places[0]['text']}."
        
        return response
    
    def _generate_fallback_response(self, message):
        """Generate fallback response when analysis is not available"""
        return "I understand you're asking something important. Could you help me understand better by providing more details or rephrasing your question?"
    
    def get_conversation_summary(self):
        """Get a summary of the conversation"""
        if not self.conversation_history:
            return "No conversation history available."
        
        message_count = len(self.conversation_history)
        recent_intents = []
        
        for entry in self.conversation_history[-5:]:  # Last 5 messages
            if entry.get("analysis") and entry["analysis"].get("intent"):
                recent_intents.append(entry["analysis"]["intent"]["primary"])
        
        return {
            "message_count": message_count,
            "recent_intents": recent_intents,
            "conversation_length": len(self.conversation_history)
        }
    
    def clear_history(self):
        """Clear conversation history"""
        self.conversation_history = []
        self.context = {}
        logger.info("Conversation history cleared")
    
    def set_user_name(self, name):
        """Set the user's name for personalization"""
        self.user_name = name
        logger.info(f"User name set to: {name}")
    
    def get_personalized_greeting(self):
        """Get a personalized greeting if user name is known"""
        if self.user_name:
            return f"Hello {self.user_name}! How can I help you today?"
        return "Hello! How can I assist you today?"