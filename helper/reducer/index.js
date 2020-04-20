import { combineReducers } from 'redux'

import OtherReducer from './others';
import UserReducer from './user';
import GalleryReducer from './gallery';
import ImportProductReducer from './import-product';
 
const RootReducer = combineReducers({
    OtherReducer,
    UserReducer,
    GalleryReducer,
    ImportProductReducer
})


export default RootReducer;