# Workspace Studio Website

Site static cu pagini HTML, stiluri CSS, JavaScript și componente compuse la build.
Necesită Node.js 22 sau mai nou. Rulează `npm ci` după clonare pentru a instala
dependențele de build, inclusiv Sharp pentru optimizarea fotografiilor.

## Pornire locală

Din directorul proiectului:

```sh
npm run dev
```

Deschide **http://127.0.0.1:3000**. Salvează modificările în `src/` sau `public/`,
așteaptă mesajul `Rebuilt`, apoi reîncarcă pagina în browser.

Pentru oprirea serverului folosește `Ctrl+C`.

## Directoare principale

- `src/` — codul editabil: pagini, componente, stiluri, scripturi și conținut.
- `public/` — imagini, logo-uri, videoclipuri și documente.
- `dist/` — site-ul generat, pregătit pentru browser și publicare. Nu se editează manual.
- `scripts/` — instrumentele pentru build, server și verificări.
- `tests/` — testele automate și datele de referință.
- `config/` — configurația build-ului.

Homepage-ul se editează în `src/pages/index.html` și `src/features/home/`.
Conținutul proiectului Adobe se editează în `src/pages/projects/Adobe/adobe.html`,
iar imaginile sale sunt în `public/projects/Adobe/`.

Structura completă și regulile de lucru sunt descrise în
[Arhitectura proiectului](docs/architecture.md).

## Build și verificări

```sh
npm test
npm run build
npm run preview
```

Preview-ul este disponibil la **http://127.0.0.1:4173**.

## GitHub Pages

Workflow-ul `.github/workflows/pages.yml` rulează testele, construiește site-ul și
publică directorul `.pages-build/` la push pe `main`. Pull request-urile sunt doar testate
și compilate.

Build-ul pentru publicare se poate verifica și local:

```sh
npm run build:pages
```

Acesta reconstruiește `dist/` și creează separat `.pages-build/` pentru publicare,
cu fotografiile JPEG limitate la 1440 px pe latura lungă, la o calitate de 72.
Linkurile sunt adaptate pentru GitHub Pages. Serverul local continuă să folosească `dist/`.
Numele fișierelor rămân aceleași, iar originalele din `public/` nu sunt modificate.
Un fișier optimizat este folosit numai dacă este mai mic decât originalul.
Publicarea se oprește dacă site-ul depășește 950 MB, pentru a rămâne sub limita
GitHub Pages de 1 GB. `npm run build` rămâne build-ul local fără recomprimare.

În setările repository-ului, selectează **Settings → Pages → Build and deployment
→ Source → GitHub Actions**. Directoarele `dist/` și `.pages-build/` sunt generate de workflow și nu
se adaugă manual în Git.
