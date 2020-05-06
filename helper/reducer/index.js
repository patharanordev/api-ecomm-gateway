import { combineReducers } from 'redux'

import others from './others';
import user from './user';
import gallery from './gallery';
import product from './product';
import simulate from './simulate';
 
const RootReducer = combineReducers({
    others,
    user,
    gallery,
    product,
    simulate
})


export default RootReducer;