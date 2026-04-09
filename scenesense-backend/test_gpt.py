from transformers import pipeline
import logging
logging.getLogger("transformers").setLevel(logging.ERROR)

generator = pipeline("text-generation", model="gpt2")
base = "a man riding a horse"

prompt_detailed = f"A very detailed and highly descriptive paragraph about {base}: The scene shows"
out_det = generator(prompt_detailed, max_new_tokens=50, num_return_sequences=1)[0]['generated_text']
print("DETAILED:", out_det)

prompt_story = f"Title: The Tale of {base.title()}\nOnce upon a time, there was a {base}. "
out_story = generator(prompt_story, max_new_tokens=100, num_return_sequences=1)[0]['generated_text']
print("STORY:", out_story)
