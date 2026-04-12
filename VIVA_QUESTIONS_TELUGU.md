# 🎓 SceneSense AI — Viva Questions & Answers (Roman Telugu)

Ee document lo mee project ki sambandhinchina most important viva questions ni simple Roman Telugu (English script lo Telugu) lo explain cheyadam jarigindi. Idhi meeku examiner ki confident ga answer cheyadaniki chala help avtundi.

---

### 📘 1. Basic Questions (Project gurinchi)

**Q1. SceneSense AI ante enti? Mee project gurinchi okka paragraph lo cheppandi.**
> **Answer:** "SceneSense AI anedi oka full-stack AI web application. Meeru oka image upload cheste, idi BLIP model use chesi automatic ga aa image ki caption generate chestundi. Aa tarvata Meta vaalla NLLB-200 model use chesi aa caption ni 20 languages lo translate chestundi. Finally, Microsoft Azure edge-tts use chesi translated text ni voice ga (audio format lo) marustundi. JWT tho secure login, inka MongoDB lo history tracking kooda unnayi."

**Q2. Mee project solve chestunna main problem enti?**
> **Answer:** "Present unna chala AI captioning tools only English lo matrame captions istayi. Idi vere language matlade vaallaki, inka visually impaired (kanti choopu leni vallaki) chala kastam. SceneSense AI ee problem ni solve cheyadaniki 20 languages lo captions inka voice output istundi. Deeni valla prapancham lo evaraina deenni easy ga use chesukovachu."

**Q3. Image captioning ante enti?**
> **Answer:** "Image captioning ante oka photo lo emi jarugutundo computer automatic ga ardham chesukuni, daanni oka text sentence roopam lo cheppadam. Deenilo Computer Vision (image ardham cheskovadam), inka NLP (sentence format cheyadam) rendu untayi. Example: Park lo kukkulu adukuntunte, 'a dog playing in a park' ani text generate chestundi."

**Q4. Mee project lo unna key features enti?**
> **Answer:** "1. AI Image Captioning (BLIP model). 2. 20 languages lo Translation (NLLB-200). 3. Azure Neural Voices tho Audio generation (edge-tts). 4. Secure Authentication (OTP + JWT). 5. MongoDB lo data save cheyadam (History). 6. Recent Generations side-panel ni chusi malli patha captions play chesukovadam."

**Q5. Frontend inka Backend ki em technologies use chesaru?**
> **Answer:** 
> **Frontend:** React.js, Vite, Tailwind CSS / Vanilla CSS, Framer Motion (animations ki), inka Axios.
> **Backend:** Python Flask, HuggingFace Transformers (BLIP, NLLB-200, GPT-2 models ki), edge-tts (voice ki), PyMongo (database connection ki), inka JWT.
> **Database:** MongoDB Atlas (Cloud).

**Q6. Database ga MongoDB enduku use chesaru? SQL (MySQL) enduku vadaledu?**
> **Answer:** "Maa data lo image name, caption, language, audio URL, time ivanni untayi — ivi documents laaga JSON format lo untayi. SQL lo fixed tables inka columns (schema) undali, kani MongoDB schema-less kabatti ee flexible data ki perfectly set avtundi. Inka cloud lo hosting chala easy."

**Q7. Voice generation (Text-to-Speech) enduku antha important mee project lo?**
> **Answer:** "Text chadavaleni vaallaki (visually impaired), leda chaduvukoni vaallaki ee voice feature chala help avtundi. Vaallaki ardham ayye native language lone voice vinipistundi kabatti accessibility chala perugutundi."

---

### 📗 2. Intermediate Questions (Working & Flow)

**Q8. Mee application yokka complete pipeline / workflow cheppandi.**
> **Answer:** "Total 5 steps untayi:
> 1. **Upload:** User image upload cheyyagane Flask backend file ni save chestundi. 
> 2. **Caption:** BLIP model image ni process chesi English caption istundi. 
> 3. **Translate:** NLLB-200 model aa English caption ni user select cheskunna language ki translate chestundi. 
> 4. **Voice:** edge-tts aa translated text ni Azure Neural voice roopam lo MP3 file ga save chestundi. 
> 5. **History & UI:** Ivi anni MongoDB history lo save avtayi, inka React UI lo display avtayi."

