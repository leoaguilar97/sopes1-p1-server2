import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import ForumIcon from '@material-ui/icons/Forum';
import MultilineChartIcon from '@material-ui/icons/MultilineChart';
import CustomizedTimeline from './Timeline'
import BuildIcon from '@material-ui/icons/Build';
import ConfigTab from './ConfigTab';
import Charts from "./Charts";

function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box p={3}>
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
    );
}

TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.any.isRequired,
    value: PropTypes.any.isRequired,
};

function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
        backgroundColor: theme.palette.background.paper,
    },
}));

export default function SimpleTabs() {
    const classes = useStyles();
    const [value, setValue] = React.useState(0);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const [state, setState] = React.useState({
        csa: true,
        csb: true,
        ipa: "http://35.237.92.100",
        ipb: "http://104.196.187.68"
    });

    let handleConfigChange = (config) => {
        setState(config);
    }

    let getState = () => {
        return state;
    }

    return (
        <div className={classes.root}>

            <AppBar position="static">
                <Tabs value={value} onChange={handleChange} aria-label="simple tabs example">
                    <Tab icon={<ForumIcon />} {...a11yProps(0)} aria-label="phone" label="Ver oraciones" />
                    <Tab icon={<MultilineChartIcon />} {...a11yProps(1)} aria-label="phone" label="STATS" />
                    <Tab icon={<BuildIcon />} {...a11yProps(2)} aria-label="phone" label="Configuración" />
                </Tabs>
            </AppBar>

            <TabPanel value={value} index={0}>
                <CustomizedTimeline getState={getState} />
            </TabPanel>

            <TabPanel value={value} index={1}>
                <Charts getState={getState} />
            </TabPanel>

            <TabPanel value={value} index={2}>
                <ConfigTab onConfigChange={handleConfigChange} getState={getState} />
            </TabPanel>
        </div>
    );
}