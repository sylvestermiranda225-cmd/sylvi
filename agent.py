import os
import requests
from flask import Flask, request, jsonify
from flask_cors import CORS
import google.generativeai as genai

# ============================================================
# CONFIG (replace with your keys)
# ============================================================
# It's better to load keys from environment variables for security
GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY", "Your_key_here ")
YOUTUBE_API_KEY = os.environ.get("YOUTUBE_API_KEY", "Your_key_here ")
NOTION_API_KEY = os.environ.get("NOTION_API_KEY", "Your_key_here")
NOTION_DATABASE_ID = os.environ.get("NOTION_DATABASE_ID", "Your_key_here ")

# Configure Gemini
genai.configure(api_key=GEMINI_API_KEY)

app = Flask(__name__)

# Configure CORS more explicitly
CORS(app, resources={
    r"/*": {
        "origins": ["http://localhost:5173", "http://127.0.0.1:5173"],
        "methods": ["GET", "POST", "OPTIONS"],
        "allow_headers": ["Content-Type", "Authorization"]
    }
})

# ============================================================
# TOOLS (Functions the AI can call)
# ============================================================

def search_youtube(query: str, max_results: int = 3):
    """
    Searches YouTube for videos based on a query.

    Args:
        query: The search term for YouTube videos.
        max_results: The maximum number of video links to return.
    """
    print(f"Tool Called: search_youtube with query '{query}', max_results: {max_results} (type: {type(max_results)})")
    
    # Convert max_results to integer - this fixes the 5.0 issue
    try:
        max_results = int(max_results)
    except (ValueError, TypeError):
        max_results = 3
    
    # Ensure reasonable bounds
    max_results = max(1, min(max_results, 10))
    
    print(f"Converted max_results to: {max_results} (type: {type(max_results)})")
    
    url = "https://www.googleapis.com/youtube/v3/search"
    params = {
        "part": "snippet",
        "q": query,
        "type": "video", 
        "maxResults": max_results,  # Now guaranteed to be int
        "key": YOUTUBE_API_KEY
    }
    
    print(f"Final params being sent: {params}")
    
    try:
        resp = requests.get(url, params=params)
        print(f"Response status: {resp.status_code}")
        
        resp.raise_for_status()
        data = resp.json()

        if "items" not in data or not data["items"]:
            return f"No YouTube videos found for '{query}'."

        videos = []
        for i, item in enumerate(data["items"], 1):
            video_id = item['id']['videoId']
            title = item['snippet']['title']
            channel = item['snippet']['channelTitle']
            video_url = f"https://www.youtube.com/watch?v={video_id}"
            
            videos.append(f"{i}. {title}\n   Channel: {channel}\n   {video_url}")

        result = f"Here are {len(videos)} YouTube videos for '{query}':\n\n" + "\n\n".join(videos)
        print(f"Successfully found {len(videos)} videos")
        return result
        
    except requests.exceptions.RequestException as e:
        error_msg = f"Could not fetch YouTube results: {e}"
        print(f"YouTube API Error: {error_msg}")
        return error_msg


def create_notion_page(title: str, content: str):
    """
    Creates a new page with specified title and content in a Notion database.

    Args:
        title: The title of the new Notion page.
        content: The text content to be placed in the first paragraph of the page.
    """
    print(f"Tool Called: create_notion_page with title '{title}'")
    url = "https://api.notion.com/v1/pages"
    headers = {
        "Authorization": f"Bearer {NOTION_API_KEY}",
        "Content-Type": "application/json",
        "Notion-Version": "2022-06-28"
    }
    payload = {
        "parent": {"database_id": NOTION_DATABASE_ID},
        "properties": {"Name": {"title": [{"text": {"content": title}}]}},
        "children": [{
            "object": "block", "type": "paragraph",
            "paragraph": {"rich_text": [{"type": "text", "text": {"content": content}}]}
        }]
    }
    try:
        resp = requests.post(url, headers=headers, json=payload)
        resp.raise_for_status()
        page_url = resp.json().get("url", "N/A")
        return f"Successfully created the Notion page '{title}'. You can view it here: {page_url}"
    except requests.exceptions.RequestException as e:
        return f"Failed to create Notion page: {e}"

# ============================================================
# AI LOGIC (using Function Calling)
# ============================================================

# Define the tools for Gemini
tools = {
    "search_youtube": search_youtube,
    "create_notion_page": create_notion_page
}

