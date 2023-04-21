# About partitions

## Brief

To customize the partition table of the ESP32/8266, you need to put a file named `partitions.csv` in your sketch (`.ino`) directory. You can use `.csv` files in this directroy by copying and renaming it.

## Note

### Sketch upload (Program)

When uploading a sketch via the "Upload" button in the Arduino IDE, the system automatically reads `partitions.csv` and overrides the "Partition Scheme" setting in the "Tools" menu.

### Sketch data upload (Filesystem)

Original [`arduino-ESP32fs-plugin`](https://github.com/me-no-dev/arduino-esp32fs-plugin) __DOES NOT reads__ `partitions.csv`.

__We recommend to use lorol's forked one.__

- lorol/arduino-esp32fs-plugin: Arduino plugin for uploading files to ESP32 file system
  https://github.com/lorol/arduino-esp32fs-plugin
