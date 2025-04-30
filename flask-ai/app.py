from flask import Flask, request, jsonify
from mistral_model import MistralModel
from memory_handler import MemoryHandler
from response_generator import ContextualResponder

PINECONE_API_KEY = "pcsk_HZP1L_P2rF93f3ANk7E1TBWq93bUMJh8yJtmDhMeySwWDYgna7Kb6t38zvnXKiaRbPm8K"
INDEX_NAME = "ai-memory"

# Initialize Flask app
app = Flask(__name__)

# Load Mistral model and initialize components
mistral = MistralModel()
responder = ContextualResponder(mistral.pipeline, PINECONE_API_KEY, INDEX_NAME)
memory = MemoryHandler(mistral.pipeline, PINECONE_API_KEY, INDEX_NAME, responder.short_memory)

@app.route("/chat", methods=["POST"])
def chat():
    data = request.get_json()
    if not data or "message" not in data or "user_id" not in data:
        return jsonify({"error": "Missing 'user_id' or 'message' in request"}), 400

    user_id = data["user_id"]
    message = data["message"]

    # Generate AI reply
    reply = responder.generate_reply(message)

    # Process and store in memory
    memory_response = memory.process_message(user_id, message)

    return jsonify({
        "reply": reply,
        "memory_saved": bool(memory_response)  # True if something important was saved
    })

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
