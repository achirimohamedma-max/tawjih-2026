# Analyse du fichier [index.html](index.html)

## Vue d'ensemble

**Application web SPA monolithique** — منصة التوجيه التربوي 2026 (Plateforme d'orientation pédagogique) pour la préparation au concours marocain de **مستشار في التوجيه التربوي** (Conseiller en orientation), par محمد العشيري.

- **Taille** : 2 511 lignes, 219 KB, fichier unique (HTML + CSS + JS inline)
- **Langue** : Arabe (`lang="ar" dir="rtl"`)
- **Fonts** : Tajawal, Cairo, Roboto Mono (Google Fonts)

## Architecture

SPA basée sur **6 écrans** (`.screen` togglés via classe `.active`) :

| # | ID | Rôle |
|---|---|---|
| 1 | [`#s-land`](index.html#L353) | Landing — hero, stats, présentation des 4 axes |
| 2 | [`#s-dash`](index.html#L404) | Dashboard — KPI, anneau de progression, accès rapides |
| 3 | [`#s-sum`](index.html#L497) | Résumés — navigation 3 niveaux (axe → sous-thème → cartes théoriques) |
| 4 | [`#s-psy`](index.html#L626) | Tests psychotechniques (séries, grilles logiques) |
| 5 | [`#s-qcm`](index.html#L816) | QCM — passage du quiz |
| 6 | [`#s-corr`](index.html#L849) | Correction détaillée avec explications |

## Couche données

- **`QDB`** ([L946+](index.html#L946)) : banque de **60 questions QCM** structurées par :
  - `ax` (axe 0–3), `sub`/`subN` (sous-thème), `diff` (سهل/متوسط/صعب), `src` (référence), `text`, `ch` (4 choix), `cor` (index correct), `exp` (explication pédagogique).
- **`SUM_STRUCTURE`** + **`CARDS_HTML`** ([~L2200+](index.html#L2200)) : contenu théorique (Piaget, Vygotsky, Bandura, Bloom, Maslow, Gardner, Bourdieu, RIASEC, dyslexie/dyscalculie, القرار 47.20, etc.).
- Pas de backend : tout est en mémoire, état runtime dans l'objet `ST` (réponses, timer, score).

## Logique principale (script L942–L2509)

- `goLevel1/2/3()` : navigation hiérarchique des résumés.
- `toggleCard()` : accordéon sur les cartes théoriques.
- `finishExam()` ([L2406](index.html#L2406)) : calcul du score sur 20, ventilation par sous-thème, génération HTML de la correction avec verdict (ممتاز/جيد جداً/.../راجع دروسك).
- Exercices visuels supportés : séries numériques (`q.series`) et grilles logiques (`q.grid`).

## Design

- Palette : rouge marocain (`--red:#C1272D`), vert (`--green:#006233`), or (`--gold:#C8A84B`) — référence drapeau MA.
- Effets : glassmorphism (backdrop-filter), gradients, glows radiaux, ring SVG de progression.
- Responsive via `clamp()` et `grid-template-columns:repeat(auto-fit,...)`.

## Points forts

- Contenu pédagogique dense et bien sourcé (3 références : 📗 سيكولوجية التعلم, 📘 أساسيات علم النفس, 📙 القياس والتقويم).
- Explications (`exp`) substantielles après chaque question.
- UX claire : 3 niveaux de navigation, feedback visuel par couleur selon score.

## Points faibles / risques

1. **Fichier monolithique 219 KB** — CSS, JS et data mêlés. Maintenabilité limitée ; gain immédiat si on extrait `QDB`, `CARDS_HTML`, `styles` en fichiers séparés.
2. **HTML inline dans des template strings JS** (`CARDS_HTML`) — pas de séparation contenu/comportement, risque XSS si du contenu devenait dynamique (actuellement statique donc OK).
3. **Handlers `onclick=` inline** partout — couplage fort, plus difficile à tester.
4. **Aucune persistance** : refresh = perte de progression (pas de `localStorage`).
5. **Pas de build/minification**, pas de service worker (donc pas d'usage offline malgré le caractère statique idéal pour PWA).
6. **Accessibilité** : navigation par classes `.active` sans `aria-*`, pas de focus management entre écrans, contraste à vérifier sur les overlays glass.
7. **`overflow-x:hidden` sur body** masque d'éventuels débordements RTL plutôt que de les corriger.

## Suggestions rapides

- Ajouter `localStorage` pour sauvegarder réponses et score.
- Extraire `QDB` dans un `questions.json` chargé via `fetch`.
- Convertir en PWA (manifest + SW) — l'app est 100% statique, idéale pour offline.
- Ajouter attributs ARIA pour les écrans (`role="tabpanel"`, `aria-hidden`).
