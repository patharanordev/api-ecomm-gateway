import React from 'react';
import humanizeString from 'humanize-string';
import has from 'has';
import {
  Grid, Avatar, Button, TextField, 
  Dialog, DialogActions, DialogContent,
  DialogContentText, DialogTitle
} from '@material-ui/core';
import Loading from './Loading';

export default function ReuseDialog(props) {

  const [id, setItemID] = React.useState('');
  const [form, setForm] = React.useState(null);
  const [open, setOpen] = React.useState(props.isOpen);

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

  const handleClickOK = () => {
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

    if(typeof props.onOK === 'function') {
      props.onOK(optimizeData);
    }
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
                        <Grid container spacing={2}>
                          <Grid item xs={6} style={{ textAlign: '-webkit-center' }}>
                            <Avatar src={form && form.url_image ? form.url_image : ''} style={{
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
                                (i>=0 && i<=5)
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
                            (i>=6)
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
                  :
                    null
                }
              </DialogContent>
              <DialogActions>
              {
                props.onClose
                ? 
                  <Button onClick={handleClickCancel} color="primary">
                  { props.labelCancelBtn ? props.labelCancelBtn : 'Cancel' }
                  </Button>
                :
                  null
              }
              {
                props.onOK
                ?
                  <Button onClick={handleClickOK} color="primary">
                  { props.labelOKBtn ? props.labelOKBtn : 'Save' }
                  </Button>
                :
                  null
              }
              </DialogActions>
            </>
        }

      </Dialog>
  );
}