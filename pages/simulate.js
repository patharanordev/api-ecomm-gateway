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
const BuyAmountDlg = dynamic( import('../components/simulate/BuyAmountDlg'), { ssr: false } )
const ProductGallery = dynamic( import('../components/simulate/SimStore'), { ssr: false } )
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

class Simulate extends React.Component {
  static async getInitialProps({ store, isServer, pathname, query:{ user } }) {
    if(user) {
      console.log('ProductSimulate got response : ', user)
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
    this.dispatch({ type: 'SIMSTORE_CATEGORY_LIST', payload: data }, callback);
  }

  setProducts(data, callback) {
    this.dispatch({ type: 'SIMSTORE_PRODUCTS', payload: data }, callback);
  }

  setCart(data, callback) {
    this.dispatch({ type: 'SIMSTORE_CART', payload: data }, callback);
  }

  setAddedItemStatus(data, callback) {
    this.dispatch({ type: 'IMPORT_PAGE_IS_ADDED_ITEMS_SUCCESS', payload: data }, callback);
  }

  handleDialog() {
    if(this.state.isDialogOpen) this.setState({ isDialogOpen:false });
    else this.setState({ isDialogOpen:true });
  }

  handleAlertDialog() {
    if(this.state.isOpenAlertDialog) this.setState({ isOpenAlertDialog:false });
    else this.setState({ isOpenAlertDialog:true });
  }

  onOptimizeCart(data) {
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

  onAddToCart(data) {
    console.log('On add to cart : ', data);

    // this.setState({ isDialogWaiting:true }, () => {
    //   // Normalize data
    //   this.updateProductByModel(this.props.gallery.selectedCategory, data.id, data.data, () => {
    //     this.setState({ isDialogWaiting:false, isDialogOpen:false }, () => {
    //       this.fetchProduct(this.props.gallery.selectedCategory)
    //     })
    //   })
    // })
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
        // Merge with the old one
        const p = this.props.simulate.productsInStore ? this.props.simulate.productsInStore : [];
        this.setProducts(p.concat(...data), callback)
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

      if(product && product.name) {
        this.getProductByName(product.name, () => {
          this.setState({ isWaiting:false })
        })
      } else {
        console.log('Unknown product name.')
        this.setState({ isWaiting:false })
      }

    })
  }

  componentDidMount() {

    if(!this.props.simulate.productsInStore || this.props.product.isAddedSuccess) {

      // Catch the event (sync with import product)
      this.setAddedItemStatus(false)

      // Get category list
      this.getCategoryList((err) => {
        if(err) {
          console.log('Load category list error : ', err);
        } else {
          const c = this.props.simulate.allCategories;
          if(c && Array.isArray(c)) {
            // Clear old items
            this.setProducts([], () => {
              // Fetch all
              c.map((o) => this.fetchProduct(o))
            })
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
      isWaiting,
      selectedProduct 
    } = this.state;

    return (
      <MenuComponent currentUser={currentUser} title='Store Simulation'>
      {
        !isWaiting

        ?
          <>
            <Grid container spacing={3}>
              <ProductGallery 
                items={this.props.simulate.productsInStore}
                onPressActionBtn={(data) => {
                  this.setState({ selectedProduct:data }, () => {
                    this.handleDialog()
                  })
                }} />
            </Grid>

            { /** Buy amount dialog */ }
  
            <BuyAmountDlg 
              title={'Buy amount'}
              content={null}
              form={selectedProduct}
              isOpen={this.state.isDialogOpen} 
              isWaiting={this.state.isDialogWaiting}
              loadingDescription={'Sync to server...'}
              onOK={(data) => this.onAddToCart(data)}
              optimize={(data) => this.onOptimizeCart(data)}
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

export default connect(state => state)(Simulate);