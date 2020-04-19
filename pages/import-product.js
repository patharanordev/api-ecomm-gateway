import React from 'react';
import has from 'has';
import MenuComponent from '../components/menu/Menu';
import { connect } from 'react-redux';

import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import ReuseDialog from '../components/ReuseDialog';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import styled from 'styled-components';

import Combobox from '../components/product-gallery/Combobox';
import Loading from '../components/Loading';
import RESTFul from '../helper/RESTFul';
import { Avatar } from '@material-ui/core';

// import tileData from './tileData';

const rFul = RESTFul();

const PaperFlex = ({ className, children }) => (
  <Paper className={className}>{children}</Paper>
)

// 1 space is 8px
const StylePaper = styled(PaperFlex)`
  padding: 16px;
  display: flex;
  overflow: auto;
  flex-direction: column;
`;

class ImportProduct extends React.Component {
  static async getInitialProps({ store, isServer, pathname, query:{ user } }) {
    if(user) {
      console.log('ProductGallery got response : ', user)
      store.dispatch({ type:'CURRENT_USER', payload:user });
    }
  }
  
  constructor(props) {
    super(props)

    this.state = {
      currentUser: props.currentUser,
      isOpenDialog: false,
      selectedProduct: null,
      isWaiting: true
    }
  }

  handleStoreStateChange(stateName) {
    const previous = this.state[stateName]
    const current = this.selectStoreState(stateName)

    if(previous !== current) {
      console.log(`State of "${stateName}" changed from `, previous, ' to ', current)
    }
  }

  selectStoreState(stateName) {
    return stateName ? this.props.store.getState()[stateName] : null;
  }

  dispatch(action, callback) {
    if(has(action, 'type') && has(action, 'payload')) {
      this.props.dispatch({ type:action.type, payload:action.payload })
      // .then(() => console.log('Dispatch with action : ', action))
      if(typeof callback === 'function') callback();
    } else {
      if(typeof callback === 'function') callback('Unknown the action!');
    }
  }

  setCategory(data, callback) {
    this.dispatch({ type: 'IMPORT_PAGE_CATEGORY_LIST', payload: data }, callback);
  }

  setPreparedData(data, callback) {
    this.dispatch({ type: 'IMPORT_PAGE_PREPARED_DATA', payload: data }, callback);
  }

  setSelectedCategory(data, callback) {
    this.dispatch({ type: 'IMPORT_PAGE_SELECTED_CATEGORY', payload: data }, callback);
  }

  handleDialog() {
    if(this.state.isOpenDialog) this.setState({ isOpenDialog:false });
    else this.setState({ isOpenDialog:true });
  }

  addProductByModel(product, dataArr, callback) {
    if(dataArr && Array.isArray(dataArr)) {
      const url = `/api/v1/product_${product && product.name ? product.name : ''}`;
      const data = { "method":"create", "data": { "items": dataArr } };
      rFul.post(url, data, (err, data) => {
        if(!err) {
          if(typeof callback === 'function') { callback() }
        }
      });
    } else {
      console.log('Wrong data format, it should be array of object')
    }
  }

  getSchema(product, callback) {
    if(product) {
      const url = `/api/v1/product_${product.name ? product.name : ''}`;
      const data = { "method":"schema" };
      rFul.post(url, data, (err, data) => {
        if(!err) {
          if(data && Array.isArray(data)) {
            let o = {}
            data.map((v,i) => o[v]='')
            this.setState({ selectedProduct:o }, () => {
              if(typeof callback === 'function') { callback() }
            })
          }
        }
      });
    }
  }

  getCategoryList(callback) {
    const url = `/api/v1/product_categories`;
    const data = { "method":"select", "condition": {} };
    rFul.post(url, data, (err, data) => {
      if(!err) {
        this.setCategory(data, callback);
        // this.setState({ categories:data }, () => {
        //   if(typeof callback === 'function') { callback() }
        // })
      }
    });
  }

  componentDidMount() {
    if(!this.props.import_page_categories) {
      this.getCategoryList((err) => {
        if(err) {
          console.log('Load category list error : ', err);
        } else {
          const c = this.props.import_page_categories;
          if(c && Array.isArray(c) && c.length > 0) {
            console.log('initial category : ', c[0].name)
            this.setState({ isWaiting:false })
          }
        }
      })
    } else {
      this.setState({ isWaiting:false })
    }
  }

