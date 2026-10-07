"""What each hook does by fish size, and whether a cheaper hook does the same."""

from .facts import load

# How a hook's size class moves the fight meter's start in each size band:
# +1 one more mistake allowed, 0 nothing, -1 one fewer. Hook 10 (class 3) does nothing by size.
EFFECT = {
    0: (1, 0, -1),
    1: (0, 1, 0),
    2: (-1, 0, 1),
    3: (0, 0, 0),
}


def band_of_size(size):
    return 0 if size <= 15 else 1 if size <= 35 else 2


def effect_on(hook, fish_id, size):
    """A hook named for the fish halves the start at any size; otherwise its size class decides."""
    if hook["match"] == fish_id:
        return 1
    return EFFECT[hook["sel"]][band_of_size(size)]


def _vector(facts, hook):
    return [
        effect_on(hook, fid, size)
        for fid, row in sorted(facts.fish.items())
        for size in range(row["size"][0], row["size"][1] + 1)
    ]


def _beats(facts, other, hook):
    """True when `other` costs no more and is at least as good against every fish at every size."""
    if other["id"] == hook["id"] or other["yen"] > hook["yen"]:
        return False
    mine, theirs = _vector(facts, hook), _vector(facts, other)
    if any(b < a for a, b in zip(mine, theirs)):
        return False
    return other["yen"] < hook["yen"] or mine != theirs or other["id"] < hook["id"]


def class_hooks(facts, size_class):
    """Hooks of one size class, cheapest first."""
    rows = [h for h in facts.hooks.values() if h["sel"] == size_class]
    return sorted(rows, key=lambda h: (h["yen"], h["id"]))


def same_effect(facts, hook, fish_id):
    """Other hooks that do exactly what `hook` does against one fish at every size."""
    sizes = range(facts.fish[fish_id]["size"][0], facts.fish[fish_id]["size"][1] + 1)
    mine = [effect_on(hook, fish_id, s) for s in sizes]
    return [
        other
        for other in facts.hooks.values()
        if other["id"] != hook["id"] and [effect_on(other, fish_id, s) for s in sizes] == mine
    ]


def view(facts, number):
    hook = facts.hooks[number]
    tables = {row["id"]: row for row in load("data/fight-tables.json")["hook"]}
    table = tables[number]
    assert (table["selector"], table["fishMatch"]) == (hook["sel"], hook["match"])
    rivals = [h for h in facts.hooks.values() if _beats(facts, h, hook)]
    better = min(rivals, key=lambda h: (h["yen"], h["id"])) if rivals else None
    named = hook["match"] or 0
    equal = sorted(same_effect(facts, hook, named), key=lambda h: (h["yen"], h["id"])) if named else []
    return {
        "hook": hook,
        "effect": EFFECT[hook["sel"]],
        "named": named,
        "better": better,
        "equal": equal,
        "equal_cheaper": [h for h in equal if h["yen"] <= hook["yen"]],
        "cheapest": class_hooks(facts, hook["sel"])[0]["id"] == number,
        "float": hook["use"]["float"],
    }
