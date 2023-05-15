// TWELITE SPOT Server Example

// Arduino / ESP libraries
#include <Arduino.h>
#include <WiFi.h>
#include <Arduino_JSON.h>
#include <LittleFS.h>
#include <ESPmDNS.h>
#include <Wire.h>

// Third-party libraries
#include <AsyncTCP.h>
#include <ESPAsyncWebServer.h>
#include <SeeedGrayOLED.h>

// Mono Wireless TWELITE Wings API for 32-bit Arduinos
#include <MWings.h>

// Pin defs
const uint8_t TWE_RST = 5;
const uint8_t TWE_PRG = 4;
const uint8_t LED = 18;
const uint8_t ESP_RXD1 = 16;
const uint8_t ESP_TXD1 = 17;

// TWELITE defs
const uint8_t TWE_CH = 18;
const uint32_t TWE_APPID = 0x67720102;
const uint8_t TWE_RETRY = 2;
const uint8_t TWE_POWER = 3;

// Wi-Fi defs
const char* WIFI_SSID_BASE = "TWELITE SPOT";
const char* WIFI_PASSWORD = "twelitespot";
const uint8_t WIFI_CH = 13;
const IPAddress WIFI_IP = IPAddress(192, 168, 1, 1);
const IPAddress WIFI_MASK = IPAddress(255, 255, 255, 0);
const char* HOSTNAME = "spot";  // spot.local

// Global objects
AsyncWebServer server(80);
AsyncEventSource events("/events");

// Function prototypes
uint16_t createUidFromMac();
String createJsonFrom(const ParsedAppTwelitePacket& packet);
String createJsonFrom(const ParsedAppAriaPacket& packet);
String createJsonFrom(const ParsedAppCuePacket& packet);
String createJsonFrom(const BarePacket& packet);

