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
const SimStore = dynamic( import('../components/simulate/SimStore'), { ssr: false } )
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

const paymentTemplate = {
  "method":"create",
  "data": {
    "user_id": null,
    "payment": {
      "method": "visa",
      "card_id": "1234567890098765",
      "shipping": "Thai"
    },
    "items": []
  }
}

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
    let { cart } = this.props.simulate
    console.log('On add to cart : ', data);
    if(!(cart && Array.isArray(cart))) { cart = []; }

    cart.push(data)
    this.setCart(cart)

    this.setState({ isDialogOpen:false })
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

  onCartPayment(data, callback) {
    // Set request template
    paymentTemplate.data.user_id = this.props.user.currentUser
    data.forEach(element => {
      paymentTemplate.data.items.push({
        "product_id": element.id,
        "price": element.data.price,
        "qty": element.amount
      })
    })

    console.log('On cart click payment:', paymentTemplate)

    this.setState({ isWaiting:true }, () => {
      const url = `/api/v1/payment`;
      rFul.post(url, paymentTemplate, (err, data) => {
        this.setState({ isWaiting:false })
        if(typeof callback === 'function') {
          callback(err, data);
        }
      });
    })
  }

  render() {
    let { 
      currentUser,
      isWaiting,
      selectedProduct 
    } = this.state;

    return (
      <MenuComponent currentUser={currentUser} title='Simulate'>
      {
        !isWaiting

        ?
          <>
            <Grid container spacing={3}>
              <SimStore 
                cart={this.props.simulate.cart}
                items={this.props.simulate.productsInStore}
                onPressActionBtn={(data) => {
                  this.setState({ selectedProduct:data }, () => {
                    this.handleDialog()
                  })
                }}
                onCartPayment={(data) => this.onCartPayment(data, (err, data) => {
                  if(err) {
                    console.log('Payment error :', err)
                  } else {
                    console.log('Payment success :', data)
                    this.setCart([])
                  }
                })}
                onCartDelete={(objIndex) => {
                  console.log('On cart click delete:', objIndex)

                  let cart = this.props.simulate.cart
                  if(cart && Array.isArray(cart)) cart.splice(objIndex, 1)
                  
                  this.setCart(cart)
                }}
                />
            </Grid>

            { /** Buy amount dialog */ }
  
            <BuyAmountDlg 
              title={'Buy amount'}
              content={null}
              form={selectedProduct}
              isOpen={this.state.isDialogOpen} 
              onOK={(data) => this.onAddToCart(data)}
              optimize={(data) => this.onOptimizeCart(data)}
              onClose={(isOpen) => { this.setState({ isDialogOpen:isOpen }) }}
            />
          
          </>
      
        :  
          
          <Loading hasContainer={true} description="Sync to server..."/>
      }
      </MenuComponent>
    )
  }
}

export default connect(state => state)(Simulate);