**Q9. Mee authentication (Login) workflow ela panichestundi?**
> **Answer:** "User signup ayinappudu password ni bcrypt tho hash chesi save chestamu, inka email ki OTP pampistamu. OTP verified ayyaka, user login avthadu. Login ayinappudu backend oka **JWT (JSON Web Token)** istundi. Frontend daanni localStorage lo save chesukuni prati request heading lo pampistundi. JWT valla server database nundi kakunda direct ga check chestundi (stateless auth)."

**Q10. History feature ela implement chesaru?**
> **Answer:** "Pipeline antha complete ayyaka, UI nundi oka POST request /history api ki veltundi. Andulo caption, translation, language inka audio link anni MongoDB 'history' collection lo insert avtayi. User history open chesinappudu backend reverse chronological order (latest first) lo sort chesi documents return chestundi."

**Q11. Simple, Detailed, Story modes madhya theda enti?**
> **Answer:** 
> - **Simple:** Only BLIP model run avtundi, oka chinnamata lo image gurinchi cheptundi. (Idi fastest).
> - **Detailed:** BLIP ichina caption ni tessukuni, **GPT-2** model daanni oka pedda descriptive paragraph laaga expand chestundi.
> - **Story:** GPT-2 model daannoka chinna katha (Once upon a time...) laaga marustundi.

**Q12. Flask lo CORS ni ela deal chesaru?**
> **Answer:** "React frontend port 5173 lo, Flask backend port 5000 lo run avtunnayi. So browser Same-Origin policy valla requests block chestundi. Daanni fix cheyadaniki `flask-cors` library use chesi backend lo allow origins pettaanu."

---

### 📕 3. Technical Questions (AI Models & Logic)

**Q13. BLIP model ela panichestundi?**
> **Answer:** "BLIP (Bootstrapping Language-Image Pre-training) lo rendu main parts untayi:
> 1. **Vision Transformer (ViT):** Idi image ni chusi, andulo unna objects, colours, features ni extract chestundi.
> 2. **Text Transformer (Decoder):** Idi aa features base chesukuni, word-by-word pedda caption ni generate chestundi."

**Q14. BLIP-base ki BLIP-large ki theda enti? Meeru edi use chesaru?**
> **Answer:** "BLIP-large lo parameters (~900M) ekkuva, so quality peddadi gani generate avvadaniki chala sepu (>10 secs) padutundi. BLIP-base (~220M parameters) chinnadi inka fast ga (1-2s) generate chestundi. Application fast ga undadaniki nenu 'base' version vaadanu."

**Q15. NLLB-200 model enti? Meeru Google Translate API enduku vadaledu?**
> **Answer:** "NLLB (No Language Left Behind) anedi Meta (Facebook) produce chesina pedda translation model. Idi 200 languages support chestundi. Google Translate aithe manam vadi API kontu dabbulu kattali. Kani NLLB completely free and open-source. Idi mana server lone run avtundi kabatti user data ekkadiki velladu (secure)."

**Q16. Greedy Decoding vs Beam Search ante enti?**
> **Answer:** "Model text generate chesetappudu Beam Search vadithe, adi multiple options ni try chesi best sentence istundi (chala slow). Ade Greedy Decoding (`num_beams=1`) vadithe, just next highest probability word ni tisukunta veltundi. Ee project lo nenu fast response kosam Greedy Decoding (num_beams=1, do_sample=False) vaadanu."

**Q17. edge-tts library enti? Traditional TTS ki deeniki theda enti?**
> **Answer:** "Normal TTS (like gTTS) chinna chinna pre-recorded sounds ni athikinchi (stitch chesi) robotic sound istundi. Kani edge-tts anedi Microsoft Azure Neural Voices ni use chestundi. Ivi deep learning models (AI) valla train ayinavi, so exact ga manushulu matladinatte natural accents, emotions tho output istundi."