// Setup procedure
void setup() {
    // Init USB serial
    Serial.begin(115200);
    Serial.println("Hello, this is TWELITE SPOT.");

    // Init TWELITE
    Serial2.begin(115200, SERIAL_8N1, ESP_RXD1, ESP_TXD1);
    if (Twelite.begin(Serial2,
                      LED, TWE_RST, TWE_PRG,
                      TWE_CH, TWE_APPID, TWE_RETRY, TWE_POWER)) {
        Serial.println("Started TWELITE.");
    }
    //// App_Twelite
    Twelite.on([](const ParsedAppTwelitePacket& packet) {
        Serial.println("Received a packet from App_Twelite");
        String jsonStr = createJsonFrom(packet);
        if (not (jsonStr.length() <= 0)) {
            events.send(jsonStr.c_str(), "data_app_twelite", millis());
        }
        events.send("parsed_app_twelite", "data_parsing_result", millis());
    });
    //// App_ARIA
    Twelite.on([](const ParsedAppAriaPacket& packet) {
        Serial.println("Received a packet from App_ARIA");
        static uint32_t firstSourceSerialId = packet.u32SourceSerialId;
        if (packet.u32SourceSerialId == firstSourceSerialId) {
            String jsonStr = createJsonFrom(packet);
            if (not (jsonStr.length() <= 0)) {
                events.send(jsonStr.c_str(), "data_app_aria_twelite_aria_mode", millis());
            }
        }
        events.send("parsed_app_aria_twelite_aria_mode", "data_parsing_result", millis());
    });
    //// App_CUE
    Twelite.on([](const ParsedAppCuePacket& packet) {
        Serial.println("Received a packet from App_CUE");
        static uint32_t firstSourceSerialId = packet.u32SourceSerialId;
        if (packet.u32SourceSerialId == firstSourceSerialId) {
            String jsonStr = createJsonFrom(packet);
            if (not (jsonStr.length() <= 0)) {
                events.send(jsonStr.c_str(), "data_app_cue_twelite_cue_mode", millis());
            }
        }
        events.send("parsed_app_cue_twelite_cue_mode", "data_parsing_result", millis());
    });
    //// App_PAL (AMBIENT)
    Twelite.on([](const ParsedAppPalAmbPacket& packet) {
        Serial.println("Received a packet from App_PAL (AMBIENT)");
        events.send("parsed_app_pal_ambient", "data_parsing_result", millis());
    });
    //// App_PAL (MOTION)
    Twelite.on([](const ParsedAppPalMotPacket& packet) {
        Serial.println("Received a packet from App_PAL (MOTION)");
        events.send("parsed_app_pal_motion", "data_parsing_result", millis());
    });
    //// App_PAL (OPENCLOSE)
    Twelite.on([](const ParsedAppPalOpenClosePacket& packet) {
        Serial.println("Received a packet from App_PAL (OPENCLOSE)");
        events.send("parsed_app_pal_openclose", "data_parsing_result", millis());
    });
    //// App_IO
    Twelite.on([](const ParsedAppIoPacket& packet) {
        Serial.println("Received a packet from App_IO");
        events.send("parsed_app_io", "data_parsing_result", millis());
    });
    //// App_Uart (Mode A)
    Twelite.on([](const ParsedAppUartAsciiPacket& packet) {
        Serial.println("Received a packet from App_Uart (Mode A)");
        events.send("parsed_app_uart_ascii", "data_parsing_result", millis());
    });
    //// App_Uart (Mode A, Extended)
    Twelite.on([](const ParsedAppUartAsciiExtendedPacket& packet) {
        Serial.println("Received a packet from App_Uart (Mode A, Extended)");
        events.send("parsed_app_uart_ascii_extended", "data_parsing_result", millis());
    });
    //// Any
    Twelite.on([](const BarePacket& packet) {
        String jsonStr = createJsonFrom(packet);
        if (not (jsonStr.length() <= 0)) {
            events.send(jsonStr.c_str(), "data_bare_packet", millis());
        }
        events.send("unparsed_bare_packet", "data_parsing_result", millis());
    });

    // Init OLED display
    Wire.begin();
    SeeedGrayOled.init(SSD1327);
    SeeedGrayOled.setNormalDisplay();
    SeeedGrayOled.setVerticalMode();
    SeeedGrayOled.setGrayLevel(0x0F);
    SeeedGrayOled.clearDisplay();
    Serial.println("Initialized display.");

    // Init Wi-Fi
    WiFi.mode(WIFI_AP);
    char uidCString[8]; sprintf(uidCString, " (%02X)", createUidFromMac());
    char ssidCString[20]; sprintf(ssidCString, "%s%s", WIFI_SSID_BASE, uidCString);
    WiFi.softAP(ssidCString, WIFI_PASSWORD, WIFI_CH, false, 8);
    delay(100);  // IMPORTANT: Waiting for SYSTEM_EVENT_AP_START
    WiFi.softAPConfig(WIFI_IP, WIFI_IP, WIFI_MASK);
    MDNS.begin(HOSTNAME);
    Serial.print("Started Wi-Fi AP as \"");
    Serial.print(ssidCString); Serial.print("\" at ");
    Serial.print(WiFi.softAPIP().toString().c_str()); Serial.print(" (aka \"");
    Serial.print(HOSTNAME); Serial.println(".local\").");
    SeeedGrayOled.setTextXY(0, 0); SeeedGrayOled.putString("TWELITE SPOT");
    SeeedGrayOled.setTextXY(1, 0); SeeedGrayOled.putString("AP Viewer");
    SeeedGrayOled.setTextXY(3, 0); SeeedGrayOled.putString("SSID:");
    SeeedGrayOled.setTextXY(4, 0); SeeedGrayOled.putString(WIFI_SSID_BASE);
    SeeedGrayOled.setTextXY(5, 0); SeeedGrayOled.putString(uidCString);
    SeeedGrayOled.setTextXY(6, 0); SeeedGrayOled.putString("Password:");
    SeeedGrayOled.setTextXY(7, 0); SeeedGrayOled.putString(WIFI_PASSWORD);
    SeeedGrayOled.setTextXY(8, 0); SeeedGrayOled.putString("IP Address:");
    SeeedGrayOled.setTextXY(9, 0); SeeedGrayOled.putString(WiFi.softAPIP().toString().c_str());
    SeeedGrayOled.setTextXY(10, 0); SeeedGrayOled.putString("Hostname:");
    SeeedGrayOled.setTextXY(11, 0); SeeedGrayOled.putString(HOSTNAME); SeeedGrayOled.putString(".local");

    // Init filesystem
    if (LittleFS.begin()) { Serial.println("Mounted file system."); }

    // Init web server
    server.on("/", HTTP_GET,
              [](AsyncWebServerRequest *request) {
                  Serial.println("HTTP_GET: index.html");
                  request->send(LittleFS, "/index.html", "text/html");
              });
    server.on("/signal-viewer", HTTP_GET,
              [](AsyncWebServerRequest *request) {
                  Serial.println("HTTP_GET: signal-viewer.html");
                  request->send(LittleFS, "/signal-viewer.html", "text/html");
              });
    server.on("/cue-viewer", HTTP_GET,
              [](AsyncWebServerRequest *request) {
                  Serial.println("HTTP_GET: cue-viewer.html");
                  request->send(LittleFS, "/cue-viewer.html", "text/html");
              });
    server.on("/aria-viewer", HTTP_GET,
              [](AsyncWebServerRequest *request) {
                  Serial.println("HTTP_GET: aria-viewer.html");
                  request->send(LittleFS, "/aria-viewer.html", "text/html");
              });
    server.on("/serial-viewer", HTTP_GET,
              [](AsyncWebServerRequest *request) {
                  Serial.println("HTTP_GET: serial-viewer.html");
                  request->send(LittleFS, "/serial-viewer.html", "text/html");
              });
    server.serveStatic("/", LittleFS, "/");
    server.addHandler(&events);
    server.begin();
    Serial.println("Started web server.");
}

