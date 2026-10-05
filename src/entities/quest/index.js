import { transactions, eelTransaction } from './transactions.js'
import * as en from './copy/en.js'
import * as th from './copy/th.js'
import * as ja from './copy/ja.js'

const locales = { en, th, ja }

/** Verified transaction areas; this is not an exhaustive campaign quest list. */
export function areaQuestStages() {
  return [1, 2, 3, 4, 5, 6]
}

/** Localized player projection with references to canonical ROM evidence. */
export function areaQuestActions(stage, locale = 'en') {
  const area = Number(stage)
  if (!Number.isInteger(area) || !areaQuestStages().includes(area)) return []
  const copy = locales[locale] || en
  const records = transactions.filter((record) => record.stage === area)
  if (area === 1 || area === 6) records.push(eelTransaction(area))
  return records.map((record) => projectAction(record, copy))
}

function projectAction(record, copy) {
  const wording = copy.actions[record.copyKey || record.id]
  return {
    id: record.id,
    kind: record.kind,
    title: wording.title,
    steps: [...wording.steps],
    warning: wording.warning,
    links: record.links.map((link) => ({
      ...link,
      label: copy.labels[link.label],
      ...(link.params ? { params: { ...link.params } } : {}),
    })),
    evidence: record.evidence.map((reference) => ({ ...reference })),
    limit: wording.limit,
  }
}
