// -*- coding: utf-8-unix -*-
// Pure ECMAScript ES6 (2015)

// Process packet contents on receive
const processDataAppTwelite = (data) => {
    if (data.app_type !== "app_twelite") {
        return;
    }
    // Digital
    if (data.di1_value == "low") {
        document.getElementById("latest-di1-signal").innerHTML = "🔴";
    } else {
        document.getElementById("latest-di1-signal").innerHTML = "⚪️";
    }
    if (data.di2_value == "low") {
        document.getElementById("latest-di2-signal").innerHTML = "🟢";
    } else {
        document.getElementById("latest-di2-signal").innerHTML = "⚪️";
    }
    if (data.di3_value == "low") {
        document.getElementById("latest-di3-signal").innerHTML = "🔵";
    } else {
        document.getElementById("latest-di3-signal").innerHTML = "⚪️";
    }
    if (data.di4_value == "low") {
        document.getElementById("latest-di4-signal").innerHTML = "🟡";
    } else {
        document.getElementById("latest-di4-signal").innerHTML = "⚪️";
    }
    // Analog
    if (data.ai1_value > 3600) {
        document.getElementById("latest-ai1-signal").innerHTML = "-.--";
    } else {
        document.getElementById("latest-ai1-signal").innerHTML = `${(data.ai1_value / 1000.0).toFixed(2).toString().padStart(4)}`;
    }
    if (data.ai2_value > 3600) {
        document.getElementById("latest-ai2-signal").innerHTML = "-.--";
    } else {
        document.getElementById("latest-ai2-signal").innerHTML = `${(data.ai2_value / 1000.0).toFixed(2).toString().padStart(4)}`;
    }
    if (data.ai3_value > 3600) {
        document.getElementById("latest-ai3-signal").innerHTML = "-.--";
    } else {
        document.getElementById("latest-ai3-signal").innerHTML = `${(data.ai3_value / 1000.0).toFixed(2).toString().padStart(4)}`;
    }
    if (data.ai4_value > 3600) {
        document.getElementById("latest-ai4-signal").innerHTML = "-.--";
    } else {
        document.getElementById("latest-ai4-signal").innerHTML = `${(data.ai4_value / 1000.0).toFixed(2).toString().padStart(4)}`;
    }
    if (data.vcc >= 3000) {
        document.getElementById("latest-vcc-icon").innerHTML = "🔋";
        document.getElementById("latest-vcc-data").innerHTML = `${(data.vcc / 1000.0).toFixed(2).toString().padStart(4)}`;
        document.getElementById("latest-vcc-data").classList.remove("red");
        document.getElementById("latest-vcc-data").classList.remove("yellow");
        document.getElementById("latest-vcc-data").classList.add("green");
    } else if (data.vcc >= 2700) {
        document.getElementById("latest-vcc-icon").innerHTML = "🔋";
        document.getElementById("latest-vcc-data").innerHTML = `${(data.vcc / 1000.0).toFixed(2).toString().padStart(4)}`;
        document.getElementById("latest-vcc-data").classList.remove("red");
        document.getElementById("latest-vcc-data").classList.remove("yellow");
        document.getElementById("latest-vcc-data").classList.remove("green");
    } else if (data.vcc >= 2400) {
        document.getElementById("latest-vcc-icon").innerHTML = "🪫";
        document.getElementById("latest-vcc-data").innerHTML = `${(data.vcc / 1000.0).toFixed(2).toString().padStart(4)}`;
        document.getElementById("latest-vcc-data").classList.remove("red");
        document.getElementById("latest-vcc-data").classList.add("yellow");
        document.getElementById("latest-vcc-data").classList.remove("green");
    } else {
        document.getElementById("latest-vcc-icon").innerHTML = "🪫";
        document.getElementById("latest-vcc-data").innerHTML = `${(data.vcc / 1000.0).toFixed(2).toString().padStart(4)}`;
        document.getElementById("latest-vcc-data").classList.add("red");
        document.getElementById("latest-vcc-data").classList.remove("yellow");
        document.getElementById("latest-vcc-data").classList.remove("green");
    }
    // Quality
    if (data.lqi >= 150) {
        document.getElementById("latest-lqi").innerHTML = `${(data.lqi).toString().padStart(3)}`;
        document.getElementById("latest-lqi").classList.remove("red");
        document.getElementById("latest-lqi").classList.remove("yellow");
        document.getElementById("latest-lqi").classList.add("green");
    } else if (data.lqi >= 100) {
        document.getElementById("latest-lqi").innerHTML = `${(data.lqi).toString().padStart(3)}`;
        document.getElementById("latest-lqi").classList.remove("red");
        document.getElementById("latest-lqi").classList.remove("yellow");
        document.getElementById("latest-lqi").classList.remove("green");
    } else if (data.lqi >= 50) {
        document.getElementById("latest-lqi").innerHTML = `${(data.lqi).toString().padStart(3)}`;
        document.getElementById("latest-lqi").classList.remove("red");
        document.getElementById("latest-lqi").classList.add("yellow");
        document.getElementById("latest-lqi").classList.remove("green");
    } else {
        document.getElementById("latest-lqi").innerHTML = `${(data.lqi).toString().padStart(3)}`;
        document.getElementById("latest-lqi").classList.add("red");
        document.getElementById("latest-lqi").classList.remove("yellow");
        document.getElementById("latest-lqi").classList.remove("green");
    }
    // Timestamp
    document.getElementById("latest-timestamp").innerHTML = `${(data.timestamp / 64.0).toFixed(1).toString().padStart(6)}`;
    // Logical ID
    document.getElementById("latest-lid").innerHTML = `0x${data.lid.toString(16).padStart(2, 0)}`;
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

    source.addEventListener("data_app_twelite", (e) => {
        console.log("data_app_twelite", e.data);
        processDataAppTwelite(JSON.parse(e.data));
    }, false);
}

/*
 * Copyright (C) 2023 Mono Wireless Inc. All Rights Reserved.
 * Released under MW-OSSLA-1J,1E (MONO WIRELESS OPEN SOURCE SOFTWARE LICENSE AGREEMENT).
 */
