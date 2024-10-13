// src/store.js
import { createStore, combineReducers, applyMiddleware } from 'redux';
import {thunk} from 'redux-thunk'; // Import redux-thunk
import cartReducer from './reducers/cartReducer.ts'; // Đảm bảo đường dẫn đúng

const rootReducer = combineReducers({
    cart: cartReducer, // Kết hợp cartReducer
});

// Thêm middleware vào store
const store = createStore(rootReducer, applyMiddleware(thunk));

export default store;
