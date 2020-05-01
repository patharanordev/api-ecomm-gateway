const product = (state={}, action) => {
    switch(action.type) {
        case 'IMPORT_PAGE_CATEGORY_LIST':
            return { ...state, categories:action.payload };

        case 'IMPORT_PAGE_PREPARED_DATA':
            return { ...state, preparedData:action.payload };

        case 'IMPORT_PAGE_SELECTED_CATEGORY':
            return { ...state, selectedCategory:action.payload };

        case 'IMPORT_PAGE_IS_ADDED_ITEMS_SUCCESS':
            return { ...state, isAddedSuccess:action.payload };

        default:
            return state;
    }
}

export default product;