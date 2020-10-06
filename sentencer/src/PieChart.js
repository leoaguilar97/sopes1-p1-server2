import React, { Component } from 'react';
import CanvasJSReact from './lib/canvasjs.react';
const CanvasJSChart = CanvasJSReact.CanvasJSChart;

let updateInterval = 2500;
let dp = [
    { y: 0, label: "SERVIDOR A" },
    { y: 0, label: "SERVIDOR B" },
];

class PieChart extends Component {
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
            dp[0].y = _data[0].docs;
            dp[1].y = _data[1].docs;

            this.chart.render();
        }
    }

    render() {
        const options_line = {
			exportEnabled: true,
			animationEnabled: true,
            theme: "light",
            title: {
                text: "CANTIDAD DE DATOS"
            },

            data: [{
                type: "pie",
                startAngle: 75,
				toolTipContent: "<b>{label}</b>: {y} documentos",
                showInLegend: "true",
				legendText: "{label}",
				indexLabelFontSize: 16,
				indexLabel: "{label} - {y} documentos",
                dataPoints: dp
            }],
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

export default PieChart;