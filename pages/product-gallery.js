import React from 'react';
import MenuComponent from '../components/menu/Menu';
import ProductGalleryComponent from '../components/product-gallery/ImageGallery';
import { connect } from 'react-redux';

import axios from 'axios';

class ProductGallery extends React.Component {
  static async getInitialProps({ store, isServer, pathname, query:{ user } }) {
    if(user) {
      console.log('ProductGallery got response : ', user)
      store.dispatch({ type:'CURRENT_USER', payload:user });
      // return { currentUser:user }

      const product = await this.getProductByName('smartphone');
      return { product:product }
    }
  }

  static async getProductByName(name) {
    let res = { error:null, data:null };
    try {
      const url = `https://api-ecomm-gateway.herokuapp.com/api/v1/product_${name}`;
      const data = {
        "method":"select",
        "condition": { }
      };

      const response = await axios.post(url, data);
      res.data = response.data.data;
    } catch (error) {
      res.error = error;
    }

    // console.log('product:', res);
    return res;
  }

  render() {
    let { currentUser, product } = this.props;
    return (
      <MenuComponent currentUser={currentUser} title='Product Gallery'>
        <ProductGalleryComponent data={product}/>
      </MenuComponent>
    )
  }
}

export default connect(state => state)(ProductGallery);