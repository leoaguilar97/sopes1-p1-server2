import React, { Component } from 'react';
import Timeline from '@material-ui/lab/Timeline';
import TimelineItem from '@material-ui/lab/TimelineItem';
import TimelineSeparator from '@material-ui/lab/TimelineSeparator';
import TimelineConnector from '@material-ui/lab/TimelineConnector';
import TimelineContent from '@material-ui/lab/TimelineContent';
import TimelineOppositeContent from '@material-ui/lab/TimelineOppositeContent';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import CloudIcon from '@material-ui/icons/Cloud';
import RestoreFromTrashIcon from '@material-ui/icons/RestoreFromTrash';
import Chip from '@material-ui/core/Chip';
import Alert from '@material-ui/lab/Alert';
import Skeleton from '@material-ui/lab/Skeleton';
import Avatar from '@material-ui/core/Avatar';
import Badge from '@material-ui/core/Badge';
import Switch from '@material-ui/core/Switch';

const updateInterval = 3000;
const max_consecutive_errors = 10;
let consecutive_errors = 0;
let show_ce_alert = true;

let check_server_a = false;
let check_server_b = false;
let date_sort = false;
let has_data = false;

export default class CustomizedTimeline extends Component {

    constructor(props) {
        super();

        this.state = {
            timeline_items: [
                <Skeleton animation="wave" />,
                <Skeleton />,
                <Skeleton animation="wave" />],
            server_lbls: [],
            config: props.getState(),
            alert_msg: null
        };

        this.handleChange.bind(this);
        this.process_server_b.bind(this);
        this.process_server_a.bind(this);
    }

    handleDateSortChange(e) {
        date_sort = e.target.checked;
        console.log("Cambiado a: " + date_sort);
    }

    populate_data(data) {
        let new_docs = [];
        consecutive_errors = 0;

        if (data.length === 0) {
            new_docs = [
                <Skeleton animation="wave" />,
                <Skeleton />,
                <Skeleton animation="wave" />
            ]

            has_data = false;
        }
        else {
            //ordenar datos
            data.sort(function (a, b) {
                return new Date(date_sort ? b.js_time : a.js_time) - new Date(date_sort ? a.js_time : b.js_time);
            });
            has_data = true;

            for (const index in data) {
                const entry = data[index];
                //console.log(data);
                //console.log(entry.server)
                let is_from_server_a = entry.server === "a";

                let avatar_style = {
                    color: "white",
                    backgroundColor: is_from_server_a ? "#2196f3" : "#ff1744",
                };

                let badge_pos = index % 2 === 0 ? "right" : "left";
                let badge_content = is_from_server_a ? "Servidor A" : "Servidor B";
                let badge_color = is_from_server_a ? "primary" : "secondary";

                new_docs.push(
                    <TimelineItem>
                        <TimelineOppositeContent>
                        </TimelineOppositeContent>
                        <TimelineSeparator>
                            <Avatar style={avatar_style}> {entry.author.substring(0, 1)}</Avatar>
                            {index < data.length - 1 && <TimelineConnector />}
                        </TimelineSeparator>
                        <TimelineContent>
                            <Badge badgeContent={badge_content} anchorOrigin={{ vertical: 'top', horizontal: badge_pos }} color={badge_color}>

                                <Paper elevation={3} style={{ padding: '6px 16px' }}>
                                    <Typography variant="h6" component="h1"> {entry.author} </Typography>

                                    <Typography variant="body2" color="textSecondary">
                                        <small>Fecha: {entry.time}</small>
                                    </Typography>
                                    <Typography>{entry.sentence}</Typography>
                                </Paper>
                            </Badge>
                        </TimelineContent>
                    </TimelineItem>
                )
            }
        }

        this.setState({ ...this.state, "timeline_items": new_docs, alert_msg: null });
    };

    process_server_b(data) {

        fetch(this.state.config.ipb + "/data")
            .then(res => res.json())
            .then(
                (result) => {
                    result = result.data;
                    if (result.length !== 0) {
                        result = result.map(r => { r.server = "b"; return r; });
                        data = data.concat(result);
                    }

                    this.populate_data(data);
                },

                (error) => {
                    console.log("******** ERROR SERVER B*********");
                    console.log(error);

                    consecutive_errors++;

                    let error_msg = "Error obteniendo los datos del servidor B.";
                    if (this.state.config.csa) {
                        error_msg = "Error obteniendo los datos de los servidores A y B.";
                    }

                    let alert = <Alert severity="error">{error_msg}</Alert>;
                    this.setState({ ...this.state, "alert_msg": alert })
                }
            )
    }

