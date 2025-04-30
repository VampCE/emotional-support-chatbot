from short_term_memory import ShortTermMemory
from semantic_search import SemanticSearch

class ContextualResponder:
    def __init__(self, shared_pipeline, pinecone_api_key, index_name):
        self.chat = shared_pipeline
        self.searcher = SemanticSearch(pinecone_api_key, index_name)
        self.short_memory = ShortTermMemory()

    def generate_reply(self, user_message: str, context_limit: int = 3) -> str:
        self.short_memory.add("User", user_message)

        context_items = self.searcher.query(user_message, top_k=context_limit)
        long_term_context = "\n".join([f"- {meta['summary']}" for _, meta in context_items])
        short_term_context = self.short_memory.get_context()
        print(long_term_context)
        prompt = f"""
        [INST] You are a friendly, empathetic AI assistant.
        User name is Eminenur.

        You remember recent and past conversations to reply meaningfully.

        Your reply goals:
        - Speak with SHORT sentences (maximum 1 or 2 lines each).
        - Use SIMPLE words. Avoid formal academic language.
        - Sound friendly and human, not like a robot.
        - Ask small follow-up questions to keep the conversation flowing.
        - Encourage and support the user gently.
        - Do not use big, complicated paragraphs.

        Here is the conversation:

        Short-Term Conversation:
        {short_term_context}

        Long-Term Memory:
        {long_term_context}
        Use long-term memory when you think it is relevant about conversation.
        Now respond naturally:
        AI:
        [/INST]
        """

        response = self.chat(prompt, max_new_tokens=200, do_sample=True, temperature=0.7,pad_token_id=self.chat.tokenizer.eos_token_id)[0]["generated_text"]
        reply = response.split("[/INST]")[-1].strip()

        self.short_memory.add("AI", reply)
        return reply
