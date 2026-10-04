const fs = require('node:fs');
const path = require('node:path');

module.exports = function attachFlyMenuPositions(root, data) {
  const evidence = JSON.parse(fs.readFileSync(path.join(root, 'data/fly-maker-menu-positions.json'), 'utf8'));
  if (evidence.romSha256 !== 'e0594921a5a2ef1a2613b9d2e29fed066569e3793393c591bf4c4968a54c0b49')
    throw new Error('Fly menu positions use a different ROM');
  for (const item of data.items) delete item.flyMakerMenuChoice;
  for (const choice of evidence.choices) {
    if (choice.id === '00') continue;
    const item = data.items.find(entry => entry.category === choice.category && entry.id === choice.id);
    if (!item) throw new Error(`Missing maker menu item ${choice.category}:${choice.id}`);
    item.flyMakerMenuChoice = { ...choice, area: evidence.area, familyJa: evidence.familyJa, evidenceHref: evidence.evidenceHref };
  }
};
