# Branchement des templates fritzi à Strapi

Date : 2026-08-17

## Contexte

Les templates de la nouvelle direction artistique (`pages/fritzi/*.js`, `components/fritzi/**`, prévisualisés via `fritzi/*.html`) sont designés et fonctionnels, mais consomment des données statiques depuis `mocks/fritzi/*.js` via des fonctions `fakeFetchXxx()`. Le code contient déjà des commentaires anticipant le branchement réel (`/** Simule un futur fetch Strapi (lib/cms.js -> fetchOne("fritzi-page-about")) */`).

Le backend Strapi 5 existe déjà (`motion_craft/`, scaffoldé, SQLite) mais n'a **aucun content-type** créé (`src/api/.gitkeep`).

Objectif : que l'édition du contenu de ces pages se fasse **directement dans l'admin Strapi**, sans passer par une interface custom sur le site.

## Hors périmètre (décidé en amont)

- Le formulaire de contact (`components/fritzi/contact/contact-form.js`) reste sur `fakeSendMessage` — son envoi réel est prévu dans un autre lot (commentaire existant dans le code : "service de mailing choisi dans l'appel d'offres Lot 2").
- L'ancien système CMS générique (`services/portfolio-service.js`, `services/auth-service.js`, `pages/admin-page.js`, `pages/login-page.js`, routes `/admin` et `/connexion`) n'est pas modifié.
- Le routage SPA (`routes/index.js`) n'est pas modifié. Les pages fritzi restent accessibles via les fichiers `fritzi/*.html` qui bootstrapent chaque page isolément — l'intégration au routeur principal sera une tâche séparée.
- Aucun fallback silencieux vers les mocks si Strapi est injoignable : les pages gardent leur comportement actuel d'affichage d'erreur (`page.innerHTML = "<p class='error'>Erreur de chargement…"`).
- La saisie du contenu définitif (textes finaux, vraies photos) dans l'admin Strapi n'est pas faite par cette tâche — c'est l'objectif final que ce travail permet.

## Architecture

