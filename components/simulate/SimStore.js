import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import NumberFormat from 'react-number-format';
import CartPopper from './CartPopper';
import ItemCard from './ItemCard';
import {
    Grid, Typography
} from '@material-ui/core';

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
                <Grid item xs={12}>
                    <Grid container>
                        <Grid item xs={9} style={{ alignSelf:'center' }}>
                            <Typography variant='h6' color='inherit' noWrap>
                                <strong>Store Simulation</strong>
                            </Typography>
                        </Grid>
                        <Grid item xs={3} align={'right'}>
                            <CartPopper 
                                cart={props.cart} 
                                onClickPayment={(data) => { 
                                    if(typeof props.onCartPayment === 'function'){
                                        props.onCartPayment(data)
                                    }
                                }}
                                onClickDelete={(objIndex) => {
                                    if(typeof props.onCartDelete === 'function'){
                                        props.onCartDelete(objIndex)
                                    }
                                }}
                            />
                        </Grid>
                    </Grid>
                </Grid>
                {
                    props.items && props.items.length > 0
                    ?
                        props.items.map((o,i) => {
                            return (
                                <Grid item xs={12} sm={6} md={4} lg={3} key={i}>
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