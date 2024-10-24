import { ADD_TO_CART, REMOVE_FROM_CART,CLEAR_CART,UPDATE_QUANTITY } from '../acction/acctiontype.ts';
import { Product  } from './type';


export const addToProduct =(product:Product)=>{
    return (dispatch:any)=>{
        const existingCart: Product[] = JSON.parse(localStorage.getItem('cart')|| '[]');
        const existingProductIndex = existingCart.findIndex((item)=>item.ProductID === product.ProductID);
        if(existingProductIndex  !==-1){
            existingCart[existingProductIndex].quantity += product.quantity;
        } else {
            existingCart.push(product);
        };
        localStorage.setItem('cart', JSON.stringify(existingCart));
        dispatch({
            type: ADD_TO_CART,
            payload: existingCart,
        });
    };
};
export const removeFromProduct = (productId: number) => {
    return (dispatch: any) => {
        const existingCart: Product[] = JSON.parse(localStorage.getItem('cart') || '[]');
        
        // Lọc các sản phẩm để loại bỏ sản phẩm có ProductID tương ứng
        const updatedCart = existingCart.filter(item => item.ProductID !== productId);
        
        localStorage.setItem('cart', JSON.stringify(updatedCart));
        
        dispatch({
            type: REMOVE_FROM_CART,
            payload: updatedCart,
        });
    };
};
export const updateProductQuantity = (productId: number, newQuantity: number) => {
    return (dispatch: any) => {
        const existingCart: Product[] = JSON.parse(localStorage.getItem('cart') || '[]');
        
        // Tìm sản phẩm cần cập nhật
        const productIndex = existingCart.findIndex(item => item.ProductID === productId);
        
        if (productIndex !== -1) {
            // Cập nhật số lượng
            existingCart[productIndex].quantity = newQuantity;
            
            // Nếu số lượng mới là 0, xóa sản phẩm
            if (newQuantity <= 0) {
                existingCart.splice(productIndex, 1);
            }
        }
        
        localStorage.setItem('cart', JSON.stringify(existingCart));
        
        dispatch({
            type: UPDATE_QUANTITY,
            payload: existingCart,
        });
    };
};

export const clearCart = () => {
    return (dispatch: any) => {
      // Clear cart in localStorage
      localStorage.removeItem('cart');
      // Dispatch the action to update the store
      dispatch({
        type: CLEAR_CART,
        payload: [], // Empty array, as the cart is now cleared
      });
    };
  };