import React from 'react';
import dynamic from 'next/dynamic';
import { connect } from 'react-redux';
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
  }

  getOrderItems() {
    this.setState({ isWaiting:true }, () => {
      const url = `/api/v1/payment`;
      const data = { "method":"order", "type":"list", "options": { "order": [ ["timestamp", "DESC"] ] } }
      rFul.post(url, data, (err, data) => {
        this.setState({ isWaiting:false }, () => {
          if(err) { console.log('Select order error : ', err); } 
          else {
            console.log('Get order status success : ', data);
            this.setState({ orderItems:data })
          }
        });
      });
    });
  }

  updateOrderItemStatus(e, record_id, callback) {
    if(record_id) {
      this.setState({ isWaiting:true }, () => {
        rFul.post(`/api/v1/payment`, { 
          "method":"update", 
          "update": {
            "condition": { record_id:record_id },
            "data": { order_status:e.target.value },
          }
        }, (err, data) => {

          this.setState({ isWaiting:false }, () => {
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
            <Loading />
        }
        </MenuComponent>
      )
    } else {
      return <div></div>
    }
  }
}

export default connect(state => state)(Order);