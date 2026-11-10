# Workspace Studio Website

Site static cu pagini HTML, stiluri CSS, JavaScript și componente compuse la build.
Necesită Node.js 22 sau mai nou. Nu sunt necesare pachete npm externe.

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
publică directorul `dist/` la push pe `main`. Pull request-urile sunt doar testate
și compilate.

În setările repository-ului, selectează **Settings → Pages → Build and deployment
→ Source → GitHub Actions**. Directorul `dist/` este generat de workflow și nu
se adaugă manual în Git.
