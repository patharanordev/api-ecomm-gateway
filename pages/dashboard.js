import React from 'react';
import MenuComponent from '../components/menu/Menu';
import DashboardComponent from '../components/dashboard/Dashboard';
import { connect } from 'react-redux';
import has from 'has';

import RESTFul from '../helper/RESTFul';

const rFul = RESTFul();

class Dashboard extends React.Component {
  static getInitialProps({ store, isServer, pathname, query:{ user } }) {
    if(user) {
      console.log('Dashboard got response : ', user)
      store.dispatch({ type:'CURRENT_USER', payload:user });
      // return { currentUser:user }
    }
  }

  constructor(props) {
    super(props)

    this.state = {
      dailyAccount: null,
      topUser: null,
      recentOrder: null
    }
  }

  getRevenue() {
    const url = `/api/v1/payment`;
    const data = { "method":"sum", "sum": { "columnName": "total" } /** , condition:... */ }
    rFul.post(url, data, (err, data) => {
      if(err) { console.log('Load revenue error : ', err); } 
      else {
        console.log('Load revenue success : ', data);
        this.setState({ revenue:data })
      }
    });
  }

  getRecentOrders() {
    const url = `/api/v1/payment`;
    const data = { "method":"recentOrder", "options": { "order": [ ["timestamp", "DESC"] ], "limit": 10 } }
    rFul.post(url, data, (err, data) => {
      if(err) { console.log('Select recent order error : ', err); } 
      else {
        console.log('Select recent order success : ', data);
        this.setState({ recentOrder:data })
      }
    });
  }

  getTopUser() {
    const url = `/api/v1/user`;
    const data = { "method":"select", "condition": {}, "options": { "order": [ ["last_access", "DESC"] ], "limit": 10 } }
    rFul.post(url, data, (err, data) => {
      if(err) { console.log('Select top user error : ', err); } 
      else {
        console.log('Select top user success : ', data);
        this.setState({ topUser:data })
      }
    });
  }

  getDailyAccount() {
    const url = `/api/v1/payment`;
    const data = { "method":"accounting" /** , "options": { "order": [ ["last_access", "DESC"] ], "limit": 10 } */ }
    rFul.post(url, data, (err, data) => {
      if(err) { console.log('Load daily account error : ', err); } 
      else {
        console.log('Load daily account success : ', data);
        this.setState({ dailyAccount:data })
      }
    });
  }

  updateUserInfo(callback) {
    const { user } = this.props;
    rFul.post(`/api/v1/user`, { 
      "method":"create", 
      "data": {
        "username": user.currentUser.displayName,
        "email": "",
        "social_id": user.currentUser.sub,
        "provider": user.currentUser.provider,
        "picture": user.currentUser.picture,
        "locale": user.currentUser.locale,
      }
    }, (err, data) => {
      if(typeof callback === 'function') {
        callback(err, data);
      }
    });
  }

  componentDidMount() {

    this.updateUserInfo((err, data) => {
      if(err) { console.log('Create user error : ', err); } 
      else { console.log('Create user success : ', data); }
      this.getRevenue()
      this.getTopUser()
      this.getRecentOrders()
      this.getDailyAccount()
    });

  }

  render() {
    const { user } = this.props;
    const { dailyAccount, revenue, topUser, recentOrder } = this.state;
    
    return (
      <MenuComponent currentUser={user.currentUser} title='Dashboard'>
        <DashboardComponent dailyAccount={dailyAccount} revenue={revenue} topUser={topUser} recentOrder={recentOrder}/>
      </MenuComponent>
    )
  }
}

export default connect(state => state)(Dashboard);