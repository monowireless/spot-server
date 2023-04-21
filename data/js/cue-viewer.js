// -*- coding: utf-8-unix -*-
// Pure ECMAScript ES6 (2015)

let latest_accel = {
    x: 0.0,
    y: 0.0,
    z: 0.0
};

// Chart.js and chartjs-plugin-streaming
Chart.defaults.backgroundColor = "#751B43";
Chart.defaults.borderColor = "#FFF";
Chart.defaults.color = "#FFF";
Chart.defaults.font.family = "'Menlo', 'Monaco', 'Consolas', 'Ubuntu Mono', 'DejaVu Sans Mono', 'Source Code Pro', 'Noto Sans Mono', 'ui-monospace', 'monospace'";

const chartColors = {
    red: "rgb(244, 88, 85)",
    orange: "rgb(220, 158, 49)",
    yellow: "rgb(229, 235, 80)",
    green: "rgb(47, 150, 147)",
    blue: "rgb(0, 119, 204)",
    purple: "rgb(149, 87, 217)",
    grey: "rgb(88, 83, 88)"
};
const onRefresh = (chart) => {
    chart.data.datasets.forEach(function(dataset) {
        chart.data.datasets[0].data.push({
            x: Date.now(),
            y: latest_accel.x
        });
        chart.data.datasets[1].data.push({
            x: Date.now(),
            y: latest_accel.y
        });
        chart.data.datasets[2].data.push({
            x: Date.now(),
            y: latest_accel.z
        });
    });
};
const chartConfig = {
    type: "line",
    data: {
	datasets: [{
	    label: "X",
	    backgroundColor: chartColors.red,
	    borderColor: chartColors.red,
	    fill: false,
	    //cubicInterpolationMode: "monotone",
	    data: []
	}, {
	    label: "Y",
	    backgroundColor: chartColors.green,
	    borderColor: chartColors.green,
	    fill: false,
	    //cubicInterpolationMode: "monotone",
	    data: []
	}, {
	    label: "Z",
	    backgroundColor: chartColors.blue,
	    borderColor: chartColors.blue,
	    fill: false,
	    //cubicInterpolationMode: "monotone",
	    data: []
	}]
    },
    options: {
	scales: {
	    x: {
                title: {
		    // display: true,
		    // text: "Time"
		},
                type: "realtime",
		realtime: {
		    duration: 20000,
		    // refresh: 1000,
		    // delay: 1000,
		    // onRefresh: onRefresh
		},
                time: {
                    unit: "second",
                    displayFormats: {
                        "millisecond": "HH:mm:ss",
                        "second": "HH:mm:ss",
                        "minute": "HH:mm:ss",
                        "hour": "HH:mm:ss",
                        "day": "HH:mm:ss",
                        "week": "HH:mm:ss",
                        "month": "HH:mm:ss",
                        "quarter": "HH:mm:ss",
                        "year": "HH:mm:ss"
                    }
                }
	    },
	    y: {
		title: {
		    display: true,
		    text: "Accel [G]"
		},
                ticks: {
                    stepSize: 0.5
                }
	    }
	},
        plugins: {
            title: {
	        // display: true,
	        // text: "Chart"
	    },
            legend: {
                position: "top",
                labels: {
                    boxHeight: 4,
                    boxWidth: 24,
                    padding: 8
                }
            },
	    tooltips: {
                enabled: false
	    }
        },
        animation: false,
        maintainAspectRatio: false,
        responsive: true
    }
};

// Create chart on loading
window.onload = () => {
    let ctx = document.getElementById("accel-chart").getContext("2d");
    window.accelChart = new Chart(ctx, chartConfig);
};

// Process packet contents on receive
const processDataAppCueTweliteCueMode = (data) => {
    if (data.app_type !== "app_cue_twelite_cue_mode") {
        return;
    }
    // Acceleration
    latest_accel.x = (data.accel_x / 1000.0).toFixed(2);
    latest_accel.y = (data.accel_y / 1000.0).toFixed(2);
    latest_accel.z = (data.accel_z / 1000.0).toFixed(2);
    //// Text
    document.getElementById("latest-accel-x").innerHTML = `${((latest_accel.x >= 0) ? "+" : "-") + Math.abs(latest_accel.x).toFixed(2).toString().padStart(5)}`;
    document.getElementById("latest-accel-y").innerHTML = `${((latest_accel.y >= 0) ? "+" : "-") + Math.abs(latest_accel.y).toFixed(2).toString().padStart(5)}`;
    document.getElementById("latest-accel-z").innerHTML = `${((latest_accel.z >= 0) ? "+" : "-") + Math.abs(latest_accel.z).toFixed(2).toString().padStart(5)}`;
    //// Chart
    onRefresh(window.accelChart);
    window.accelChart.update();
    // Event status
    if (data.event_factor === "Accel" ) {
        switch (data.event_desc) {
        case "Dice1":
            document.getElementById("latest-status").src = "./images/dice-1.svg"; break;
        case "Dice2":
            document.getElementById("latest-status").src = "./images/dice-2.svg"; break;
        case "Dice3":
            document.getElementById("latest-status").src = "./images/dice-3.svg"; break;
        case "Dice4":
            document.getElementById("latest-status").src = "./images/dice-4.svg"; break;
        case "Dice5":
            document.getElementById("latest-status").src = "./images/dice-5.svg"; break;
        case "Dice6":
            document.getElementById("latest-status").src = "./images/dice-6.svg"; break;
        case "Shake":
            document.getElementById("latest-status").src = "./images/shake.svg"; break;
        case "Move":
        //     document.getElementById("latest-status").src = "./images/move.svg"; break;
            document.getElementById("latest-status").src = "./images/shake.svg"; break;
        default:
            document.getElementById("latest-status").src = "./images/vanilla.svg"; break;
        }
    }
    // Magnet
    if ((data.mag_status & 0x0F) === 0x00) {
        document.getElementById("latest-magnet").innerHTML = "N/A";
    } else if ((data.mag_status & 0x0F) === 0x01) {
        document.getElementById("latest-magnet").innerHTML = "N";
    } else if ((data.mag_status & 0x0F) === 0x02) {
        document.getElementById("latest-magnet").innerHTML = "S";
    }
    // Power
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
    // Packet number
    document.getElementById("latest-seq").innerHTML = `${(data.seq).toString().padStart(5)}`;
    // Logical ID
    document.getElementById("latest-lid").innerHTML = `0x${(data.lid).toString(16).padStart(2, 0)}`;
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

    // App_CUE receive event
    source.addEventListener("data_app_cue_twelite_cue_mode", (e) => {
        console.log("data_app_cue_twelite_cue_mode", e.data);
        processDataAppCueTweliteCueMode(JSON.parse(e.data));
    }, false);
}

/*
 * Copyright (C) 2023 Mono Wireless Inc. All Rights Reserved.
 * Released under MW-OSSLA-1J,1E (MONO WIRELESS OPEN SOURCE SOFTWARE LICENSE AGREEMENT).
 */
