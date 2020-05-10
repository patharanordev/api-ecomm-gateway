import React from 'react';
import dynamic from 'next/dynamic';
import { connect } from 'react-redux';
import LogRocket from 'logrocket';
import RESTFul from '../helper/RESTFul';
import Loading from '../components/Loading';

const MenuComponent = dynamic( import('../components/menu/Menu'), { ssr: false } )
const OrderComponent = dynamic( import('../components/order/OrderTable'), { ssr: false } )

const rFul = RESTFul();

class Order extends React.Component {
  static getInitialProps({ store, isServer, pathname, query:{ user } }) {
    if(user) {
      console.log('Order got response : ', user)
      store.dispatch({ type:'CURRENT_USER', payload:user });
      // return { currentUser:user }
    }
  }

  constructor(props) {
    super(props)

    this.state = {
      orderItems: null,
      isWaiting: true
    }

    LogRocket.init('zwj5lf/ecommadmin', {
      release: process.env.APP_VERSION | 'undefined',
    });
  }

  wait(isWaiting, callback) { 
    this.setState({ isWaiting:isWaiting }, () => {
      if(typeof callback === 'function') { callback() }
    });
  }

  getOrderItems() {
    this.wait(true, () => {
      const url = `/api/v1/payment`;
      const data = { "method":"order", "type":"list", "options": { "order": [ ["timestamp", "DESC"] ] } }
      rFul.post(url, data, (err, data) => {
        if(err) { console.log('Select order error : ', err); } 
        else {
          console.log('Get order status success : ', data);
          this.setState({ orderItems:data }, () => this.wait(false))
        }
      });
    });
  }

  updateOrderItemStatus(e, record_id, callback) {
    if(record_id) {
      this.wait(true, () => {
        rFul.post(`/api/v1/payment`, { 
          "method":"update", 
          "update": {
            "condition": { record_id:record_id },
            "data": { order_status:e.target.value },
          }
        }, (err, data) => {
          this.wait(false, () => {
            if(typeof callback === 'function') {
              callback(err, data);
            }
          })
        });
      })
    }
  }

  componentDidMount() {
    this.getOrderItems()
  }

  render() {
    const { user } = this.props;
    const { orderItems, isWaiting } = this.state;

    if(MenuComponent) {
      return (
        <MenuComponent currentUser={user && user.currentUser ? user.currentUser : tmpUser} title='Order'>
        {
          isWaiting==false
          ?
            OrderComponent
            ? 
              <OrderComponent 
                orderItems={orderItems} 
                onStatusChange={(e, record_id)=> {
                  // Update order status
                  this.updateOrderItemStatus(e, record_id, () => {
                    // Refresh order item table
                    this.getOrderItems()
                  })
                }}
              />
            : 
              null
          :
            <Loading hasContainer={true}/>
        }
        </MenuComponent>
      )
    } else {
      return <div></div>
    }
  }
}

export default connect(state => state)(Order);