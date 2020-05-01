import React from 'react';
import { Grid, Typography } from '@material-ui/core';
import Combobox from '../components/product-gallery/Combobox';

const CategorySelector = (props) => {
    return (
        <Grid container>
            <Grid item xs={12}>
                <Typography variant="body1">
                    <strong>Categories</strong>
                </Typography>
                <br/>
                <Combobox 
                    selectedItem={props.selectedItem}
                    itemList={props.itemList} 
                    onChange={(selected) => {
                        if(typeof props.onChange === 'function') {
                            props.onChange(selected)
                        }
                    }}/>
            </Grid>
        </Grid>
    )
}

export default CategorySelector;