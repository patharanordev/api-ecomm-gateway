const simulate = (state={}, action) => {
    switch(action.type) {

        case 'SIMSTORE_CATEGORY_LIST':
            return { ...state, allCategories:action.payload };

        case 'SIMSTORE_CART':
            return { ...state, cart:action.payload };

        case 'SIMSTORE_PRODUCTS':
            return { ...state, productsInStore:action.payload };

        default:
            return state;
    }
}

export default simulate;