import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
    Card, CardActionArea, CardActions, CardContent,
    CardMedia, Button, Typography, Grow, Grid
} from '@material-ui/core';

const useStyles = makeStyles({
    root: {
        maxWidth: 345,
    },
});

export default function ItemCard(props) {
    const classes = useStyles();

    return (
        // <Grow
        //     in={props.isShow}
        //     style={{ transformOrigin: '0 0 0' }}
        //     {...(props.isShow ? { timeout: 1000 } : {})}
        // >
            <Card className={classes.root}>
                <CardActionArea>
                    <CardMedia
                        component="img"
                        alt=""
                        height="140"
                        image={ props.image ? props.image : '' }
                        title={ props.title ? props.title : '' }
                    />
                    <CardContent>
                        <Typography noWrap={true} gutterBottom variant="h6" component="h2">
                        { props.title ? props.title : '' }
                        </Typography>
                        <Typography variant="body1" color="textSecondary" component="p">
                        { props.subtitle ? props.subtitle : '' }
                        </Typography>
                    </CardContent>
                </CardActionArea>
                <CardActions>
                    <Grid item align={'right'}>
                        {
                            props.hasDetailBtn
                            ?
                                <Button size="small" color="primary" onClick={() => {
                                    if(typeof props.onPressDetailBtn == 'function') {
                                        props.onPressDetailBtn()
                                    }
                                }}>
                                { props.labelDetailBtn ? props.labelDetailBtn : 'Detail' }
                                </Button>
                            :
                                null
                        }
                        <Button size="small" color="primary" onClick={() => {
                            if(typeof props.onPressActionBtn == 'function') {
                                props.onPressActionBtn()
                            }
                        }}>
                        { props.labelActionBtn ? props.labelActionBtn : 'Action' }
                        </Button>
                    </Grid>
                </CardActions>
            </Card>

        // </Grow>
    );
}