**Q18. AI models ni loading problem (delay) lekunda ela handle chesaru?**
> **Answer:** "Nenu **Singleton + Lazy Loading** pattern use chesanu. Ante, server on avvagane heavy models load avvavu (server fast ga start avvalani). Oka user first time caption request chesinappudu matrame RAM loki load avtayi (`_load()` method). Aa tarvata yentha mandi requests pampina, already in-memory lo unna model ae fast ga execute chestundi."

**Q19. `torch.no_grad()` enduku vadutaru inference time lo?**
> **Answer:** "PyTorch lo models run chesinappudu, manam train cheyatledu kabatti (no backpropagation), gradients calculate cheyalsina avasaram ledu. `torch.no_grad()` use cheste, internal ga gradients block chesi RAM ni save chestundi, inka process ni 20-30% fast chestundi."

**Q20. NLLB ki exactly aa language lo translate cheyyali ani ela thelustundi?**
> **Answer:** "Manam Model generator ki oka `forced_bos_token_id` (Beginning Of Sentence) isthamu. Example ki French aithe 'fra_Latn' ane code istamu. So adi sentence ni create chesetappudu start nundi a language ni force chestundi."

---

### 📙 4. Advanced & Tricky Questions

**A1. Ee application ni 1000 users oke sari vaadithe emavtundi? Scale ela chestaru?**
> **Answer:** "At present idi single backend kabatti, oke sari 1000 mandi vaste server hang avvachu (GPU bottlenecks). Deenni scale cheyadaniki:
> 1. AI inference models ni FastAPI leda Triton Server lo separate ga run chestanu.
> 2. Celery + Redis use chesi background tasks la queue pedthanu.
> 3. AWS leda GCP lo multiple Gunicorn workers tho load balancer pedthanu."

**A2. Security vulnerabilities emunnayi mee project lo?**
> **Answer:** "1. Frontend lo JWT token localStorage lo save chesanu (idi XSS ki vulnerable). Daanni 'HttpOnly Cookies' loki marchali. 2. API ki Rate-limiting (abuse prevemtion) ledu. Flask-Limiter pettali. 3. CORS ni strictly oka frontend domain ke restrict cheyyali."

**A3. Audio files ekkuva generate aipothi storage issue vasthundi ga, em chestaru?**
> **Answer:** "Chala audio files vaste storage full avtundi. Dani kosam:
> 1. MongoDB lo oka TTL (Time-To-Live) index create chesi, 7 or 30 days old aina data ni automatically delete cheyochu.
> 2. Inka cron-job rasukuni orphan audio files clean cheyyali, leda AWS S3 vadukovali."

**A4. 'Story' mode lo GPT-2 model harmful or bad content genterate chese chance undha?**
> **Answer:** "Avunu, GPT-2 open model kabatti unexpected content raneevachu. Daanni aapadaniki (AI Safety): prompt ki 'Write a child-safe story' ani strict ga specifies cheyyali, leda output ni vere toxicity classifier model nundi pass chesi return cheyyali."

**A5. `_get_collection()` lo prati request ki kotha MongoClient create avtundaa? Idi problem kuda?**
> **Answer:** "Avunu, function lopalane MongoClient() create chesthe adi oka connection-leak anti-pattern. Ee thappu jaragakunda undalante connection Object ni file baita (Global/Singleton) initialize cheskovali, apudu aa oke connection (pool) ni anni requests vadukuntayi."

---

### 🌟 Bonus: Confident One-Liner Answers

Idi examiner ki impression penchadaniki:

1. **Project motto cheppu?**
   > *"SceneSense AI makes visual content language-agnostic — yelaanti image ni aina 20 bashallo, natural voices tho andariki accessible ga cheyyadame ma main motto."*

2. **Model speed gurinchi adigithe:**
   > *"Nenu BLIP-Large nundi BLIP-Base ki, inka Beam-search nundi Greedy Decoding ki marchanu. Deenitho pedda accuracy loss lekundane, caption generate ayye time 15 seconds nundi just 2 seconds ki thaggindi!"*

3. **History sidebar UI gurinchi adigithe:**
   > *"History delete chesetappudu, optimistic UI implementation vaadanu. Ante Database lo delete avvadaniki mundhe, UI nundi ventane card ni theesestanu, so user ki lag feel kakunda chala smooth ga pedutundi."*
