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
- pronunție în browser pentru cuvintele și expresiile maghiare;
- selector global pentru vocile maghiare disponibile în browser;
- aspect responsive, mod întunecat și versiune optimizată pentru imprimare.

## Pronunție

Audio este generat local cu Web Speech API. Calitatea și numărul vocilor
maghiare depind de browser și de vocile instalate în sistemul de operare.
Pagina folosește exclusiv vocile marcate `hu` sau `hu-HU`, pentru a evita
pronunțarea textului maghiar cu o voce engleză.

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

Fișa nu folosește trackere și nu trimite textul către un serviciu audio
extern. Pronunția este gestionată de funcțiile audio oferite de browser și
de sistemul de operare.
