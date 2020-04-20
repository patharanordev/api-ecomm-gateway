const ImportProductReducer = (state={}, action) => {
    switch(action.type) {
        case 'IMPORT_PAGE_CATEGORY_LIST':
            return { ...state, import_page_categories:action.payload };

        case 'IMPORT_PAGE_PREPARED_DATA':
            return { ...state, import_page_prepared_data:action.payload };

        case 'IMPORT_PAGE_SELECTED_CATEGORY':
            return { ...state, import_page_selectedCategory:action.payload };

        default:
            return state;
    }
}

export default ImportProductReducer;