// Loop procedure
void loop() {
    Twelite.update();
}

// Create unique id from MAC address for SSID string
uint16_t createUidFromMac() {
    uint8_t mac[6];
    WiFi.macAddress(mac);
    uint16_t uidFromMac = 0;
    for (int i = 0; i < 6; i++) { uidFromMac += ~(mac[i]); }
    return uidFromMac;
}

// Create JSON string from parsed App_Twelite packets
String createJsonFrom(const ParsedAppTwelitePacket& packet) {
    JSONVar jsonData;
    jsonData["app_type"] = "app_twelite";
    jsonData["lqi"] = packet.u8Lqi;
    jsonData["timestamp"] = packet.u16SequenceNumber;
    jsonData["lid"] = packet.u8SourceLogicalId;
    jsonData["vcc"] = packet.u16SupplyVoltage;
    jsonData["di1_value"] = packet.bDiState[0] ? "low" : "high";
    jsonData["di2_value"] = packet.bDiState[1] ? "low" : "high";
    jsonData["di3_value"] = packet.bDiState[2] ? "low" : "high";
    jsonData["di4_value"] = packet.bDiState[3] ? "low" : "high";
    jsonData["ai1_value"] = packet.u16AiVoltage[0];
    jsonData["ai2_value"] = packet.u16AiVoltage[1];
    jsonData["ai3_value"] = packet.u16AiVoltage[2];
    jsonData["ai4_value"] = packet.u16AiVoltage[3];
    return JSON.stringify(jsonData);
}

// Create JSON string from parsed App_ARIA packets
String createJsonFrom(const ParsedAppAriaPacket& packet) {
    JSONVar jsonData;
    jsonData["app_type"] = "app_aria_twelite_aria_mode";
    jsonData["lqi"] = packet.u8Lqi;
    jsonData["seq"] = packet.u16SequenceNumber;
    jsonData["lid"] = packet.u8SourceLogicalId;
    jsonData["vcc"] = packet.u16SupplyVoltage;
    jsonData["mag_status"] = packet.u8MagnetState;
    jsonData["temp_x100"] = packet.i16Temp100x;
    jsonData["humid_x100"] = packet.u16Humid100x;
    return JSON.stringify(jsonData);
}

