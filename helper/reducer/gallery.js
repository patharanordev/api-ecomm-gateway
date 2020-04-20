const GalleryReducer = (state={}, action) => {
    switch(action.type) {

        case 'GALLERY_PAGE_CATEGORY_LIST':
            return { ...state, gallery_page_categories:action.payload };

        case 'GALLERY_PAGE_SELECTED_CATEGORY':
            return { ...state, gallery_page_selectedCategory:action.payload };

        case 'GALLERY_PAGE_ATTRIBUTE_FILTER':
            return { ...state, gallery_page_filter:action.payload };

        case 'GALLERY_PAGE_ATTRIBUTE_LIST':
            return { ...state, gallery_page_attrList:action.payload };

        case 'GALLERY_PAGE_PRODUCTS':
            return { ...state, gallery_page_products:action.payload };

        case 'GALLERY_PAGE_SELECTED_ATTRIBUTE':
            return { ...state, gallery_page_selectedAttr:action.payload };

        default:
            return state;
    }
}

export default GalleryReducer;