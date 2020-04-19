import React from 'react';
import Grid from '@material-ui/core/Grid';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

import humanizeString from 'humanize-string';

export default function ReuseDialog(props) {

  const [form, setForm] = React.useState({});
  const [open, setOpen] = React.useState(props.isOpen);

  const handleClickCancel = () => {
    if(typeof props.onClose === 'function') {
      props.onClose(false);
    }
  };

  const handleClickOK = () => {
    let optimizeData = null
    
    // console.log('original form:', form)
    if(typeof props.optimize === 'function') {
      optimizeData = props.optimize(form)
      // console.log('optimize form:', optimizeData)
    } else {
      optimizeData = form
    }

    if(typeof props.onOK === 'function') {
      props.onOK(optimizeData);
    }
  };

  return (
      <Dialog 
        open={props.isOpen} 
        onEnter={() => { setForm(props.form) }}
        onClose={() => { props.onClose ? props.onClose() : null }} 
        aria-labelledby="form-dialog-title">

        <DialogTitle id="form-dialog-title">Product</DialogTitle>
        <DialogContent dividers={scroll === 'paper'}>
          <DialogContentText>
          {
            props.content ? props.content : ''
          }
          </DialogContentText>

          <Grid container spacing={1}>
          
            <Grid item xs={12}>
              <Grid container spacing={2}>
                <Grid item xs={6} style={{ textAlign: '-webkit-center' }}>
                  <Avatar src={form.url_image ? form.url_image : ''} style={{
                    width: '100%',
                    height: 'auto',
                    borderRadius: '0%'
                  }}/>
                </Grid>

                <Grid item xs={6}>
                {
                  Object.keys(form).map((o,i) => {
                    // console.log(o)
                    return (
                      (i>=0 && i<=5) && o!='category_id'
                      ? 
                        <TextField 
                          key={`form-col-idx-${i}`}
                          margin="dense" autoFocus fullWidth
                          id={o} label={o ? humanizeString(o) : o} 
                          disabled={['createdAt', 'updatedAt'].indexOf(o)>-1 ? true : false}
                          value={form[o]}
                          onChange={(e) => {
                            console.log('form on change :', form)
                            console.log('form on change e.target.id:', e.target.id)
                            console.log('form on change e.target.value:', e.target.value)
                            setForm({ ...form, [e.target.id]: e.target.value })
                          }}
                        />
                      : 
                          null
                    )
                  })
                }
                </Grid>
              </Grid>
            </Grid>

            <Grid item xs={12}>
            {
              Object.keys(form).map((o,i) => {
                // console.log(o)
                return (
                  (i>=6) && o!='category_id'
                  ? 
                    <TextField 
                      key={`form-col-idx-${i}`}
                      margin="dense" autoFocus fullWidth
                      id={o} label={o ? humanizeString(o) : o} 
                      disabled={['createdAt', 'updatedAt'].indexOf(o)>-1 ? true : false}
                      value={form[o]}
                      onChange={(e) => {
                        console.log('form on change :', form)
                        console.log('form on change e.target.id:', e.target.id)
                        console.log('form on change e.target.value:', e.target.value)
                        setForm({ ...form, [e.target.id]: e.target.value })
                      }}
                    />
                  :
                      null
                )
              })
            }
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClickCancel} color="primary">
            Cancel
          </Button>
          <Button onClick={handleClickOK} color="primary">
            Save
          </Button>
        </DialogActions>

      </Dialog>
  );
}