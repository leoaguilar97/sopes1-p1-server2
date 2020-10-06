import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import FormControl from '@material-ui/core/FormControl';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Button from "@material-ui/core/Button";

const useStyles = makeStyles((theme) => ({
  root: {
    '& > *': {
      margin: theme.spacing(1),
      width: '25ch',
    },
  },
}));

export default function ConfigTab(props) {
  const classes = useStyles();

  let parent_state = props.getState();

  const [state, setState] = React.useState({
    csa: parent_state.csa,
    csb: parent_state.csb,
    ipa: parent_state.ipa,
    ipb: parent_state.ipb
  });

  const handleChange = (event) => {
    setState({ ...state, [event.target.name]: event.target.checked });
    props.onConfigChange(state);
  };

  const handleIpChange = (event) => {
    setState({ ...state, [event.target.name]: event.target.value });
    props.onConfigChange(state);
  };

  const { csa, csb, ipa, ipb } = state;

  return (
    <form className={classes.root} noValidate autoComplete="off">
      <div>
        <label>IP Servidor A</label>
        <TextField id="ip-server-a" name="ipa" label="" defaultValue={ipa} variant="outlined" onChange={handleIpChange} />
        <label id="lsa"><small>Ip actual: <a href={ipa} target="__blank">{ipa}</a></small></label>
      </div>

      <div>
        <label>IP Servidor B</label>
        <TextField id="ip-server-b" name="ipb" label="" variant="outlined" defaultValue={ipb} onChange={handleIpChange} />
        <label id="lsb"><small>Ip actual: <a href={ipb} target="__blank">{ipb}</a></small></label>
      </div>

      <FormControl component="fieldset" className={classes.formControl}>
        <label>Servidores a consultar</label>
        <FormGroup>
          <FormControlLabel
            control={<Checkbox checked={csa} onChange={handleChange} name="csa" />}
            label="Servidor A"
          />
          <FormControlLabel
            control={<Checkbox checked={csb} onChange={handleChange} name="csb" />}
            label="Servidor B"
          />
        </FormGroup>
      </FormControl>
      <br></br>
      <div>
      <Button variant="contained" color="primary" onClick={(e) => { props.onConfigChange(state); }}>
        GUARDAR
      </Button></div>
    </form>
  );
}

