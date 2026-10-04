export function loadFishAliases(ctx) {
  ctx.applyFilter()
  fetch('../catalogue/fish-visuals.json')
    .then((response) => {
      if (!response.ok) throw new Error('Fish names unavailable')
      return response.json()
    })
    .then((data) => {
      for (const [id, fish] of Object.entries(data.fish || {})) {
        ctx.aliases.set(
          id,
          [
            fish.nameEn,
            fish.nameLatin,
            ...(fish.nameLatinVariants || []),
            fish.nameTh,
            ...(fish.nameThVariants || []),
            fish.nameJa,
          ]
            .filter(Boolean)
            .join(' '),
        )
      }
      ctx.applyFilter()
    })
    .catch(() => {
      ctx.aliasWarning.hidden = false
      ctx.aliasWarning.textContent = ctx.copy.aliasFailure
    })
}
