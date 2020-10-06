import React, { Component } from 'react';
import CanvasJSReact from './lib/canvasjs.react';
const CanvasJSChart = CanvasJSReact.CanvasJSChart;

const server_a = [];
const server_b = [];

for(let i = 0; i < 15; i++){
    let dummy = { };
    server_a.push(dummy);
    server_b.push(dummy);
}

let xVal = server_a.length + 1;
let yVal = 15;
let yVal2 = 15;
let updateInterval = 5000;

class Chart extends Component {
    constructor() {
        super();
        this.updateChart = this.updateChart.bind(this);
    }

    componentDidMount() {
        setInterval(this.updateChart, updateInterval);
    }

    updateChart() {
        if (this.chart) {
            let _data = this.props.getData();
            
            yVal = _data[0].ram;
            yVal2 = _data[1].ram;

            xVal++;

            server_a.push({ label: _data[0].time, x: xVal, y: yVal });
            server_b.push({ label: _data[1].time, x: xVal, y: yVal2 });

            if (server_a.length > 15) {
                server_a.shift();
                server_b.shift();
            }

            this.chart.render();
        }
    }

    render() {
        const options_line = {
			exportEnabled: true,
			animationEnabled: true,
            theme: "light",
            title: {
                text: "USO DE RAM"
            },
            subtitles: [{
                text: "SERVIDOR A Y B"
            }],

            axisY: {
                title: "RAM UTILIZADA (%)",
                includeZero: true,
                suffix: "%",
                maximum: 100
            },
            axisX: {
                title: "TIEMPO (HH:MM:SS)",
            },
            data: [{
                type: "area",
                showInLegend: true,
                name: "serverA",
                legendText: "Servidor A",                
                dataPoints: server_a
            }, {
                type: "area",
                showInLegend: true,
                name: "serverB",
                legendText: "Servidor B",
                dataPoints: server_b
            }]
        }

        return (
            <div>
                <CanvasJSChart options={options_line}
                    onRef={ref => this.chart = ref}
                />
            </div>
        );
    }
}

export default Chart;