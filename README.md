# Vanilla-Engine & Générateur de portfolio

Micro-framework JavaScript sans dépendance (« Vanilla-Engine ») et application de portfolio/CV construite avec ce framework, connectée au CMS headless **Strapi**.

Aucune librairie tierce, aucun task-runner : uniquement des modules ES natifs, des Promises et les prototypes natifs.

---

## Démarrage

Les modules ES imposent un serveur HTTP (le protocole `file://` est bloqué par le navigateur).

- **VS Code** : extension *Live Server*, clic droit sur `index.html` → *Open with Live Server*.
- **Node** (si disponible) : `npx serve .`
- **Python** : `python -m http.server 8080`

Puis ouvrir `http://localhost:8080/`.

Les tests s'exécutent dans le navigateur : `http://localhost:8080/tests/index.html`.

### Configuration

`config.js` définit les valeurs par défaut. Elles sont surchargeables sans toucher au code, depuis le back-office (onglet **Publication**) ou via la console :

```js
localStorage.setItem("portfolio.config", JSON.stringify({ cmsUrl: "https://cms.mon-domaine.fr" }));
```

| Clé | Défaut | Rôle |
| --- | --- | --- |
| `cmsUrl` | `http://localhost:1337` | Racine de l'API Strapi |
| `timeout` | `8000` | Délai maximal d'une requête (ms) |
| `retries` | `2` | Nombre de tentatives supplémentaires |
| `basePath` | `""` | Préfixe si le site est servi dans un sous-dossier |

---

## Architecture

```
lib/            le framework Vanilla-Engine (générique, réutilisable)
components/     composants d'interface (routeur, layout, UI)
pages/          les écrans de l'application
routes/         table de routes
services/       accès au CMS, authentification, amorçage
store/          état applicatif
data/           contenu de démarrage
styles/         feuilles de style
tests/          suite de tests exécutée dans le navigateur
```

### Le moteur (`lib/`)

| Module | Rôle |
| --- | --- |
| `generate-structure.js` | Transforme une structure JS en DOM réel, résout les composants |
| `render.js` | Diffing DOM : ne remplace que ce qui a changé |
| `attributes.js` | Application et suppression des attributs, classes, styles, `data-*` |
| `store.js` | State management réactif (get / set / subscribe) |
| `props.js` | Validation des props des composants |
| `interpolate.js` | `String.prototype.interpolate(data)` |
| `http.js` | Helper Promises : timeout, retry, erreurs typées |
| `cms.js` | Client Strapi construit au-dessus de `http.js` |
| `path.js` | Lecture/écriture immuable par chemin (`profile.links.0.url`) |
| `seo.js` | Titre, meta description, Open Graph, canonique |
| `text.js` | Slugs, dates, extraits, initiales |

---

## API du framework

### Structures et rendu

Une vue est un objet JavaScript décrivant du DOM :

```js
{
  type: "a",                                  // balise ou fonction composant
  key: "unique",                              // facultatif, pour les listes
  attributes: [["href", "/projets"], ["class", ["link"]]],
  events: [["click", handler]],
  children: ["Projets"]                       // chaînes ou structures imbriquées
}
```

Cas particuliers d'attributs : `class` accepte un tableau, `style` un tableau de paires ou un objet, `data-*` alimente le `dataset`, et `value` / `checked` / `disabled` / `selected` sont appliqués comme propriétés (indispensable pour les champs de formulaire).

```js
import generateStructure from "./lib/generate-structure.js";
import { createRoot } from "./lib/render.js";

document.body.appendChild(generateStructure({ type: "h1", children: ["Bonjour"] }));

const render = createRoot(document.getElementById("root"));
render({ type: "h1", children: ["Bonjour"] });
render({ type: "h1", children: ["Rebonjour"] });   // seul le texte est modifié
```

`createRoot` conserve l'arbre précédent et applique un diff : les nœuds inchangés ne sont jamais recréés, ce qui préserve le focus, la position du curseur et l'état de défilement pendant un re-render. Les enfants portant une `key` sont réconciliés par identité plutôt que par position.

### Composants et validation des props

```js
import defineComponent from "./lib/props.js";

const Badge = defineComponent(
  "Badge",
  {
    label: { type: "string", required: true },
    tone: { type: "string", default: "info", values: ["info", "error"] },
  },
  ({ label, tone }) => ({ type: "span", attributes: [["class", [tone]]], children: [label] }),
);

Badge({ label: "Nouveau" });                        // appel direct
{ type: Badge, attributes: [["label", "Nouveau"]] } // ou comme type d'une structure
```

Règles disponibles : `type` (`string`, `number`, `boolean`, `array`, `object`, `function`), `required`, `default`, `values`, `validate`. Une prop non conforme lève une `PropsError`.

### State management

