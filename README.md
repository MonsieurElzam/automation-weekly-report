# automation-weekly-report

**Rapport hebdomadaire de ventes** — Chiffre d'affaires, nombre de ventes, panier moyen et top produits en Markdown, comparés à la semaine précédente.

> **EN** — *Weekly sales report.* Revenue, sales count, average basket and top products in Markdown, compared with the previous week.

Node.js 18+, **aucune dépendance**, licence **MIT**. Aucune donnée n'est envoyée nulle part. Les messages affichés sont en français.

## Utilisation

```bash
node src/weekly-report.mjs ventes.csv --out rapport.md
```

Des fichiers d'exemple sont fournis dans `samples/`.

Aide intégrée (`--help`) :

```text
Usage : node src/weekly-report.mjs ventes.csv [--week-ending AAAA-MM-JJ] [--out rapport.md]
Colonnes : date, produit, montant, commande (facultatif).
```

## Tests

```bash
npm test
```

## Limites

- Les exemples de `samples/` sont fictifs ; adaptez les en-têtes de colonnes à vos propres exports.
- Essayez d'abord sur une copie de vos données.
- Fourni tel quel, sans garantie (voir `LICENSE`).

## La série

Ce script fait partie d'une série de **scripts d'automatisation libres** (public : gestion et processus, entre autres) : [présentation, guides et archive complète](https://monsieurelzam.com/scripts) · [tous les dépôts](https://github.com/MonsieurElzam?tab=repositories&q=automation-).

---

Par [Elzam MAMAH](https://monsieurelzam.com) — business analyst, optimisation de processus. Licence MIT.
