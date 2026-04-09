import urllib.request
langs = ["en", "zh", "hi", "es", "fr", "ar", "bn", "pt", "ru", "ur", "id", "de", "ja", "sw", "mr", "te", "tr", "ta", "ko", "vi"]
for l in langs:
    if l == "en": continue
    try:
        url = f"https://huggingface.co/Helsinki-NLP/opus-mt-en-{l}/resolve/main/config.json"
        urllib.request.urlopen(url)
        print(f'"{l}": "Helsinki-NLP/opus-mt-en-{l}",')
    except Exception as e:
        # try mul
        print(f'# {l} not found as direct, using en-mul or others')
