import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import NumberFormat from 'react-number-format';
import {
    Grid, Typography
} from '@material-ui/core';
import ItemCard from './ItemCard';

const useStyles = makeStyles({
    root: {
        maxWidth: 345,
    },
});

export default function SimStore(props) {
    const classes = useStyles();

    return (

        <Grid item xs={12}>
            <Grid container spacing={2}>
            {
                props.items && props.items.length > 0
                ?
                    props.items.map((o,i) => {
                        return (
                            <Grid item xs={12} md={3} key={i}>
                                <ItemCard key={`item-card-${i}`}
                                    isShow={props.isShow ? props.isShow : false}
                                    image={o.url_image ? o.url_image : ''}
                                    title={o.model ? o.model : ''}
                                    subtitle={
                                        <Typography 
                                            key={`item-card-subtitle-${i}`}
                                            component={'span'} 
                                            variant={'body1'}
                                            >

                                            <strong key={`item-card-price-label-${i}`}>Price: </strong>
                                            <NumberFormat key={`item-card-price-value-${i}`}
                                                value={o.price ? o.price : 0}
                                                displayType={'text'} 
                                                thousandSeparator={true} 
                                                decimalScale={2}
                                                prefix={'$'} />
                                        </Typography>
                                    }
                                    labelActionBtn={'Buy'}
                                    onPressActionBtn={() => {
                                        if(typeof props.onPressActionBtn === 'function') {
                                            props.onPressActionBtn(o)
                                        }
                                    }}
                                />
                            </Grid>
                        )
                    })
                :
                    null
            }
            </Grid>
        </Grid>
    );
}