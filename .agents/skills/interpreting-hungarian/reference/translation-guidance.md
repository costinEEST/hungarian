<!-- Locally modified from forint573/interpreting-hungarian; see ../NOTICE. -->

# Interpreting Hungarian: English ↔ Hungarian translation

Two directions, one standard: output a native would write, never a word-for-word calque. **The body of this file governs English → Hungarian.** For **Hungarian → English**, the load-bearing rules are in the [Hungarian → English section](#hungarian--english) below, and `hungarian-to-english.md` holds the full system — read it before drafting in that direction.

English → Hungarian first. Hungarian organizes information around a pre-verbal focus position, drops what English makes explicit, conjugates verbs by the definiteness of their object, and glues onto the noun (as case suffixes) most of what English puts in front of it (as prepositions). A literal rendering looks grammatical but reads unmistakably foreign — Hungarian translation studies has a name for that failure mode: _kvázi-helyesség_, quasi-correct text where every sentence parses and the whole still sounds translated.

## Operating principle (read first)

You already translate English→Hungarian competently. Most sentences come out natural if you simply re-express the _meaning_ instead of the words. So:

- **Default to your own fluent Hungarian.** Do not mechanically run every rule below on every sentence — that produces over-corrected, stilted output (e.g. forcing focus-movement, a coverb, or a dative-possessor construction where the plain version was already idiomatic). Over-application is as much a failure as calquing.
- **Reach for the rules as a diagnostic** when the English structure is actively pulling you toward a calque: passives, dummy _it_, _there is/are_, rigid SVO order, trailing adverbials, phrasal verbs, -ing clauses, prepositions, English punctuation, or ambiguous register.
- **The self-check at the end is a safety net**, not a per-sentence checklist. Apply it when a draft sentence still "feels English-shaped."
- **Calibrate depth to the text.** For a multi-paragraph, literary, or stylistically demanding passage, settle the register, the te/ön map of every speaking pair, names, titles, and recurring terminology _before_ writing the first sentence. For a short everyday request, translate directly — deliberation there only produces over-corrected output; the only checks a one-liner needs are register and, if numbers appear, the _billió → milliárd_ scale. For a long or technical text, also lock terminology: the same source term gets the same translation every time — elegant variation on defined terms is an error.
- **The deepest tell of translated text is what's _missing_.** Corpus research on translated Hungarian (the unique-items hypothesis; on the Pannónia Corpus _szokott_ runs at roughly half its native frequency in translations) shows translations under-use the devices the source language gives no stimulus for — and over-use whatever has a direct English twin. So where one fits naturally, reach for the Hungarian-only inventory: _szokott_, coverb aspect, _-lak/-lek_, _hadd_, _tessék_, the dative possessor, the associative _-ék_, diminutives, discourse particles (_ugye, hát, ám, bezzeg, azért, is_). Never force one in; just stop the English from filtering them out.

### Route by text type

The reference files hold depth this file only sketches. Read the matching file **before drafting** whenever a row applies — not only when uncertain; the rules there are systematic, not stylistic taste:

| Text type                                                                               | Read first                | What it prevents                                                                                                                  |
| --------------------------------------------------------------------------------------- | ------------------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| **Hungarian → English, any text type**                                                  | `hungarian-to-english.md` | Hunglish word order, missing present perfect, missing articles and do-support, surname-first names, Hungarian punctuation residue |
| Fiction, poetry, drama, song lyrics, dialogue-heavy or voice-driven prose               | `literary-translation.md` | English quote-mark dialogue, tense backshift, wrong name/title handling, lost verse form, translationese                          |
| Software/UI strings, error messages, subtitles, marketing copy, official or legal prose | `domain-conventions.md`   | wrong register (te/ön), imperative buttons, subtitle limit violations, bureaucratese                                              |
| A full conjugation, case, or postposition paradigm is needed                            | `grammar-tables.md`       | guessed inflection                                                                                                                |
| Letters/emails, exhaustive false-friend or formatting lookup                            | `style-lexicon.md`        | wrong salutation, cognate traps                                                                                                   |

Everyday English → Hungarian prose — a plain email, a paragraph, a phrase — needs no reference file; this file is self-sufficient for it.

## Method

1. Read the whole passage for meaning, tone, register, intent, and text type; route per the table above.
2. Hold the meaning; drop the English wording.
3. Re-express in Hungarian — freely restructure, split, or merge sentences around topic–focus–verb.
4. Read your Hungarian aloud; fix anything a native would not say.

---

## Word order and information structure

Neutral sentences — no special emphasis — are often the _same_ order as English (subject–verb–object): _Éva szereti a virágokat._ (Eve likes the flowers.) · _Tamás eszi az almát._ (Tamás is eating the apple.) Don't reorder a sentence that is already neutral and natural. What breaks the English parallel:

**Trailing time/place adverbials.** English tacks them onto the end; Hungarian normally places them _before_ the verb (and time before place). This is the single most common calque.

- Peter saw a cat in the garden yesterday.
- calque: _Péter látott egy macskát a kertben tegnap._
- natural: **Péter tegnap a kertben látott egy macskát.**

**The pre-verbal focus slot.** Whatever is emphasized — the answer to an implicit _who/what/where?_, or an English _it was X that…_ cleft — moves into the slot **immediately before the verb**, and any coverb is pushed _after_ the verb. Hungarian has no _it_-cleft; don't translate "it was…that" literally.

- It was PÉTER who ate the apple. → **PÉTER ette meg az almát.** (neutral: _Péter megette az almát._)
- It was the BOOK I read (not the paper). → **A könyvet olvastam el.**

**"only" = csak, and it moves with its focus.** A _csak_-phrase is inherently focused: _csak_ stands directly before the word it restricts, and the whole phrase sits pre-verbally. English _only_ hugs the verb regardless of scope; Hungarian placement changes the meaning.

- Only I saw the film. → **Csak én láttam a filmet.** · I saw only the film. → **Csak a filmet láttam.** · I only _saw_ it (didn't buy it). → **Csak láttam.**

**Bare (article-less) object → S–O–V.** A non-specific object with no article often sits right before the verb and forms a unit with it: _Peter is writing a letter._ → **Péter levelet ír.** (vs. _Péter ír egy levelet_, which counts "a [single] letter").

**Quantifiers are not focus.** _minden_ (every), _mindenki_ (everyone), _mindig_ (always), _sok_ (many) sit pre-verbally but **keep the coverb attached** — unlike focus, they do not invert it.

- Everyone watched the film. → **Mindenki megnézte a filmet.** (not _…nézte meg…_)

**Questions take no do-support and no auxiliary inversion.**

- _Wh_-questions put the question word in the focus slot (coverb inverts): What is the boy eating? → **Mit eszik a fiú?** · Where are you going? → **Hová mész?**
- _Yes/no_ questions keep statement order, marked by intonation; in formal/embedded use, the enclitic **-e** on the verb = "whether/if": Is he reading? → **Olvas?** · I don't know if he's coming. → **Nem tudom, hogy jön-e.**

## Negation, and the particles _is_ / _sem_

- **_nem_** immediately precedes the verb (or the focus it negates) and, like focus, **pushes the coverb after the verb**: I didn't read it. → **Nem olvastam el.** (not _Nem elolvastam._)
- **Negative concord is obligatory** — the "double negative" is correct. An n-word (_senki_ nobody, _semmi_ nothing, _soha_ never, _sehol_ nowhere) **must** co-occur with _nem_/_sem_: Nobody helps me. → **Senki nem segít nekem.** / **Senki sem segít nekem.** · I see nothing. → **Nem látok semmit.**
- **_nem_ + 3rd-person _van_/_vannak_ merges into _nincs_ / _nincsenek_** (and _sincs_ under _sem_): There is no coffee. → **Nincs kávé.** (never _nem van_).
- The negative imperative uses **ne**, not _nem_: Don't go! → **Ne menj!**
- **_is_** ("too/also") is an enclitic that **hugs the word it adds**, never floating to the clause end like English — and unlike focus it does not detach the coverb: I saw Peter too. → **Pétert is láttam.** · Peter came too. → **Péter is eljött.** (not _…jött el_). · Me too. → **Én is.**
- Under negation, _is_ → **_sem_** ("either/neither"): I'm not coming either. → **Én sem jövök.** Scalar "even" = **még … is**: Even Peter came. → **Még Péter is eljött.**

## Drop what Hungarian does not need

- **Subject pronouns** — omit unless emphatic/contrastive: _It is raining._ → **Esik.** · _I love it._ → **Imádom.** · _She loves her job._ → **Szereti a munkáját.** (not _Ő szereti az ő munkáját_).
- **Copula _van/vannak_** — omit with predicate adjectives/nouns in the 3rd-person present: _The house is big._ → **A ház nagy.** (never _…nagy van._) But **keep it for location and existence**: _The cup is on the table._ → **A csésze az asztalon van.** And it is **never dropped in the future**: _He will be a doctor._ → **Orvos lesz.** (not _Ő fog orvos lenni_).
- **There is/are** → sentence-initial **Van/Vannak**, never _Ott van_: _There is a book on the table._ → **Van egy könyv az asztalon.**
- **Indefinite article _egy_** — drop far more often than English _a/an_, especially before a predicate noun/profession: _I am a doctor._ → **Orvos vagyok.** (not _Egy orvos vagyok._) _iOS is a popular platform._ → **Az iOS népszerű platform.** Keep _egy_ only when it genuinely means "one / a certain": _I saw only one man._ → **Csak egy embert láttam.**
- **Redundant possessives** — the possessive suffix already marks the owner: _I washed my hands._ → **Megmostam a kezem.** (not _az én kezeimet_).
- **English _some/any_ usually vanish** — they are grammar, not meaning: _Do you have any questions?_ → **Van kérdése?** · _Would you like some coffee?_ → **Kérsz kávét?** Translate them (_néhány, valamennyi, bármilyen_) only when the quantity or free choice is genuinely the point (_any of them_ → **bármelyik**).

## Definite vs. indefinite conjugation

Match the verb to the **grammatical form** of its object (not its meaning). This is one of the most audible non-native errors.

| Object is…                                                                                                                                                                                                                                  | Conjugation    | Example                                                                                                         |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------- | --------------------------------------------------------------------------------------------------------------- |
| absent, or indefinite: _egy_, bare noun/plural, _sok/néhány/két_, **minden + N**, _valamit/valakit_, _mit/kit_, _semmit/senkit_, **and 1st/2nd-person pronoun objects** (_engem, téged, minket, titeket_)                                   | **indefinite** | _Látok egy fát._ · _Fákat látok._ · _Mit látsz?_ · _Látok valamit._ · _Ismerek minden titkot._ · _Látsz engem._ |
| definite: _a/az_ + N, proper name, possessive-suffixed N, demonstrative (_ezt/azt a…_), 3rd-person pronoun (_őt, azt, őket_), reflexive (_magát_), _melyiket / mindegyiket / valamennyit / mind_, **a _hogy_-clause**, and **formal _önt_** | **definite**   | _Látom a fát._ · _Látom őt._ · _Ismerem a titkodat._ · _Melyiket kéred?_ · _Tudom, hogy jössz._ · _Látom Önt._  |

Cases a literal approach gets wrong:

- **1st/2nd-person object pronouns take the _indefinite_ conjugation**, even though _me/you/us_ feel definite: _You see me._ → **Látsz engem.**
- **But "I → you" has its own special form, _-lak/-lek_** — extremely common: _I love you._ → **Szeretlek.** · _I'm waiting for you._ → **Várlak.** · past: _I saw you._ → **Láttalak.** Used only when the subject is _I_ and the object is _you_.
- **The quantifier trap:** _minden_ (every), _mindenki_ (everyone), _mindent_ (everything) take the **indefinite** conjugation — _I know everyone here._ → **Mindenkit ismerek.** (not _ismerem_) — whereas _mindegyik / valamennyi / mind / az összes_ (each/all) take the **definite**: _I'll take all of them._ → **Mindegyiket kérem.** A possessive suffix overrides this and forces **definite**: _I know your every secret._ → **Ismerem minden titkodat.**
- **Verbs of liking/knowing take a generic object with the definite article + definite conjugation**, where English uses a bare noun: _I like coffee._ → **Szeretem a kávét.** (not _Szeretek kávét._)

Full paradigms (present/past, definite/indefinite, _-lak/-lek_): see `grammar-tables.md`.

## Coverbs and aspect

Coverbs (_igekötők_: _meg, el, fel, le, be, ki, át, oda, vissza, rá, össze, szét_…) carry **direction** and **aspect**. A bare verb is imperfective/atelic (a process); a coverb usually makes it perfective/telic (completed, with a result). English often packs that completion into a particle ("eat **up**", "read **through**") or a result verb ("find", "kill") — Hungarian needs an explicit coverb, or it reads as unfinished.

| English (result/completion) | bare = wrong/atelic                   | native (coverb)              |
| --------------------------- | ------------------------------------- | ---------------------------- |
| I read the (whole) book.    | _Olvastam a könyvet._ ("was reading") | **Elolvastam a könyvet.**    |
| I ate the apple (up).       | _Ettem az almát._                     | **Megettem az almát.**       |
| I found my coat.            | _Találtam a kabátomat._ (stumbled on) | **Megtaláltam a kabátomat.** |
| I passed the exam.          | _Elmentem a vizsgán._ (= left)        | **Átmentem a vizsgán.**      |

Also turn phrasal verbs and idioms into coverb constructions, never word-for-word: _give up_ → **felad**; _look for_ → **keres**; _it's raining heavily_ → **szakad az eső**. The traffic runs the other way too — do not add coverbs English phrasal particles seem to license when the bare verb is the Hungarian word: _install the software_ → **telepíti a szoftvert** (not _feltelepíti_), _communicate_ → **közöl / megbeszél** (not _lekommunikál_).

**Placement carries aspect and is the load-bearing rule:** the coverb is **pre-verbal (attached)** in neutral affirmatives and plain yes/no questions, and **post-verbal (separated)** under negation, focus, _wh_-questions, and the imperative.

- I found it. → **Megtaláltam.** · I didn't find it. → **Nem találtam meg.** · Find it! → **Találd meg!**

## English passive → Hungarian active or resultative

Hungarian has no generalized syntactic passive. Choose by what the English passive actually describes:

- **An action or event** (something happened; the agent is unstated) → **3rd-person-plural active**:
  - Mistakes were made. → **Hibákat követtek el.**
  - The door was opened. → **Kinyitották az ajtót.**
  - The newspaper was already read. → **Az újságot már elolvasták.**
- **A resulting state** (English _is/are_ + participle, describing a condition) → the **_-va/-ve van_ resultative**, the closest Hungarian equivalent of the English passive:
  - The door is locked. → **Az ajtó be van zárva.**
  - The screen is broken. → **A képernyő be van törve.**

Note the contrast: _the door was opened_ (event) → **kinyitották**, but _the door is locked_ (state) → **be van zárva**. Cautions: _-va/-ve van_ only works with certain telic transitive verbs — when it sounds off, use the 3rd-plural active instead (_A könyvet megírták_, not _A könyv meg van írva_). Use a lexical middle/anticausative only where idiomatic (_eltörik_ — breaks, _elromlik_ — breaks down, _kinyílik_ — opens); don't manufacture _-ódik/-ődik_ forms as a generic passive. Avoid the archaic _-tatik/-tetik_ passive outside deliberately literary or legal text — and never render a passive with the bureaucratic **kerül**-periphrasis: _the event will be held_ → **megrendezik** (not _megrendezésre kerül_), _was created_ → **létrehozták / jött létre** (not _lett létrehozva_).

## Generic "you" and "one"

English generic _you_ is not _te_. Pick by nuance:

- **az ember** — the speaker generalizing lived experience: _You never know._ → **Az ember sosem tudhatja.**
- **3rd-person plural** — "people in general / they": _How do you say it in Hungarian?_ → **Hogy mondják magyarul?** · _They say it works._ → **Azt mondják, működik.**
- **lehet / kell + infinitive** — possibility/necessity for anyone: _You can see the mountains from here._ → **Innen látni lehet a hegyeket.** · _How do you pronounce this?_ → **Hogyan kell ezt kiejteni?**
- **1st-person plural** when the speaker is included: _You never know._ → **Sose tudhatjuk.**

A literal 2nd-person generic (_Sosem tudod…_) is colloquial-only and reads anglicized in neutral prose.

## English -ing forms

- **After verbs of liking/wanting/starting/knowing-how → infinitive:** _I like reading._ → **Szeretek olvasni.** (never _szeretek olvasást_).
- **As a full noun phrase — with an article, case suffix, or postposition → the -ás/-és noun:** _Smoking is harmful._ → **A dohányzás káros.** · _before leaving_ → **indulás előtt** · _without knocking_ → **kopogás nélkül**. A postposition can never govern an infinitive.
- **Bare-subject generalizations take either:** _Stealing is a crime._ → **Lopni bűn.** / **A lopás bűn.**
- **Participle clauses → a finite clause**, usually _miközben/amikor_ (time) or _mivel/mert_ (cause): _Walking home, he saw an old friend._ → **Miközben hazafelé sétált, meglátta egy régi barátját.** Reserve **-va/-ve** for manner accompanying the main verb (_She entered smiling._ → **Mosolyogva lépett be.**) and for states (**Az ajtó zárva van.**); it does not narrate events (_A macska fel van mászva a fára_ is comic), and **-ván/-vén** is archaic — only for deliberate period style.

## English prepositions → Hungarian case suffixes and postpositions

English uses separate words _before_ the noun (in, on, to, from, with, for); Hungarian uses **suffixes glued after** the noun, or **postpositions placed after** it. There is almost never a separate word for "in/on/to/from". Reaching for one is a major calque. Location is a **3×3 system**: interior / surface / proximity, each crossed with static / motion-to / motion-from.

|                                  | in/at (static) | to/into (motion to) | from (motion from) |
| -------------------------------- | -------------- | ------------------- | ------------------ |
| **interior** (inside)            | -ban/-ben      | -ba/-be             | -ból/-ből          |
| **surface** (on)                 | -on/-en/-ön    | -ra/-re             | -ról/-ről          |
| **proximity** (by / at a person) | -nál/-nél      | -hoz/-hez/-höz      | -tól/-től          |

Where Hungarian's choice **defies English intuition** (high-value traps):

- on the bus/train → **a buszon / a vonaton** (surface, not _-ban_); getting on → **felszállok a buszra**; getting off → **leszállok a buszról**.
- at the doctor's → **az orvosnál**; (going) to the doctor's → **az orvoshoz**; from the doctor's → **az orvostól** (a _person_ takes the proximity series).
- in the picture → **a képen**; at the university → **az egyetemen**; in the street → **az utcán** (surface).
- Hungarian towns and "Hungary" take the **surface** series — in/to/from Budapest → **Budapesten / Budapestre / Budapestről**; in Hungary → **Magyarországon** — but foreign places take **interior**: in London / in Germany → **Londonban / Németországban**.

Other high-frequency mappings: object **-t** (_almát_); "to/for" + possessor **-nak/-nek** (_Péternek_); "with / by (means)" **-val/-vel** (_késsel, vonattal_); "about (a topic)" **-ról/-ről** (_a háborúról_); "for the sake of" **-ért** (_pénzért_); "until/for (duration)" **-ig** (_hat óráig_); "as (in the role of)" **-ként** (_tanárként_); "at (clock time)" **-kor** (_ötkor_). Note "for" splits (**-ért** / **-nak,-nek** / verb-governed **-ra,-re**: _várok rád_), and "with" splits into instrumental **-val/-vel** vs. the postposition **együtt**.

**Postpositions follow the noun** (most take the bare nominative): _az asztal alatt_ (under the table), _a ház mögött_ (behind the house), _ebéd után_ (after lunch), _szerinted_ (according to you), _nélküled_ (without you). With a pronoun they take personal endings — **alattam** (under me), **szerintem** (in my opinion), **miatta** (because of it) — never _alatt én_.

**Demonstrative agreement** (very common error): in _this/that + noun_, the demonstrative takes the **same case** as the noun **and** the article _a/az_ stays between them. The _-z_ assimilates.

- in this house → **ebben a házban** (not _ez a házban_) · to that city → **abba a városba** · on this table → **ezen az asztalon** · about that film → **arról a filmről**.

**Time expressions** split four ways: clock time **-kor** (_ötkor_); days take superessive **-n** (_hétfőn_, _pénteken_; but _vasárnap_ bare); months/years take inessive (_januárban_, _2020-ban_); parts of day are bare adverbs (_reggel_, _este_).

The full case inventory, place-name rules, and complete postposition tables (directional triples, case-governing ones, personal forms): see `grammar-tables.md`.

## Tense, the future, and habits

Hungarian has only **past** and **present**. For the future, use the **present** for scheduled or certain events; reserve **fog + infinitive** for emphasis or uncertainty.

- I'll call you tomorrow. → **Holnap hívlak.** (present)
- It will probably rain. → **Valószínűleg esni fog.**

There is **no progressive aspect** — one present form covers "I read" and "I am reading"; mark ongoing action with **éppen/most** if needed: _I'm reading right now._ → **Éppen olvasok.** (never a _van_ + participle construction).

**English present perfect + for/since → Hungarian PRESENT.** A state that still holds stays in the present tense; the past tense silently changes the meaning to "no longer true":

- I've lived here for two years. → **Két éve itt lakom.** — _Két éve itt laktam_ means "I lived here two years **ago**."
- How long have you known him? → **Mióta ismered?** · She's been ill since Monday. → **Hétfő óta beteg.**
  (A completed-event perfect is ordinary past: _I've finished it._ → **Befejeztem.**)

**Habitual "usually" = szokott + infinitive** — past-tense in form, **present-habitual in meaning**: _I usually drink coffee in the morning._ → **Reggel kávét szoktam inni.** Do not read it as "used to". English **used to** = past tense + a past time adverb (_Régen minden nap edzettem._ — I used to work out every day), or _régen_ + _szokott_.

## Reported speech: no backshift, ever

Hungarian keeps the **tense of the original utterance**; only deictics shift (_ma → aznap_, _itt → ott_).

- He said he was tired. → **Azt mondta, hogy fáradt.** — \*Azt mondta, hogy fáradt **volt\*** asserts something else ("he said he **had been** tired").
- He said he would come. → **Azt mondta, hogy eljön / el fog jönni.** — _eljönne_ would make it conditional ("would come if he could").
- She asked where I worked. → **Azt kérdezte, hogy hol dolgozom.**

## Conditional, "if"-clauses, and English "would"

- Present conditional = **-na/-ne/-ná/-né** (1sg indefinite is always **-nék**, never _-nák_). Past conditional = **past tense + invariant _volna_**: I would have written. → **Írtam volna.**
- **_ha_ ("if") puts the conditional in BOTH clauses** (English uses past in the _if_-clause, conditional only in the main one):
  - If I had money, I'd buy a car. → **Ha lenne pénzem, vennék egy autót.** (not _Ha volt pénzem…_)
  - If I had had money, I'd have bought a car. → **Ha lett volna pénzem, vettem volna egy autót.**
- English "would" is often **not** the Hungarian conditional:
  - past habit ("we would go every summer" = used to) → **past tense** or _szokott_: **Nyaranta a tengerhez jártunk.**
  - reported speech ("he said he would come") → **present/future**, no backshift (see above).
  - polite "I would like" → fixed **szeretnék**: _I'd like a coffee._ → **Szeretnék egy kávét.**

## Imperative / subjunctive and "want someone to…"

The imperative and subjunctive share the **-j-** form. The coverb goes **after** the verb (_Ülj le!_ — Sit down!; _Ne ülj le!_ — Don't sit down!). The big structural pitfall: English "want/ask/tell someone **to** do X" is **not** an infinitive in Hungarian when the subjects differ — it is **azt + hogy + subjunctive**:

- I want you to go. → **Azt akarom, hogy menj.** (not _Akarlak menni_)
- Tell him to come. → **Mondd meg neki, hogy jöjjön.**

(When the subject is the _same_, the infinitive is correct: _I want to go._ → **El akarok menni.**) "Let me/him…" = **hadd** + subjunctive (_Hadd lássam!_); "let's…" = the 1st-person-plural form (_Menjünk!_). Assimilation and irregular imperatives: see `grammar-tables.md`.

## Modality (can / must / may / should / would like)

- **must / have to** = **kell** + **dative** + **inflected infinitive** (the infinitive itself takes a personal ending; _kell_ stays invariant): I have to go. → **(Nekem) el kell mennem.** · Ági has to go. → **Áginak el kell mennie.** · past: **El kellett mennem.**
- **should / ought to** = **kellene / kéne** (+ inflected infinitive): You should study. → **Tanulnod kellene.**
- The dative + inflected infinitive pattern extends beyond _kell_ to _nehéz, könnyű, sikerül, érdemes, muszáj_: It would be hard for an economist to answer this. → **Egy közgazdásznak nehéz lenne ezt megválaszolnia.** · I managed to open it. → **Sikerült kinyitnom.**
- English "can" splits: **tud** = learned ability / "know how" (_I can swim._ → **Tudok úszni.**); **-hat/-het** = possibility or **permission** (_May I sit down?_ → **Leülhetek?**, not _Tudok leülni?_); **képes** = capable of (_Képes vagyok rá._).
- **may / might / it's possible** → **-hat/-het** or **lehet (, hogy)**; **be allowed/forbidden** → **szabad / tilos** (_Szabad bejönni?_ · _Tilos dohányozni._).
- **"must not" ≠ "don't have to"** — English negates them alike; Hungarian splits them: _You must not smoke here._ → **Itt nem szabad dohányozni.** (prohibition) · _You don't have to come._ → **Nem kell eljönnöd.** (no obligation). Rendering _must not_ as _nem kell_ silently turns a ban into an option.

## The noun phrase

**Articles.** Hungarian uses the definite article _a/az_ where English drops "the", and drops _egy_ where English keeps "a":

- generic/abstract nouns take _a/az_: _I like music._ → **Szeretem a zenét.** · _Love is wonderful._ → **A szerelem csodálatos.**
- possessed nouns and body parts take _a/az_: _my book_ → **a könyvem**; _My head hurts._ → **Fáj a fejem.**
- superlatives take _a/az_: _the best_ → **a legjobb**.
- a demonstrative requires the article: _this chair_ → **ez a szék** (not _ez szék_).
- rivers/lakes/mountains take it: **a Duna, a Balaton, a Kárpátok**; most countries/towns/people do **not**: _Magyarország, Budapest, Károly_ — but plural/compound country names do: **az Egyesült Államok, a Cseh Köztársaság, a Fülöp-szigetek**.
- _a/az_ is chosen by **sound**, not spelling: _a ház_, _az alma_, _az USA_ (read with an initial vowel).

**Number.** After a numeral or quantifier the noun stays **singular** (the quantity is already marked): two cats → **két macska** (not _macskák_); many people → **sok ember**; every child → **minden gyerek**; both books → **mindkét könyv** (_mindkét_ included — never plural after it).

- **Paired body parts are singular**: _My eyes hurt._ → **Fáj a szemem.** One of the pair = **fél**: _with one eye_ → **fél szemmel**; _one-eyed_ → **félszemű**.
- **Collective nouns take singular verbs**: _The police are investigating._ → **A rendőrség nyomoz.** (never plural agreement).
- **"One of the (most) X" = az egyik + leg- + singular**: _one of the best films_ → **az egyik legjobb film** (never plural; elevated variant: _egyike a legjobb filmeknek_).
- **"The Smiths" (the family) = the associative -ék**: **Smithék** · _at the Smiths'_ → **Smithéknél** · _my mum and them_ → **anyámék**. (Formal alternative: _a Smith család_.)
- **Countability mismatches**: English mass nouns are ordinary countable nouns in Hungarian — _a piece of advice_ → **egy tanács** (never _egy darab tanács_); _news_ → **hír / hírek** (_That's great news!_ → **Ez nagyszerű hír!**); _information_ → **információ(k)**; _furniture_ → **bútor(ok)**. Drop the English partitive scaffolding (_piece of, item of_) entirely.

**Adjectives.** An attributive adjective (before the noun) does **not** agree; a predicative one (after "to be") **does**: _red apples_ → **piros almák** (singular _piros_) but _The apples are red._ → **Az almák pirosak.** Adjectives from place names are lowercase: _budapesti, vidéki_.

**Comparison.** Comparative = **-bb/-abb/-ebb**, superlative = **leg-** + comparative (with _a/az_): _faster_ → **gyorsabb**; _the fastest_ → **a leggyorsabb**. Irregulars: _jó→jobb, nagy→nagyobb, sok→több, kicsi→kisebb, szép→szebb_. "Than" = **-nál/-nél** _or_ **mint + nominative** (never accusative): _taller than me_ → **magasabb nálam** / **magasabb, mint én** (not _mint engem_). "As…as" = **olyan … mint**. Never calque "more X" as two words — it is one suffixed word (_szebb_, not _több szép_).

**Possession.** Possessor first, with the possessive suffix on the _possessed_ noun: _Peter's book_ → **Péter könyve**; _the window of the house_ → **a ház ablaka**. The emphatic/disambiguating form uses the **dative**: **Péternek a könyve** (obligatory with demonstratives: _annak a háznak az ablaka_).

**"Have"** — there is **no verb "to have"**. Possession = **dative possessor + _van/nincs_ + possessed noun with a possessive suffix**:

- I have a dog. → **Van egy kutyám.** · I have no money. → **Nincs pénzem.** · Peter has a car. → **Péternek van autója.** · I have friends. → **Vannak barátaim.**

**English noun strings.** Rebuild them; never stack spaced nouns. The workhorses: a solid compound (_climate conference_ → **klímakonferencia**), the **-i adjective + noun** pattern (_customer service department_ → **ügyfélszolgálati osztály**), or a possessive structure (_the head of the department_ → **az osztály vezetője**). Compounds are written **solid** (_ügyfélszolgálat_, not _ügyfél szolgálat_); the 6-syllable/3-element hyphen rule: `grammar-tables.md`.

**English right-branching → Hungarian left-branching.** English hangs modifiers _after_ the noun (relative clauses, participles, _of_-phrases); Hungarian builds them _before_ it with participial premodifiers: _the man standing at the door_ → **az ajtóban álló férfi**; _the report published last week_ → **a múlt héten közzétett jelentés**; _a solution acceptable to everyone_ → **egy mindenki számára elfogadható megoldás**. When the premodifier grows heavy (several clauses' worth), fall back to a relative clause (_a férfi, aki…_) — stacked left-branching modifiers are the tapeworm sentences of officialese.

Possessive suffix paradigms and the _-é_ form (_Ez a könyv Péteré._): see `grammar-tables.md`.

## Relative clauses: aki / amely / ami / amelyik

- **aki** for people; **amely** for things in formal writing; **ami** for things in neutral and spoken register — in dialogue _amely_ sounds starched. Companies and institutions are things: _the firm that…_ → **a cég, amely/ami…** (not _aki_).
- **ami is obligatory** when the antecedent is a whole clause or an unnamed pronoun: _He was late, which annoyed everyone._ → **Elkésett, ami mindenkit bosszantott.** (_amely_ here is an outright error) · _They do all they can._ → **Megtesznek mindent, amit csak tudnak.**
- **amelyik** picks one out of a known set: _the mug that's blue_ → **az a bögre, amelyik kék**.
- A comma always precedes the relative clause.

## Register: te / ön / maga / tetszik

Hungarian forces a formality choice English lacks. Keep it **consistent** across the whole text (pronouns, verbs, possessives, imperatives).

| Context                                         | Choice                                                                           | Verb agreement              |
| ----------------------------------------------- | -------------------------------------------------------------------------------- | --------------------------- |
| casual: friends, peers, children, family        | _te / ti_                                                                        | 2nd person                  |
| professional, public, formal — the safe default | _ön / önök_                                                                      | **3rd person** (_Ön tudja_) |
| _maga / maguk_                                  | **avoid in formal writing** — can sound cold or rude; never to an elder/superior | 3rd person                  |
| warm deference (to elders)                      | _tetszik_ + infinitive                                                           | _Hogy tetszik lenni?_       |

A formal pronoun therefore takes a 3rd-person verb: _You (formal) speak Hungarian._ → **Ön beszél magyarul.** (not _Ön beszélsz_). Soften commands to _ön_ with the conditional or _legyen szíves_: _Close the window._ → **Becsukná az ablakot?** / **Legyen szíves becsukni az ablakot.**

**Domain defaults** (full rules in `domain-conventions.md`): software UI, documentation, and official text → **ön or impersonal phrasing, never te** (exceptions: children's products, AI-assistant prompt templates); consumer marketing → **te** unless the brand or audience is conservative/B2B; fiction and subtitles → assign per relationship between the characters, and keep each pair's choice stable. When the register of a plain text is genuinely ambiguous, default to **ön/önök**. Greetings, sign-offs, and salutation punctuation: `style-lexicon.md`.

## Punctuation, capitalization, dates, and numbers

These are absent from English source text and are a major tell of machine translation. Apply them across the **entire output** — every sentence, not just the first occurrence. Leave code, URLs, and placeholders untouched.

- **Quotation marks:** Hungarian uses **„low-opening and high-closing”** — **„idézet”**, not English "…". Nested quotes use reversed guillemets: **„kint »bent« kint”**. In prose fiction, dialogue takes dashes instead — see the literary section below.
- **Dashes:** Hungarian does not use the em dash. Ranges take an **unspaced en dash** (_1995–2005_, _9–12. oldal_, _Budapest–Bécs_); the **spaced en dash** is the _gondolatjel_ (parenthetical dash, dialogue dash); approximate values take a plain hyphen (_egy-két nap_ — a day or two).
- **Decimal comma, space thousands:** `1,234.56` → **1 234,56**; percent attaches with **no space**: `3.5%` → **3,5%** (suffixed: _25%-os, 6%-kal_). Currency unit follows, after a space: **1 000 Ft**, **20 €**.
- **Dates are descending with periods:** _June 13, 2026_ → **2026. június 13.** (lowercase month, trailing period). "On [date]" attaches a suffix and drops the period: **2026. június 13-án**; "on the 1st" → **1-jén**. No period in possessive/postpositional year phrases: **2026 októberében**, **2026 óta**. Decades: **a ’90-es évek**.
- **Capitalization is far lighter than English** — lowercase for months, days, languages, nationalities, holidays, and "I": _I speak English and German._ → **Beszélek angolul és németül.** Headings and titles use sentence case: _Privacy Policy_ → **Adatvédelmi irányelvek**. In letters, the polite **Ön** is capitalized as a courtesy.
- **Commas:** always put a comma before **hogy** and before clause-introducers **aki/ami/amely/mert/ha/mint** (even where English omits it): _I think that it's good._ → **Azt gondolom, hogy jó.** Do **not** put a comma before **és/vagy** joining a simple list: **kenyér, tej és tojás**.
- **Suffix on a numeral/acronym/foreign word via a hyphen:** **5-kor** (at 5), **EU-ban** (in the EU), **20%-kal** (by 20%), **Windows-szal** (with Windows). The suffix matches the **pronounced** form, assimilation included: **1-gyel** (_eggyel_), **2-vel**, **100-zal** (_százzal_).
- **"Billion" = _milliárd_ (10⁹), not _billió_** (which is 10¹², i.e. "trillion") — a catastrophic error in finance: _$5 billion_ → **5 milliárd dollár**. Use the **24-hour clock** (_14.30_; colloquial _fél 8_ = 7:30).

Full formatting rules and worked examples: see `style-lexicon.md`.

## Vowel harmony

Every suffix must harmonize with its stem: back-vowel stems take back suffixes (_ház-ban_), front-vowel stems take front (_kert-ben_), with front-rounded variants where they exist (_-hoz / -hez / -höz_, _-on / -en / -ön_). The vowels _i, í, e, é_ are neutral — some stems containing only these still take **back** suffixes (_híd → hidak_, _férfi → férfiak_, _cél → célok_), so follow the attested form rather than guessing. Note also the **-val/-vel** assimilation: after a consonant the _v_ assimilates and the consonant doubles (_busz → busszal_, _kés → késsel_, _vonat → vonattal_). A single disharmonic suffix marks the text as non-native.

## False friends

| English             | wrong (what the cognate means)          | correct                        |
| ------------------- | --------------------------------------- | ------------------------------ |
| sympathetic         | _szimpatikus_ (likeable)                | **együttérző**                 |
| actually            | _aktuálisan_ (currently)                | **valójában / tulajdonképpen** |
| actual              | _aktuális_ (current, topical)           | **tényleges / valódi**         |
| eventually          | _eventuálisan_ (possibly, contingently) | **végül / végül is**           |
| sensitive           | _szenzitív_ is OK; beware _szenzibilis_ | **érzékeny**                   |
| sensible            | _szenzibilis_                           | **értelmes / ésszerű**         |
| realise             | _realizál_ (implement / book a profit)  | **rájön / felismer**           |
| novel (book)        | _novella_ (short story)                 | **regény**                     |
| concrete (material) | _konkrét_ (specific)                    | **beton**                      |
| map                 | _mappa_ (folder)                        | **térkép**                     |
| solid               | _szolid_ (modest, restrained)           | **szilárd / masszív**          |
| simple              | _szimpla_ (single, plain)               | **egyszerű**                   |
| receipt             | _recept_ (recipe)                       | **nyugta / blokk**             |
| sodium              | _szóda_ (soda water)                    | **nátrium**                    |
| **billion**         | _billió_ (= 10¹², trillion)             | **milliárd**                   |

Extended list (transparent/transzparens, massive/masszív, gimnázium, konfekció, etc.): see `style-lexicon.md`.

## One English verb, two Hungarian verbs

English collapses distinctions Hungarian keeps separate — pick by meaning, not by the dictionary's first entry:

- **know** = **tud** (facts, skills) vs **ismer** (people, places, works): _I know him._ → **Ismerem.** · _I know (that) he's here._ → **Tudom, hogy itt van.** · _I know Budapest well._ → **Jól ismerem Budapestet.**
- **like** = **tetszik** (spontaneous appeal — dative experiencer) vs **szeret** (habitual liking, love): _I like your dress._ → **Tetszik a ruhád.** (not _Szeretem a ruhádat_, which claims attachment) · _I like coffee._ → **Szeretem a kávét.**
- **stop** = **megáll** (halt) vs **abbahagy / leszokik** (cease an activity / quit a habit): _He stopped to smoke._ → **Megállt, hogy rágyújtson.** · _He stopped smoking._ → **Leszokott a dohányzásról.**
- **meet** = **találkozik** (encounter) vs **megismerkedik** (meet for the first time): _We met in 2010._ (first acquaintance) → **2010-ben ismerkedtünk meg.**
- **wear** — the native pattern is **rajta van**, not a verb: _She was wearing a red dress._ → **Piros ruha volt rajta.** (_viselt_ is formal/police-report register).
- **play** an instrument, sport, or game = a **denominal verb** (_-zik_ and kin), not _játszik + N_: _Do you play tennis?_ → **Teniszezel?** (not _Játszol teniszt?_) · _She plays the piano._ → **Zongorázik.** · _plays chess/football/the drums/the violin_ → **sakkozik / focizik / dobol / hegedül**. (_játszik_ survives in "play a game/match of": _játszottunk egy parti sakkot_.)

**Body-state and situation traps** — English _be + adjective_ is often a verb or a possessive construction in Hungarian:

- _I'm cold._ → **Fázom.** · _My feet are cold._ → **Fázik a lábam.** (never _Hideg vagyok_)
- _I'm hot._ → **Melegem van.** — never _Meleg vagyok_, which states sexual orientation, not temperature.
- _I'm late. / Sorry I'm late._ → **Elkéstem. / Bocsánat, hogy késtem.** (not _késő vagyok_ — _késő_ is the hour, not the person)
- _I'm hungry/thirsty/sleepy._ → **Éhes/szomjas/álmos vagyok.** (these three are adjectives — the trap is assuming the pattern generalizes)
- _It's cold (in here)._ → **Hideg van (idebent).** — weather/ambient states take **van**.

## Light-verb collocations and calqued clichés

English "make/take/do + noun" rarely maps to _csinál_. Use the Hungarian light verb:

- make a decision → **döntést hoz** / **dönt** (not _döntést csinál_)
- take a photo → **fényképet készít** / **fotót csinál** (not _fotót vesz_)
- make a mistake → **hibát követ el** · ask a question → **kérdést tesz fel** · make a promise → **ígéretet tesz**
- spend time → **időt tölt** (but spend money → **pénzt költ**) · make sense → **van értelme** (not _értelmet csinál_)

And fixed social formulas, not literal calques: _Have a nice day!_ → **Szép napot (kívánok)!** · _Please find attached…_ → **Mellékelten küldöm…** · _I look forward to your reply._ → **Várom a válaszát.** · _Feel free to call me._ → **Hívj nyugodtan! / Hívjon nyugodtan!** (never _érezd szabadnak magad…_) · _I'm so excited!_ → **Alig várom! / Már nagyon várom!** (_izgatott vagyok_ is the spreading anglicism) · _Enjoy!_ → **Jó szórakozást!** (meal: **Jó étvágyat!**) · _I forgot my umbrella at home._ → **Otthon hagytam az esernyőmet.** (Hungarian "leaves" things, it doesn't "forget" them somewhere) · _I can't help laughing._ → **Muszáj nevetnem. / Nem tudom megállni nevetés nélkül.** (the MT classic _nem tudok segíteni nevetve_ is the failure this whole skill exists to prevent).

## Literary and creative texts

Read `literary-translation.md` **before drafting** any fiction, poetry, drama, song lyrics, or voice-driven prose — it holds the műfordítás norms (Kosztolányi's tradition: the result must stand as Hungarian literature), the transfer-operation toolbox, and the translationese sweep. The five rules most often violated without it:

1. **Prose dialogue uses dashes, not quotation marks.** Every `"…," she said` becomes a new paragraph opened by a gondolatjel; the sentence-final period is dropped before the tag (but `?`/`!` are kept), and the tag runs lowercase:
   **– Szia – mondta Péter. – Gyere be!**
2. **No tense backshift** in narration or reported thought (see the reported-speech section) — English past-perfect chains collapse into the one Hungarian past, ordered by _mire_, _miután_, _már_.
3. **Names stay foreign in adult fiction** (Hans Castorp remains Hans Castorp); children's and fantasy literature Hungarianizes _speaking_ names creatively (the Micimackó–Roxfort tradition).
4. **Published Hungarian titles are obligatory** when referencing works: _A Gyűrűk Ura_, _Rómeó és Júlia_, _Rozsban a fogó_.
5. **Verse translates form too** — the Hungarian norm is _formahű_ (meter and rhyme both); song lyrics must stay singable.

## Hungarian → English

Read `hungarian-to-english.md` **before drafting** any Hungarian→English translation — it holds the direction-specific system (tense selection, articles, information structure, names, register compensation, punctuation, the Hunglish tell list). The six rules most often violated without it:

1. **Re-encode the word order, don't copy it.** English is rigid SVO — the English sentence often starts in the _middle_ of the Hungarian one. Hungarian pre-verbal focus → an English cleft, passive, or _only/even_: _PÉTER ette meg az almát._ → **It was Peter who ate the apple.** Trailing adverbials move back to the English end: _Péter tegnap a kertben látott egy macskát._ → **Peter saw a cat in the garden yesterday.**
2. **One Hungarian past fans out into four English pasts — and Hungarian present is often English present perfect.** _Már két éve itt lakom._ → **I've lived here for two years.** · _Megjött a vonat?_ → **Has the train arrived?** Reported speech **backshifts**: _Azt mondta, hogy fáradt._ → **He said he was tired.**
3. **Restore what Hungarian drops**: subjects and dummy subjects (_Esik._ → **It's raining.** · _Van egy könyv az asztalon._ → **There is a book on the table.**), objects encoded only in the definite conjugation (_Látom._ → **I can see it/him/her.**), articles (_Orvos vagyok._ → **I'm a doctor.**).
4. **English negation is single and questions need do-support.** _Senki nem segít._ → **Nobody helps.** (never _Nobody doesn't help_) · _Nem látok semmit._ → **I can't see anything.** · _Szereted a kávét?_ → **Do you like coffee?**
5. **Names flip to given-name-first**: _Nagy Éva_ → **Éva Nagy**; established English forms of historical figures are obligatory (_Liszt Ferenc_ → **Franz Liszt**).
6. **Convert punctuation and numbers to English conventions throughout**: „…” → "…", fiction dialogue dashes → quotation marks, decimal comma → point (_3,5%_ → _3.5%_), _2026. június 13._ → _13 June 2026_ / _June 13, 2026_, capitalize months, days, languages, nationalities, and _I_ — and _milliárd_ → **billion**, _billió_ → **trillion**.

## Output and scope in this repository

Follow the task and the repository workflow in ../SKILL.md. Translation advice
applies to the material being translated or reviewed, not every subsequent reply.
Keep Romanian explanations and bilingual tables when adapting learning resources.
Return only a translation when the user requests a standalone translation.
Preserve register and formatting as requested; preserve source quotations.

## Self-check (run when a sentence still feels English-shaped; HU→EN has its own list in `hungarian-to-english.md`)

1. Would a native say this, unprompted?
2. Removed unnecessary _azt / őt / egy / van_ and redundant pronouns/possessives? Generic "you" rendered with _az ember_ / 3rd-plural / _lehet_, not _te_?
3. Emphasized element immediately before the verb? Time/place adverbials moved off the end (time before place)? _csak_ directly before what it restricts?
4. Coverb in the right place — attached when neutral, **after the verb** under negation/focus/question/imperative — present where English implies completion (_megtaláltam_, not _találtam_), and absent where the bare verb is the word (_telepít_, not _feltelepít_)?
5. Conjugation correct for every verb — definite vs. indefinite (incl. _minden/mindenki_ → indefinite, _hogy_-clause → definite, 1st/2nd-person objects → indefinite, the I→you _-lak/-lek_)?
6. English prepositions rendered as the right **case suffix or postposition** (3×3 spatial series; _a buszon_, _az orvoshoz_), with demonstrative agreement (_ebben a házban_)?
7. English passives → 3rd-plural active (_kinyitották_), or _-va/-ve van_ where they describe a state (_be van zárva_) — and no _kerül_/_lett_ periphrasis?
8. -ing forms resolved — infinitive after verbs, _-ás/-és_ under articles/cases/postpositions, participle clauses as finite clauses?
9. "Have" as _van/nincs_ + dative + possessive suffix? Numerals + **singular** noun? Paired body parts singular (_fáj a szemem_)? Attributive adjective **not** pluralized? _az egyik legjobb film_ singular?
10. _ha_-clauses with the conditional in **both** clauses? "Want sy to…" as _hogy_ + subjunctive? "Must" as _kell_ + dative + inflected infinitive? Reported speech **not** backshifted? Present-perfect states in the **present** (_két éve itt lakom_)? _must not_ as **nem szabad**, not _nem kell_?
11. Relative pronouns right — _aki_ people, _ami_ after whole clauses (obligatory), _amely_ only in formal writing?
12. Register (te/ön) consistent, appropriate to the domain, with 3rd-person verbs for _ön_?
13. Hungarian punctuation applied to the whole text — „quotation marks” (or dialogue dashes in fiction), decimal comma, **3,5%**, **2026. június 13.**, unspaced en-dash ranges, lowercase months/days/nationalities, comma before _hogy_, _billion → milliárd_?
14. Vowel harmony correct on every suffix?