```js
import createStore from "./lib/store.js";

const store = createStore({ profile: { name: "" } }, { persist: "ma-cle" });

store.subscribe((state) => console.log(state));
store.set("profile.name", "Abdoulaye");   // écriture par chemin, sans mutation
store.get("profile.name");
store.update({ status: "ready" });
```

Les notifications sont regroupées dans une micro-tâche : plusieurs `set` successifs ne déclenchent qu'un seul rendu. Un `set` avec une valeur identique ne notifie pas.

### Routeur

```js
import BrowserRouter from "./components/router/browser-router.js";

BrowserRouter(rootElement, {
  "/": HomePage,
  "/projets/:slug": ProjectPage,
  "*": NotFoundPage,
}, { store });
```

Chaque page reçoit `{ path, params, query, pattern }`. Les routes statiques sont testées avant les routes dynamiques. En passant le `store`, le routeur se réabonne et re-rend automatiquement à chaque changement d'état.

`navigate("/projets")` change l'URL sans rechargement ; le composant `Link` l'utilise et respecte les clics avec `Ctrl`/`Cmd`.

### Interpolation

```js
import "./lib/interpolate.js";

"Type : {{ type.name }}".interpolate({ type: { name: "chien" } }); // "Type : chien"
"{{ tags[0] }}".interpolate({ tags: ["SPA"] });                    // "SPA"
```

Une clé absente est remplacée par une chaîne vide. Le résultat est toujours inséré via `createTextNode` : aucun HTML n'est interprété, ce qui protège des injections.

### Appels réseau

```js
import { request, HttpError } from "./lib/http.js";

try {
  const data = await request("https://cms.example.fr/api/projects", {
    query: { sort: "date:desc", pagination: { pageSize: 100 } },
    timeout: 5000,
    retries: 2,
  });
} catch (error) {
  if (error instanceof HttpError) console.error(error.status, error.message);
}
```

Le helper gère l'annulation par `AbortController`, la sérialisation des query imbriquées au format Strapi, le `JSON.stringify` automatique du corps, et rejoue uniquement les erreurs réseau, les 429 et les 5xx (jamais un 4xx). Les messages d'erreur sont déjà rédigés en français et affichables tels quels.

### Client CMS

```js
import { createCmsClient } from "./lib/cms.js";

const client = createCmsClient({ baseUrl: "http://localhost:1337" });

await client.fetchCMS("api/projects", { query: { populate: "*" } });
const { items, pagination } = await client.find("projects", { sort: "date:desc" });
```

Les réponses Strapi (`{ data: { id, attributes } }`) sont aplaties récursivement en objets simples, y compris pour les relations et les médias.

---

## L'application

| Route | Écran |
| --- | --- |
| `/` | Page d'accueil : profil, compétences, parcours, projets mis en avant, contact |
| `/projets` | Liste paginée avec filtre par technologie |
| `/projets/:slug` | Détail d'un projet |
| `/admin` | Back-office (profil, compétences, expériences, projets, médiathèque, publication, conformité) |
| `/connexion` | Authentification Strapi |
| `/mentions-legales` | Mentions légales, données collectées, droit à l'effacement |
| `/demo/table`, `/demo/gallery` | Démos du moteur héritées de la base de départ |

Les anciennes adresses `/projects`, `/portfolio`, `/home`, `/login` et `/legal` sont redirigées vers leur équivalent français (`REDIRECTS` dans `routes/index.js`).

Le back-office écrit dans le store à chaque frappe : l'aperçu latéral et l'en-tête se mettent à jour instantanément, sans rechargement.

### Mode local

Si le CMS est injoignable, l'application affiche les contenus locaux et signale la source dans le pied de page. Le bouton **Éditer en mode local** ouvre le back-office sans compte Strapi ; les modifications restent dans le `localStorage` du navigateur et ne sont jamais publiées.

---

## Connexion à Strapi

### Types de contenu à créer

**Single type `profile`** — `name`, `title` (texte), `bio`, `seoDescription` (texte long), `email`, `phone`, `location` (texte), `avatar` (média), `avatarAlt` (texte), `links` (JSON).

**Collection `experiences`** — `role`, `company`, `location` (texte), `startDate`, `endDate` (texte, format `AAAA-MM`), `current` (booléen), `description` (texte long).

**Collection `projects`** — `title`, `slug` (UID sur `title`), `summary` (texte), `description` (texte long), `image` (média), `imageAlt` (texte), `tags` (JSON), `url`, `repository` (texte), `date` (texte `AAAA-MM`), `featured` (booléen), `state` (énumération : `draft`, `review`, `published`, `archived`).

**Collection `skills`** — `name` (texte), `category` (énumération : Front-end, Back-end, Gestion de projet, Design, Outils), `level` (entier 1–5).