def run_agent(query):
    """Uses Gemini with Function Calling to execute the correct tool."""
    print(f"Processing query: {query}")
    
    try:
        model = genai.GenerativeModel(
            model_name="gemini-1.5-flash",
            tools=list(tools.values())
        )
        
        chat = model.start_chat()
        response = chat.send_message(query)
        
        print(f"Gemini response received")
        
        # Check if the model decided to call a function
        if response.candidates and response.candidates[0].content.parts:
            part = response.candidates[0].content.parts[0]
            
            if hasattr(part, 'function_call') and part.function_call:
                function_call = part.function_call
                print(f"Function call detected: {function_call.name}")
                print(f"Function args: {dict(function_call.args)}")
                
                if function_call.name in tools:
                    # Get the arguments for the function call
                    args = {key: value for key, value in function_call.args.items()}
                    
                    # Call the corresponding Python function
                    tool_function = tools[function_call.name]
                    result = tool_function(**args)
                    return result
                else:
                    return f"Unknown function requested: {function_call.name}"
            else:
                # If no function was called, return the AI's text response
                print("No function call detected, returning text response")
                return response.text
        else:
            return "No response generated."

    except Exception as e:
        print(f"Error in run_agent: {e}")
        import traceback
        traceback.print_exc()
        return f"Error processing request: {str(e)}"

# ============================================================
# FLASK ROUTES
# ============================================================

@app.route("/", methods=["GET"])
def home():
    """Health check endpoint"""
    return jsonify({
        "status": "running",
        "message": "Flask server is running",
        "endpoints": ["/agent", "/debug/routes"]
    })

@app.route("/debug/routes", methods=["GET"])
def debug_routes():
    """Debug endpoint to show all available routes"""
    import urllib.parse
    output = []
    for rule in app.url_map.iter_rules():
        methods = ','.join(sorted(rule.methods))
        line = urllib.parse.unquote(f"{rule.endpoint:50s} {methods:20s} {rule}")
        output.append(line)
    
    return "<pre>" + "\n".join(sorted(output)) + "</pre>"

@app.route("/agent", methods=["GET", "POST", "OPTIONS"])
def agent():
    """Main agent endpoint"""
    
    # Handle preflight requests
    if request.method == "OPTIONS":
        print("Handling OPTIONS preflight request")
        return "", 200
    
    # Handle GET requests for testing
    if request.method == "GET":
        return jsonify({
            "message": "Agent endpoint is working. Send a POST request with JSON data.",
            "expected_format": {"query": "your question here"},
            "example": "curl -X POST http://localhost:5000/agent -H 'Content-Type: application/json' -d '{\"query\":\"find funny videos\"}'"
        })
    
    # Handle POST requests
    try:
        print(f"Received {request.method} request to /agent")
        print(f"Headers: {dict(request.headers)}")
        
        data = request.json
        print(f"Received data: {data}")
        
        if not data:
            return jsonify({"error": "No JSON data provided"}), 400
        
        # Handle both "query" and "emotion" fields
        query = data.get("query") or data.get("emotion")
        
        if not query:
            return jsonify({"error": "No query or emotion provided"}), 400

        print(f"Processing query: {query}")
        
        # Convert emotion to a meaningful query if needed
        if data.get("emotion") and not data.get("query"):
            query = f"I'm feeling {query}. Can you suggest some YouTube videos or create a note to help me?"
        
        # Run the agent logic
        result = run_agent(query)
        
        response_payload = {
            "isActionResponse": True,
            "ai_response": result
        }
        
        print(f"Sending response: {response_payload}")
        return jsonify(response_payload)
        
    except Exception as e:
        error_msg = f"Error in agent endpoint: {str(e)}"
        print(error_msg)
        import traceback
        traceback.print_exc()
        return jsonify({"error": error_msg}), 500

# Error handlers
@app.errorhandler(404)
def not_found(error):
    return jsonify({"error": "Endpoint not found"}), 404

@app.errorhandler(500)
def internal_error(error):
    return jsonify({"error": "Internal server error"}), 500

# ============================================================
# RUN SERVER
# ============================================================

if __name__ == "__main__":
    print("Starting Flask server...")
    print("Available endpoints:")
    print("  GET  /            - Health check")
    print("  POST /agent       - Main agent endpoint") 
    print("  GET  /agent       - Test endpoint info")
    print("  GET  /debug/routes - Show all routes")
    print(f"\nCORS enabled for http://localhost:5173")
    print(f"YouTube API Key: {YOUTUBE_API_KEY[:10]}...{YOUTUBE_API_KEY[-10:]}")
    print(f"Gemini API Key: {GEMINI_API_KEY[:10]}...{GEMINI_API_KEY[-10:]}")
    
    # Show all routes at startup
    print("\n=== Available Routes ===")
    for rule in app.url_map.iter_rules():
        methods = ','.join(sorted(rule.methods))
        print(f"{rule.endpoint:30s} {methods:20s} {rule}")
    print("========================\n")
    
    try:
        app.run(host="0.0.0.0", port=5000, debug=True)
    except Exception as e:
        print(f"Failed to start server: {e}")