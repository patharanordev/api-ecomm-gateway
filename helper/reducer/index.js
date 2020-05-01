import { combineReducers } from 'redux'

import others from './others';
import user from './user';
import gallery from './gallery';
import product from './product';
 
const RootReducer = combineReducers({
    others,
    user,
    gallery,
    product
})


export default RootReducer;