Le champ `state` porte le workflow éditorial à quatre états exigé par le sujet. Si un contenu remonte de Strapi sans ce champ, l'application retombe sur `publishedAt` pour déduire l'état.

### Permissions

Dans *Settings → Users & Permissions → Roles* :

- **Public** : `find` et `findOne` sur `profile`, `experiences`, `projects`, `skills`.
- **Authenticated** : ajouter `create`, `update`, `delete` sur ces mêmes types, plus `upload` et `destroy` sur le plugin *Upload* pour la médiathèque.
- **Authenticated** (fritzi) : `find`, `findOne`, `create`, `update`, `delete` sur `fritzi-project` ; `find`, `findOne`, `update` sur `fritzi-home`, `fritzi-about`, `fritzi-contact`, `fritzi-profile` ; `find` sur le plugin *Upload* (le rôle Public a `find`/`findOne` sur `fritzi-project` pour le site public, mais Strapi évalue les permissions selon le rôle de l'utilisateur connecté — être authentifié ne fait pas hériter des permissions de Public, donc `find`/`findOne` doivent être accordés explicitement au rôle Authenticated aussi, sans quoi `/fritzi/admin` échoue en 403 même en étant connecté).

Le rôle `Reader` (lecteur) est reconnu par l'application : il donne accès au back-office en consultation, mais le bouton de publication reste désactivé.

### CORS

Autoriser l'origine du portfolio dans `config/middlewares.js` de Strapi, sinon le navigateur bloque les requêtes.

### Workflow de publication

Un projet a un statut *Brouillon* ou *Publié*. Seuls les projets publiés apparaissent sur les pages publiques ; le statut est transmis à Strapi via `publishedAt`.

---

## Documentation fonctionnelle : éditer son portfolio

1. Ouvrir `/admin`. Se connecter avec un compte Strapi, ou choisir **Éditer en mode local** pour travailler sans serveur.
2. **Profil** : nom, titre, biographie, coordonnées, liens externes et meta description utilisée par les moteurs de recherche.
3. **Compétences** : chaque ligne porte un intitulé, une catégorie et un niveau de 1 à 5. Les catégories deviennent les groupes affichés sur la page d'accueil.
4. **Expériences** : poste, entreprise, période. Cocher « Poste en cours » remplace la date de fin par « aujourd'hui ».
5. **Projets** : le slug se génère depuis le titre et détermine l'URL publique. L'**état éditorial** contrôle la visibilité.
6. **Médiathèque** : envoyer une image (10 Mo max) ou coller une URL. Le texte alternatif est obligatoire, puis l'URL se copie dans le champ image d'un projet.
7. **Publication** : envoyer vers Strapi, recharger, exporter ou importer un JSON.
8. **Conformité** : consulter le journal d'audit et exercer le droit à l'effacement.

Chaque frappe met à jour l'aperçu de droite en direct : c'est le store réactif et le diffing qui travaillent, sans rechargement de page.

### États éditoriaux

| État | Visible publiquement | Usage |
| --- | --- | --- |
| Brouillon | non | Travail en cours |
| Prêt à relire | non | En attente de relecture |
| Publié | **oui** | Visible sur `/` et `/projets` |
| Archivé | non | Retiré du site sans être supprimé |

Un projet non publié disparaît des listes **et** sa page de détail renvoie une 404 : l'URL ne laisse rien fuiter.

---

## Tests

`tests/index.html` exécute 53 tests couvrant l'interpolation, le store, la validation des props, le moteur de rendu et son diffing, la résolution des routes, la construction des requêtes, la normalisation des réponses Strapi, le workflow éditorial, le journal d'audit et le thème. Le bandeau en haut de page indique le nombre de réussites et d'échecs.

---

## Mise en production

Le site est entièrement statique : n'importe quel hébergeur de fichiers convient (Netlify, Vercel, GitHub Pages, VPS).

Une seule contrainte : le routeur utilisant `history.pushState`, le serveur doit renvoyer `index.html` pour toute URL inconnue, sinon un rechargement sur `/projets/mon-projet` renvoie une 404. Le fichier `_redirects` fourni couvre Netlify ; sur Apache, une règle `FallbackResource /index.html` suffit.

Avant de déployer : remplacer le domaine `exemple.fr` dans `robots.txt` et `sitemap.xml`, et renseigner l'URL du CMS de production dans l'onglet **Publication**.

---

## Charte graphique

Le design suit la maquette Figma du workshop (MotionCraft). Tous les tokens sont dans `styles/base.css` : changer une variable suffit à répercuter la modification sur tout le site.

| Token | Valeur claire | Rôle |
| --- | --- | --- |
| `--surface` | `#faf9f7` | Fond de page, off-white chaud |
| `--surface-raised` | `#ffffff` | Cartes, panneaux, champs |
| `--ink` | `#111111` | Boutons principaux, pastille du logo |
| `--accent` | `#2f62f5` | Liens, badges, bouton Back-office |
| `--text-muted` | `#6d6b63` | Textes secondaires |
| `--radius-pill` | `999px` | Boutons et filtres |
| `--font-serif` | pile serif système | Titres d'affichage (h1, h2) |

Les titres utilisent une pile serif système et le corps de texte une pile sans-serif système : aucune police n'est téléchargée, donc aucune requête externe ni dépendance. Le halo dégradé bleu/lavande en haut de page est un élément décoratif pur CSS (`.decor`), masqué aux lecteurs d'écran.

Le thème sombre inverse `--ink` et `--ink-contrast` : les boutons noirs deviennent clairs, ce qui conserve le contraste sans dupliquer de règles.

---

## Accessibilité et sécurité

Navigation au clavier avec lien d'évitement, `aria-current` sur l'onglet actif, libellés associés à chaque champ, `aria-label` sur les jauges de niveau et les boutons d'icône, contrastes conformes en thème clair comme sombre, et respect de `prefers-reduced-motion`.

Aucun `innerHTML` n'est utilisé dans le code : tout texte passe par `createTextNode`, ce qui neutralise les injections HTML. Le jeton Strapi est conservé en `sessionStorage` et disparaît à la fermeture de l'onglet.

Côté RGPD, une bannière de consentement s'affiche à la première visite (refus possible en un clic, aucun traceur n'est chargé avant le choix), la page `/mentions-legales` détaille les données traitées, et le droit à l'effacement est exerçable depuis cette page comme depuis l'onglet Conformité. Le journal d'audit se limite à la date, l'action, la cible et le nom d'utilisateur, plafonné à 100 entrées et purgé au bout de 30 jours.

