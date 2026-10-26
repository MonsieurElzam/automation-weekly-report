#!/usr/bin/env node
/* Rapport hebdomadaire de ventes en Markdown : CA, nombre de ventes, panier moyen, top produits,
   avec comparaison à la semaine précédente. */
import { readFileSync, writeFileSync } from 'node:fs'
import { parseCsv, toNumber, toDate } from '../lib/csv.mjs'
import { isMain, parseArgs, usage, fail } from '../lib/cli.mjs'

const DAY = 86_400_000
const iso = (d) => d.toISOString().slice(0, 10)

function summarise(rows) {
  const ca = rows.reduce((s, r) => s + r.montant, 0)
  const orders = new Set(rows.map((r) => r.commande))
  const products = new Map()
  for (const r of rows) products.set(r.produit, (products.get(r.produit) ?? 0) + r.montant)
  return {
    ca, ventes: orders.size,
    panier: orders.size ? ca / orders.size : 0,
    top: [...products].sort((a, b) => b[1] - a[1]).slice(0, 5),
  }
}

/** Colonnes : date, produit, montant ; « commande » facultatif (sinon une ligne = une vente). */
export function weeklyReport(records, endDate) {
  const rows = records.flatMap((r, i) => {
    const date = toDate(r.date)
    const montant = toNumber(r.montant)
    return date && !Number.isNaN(montant)
      ? [{ date, montant, produit: r.produit || '(sans produit)', commande: r.commande || `ligne-${i}` }]
      : []
  })
  if (!rows.length) throw new Error('aucune ligne exploitable (colonnes attendues : date, produit, montant).')
  const end = endDate ?? new Date(Math.max(...rows.map((r) => r.date)))
  const startCur = new Date(end - 6 * DAY)
  const startPrev = new Date(end - 13 * DAY)
  const cur = summarise(rows.filter((r) => r.date >= startCur && r.date <= end))
  const prev = summarise(rows.filter((r) => r.date >= startPrev && r.date < startCur))
  const evo = (a, b) => (b === 0 ? 'n/a' : `${a >= b ? '+' : ''}${(((a - b) / b) * 100).toFixed(1)} %`)
  const f = (n) => n.toLocaleString('fr-FR', { maximumFractionDigits: 0 })
  return [
    `# Rapport hebdomadaire — semaine du ${iso(startCur)} au ${iso(end)}`, '',
    '| Indicateur | Cette semaine | Semaine précédente | Évolution |', '|---|---:|---:|---:|',
    `| Chiffre d'affaires | ${f(cur.ca)} | ${f(prev.ca)} | ${evo(cur.ca, prev.ca)} |`,
    `| Nombre de ventes | ${cur.ventes} | ${prev.ventes} | ${evo(cur.ventes, prev.ventes)} |`,
    `| Panier moyen | ${f(cur.panier)} | ${f(prev.panier)} | ${evo(cur.panier, prev.panier)} |`, '',
    '## Top produits', '',
    ...(cur.top.length ? cur.top.map(([p, m], i) => `${i + 1}. ${p} — ${f(m)}`) : ['_Aucune vente sur la période._']), '',
  ].join('\n')
}

if (isMain(import.meta.url)) {
  const args = parseArgs(process.argv.slice(2), ['help'])
  usage(`
Usage : node src/weekly-report.mjs ventes.csv [--week-ending AAAA-MM-JJ] [--out rapport.md]
Colonnes : date, produit, montant, commande (facultatif).`, args, 1)
  let md
  try {
    md = weeklyReport(parseCsv(readFileSync(args._[0], 'utf8')).records, args['week-ending'] ? toDate(args['week-ending']) : undefined)
  } catch (e) { fail(e.message) }
  if (args.out) writeFileSync(args.out, md); else process.stdout.write(md)
}
