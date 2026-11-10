# Arhitectura proiectului

## Fluxul de lucru

Proiectul folosește un build static bazat pe modulele standard Node.js. Paginile,
stilurile și scripturile sunt compuse din fișiere sursă, apoi scrise în `dist/`.
Browserul și serviciul de găzduire folosesc fișierele din `dist/`.

```text
src/pages ────────────┐
src/styles ───────────┤
src/scripts ──────────┼── scripts/lib/build.mjs ── dist/ ── browser / GitHub Pages
src/content/entries ──┤           ▲
public ──────────────┘           │
                                │ componente incluse la build
                  src/components, src/layouts,
                  src/features, src/shared, src/content
```

Codul se editează în `src/`, iar fișierele media în `public/`. Directorul `dist/`
este generat automat și nu se editează sau versionează.

## Organizarea surselor

| Director | Responsabilitate |
| --- | --- |
| `src/pages/` | Paginile și rutele site-ului |
| `src/layouts/` | Structura comună pentru articole și comunicate de presă |
| `src/components/` | Markup comun: header, meniu, footer |
| `src/features/` | Secțiuni și comportamente grupate după funcționalitate |
| `src/scripts/` | Scripturile publice asociate paginilor |
| `src/styles/` | Fișierele CSS asociate paginilor și ordinea stilurilor globale |
| `src/shared/scripts/` | Comportamente JavaScript reutilizabile |
| `src/shared/styles/` | Stiluri comune și secțiunile CSS global |
| `src/content/` | Cataloage, date pentru articole și conținut editorial |
| `public/` | Imagini, logo-uri, videoclipuri, PDF-uri și alte resurse statice |

### Pagini și rute

Calea relativă din `src/pages/` determină calea paginii publicate. De exemplu:

```text
src/pages/index.html                  → dist/index.html
src/pages/about/about.html            → dist/about/about.html
src/pages/projects/Adobe/adobe.html    → dist/projects/Adobe/adobe.html
```

Aceeași regulă se aplică fișierelor din `src/styles/`, `src/scripts/` și
`src/content/entries/`. Directoarele de intrare și extensiile publicate sunt
specificate în `config/build.json`.

### Componente și layouturi

Componentele comune se află în `src/components/`. Layouturile din `src/layouts/`
definesc structura unei familii de pagini și primesc parametri precum titlul,
limba sau calea către conținut.

O componentă poate avea variante pentru contexte diferite, precum pagini de
proiect, articole sau comunicate de presă. Folosește varianta corespunzătoare
paginii pe care o editezi.

### Funcționalități

Homepage-ul este organizat în `src/features/home/`:

- `sections/` — secțiunile HTML;
- `hero.js` — comportamentul zonei hero și al videoclipului;
- `projects-slider.js` — interacțiunile sliderului de proiecte;
- `deferred-images.js` — încărcarea imaginilor;
- `scroll-snap.js`, `reveal.js`, `menu.js` — scroll, apariția elementelor și meniu;
- `runtime.js` — compoziția scriptului paginii.

Formularul de contact este în `src/features/contact/form.js`. Comportamentele
comune paginilor de proiect sunt în `src/shared/scripts/projects/`: navigație,
lightbox, reveal și story lens. Parametrul `project` stabilește prefixul claselor
și identificatorilor utilizați de fiecare proiect.

### Stiluri

`src/styles/style.css` definește ordinea secțiunilor CSS global din
`src/shared/styles/site/`. Stilurile specifice paginilor se găsesc în
`src/styles/`, iar familiile de stiluri pentru proiecte în
`src/shared/styles/projects/`.

Ordinea include-urilor și a stylesheet-urilor este relevantă pentru cascada CSS.
Editează componenta sau familia potrivită și verifică paginile care o folosesc.

### Conținut și media

- `src/content/projects/catalog.js` — catalogul proiectelor folosit de galerie;
- `src/content/entries/` — datele articolelor Insights și de ergonomie;
- `src/content/press/` — conținutul comunicatelor de presă;
- `src/pages/projects/` — conținutul paginilor individuale de proiect.

Fișierele din `public/` sunt copiate cu aceeași cale relativă în `dist/`. De
exemplu, `public/logos/workspace-logo-darktext.svg` este publicat ca
`logos/workspace-logo-darktext.svg`.

## Compoziția la build

Include-urile sunt declarate în surse astfel:

```html
<!--@include {"file":"components/navigation/menu-project.html","values":{"root":"../../"}} -->
```

Calea `file` este relativă la `src/`. Parametrii precum `{{root}}` sunt înlocuiți
literal. Include-urile moștenesc parametrii părintelui și îi pot suprascrie prin
`values`.

Directivele funcționează în sursele HTML, CSS și JavaScript. Ele sunt rezolvate la
build; browserul primește fișiere complete, fără directive și fără cereri separate
pentru fragmente. Scripturile inline sunt compuse în interiorul tagurilor lor
`script`, în poziția definită de pagină.

Build-ul verifică include-urile, parametrii, ciclurile și coliziunile dintre căile
publicate. Rezultatul este pregătit într-un director temporar, apoi înlocuiește
`dist/`. Un lock local serializează build-urile concurente.

## Adăugarea unei pagini

1. Creează fișierul în `src/pages/` la calea dorită.
2. Include componentele sau layoutul potrivit.
3. Adaugă stilurile în `src/styles/` și scripturile publice în `src/scripts/`.
4. Pune fragmentele interne în `src/features/`, `src/components/` sau `src/shared/`.
5. Adaugă fișierele media în `public/` și verifică linkurile relative.
6. Rulează serverul local și verifică pagina pe desktop și mobil.

## Comenzi

| Comandă | Rol |
| --- | --- |
| `npm run dev` | Build inițial, server local pe portul 3000 și reconstruire la salvare |
| `npm run build` | Generarea directorului `dist/` |
| `npm run preview` | Servirea build-ului pe portul 4173 |
| `npm test` | Testarea instrumentelor de build, a serverului și a linkurilor Pages |
| `npm run prepare:pages` | Pregătirea linkurilor de homepage pentru găzduire în subdirector |
| `npm run verify:parity` | Compararea fișierelor generate cu manifestul SHA-256 de referință |
| `npm run check` | Teste, build și verificarea manifestului |
| `npm run verify:browser -- /cale/catre/site-referinta` | Compararea vizuală cu un director de referință |

Manifestul pentru verificarea fișierelor se află în `tests/fixtures/`. Modificările
intenționate de conținut sau de rute vor fi raportate ca diferențe față de manifest.

Compararea în Chrome salvează capturile și raportul în `artifacts/browser/`.
`CHROME_PATH` permite alegerea executabilului Chrome, iar `BROWSER_ROUTES` permite
restrângerea paginilor comparate.

## Publicare

Workflow-ul `.github/workflows/pages.yml` construiește site-ul și publică `dist/`
prin GitHub Pages. Pasul `prepare:pages` transformă handler-ele logo-urilor în
linkuri relative către homepage, astfel încât navigația să funcționeze și când
site-ul este găzduit într-un subdirector.

Pull request-urile rulează testele și build-ul. Publicarea are loc pentru `main`
sau la declanșarea manuală a workflow-ului. Sursa de publicare din setările GitHub
Pages trebuie să fie `GitHub Actions`.
