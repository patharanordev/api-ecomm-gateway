import React from 'react';
import MenuComponent from '../components/menu/Menu';
import ImageGallery from '../components/product-gallery/ImageGallery';
import { connect } from 'react-redux';

import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import ReuseDialog from '../components/ReuseDialog';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import Checkboxes from '../components/product-gallery/Checkboxes';
import Combobox from '../components/product-gallery/Combobox';
import Loading from '../components/Loading';

import RESTFul from '../helper/RESTFul';

import styled from 'styled-components';

// import tileData from './tileData';

const rFul = RESTFul();

const PaperFlex = ({ className, children }) => (
  <Paper className={className}>{children}</Paper>
)

const AttrList = ({ className, children }) => (
  <div className={className}>{children}</div>
)

// 1 space is 8px
const StylePaper = styled(PaperFlex)`
  padding: 16px;
  display: flex;
  overflow: auto;
  flex-direction: column;
`;
const StyleAttrList = styled(AttrList)`
  width: 100%;
  height: 300px;
  overflow-y: auto;
`;

class ImportProduct extends React.Component {
  static async getInitialProps({ store, isServer, pathname, query:{ user } }) {
    if(user) {
      console.log('ProductGallery got response : ', user)
      store.dispatch({ type:'CURRENT_USER', payload:user });
      // return { currentUser:user }
    }
  }

  constructor(props) {
    super(props)

    this.state = {
      currentUser: props.currentUser,

      isOpenDialog: false,
      categories: [],
      products: [],
      attrList: [],
      saved_data: [],
      prepared_data: [],

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

    // Check attribute is selected or not
    let countSelected = 0;
    focusAttrs.forEach((attrName, attrNameIndex) => {
      attrs[attrName].length>0 ? countSelected++ : null;
    });

    return countSelected==0
    ? 
      (
        // Show all products is default if user didn't select anything
        this.state.products
      )
    :
      this.state.products.filter((o,i) => {
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

  addProductByModel(product, dataArr, callback) {
    if(dataArr && Array.isArray(dataArr)) {
      const url = `/api/v1/product_${product && product.name ? product.name : ''}`;
      const data = { "method":"create", "data": { "items": dataArr } };
      rFul.post(url, data, (err, data) => {
        if(!err) {
          this.setState({ saved_data:data }, () => {
            if(typeof callback === 'function') { callback() }
          })
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

  fetchProduct(product){
    this.setState({ isWaiting:true, selectedCategory:product }, () => {
      if(product && product.name) {
        this.getProductByName(product.name, () => {
          this.setState({ attrList:this.getAttributes() })
          this.setState({ filter:this.state.products }, () => {
            this.setState({ isWaiting:false })
          })
        })
      } else {
        console.log('Unknown product name.')
      }
    })
  }

  componentDidMount() {
    this.getCategoryList(() => {
      if(this.state.categories && Array.isArray(this.state.categories) && this.state.categories.length > 0) {
        console.log('initial category : ', this.state.categories[0].name)
        // this.fetchProduct(this.state.categories[0])
        this.setState({ isWaiting:false })
      }
    })
  }

  render() {
    let { 
      currentUser,
      categories, attrList, filter, isWaiting, checkFilter,
      selectedProduct, selectedCategory, prepared_data
    } = this.state;

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
                  selectedItem={selectedCategory}
                  itemList={categories ? categories : []} 
                  onChange={(selected) => {
                    console.log('Selected item in combobox :', selected);
                    // Default value is getCategory()[0]
                    this.setState({ selectedCategory:selected })
                  }
                }/>
              </Grid>
  
              <Grid item xs={12} align={'right'}>
                <Button disabled>Add Category</Button>
                <Button variant="contained" color="primary" onClick={() => {
                  this.getSchema(selectedCategory, () => {
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
                {
                  prepared_data
                  ?
                    prepared_data.map((v,i) => {
                      return (
                        <Grid item xs={12} key={`prepare-grid-item-${i}`}>
                          <StylePaper key={`prepare-item-${i}`}>
                            <Grid container spacing={1}>

                              <Grid item xs={10}>
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
                                  prepared_data.splice(i, 1)
                                  this.setState({ prepared_data:prepared_data });
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
                    this.addProductByModel(selectedCategory, prepared_data, () => {
                      this.setState({ isWaiting:false })
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

                let prepData = prepared_data;
                prepData.push(data.data);
                this.setState({ prepared_data:prepData });
                this.setState({ isOpenDialog:false });
              }}
              optimize={(data) => {
                // Cleansing data
                if(data) {
                  delete data['createdAt'];
                  delete data['updatedAt'];
                }
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