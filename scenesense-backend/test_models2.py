import urllib.request
pairs = [
    ("bn", "Helsinki-NLP/opus-mt-en-mul"),
    ("pt", "Helsinki-NLP/opus-mt-en-ROMANCE"),
    ("ja", "Helsinki-NLP/opus-mt-en-jap"),
    ("te", "Helsinki-NLP/opus-mt-en-mul"),
    ("tr", "Helsinki-NLP/opus-mt-tc-big-en-tr"),
    ("ta", "Helsinki-NLP/opus-mt-en-mul"),
    ("ko", "Helsinki-NLP/opus-mt-tc-big-en-ko"),
]
for l, m in pairs:
    url = f"https://huggingface.co/{m}/resolve/main/config.json"
    try:
        urllib.request.urlopen(url)
        print(f"FOUND: {l} -> {m}")
    except:
        pass