---

## Traçabilité des exigences du sujet

| Exigence du sujet | Où c'est traité |
| --- | --- |
| Moteur de rendu sans bibliothèque tierce | `lib/generate-structure.js`, `lib/render.js` |
| Routeur interne (SPA, historique) | `components/router/` |
| State management réactif | `lib/store.js` |
| Validation des entrées de composants | `lib/props.js` |
| `String.interpolate(objet)` | `lib/interpolate.js` |
| Prototypes natifs, modules ES, Promises | `lib/interpolate.js`, tout le code, `lib/http.js` |
| Interface d'édition | `pages/admin/` |
| Système de templates | `pages/`, `components/ui/` |
| Consommation du CMS headless | `lib/cms.js`, `services/portfolio-service.js` |
| CRUD + workflow brouillon → relire → publié → archivé | `data/workflow.js`, `pages/admin/projects-section.js` |
| Authentification et rôles Admin/Lecteur | `services/auth-service.js` |
| Journal d'audit horodaté | `lib/audit.js`, `pages/admin/privacy-section.js` |
| Médiathèque (upload, alt text) | `pages/admin/media-section.js` |
| SEO : titres, meta, slugs, sitemap, robots | `lib/seo.js`, `lib/text.js`, `sitemap.xml`, `robots.txt` |
| URL rewriting, 404, redirections | `components/router/match-route.js`, `REDIRECTS` |
| API publique read-only, pagination, filtres | Fournie par Strapi ; consommée via `lib/cms.js` |
| RGPD : mentions, consentement, effacement | `pages/legal-page.js`, `components/ui/cookie-banner.js` |
| Protections XSS | Aucun `innerHTML` ; tout passe par `createTextNode` |
| Accessibilité | Lien d'évitement, ARIA, contrastes, `prefers-reduced-motion` |
| Composants réutilisables (header, footer, pagination) | `components/layout/`, `components/ui/pagination.js` |

**Fonctionnalités supplémentaires** (le sujet plafonne à /5 et conseille d'en finir deux plutôt que d'en ébaucher six) : **multi-thèmes** (bascule système/clair/sombre persistée, `lib/theme.js`) et **import/export JSON** des contenus (onglet Publication).

---

## Répartition des tâches

Projet à trois. Ce dépôt correspond au périmètre de la **personne C**.

| Lot | Responsable | État |
| --- | --- | --- |
| Store réactif, `String.interpolate` | A | livré ici, à confronter avec la version de A |
| Routes dynamiques, validation des props | B | livré ici, à confronter avec la version de B |
| Helper Promises `fetchCMS`, gestion des erreurs réseau | **C** | livré |
| Diffing DOM et ses tests | **C** | livré |
| Formulaire profil + compétences | **C** | livré |
| Connexion CMS de mon contenu | **C** | livré |
| Page d'accueil et composants réutilisables | **C** | livré |
| Suppression d'`index_vanilla.js` | **C** | livré |
| Suppression d'`index2.js` | B | livré |
| Correction de `models/person.js` | A | livré (fichier supprimé) |