  render() {
    let { 
      currentUser, selectedProduct, isWaiting
    } = this.state;

    let {
      import_page_categories, import_page_selectedCategory
    } = this.props

    return (
      <MenuComponent currentUser={currentUser} title='Import Product'>
      {
        !isWaiting

        ?
          <>
            <Grid container spacing={3}>
  
              <Grid item xs={12}>
                <Typography variant="body1">
                  <strong>Categories</strong>
                </Typography>
                <br/>
                <Combobox 
                  selectedItem={import_page_selectedCategory}
                  itemList={import_page_categories ? import_page_categories : []} 
                  onChange={(selected) => {
                    console.log('Selected item in combobox :', selected);
                    // Default value is getCategory()[0]
                    // this.setState({ import_page_selectedCategory:selected })
                    this.setSelectedCategory(selected)
                  }
                }/>
              </Grid>
  
              <Grid item xs={12} align={'right'}>
                <Button disabled>Add Category</Button>
                <Button variant="contained" color="primary" onClick={() => {
                  this.getSchema(import_page_selectedCategory, () => {
                    this.setState({ isOpenDialog:true })
                  })
                }}>
                  Add Product
                </Button>
                <br/>
                <p style={{ color:'red' }}><small>* Add category doesn't support in this version.</small></p>
              </Grid>
  
              <Grid item xs={12}>
                <Grid container spacing={1}>
                  <Grid item xs={12}>
                    <Typography variant='body1'>
                      <strong>Preparing list to upload</strong>
                    </Typography>
                  </Grid>
                {
                  this.props.import_page_prepared_data
                  ?
                    this.props.import_page_prepared_data.map((v,i) => {
                      return (
                        <Grid item xs={12} key={`prepare-grid-item-${i}`}>
                          <StylePaper key={`prepare-item-${i}`}>
                            <Grid container spacing={1}>

                              <Grid item xs={2} style={{
                                alignSelf: 'center',
                                textAlign: '-webkit-center'
                              }}>
                                <Avatar src={v.url_image ? v.url_image : ''} style={{
                                  width: '100%',
                                  height: 'auto',
                                  borderRadius: '0%'
                                }}/>
                              </Grid>

                              <Grid item xs={8}>
                                <Grid item xs={12}>
                                  <Typography variant='caption'><strong>model</strong></Typography>
                                  <Typography variant='h5'>
                                    { v.model ? v.model : null }
                                  </Typography>
                                </Grid>
                                <Grid item xs={12}>
                                  <Typography variant='caption'><strong>price</strong></Typography>
                                  <Typography variant='body1'>{ v.price ? v.price : 0 }</Typography>
                                </Grid>
                              </Grid>

                              <Grid item xs={2} style={{
                                alignSelf: 'center',
                                textAlign: '-webkit-center'
                              }}>
                                <IconButton aria-label="delete" onClick={() => {
                                  let tmp = [...this.props.import_page_prepared_data];
                                  tmp.splice(i, 1)
                                  // this.setState({ import_page_prepared_data:import_page_prepared_data });
                                  this.setPreparedData(tmp)
                                }}>
                                  <DeleteIcon />
                                </IconButton>
                              </Grid>

                            </Grid>
                          </StylePaper>
                        </Grid>
                      )
                    })
                  
                  : null
                }
                </Grid>
              </Grid>

              <Grid item xs={12} align={'right'}>
                <Button variant="contained" color="primary" onClick={() => {
                  this.setState({ isWaiting:true }, () => {
                    this.addProductByModel(import_page_selectedCategory, this.props.import_page_prepared_data, () => {
                      // this.setState({ isWaiting:false, import_page_prepared_data:[] })
                      this.setState({ isWaiting:false })
                      this.setPreparedData([])
                    })
                  })
                }}>
                  Save
                </Button>
              </Grid>

            </Grid>
  
            <ReuseDialog 
              isOpen={this.state.isOpenDialog} 
              content={null}
              form={selectedProduct}
              onClose={(isOpen) => { this.setState({ isOpenDialog:isOpen }) }}
              onOK={(data) => {
                console.log('On dialog save : ', data);

                let prepData = this.props.import_page_prepared_data ? [...this.props.import_page_prepared_data] : [];
                prepData.push(data.data);
                // this.setState({ import_page_prepared_data:prepData });
                this.setPreparedData(prepData)
                this.setState({ isOpenDialog:false });
              }}
              optimize={(data) => {
                // Cleansing data
                if(data) {
                  delete data['createdAt'];
                  delete data['updatedAt'];
                }

                data['category_id'] = has(selectedProduct, 'category_id') 
                ? selectedProduct.category_id
                : ''
                
                return { data }
              }}
            />
          
          </>
      
        :  
          
          <Loading />
      }
      </MenuComponent>
    )
  }
}

export default connect(state => state)(ImportProduct);