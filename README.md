<a href="https://mono-wireless.com/jp/index.html">
    <img src="https://mono-wireless.com/common/images/logo/logo-land.svg" alt="mono wireless logo" title="MONO WIRELESS" align="right" height="60" />
</a>

# spot-server

**Mono Wireless TWELITE SPOT Local Server Example**

[![MW-OSSLA](https://img.shields.io/badge/License-MW--OSSLA-e4007f)](LICENSE.md)

[日本語版はこちら](README_J.md)

## Contents

- [About](#about)
- [Usage](#usage)
- [Dependencies](#dependencies)
- [Features](#features)
- [License](#license)

## About

Set ESP32 as a Wi-Fi access point running an asynchrounous web server.

You can view data received via TWELITE on web browsers.

## Usage

1. Connect USB-C cable and turn on the power.
2. Open Wi-Fi settings on your phone and connect to "TWELITE SPOT (XXXX)".
3. Open a web browser and access "spot.local" or "192.168.1.1".
4. Turn on the TWELITE DIP / CUE / ARIA (factory default settings).
5. Open the viewer page to check the data from each TWELITE device.

## Dependencies

### TWELITE BLUE on the TWELITE SPOT

- Firmware
  - App_Wings (>= 1.3.0)

### ESP32-WROOM-32 on the TWELITE SPOT

#### Server side (Arduino)

- Environment
  - [Arduino IDE](https://github.com/arduino/Arduino) (1.x)
  - [ESP32 Arduino core](https://github.com/espressif/arduino-esp32) (>= 3.0.5)
  - [lorol's esp32-fs-plugin](https://github.com/lorol/arduino-esp32fs-plugin) (>= 2.0.7)
- Libraries
  - [MWings](https://github.com/monowireless/mwings_arduino) (>= 1.2.1)
  - [Arduino_JSON](http://github.com/arduino-libraries/Arduino_JSON) (>= 0.2.0)
  - [AsyncTCP](https://github.com/me-no-dev/AsyncTCP) (>= 1.1.4)
  - [ESPAsyncWebServer](https://github.com/me-no-dev/ESPAsyncWebServer) (>= 1.2.4)
  - [Optional] [OLED Display 96x96](https://github.com/Seeed-Studio/OLED_Display_96X96) (>= 1.0.0)

#### Client side (HTML/ECMAScript/CSS)

- CSS
  - [Included] [Flexboxgrid](https://github.com/kristoferjoseph/flexboxgrid) (>= 6.3.2)
- ECMAScript (JavaScript)
  - [Included] [Chart.js](https://github.com/chartjs/Chart.js) (3.x)
  - [Included] [chartjs-plugin-streaming](https://github.com/nagix/chartjs-plugin-streaming) (>= 2.0.0)
  - [Included] [chartjs-adapter-luxon](https://github.com/chartjs/chartjs-adapter-luxon) (>= 1.3.1)
  - [Included] [luxon](https://github.com/moment/luxon/) (>= 3.3.0)

## Features

### Signal Viewer

- App_Twelite
  - Show digital and analog input states.
  - Pre-installed on [TWELITE (SMD)](https://mono-wireless.com/jp/products/TWE-LITE/index.html) and [TWELITE DIP](https://mono-wireless.com/jp/products/TWE-Lite-DIP/index.html) series.

### CUE Viewer

- App_CUE (TWELITE CUE mode)
  - Show acceleration and magnet state.
  - Pre-installed on [TWELITE CUE](https://mono-wireless.com/jp/products/twelite-cue/index.html) series.

### ARIA Viewer

- App_ARIA (TWELITE ARIA mode)
  - Show air temperature, relative humidity and magnet state.
  - Pre-installed on [TWELITE ARIA](https://mono-wireless.com/jp/products/twelite-aria/index.html) series.

### Serial Viewer

- Any TWELITE
  - Show packet with ASCII-formatted serial input (starts with `:` and ends with `CRLF`).

## License

``` plain
Copyright (C) 2023-2024 Mono Wireless Inc. All Rights Reserved.
Released under MW-OSSLA-1J,1E (MONO WIRELESS OPEN SOURCE SOFTWARE LICENSE AGREEMENT).
```
