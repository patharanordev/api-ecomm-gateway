import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';
import ListSubheader from '@material-ui/core/ListSubheader';
import IconButton from '@material-ui/core/IconButton';
import InfoIcon from '@material-ui/icons/Info';
import EditIcon from '@material-ui/icons/Edit';
import Grow from '@material-ui/core/Grow';
import Typography from '@material-ui/core/Typography';
import ReuseDialog from '../ReuseDialog';
import Paper from '@material-ui/core/Paper';
import Checkboxes from './Checkboxes';
import Combobox from './Combobox';

import tileData from './tileData';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    overflow: 'hidden',
    backgroundColor: theme.palette.background.paper,
  },
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
  },
}));

const jsonForm = [
  { id:'model', label:'Model' },
  { id:'name', label:'Product name' },
  { id:'price', label:'Price' }
];

const getCategory = () => {
  return [
    { id:'1', name:'smartphone', title:'Smartphone' },
    { id:'2', name:'laptop', title:'Laptop' }
  ]
};

const getAttributes = () => {
  // TODO: in getAttributes()
  // - calling to API instead or receive via props
  //   or change logic
  let attrArr = [];

  // Ex.
  let attrList = { 
    type: { // 'type' is attribute name
      // 'any-attr-value' : always 'false' in initial state 
    }
  };

  tileData.map((o,i) => {
    if(attrArr.indexOf(o.type)==-1) {
      attrArr.push(o.type);
      attrList.type[o.type] = false;
    }
  });
  return { attrArr:attrArr, attrList:attrList };
};

const filterByAttr = (attrs) => {
  // TODO: in filterByAttr()
  // - calling to API instead or receive via props
  //   or change logic

  // Ex. attrs
  // {
  //   attr-name: [
  //     0:attr-value,
  //     1; ....
  //   ]
  // }

  let focusAttrs = Object.keys(attrs);
  return tileData.filter((o,i) => {
    let isMatched = true;

    focusAttrs.map((attrName, attrNameIndex) => {
      if(o.hasOwnProperty(attrName)) {
        isMatched = attrs[attrName].indexOf(o[attrName])>-1 ? true : attrs[attrName].length==0 ? true : false
        return isMatched;
      } else {
        isMatched = false;
        return isMatched;
      }
    });

    return isMatched
  });
}

export default function ImageGallery() {
  const classes = useStyles();

  const [isOpenDialog, setDialog] = React.useState(false);
  const handleDialog = () => {
    if(isOpenDialog) setDialog(false);
    else setDialog(true);
  };

  let { attrArr, attrList } = getAttributes();

  const [selectedProduct, setSelectProduct] = React.useState(null);
  const [selectedAttr, setSelectAttr] = React.useState({});
  const [checkFilter, setCheckFilter] = React.useState(true);
  const [filter, setFilter] = React.useState(tileData);
  const handlerFilterByType = (attrs) => {
    console.log(attrs);
    setCheckFilter(false)
    setTimeout(() => {
      setFilter(filterByAttr(attrs));
      setCheckFilter(true)
    }, 300);
  };

  React.useEffect(() => {
    if(selectedProduct) {
      handleDialog()
    }
  }, [selectedProduct])

  return (

    <>
      <Grid container spacing={3}>

        <Grid item xs={12}>
          {/* <Paper className={classes.paper}> */}
            <Typography variant="body1">
              <strong>Categories</strong>
            </Typography>
            <br/>
            <Combobox itemList={getCategory()} onChange={(selected) => {
              console.log('Selected item in combobox :', selected);
              // Default value is getCategory()[0]
            }}/>
          {/* </Paper> */}
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper className={classes.paper}>
            <Typography variant="body1">
              <strong>Filter by attribute</strong>
            </Typography>
            <br />

            {
              Object.keys(attrList).map((attrName, attrObjIndex) => {
                return (
                  <Checkboxes 
                    key={`checkbox-idx-${attrObjIndex}`}
                    title={attrName.toUpperCase()} attrs={attrList[attrName]} onSelect={(k,v) => {
                    if(v) {
                      if(!selectedAttr.hasOwnProperty(attrName)) {
                        selectedAttr[attrName] = [];
                      }
                      selectedAttr[attrName].push(k);
                    } else {
                      if(selectedAttr.hasOwnProperty(attrName)) {
                        let tmpIdx = selectedAttr[attrName].indexOf(k);
                        if(tmpIdx>-1) selectedAttr[attrName].splice(tmpIdx, 1)
                      }
                    }
                    setSelectAttr(selectedAttr)
                    handlerFilterByType(selectedAttr);
                  }}/>
                )
              })
            }
          </Paper>
        </Grid>

        <Grid item xs={12} md={8}>
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
                        <img src={tile.img} alt={tile.title} />
                        <GridListTileBar
                          title={tile.title}
                          subtitle={<span>by: {tile.author}</span>}
                          actionIcon={
                            <IconButton 
                              aria-label={`info about ${tile.title}`} 
                              className={classes.icon}
                              onClick={() => { 
                                console.log('On click edit product:', tile.data)
                                setSelectProduct(tile.data)
                              }}>
                              <EditIcon />
                            </IconButton>
                          }
                        />
                      </GridListTile>
                    </Grow>
                  ))
                : null
              }
            </GridList>
          </Paper>
        </Grid>

      </Grid>

      <ReuseDialog 
        isOpen={isOpenDialog} 
        content={null}
        form={{
          column:jsonForm,
          value:selectedProduct
        }}
        onClose={(isOpen) => { setDialog(isOpen) }}
        onOK={(data) => {
          console.log('On dialog save : ', data);
          setDialog(false)
        }}
      />
    
    </>
  );
}