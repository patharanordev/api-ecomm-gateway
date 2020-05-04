import React from 'react';
import dynamic from 'next/dynamic';
import has from 'has';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { Grid, Typography, Paper } from '@material-ui/core';
import RESTFul from '../helper/RESTFul';

const MenuComponent = dynamic( import('../components/menu/Menu'), { ssr: false } )
const ImageGallery = dynamic( import('../components/product-gallery/ImageGallery'), { ssr: false } )
const ReuseDialog = dynamic( import('../components/ReuseDialog'), { ssr: false } )
const Checkboxes = dynamic( import('../components/product-gallery/Checkboxes'), { ssr: false } )
const Loading = dynamic( import('../components/Loading'), { ssr: false } )
const CategorySelector = dynamic( import('../components/CategorySelector'), { ssr: false } )

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
    }
  }

  constructor(props) {
    super(props)

    this.state = {
      currentUser: props.user && props.user.currentUser
      ? props.user.currentUser
      : {},

      alertMsg: '',
      deleteItemId: null,
      onDialogPressOK: null,
      onDialogPressCancel: null,

      isDialogOpen: false,
      isOpenAlertDialog: false,

      selectedProduct: null,
      checkFilter: true,

      isWaiting: true,
      isDialogWaiting: false
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
    this.dispatch({ type: 'products', payload: data }, callback);
  }

  setSelectedAttribute(data, callback) {
    this.dispatch({ type: 'GALLERY_PAGE_SELECTED_ATTRIBUTE', payload: data }, callback);
  }

  setAddedItemStatus(data, callback) {
    this.dispatch({ type: 'IMPORT_PAGE_IS_ADDED_ITEMS_SUCCESS', payload: data }, callback);
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
    if(this.state.isDialogOpen) this.setState({ isDialogOpen:false });
    else this.setState({ isDialogOpen:true });
  }

  handleAlertDialog() {
    if(this.state.isOpenAlertDialog) this.setState({ isOpenAlertDialog:false });
    else this.setState({ isOpenAlertDialog:true });
  }

  getAttributes() {
    // Ex.
    let attrList = { 
      // type: {   // 'type' is attribute name
      //           // 'any-attr-value' : always 'false' in initial state 
      // }
    };

    let p = this.props.gallery.products;
    p = p ? p : [];

    if(p && p.length>0) {
      let attrNames = Object.keys(p[0]);

      p.map((o,i) => {
        attrNames.map((attrName, attrNameIndex) => {
          try {
            if(!has(attrList, attrName)) {
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

    let p = this.props.gallery.products;
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
          if(has(o, attrName)) {

            attrs[attrName].indexOf( typeof o[attrName]==='number' ? o[attrName].toString() : o[attrName]) >-1 
            ? isMatched++ 
            : null
            
          } 
        });

        return isMatched > 0 ? true : false
      });
  }

  onOptimizeSavingItem(data) {
    console.log('ReuseDialog optimize data:', data)
    // Cleansing data
    let id = null;
    if(data) {
      id = has(data, 'pid') ? data.pid : null;
      delete data['pid'];
      delete data['createdAt'];
      delete data['updatedAt'];
    }

    // Require return object { id:string,data:object }
    return { id:id, data:data }
  }

  onSaveImageGallery(data) {
    console.log('On dialog save : ', data);
    this.setState({ isDialogWaiting:true }, () => {
      // Normalize data
      this.updateProductByModel(this.props.gallery.selectedCategory, data.id, data.data, () => {
        this.setState({ isDialogWaiting:false, isDialogOpen:false }, () => {
          this.fetchProduct(this.props.gallery.selectedCategory)
        })
      })
    })
  }

  onEditImageGallery(tile) {
    console.log('selectedProduct (on edit):', tile)
    this.setState({ selectedProduct:tile }, () => {
      this.handleDialog()
    });
  }

  onDeleteImageGallery(tile) {
    if(tile && tile.pid) {

      // Set dialog property
      this.setState({ 
        alertMsg:`Do you want to delete "${tile.model}" ?`,
        deleteItemId: tile.pid,
        onDialogPressOK: () => {
          // Delete the item
          this.setState({ isDialogWaiting:true }, () => {
            this.deleteProductByModel(this.props.gallery.selectedCategory, this.state.deleteItemId, () => {
              this.setState({ isDialogWaiting:false, isOpenAlertDialog:false }, () => {
                this.fetchProduct(this.props.gallery.selectedCategory)
              })
            })
          })
        }
      }, () => {
        // Open alert dialog
        this.handleAlertDialog()
      });

    } else {
      console.log('Unknown the ID')
    }
  }

  deleteProductByModel(product, id, callback) {
    const url = `/api/v1/product_${product && product.name ? product.name : ''}`;
    const data = { "method":"delete", "id": id }
    rFul.post(url, data, (err, data) => {
      if(err) {
        // Show warning dialog
        console.log('Delete item error : ', err);
      } else {
        // Show dialog
        console.log('Delete item success : ', data);
        if(typeof callback === 'function') {
          callback()
        }
      }
    });
  }

  updateProductByModel(product, id, updateObj, callback) {
    const url = `/api/v1/product_${product && product.name ? product.name : ''}`;
    const data = {
      "method":"update",
      "update": {
        "condition": { "pid": id },
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
            let p = this.props.gallery.products;
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

    // alert('Cannot edit data yet')

    // Fetch category list when 
    // - First time access
    // - Found(event) new item was added to database

    if(!this.props.gallery.categories || (this.props.product && this.props.product.isAddedSuccess)) {

      // Catch the event
      this.setAddedItemStatus(false)

      // Get category list
      this.getCategoryList((err) => {
        if(err) {
          console.log('Load category list error : ', err);
        } else {
          const c = this.props.gallery.categories;
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
                <CategorySelector
                  selectedItem={ this.props.gallery.selectedCategory ? this.props.gallery.selectedCategory : [] }
                  itemList={ this.props.gallery.categories ? this.props.gallery.categories : [] } 
                  onChange={(selected) => {
                    console.log('Selected item in combobox :', selected);
                    // Clear selected attribute and attribute filtering
                    this.setSelectedAttribute([])
                    this.setAttributeFilter([])
                    // Fetch product based on the category
                    if(selected){ this.fetchProduct(selected) }
                  }
                }/>
              </Grid>
    
              {
                this.props.gallery.filter && this.props.gallery.filter.length > 0
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
                          this.props.gallery.attrList
                          ? 
                            Object.keys(this.props.gallery.attrList).map((attrName, attrObjIndex) => {
                              console.log(attrName);
                              return (
                                ['pid', 'createdAt', 'updatedAt'].indexOf(attrName) < 0
                                ? 
                                  <Checkboxes 
                                    key={`checkbox-idx-${attrObjIndex}`}
                                    title={attrName.toUpperCase()} 
                                    attrs={this.props.gallery.attrList[attrName]} 
                                    onSelect={(k,v) => {
                                      let attrList = this.props.gallery.attrList;
                                      let selectedAttr = this.props.gallery.selectedAttr;
                                      selectedAttr = selectedAttr ? selectedAttr : {};

                                      if(v) {

                                        if(!has(selectedAttr, attrName)) {
                                          selectedAttr[attrName] = [];
                                        }

                                        const specificIndex = selectedAttr[attrName].indexOf(k);
                                        if(specificIndex<0) {
                                          selectedAttr[attrName].push(k);

                                          attrList[attrName][k] = true;
                                          this.setAttributeList(attrList);
                                        } else {
                                          selectedAttr[attrName].splice(specificIndex, 1);

                                          attrList[attrName][k] = false;
                                          this.setAttributeList(attrList);
                                        }

                                      } else {

                                        if(has(selectedAttr, attrName)) {
                                          let tmpIdx = selectedAttr[attrName].indexOf(k);
                                          if(tmpIdx>-1) {
                                            selectedAttr[attrName].splice(tmpIdx, 1);

                                            attrList[attrName][k] = false;
                                            this.setAttributeList(attrList);
                                          }
                                        }

                                      }
                                      
                                      this.setSelectedAttribute(selectedAttr)
                                      this.handlerFilterByType(selectedAttr);
                                    }}/>
                                :
                                  null
                              )
                            })
        
                          : null
                        }
                        </StyleAttrList>
                      </StylePaper>
                    </Grid>
        
                    <Grid item xs={12} md={8}>
                      <ImageGallery 
                        filter={this.props.gallery.filter ? this.props.gallery.filter : []}
                        checkFilter={checkFilter}
                        onEdit={(tile) => this.onEditImageGallery(tile)}
                        onDelete={(tile) => this.onDeleteImageGallery(tile)}/>
                    </Grid>
                  </>
                :
                  null
              }
            </Grid>

            { /** Edit dialog */ }
  
            <ReuseDialog 
              title={'Product'}
              content={null}
              form={selectedProduct}
              isOpen={this.state.isDialogOpen} 
              isWaiting={this.state.isDialogWaiting}
              loadingDescription={'Sync to server...'}
              onOK={(data) => this.onSaveImageGallery(data)}
              optimize={(data) => this.onOptimizeSavingItem(data)}
              onClose={(isOpen) => { this.setState({ isDialogOpen:isOpen }) }}
            />

            { /** Alert dialog */ }
  
            <ReuseDialog 
              title={'System'} 
              isWaiting={this.state.isDialogWaiting}
              loadingDescription={'Sync to server...'}
              isOpen={this.state.isOpenAlertDialog} 
              content={this.state.alertMsg}
              form={null}
              onClose={() => {

                if(typeof this.state.onDialogPressCancel === 'function') {
                  this.state.onDialogPressCancel()
                }

                this.setState({ isOpenAlertDialog:false })

              }}
              onOK={() => {

                if(typeof this.state.onDialogPressOK === 'function') {
                  this.state.onDialogPressOK()
                }

                // this.setState({ isOpenAlertDialog:false })

              }}
            />
          
          </>
      
        :  
          
          <Loading hasContainer={true}/>
      }
      </MenuComponent>
    )
  }
}

export default connect(state => state)(Gallery);