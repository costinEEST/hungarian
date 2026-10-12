# Magyar Ábécé pentru vorbitori de română

Fișă interactivă pentru învățarea alfabetului și pronunției maghiare, creată
special pentru vorbitori de română.

## Deschide fișa

- [Deschide versiunea publicată](https://costinEEST.github.io/hungarian/)
- [Vezi fișierul sursă](./index.html)

## Conținut

- alfabetul maghiar complet și transcriere IPA;
- aproximări de pronunție pentru vorbitori de română;
- exemple și capcane frecvente, inclusiv diferența dintre `S` și `Sz`;
- perechi minimale pentru antrenarea auzului;
- 20 de carduri Anki și export CSV;
- înregistrări audio maghiare asociate resurselor DictZone și SZTAKI;
- aspect responsive, mod întunecat și versiune optimizată pentru imprimare;
- metadate SEO, Open Graph, Twitter Card și date structurate Schema.org.

## Pronunție

Butoanele de pronunție redau înregistrări MP3 maghiare oferite de
<a href="https://dictzone.com/romanian-hungarian-dictionary/" target="_blank" rel="noopener noreferrer">DictZone</a>
și
<a href="https://szotar.sztaki.hu/en/home" target="_blank" rel="noopener noreferrer">SZTAKI</a>.
Expresiile fără o înregistrare completă sunt împărțite în cuvinte, fiecare cu
propriul buton audio. Dacă DictZone nu oferă o înregistrare pentru un cuvânt,
acesta este afișat fără buton și este marcat ca indisponibil.

Implementarea nu mai folosește Web Speech API și nu depinde de vocile
sintetice instalate în browser sau în sistemul de operare.

## Scripturi pentru audio

Instrumentele folosite pentru construirea și verificarea listei de URL-uri
sunt păstrate în repository:

- [`scripts/collect-dictzone-audio.mjs`](./scripts/collect-dictzone-audio.mjs)
  extrage toate cuvintele din fișă, interoghează paginile DictZone și produce
  un obiect JSON cu URL-urile MP3. Pentru expresiile fără audio complet,
  scriptul caută automat și cuvintele componente.
- [`scripts/verify-dictzone-audio.mjs`](./scripts/verify-dictzone-audio.mjs)
  verifică dacă URL-urile din `DICTZONE_AUDIO` răspund cu un tip MIME audio.

Ambele scripturi folosesc doar funcționalități incluse în Node.js și introduc
pauze între cereri pentru a reduce riscul limitării de către DictZone.

Colectează toate URL-urile într-un fișier JSON:

```bash
node scripts/collect-dictzone-audio.mjs --output dictzone-audio.json
```

Testează colectarea pentru un singur cuvânt:

```bash
node scripts/collect-dictzone-audio.mjs --word csoki --delay 0
```

Verifică un URL din harta inclusă în pagină:

```bash
node scripts/verify-dictzone-audio.mjs --word csoki --delay 0
```

Pentru o verificare completă, rulează fără `--word`. DictZone poate limita
cererile repetate sau poate redirecționa temporar fișierele audio; în acest
caz mărește pauza, de exemplu cu `--delay 3000`.

## Utilizare locală

Poți deschide direct `index.html` într-un browser modern. Pentru un
server local simplu:

```bash
python3 -m http.server 8000
```

Apoi deschide `http://localhost:8000/`.

## Publicare cu GitHub Pages

1. Trimite fișierele pe ramura `main`.
2. În repository, deschide **Settings → Pages**.
3. La **Build and deployment**, selectează **Deploy from a branch**.
4. Selectează ramura `main`, directorul `/ (root)`, apoi **Save**.

După publicare, fișa va fi disponibilă la linkul „Deschide versiunea
publicată” de mai sus.

## Confidențialitate

Fișa nu folosește trackere. La apăsarea unui buton de pronunție, browserul
solicită fișierul MP3 corespunzător de la `dictzone.com`.
