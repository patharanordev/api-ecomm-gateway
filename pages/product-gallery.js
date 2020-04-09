import React from 'react';
import MenuComponent from '../components/menu/Menu';
import ProductGalleryComponent from '../components/CopyRight';
import { connect } from 'react-redux';

class ProductGallery extends React.Component {
  static getInitialProps({ store, isServer, pathname, query:{ user } }) {
    if(user) {
      console.log('ProductGallery got response : ', user)
      store.dispatch({ type:'CURRENT_USER', payload:user });
      // return { currentUser:user }
    }
  }

  render() {
    const { currentUser } = this.props;
    return (
      <MenuComponent currentUser={currentUser} title='Product Gallery'>
        <ProductGalleryComponent />
      </MenuComponent>
    )
  }
}

export default connect(state => state)(ProductGallery);