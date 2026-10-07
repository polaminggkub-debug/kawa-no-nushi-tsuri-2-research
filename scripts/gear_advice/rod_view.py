"""What each rod can do for its own fishing method: reach, fight start, and whether another rod beats it."""

from .phrases import largest


def _use(rod):
    return rod["use"][rod["method"]]


def _need(facts, method, fid):
    return facts.fish[fid]["methods"][method]["need"]


def _beats(other, rod):
    """True when `other` is sold, costs no more, reaches at least as far and starts no worse."""
    if other["id"] == rod["id"] or not other["sold"] or other["method"] != rod["method"]:
        return False
    same_or_better = (
        other["yen"] <= rod["yen"]
        and other["reach"] >= rod["reach"]
        and other["aim"] >= rod["aim"]
        and _use(other)["loss"] <= _use(rod)["loss"]
    )
    strictly = (
        other["yen"] < rod["yen"]
        or other["reach"] > rod["reach"]
        or other["aim"] > rod["aim"]
        or _use(other)["loss"] < _use(rod)["loss"]
    )
    return same_or_better and strictly


def _why(other, rod):
    """The ways `other` is better, as keys the copy turns into words."""
    keys = ["cheaper" if other["yen"] < rod["yen"] else "same_price"]
    if other["reach"] > rod["reach"]:
        keys.append("reach")
    if other["aim"] > rod["aim"]:
        keys.append("aim")
    if _use(other)["loss"] < _use(rod)["loss"]:
        keys.append("start")
    return keys


def _step_up(facts, rod):
    """The sold rods a player moves to when this rod's line is too short: the next step and the full cover."""
    use = _use(rod)
    rivals = [r for r in facts.rods.values() if r["method"] == rod["method"] and r["sold"]]
    longer = [r for r in rivals if r["reach"] > rod["reach"]]
    if not longer or not use.get("short"):
        return []
    cover = max(_need(facts, rod["method"], fid) for fid in use["short"])
    pick = lambda pool: min(pool, key=lambda r: (r["yen"], r["reach"], r["id"]))
    steps = [pick(longer)]
    full = [r for r in rivals if r["reach"] >= cover]
    if full and pick(full)["id"] != steps[0]["id"]:
        steps.append(pick(full))
    return steps


def view(facts, number):
    rod = facts.rods[number]
    use = _use(rod)
    short = use.get("short", [])
    rivals = [r for r in facts.rods.values() if _beats(r, rod)] if rod["sold"] else []
    better = min(rivals, key=lambda r: (r["yen"], -r["reach"], r["id"])) if rivals else None
    verdict = "unsold" if not rod["sold"] else "skip" if better else "buy"
    late = bool(better) and min(better["areas"]) > min(rod["areas"])
    return {
        "rod": rod,
        "use": use,
        "verdict": verdict,
        "better": better,
        "better_keys": _why(better, rod) if better else [],
        "late": late,
        "covered": use["n"] - len(short),
        "short": short,
        "short_names": largest(facts, short, 3),
        "bad_names": largest(facts, use["bad"], 3),
        "steps": _step_up(facts, rod),
    }
