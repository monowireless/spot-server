// -*- coding: utf-8-unix -*-
// Pure ECMAScript ES6 (2015)

let latest_temp_humid = {
    temp: 0.0,
    humid: 0.0
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
            y: latest_temp_humid.temp
        });
        chart.data.datasets[1].data.push({
            x: Date.now(),
            y: latest_temp_humid.humid
        });
    });
};
const chartConfig = {
    type: "line",
    data: {
	datasets: [{
	    label: "Temp",
            yAxisID: "temp",
	    backgroundColor: chartColors.red,
	    borderColor: chartColors.red,
	    fill: false,
	    //cubicInterpolationMode: "monotone",
	    data: []
	}, {
	    label: "Humid",
            yAxisID: "humid",
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
		    duration: 300000,
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
	    "temp": {
		title: {
		    display: true,
		    text: "Temp [°C]"
		},
                position: "left",
                ticks: {
                    stepSize: 0.5
                }
	    },
	    "humid": {
		title: {
		    display: true,
		    text: "Humid [%]"
		},
                position: "right",
                ticks: {
                    stepSize: 1.0
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
    let ctx = document.getElementById("temp-humid-chart").getContext("2d");
    window.tempHumidChart = new Chart(ctx, chartConfig);
};

// Process packet contents on receive
const processDataAppAriaTweliteAriaMode = (data) => {
    if (data.app_type !== "app_aria_twelite_aria_mode") {
        return;
    }
    // Temp and Humid
    latest_temp_humid.temp = (data.temp_x100 / 100.0).toFixed(2);
    latest_temp_humid.humid = (data.humid_x100 / 100.0).toFixed(2);
    //// Text
    document.getElementById("latest-temp").innerHTML = `${((latest_temp_humid.temp >= 0) ? "+" : "-") + Math.abs(latest_temp_humid.temp).toString().padStart(5)}`;
    document.getElementById("latest-humid").innerHTML = `${(latest_temp_humid.humid).toString().padStart(5)}`;
    //// Chart
    onRefresh(window.tempHumidChart);
    window.tempHumidChart.update();
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

    source.addEventListener("data_app_aria_twelite_aria_mode", (e) => {
        console.log("data_app_aria_twelite_aria_mode", e.data);
        processDataAppAriaTweliteAriaMode(JSON.parse(e.data));
    }, false);
}

/*
 * Copyright (C) 2023 Mono Wireless Inc. All Rights Reserved.
 * Released under MW-OSSLA-1J,1E (MONO WIRELESS OPEN SOURCE SOFTWARE LICENSE AGREEMENT).
 */
