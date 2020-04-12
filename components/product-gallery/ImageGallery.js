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
import axios from 'axios';
import Loading from '../Loading';

import RESTFul from '../../helper/RESTFul';

// import tileData from './tileData';

const rFul = RESTFul();

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
  attrList: {
    width: '100%',
    height: '300px',
    overflowY: 'auto'
  }
}));

class ImageGalleryComponent extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      isOpenDialog: false,
      categories: [],
      products: [],
      attrList: [],

      selectedCategory: null,
      selectedProduct: null,
      selectedAttr: {},
      checkFilter: true,
      filter: [],

      isWaiting: true
    }
  }

  handlerFilterByType(attrs) {
    console.log('attrs : ', attrs);
    this.setState({ checkFilter:false }, () => {
      setTimeout(() => {
        this.setState({ filter:this.filterByAttr(attrs) }, () => {
          this.setState({ checkFilter:true })
        });
      }, 300);
    })
  }

  handleDialog() {
    if(this.state.isOpenDialog) this.setState({ isOpenDialog:false });
    else this.setState({ isOpenDialog:true });
  }

  getAttributes() {
    // Ex.
    let attrList = { 
      // type: {   // 'type' is attribute name
      //           // 'any-attr-value' : always 'false' in initial state 
      // }
    };

    if(this.state.products && this.state.products.length>0) {
      let attrNames = Object.keys(this.state.products[0]);

      this.state.products.map((o,i) => {
        attrNames.map((attrName, attrNameIndex) => {
          try {
            if(!attrList.hasOwnProperty(attrName)) {
              attrList[attrName] = {}
            }

            attrList[attrName][o[attrName]] = false;

          } catch (err) {
            console.warn('Get attribute warning : ', err);
          }
        })
      });
    }

    console.log('attrList:', attrList)
    
    return attrList
  }

  filterByAttr(attrs) {
    let focusAttrs = Object.keys(attrs);
    return this.state.products.filter((o,i) => {
      let isMatched = 0;

      focusAttrs.map((attrName, attrNameIndex) => {
        if(o.hasOwnProperty(attrName)) {

          attrs[attrName].indexOf( typeof o[attrName]==='number' ? o[attrName].toString() : o[attrName]) >-1 
          ? isMatched++ 
          : null
          
        } 
      });

      return isMatched > 0 ? true : false
    });
  }

  updateProductByModel(categoryName, model, updateObj, callback) {
    const url = `/api/v1/product_${categoryName}`;
    const data = {
      "method":"update",
      "update": {
        "condition": { "model": model },
        "data": updateObj
      }
    };
    rFul.post(url, data, (err, data) => {
      if(typeof callback === 'function') {
        let isSuccess = (data && Array.isArray(data) && data.length>0);
        let reason = (isSuccess && data[0]>0) ? `Updated ${data[0]} row(s)` : 'Not row updated'
        callback(err, reason);
      }
    });
  }

  getProductByName(name, callback) {
    const url = `/api/v1/product_${name}`;
    const data = { "method":"select", "condition": {} };
    rFul.post(url, data, (err, data) => {
      if(!err) {
        this.setState({ products:data }, () => {
          if(typeof callback === 'function') { callback() }
        })
      }
    });
  }

  getCategoryList(callback) {
    const url = `/api/v1/product_categories`;
    const data = { "method":"select", "condition": {} };
    rFul.post(url, data, (err, data) => {
      if(!err) {
        this.setState({ categories:data }, () => {
          if(typeof callback === 'function') { callback() }
        })
      }
    });
  }

  fetchProduct(productName){
    this.setState({ isWaiting:true, selectedCategory:productName }, () => {
      this.getProductByName(productName, () => {
        this.setState({ attrList:this.getAttributes() })
        this.setState({ filter:this.state.products }, () => {
          this.setState({ isWaiting:false })
        })
      })
    })
  }

  componentDidMount() {
    this.getCategoryList(() => {
      if(this.state.categories && Array.isArray(this.state.categories) && this.state.categories.length > 0) {
        console.log('initial category : ', this.state.categories[1].name)
        this.fetchProduct(this.state.categories[1].name)
      }
    })
  }

  render() {
    const { classes } = this.props;
    let { 
      categories, attrList, filter, isWaiting, 
      selectedProduct, selectedCategory 
    } = this.state;

    console.log('render categories : ', categories)
    console.log('render attrList : ', attrList)
    console.log('render filter :', filter)

    if(!isWaiting) {
      return (
        <>
          <Grid container spacing={3}>

            <Grid item xs={12}>
              {/* <Paper className={classes.paper}> */}
                <Typography variant="body1">
                  <strong>Categories</strong>
                </Typography>
                <br/>
                <Combobox itemList={categories ? categories : []} onChange={(selected) => {
                  console.log('Selected item in combobox :', selected);
                  // Default value is getCategory()[0]
                  if(selected && selected.name){
                    this.fetchProduct(selected.name)
                  }
                }}/>
              {/* </Paper> */}
            </Grid>

            <Grid item xs={12} md={4}>
              <Paper className={classes.paper}>
                <Typography variant="body1">
                  <strong>Simple Filter by attribute</strong>
                  <br/>
                  <small>Using <strong>'OR'</strong> condition to filter it.</small>
                </Typography>
                <br />
                <div className={classes.attrList}>
                {
                  attrList
                  ? 
                    Object.keys(attrList).map((attrName, attrObjIndex) => {
                      console.log(attrName);
                      return (
                        <Checkboxes 
                          key={`checkbox-idx-${attrObjIndex}`}
                          title={attrName.toUpperCase()} attrs={attrList[attrName]} onSelect={(k,v) => {
                            let selectedAttr = this.state.selectedAttr;
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
                            this.setState({ selectedAttr:selectedAttr })
                            this.handlerFilterByType(selectedAttr);
                          }}/>
                      )
                    })

                  : null
                }
                </div>
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
                          in={this.state.checkFilter}
                          style={{ transformOrigin: '0 0 0' }}
                          {...(this.state.checkFilter ? { timeout: 1000 } : {})}
                        >
                          <GridListTile key={`gridlist-idx-${i}`}>
                            <img src={tile.url_image} alt={tile.model} />
                            <GridListTileBar
                              title={`Model : ${tile.model}`}
                              subtitle={<span>Price : {tile.price}</span>}
                              actionIcon={
                                <IconButton 
                                  aria-label={`info about ${tile.model}`} 
                                  className={classes.icon}
                                  onClick={() => { 
                                    console.log('On click edit product:', tile)
                                    this.setState({ selectedProduct:tile }, () => {
                                      this.handleDialog()
                                    });
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
            isOpen={this.state.isOpenDialog} 
            content={null}
            form={selectedProduct}
            onClose={(isOpen) => { this.setState({ isOpenDialog:isOpen }) }}
            onOK={(data) => {
              console.log('On dialog save : ', data);

              // Normalize data
              this.updateProductByModel(selectedCategory, data.model, data.data, () => {
                this.setState({ isOpenDialog:false })
              })
            }}
            optimize={(data) => {
              let model = null;
              if(data) {
                model = data.model ? data.model : null;
                delete data['model'];
                delete data['createdAt'];
                delete data['updatedAt'];
              }
              return { model:model, data:data }
            }}
          />
        
        </>
      );
    } else {
      return (
        <Loading />
      )
    }
  }
}

export default function ImageGallery() {
  const classes = useStyles();
  return (
    <ImageGalleryComponent classes={classes}/>
  )
};