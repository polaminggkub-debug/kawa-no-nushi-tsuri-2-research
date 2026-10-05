// Keep the two audio-mode explanations tied to their original-ROM action source.
module.exports = function attachAudioModeActions(data, source) {
  if (source.rom?.sha1 !== 'c2103dd94e2a1a65a495fc02adc2e7d040f31212')
    throw new Error('Audio mode actions use a different ROM')
  for (const id of ['13', '14']) {
    const item = data.items.find((entry) => entry.category === 'general_tool' && entry.id === id)
    const action = source.items?.[id]
    if (!item?.playerUse?.evidence || !action?.summary || !action?.facts)
      throw new Error(`Missing audio-mode explanation ${id}`)
    for (const language of ['en', 'ja', 'th']) {
      if (typeof action.summary[language] !== 'string' || !Array.isArray(action.facts[language]))
        throw new Error(`Missing audio-mode translation ${id}/${language}`)
    }
    item.playerUse.summary = structuredClone(action.summary)
    item.playerUse.facts = structuredClone(action.facts)
    item.playerUse.evidence.sources = [
      ...new Set([
        ...(item.playerUse.evidence?.sources || []),
        'data/general-tool-actions.json',
        'docs/general-tool-actions-research.md',
      ]),
    ]
  }
}
