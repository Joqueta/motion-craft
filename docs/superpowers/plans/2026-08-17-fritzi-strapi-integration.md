# Branchement des templates fritzi à Strapi — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Faire en sorte que les pages `pages/fritzi/*.js` (Home, About, Work, Contact, Project detail) affichent du contenu venant de Strapi au lieu des mocks statiques, pour que l'édition se fasse directement dans l'admin Strapi.

**Architecture:** 5 content-types Strapi (`fritzi-profile`, `fritzi-home`, `fritzi-about`, `fritzi-contact` en Single Type, `fritzi-project` en Collection Type avec Draft & Publish) + un nouveau module `services/fritzi-content-service.js` qui interroge ces content-types via le client CMS existant et retourne des objets ayant exactement la forme des mocks actuels (mêmes clés), pour que les composants n'aient rien à changer. Les 5 pages `pages/fritzi/*.js` remplacent leurs `fakeFetchXxx()`/imports de mocks par des appels à ce service.

**Tech Stack:** Strapi 5.51.1 (SQLite, `motion_craft/`), JS Vanilla ES modules côté front (aucun bundler), suite de tests maison (`tests/runner.js`, exécutée dans le navigateur via `tests/index.html`).

## Global Constraints

- Spec de référence : `docs/superpowers/specs/2026-08-17-fritzi-strapi-integration-design.md`.
- **Ne jamais exécuter `git add`, `git commit` ou `git push`.** À chaque étape "Commit", affiche la commande à l'utilisateur et demande-lui de la lancer lui-même — ne l'exécute pas.
- Ne pas toucher : `services/portfolio-service.js` (sauf l'export ciblé au Task 8), `services/auth-service.js`, `pages/admin-page.js`, `pages/login-page.js`, `routes/index.js`, `components/fritzi/contact/contact-form.js`.
- Les composants dans `components/fritzi/**` ne changent pas : seules les pages `pages/fritzi/*.js` et le nouveau service changent côté front.
- Les logos/icônes décoratifs du design system restent en dur (`assets/fritzi/`, mocks `profileMock.logo`, `contactMock.logo`, `contactMock.nav`) — ne pas les faire venir de Strapi.
- L'alt text des images vient du champ natif `alternativeText` de la Media Library Strapi — ne pas créer de champ `xxxAlt` custom en plus.
- Toutes les requêtes de lecture doivent passer par le rôle **Public** de Strapi (pas de token) — voir Task 7.

---

## Task 1: Composants Strapi partagés (`src/components/fritzi/*`)

**Files:**
- Create: `motion_craft/src/components/fritzi/offering.json`
- Create: `motion_craft/src/components/fritzi/related-project.json`
- Create: `motion_craft/src/components/fritzi/meta-item.json`
- Create: `motion_craft/src/components/fritzi/overview.json`
- Create: `motion_craft/src/components/fritzi/text-image-block.json`
- Create: `motion_craft/src/components/fritzi/challenge.json`

**Interfaces:**
- Produces : les UID de composants `fritzi.offering`, `fritzi.related-project`, `fritzi.meta-item`, `fritzi.overview`, `fritzi.text-image-block`, `fritzi.challenge`, utilisés par les content-types des Tasks 3, 4 et 6.

- [ ] **Step 1: Créer `related-project.json` (utilisé par `offering`)**

```json
{
  "collectionName": "components_fritzi_related_projects",
  "info": { "displayName": "Related project", "icon": "link" },
  "attributes": {
    "label": { "type": "string", "required": true },
    "slug": { "type": "string", "required": true }
  }
}
```

- [ ] **Step 2: Créer `offering.json`**

```json
{
  "collectionName": "components_fritzi_offerings",
  "info": { "displayName": "Offering", "icon": "briefcase" },
  "attributes": {
    "number": { "type": "string", "required": true },
    "title": { "type": "string", "required": true },
    "tag": { "type": "string" },
    "tools": { "type": "string", "required": true },
    "work": { "type": "json" },
    "relatedWork": {
      "type": "component",
      "repeatable": true,
      "component": "fritzi.related-project"
    }
  }
}
```

- [ ] **Step 3: Créer `meta-item.json`**

```json
{
  "collectionName": "components_fritzi_meta_items",
  "info": { "displayName": "Meta item", "icon": "list" },
  "attributes": {
    "label": { "type": "string", "required": true },
    "value": { "type": "string", "required": true }
  }
}
```

- [ ] **Step 4: Créer `overview.json`**

```json
{
  "collectionName": "components_fritzi_overviews",
  "info": { "displayName": "Overview", "icon": "file" },
  "attributes": {
    "sideLabel": { "type": "string" },
    "eyebrow": { "type": "string", "required": true },
    "heading": { "type": "text", "required": true },
    "paragraphs": { "type": "json", "required": true }
  }
}
```

- [ ] **Step 5: Créer `text-image-block.json`**

```json
{
  "collectionName": "components_fritzi_text_image_blocks",
  "info": { "displayName": "Text image block", "icon": "picture" },
  "attributes": {
    "eyebrow": { "type": "string" },
    "heading": { "type": "string" },
    "paragraphs": { "type": "json", "required": true },
    "image": { "type": "media", "multiple": false, "allowedTypes": ["images"], "required": true }
  }
}
```

- [ ] **Step 6: Créer `challenge.json`**

```json
{
  "collectionName": "components_fritzi_challenges",
  "info": { "displayName": "Challenge", "icon": "alert" },
  "attributes": {
    "eyebrow": { "type": "string", "required": true },
    "heading": { "type": "text", "required": true },
    "paragraphs": { "type": "json", "required": true },
    "backgroundImage": { "type": "media", "multiple": false, "allowedTypes": ["images"], "required": true }
  }
}
```

- [ ] **Step 7: Vérifier que Strapi charge les composants sans erreur**

Run: `cd motion_craft && npm run develop`
Expected: le serveur démarre sans erreur de schéma dans la console (`Strapi started successfully` ou équivalent). Laisser tourner pour les tasks suivantes (redémarrage à chaud à chaque nouveau fichier de schéma).

- [ ] **Step 8: Commit**

Affiche cette commande à l'utilisateur, ne l'exécute pas :

```bash
git add motion_craft/src/components/fritzi/
git commit -m "feat(strapi): add shared fritzi components"
```

---

## Task 2: Content-type `fritzi-profile` (Single Type)

**Files:**
- Create: `motion_craft/src/api/fritzi-profile/content-types/fritzi-profile/schema.json`
- Create: `motion_craft/src/api/fritzi-profile/controllers/fritzi-profile.js`
- Create: `motion_craft/src/api/fritzi-profile/routes/fritzi-profile.js`
- Create: `motion_craft/src/api/fritzi-profile/services/fritzi-profile.js`

**Interfaces:**
- Produces : endpoint REST `GET /api/fritzi-profile`.

- [ ] **Step 1: Créer le schéma**

```json
{
  "kind": "singleType",
  "collectionName": "fritzi_profile",
  "info": {
    "singularName": "fritzi-profile",
    "pluralName": "fritzi-profiles",
    "displayName": "Fritzi Profile",
    "description": "Identité et coordonnées partagées entre les pages fritzi"
  },
  "options": { "draftAndPublish": false },
  "pluginOptions": {},
  "attributes": {
    "firstName": { "type": "string", "required": true },
    "lastName": { "type": "string", "required": true },
    "role": { "type": "string", "required": true },
    "bio": { "type": "text", "required": true },
    "statusLabel": { "type": "string" },
    "statusActive": { "type": "boolean", "default": true },
    "location": { "type": "string" },
    "year": { "type": "string" },
    "email": { "type": "email", "required": true },
    "linkedin": { "type": "string" },
    "instagram": { "type": "string" },
    "contactHeading": { "type": "json" }
  }
}
```

- [ ] **Step 2: Créer le controller**

```js
'use strict';
const { createCoreController } = require('@strapi/strapi').factories;
module.exports = createCoreController('api::fritzi-profile.fritzi-profile');
```

- [ ] **Step 3: Créer les routes**

```js
'use strict';
const { createCoreRouter } = require('@strapi/strapi').factories;
module.exports = createCoreRouter('api::fritzi-profile.fritzi-profile');
```

- [ ] **Step 4: Créer le service**

```js
'use strict';
const { createCoreService } = require('@strapi/strapi').factories;
module.exports = createCoreService('api::fritzi-profile.fritzi-profile');
```

- [ ] **Step 5: Vérifier dans l'admin Strapi**

Avec `npm run develop` toujours lancé (redémarre automatiquement à la détection du nouveau schéma), ouvrir `http://localhost:1337/admin` → **Content Manager** → section **Single Types** doit afficher "Fritzi Profile". Renseigner une entrée de test (firstName="Test", lastName="Test", role="Test", bio="Test", email="test@test.fr") et cliquer **Save**.
Expected: la sauvegarde réussit sans erreur.

- [ ] **Step 6: Commit**

Affiche cette commande à l'utilisateur, ne l'exécute pas :

```bash
git add motion_craft/src/api/fritzi-profile/
git commit -m "feat(strapi): add fritzi-profile single type"
```

---

## Task 3: Content-type `fritzi-home` (Single Type)

**Files:**
- Create: `motion_craft/src/api/fritzi-home/content-types/fritzi-home/schema.json`
- Create: `motion_craft/src/api/fritzi-home/controllers/fritzi-home.js`
- Create: `motion_craft/src/api/fritzi-home/routes/fritzi-home.js`
- Create: `motion_craft/src/api/fritzi-home/services/fritzi-home.js`

**Interfaces:**
- Consumes : composant `fritzi.offering` (Task 1).
- Produces : endpoint REST `GET /api/fritzi-home`.

- [ ] **Step 1: Créer le schéma**

```json
{
  "kind": "singleType",
  "collectionName": "fritzi_home",
  "info": {
    "singularName": "fritzi-home",
    "pluralName": "fritzi-homes",
    "displayName": "Fritzi Home",
    "description": "Contenu spécifique à la page d'accueil"
  },
  "options": { "draftAndPublish": false },
  "pluginOptions": {},
  "attributes": {
    "aboutHeading": { "type": "string", "required": true },
    "quoteLead": { "type": "string", "required": true },
    "quoteHighlight1": { "type": "string", "required": true },
    "quoteConnector": { "type": "string", "required": true },
    "quoteHighlight2": { "type": "string", "required": true },
    "quoteTail": { "type": "string", "required": true },
    "aboutCaption": { "type": "text", "required": true },
    "aboutPortrait": { "type": "media", "multiple": false, "allowedTypes": ["images"], "required": true },
    "skillsEyebrow": { "type": "string", "required": true },
    "skillsLine1": { "type": "string", "required": true },
    "skillsConnector": { "type": "string", "required": true },
    "skillsLine2": { "type": "string", "required": true },
    "skillsParagraphs": { "type": "json", "required": true },
    "cvLabel": { "type": "string", "required": true },
    "offeringsImage": { "type": "media", "multiple": false, "allowedTypes": ["images"], "required": true },
    "offerings": { "type": "component", "repeatable": true, "component": "fritzi.offering" }
  }
}
```

- [ ] **Step 2: Créer le controller**

```js
'use strict';
const { createCoreController } = require('@strapi/strapi').factories;
module.exports = createCoreController('api::fritzi-home.fritzi-home');
```

- [ ] **Step 3: Créer les routes**

```js
'use strict';
const { createCoreRouter } = require('@strapi/strapi').factories;
module.exports = createCoreRouter('api::fritzi-home.fritzi-home');
```

- [ ] **Step 4: Créer le service**

```js
'use strict';
const { createCoreService } = require('@strapi/strapi').factories;
module.exports = createCoreService('api::fritzi-home.fritzi-home');
```

- [ ] **Step 5: Vérifier dans l'admin Strapi**

Content Manager → Single Types → "Fritzi Home" doit apparaître, avec un champ répétable "Offerings" qui propose d'ajouter des entrées "Offering" (avec un sous-champ répétable "Related work").
Expected : la structure des champs correspond au schéma ci-dessus, aucune erreur au chargement de la page.

- [ ] **Step 6: Commit**

Affiche cette commande à l'utilisateur, ne l'exécute pas :

```bash
git add motion_craft/src/api/fritzi-home/
git commit -m "feat(strapi): add fritzi-home single type"
```

---

## Task 4: Content-type `fritzi-about` (Single Type)

**Files:**
- Create: `motion_craft/src/api/fritzi-about/content-types/fritzi-about/schema.json`
- Create: `motion_craft/src/api/fritzi-about/controllers/fritzi-about.js`
- Create: `motion_craft/src/api/fritzi-about/routes/fritzi-about.js`
- Create: `motion_craft/src/api/fritzi-about/services/fritzi-about.js`

**Interfaces:**
- Consumes : composant `fritzi.offering` (Task 1).
- Produces : endpoint REST `GET /api/fritzi-about`.

- [ ] **Step 1: Créer le schéma**

```json
{
  "kind": "singleType",
  "collectionName": "fritzi_about",
  "info": {
    "singularName": "fritzi-about",
    "pluralName": "fritzi-abouts",
    "displayName": "Fritzi About",
    "description": "Contenu spécifique à la page About"
  },
  "options": { "draftAndPublish": false },
  "pluginOptions": {},
  "attributes": {
    "heroRole": { "type": "string", "required": true },
    "heroLocationLabel": { "type": "string", "required": true },
    "heroLocation": { "type": "string", "required": true },
    "heroPortrait": { "type": "media", "multiple": false, "allowedTypes": ["images"], "required": true },
    "heroParagraphs": { "type": "json", "required": true },
    "offerings": { "type": "component", "repeatable": true, "component": "fritzi.offering" }
  }
}
```

- [ ] **Step 2: Créer le controller**

```js
'use strict';
const { createCoreController } = require('@strapi/strapi').factories;
module.exports = createCoreController('api::fritzi-about.fritzi-about');
```

- [ ] **Step 3: Créer les routes**

```js
'use strict';
const { createCoreRouter } = require('@strapi/strapi').factories;
module.exports = createCoreRouter('api::fritzi-about.fritzi-about');
```

- [ ] **Step 4: Créer le service**

```js
'use strict';
const { createCoreService } = require('@strapi/strapi').factories;
module.exports = createCoreService('api::fritzi-about.fritzi-about');
```

- [ ] **Step 5: Vérifier dans l'admin Strapi**

Content Manager → Single Types → "Fritzi About" doit apparaître avec les mêmes types de champs que le schéma.
Expected : aucune erreur au chargement de la page.

- [ ] **Step 6: Commit**

Affiche cette commande à l'utilisateur, ne l'exécute pas :

```bash
git add motion_craft/src/api/fritzi-about/
git commit -m "feat(strapi): add fritzi-about single type"
```

---

## Task 5: Content-type `fritzi-contact` (Single Type)

**Files:**
- Create: `motion_craft/src/api/fritzi-contact/content-types/fritzi-contact/schema.json`
- Create: `motion_craft/src/api/fritzi-contact/controllers/fritzi-contact.js`
- Create: `motion_craft/src/api/fritzi-contact/routes/fritzi-contact.js`
- Create: `motion_craft/src/api/fritzi-contact/services/fritzi-contact.js`

**Interfaces:**
- Produces : endpoint REST `GET /api/fritzi-contact`.

- [ ] **Step 1: Créer le schéma**

```json
{
  "kind": "singleType",
  "collectionName": "fritzi_contact",
  "info": {
    "singularName": "fritzi-contact",
    "pluralName": "fritzi-contacts",
    "displayName": "Fritzi Contact",
    "description": "Contenu spécifique à la page Contact"
  },
  "options": { "draftAndPublish": false },
  "pluginOptions": {},
  "attributes": {
    "heroPortrait": { "type": "media", "multiple": false, "allowedTypes": ["images"], "required": true }
  }
}
```

- [ ] **Step 2: Créer le controller**

```js
'use strict';
const { createCoreController } = require('@strapi/strapi').factories;
module.exports = createCoreController('api::fritzi-contact.fritzi-contact');
```

- [ ] **Step 3: Créer les routes**

```js
'use strict';
const { createCoreRouter } = require('@strapi/strapi').factories;
module.exports = createCoreRouter('api::fritzi-contact.fritzi-contact');
```

- [ ] **Step 4: Créer le service**

```js
'use strict';
const { createCoreService } = require('@strapi/strapi').factories;
module.exports = createCoreService('api::fritzi-contact.fritzi-contact');
```

- [ ] **Step 5: Vérifier dans l'admin Strapi**

Content Manager → Single Types → "Fritzi Contact" doit apparaître avec un seul champ media "Hero Portrait".
Expected : aucune erreur au chargement de la page.

- [ ] **Step 6: Commit**

Affiche cette commande à l'utilisateur, ne l'exécute pas :

```bash
git add motion_craft/src/api/fritzi-contact/
git commit -m "feat(strapi): add fritzi-contact single type"
```

---

## Task 6: Content-type `fritzi-project` (Collection Type, Draft & Publish)

**Files:**
- Create: `motion_craft/src/api/fritzi-project/content-types/fritzi-project/schema.json`
- Create: `motion_craft/src/api/fritzi-project/controllers/fritzi-project.js`
- Create: `motion_craft/src/api/fritzi-project/routes/fritzi-project.js`
- Create: `motion_craft/src/api/fritzi-project/services/fritzi-project.js`

**Interfaces:**
- Consumes : composants `fritzi.meta-item`, `fritzi.overview`, `fritzi.text-image-block`, `fritzi.challenge` (Task 1).
- Produces : endpoints REST `GET /api/fritzi-projects` (liste) et `GET /api/fritzi-projects?filters[slug][$eq]=...` (détail par slug), utilisés par le Task 9.

- [ ] **Step 1: Créer le schéma**

```json
{
  "kind": "collectionType",
  "collectionName": "fritzi_projects",
  "info": {
    "singularName": "fritzi-project",
    "pluralName": "fritzi-projects",
    "displayName": "Fritzi Project",
    "description": "Projets affichés sur Home, Work et la page détail"
  },
  "options": { "draftAndPublish": true },
  "pluginOptions": {},
  "attributes": {
    "slug": { "type": "uid", "targetField": "title", "required": true },
    "client": { "type": "string", "required": true },
    "label": { "type": "string", "required": true },
    "cover": { "type": "media", "multiple": false, "allowedTypes": ["images"], "required": true },
    "featured": { "type": "boolean", "default": false },
    "order": { "type": "integer", "default": 0, "required": true },
    "title": { "type": "string", "required": true },
    "eyebrow": { "type": "string", "required": true },
    "meta": { "type": "component", "repeatable": true, "component": "fritzi.meta-item" },
    "heroImage": { "type": "media", "multiple": false, "allowedTypes": ["images"], "required": true },
    "overview": { "type": "component", "repeatable": false, "component": "fritzi.overview" },
    "discovery": { "type": "component", "repeatable": false, "component": "fritzi.text-image-block" },
    "challenge": { "type": "component", "repeatable": false, "component": "fritzi.challenge" },
    "outcome": { "type": "component", "repeatable": false, "component": "fritzi.text-image-block" }
  }
}
```

- [ ] **Step 2: Créer le controller**

```js
'use strict';
const { createCoreController } = require('@strapi/strapi').factories;
module.exports = createCoreController('api::fritzi-project.fritzi-project');
```

- [ ] **Step 3: Créer les routes**

```js
'use strict';
const { createCoreRouter } = require('@strapi/strapi').factories;
module.exports = createCoreRouter('api::fritzi-project.fritzi-project');
```

- [ ] **Step 4: Créer le service**

```js
'use strict';
const { createCoreService } = require('@strapi/strapi').factories;
module.exports = createCoreService('api::fritzi-project.fritzi-project');
```

- [ ] **Step 5: Vérifier dans l'admin Strapi + créer les projets réels**

Content Manager → Collection Types → "Fritzi Project" doit apparaître avec un bouton **Publish** distinct de **Save** (signe que Draft & Publish est actif). Créer au moins 2 entrées (reprendre le contenu de `mocks/fritzi/project-detail-mock.js` et `mocks/fritzi/work-mock.js` comme point de départ), avec un `order` différent pour chacune, puis cliquer **Publish** sur chacune.
Expected : les entrées passent au statut "Published" dans la liste.

- [ ] **Step 6: Commit**

Affiche cette commande à l'utilisateur, ne l'exécute pas :

```bash
git add motion_craft/src/api/fritzi-project/
git commit -m "feat(strapi): add fritzi-project collection type with draft and publish"
```

---

## Task 7: Permissions publiques + saisie du contenu de base

**Files:**
- Aucun fichier de code — configuration via l'admin Strapi (les permissions du rôle Public sont stockées en base, pas dans des fichiers versionnés).

**Interfaces:**
- Consumes : les 5 content-types des Tasks 2 à 6.
- Produces : accès public en lecture, requis par `services/fritzi-content-service.js` (Task 9).

- [ ] **Step 1: Activer les permissions**

Dans l'admin Strapi : **Settings → Users & Permissions plugin → Roles → Public**. Pour chacun de `Fritzi-profile`, `Fritzi-home`, `Fritzi-about`, `Fritzi-contact`, `Fritzi-project`, cocher `find` et `findOne`. Dans la section `Upload`, cocher `find` et `findOne`. Cliquer **Save**.

- [ ] **Step 2: Vérifier avec curl (sans token)**

Run: `curl -s http://localhost:1337/api/fritzi-profile`
Expected: réponse JSON `{"data": {...}, "meta": {}}` avec les champs saisis au Task 2 — pas d'erreur 403/401.

Run: `curl -s "http://localhost:1337/api/fritzi-projects?populate=cover"`
Expected: réponse JSON `{"data": [...], "meta": {...}}` contenant les projets publiés au Task 6.

- [ ] **Step 3: Saisir le contenu restant**

Remplir dans l'admin Strapi les entrées `Fritzi Home`, `Fritzi About`, `Fritzi Contact` (au minimum les champs `required`), en reprenant le contenu de `mocks/fritzi/content-mock.js`, `mocks/fritzi/about-mock.js` et `mocks/fritzi/contact-mock.js` comme point de départ. Pas de commit associé (pas de fichier versionné).

---

## Task 8: Exporter `mediaUrl` depuis `services/portfolio-service.js`

**Files:**
- Modify: `services/portfolio-service.js:12`
- Test: `tests/portfolio-service.test.js` (nouveau)

**Interfaces:**
- Produces : `export function mediaUrl(media): string`, consommé par `services/fritzi-content-service.js` (Task 9).

- [ ] **Step 1: Écrire le test qui échoue**

```js
import { describe, expect, it } from "./runner.js";
import { mediaUrl } from "../services/portfolio-service.js";

describe("mediaUrl", () => {
  it("préfixe une URL relative avec la base du client CMS", () => {
    expect(mediaUrl({ url: "/uploads/a.png" })).toBe("http://localhost:1337/uploads/a.png");
  });

  it("laisse une URL absolue inchangée", () => {
    expect(mediaUrl({ url: "https://cdn.example.com/a.png" })).toBe("https://cdn.example.com/a.png");
  });

  it("retourne une chaîne vide pour un média manquant", () => {
    expect(mediaUrl(null)).toBe("");
  });
});
```

- [ ] **Step 2: Enregistrer le nouveau fichier de test dans `tests/index.html`**

Dans `tests/index.html`, ajouter l'import après celui de `http.test.js` :

```html
      import "./http.test.js";
      import "./portfolio-service.test.js";
      import "./workflow.test.js";
```

- [ ] **Step 3: Vérifier que le test échoue**

Ouvrir `http://localhost:8080/tests/index.html` dans le navigateur (serveur statique lancé à la racine du repo).
Expected: la suite "mediaUrl" n'apparaît pas ou échoue avec une erreur d'import (`mediaUrl` n'est pas exporté).

- [ ] **Step 4: Exporter la fonction**

Dans `services/portfolio-service.js:12`, remplacer :

```js
function mediaUrl(media) {
```

par :

```js
export function mediaUrl(media) {
```

- [ ] **Step 5: Vérifier que les tests passent**

Recharger `http://localhost:8080/tests/index.html`.
Expected: la suite "mediaUrl" affiche 3 tests réussis, et le résumé global ne régresse pas (toujours 0 échec).

- [ ] **Step 6: Commit**

Affiche cette commande à l'utilisateur, ne l'exécute pas :

```bash
git add services/portfolio-service.js tests/portfolio-service.test.js tests/index.html
git commit -m "refactor: export mediaUrl for reuse by fritzi-content-service"
```

---

## Task 9: `services/fritzi-content-service.js`

**Files:**
- Create: `services/fritzi-content-service.js`
- Test: `tests/fritzi-content-service.test.js`
- Modify: `tests/index.html`

**Interfaces:**
- Consumes : `client` (`services/cms-client.js`, déjà existant), `mediaUrl` (Task 8), `profileMock.logo` et `contactMock.logo`/`contactMock.nav` (mocks existants, conservés en dur).
- Produces (consommé par les Tasks 10 à 14) :
  - `fetchProfile(): Promise<{firstName, lastName, role, bio, status:{label,active}, location, year, logo:{url,alt}}>`
  - `fetchContactInfo(): Promise<{heading:string[], logo:{url,alt}, nav:string[], linkedin, email, instagram}>`
  - `fetchHomeData(): Promise<{profile, projects:Array<{id,slug,client,label,cover:{url,alt}}>, about, aboutMe, offerings:Array}>`
  - `fetchAboutData(): Promise<{hero, skillsContent, offerings:Array}>`
  - `fetchWorkData(): Promise<Array<{id,slug,client,label,cover:{url,alt}}>>`
  - `fetchContactData(): Promise<{portrait:{url,alt}}>`
  - `fetchProjectDetail(slug): Promise<{slug,title,eyebrow,meta,heroImage,overview,discovery,challenge,outcome,nextProject}>`

- [ ] **Step 1: Écrire les tests des fonctions de mapping pures**

```js
import { describe, expect, it } from "./runner.js";
import { toOffering, toProjectCard, toTextImageBlock } from "../services/fritzi-content-service.js";

describe("fritzi-content-service — mapping", () => {
  it("mappe un offering complet", () => {
    const raw = {
      id: 1,
      number: "01",
      title: "Front-end",
      tag: "Related work",
      tools: "HTML, CSS, JS",
      work: ["TV display"],
      relatedWork: [{ label: "Tv display", slug: "decode-tv-display" }],
    };
    expect(toOffering(raw)).toEqual({
      id: 1,
      number: "01",
      title: "Front-end",
      tag: "Related work",
      tools: "HTML, CSS, JS",
      work: ["TV display"],
      relatedWork: [{ label: "Tv display", slug: "decode-tv-display" }],
    });
  });

  it("mappe un offering sans work ni relatedWork", () => {
    const raw = { id: 2, number: "02", title: "Back-end", tools: "PHP" };
    expect(toOffering(raw)).toEqual({
      id: 2,
      number: "02",
      title: "Back-end",
      tag: "",
      tools: "PHP",
      work: [],
      relatedWork: [],
    });
  });

  it("mappe une carte projet avec image relative", () => {
    const raw = { id: 5, slug: "aurora", client: ".decode", label: "TV display", cover: { url: "/uploads/a.png", alternativeText: "Aperçu" } };
    expect(toProjectCard(raw)).toEqual({
      id: 5,
      slug: "aurora",
      client: ".decode",
      label: "TV display",
      cover: { url: "http://localhost:1337/uploads/a.png", alt: "Aperçu" },
    });
  });

  it("mappe un bloc texte+image sans image", () => {
    const raw = { eyebrow: "Discovery", heading: "Titre", paragraphs: ["p1"] };
    expect(toTextImageBlock(raw)).toEqual({
      eyebrow: "Discovery",
      heading: "Titre",
      paragraphs: ["p1"],
      image: { url: "", alt: "" },
    });
  });
});
```

- [ ] **Step 2: Enregistrer le fichier de test dans `tests/index.html`**

```html
      import "./portfolio-service.test.js";
      import "./fritzi-content-service.test.js";
      import "./workflow.test.js";
```

- [ ] **Step 3: Vérifier que les tests échouent**

Ouvrir `http://localhost:8080/tests/index.html`.
Expected: erreur d'import — `services/fritzi-content-service.js` n'existe pas encore.

- [ ] **Step 4: Créer `services/fritzi-content-service.js`**

```js
import client from "./cms-client.js";
import { mediaUrl } from "./portfolio-service.js";
import { profileMock } from "../mocks/fritzi/profile-mock.js";
import { contactMock } from "../mocks/fritzi/content-mock.js";

const LOGO = profileMock.logo;
const FOOTER_LOGO = contactMock.logo;
const FOOTER_NAV = contactMock.nav;

const HOME_POPULATE = {
  aboutPortrait: true,
  offeringsImage: true,
  offerings: { populate: ["relatedWork"] },
};

const ABOUT_POPULATE = {
  heroPortrait: true,
  offerings: { populate: ["relatedWork"] },
};

const PROJECT_LIST_POPULATE = { cover: true };

const PROJECT_DETAIL_POPULATE = {
  cover: true,
  heroImage: true,
  meta: true,
  overview: true,
  discovery: { populate: ["image"] },
  challenge: { populate: ["backgroundImage"] },
  outcome: { populate: ["image"] },
};

export function toImage(media) {
  if (!media) return { url: "", alt: "" };
  return { url: mediaUrl(media), alt: media.alternativeText ?? "" };
}

export function toOffering(raw) {
  return {
    id: raw.id,
    number: raw.number ?? "",
    title: raw.title ?? "",
    tag: raw.tag ?? "",
    tools: raw.tools ?? "",
    work: Array.isArray(raw.work) ? raw.work : [],
    relatedWork: Array.isArray(raw.relatedWork)
      ? raw.relatedWork.map((item) => ({ label: item.label ?? "", slug: item.slug ?? "" }))
      : [],
  };
}

export function toProjectCard(raw) {
  return {
    id: raw.id,
    slug: raw.slug ?? "",
    client: raw.client ?? "",
    label: raw.label ?? "",
    cover: toImage(raw.cover),
  };
}

export function toTextImageBlock(raw) {
  return {
    eyebrow: raw?.eyebrow ?? "",
    heading: raw?.heading ?? "",
    paragraphs: Array.isArray(raw?.paragraphs) ? raw.paragraphs : [],
    image: toImage(raw?.image),
  };
}

function toSkillsContent(home) {
  return {
    eyebrow: home?.skillsEyebrow ?? "",
    line1: home?.skillsLine1 ?? "",
    connector: home?.skillsConnector ?? "",
    line2: home?.skillsLine2 ?? "",
    paragraphs: Array.isArray(home?.skillsParagraphs) ? home.skillsParagraphs : [],
    cvLabel: home?.cvLabel ?? "",
    offeringsImage: toImage(home?.offeringsImage),
  };
}

function toAboutMe(home) {
  return {
    heading: home?.aboutHeading ?? "",
    quote: {
      lead: home?.quoteLead ?? "",
      highlight1: home?.quoteHighlight1 ?? "",
      connector: home?.quoteConnector ?? "",
      highlight2: home?.quoteHighlight2 ?? "",
      tail: home?.quoteTail ?? "",
    },
    caption: home?.aboutCaption ?? "",
    portrait: toImage(home?.aboutPortrait),
  };
}

export async function fetchProfile() {
  const raw = await client.findOne("fritzi-profile", {});
  return {
    firstName: raw?.firstName ?? "",
    lastName: raw?.lastName ?? "",
    role: raw?.role ?? "",
    bio: raw?.bio ?? "",
    status: { label: raw?.statusLabel ?? "", active: Boolean(raw?.statusActive) },
    location: raw?.location ?? "",
    year: raw?.year ?? "",
    logo: LOGO,
  };
}

export async function fetchContactInfo() {
  const raw = await client.findOne("fritzi-profile", {});
  return {
    heading: Array.isArray(raw?.contactHeading) ? raw.contactHeading : [],
    logo: FOOTER_LOGO,
    nav: FOOTER_NAV,
    linkedin: raw?.linkedin ?? "",
    email: raw?.email ?? "",
    instagram: raw?.instagram ?? "",
  };
}

export async function fetchHomeData() {
  const [profile, home, featured] = await Promise.all([
    fetchProfile(),
    client.findOne("fritzi-home", { populate: HOME_POPULATE }),
    client.find("fritzi-projects", {
      filters: { featured: { $eq: true } },
      sort: "order:asc",
      populate: PROJECT_LIST_POPULATE,
      pagination: { pageSize: 100 },
    }),
  ]);

  return {
    profile,
    projects: featured.items.map(toProjectCard),
    about: toSkillsContent(home),
    aboutMe: toAboutMe(home),
    offerings: Array.isArray(home?.offerings) ? home.offerings.map(toOffering) : [],
  };
}

export async function fetchAboutData() {
  const [home, about] = await Promise.all([
    client.findOne("fritzi-home", { populate: { offeringsImage: true } }),
    client.findOne("fritzi-about", { populate: ABOUT_POPULATE }),
  ]);

  return {
    hero: {
      role: about?.heroRole ?? "",
      locationLabel: about?.heroLocationLabel ?? "",
      location: about?.heroLocation ?? "",
      portrait: toImage(about?.heroPortrait),
      paragraphs: Array.isArray(about?.heroParagraphs) ? about.heroParagraphs : [],
    },
    skillsContent: toSkillsContent(home),
    offerings: Array.isArray(about?.offerings) ? about.offerings.map(toOffering) : [],
  };
}

export async function fetchWorkData() {
  const result = await client.find("fritzi-projects", {
    sort: "order:asc",
    populate: PROJECT_LIST_POPULATE,
    pagination: { pageSize: 100 },
  });
  return result.items.map(toProjectCard);
}

export async function fetchContactData() {
  const contact = await client.findOne("fritzi-contact", { populate: { heroPortrait: true } });
  return { portrait: toImage(contact?.heroPortrait) };
}

export async function fetchProjectDetail(slug) {
  const [match, list] = await Promise.all([
    client.find("fritzi-projects", {
      filters: { slug: { $eq: slug } },
      populate: PROJECT_DETAIL_POPULATE,
    }),
    client.find("fritzi-projects", {
      sort: "order:asc",
      populate: PROJECT_LIST_POPULATE,
      pagination: { pageSize: 100 },
    }),
  ]);

  const project = match.items[0];
  if (!project) throw new Error(`Projet "${slug}" introuvable`);

  const ordered = list.items;
  const index = ordered.findIndex((item) => item.slug === slug);
  const next = ordered.length > 1 ? ordered[(index + 1) % ordered.length] : null;

  return {
    slug: project.slug ?? "",
    title: project.title ?? "",
    eyebrow: project.eyebrow ?? "",
    meta: Array.isArray(project.meta)
      ? project.meta.map((item) => ({ label: item.label ?? "", value: item.value ?? "" }))
      : [],
    heroImage: toImage(project.heroImage),
    overview: {
      sideLabel: project.overview?.sideLabel ?? "",
      eyebrow: project.overview?.eyebrow ?? "",
      heading: project.overview?.heading ?? "",
      paragraphs: Array.isArray(project.overview?.paragraphs) ? project.overview.paragraphs : [],
    },
    discovery: toTextImageBlock(project.discovery),
    challenge: {
      eyebrow: project.challenge?.eyebrow ?? "",
      heading: project.challenge?.heading ?? "",
      paragraphs: Array.isArray(project.challenge?.paragraphs) ? project.challenge.paragraphs : [],
      backgroundImage: toImage(project.challenge?.backgroundImage),
    },
    outcome: toTextImageBlock(project.outcome),
    nextProject: next
      ? {
          label: "Next project",
          title: next.title ?? "",
          slug: next.slug ?? "",
          client: next.client ?? "",
          tag: next.label ?? "",
          cover: toImage(next.cover),
        }
      : null,
  };
}
```

- [ ] **Step 5: Vérifier que les tests passent**

Recharger `http://localhost:8080/tests/index.html`.
Expected: la suite "fritzi-content-service — mapping" affiche 4 tests réussis, résumé global sans échec.

- [ ] **Step 6: Commit**

Affiche cette commande à l'utilisateur, ne l'exécute pas :

```bash
git add services/fritzi-content-service.js tests/fritzi-content-service.test.js tests/index.html
git commit -m "feat: add fritzi-content-service to fetch and map Strapi content"
```

---

## Task 10: Brancher `pages/fritzi/home.js`

**Files:**
- Modify: `pages/fritzi/home.js`

**Interfaces:**
- Consumes : `fetchHomeData()` (Task 9).

- [ ] **Step 1: Remplacer les imports de mocks et `fakeFetchHomeData` par le service**

Remplacer le contenu de `pages/fritzi/home.js` :

```js
import { Layout } from "../../components/fritzi/layout.js";
import { Hero } from "../../components/fritzi/home/hero.js";
import { FeaturedProjects } from "../../components/fritzi/home/featured-project.js";
import { AboutMe } from "../../components/fritzi/home/about-me.js";
import { SkillsSection } from "../../components/fritzi/home/skills-section.js";

import { fetchHomeData } from "../../services/fritzi-content-service.js";

/**
 * Rendu de la page Home.
 * @returns {Promise<HTMLElement>}
 */
export async function HomePage() {
    const shell = document.createElement("div");
    shell.className = "page page--home";
    shell.innerHTML = `<p class="loading">Chargement…</p>`;

    try {
        const data = await fetchHomeData();

        const content = document.createDocumentFragment();

        content.appendChild(
            Hero({
                firstName: data.profile.firstName,
                lastName: data.profile.lastName,
                role: data.profile.role,
                bio: data.profile.bio,
                status: data.profile.status,
                location: data.profile.location,
                logo: data.profile.logo
            })
        );

        content.appendChild(
            FeaturedProjects({
                projects: data.projects,
                centerImage: {
                    url: "https://placehold.co/500x900/1a1a1a/EDE9DD?text=Fritzi",
                    alt: "Portrait de Fritzi Frois"
                }
            })
        );

        content.appendChild(AboutMe(data.aboutMe));

        content.appendChild(
            SkillsSection({
                content: data.about,
                offerings: data.offerings
            })
        );

        return Layout(content);
    } catch (error) {
        shell.innerHTML = `<p class="error">Erreur de chargement : ${error.message}</p>`;
        console.error("[HomePage]", error);
        return shell;
    }
}
```

- [ ] **Step 2: Vérifier manuellement**

Serveur Strapi lancé (`cd motion_craft && npm run develop`) avec au moins 2 projets `featured: true` publiés, serveur statique lancé à la racine (`npx serve .` ou équivalent), ouvrir `http://localhost:8080/fritzi/index.html`.
Expected : la page affiche le nom/rôle/bio saisis dans `fritzi-profile`, les 2 projets `featured`, le bloc "About me" et la liste des offerings — sans passer par les mocks.

- [ ] **Step 3: Commit**

Affiche cette commande à l'utilisateur, ne l'exécute pas :

```bash
git add pages/fritzi/home.js
git commit -m "feat: wire fritzi HomePage to Strapi"
```

---

## Task 11: Brancher `pages/fritzi/about.js`

**Files:**
- Modify: `pages/fritzi/about.js`

**Interfaces:**
- Consumes : `fetchAboutData()`, `fetchProfile()`, `fetchContactInfo()` (Task 9).

- [ ] **Step 1: Remplacer le contenu de `pages/fritzi/about.js`**

```js
import { Nav } from "../../components/fritzi/nav.js";
import { AboutHero } from "../../components/fritzi/about/about-hero.js";
import { AboutSkillsSection } from "../../components/fritzi/about/about-skills-section.js";
import { ContactFooter } from "../../components/fritzi/contact-footer.js";

import { fetchAboutData, fetchProfile, fetchContactInfo } from "../../services/fritzi-content-service.js";

/**
 * Rendu de la page About.
 * @returns {Promise<HTMLElement>}
 */
export async function AboutPage() {
    const page = document.createElement("div");
    page.className = "page page--about";
    page.innerHTML = `<p class="loading">Chargement…</p>`;

    try {
        const [data, profile, contact] = await Promise.all([
            fetchAboutData(),
            fetchProfile(),
            fetchContactInfo(),
        ]);
        page.innerHTML = "";

        page.appendChild(Nav({ logo: profile.logo, year: profile.year }));
        page.appendChild(AboutHero(data.hero));
        page.appendChild(
            AboutSkillsSection({ content: data.skillsContent, offerings: data.offerings })
        );
        page.appendChild(ContactFooter(contact));
    } catch (error) {
        page.innerHTML = `<p class="error">Erreur de chargement : ${error.message}</p>`;
        console.error("[AboutPage]", error);
    }

    return page;
}
```

- [ ] **Step 2: Vérifier manuellement**

Ouvrir `http://localhost:8080/fritzi/about.html`.
Expected : le hero About, le bloc skills avec offerings + liens "related work", et le footer contact affichent le contenu saisi dans Strapi (`fritzi-about`, `fritzi-home`, `fritzi-profile`).

- [ ] **Step 3: Commit**

Affiche cette commande à l'utilisateur, ne l'exécute pas :

```bash
git add pages/fritzi/about.js
git commit -m "feat: wire fritzi AboutPage to Strapi"
```

---

## Task 12: Brancher `pages/fritzi/work.js`

**Files:**
- Modify: `pages/fritzi/work.js`

**Interfaces:**
- Consumes : `fetchWorkData()`, `fetchProfile()`, `fetchContactInfo()` (Task 9).

- [ ] **Step 1: Remplacer le contenu de `pages/fritzi/work.js`**

```js
import { Nav } from "../../components/fritzi/nav.js";
import { WorkHeader } from "../../components/fritzi/work/work-header.js";
import { ProjectCarousel } from "../../components/fritzi/work/project-carousel.js";
import { ContactFooter } from "../../components/fritzi/contact-footer.js";

import { fetchWorkData, fetchProfile, fetchContactInfo } from "../../services/fritzi-content-service.js";

/**
 * Rendu de la page Work.
 * @returns {Promise<HTMLElement>}
 */
export async function WorkPage() {
    const page = document.createElement("div");
    page.className = "page page--work";
    page.innerHTML = `<p class="loading">Chargement…</p>`;

    try {
        const [projects, profile, contact] = await Promise.all([
            fetchWorkData(),
            fetchProfile(),
            fetchContactInfo(),
        ]);
        page.innerHTML = "";

        page.appendChild(Nav({ logo: profile.logo, year: profile.year }));
        page.appendChild(
            WorkHeader({
                title: "Work",
                eyebrow: `${projects.length} projects featured`
            })
        );
        page.appendChild(ProjectCarousel({ projects }));
        page.appendChild(ContactFooter(contact));
    } catch (error) {
        page.innerHTML = `<p class="error">Erreur de chargement : ${error.message}</p>`;
        console.error("[WorkPage]", error);
    }

    return page;
}
```

- [ ] **Step 2: Vérifier manuellement**

Ouvrir `http://localhost:8080/fritzi/work.html`.
Expected : le carrousel affiche tous les projets publiés dans Strapi, dans l'ordre du champ `order`, avec le bon compteur dans le badge.

- [ ] **Step 3: Commit**

Affiche cette commande à l'utilisateur, ne l'exécute pas :

```bash
git add pages/fritzi/work.js
git commit -m "feat: wire fritzi WorkPage to Strapi"
```

---

## Task 13: Brancher `pages/fritzi/contact.js`

**Files:**
- Modify: `pages/fritzi/contact.js`

**Interfaces:**
- Consumes : `fetchContactData()` (Task 9).

- [ ] **Step 1: Remplacer le contenu de `pages/fritzi/contact.js`**

```js
import { Layout } from "../../components/fritzi/layout.js";
import { ContactHero } from "../../components/fritzi/contact/contact-hero.js";
import { ContactForm } from "../../components/fritzi/contact/contact-form.js";
import { fetchContactData } from "../../services/fritzi-content-service.js";

export async function ContactPage() {
    const data = await fetchContactData();
    const hero = ContactHero({ portrait: data.portrait });
    hero.appendChild(ContactForm({ sendLabel: "Send me" }));

    return Layout(hero);
}
```

- [ ] **Step 2: Vérifier manuellement**

Ouvrir `http://localhost:8080/fritzi/contact.html`.
Expected : le portrait du hero contact vient de `fritzi-contact` dans Strapi ; le formulaire reste inchangé (toujours `fakeSendMessage`, hors périmètre).

- [ ] **Step 3: Commit**

Affiche cette commande à l'utilisateur, ne l'exécute pas :

```bash
git add pages/fritzi/contact.js
git commit -m "feat: wire fritzi ContactPage to Strapi"
```

---

## Task 14: Brancher `pages/fritzi/project-detail.js`

**Files:**
- Modify: `pages/fritzi/project-detail.js`

**Interfaces:**
- Consumes : `fetchProjectDetail(slug)`, `fetchProfile()`, `fetchContactInfo()` (Task 9).

- [ ] **Step 1: Remplacer le contenu de `pages/fritzi/project-detail.js`**

```js
import { Nav } from "../../components/fritzi/nav.js";
import { ProjectSubbar } from "../../components/fritzi/projet/project-subbar.js";
import { ProjectHeader } from "../../components/fritzi/projet/projet-header.js";
import { FramedImage } from "../../components/fritzi/projet/framed-image.js";
import { ProjectOverview } from "../../components/fritzi/projet/projet-overview.js";
import { TextImageBlock } from "../../components/fritzi/projet/text-image.js";
import { ProjectChallenge } from "../../components/fritzi/projet/challenge.js";
import { NextProject } from "../../components/fritzi/projet/next-project.js";
import { ContactFooter } from "../../components/fritzi/contact-footer.js";

import { fetchProjectDetail, fetchProfile, fetchContactInfo } from "../../services/fritzi-content-service.js";

/**
 * Rendu de la page détail projet.
 * @param {string} [slug] - slug du projet à afficher (vient du routeur)
 * @returns {Promise<HTMLElement>}
 */
export async function ProjectDetailPage(slug) {
    const page = document.createElement("div");
    page.className = "page page--project-detail";
    page.innerHTML = `<p class="loading">Chargement…</p>`;

    try {
        const [project, profile, contact] = await Promise.all([
            fetchProjectDetail(slug),
            fetchProfile(),
            fetchContactInfo(),
        ]);
        page.innerHTML = "";

        page.appendChild(Nav({ logo: profile.logo, year: profile.year }));
        page.appendChild(
            ProjectSubbar({ eyebrow: project.eyebrow, closeHref: "../index.html" })
        );
        page.appendChild(ProjectHeader({ title: project.title, meta: project.meta }));
        page.appendChild(
            FramedImage({ ...project.heroImage, className: "project-hero-image" })
        );
        page.appendChild(ProjectOverview(project.overview));
        page.appendChild(
            TextImageBlock({
                eyebrow: project.discovery.eyebrow,
                paragraphs: project.discovery.paragraphs,
                image: project.discovery.image,
                order: "text-first"
            })
        );
        page.appendChild(ProjectChallenge(project.challenge));
        page.appendChild(
            TextImageBlock({
                eyebrow: project.outcome.eyebrow,
                heading: project.outcome.heading,
                paragraphs: project.outcome.paragraphs,
                image: project.outcome.image,
                order: "image-first"
            })
        );
        if (project.nextProject) page.appendChild(NextProject(project.nextProject));
        page.appendChild(ContactFooter(contact));
    } catch (error) {
        page.innerHTML = `<p class="error">Erreur de chargement : ${error.message}</p>`;
        console.error("[ProjectDetailPage]", error);
    }

    return page;
}
```

Le seul changement de comportement par rapport à l'original : `NextProject` n'est ajouté que si `project.nextProject` existe (cas où Strapi ne contient qu'un seul projet publié).

- [ ] **Step 2: Vérifier manuellement**

`fritzi/projet.html` charge la page avec `ProjectDetailPage()` sans argument (pas de lecture de query string dans le fichier actuel) — ouvrir `http://localhost:8080/fritzi/projet.html` et vérifier que le premier projet Strapi (par `order`) s'affiche avec toutes ses sections (overview, discovery, challenge, outcome, next project).
Expected : toutes les sections affichent le contenu Strapi, pas d'erreur dans la console.

- [ ] **Step 3: Commit**

Affiche cette commande à l'utilisateur, ne l'exécute pas :

```bash
git add pages/fritzi/project-detail.js
git commit -m "feat: wire fritzi ProjectDetailPage to Strapi"
```

---

## Task 15: Vérification de bout en bout

**Files:**
- Aucun (vérification manuelle).

- [ ] **Step 1: Lancer les deux serveurs**

Run: `cd motion_craft && npm run develop` (laisser tourner dans un terminal)
Run (autre terminal, à la racine du repo) : `npx serve .` (ou Live Server / `python -m http.server 8080`)

- [ ] **Step 2: Modifier une donnée dans Strapi et vérifier qu'elle apparaît sur le site**

Dans l'admin Strapi (`http://localhost:1337/admin`), modifier `bio` sur `Fritzi Profile`, sauvegarder, puis recharger `http://localhost:8080/fritzi/index.html`.
Expected : le nouveau texte apparaît dans le hero sans aucune modification de code.

- [ ] **Step 3: Vérifier le comportement d'erreur si Strapi est arrêté**

Arrêter le serveur Strapi (`Ctrl+C`), recharger chacune des 5 pages fritzi.
Expected : chaque page affiche `<p class="error">Erreur de chargement : ...</p>` (pas de fallback silencieux, comme décidé dans le spec), et la console affiche l'erreur correspondante.

- [ ] **Step 4: Faire tourner la suite de tests complète**

Redémarrer Strapi, ouvrir `http://localhost:8080/tests/index.html`.
Expected : résumé final "X test(s) réussi(s), 0 en échec."
