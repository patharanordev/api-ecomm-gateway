import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import NumberFormat from 'react-number-format';
import {
    Grid, Typography, Popper, Grow, Paper,
    ClickAwayListener, MenuList,
    MenuItem, Badge, IconButton
} from '@material-ui/core';
import {
    ShoppingCart as ShoppingCartIcon,
    Delete as DeleteIcon
} from '@material-ui/icons';

const useStyles = makeStyles({
    root: {
        maxWidth: 345,
    },
});

export default function ListItemPopper(props) {
    const classes = useStyles();
    const [open, setOpen] = React.useState(false);
    const anchorRef = React.useRef(null);

    const handleToggle = () => {
        setOpen((prevOpen) => !prevOpen);
    };

    const handleClose = (event) => {
        if (anchorRef.current && anchorRef.current.contains(event.target)) {
            return;
        }
    
        setOpen(false);
    };

    function handleListKeyDown(event) {
        if (event.key === 'Tab') {
            event.preventDefault();
            setOpen(false);
        }
    }

    return (
        <>
            <IconButton
                edge="start"
                color="inherit"
                aria-label="open drawer"
                onClick={handleToggle}
                ref={anchorRef}
                aria-controls={open ? 'menu-list-grow' : undefined}
            >
                <Badge badgeContent={
                    props.cart && Array.isArray(props.cart) 
                    ? props.cart.length
                    : 0
                } color="secondary">
                    <ShoppingCartIcon />
                </Badge>
            </IconButton>
            <Popper 
                open={open} 
                transition 
                disablePortal 
                role={undefined} 
                anchorEl={anchorRef.current} 
                style={{ width:300, zIndex:1 }}
            >

            {({ TransitionProps, placement }) => (
                <Grow
                {...TransitionProps}
                style={{ transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom' }}
                >
                <Paper>
                    <ClickAwayListener onClickAway={handleClose}>
                    <MenuList autoFocusItem={open} id="menu-list-grow" onKeyDown={handleListKeyDown}>

                        <MenuItem>
                            <Grid container>
                                <Grid item xs={6} align={'left'}>
                                    <Typography variant='caption'><strong>item</strong></Typography>
                                </Grid>
                                <Grid item xs={3} align={'center'}>
                                    <Typography variant='caption'><strong>price</strong></Typography>
                                </Grid>
                                <Grid item xs={3} align={'center'}></Grid>
                            </Grid>
                        </MenuItem>
                        {
                            props.cart && Array.isArray(props.cart) 
                            ? 
                                props.cart.map((o,i) => {
                                    return (
                                        <MenuItem key={`cart-menu-item-${i}`}>
                                            <Grid container>
                                                <Grid item xs={6} style={{ alignSelf:'center' }}>
                                                    <Grid container>
                                                        <Grid item xs={12}>
                                                            <Typography variant='body1' noWrap={true}>
                                                                <strong>{o.data && o.data.model ? o.data.model : ''}</strong>
                                                            </Typography>
                                                        </Grid>
                                                        <Grid item xs={12}>
                                                        </Grid>
                                                    </Grid>
                                                </Grid>
                                                <Grid item xs={3} style={{ alignSelf:'center' }}>
                                                    <Grid container>
                                                        <Grid item xs={12} align={'center'}>
                                                            <small>
                                                                <NumberFormat key={`item-card-price-value-${i}`}
                                                                    value={o.data && o.data.price ? o.data.price : 0}
                                                                    displayType={'text'} 
                                                                    thousandSeparator={true} 
                                                                    decimalScale={2}
                                                                    prefix={'$'} />
                                                                {` X ${o.amount ? o.amount : 0}`}
                                                            </small>
                                                        </Grid>
                                                    </Grid>
                                                </Grid>
                                                <Grid item xs={3} align={'right'} style={{ alignSelf:'center' }}>
                                                    <IconButton
                                                        onClick={(e) => {
                                                            handleClose(e)
                                                            if(typeof props.onClickDelete === 'function') {
                                                                props.onClickDelete(i)
                                                            }
                                                        }}
                                                    >
                                                        <DeleteIcon />
                                                    </IconButton>
                                                </Grid>
                                            </Grid>
                                        </MenuItem>
                                    )
                                })
                            :
                                null
                        }
                        <MenuItem onClick={(e) => {
                            handleClose(e)
                            if(typeof props.onClickPayment === 'function') {
                                props.onClickPayment(props.cart)
                            }
                        }}>
                            <Grid container>
                                <Grid item xs={12} align={'center'}>
                                    <Typography variant='h6'>Payment</Typography>
                                </Grid>
                            </Grid>
                        </MenuItem>
                    </MenuList>
                    </ClickAwayListener>
                </Paper>
                </Grow>
            )}
            </Popper>
        </>
    );
}