const fs = require('node:fs');
const path = require('node:path');

module.exports = function attachFlyEvenFamilies(root, data) {
  const evidence = JSON.parse(fs.readFileSync(path.join(root, 'data/fly-maker-even-families-menu-positions.json'), 'utf8'));
  if (evidence.romSha256 !== 'e0594921a5a2ef1a2613b9d2e29fed066569e3793393c591bf4c4968a54c0b49')
    throw new Error('Even-family menus use a different ROM');
  if (!evidence.provenance.independentReplay.selectedIdsMatched || !evidence.provenance.independentReplay.cursorImageHashesMatched)
    throw new Error('Even-family menus require independent replay evidence');
  for (const choice of evidence.choices) {
    if (choice.id === '00') continue;
    const matches = data.items.filter(entry => entry.category === choice.category && entry.id === choice.id);
    if (matches.length !== 1 || matches[0].flyMakerMenuChoice)
      throw new Error(`Missing or duplicate maker choice ${choice.category}:${choice.id}`);
    const item = matches[0];
    const family = { 'ディプテラ': 2, 'ストーンフライ': 3 }[choice.familyJa];
    const part = { body: 0, wing: 1, tail: 2 }[choice.part];
    if (family === undefined || part === undefined || item.rawFields['+0'] !== family || item.rawFields['+1'] !== part)
      throw new Error(`Maker family/part differs from ROM record ${choice.category}:${choice.id}`);
    if (choice.area !== 2 || choice.controlledFixture !== true)
      throw new Error('Even-family position must retain its controlled fixture scope');
    item.flyMakerMenuChoice = { ...choice, evidenceHref: evidence.evidenceHref };
  }
};