// Create JSON string from parsed App_CUE packet
String createJsonFrom(const ParsedAppCuePacket& packet) {
    JSONVar jsonData;
    jsonData["app_type"] = "app_cue_twelite_cue_mode";
    jsonData["lqi"] = packet.u8Lqi;
    jsonData["seq"] = packet.u16SequenceNumber;
    jsonData["lid"] = packet.u8SourceLogicalId;
    jsonData["vcc"] = packet.u16SupplyVoltage;
    jsonData["mag_status"] = packet.u8MagnetState;
    int16_t xAverage = 0;
    for (int i = 0; i < packet.u8SampleCount; i++) {
        xAverage = (i * xAverage + packet.i16SamplesX[i]) / (i + 1);
    }
    jsonData["accel_x"] = xAverage;
    int16_t yAverage = 0;
    for (int i = 0; i < packet.u8SampleCount; i++) {
        yAverage = (i * yAverage + packet.i16SamplesY[i]) / (i + 1);
    }
    jsonData["accel_y"] = yAverage;
    int16_t zAverage = 0;
    for (int i = 0; i < packet.u8SampleCount; i++) {
        zAverage = (i * zAverage + packet.i16SamplesZ[i]) / (i + 1);
    }
    jsonData["accel_z"] = zAverage;
    if (packet.bHasAccelEvent) {
        jsonData["event_factor"] = "Accel";
        switch (packet.u8AccelEvent) {
        case 0x01: { Serial.println("Dice1"); jsonData["event_desc"] = "Dice1"; break; }
        case 0x02: { Serial.println("Dice2"); jsonData["event_desc"] = "Dice2"; break; }
        case 0x03: { Serial.println("Dice3"); jsonData["event_desc"] = "Dice3"; break; }
        case 0x04: { Serial.println("Dice4"); jsonData["event_desc"] = "Dice4"; break; }
        case 0x05: { Serial.println("Dice5"); jsonData["event_desc"] = "Dice5"; break; }
        case 0x06: { Serial.println("Dice6"); jsonData["event_desc"] = "Dice6"; break; }
        case 0x08: { Serial.println("Shake"); jsonData["event_desc"] = "Shake"; break; }
        case 0x10: { Serial.println("Move"); jsonData["event_desc"] = "Move"; break; }
        default: { jsonData["event_desc"] = "Unknown"; break; }
        }
    } else {
        jsonData["event_factor"] = "Unknown";
    }
    return JSON.stringify(jsonData);
}

// Create JSON string from bare packets
String createJsonFrom(const BarePacket& packet) {
    JSONVar jsonData;
    if (packet.u16PayloadSize < (1024 - 3)) {
        jsonData["app_type"] = "any";
        String str = ":";
        for (int i = 0; i < packet.u16PayloadSize; i++) {
            const uint8_t bit74 = ((packet.u8Payload[i] >> 4) & 0xF);
            const uint8_t bit30 = ((packet.u8Payload[i] >> 0) & 0xF);
            str.concat(static_cast<char>((bit74 < 0xA) ? ('0' + bit74) : ('A' + bit74 - 0xA)));
            str.concat(static_cast<char>((bit30 < 0xA) ? ('0' + bit30) : ('A' + bit30 - 0xA)));
        }
        const uint8_t bit74 = ((packet.u8Checksum >> 4) & 0xF);
        const uint8_t bit30 = ((packet.u8Checksum >> 0) & 0xF);
        str.concat(static_cast<char>((bit74 < 0xA) ? ('0' + bit74) : ('A' + bit74 - 0xA)));
        str.concat(static_cast<char>((bit30 < 0xA) ? ('0' + bit30) : ('A' + bit30 - 0xA)));
        str.concat("[CR][LF]");
        jsonData["raw_str"] = str.c_str();
    }
    return JSON.stringify(jsonData);
}

/*
 * Copyright (C) 2023 Mono Wireless Inc. All Rights Reserved.
 * Released under MW-OSSLA-1J,1E (MONO WIRELESS OPEN SOURCE SOFTWARE LICENSE AGREEMENT).
 */
