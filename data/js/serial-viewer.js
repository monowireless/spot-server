// -*- coding: utf-8-unix -*-
// Pure ECMAScript ES6 (2015)

// Process packet contents on receive
const processDataBarePacket = (data) => {
    if (data.app_type !== "any") {
        return;
    }
    // Add a line
    let serial_console = document.getElementById("serial-console");
    serial_console.value += data.raw_str + "\n";
    serial_console.scrollTop = serial_console.scrollHeight;
};

// Process parsing results
const processDataParsingResult = (data) => {
    if (typeof data !== "string") {
        return;
    }
    switch (data) {
    case "parsed_app_twelite":
        document.getElementById("latest-type").innerHTML = "App_Twelite"; break;
    case "parsed_app_aria_twelite_aria_mode":
        document.getElementById("latest-type").innerHTML = "App_ARIA (ARIA Mode)"; break;
    case "parsed_app_cue_twelite_cue_mode":
        document.getElementById("latest-type").innerHTML = "App_CUE (CUE Mode)"; break;
    case "parsed_app_pal_ambient":
        document.getElementById("latest-type").innerHTML = "App_PAL (AMBIENT)"; break;
    case "parsed_app_pal_motion":
        document.getElementById("latest-type").innerHTML = "App_PAL (MOTION)"; break;
    case "parsed_app_pal_openclose":
        document.getElementById("latest-type").innerHTML = "App_PAL (OPENCLOSE)"; break;
    case "parsed_app_io":
        document.getElementById("latest-type").innerHTML = "App_IO"; break;
    case "parsed_app_uart_ascii":
        document.getElementById("latest-type").innerHTML = "App_UART (Mode A)"; break;
    case "parsed_app_uart_ascii_extended":
        document.getElementById("latest-type").innerHTML = "App_UART (Mode A, Extended)"; break;
    default:
        document.getElementById("latest-type").innerHTML = "Unknown"; break;
    }
};

// Attach event handlers
if (!!window.EventSource) {
    let source = new EventSource("/events");

    source.addEventListener("open", (e) => {
        console.log("Events got Connected!");
    }, false);
    source.addEventListener("error", (e) => {
        if (e.target.readyState != EventSource.OPEN) {
            console.log("Events got Disconnected!");
        }
    }, false);
    source.addEventListener("message", (e) => {
        console.log("message", e.data);
    }, false);

    source.addEventListener("data_bare_packet", (e) => {
        console.log("data_bare_packet", e.data);
        processDataBarePacket(JSON.parse(e.data));
    }, false);

    source.addEventListener("data_parsing_result", (e) => {
        console.log("data_parsing_result", e.data);
        processDataParsingResult(e.data);
    }, false);
}

/*
 * Copyright (C) 2023 Mono Wireless Inc. All Rights Reserved.
 * Released under MW-OSSLA-1J,1E (MONO WIRELESS OPEN SOURCE SOFTWARE LICENSE AGREEMENT).
 */
