import urllib.request
langs = ["en", "zh", "hi", "es", "fr", "ar", "bn", "pt", "ru", "ur", "id", "de", "ja", "sw", "mr", "te", "tr", "ta", "ko", "vi"]
for l in langs:
    if l == "en": continue
    # try opus-mt-en-XX
    url = f"https://huggingface.co/Helsinki-NLP/opus-mt-en-{l}/resolve/main/config.json"
    try:
        urllib.request.urlopen(url)
        print(f"{l}: Helsinki-NLP/opus-mt-en-{l}")
    except:
        # maybe mul?
        try:
            url_mul = f"https://huggingface.co/Helsinki-NLP/opus-mt-en-mul/resolve/main/config.json"
            print(f"{l}: Not found as standalone, maybe mul?")
        except:
            pass
