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

      // const categories = await this.getCategoryList();
      // const product = await this.getProductByName(categories.data[1].name);

      // console.log('product : ', product)
      // return { 
      //   categories:categories.data ? categories.data : [], 
      //   product:product.data ? product.data : []
      // }
    }
  }

  static async fetch(url, data) {
    let res = { error:null, data:null };
    try {
      const response = await axios.post(url, data);
      res.data = response.data.data;
    } catch (error) {
      res.error = error;
    }

    // console.log('fetch :', res);
    return res;
  }

  static async getProductByName(name) {
    const url = `${process.env.API_HOST}/api/v1/product_${name}`;
    const data = { "method":"select", "condition": {} };
    return await this.fetch(url, data);
  }

  static async getCategoryList() {
    const url = `${process.env.API_HOST}/api/v1/product_categories`;
    const data = { "method":"select", "condition": {} };
    return await this.fetch(url, data);
  }

  render() {
    let { currentUser } = this.props;
    return (
      <MenuComponent currentUser={currentUser} title='Product Gallery'>
        <ProductGalleryComponent/>
      </MenuComponent>
    )
  }
}

export default connect(state => state)(ProductGallery);