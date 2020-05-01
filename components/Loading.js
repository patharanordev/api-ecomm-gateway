import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
    Fade, Grid, Paper, Typography, CircularProgress
} from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    paper: {
        padding: theme.spacing(2),
        display: 'flex',
        overflow: 'auto',
        flexDirection: 'column',
    },
}));

export default function Loading() {
    const classes = useStyles();
    const [loading, setLoading] = React.useState(false);

    return (
        <>
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <Paper className={classes.paper} style={{ 
                        height:350, 
                        justifyContent:'center', 
                        verticalAlign:'middle' 
                    }}>
                        <div className={classes.root}>
                            <Fade
                                in={true}
                                style={{
                                transitionDelay: loading ? '800ms' : '0ms',
                                }}
                                unmountOnExit
                            >
                                <CircularProgress />
                            </Fade>
                        </div>
                        <br/>
                        <Typography variant={'body1'} align={'center'}>
                            <strong>Loading content...</strong>
                        </Typography>
                    </Paper>
                </Grid>
            </Grid>
        </>
    );
}