import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';
import IconButton from '@material-ui/core/IconButton';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import Grow from '@material-ui/core/Grow';
import Paper from '@material-ui/core/Paper';
import NumberFormat from 'react-number-format';

const useStyles = makeStyles((theme) => ({
  gridList: {
    width: '100%', //500,
    height: '100%' //450,
  },
  icon: {
    color: 'rgba(255, 255, 255, 0.54)',
  },
  paper: {
    padding: theme.spacing(2),
    display: 'flex',
    overflow: 'auto',
    flexDirection: 'column',
  }
}));

export default function ImageGallery(props) {
  const classes = useStyles();
  const { filter, checkFilter, onEdit, onDelete } = props;

  console.log('render filter :', filter)
  
  return (
    <Paper className={classes.paper}>
      <GridList cellHeight={180} className={classes.gridList} cols={3}>
        {
          filter && Array.isArray(filter)
          ? 
            filter.map((tile, i) => (
              <Grow
                key={`grow-idx-${i}`}
                in={checkFilter}
                style={{ transformOrigin: '0 0 0' }}
                {...(checkFilter ? { timeout: 1000 } : {})}
              >
                <GridListTile key={`gridlist-idx-${i}`}>
                  <img src={tile.url_image} alt={tile.model} />
                  <GridListTileBar
                    title={<strong>{`${tile.model}`}</strong>}
                    subtitle={
                      <NumberFormat 
                        value={tile.price} 
                        displayType={'text'} 
                        thousandSeparator={true} 
                        prefix={'$'} />
                    }
                    actionIcon={
                      <Grid container>
                        <Grid item xs={6}>
                          <IconButton 
                            aria-label={`info about ${tile.model}`} 
                            className={classes.icon}
                            onClick={() => { 
                              console.log('On click edit product:', tile)
                              if(typeof onEdit==='function') {
                                onEdit(tile)
                              }
                            }}>
                            <EditIcon />
                          </IconButton>
                        </Grid>
                        <Grid item xs={6}>
                          <IconButton 
                            aria-label={`delete ${tile.model}`} 
                            className={classes.icon}
                            onClick={() => { 
                              console.log('On click delete product:', tile)
                              if(typeof onDelete==='function') {
                                onDelete(tile)
                              }
                            }}>
                            <DeleteIcon />
                          </IconButton>
                        </Grid>
                      </Grid>
                    }
                  />
                </GridListTile>
              </Grow>
            ))
          : null
        }
      </GridList>
    </Paper>
  )
};