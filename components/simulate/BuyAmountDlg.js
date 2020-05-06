import React from 'react';
import has from 'has';
import Loading from '../Loading';
import {
  Grid, Button, Dialog, DialogActions, DialogContent,
  DialogContentText, DialogTitle, ButtonGroup,
  TextField
} from '@material-ui/core';
import { 
  Add as AddIcon, 
  Remove as RemoveIcon 
} from '@material-ui/icons';

export default function BuyAmountDlg(props) {

  const [id, setItemID] = React.useState('');
  const [form, setForm] = React.useState(null);
  const [count, setCount] = React.useState(1);

  const handleEnter = () => {
    if(props.form) {
      const mainKey = {...props.form};
      
      if(has(mainKey, 'pid')) {
        const pid = mainKey['pid']
        console.log('pid:', pid)
        setItemID(pid)
      }

      ['pid', 'category_id'].forEach((v) => {
        console.log('v:', v)
        if(has(mainKey, v)) delete mainKey[v];
      })
      setForm(mainKey)
    }
  }

  const handleClickCancel = () => {
    if(typeof props.onClose === 'function') {
      props.onClose(false);
    }
  };

  const handleClickAddToCart = () => {
    let optimizeData = null
    
    console.log('original form:', form)

    const newForm = {...form};
    newForm['pid'] = id;
    
    if(typeof props.optimize === 'function') {
      optimizeData = props.optimize(newForm)
      console.log('optimize form:', optimizeData)
    } else {
      optimizeData = form
    }

    // Set buy amount
    optimizeData['amount'] = count

    if(typeof props.onOK === 'function') {
      props.onOK(optimizeData);
    }
  };

  const handleAmountChange = (e) => {
    setCount(parseInt(e.target.value < 0 ? 0 : e.target.value))
  };

  return (
      <Dialog 
        open={props.isOpen} 
        onEnter={handleEnter}
        onClose={() => { props.onClose ? props.onClose() : null }} 
        aria-labelledby="form-dialog-title">

        {
          props.isWaiting
          ?
            <DialogContent dividers={scroll === 'paper'}>
              <Grid container spacing={1}>
                <Grid item xs={12} style={{ width:250 }}>
                  <Loading hasContainer={false} description={props.loadingDescription}/>
                </Grid>
              </Grid>
            </DialogContent>
          :
            <>
              <DialogTitle id="form-dialog-title">{ props.title ? props.title : '' }</DialogTitle>
              <DialogContent dividers={scroll === 'paper'}>
                <DialogContentText>
                {
                  props.content ? props.content : ''
                }
                </DialogContentText>

                {
                  form
                  ?
                    <Grid container spacing={1}>

                      <Grid item xs={12}>
                        <TextField fullWidth
                          id="outlined-number"
                          label="Amount"
                          type="number"
                          value={count}
                          variant="outlined"
                          onChange={handleAmountChange}
                          InputLabelProps={{ shrink: true, }}
                        />
                      </Grid>
                    
                      <Grid item xs={12}>
                        <ButtonGroup fullWidth>
                          <Button
                            aria-label="reduce"
                            onClick={() => {
                              setCount(Math.max(count - 1, 0));
                            }}
                          >
                            <RemoveIcon fontSize="small" />
                          </Button>
                          <Button
                            aria-label="increase"
                            onClick={() => {
                              setCount(count + 1);
                            }}
                          >
                            <AddIcon fontSize="small" />
                          </Button>
                        </ButtonGroup>
                      </Grid>

                    </Grid>
                  :
                    null
                }
              </DialogContent>
              <DialogActions>
                <Button onClick={handleClickCancel} color="primary">
                  Cancel
                </Button>
                <Button onClick={handleClickAddToCart} color="primary">
                  Add to Cart
                </Button>
              </DialogActions>
            </>
        }

      </Dialog>
  );
}