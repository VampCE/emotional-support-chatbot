from transformers import AutoTokenizer, AutoModelForCausalLM, BitsAndBytesConfig, pipeline
import torch

class MistralModel:
    def __init__(self):
        local_path = "./models/Mistral-7B"

        bnb_config = BitsAndBytesConfig(
            load_in_4bit=True,
            bnb_4bit_use_double_quant=True,
            bnb_4bit_quant_type="nf4",
            bnb_4bit_compute_dtype=torch.float16
        )

        self.tokenizer = AutoTokenizer.from_pretrained(local_path, trust_remote_code=True)
        self.model = AutoModelForCausalLM.from_pretrained(
            local_path,
            trust_remote_code=True,
            device_map="auto",
        )

        self.pipeline = pipeline("text-generation", model=self.model, tokenizer=self.tokenizer, device_map="auto")
