import AbstractBaseApi from '../AbstractBaseApi';
import { serializeCartItemForMultipleDelete } from './serializers';

export default class CartApi extends AbstractBaseApi {
  getCartData = async (params = {}) => {
    const res = await this.get('/cart/my_cart/', params);
    return res.data;
  };
  updateCartData = async (params = {}) => {
    const res = await this.post('/cart/update_cart/', params);
    return res.data;
  };
  deleteCartData = async (params = {}) => {
    const res = await this.delete('/cart/del_from_cart/', params);
    return res.data;
  };
  addToCart = async (params) => {
    const res = await this.post('/cart/add_or_modify/', params);
    return res.data;
  };
  multipleDeleteFromCart = async (params = {}) => {
    params['items'] = serializeCartItemForMultipleDelete(params['items']);
    const res = await this.delete('/cart/multiple_del_from_cart/', params);
    return res.data;
  };
  selectOrUnSelectAllItemCart = async (isSelect = false, params = {}) => {
    if (isSelect) {
      const res = await this.post('/cart/select_all/', params);
      return res.data;
    } else {
      const res = await this.post('/cart/unselect_all/', params);
      return res.data;
    }
  };
  // *************************************************************************
  cartAddComment = async (params = {}) => {
     const res = await this.post('/cart/add_comment/', params);
     return res.data;
   };
}
