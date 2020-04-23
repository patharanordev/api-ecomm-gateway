const gallery = (state={}, action) => {
    switch(action.type) {

        case 'GALLERY_PAGE_CATEGORY_LIST':
            return { ...state, categories:action.payload };

        case 'GALLERY_PAGE_SELECTED_CATEGORY':
            return { ...state, selectedCategory:action.payload };

        case 'GALLERY_PAGE_ATTRIBUTE_FILTER':
            return { ...state, filter:action.payload };

        case 'GALLERY_PAGE_ATTRIBUTE_LIST':
            return { ...state, attrList:action.payload };

        case 'products':
            return { ...state, products:action.payload };

        case 'GALLERY_PAGE_SELECTED_ATTRIBUTE':
            return { ...state, selectedAttr:action.payload };

        default:
            return state;
    }
}

export default gallery;