import React from 'react';
import MenuComponent from '../components/menu/Menu';
import DashboardComponent from '../components/dashboard/Dashboard';
import { connect } from 'react-redux';

class Dashboard extends React.Component {
  static getInitialProps({ store, isServer, pathname, query:{ user } }) {
    if(user) {
      console.log('Dashboard got response : ', user)
      store.dispatch({ type:'CURRENT_USER', payload:user });
      // return { currentUser:user }
    }
  }

  render() {
    const { user } = this.props;
    return (
      <MenuComponent currentUser={user.currentUser} title='Dashboard'>
        <DashboardComponent />
      </MenuComponent>
    )
  }
}

export default connect(state => state)(Dashboard);