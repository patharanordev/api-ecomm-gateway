import { 
    applyMiddleware, createStore, compose
} from 'redux';
import LogRocket from 'logrocket';

import RootReducer from './reducer/index';

// Prepare log for development env
const middlewares = [];
console.log('process.env.NODE_ENV:', process.env.NODE_ENV);
if(process.env.NODE_ENV=='development' || process.env.NODE_ENV=='local') {
    const { logger } = require('redux-logger');
    middlewares.push(logger);
};

const makeStore = (initialState, option) => {
    // LogRocket middleware should go last
    return createStore(RootReducer, initialState, applyMiddleware(...middlewares, LogRocket.reduxMiddleware()));
};

export { makeStore };