    process_server_a() {
        let call_b = this.state.config.csb;

        fetch(this.state.config.ipa + "/data")
            .then(res => res.json())
            .then(
                (result) => {
                    result = result.data.map(r => { r.server = "a"; r.date = new Date(r.js_time).toString(); return r; })
                    if (call_b) {
                        this.process_server_b(result);
                    }
                    else {
                        this.populate_data(result);
                    }
                },

                (error) => {
                    console.log("******** ERROR SERVER A*********");
                    console.log(error);

                    consecutive_errors++;

                    let alert = <Alert severity="error">Error obteniendo los datos del servidor A. {}</Alert>;

                    this.setState({ ...this.state, "alert_msg": alert })

                    if (call_b) {
                        this.process_server_b([]);
                    }
                }
            )
    };

    empty_server(_this, server_ip) {
        fetch(server_ip + "/delete")
            .then(res => { try { return res.json(); } catch { }; return {} })
            .then((result) => {
                let success = result.msg === "ok" || result.message === "ok";
                let error_msg = success ? "Los datos del servidor fueron eliminados" : "No se pudieron eliminar los datos";
                this.setState({ ...this.state, "alert_msg": <Alert severity={success ? "success" : "error"}>{error_msg}</Alert> })
            });
    }

    render() {
        check_server_a = this.state.config.csa;
        check_server_b = this.state.config.csb;

        if (this.state.config.csa) {
            this.state.server_lbls.push(<Chip
                label="SERVIDOR A"
                color="primary"
                component="a" href={this.state.config.ipa + "/data"} target="__blank" clickable
                icon={<CloudIcon />}
                style={{ textDecoration: 'none', "margin-right": "5px", color: "white", "padding-left": "5px" }}
            />);

            this.state.server_lbls.push(<Chip
                label="LIMPIAR SERVIDOR A"
                color="primary"
                clickable
                onClick={(e) => { this.empty_server(this, this.state.config.ipa); }}
                icon={<RestoreFromTrashIcon />}
                style={{ textDecoration: 'none', "margin-right": "5px", color: "white", "padding-left": "5px" }}
            />);
        }

        if (this.state.config.csb) {
            this.state.server_lbls.push(<Chip
                label="SERVIDOR B"
                color="secondary"
                component="a" href={this.state.config.ipb} target="__blank" clickable
                icon={<CloudIcon />}
                style={{ textDecoration: 'none', "margin-right": "5px", color: "white", "padding-left": "5px" }}
            />);

            this.state.server_lbls.push(<Chip
                label="LIMPIAR SERVIDOR B"
                color="secondary"
                clickable
                onClick={(e) => { this.empty_server(this, this.state.config.ipb); }}
                icon={<RestoreFromTrashIcon />}
                style={{ textDecoration: 'none', "margin-right": "5px", color: "white", "padding-left": "5px" }}
            />);
        }

        if (this.state.config.csa || this.state.config.csb) {
            this.state.server_lbls.push(<hr></hr>);
        }

        return (
            <div >
                { this.state.server_lbls}
                {has_data ? <div> Datos nuevos primero <Switch
                    checked={date_sort}
                    onChange={this.handleDateSortChange}
                    name="Checked"
                    inputProps={{ 'aria-label': 'secondary checkbox'}}
                /> </div>: null }
                { this.state.alert_msg}
                < Timeline align="alternate" >
                    {this.state.timeline_items}
                </Timeline>
            </div >
        );
    }

    handleChange() {
        if (!check_server_a && !check_server_b) {
            let new_docs = [
                <Skeleton animation="wave" />,
                <Skeleton />,
                <Skeleton animation="wave" />
            ]

            this.setState({ ...this.state, "timeline_items": new_docs });
            return;
        }

        if (consecutive_errors > max_consecutive_errors) {
            if (show_ce_alert) {
                let alert = <Alert severity="error">Recarga la página para continuar...</Alert>;
                this.setState({ ...this.state, "alert_msg": alert })
                show_ce_alert = false;
            }
            return;
        }

        if (check_server_a) {
            this.process_server_a();
        }

        else if (check_server_b) {
            console.log("Revisando solo b :'v");
            this.process_server_b([]);
        }

        this.setState({ ...this.state, "config": this.props.getState() })

    };

    componentDidMount() {
        setInterval(() => { this.handleChange(); }, updateInterval);
    }
}

