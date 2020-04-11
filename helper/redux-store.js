import { applyMiddleware, createStore, compose } from 'redux';

// Prepare log for development env
const middlewares = [];
console.log('process.env.NODE_ENV:', process.env.NODE_ENV);
if(process.env.NODE_ENV=='development' || process.env.NODE_ENV=='local') {
    const { logger } = require('redux-logger');
    middlewares.push(logger);
};

const reducer = ( state = { foo:'' }, action) => {
    switch(action.type) {
        case 'FOO':
            return { ...state, foo:action.payload };
        
        case 'CHANGE_STORE_VALUE':
            return { ...state, foo:action.payload };

        case 'CURRENT_USER':
            return { ...state, currentUser:action.payload };

        default:
            return state;
    }
};

const makeStore = (initialState, option) => {
    return createStore(reducer, initialState, applyMiddleware(...middlewares));
};

export { makeStore };