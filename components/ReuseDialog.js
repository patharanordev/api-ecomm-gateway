import React from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

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
    
    console.log('original form:', form)
    if(typeof props.optimize === 'function') {
      optimizeData = props.optimize(form)
      console.log('optimize form:', optimizeData)
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
        <DialogContent>
          <DialogContentText>
          {
            props.content ? props.content : ''
          }
          </DialogContentText>

          {
            form
            ? 
              (
                Object.keys(form).map((o,i) => {
                  return (
                    <TextField 
                      key={`form-col-idx-${i}`}
                      margin="dense" autoFocus fullWidth
                      id={o} label={o} 
                      value={form[o]}
                      onChange={(e) => {
                        console.log('form on change :', form)
                        console.log('form on change e.target.id:', e.target.id)
                        console.log('form on change e.target.value:', e.target.value)
                        setForm({ ...form, [e.target.id]: e.target.value })
                      }}
                    />
                  )
                })
              )
            : null
          }
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