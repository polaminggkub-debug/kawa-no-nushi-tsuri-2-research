const fs = require('node:fs');
const path = require('node:path');

module.exports = function attachFlyOtherFamilies(root, data) {
  const evidence = JSON.parse(fs.readFileSync(path.join(root, 'data/fly-maker-other-families-menu-positions.json'), 'utf8'));
  if (evidence.romSha256 !== 'e0594921a5a2ef1a2613b9d2e29fed066569e3793393c591bf4c4968a54c0b49')
    throw new Error('Other fly menus use a different ROM');
  if (!evidence.provenance.independentReplay.selectedIdsMatched || !evidence.provenance.independentReplay.cursorImageHashesMatched)
    throw new Error('Other fly menus require independent replay evidence');
  for (const choice of evidence.choices) {
    if (choice.id === '00') continue;
    const item = data.items.find(entry => entry.category === choice.category && entry.id === choice.id);
    if (!item || item.flyMakerMenuChoice) throw new Error(`Missing or duplicate maker choice ${choice.category}:${choice.id}`);
    const family = { 'カディス': 1, 'テレストリアル': 4 }[choice.familyJa];
    const part = { body: 0, wing: 1, tail: 2 }[choice.part];
    if (family === undefined || part === undefined || item.rawFields['+0'] !== family || item.rawFields['+1'] !== part)
      throw new Error(`Maker family/part differs from ROM record ${choice.category}:${choice.id}`);
    item.flyMakerMenuChoice = { ...choice, evidenceHref: evidence.evidenceHref };
  }
};
