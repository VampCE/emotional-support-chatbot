from mistral_analysis import MistralAnalyzer
from embedder import Embedder
from pinecone_ops import PineconeOperations

class MemoryHandler:
    def __init__(self, pipeline, pinecone_api_key, index_name, short_memory):
        self.analyzer = MistralAnalyzer(pipeline,short_memory)
        self.embedder = Embedder()
        self.pinecone = PineconeOperations(pinecone_api_key, index_name)

    def process_message(self, user_id: str, message: str):
        vector_data = self.analyzer.analyze(user_id, message)
        if vector_data:
            vector_data["values"] = self.embedder.get_embedding(vector_data["metadata"]["original"])
            self.pinecone.upsert(vector_data)
            return f"Stored in memory: {vector_data['metadata']['summary']}"
        else:
            return "Message not stored; not relevant for long-term memory."
