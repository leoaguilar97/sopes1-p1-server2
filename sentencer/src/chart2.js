import React, { Component } from 'react';
import CanvasJSReact from './lib/canvasjs.react';

const CanvasJSChart = CanvasJSReact.CanvasJSChart;

const servers = [{ label: "SERVIDOR A", y: 0 }, { label: "SERVIDOR B", y: 0 }];

let updateInterval = 5000;

class BarChart extends Component {
    constructor(props) {
        super();
        this.updateChart = this.updateChart.bind(this);
    }

    componentDidMount() {
        setInterval(this.updateChart, updateInterval);
    }

    updateChart() {
        if (this.chart) {

            let _data = this.props.getData();

            servers[0].y = _data[0].cpu;
            servers[1].y = _data[1].cpu;

            this.chart.render();
        }
    }

    render() {
        const options_line = {
			exportEnabled: true,
			animationEnabled: true,
            theme: "light",
            title: {
                text: "USO DE CPU"
            },
            subtitles: [{
                text: "SERVIDOR A Y B"
            }],

            axisY: {
                title: "CPU UTILIZADO (%)",
                includeZero: true,
                suffix: "%",
                maximum: 100
            },

            data: [{
                type: "column",
				yValueFormatString: "#,###'%'",
				indexLabel: "{y}",
                dataPoints: servers
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

export default BarChart;