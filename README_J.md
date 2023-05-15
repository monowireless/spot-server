<a href="https://mono-wireless.com/jp/index.html">
    <img src="https://mono-wireless.com/common/images/logo/logo-land.svg" alt="mono wireless logo" title="MONO WIRELESS" align="right" height="60" />
</a>

# spot-server

**Mono Wireless TWELITE SPOT Local Server Example**

[![MW-OSSLA](https://img.shields.io/badge/License-MW--OSSLA-e4007f)](LICENSE.md)

## 目次

- [概要](#概要)
- [依存関係](#依存関係)
- [使用方法](#使用方法)
- [機能](#機能)
- [ライセンス](#ライセンス)

## 概要

ESP32 を WiFI アクセスポイントとして、非同期のウェブサーバを起動します。

TWELITE から受信したデータをウェブブラウザで閲覧できます。

## 使用方法

1. 側面の USB-C コネクタへ電源を供給します。
2. スマホの Wi-Fi 設定から "TWELITE SPOT (XXXX)" につなぎます。
3. ウェブブラウザから "spot.local" または "192.168.1.1" を開きます。
4. 初期状態の TWELITE DIP / CUE / ARIA へ電源を供給します。
5. 各ビューア画面から、子機のデータを確認します。

## 依存関係

### TWELITE SPOT 内の TWELITE BLUE

- ファームウェア
  - App_Wings (>= 1.3.0)

### TWELITE SPOT 内の ESP32-WROOM-32

#### サーバ側 (Arduino)

- 環境
  - [Arduino IDE](https://github.com/arduino/Arduino) (1.x)
  - [ESP32 Arduino core](https://github.com/espressif/arduino-esp32) (>= 2.0.5)
  - [lorol's esp32-fs-plugin](https://github.com/lorol/arduino-esp32fs-plugin) (>= 2.0.7)
- ライブラリ
  - [MWings](https://github.com/monowireless/mwings_arduino) (>= 1.0.0)
  - [Arduino_JSON](http://github.com/arduino-libraries/Arduino_JSON) (>= 0.2.0)
  - [AsyncTCP](https://github.com/me-no-dev/AsyncTCP) (>= 1.1.1)
  - [ESPAsyncWebServer](https://github.com/me-no-dev/ESPAsyncWebServer) (>= 1.2.3)
  - [オプション] [OLED Display 96x96](https://github.com/Seeed-Studio/OLED_Display_96X96) (>= 1.0.0)

#### クライアント側 (HTML/ECMAScript/CSS)

- CSS
  - [同梱] [Flexboxgrid](https://github.com/kristoferjoseph/flexboxgrid) (>= 6.3.2)
- ECMAScript (JavaScript)
  - [同梱] [Chart.js](https://github.com/chartjs/Chart.js) (3.x)
  - [同梱] [chartjs-plugin-streaming](https://github.com/nagix/chartjs-plugin-streaming) (>= 2.0.0)
  - [同梱] [chartjs-adapter-luxon](https://github.com/chartjs/chartjs-adapter-luxon) (>= 1.3.1)
  - [同梱] [luxon](https://github.com/moment/luxon/) (>= 3.3.0)

## 機能

### Signal Viewer

- App_Twelite
  - デジタル・アナログ信号を表示
  - [TWELITE (SMD)](https://mono-wireless.com/jp/products/TWE-LITE/index.html) および [TWELITE DIP](https://mono-wireless.com/jp/products/TWE-Lite-DIP/index.html) シリーズにプリインストールされています。

### CUE Viewer

- App_CUE (TWELITE CUE モード)
  - 加速度と磁石の状態を表示
  - [TWELITE CUE](https://mono-wireless.com/jp/products/twelite-cue/index.html) シリーズにプリインストールされています。

### ARIA Viewer

- App_ARIA (TWELITE ARIA モード)
  - 加速度と磁石の状態を表示
  - [TWELITE ARIA](https://mono-wireless.com/jp/products/twelite-aria/index.html) シリーズにプリインストールされています。

### Serial Viewer

- すべての TWELITE
  - アスキー形式のシリアル入力から、パケットを識別・表示します（`:`で始まり、`CRLF`で終わるもの）。

## ライセンス

``` plain
Copyright (C) 2023 Mono Wireless Inc. All Rights Reserved.
Released under MW-OSSLA-1J,1E (MONO WIRELESS OPEN SOURCE SOFTWARE LICENSE AGREEMENT).
```
