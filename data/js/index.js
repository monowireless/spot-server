// -*- coding: utf-8-unix -*-
// Pure ECMAScript ES6 (2015)

// Attach event handlers
if (!!window.EventSource) {
    var source = new EventSource("/events");

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
}

/*
 * Copyright (C) 2023 Mono Wireless Inc. All Rights Reserved.
 * Released under MW-OSSLA-1J,1E (MONO WIRELESS OPEN SOURCE SOFTWARE LICENSE AGREEMENT).
 */
