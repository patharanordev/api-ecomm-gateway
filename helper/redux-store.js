import { 
    applyMiddleware, createStore, compose
} from 'redux';

import RootReducer from './reducer/index';

// Prepare log for development env
const middlewares = [];
console.log('process.env.NODE_ENV:', process.env.NODE_ENV);
if(process.env.NODE_ENV=='development' || process.env.NODE_ENV=='local') {
    const { logger } = require('redux-logger');
    middlewares.push(logger);
};

const makeStore = (initialState, option) => {
    return createStore(RootReducer, initialState, applyMiddleware(...middlewares));
};

export { makeStore };