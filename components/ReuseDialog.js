import React from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

export default function ReuseDialog(props) {

  const [form, setForm] = React.useState(props.form);
  const [open, setOpen] = React.useState(props.isOpen);

  const handleClickCancel = () => {
    if(typeof props.onClose === 'function') {
      props.onClose(false);
    }
  };

  const handleClickOK = () => {
    if(typeof props.onOK === 'function') {
      props.onOK(form);
    }
  };

  return (
      <Dialog 
        open={props.isOpen} 
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
            props.form && props.form.column && Array.isArray(props.form.column)
            ? 
              (
                props.form.column.map((o,i) => {
                  return (
                    <TextField autoFocus margin="dense" fullWidth
                      id={o.id ? o.id : ''} 
                      label={o.label ? o.label : ''} 
                      value={
                        props.form.value && props.form.value.hasOwnProperty(o.id)
                        ? props.form.value[o.id] 
                        : ''
                      }
                      onChange={(e) => {
                        if(!form[i].value) {
                          form[i]['value'] = '';
                        }
                        form[i].value = e.target.value;
                        setForm(form)
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