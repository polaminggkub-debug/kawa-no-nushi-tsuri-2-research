const fs = require('node:fs');
const path = require('node:path');

module.exports = function attachFlyMakerAccess(root, data) {
  const evidence = JSON.parse(fs.readFileSync(path.join(root, 'data/fly-maker-access-rom.json'), 'utf8'));
  if (evidence.rom.sha1 !== 'c2103dd94e2a1a65a495fc02adc2e7d040f31212')
    throw new Error('Fly-maker access uses a different ROM');
  let count = 0;
  for (const item of data.items) {
    if (!item.flyMakerMenuChoice) continue;
    const family = item.rawFields['+0'];
    const access = evidence.accessByFamily[String(family)];
    if (!access || ![1, 2].includes(access.stage) || !access.familyIds.includes(family))
      throw new Error(`Unverified maker family access: ${item.category}:${item.id}`);
    item.flyMakerMenuChoice.access = access;
    item.flyMakerMenuChoice.availableAccess = Object.values(evidence.accessByStage).filter(route => route.familyIds.includes(family));
    count += 1;
  }
  if (count !== 130) throw new Error(`Expected 130 verified component access routes, found ${count}`);
};
