import React from 'react';
import DashboardComponent from '../components/dashboard/Dashboard';

export default class Dashboard extends React.Component {
  static getInitialProps({ query:{ user } }) {
    console.log('Dashboard got response : ', user)
    return { currentUser:user }
  }

  render() {
    const { currentUser } = this.props;
    return (
      <DashboardComponent currentUser={currentUser}/>
    )
  }
}