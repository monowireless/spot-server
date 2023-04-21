# パーティションについて

## 概要

ESP32 / 8266 のパーティションテーブルをカスタマイズするには、スケッチディレクトリ（`.ino` のある場所）に `partitions.csv` という名前のファイルを置く必要があります。このディレクトリにある `.csv` ファイルは、スケッチディレクトリにコピーして `partitions.csv` へ名称変更することで使用できます。

## その他

### スケッチのアップロード

Arduino IDEでは、スケッチをアップロードするとき自動的に `partitions.csv` を読み込み、「ツール」 メニューの "Partition Scheme" の設定を上書きします。

### スケッチデータ（ファイルシステム）のアップロード

オリジナルの [`arduino-ESP32fs-plugin`](https://github.com/me-no-dev/arduino-esp32fs-plugin) は、`partitions.csv` を __自動的に読み込みません。__

__したがって、オリジナルからフォークされた下記のプラグインの使用を推奨します。__

- lorol/arduino-esp32fs-plugin: Arduino plugin for uploading files to ESP32 file system
  https://github.com/lorol/arduino-esp32fs-plugin
