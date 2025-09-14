import sys
import re
import json
import requests
from flask import Flask, request, jsonify
from flask_cors import CORS 
from langchain_ollama import OllamaLLM
from langchain.prompts import PromptTemplate
from langchain.chains import LLMChain


app = Flask(__name__) 


CORS(app)


SYSTEM_PROMPT = """
<role>
You are an emotionally aware productivity assistant.
You receive two inputs:
1. User text (may be empty if only emotion is provided)
2. Emotion detected from facial expression (happy, sad, stressed, tired, neutral, etc.)

Your goals:
- Always respond empathetically and uniquely based on the specific emotion.
- Provide varied, personalized responses - never repeat the same response.
- Suggest useful actions or distractions by calling tools based on the emotion and context.
- Tools available: ["YouTube", "Notion", "Calendar"].

Emotion-specific guidance:
- For negative emotions (sad, angry, frustrated, tired, stressed, disgusted, anxious, etc.): 
  * Acknowledge and mention the specific negative emotion they're feeling (e.g., "I can see you're feeling sad...", "I notice you're stressed...")
  * Offer comfort and understanding that validates their specific emotional state
  * Suggest mood-lifting activities, relaxation, or gentle distractions tailored to that emotion
  * Use empathetic language that directly addresses their feelings
  * SPECIAL CASE - If emotion is "stressed": Always prioritize offering to create a Notion database to help organize and manage their work/tasks
  * Vary your suggestions: sometimes YouTube for entertainment, sometimes Notion for journaling thoughts, sometimes Calendar for planning self-care
- For positive emotions (happy, excited, motivated, content, joyful, etc.): 
  * Acknowledge and celebrate the specific positive emotion (e.g., "I love seeing you so happy!", "Your excitement is wonderful!", "I can feel your motivation!")
  * Focus on productivity, goal-setting, or maintaining momentum while in this positive state
  * Suggest capturing the moment, planning future activities, or leveraging this energy
  * Vary suggestions: YouTube for inspiring content, Notion for goal planning, Calendar for scheduling productive activities
- For neutral emotions: 
  * Acknowledge their neutral state (e.g., "I sense you're feeling neutral today...", "You seem calm and centered...")
  * Offer balanced, helpful suggestions based on what might be most beneficial
  * Ask gentle questions or suggest activities that could either energize or relax them
  * Vary suggestions based on context: YouTube for discovery, Notion for reflection, Calendar for organizing

CRITICAL: For EVERY emotion, always:
1. Mention the specific emotion by name in your response
2. Tailor your empathy and suggestions to that exact emotional state
3. Provide unique, varied tool suggestions appropriate to that emotion
4. Never give generic responses - make each response feel personally crafted for that specific emotion

IMPORTANT: Even if no user text is provided, give unique responses based on the specific emotion. Avoid generic responses.

Respond strictly in JSON with this format:
{
  "response": "empathetic and unique message tailored to the specific emotion",
  "action": "name_of_tool_or_none",
  "details": {
     ... parameters if tool is called ...
  }
}
</role>
"""

# =====================================================
# LLM Initialization
# =====================================================
model = OllamaLLM(
    model="llama3",
    base_url="http://localhost:11434",
    system=SYSTEM_PROMPT
)

prompt_template = PromptTemplate(
    input_variables=["user_text", "emotion"],
    template="""
User Input: {user_text}
Detected Emotion: {emotion}

Based on the emotion, determine if it's positive, negative, or neutral and respond accordingly:
- If emotion is negative (sad, angry, frustrated, tired, stressed, disgusted, anxious, etc.): Focus on mood-lifting, comfort, and gentle distractions
- If emotion is positive (happy, excited, motivated, content, joyful, etc.): Focus on productivity, maintaining momentum, or celebrating
- If emotion is neutral: Offer balanced, helpful suggestions

Assistant, respond ONLY in JSON and follow this schema exactly:
{{
  "response": "empathetic message to the user",
  "action": "YouTube | Notion | Calendar | none",
  "details": {{
      "query": "string if YouTube",
      "title": "string if Notion/Calendar",
      "date": "YYYY-MM-DD if Calendar",
      "time": "HH:MM if Calendar"
  }}
}}
"""
)

