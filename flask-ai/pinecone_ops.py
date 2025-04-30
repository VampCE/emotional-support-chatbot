from pinecone import Pinecone, ServerlessSpec

class PineconeOperations:
    def __init__(self, api_key: str = "pcsk_HZP1L_P2rF93f3ANk7E1TBWq93bUMJh8yJtmDhMeySwWDYgna7Kb6t38zvnXKiaRbPm8K", index_name: str = "ai-memory"):
        self.api_key = api_key
        self.index_name = index_name
        self.namespace = "user1"
        self.dimension = 384
        self.pc = Pinecone(api_key=self.api_key)

        if self.index_name not in self.pc.list_indexes().names():
            self.pc.create_index(
                name=self.index_name,
                dimension=self.dimension,
                metric="cosine",
                spec=ServerlessSpec(cloud="aws", region="us-east-1")
            )
        self.index = self.pc.Index(self.index_name)

    def upsert(self, vector_data):
        self.index.upsert(vectors=[vector_data], namespace=self.namespace)

