import React, { Component } from 'react';

import Chart from './chart';
import Chart2 from './chart2';
import PieChart from './PieChart';
import Alert from '@material-ui/lab/Alert';

const updateInterval = 5000;


let ip_server_a = "";
let ip_server_b = "";

let gtime = () => {
    let today = new Date();
    return today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
};

let data = [{cpu: 0, ram: 0, docs: 0, time: ""}, {cpu: 0, ram: 0, docs: 0, time: gtime()}];

class Charts extends Component {
    constructor(props) {
        super();
        this.state = {
            config: props.getState(),
            alert_msg1: null,
            alert_msg2: null
        };

        this.updateChart.bind(this);
    }

    updateChart(_this) {
        if (ip_server_a !== "") {
            fetch(ip_server_a + "/stats")
                .then(res => res.json())
                .then(
                    (result) => {
                        result = result.stats;
                        data[0] = result;
                        this.setState({ ...this.state, alert_msg1: null });

                        let old_data = data[0];
                        
                        data[0] = { 
                            cpu: result.cpu || old_data.cpu,
                            ram: result.ram || old_data.ram,
                            docs: result.docs,
                            time: gtime()
                        }
                    },

                    (error) => {
                        console.log("******** ERROR SERVER A *********");
                        console.log(error);

                        this.setState({ ...this.state, alert_msg1: <div><Alert severity="error">Error obteniendo datos del servidor A.</Alert><br></br></div> });
                    }
                );
        }

        if (ip_server_b !== "") {
            fetch(ip_server_b + "/stats")
                .then(res => res.json())
                .then(
                    (result) => {

                        result = result.stats;
                        let old_data = data[1];

                        data[1] = { 
                            cpu: result.cpu || old_data.cpu,
                            ram: result.ram || old_data.ram,
                            docs: result.docs,
                            time: gtime()
                        }

                        this.setState({ ...this.state, alert_msg2: null });
                    },

                    (error) => {
                        console.log("******** ERROR SERVER B *********");
                        console.log(error);

                        this.setState({ ...this.state, alert_msg2: <div><Alert severity="error">Error obteniendo datos del servidor B.</Alert><br></br></div> });
                    }
                );
        }
    }

    componentDidMount() {
        setInterval(() => {this.updateChart(this)}, updateInterval);
    }

    getData(){
        return data;
    }

    render() {

        ip_server_a = this.state.config.ipa;
        ip_server_b = this.state.config.ipb;

        return (
            <div>
                {this.state.alert_msg1}
                {this.state.alert_msg2}
                <Chart getData={this.getData}/>
                <hr></hr>
                <br></br>
                <Chart2 getData={this.getData}/>
                <hr></hr>
                <br></br>
                <PieChart getData={this.getData} />
            </div>
        );
    }
}

export default Charts;