- Les composants (`Hero`, `AboutHero`, `FeaturedProjects`, `ProjectCarousel`, `AboutSkillsSection`, etc.) ne changent pas.
- Nouveau module `services/fritzi-content-service.js`, qui s'appuie sur le client CMS existant (`services/cms-client.js` → `lib/cms.js`, déjà configuré via `config.cmsUrl`, défaut `http://localhost:1337`).
- Ce service expose une fonction par page (`fetchHomeData`, `fetchAboutData`, `fetchWorkData`, `fetchContactData`, `fetchProjectDetail(slug)`) qui interroge Strapi puis **mappe la réponse vers la forme exacte des mocks actuels** (mêmes clés, mêmes formes d'objets média `{url, alt}`), afin qu'aucun composant n'ait à changer.
- Chaque page `pages/fritzi/*.js` remplace sa fonction `fakeFetchXxx()`/ses imports de mocks par un appel à ce service. Le `try/catch` existant (état `loading` → `error`) est conservé tel quel.
- Réutilisation de la logique déjà écrite dans `services/portfolio-service.js` pour la résolution d'URL média (`mediaUrl()` : préfixe les chemins relatifs avec `client.baseUrl`, gère les champs déjà aplatis ou non) plutôt que de la redupliquer.

## Content-types Strapi

Les logos/icônes décoratifs du design system (SVG dans `assets/fritzi/`) restent en dur dans le code — ce ne sont pas des champs Strapi. Seul le contenu éditorial (textes, portraits, covers, images de contenu) passe par Strapi.

### `fritzi-profile` (Single Type)

Identité + contact, utilisée par `Nav`, le hero Home et `ContactFooter`.

| Champ | Type | Correspond à |
|---|---|---|
| firstName, lastName | Text | `profileMock.firstName/lastName` |
| role | Text | `profileMock.role` |
| bio | Text (long) | `profileMock.bio` |
| statusLabel | Text | `profileMock.status.label` |
| statusActive | Boolean | `profileMock.status.active` |
| location | Text | `profileMock.location` |
| year | Text | `profileMock.year` |
| email | Email | `contactMock.email` |
| linkedin | Text (URL) | `contactMock.linkedin` |
| instagram | Text (URL) | `contactMock.instagram` |

### `fritzi-home` (Single Type)

| Champ | Type | Correspond à |
|---|---|---|
| aboutHeading | Text | `aboutMeMock.heading` |
| quoteLead, quoteHighlight1, quoteConnector, quoteHighlight2, quoteTail | Text | `aboutMeMock.quote.*` |
| aboutCaption | Text (long) | `aboutMeMock.caption` |
| aboutPortrait | Media (image) | `aboutMeMock.portrait` |
| skillsEyebrow, skillsLine1, skillsConnector, skillsLine2 | Text | `aboutMock.eyebrow/line1/connector/line2` |
| skillsParagraphs | Rich text / JSON | `aboutMock.paragraphs` |
| cvLabel | Text | `aboutMock.cvLabel` |
| cvFile | Media (fichier) | lien de téléchargement du CV |
| offeringsImage | Media (image) | `aboutMock.offeringsImage` |
| offerings | Composant répétable `offering` | `offeringsMock` (voir ci-dessous) |

Composant `offering` (réutilisé aussi par `fritzi-about`) :

| Champ | Type | Correspond à |
|---|---|---|
| number | Text | "01", "02"… |
| title | Text | "Front-end"… |
| tag | Text (optionnel) | `offeringsMock[].tag` ("Related work") |
| tools | Text | `offeringsMock[].tools` |
| work | JSON (liste de strings, optionnel) | `offeringsMock[].work` |
| relatedWork | Composant répétable `related-project` (optionnel) `{label, project: relation vers fritzi-project}` | `offeringsWithLinksMock[].relatedWork` |

### `fritzi-about` (Single Type)

| Champ | Type | Correspond à |
|---|---|---|
| heroRole | Text | `aboutHeroMock.role` |
| heroLocationLabel | Text | `aboutHeroMock.locationLabel` |
| heroLocation | Text | `aboutHeroMock.location` |
| heroPortrait | Media (image) | `aboutHeroMock.portrait` |
| heroParagraphs | JSON (liste de strings) | `aboutHeroMock.paragraphs` |
| offerings | Composant répétable `offering` (même composant que `fritzi-home`, avec `relatedWork` rempli) | `offeringsWithLinksMock` |

Le bloc "skills/offerings" textuel (eyebrow/paragraphs/cvLabel/offeringsImage) affiché sur la page About est **le même contenu que celui de `fritzi-home`** (les mocks actuels importent déjà `aboutMock` depuis le même fichier pour les deux pages) — `fetchAboutData()` réutilisera donc les champs `skills*` de `fritzi-home` plutôt que de les dupliquer.

### `fritzi-contact` (Single Type)

| Champ | Type | Correspond à |
|---|---|---|
| heroPortrait | Media (image) | `contactHeroMock.portrait` |
| headingWords | JSON (liste de strings) | `contactMock.heading` (`["Come","say","hi"]`) |

### `fritzi-project` (Collection Type, Draft & Publish activé)

| Champ | Type | Correspond à |
|---|---|---|
| slug | Text (UID sur `title`) | `slug` |
| client | Text | `client` |
| label | Text | `label` |
| cover | Media (image) | `cover` |
| featured | Boolean | affichage sur la home |
| order | Number (int) | ordre d'affichage dans Work/carousel |
| title | Text | `title` |
| eyebrow | Text | `eyebrow` |
| meta | Composant répétable `meta-item` `{label, value}` | `meta` |
| heroImage | Media (image) | `heroImage` |
| overview | Composant `overview` `{sideLabel, eyebrow, heading, paragraphs(JSON)}` | `overview` |
| discovery | Composant `text-image-block` `{eyebrow, heading, paragraphs(JSON), image}` | `discovery` |
| challenge | Composant `challenge` `{eyebrow, heading, paragraphs(JSON), backgroundImage}` | `challenge` |
| outcome | Composant `text-image-block` `{eyebrow, heading, paragraphs(JSON), image}` | `outcome` |

Le bloc `nextProject` n'est **pas stocké** : `fetchProjectDetail(slug)` le calcule en prenant le projet suivant selon `order` (avec retour au premier après le dernier) parmi les projets publiés.

## Permissions Strapi

Dans **Settings → Users & Permissions → Roles → Public**, activer `find`/`findOne` sur les 5 content-types ci-dessus + `find` sur Upload, pour que le front lise le contenu sans token. Le token JWT existant dans `auth-service.js` reste réservé à l'ancien système admin, non touché.

## Fichiers impactés (aperçu, détaillé dans le plan d'implémentation)

- `motion_craft/src/api/**` (nouveaux content-types + composants, créés via Content-Type Builder ou schémas)
- `services/fritzi-content-service.js` (nouveau)
- `pages/fritzi/home.js`, `about.js`, `work.js`, `contact.js`, `project-detail.js` (remplacement des `fakeFetchXxx`)
- Pas de changement dans `mocks/fritzi/*.js` (conservés dans le repo, mais plus importés par les pages une fois branchées)
