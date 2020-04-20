import React from 'react';
import MenuComponent from '../components/menu/Menu';
import ImageGallery from '../components/product-gallery/ImageGallery';
import { connect } from 'react-redux';

import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import ReuseDialog from '../components/ReuseDialog';
import Paper from '@material-ui/core/Paper';
import Checkboxes from '../components/product-gallery/Checkboxes';
import Combobox from '../components/product-gallery/Combobox';
import Loading from '../components/Loading';

import RESTFul from '../helper/RESTFul';

import styled from 'styled-components';

import has from 'has';

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

class Gallery extends React.Component {
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
      currentUser: props.UserReducer && props.UserReducer.currentUser
      ? props.UserReducer.currentUser
      : {},

      isOpenDialog: false,

      selectedProduct: null,
      checkFilter: true,

      isWaiting: true
    }
  }

  dispatch(action, callback) {
    if(has(action, 'type') && has(action, 'payload')) {
      this.props.dispatch({ type:action.type, payload:action.payload })
      if(typeof callback === 'function') callback();
    } else {
      if(typeof callback === 'function') callback('Unknown the action!');
    }
  }

  setCategory(data, callback) {
    this.dispatch({ type: 'GALLERY_PAGE_CATEGORY_LIST', payload: data }, callback);
  }

  setSelectedCategory(data, callback) {
    this.dispatch({ type: 'GALLERY_PAGE_SELECTED_CATEGORY', payload: data }, callback);
  }

  setAttributeFilter(data, callback) {
    this.dispatch({ type: 'GALLERY_PAGE_ATTRIBUTE_FILTER', payload: data }, callback);
  }

  setAttributeList(data, callback) {
    this.dispatch({ type: 'GALLERY_PAGE_ATTRIBUTE_LIST', payload: data }, callback);
  }

  setProducts(data, callback) {
    this.dispatch({ type: 'GALLERY_PAGE_PRODUCTS', payload: data }, callback);
  }

  setSelectedAttribute(data, callback) {
    this.dispatch({ type: 'GALLERY_PAGE_SELECTED_ATTRIBUTE', payload: data }, callback);
  }

  handlerFilterByType(attrs) {
    console.log('attrs : ', attrs);
    this.setState({ checkFilter:false }, () => {
      setTimeout(() => {
        this.setAttributeFilter(this.filterByAttr(attrs), () => {
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

    let p = this.props.GalleryReducer.gallery_page_products;
    p = p ? p : [];

    if(p && p.length>0) {
      let attrNames = Object.keys(p[0]);

      p.map((o,i) => {
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

    let p = this.props.GalleryReducer.gallery_page_products;
    p = p ? p : [];

    return countSelected==0
    ? 
      (
        // Show all products is default if user didn't select anything
        p
      )
    :
      p.filter((o,i) => {
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

  updateProductByModel(product, model, updateObj, callback) {
    const url = `/api/v1/product_${product && product.name ? product.name : ''}`;
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
        this.setProducts(data, callback)
      }
    });
  }

  getCategoryList(callback) {
    const url = `/api/v1/product_categories`;
    const data = { "method":"select", "condition": {} };
    rFul.post(url, data, (err, data) => {
      if(!err) {
        this.setCategory(data, callback)
      }
    });
  }

  fetchProduct(product){
    this.setState({ isWaiting:true }, () => {

      this.setSelectedCategory(product, () => {
        if(product && product.name) {
          this.getProductByName(product.name, () => {
            let p = this.props.GalleryReducer.gallery_page_products;
            p = p ? p : [];

            this.setAttributeList(this.getAttributes())
            this.setAttributeFilter(p, () => {
              this.setState({ isWaiting:false })
            })
          })
        } else {
          console.log('Unknown product name.')
        }
      })

    })
  }

  componentDidMount() {
    if(!this.props.GalleryReducer.gallery_page_categories) {
      this.getCategoryList((err) => {
        if(err) {
          console.log('Load category list error : ', err);
        } else {
          const c = this.props.GalleryReducer.gallery_page_categories;
          if(c && Array.isArray(c) && c.length > 0) {
            console.log('initial category : ', c[0].name)
            this.fetchProduct(c[0])
          }
        }
      })
    } else {
      this.setState({ isWaiting:false })
    }
  }

  render() {
    let { 
      currentUser,
      isWaiting, checkFilter,
      selectedProduct 
    } = this.state;

    return (
      <MenuComponent currentUser={currentUser} title='Gallery'>
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
                  selectedItem={
                    this.props.GalleryReducer.gallery_page_selectedCategory 
                    ? this.props.GalleryReducer.gallery_page_selectedCategory 
                    : []
                  }
                  itemList={
                    this.props.GalleryReducer.gallery_page_categories 
                    ? this.props.GalleryReducer.gallery_page_categories 
                    : []
                  } 
                  onChange={(selected) => {
                    console.log('Selected item in combobox :', selected);
                    // Default value is getCategory()[0]
                    if(selected){
                      this.fetchProduct(selected)
                    }
                  }
                }/>
              </Grid>
    
              {
                this.props.GalleryReducer.gallery_page_filter && this.props.GalleryReducer.gallery_page_filter.length > 0
                ?
                  <>
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
                          this.props.GalleryReducer.gallery_page_attrList
                          ? 
                            Object.keys(this.props.GalleryReducer.gallery_page_attrList).map((attrName, attrObjIndex) => {
                              console.log(attrName);
                              return (
                                <Checkboxes 
                                  key={`checkbox-idx-${attrObjIndex}`}
                                  title={attrName.toUpperCase()} 
                                  attrs={this.props.GalleryReducer.gallery_page_attrList[attrName]} 
                                  onSelect={(k,v) => {
                                    let attrList = this.props.GalleryReducer.gallery_page_attrList;
                                    let selectedAttr = this.props.GalleryReducer.gallery_page_selectedAttr;
                                    selectedAttr = selectedAttr ? selectedAttr : {};

                                    if(v) {

                                      if(!selectedAttr.hasOwnProperty(attrName)) {
                                        selectedAttr[attrName] = [];
                                      }

                                      const specificIndex = selectedAttr[attrName].indexOf(k);
                                      if(specificIndex<0) {
                                        attrList[attrName][k] = true;
                                        selectedAttr[attrName].push(k);
                                        this.setAttributeList(attrList);
                                      } else {
                                        attrList[attrName][k] = false;
                                        selectedAttr[attrName].splice(specificIndex, 1);
                                        this.setAttributeList(attrList);
                                      }

                                    } else {

                                      if(selectedAttr.hasOwnProperty(attrName)) {
                                        let tmpIdx = selectedAttr[attrName].indexOf(k);
                                        if(tmpIdx>-1) {
                                          attrList[attrName][k] = false;
                                          selectedAttr[attrName].splice(tmpIdx, 1);
                                          this.setAttributeList(attrList);
                                        }
                                      }

                                    }
                                    this.setSelectedAttribute(selectedAttr)
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
                        filter={this.props.GalleryReducer.gallery_page_filter ? this.props.GalleryReducer.gallery_page_filter : []}
                        checkFilter={checkFilter}
                        handleDialog={(tile)=>{
                          this.setState({ selectedProduct:tile }, () => {
                            this.handleDialog()
                          });
                        }}/>
                    </Grid>
                  </>
                :
                  null
              }
            </Grid>
  
            <ReuseDialog 
              isOpen={this.state.isOpenDialog} 
              content={null}
              form={selectedProduct}
              onClose={(isOpen) => { this.setState({ isOpenDialog:isOpen }) }}
              onOK={(data) => {
                console.log('On dialog save : ', data);
  
                // Normalize data
                this.updateProductByModel(this.props.GalleryReducer.gallery_page_selectedCategory, data.model, data.data, () => {
                  this.setState({ isOpenDialog:false }, () => {
                    this.fetchProduct(this.props.GalleryReducer.gallery_page_selectedCategory)
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

export default connect(state => state)(Gallery);