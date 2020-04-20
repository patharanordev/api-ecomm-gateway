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

// const reducer = ( state = { foo:'' }, action) => {
//     switch(action.type) {
//         case 'FOO':
//             return { ...state, foo:action.payload };
        
//         case 'CHANGE_STORE_VALUE':
//             return { ...state, foo:action.payload };

//         case 'CURRENT_USER':
//             return { ...state, currentUser:action.payload };

//         case 'IMPORT_PAGE_CATEGORY_LIST':
//             return { ...state, import_page_categories:action.payload };

//         case 'IMPORT_PAGE_PREPARED_DATA':
//             return { ...state, import_page_prepared_data:action.payload };

//         case 'IMPORT_PAGE_SELECTED_CATEGORY':
//             return { ...state, import_page_selectedCategory:action.payload };

//         default:
//             return state;
//     }
// };

const makeStore = (initialState, option) => {
    return createStore(RootReducer, initialState, applyMiddleware(...middlewares));
};

export { makeStore };