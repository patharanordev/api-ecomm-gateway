import React from 'react';
import MenuComponent from '../components/menu/Menu';
import ImageGallery from '../components/product-gallery/ImageGallery';
import { connect } from 'react-redux';

import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import ReuseDialog from '../components/ReuseDialog';
import Paper from '@material-ui/core/Paper';
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

class ProductGallery extends React.Component {
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
    let { 
      currentUser,
      categories, attrList, filter, isWaiting, checkFilter,
      selectedProduct, selectedCategory 
    } = this.state;

    return (
      <MenuComponent currentUser={currentUser} title='Product Gallery'>
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
                <Combobox itemList={categories ? categories : []} onChange={(selected) => {
                  console.log('Selected item in combobox :', selected);
                  // Default value is getCategory()[0]
                  if(selected && selected.name){
                    this.fetchProduct(selected.name)
                  }
                }}/>
              </Grid>
  
              <Grid item xs={12} md={4}>
                <StylePaper>
                  <Typography variant="body1">
                    <strong>Simple Filter by attribute</strong>
                    <br/>
                    <small>Using <strong>'OR'</strong> condition to filter it.</small>
                  </Typography>
                  <br />
                  <StyleAttrList>
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
                  </StyleAttrList>
                </StylePaper>
              </Grid>
  
              <Grid item xs={12} md={8}>
                <ImageGallery 
                  filter={filter}
                  checkFilter={checkFilter}
                  handleDialog={(tile)=>{
                    this.setState({ selectedProduct:tile }, () => {
                      this.handleDialog()
                    });
                  }}/>
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
                  this.setState({ isOpenDialog:false }, () => {
                    this.fetchProduct(selectedCategory)
                  })
                })
              }}
              optimize={(data) => {
                // Cleansing data
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
      
        :  
          
          <Loading />
      }
      </MenuComponent>
    )
  }
}

export default connect(state => state)(ProductGallery);