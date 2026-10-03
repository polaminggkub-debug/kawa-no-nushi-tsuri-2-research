# 任意の実行時画像取得

`capture.py` は研究用の小さなLibretroフロントエンドです。各自の対応ROMと、別途用意したSnes9x Libretroコアから原作の描画を取得します。調査用に一時的なWRAM変更もできます。すべての実験を最初から自動再現するスクリプトではありません。

## 準備と最初の画像

Python 3.9以降、対応する原作ROM、OSとCPUに対応したSnes9x Libretroコアが必要です。ROM・コア・セーブ状態・メモリダンプは同梱していません。

```sh
python3 -m pip install -r requirements-capture.txt
python3 scripts/capture.py --rom /path/to/your/game.sfc --core /path/to/snes9x_libretro.so --request examples/startup-request.json --output-dir local-run
```

macOSでは対応する`.dylib`、Windowsでは`.dll`を指定してください。元の調査はApple Silicon用コアで行いました。コアのバージョンによって状態の互換性やフレームのタイミングが変わる可能性があります。実行結果にはROMとコアのSHA-256を出力します。

最初の例は600フレーム進めて`startup.png`を保存します。`capture.state`と`wram.bin`も出力しますが、これらはローカル用でGitの対象外です。

## 入力と状態

JSONの`steps`配列を順に実行します。各ステップには`buttons`、`frames`、`write`、`image`を指定できます。ボタン指定がなければすべて離した状態です。指定したボタンはステップ全体で押されます。Libretroのボタン番号はB=0、Select=2、Start=3、上=4、下=5、左=6、右=7、A=8、X=9、L=10、R=11です。1フレーム押した後に離すステップを入れると長押しを避けられます。

`write`は`[WRAM内オフセット, バイトまたはバイト配列]`です。ROM変更ではありません。このゲームでは現在HPが`0x0862`、最大HPが`0x0864`、所持金が`0x0866`のリトルエンディアン2バイトです。画面表示は次の更新まで古い値を表示する場合があります。

状態ファイルが存在し、`reset: true`がなければ読み込みます。`reset: true`では新規ロードから始めますが、終了時には結果の状態を保存します。`--state`で渡したファイルは上書きされるため、保持したい場合はコピーを使ってください。Libretroの状態はコアに依存し、通常のカートリッジのセーブや別エミュレータの状態とは互換ではありません。

## 食事の例と前提条件

`examples/food-trial-request.json`には元の実験と同じメニュー状態が必要です。浮き釣り用の釣具サブメニューで竿選択が有効な状態を、自分のゲームで用意してください。スクリプトは現在HPを1、最大HPを100、`0x0B3A`の調査対象食料スロットをきのこID`09`に設定し、B→上→上→右→A→A、待機、メッセージ送りを行います。メニュー状態が異なると同じ入力は別の操作になります。

```sh
python3 scripts/capture.py --rom /path/to/your/game.sfc --core /path/to/snes9x_libretro.so --state /path/to/copied-equipment.state --request examples/food-trial-request.json --output-dir local-run
```

実際の選択項目とメッセージを確認してからRAM値を解釈してください。記録済みのきのこ実験はHP1から11になりました。結果は`data/food-effects-confirmed.json`にありますが、元の状態ファイルは配布しません。魚を食べる実験には有効な魚の所持レコードも必要です。

## タイ語ラベルの画像

画像取得用ヘルパーは、原作日本語ROMに加えて、確認済みのタイ語V1.2版（2,097,152バイト、SHA-1 `453047280f53ab9faf93142b957967c1eec69afc`）にも対応します。タイ語の表記は実際のゲーム描画から保存しています。原作ROMのテーブル抽出スクリプトが対応するROMは変更していません。タイ語ラベルと原作日本語版で測定したゲーム処理は別の証拠です。パッチ、ROM、状態ファイルは配布しません。
