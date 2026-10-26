import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync, mkdtempSync, writeFileSync, mkdirSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { parseCsv, toDate } from '../lib/csv.mjs'

const sample = (n) => readFileSync(new URL(`../samples/${n}`, import.meta.url), 'utf8')
const mod = (n) => import(`../src/${n}.mjs`)

test('06 rapport hebdomadaire : comparaison avec la semaine précédente', async () => {
  const { weeklyReport } = await mod('weekly-report')
  const md = weeklyReport(parseCsv(sample('ventes.csv')).records, toDate('2026-10-25'))
  assert.match(md, /semaine du 2026-10-19 au 2026-10-25/)
  assert.match(md, /Nombre de ventes \| 4 \| 3/)
  assert.match(md, /1\. Audit SI|1\. Formation IA|1\. Automatisation/)
  assert.throws(() => weeklyReport([{ date: 'x', montant: 'y' }]))
})
