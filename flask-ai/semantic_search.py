from pinecone_ops import PineconeOperations
from embedder import Embedder
from typing import List, Tuple
import datetime

class SemanticSearch:
    def __init__(self, pinecone_api_key: str, index_name: str):
        self.embedder = Embedder()
        self.pinecone = PineconeOperations(pinecone_api_key, index_name)
        self.namespace = "user1"

    def query(self, query_text: str, top_k: int = 3) -> List[Tuple[str, dict]]:
        # Vektör embedding al
        query_embedding = self.embedder.get_embedding(query_text)

        # Pinecone üzerinden sorgu at
        response = self.pinecone.index.query(
            namespace=self.namespace,
            vector=query_embedding,
            top_k=top_k * 3,  # Daha fazla çekelim ki seçim yapabilelim
            include_metadata=True
        )

        temp_results = {}

        for match in response.matches:
            summary = match.metadata.get('summary', '')
            print("summary", summary)
            timestamp_str = match.metadata.get('timestamp', None)
            if timestamp_str:
                timestamp = datetime.datetime.fromisoformat(timestamp_str)
            else:
                timestamp = datetime.datetime.min  # timestamp yoksa en eski kabul et

            # Eğer aynı konu (aynı summary) zaten varsa karşılaştır
            if summary in temp_results:
                if timestamp > temp_results[summary]['timestamp']:
                    temp_results[summary] = {
                        "id": match.id,
                        "metadata": match.metadata,
                        "timestamp": timestamp
                    }
            else:
                temp_results[summary] = {
                    "id": match.id,
                    "metadata": match.metadata,
                    "timestamp": timestamp
                }

        # Seçilen güncel sonuçlardan top_k kadarını alalım
        final_results = list(temp_results.values())
        final_results.sort(key=lambda x: x['timestamp'], reverse=True)  # En yeni öncelikli

        return [(item['id'], item['metadata']) for item in final_results[:top_k]]
