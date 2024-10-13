// src/reducer/cartReducer.ts
import { ADD_TO_CART, REMOVE_FROM_CART } from '../acction/acctiontype.ts';
import { Product } from '../acction/type.ts'; // Đảm bảo đường dẫn đúng

interface CartState {
    items: Product[]; // Giả sử items là mảng sản phẩm
}

interface Action {
    type: string; // Hoặc sử dụng enum nếu bạn có nhiều action
    payload: any; // Bạn có thể định nghĩa payload cụ thể hơn nếu muốn
}

const initialState: CartState = {
    items: JSON.parse(localStorage.getItem('cart') || '[]'), // Lấy giỏ hàng từ localStorage
};

const cartReducer = (state = initialState, action: Action): CartState => {
    switch (action.type) {
        case ADD_TO_CART:
            return {
                ...state,
                items: action.payload,
            };
        case REMOVE_FROM_CART:
            return {
                ...state,
                items: action.payload,
            };
        default:
            return state;
    }
};

export default cartReducer;
