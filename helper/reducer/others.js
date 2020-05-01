const others = (state={}, action) => {
    switch(action.type) {

        case 'FOO':
            return { ...state, foo:action.payload };
        
        case 'CHANGE_STORE_VALUE':
            return { ...state, foo:action.payload };

        default:
            return state;
    }
}

export default others;