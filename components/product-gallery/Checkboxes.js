import React from 'react';
import has from 'has';
import { makeStyles } from '@material-ui/core/styles';
import {
    FormLabel, FormControl, FormGroup, FormControlLabel,
    FormHelperText, Checkbox
} from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
    },
    formControl: {
        margin: theme.spacing(3),
    },
}));

export default function Checkboxes(props) {
    const classes = useStyles();
    // const [state, setState] = React.useState({
    //     gilad: true,
    //     jason: false,
    //     antoine: false,
    // });
    const [state, setState] = React.useState(props.attrs);

    const handleChange = (event) => {
        setState({ ...state, [event.target.name]: event.target.checked });
        
        if(typeof props.onSelect === 'function') {
            props.onSelect(event.target.name, event.target.checked);
        }
    };

    const { gilad, jason, antoine } = state;
    const error = [gilad, jason, antoine].filter((v) => v).length !== 2;

    return (
        <div className={classes.root}>
            <FormControl component="fieldset" className={classes.formControl}>
                <FormLabel component="legend">{props.title ? props.title : 'Attribute'}</FormLabel>
                <FormGroup>
                    {
                        Object.keys(props.attrs).map((o,i) => {
                            return (
                                <FormControlLabel
                                    key={`${props.title ? props.title : ''}-idx-${i}`}
                                    control={<Checkbox checked={has(state, o) ? state[o] : false} onChange={handleChange} name={o} />}
                                    label={o}
                                />
                            )
                        })
                    }
                </FormGroup>
            </FormControl>
        </div>
    );
}