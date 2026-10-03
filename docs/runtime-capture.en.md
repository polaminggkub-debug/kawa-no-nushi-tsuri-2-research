# Optional runtime captures

This helper is a small headless Libretro frontend for the research workflow. It reads your matching original ROM, runs a separately supplied Snes9x Libretro core and saves genuine game frames. It supports controlled WRAM changes for investigation. It is not a general emulator UI or a deterministic replay of every experiment in this repository.

## Requirements and first capture

Use Python 3.9 or newer, your own matching ROM and a Snes9x Libretro core compiled for your operating system and CPU. Obtain the core separately from its project/distributor. No ROM, core, save state or memory dump is bundled.

```sh
python3 -m pip install -r requirements-capture.txt
python3 scripts/capture.py --rom /path/to/your/game.sfc --core /path/to/snes9x_libretro.so --request examples/startup-request.json --output-dir local-run
```

Use the appropriate `.dylib` on macOS or `.dll` on Windows. The research originally used an Apple Silicon Snes9x Libretro build; a different core version can change state compatibility and frame timing. The helper prints ROM and core SHA-256 hashes so runs can record their exact inputs. Its default output directory is ignored by Git.

The startup request advances 600 frames and saves `startup.png`. Outputs also include `capture.state` and `wram.bin`; these remain local and are not part of the public research package.

## Requests, controls and state

A request contains an ordered `steps` array. Each step may set `buttons`, advance `frames`, perform a `write`, and save an `image`. Omitted buttons mean none are held. Buttons remain held for the whole step. Libretro joypad IDs used here are B=0, Select=2, Start=3, Up=4, Down=5, Left=6, Right=7, A=8, X=9, L=10, R=11. A one-frame press followed by a release step avoids holding a selection across multiple frames.

`write` entries are `[WRAM_offset, byte_or_byte_array]`; offsets may be hexadecimal strings. They are offsets within the core's exposed system RAM, not ROM patches. For this game, current HP is a little-endian word at offset `0x0862`, maximum HP at `0x0864`, and money at `0x0866`. Changes depend on game state and can leave display fields cached until a subsequent redraw.

If the selected state exists and the request does not set `reset: true`, the helper loads it. With `reset: true`, it starts from a fresh core load; it still writes the resulting state at the end. A supplied `--state` file is updated in place: use a copy if you want to preserve it. Libretro serialized states are core-specific and are not interchangeable with ordinary cartridge saves or another emulator's save-state format.

## Food trial example and its precondition

`examples/food-trial-request.json` is a contextual research sequence, not a fresh-game walkthrough. Before using it, build your own matching state inside the equipment submenu, with the float-fishing rig's rod selection active and the same menu arrangement as the recorded experiment. The sequence sets HP to 1, maximum HP to 100, and the inspected carried-food slot at `0x0B3A` to mushroom ID `09`, then uses B → Up → Up → Right → A → A, waits, and dismisses the message. Without that menu context, the buttons will perform different actions.

```sh
python3 scripts/capture.py --rom /path/to/your/game.sfc --core /path/to/snes9x_libretro.so --state /path/to/copied-equipment.state --request examples/food-trial-request.json --output-dir local-run
```

Observe the selected item and resulting message before interpreting RAM. The recorded mushroom experiment ended at 11 HP from a controlled start of 1 HP. Evidence images and measurements are provided in `data/food-effects-confirmed.json`; the original source states are not redistributed. Fish-food trials additionally require a valid carried-fish record, so changing only the food selector does not reproduce them.
