# Resurse pentru învățarea limbii maghiare

O colecție curatoriată pentru vorbitorii de română care învață limba maghiară.

- [Deschide colecția](https://costinEEST.github.io/hungarian/)
- [Propune o resursă sau semnalează o problemă](https://github.com/costinEEST/hungarian/issues)

## Verificarea fișierelor audio

Pentru a descărca temporar un fișier audio și a-i inspecta formatul, durata,
rata de eșantionare și bitrate-ul:

```sh
./scripts/inspect-audio.sh 'https://example.com/pronuntie.mp3'
```

Scriptul necesită `curl` și `file`. Dacă `ffprobe` din pachetul FFmpeg este
instalat, afișează și metadatele audio detaliate. Fișierul temporar este șters
automat după verificare.

Pentru a verifica URL-urile audio folosite de pagina alfabetului:

```sh
node scripts/verify-audio.mjs
node scripts/verify-audio.mjs --word pálinka
```

Pentru a căuta o pronunție maghiară pe Wiktionary și transcodarea MP3 de pe
Wikimedia Commons, verifică mai întâi propunerea și apoi aplic-o explicit:

```sh
node scripts/upgrade-wiktionary-audio.mjs --word sör --include-external
node scripts/upgrade-wiktionary-audio.mjs --word sör --include-external --write
```

Fără `--word`, scriptul verifică toate intrările care încă folosesc DictZone.
În mod implicit nu înlocuiește înregistrările externe alese manual.
