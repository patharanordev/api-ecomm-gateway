import React from 'react';
import clsx from 'clsx';
import * as moment from 'moment';
import dynamic from 'next/dynamic';
import NumberFormat from 'react-number-format';
import { makeStyles } from '@material-ui/core/styles';
import Skeleton from '../skeletons/TableBody';
import Title from '../Title';
import {
    Grid, Paper, Select, FormControl, InputLabel, 
    Table, TableBody, TableCell, TableHead, TableRow
} from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
    paper: {
        padding: theme.spacing(2),
        display: 'flex',
        overflow: 'auto',
        flexDirection: 'column',
    },
    formControl: {
        margin: theme.spacing(1),
        minWidth: 120,
    },
    fixedHeight: { height: '100%', },
    selectEmpty: { marginTop: theme.spacing(2), },
}));

const statusOptions = [
    { id:0, label:'Waiting for Verified' },
    { id:1, label:'Verified' },
    { id:2, label:'Payment Failed' },
    { id:3, label:'Packing' },
    { id:4, label:'Ready to Ship' },
    { id:5, label:'Shipped' }
];

export default function OrdersTable(props) {
    const classes = useStyles();
    const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);
    const handleStatusChange = (e, record_id) => {
        if(typeof props.onStatusChange === 'function') {
            console.log({ record_id:record_id, data:e.target.value })
            props.onStatusChange(e, record_id);
        }
    };

    return (
        <Grid container spacing={3}>
            <Grid item xs={12}>
                <Paper className={fixedHeightPaper}>
                    <React.Fragment>
                        <Title>Order Item(s)</Title>
                        <Table size="small">
                            <TableHead>
                                <TableRow>
                                    <TableCell>Date</TableCell>
                                    <TableCell>Name</TableCell>
                                    <TableCell>Product ID</TableCell>
                                    <TableCell>Ship To</TableCell>
                                    <TableCell>Payment Method</TableCell>
                                    <TableCell align="right">Sale Amount</TableCell>
                                    <TableCell>Status</TableCell>
                                </TableRow>
                            </TableHead>
                            {

                            props.orderItems && Array.isArray(props.orderItems)
                            ?
                                <TableBody>
                                {
                                    props.orderItems.map((o,i) => {
                                        let price = -1;
                                        try { price = parseFloat(o.price)*parseFloat(o.qty); } 
                                        catch(err) { console.warn('Unknown type of price value'); }
                                        return (
                                        <TableRow key={`order-index-${i}`}>
                                            <TableCell>
                                            {moment(o.timestamp).format('YYYY-MM-DD HH:mm')}
                                            </TableCell>
                                            <TableCell>{Array.isArray(o.users) && o.users.length>0 ? o.users[0].username : 'UNKNOWN FORMAT'}</TableCell>
                                            <TableCell>{o.product_id}</TableCell>
                                            <TableCell>{o.shipping}</TableCell>
                                            <TableCell>{`${o.payment_method} :: **** ${o.payment_card_id.substring(o.payment_card_id.length-4)}`}</TableCell>
                                            <TableCell align="right">
                                            <NumberFormat 
                                                value={price} 
                                                displayType={'text'} 
                                                thousandSeparator={true} 
                                                prefix={'$'} />
                                            </TableCell>
                                            <TableCell>
                                                <FormControl className={classes.formControl}>
                                                    <InputLabel htmlFor="status-select">Status</InputLabel>
                                                    <Select 
                                                        value={o.order_status}
                                                        onChange={(e) => handleStatusChange(e, o.record_id)}
                                                        defaultValue={statusOptions[0].label} 
                                                        id="status-select">
                                                    {
                                                        statusOptions.map((o, oIndex) => {
                                                            return <option value={o.label} key={`${oIndex}`}>{o.label}</option>
                                                        })
                                                    }
                                                    </Select>
                                                </FormControl>
                                            </TableCell>
                                        </TableRow>
                                        )
                                    })
                                }
                                </TableBody>
                            :
                                <Skeleton row={10} col={7}/>
                            }
                        </Table>
                    </React.Fragment>
                </Paper>
            </Grid>
        </Grid>
    );
}