chain = LLMChain(llm=model, prompt=prompt_template)

# =====================================================
# JSON Extraction Helper
# =====================================================
def extract_json(response):
    """Extract JSON block from LLM response."""
    match = re.search(r"\{.*\}", response, re.DOTALL)
    if match:
        try:
            return json.loads(match.group(0))
        except json.JSONDecodeError:
            # Handle cases where the LLM produces slightly invalid JSON
            return {"response": "I had a thought, but it was a bit scrambled. Could you try again?", "action": "none", "details": {}}
    return {
        "response": response,
        "action": "none",
        "details": {}
    }

# =====================================================
# Dynamic Emotion Classification using TextBlob
# =====================================================
try:
    from textblob import TextBlob
    TEXTBLOB_AVAILABLE = True
except ImportError:
    TEXTBLOB_AVAILABLE = False
    print("TextBlob not available. Install with: pip install textblob")

def classify_emotion(emotion):
    """Dynamically classify emotion as positive, negative, or neutral using TextBlob sentiment analysis."""
    emotion = emotion.lower().strip()
    
    if TEXTBLOB_AVAILABLE:
        try:
            # Use TextBlob for sentiment analysis
            blob = TextBlob(emotion)
            polarity = blob.sentiment.polarity
            
            # Classify based on polarity score
            if polarity > 0.1:
                return 'positive'
            elif polarity < -0.1:
                return 'negative'
            else:
                return 'neutral'
                
        except Exception as e:
            print(f"TextBlob analysis failed: {e}")
            # Fallback to neutral if analysis fails
            return 'neutral'
    else:
        # Fallback: return neutral if TextBlob is not available
        return 'neutral'

# =====================================================
# Chatbot Logic
# =====================================================
def process_input(user_text, emotion):
    """Process user input + emotion through LLaMA3 or shortcut for negative no-text cases."""
    try:
        emotion_type = classify_emotion(emotion)
        
        # Case 1: If user gave no text & emotion is negative → Auto YouTube
        if not user_text and emotion_type == 'negative':
            return {
                "response": "I noticed you're not feeling great. Maybe a quick distraction could help lighten your mood!",
                "action": "YouTube",
                "details": {
                    "query": "funny videos to cheer up"
                }
            }

        # Case 2: Otherwise → Call LLaMA3
        response = chain.invoke({"user_text": user_text, "emotion": emotion})
        response_text = response["text"] if isinstance(response, dict) and "text" in response else str(response)
        return extract_json(response_text)

    except Exception as e:
        return {
            "response": f"Error processing request: {str(e)}",
            "action": "none",
            "details": {}
        }

# =====================================================
# Flask Endpoint
# =====================================================
@app.route('/chatbot', methods=['POST'])
def chatbot_endpoint():
    try:
        # Get JSON data from React frontend
        data = request.get_json()
        if not data or 'emotion' not in data:
            return jsonify({"error": "Invalid request: 'emotion' is required"}), 400

        user_text = data.get('user_text', '') # user_text is optional
        emotion = data['emotion'].lower()

        # Process input using existing chatbot logic
        result = process_input(user_text, emotion)
        
        # <-- FIX 4: The server's ONLY job is to return the Ollama response to the React app.
        # The React app will then handle sending the query to n8n. This removes the redundant call.

        # Log and return response to the React frontend
        app.logger.info(f"Sending response to client: {result}")
        return jsonify(result), 200

    except Exception as e:
        error_response = {"error": f"Server error: {str(e)}"}
        app.logger.error(f"Server error: {str(e)}")
        return jsonify(error_response), 500

# =====================================================
# Run Server
# =====================================================
if __name__ == "__main__": # <-- FIX 5: Corrected the __main_ typo
    app.run(host="0.0.0.0", port=5000, debug=True)