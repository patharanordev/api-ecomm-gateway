/* eslint-disable no-use-before-define */
import React from 'react';
import Chip from '@material-ui/core/Chip';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';

const useStyles = makeStyles((theme) => ({
  root: {
    '& > * + *': {
      marginTop: theme.spacing(2),
    },
  },
}));

export default function Combobox(props) {
  const classes = useStyles();
  const itemList = props.itemList ? props.itemList : [];

  const [selectedItem, setSelectedItem] = React.useState(props.selectedItem ? props.selectedItem : { title:''})


  console.log('Combobox itemList : ', itemList)

  return (
    <div className={classes.root}>
      <Autocomplete
        id="combo-box-demo"
        size="small"
        options={itemList}
        getOptionLabel={(option) => option && option.title ? option.title : ''}
        renderInput={(params) => <TextField {...params} label="Category" variant="outlined" placeholder="product type" />}
        value={selectedItem}
        onChange={(event, value, reason) => { 
          console.log('On select combobox:', value);
          setSelectedItem(value)
          if(typeof props.onChange==='function') props.onChange(value);
        }}
      />
    </div>
  );
}