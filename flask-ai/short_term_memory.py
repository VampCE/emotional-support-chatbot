from collections import deque

class ShortTermMemory:
    def __init__(self, max_turns: int = 6):
        self.history = deque(maxlen=max_turns)  # son n mesaj tutulur

    def add(self, speaker: str, text: str):
        self.history.append((speaker, text))

    def get_context(self) -> str:
        return "\n".join([f"{speaker}: {text}" for speaker, text in self.history])