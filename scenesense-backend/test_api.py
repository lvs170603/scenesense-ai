import requests
import time

url = "http://127.0.0.1:5000/translate"
text = "A beautiful sunset over the ocean."

langs = ["fr", "zh", "ja", "es", "ru"]

for lang in langs:
    print(f"\n--- Translating to {lang} ---")
    start = time.time()
    try:
        resp = requests.post(url, json={"text": text, "language": lang})
        print(resp.json())
        print(f"Time: {time.time()-start:.2f}s")
    except Exception as e:
        print(f"Error: {e}")
