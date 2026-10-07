#!/usr/bin/env python3
"""Enforce physical source budgets for the new bounded ROM-verification tools."""
import ast
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]


def violations(text, label):
    errors = []
    if len(text.splitlines()) > 500:
        errors.append(f'{label}: more than 500 physical lines')
    tree = ast.parse(text, filename=label)
    for node in ast.walk(tree):
        if isinstance(node, (ast.FunctionDef, ast.AsyncFunctionDef, ast.Lambda)):
            first = min([node.lineno] + [d.lineno for d in getattr(node, 'decorator_list', [])])
            if node.end_lineno - first + 1 > 50:
                errors.append(f'{label}:{first}: function exceeds 50 physical lines')
    return errors


def adversarial_probes():
    assert violations('\n' * 501, 'overlong file')
    assert not violations('def example():\n' + '    pass\n' * 49, '50-line function')
    assert violations('def example():\n' + '    pass\n' * 50, '51-line function')


def main():
    adversarial_probes()
    paths = [Path(__file__), ROOT / 'scripts/verify_tub_boarding.py',
             ROOT / 'scripts/verify_magnet_story_gate.py',
             ROOT / 'scripts/trace_fly_maker_menu.py',
             ROOT / 'scripts/derive_water_icons.py',
             ROOT / 'scripts/extract_water_sprites.py',
             ROOT / 'scripts/derive_notebook_completion.py',
             ROOT / 'scripts/verify_notebook_records.py',
             ROOT / 'scripts/verify_notebook_starting_inventory.py',
             ROOT / 'scripts/verify_giant_eel_ending_route.py',
             ROOT / 'scripts/verify_town_paste_bait.py']
    paths += sorted((ROOT / 'scripts/magnet-story-gate').rglob('*.py'))
    paths += [ROOT / 'scripts/build_gear_advice.py']
    paths += sorted((ROOT / 'scripts/gear_advice').glob('*.py'))
    errors = []
    for path in paths:
        if not path.exists():
            errors.append(f'Missing bounded research tool: {path.name}')
        else:
            errors.extend(violations(path.read_text(encoding='utf-8'), str(path.relative_to(ROOT))))
    if errors:
        raise SystemExit('\n'.join(errors))
    print(f'Research source budgets PASS: {len(paths)} Python files; 500/file and 50/function; adversarial probes passed')


if __name__ == '__main__':
    main()
