import json
import datetime


class MistralAnalyzer:
    def __init__(self, shared_pipeline, short_memory):
        self.chat = shared_pipeline
        self.short_memory = short_memory

    def analyze(self, user_id: str, message: str):
        # Son AI mesajını short term memory'den al
        last_ai_message = None
        for speaker, text in reversed(self.short_memory.history):
            if speaker == "AI":
                last_ai_message = text
                break
        # Promptu oluştur
        history = f"Previous AI message: \"{last_ai_message}\"\n" if last_ai_message else ""

        prompt = f"""[INST]
        You are an intelligent assistant for a chatbot, helping to decide whether user messages should be remembered for personalization.

        {history}
        Your tasks:
        - Analyze the user message carefully.
        - If it contains important personal information (emotions, preferences, goals or personal facts,), mark "important": true.
        - If the user is ASKING a question, WONDERING, GUESSING, JOKING, GREETING, or giving unrelated information, mark "important": false.
        MARK QUESTIONS AS IMPORT: FALSE.
        For "preference" category:
        - Use the user's actual sentiment when summarizing.
        - Example: if the user says "I like pizza", summary = "User likes pizza".
        - Example: if the user says "I hate tomatoes", summary = "User hates tomatoes".

        Respond ONLY with a JSON like this:

        {{
          "important": true/false,
          "category": "one of ['emotion', 'preference', 'personal_info', 'goal']",
          "summary": "short and factual summary"
        }}

        Message to analyze:
        "{message}"
        [/INST]
        """

        try:
            # Chat modelden yanıt al
            response = self.chat(prompt, max_new_tokens=256, do_sample=True, temperature=0.7, pad_token_id=self.chat.tokenizer.eos_token_id)[0]["generated_text"]
            text = response.split("[/INST]")[-1].strip()

            start_idx = text.find('{')
            end_idx = text.rfind('}') + 1
            json_text = text[start_idx:end_idx]
            timestamp = datetime.datetime.now().isoformat()
            response_data = json.loads(json_text)

            if response_data.get("important"):
                print(response_data["summary"])
                return {
                    "id": f"{user_id}_{timestamp}",
                    "values": None,
                    "metadata": {
                        "type": response_data["category"],
                        "summary": response_data["summary"],
                        "original": message,
                        "timestamp": datetime.datetime.now().isoformat()
                    }
                }
            else:
                return None

        except Exception as e:
            print("Error parsing Mistral response:", e)
            return None
