import React from 'react';
import { connect } from 'react-redux';

const UserPage = (props) => {
    return (
        <div>{JSON.stringify(props)}</div>
    )
};

UserPage.getInitialProps = ({ store, isServer, pathname, query }) => {
    store.dispatch({ type:'FOO', payload:'user page' });
}

export default connect(state => state)(UserPage);