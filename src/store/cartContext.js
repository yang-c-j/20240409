import { createContext, useState, useCallback } from "react";
import axiosInstance from "../axios/axiosInstance";
import { createConfigObj } from "../helper";

export const CartContext = createContext({
  cartItems: [],
  error: null,
  fetchCartItems: () => {},
  cartItemsUpdateHandler: () => {},
  quantityUpdateHandler: () => {},
  itemDeleteHandler: () => {},
});

const CartContextProvider = (props) => {
  const [cartItems, setCartItems] = useState([]);
  const [error, setError] = useState(null);

  const fetchCartItems = useCallback(async () => {
    try {
      setError(null);
      const res = await axiosInstance.get(
        `/api/v1/cart-items`,
        createConfigObj()
      );
      setCartItems(res.data.data.cartItems);
    } catch (err) {
      setError(err.response.data.message);
    }
  }, []);

  const createCartItem = async (item) => {
    try {
      await axiosInstance.post(`/api/v1/cart-items`, item, createConfigObj());
    } catch (err) {
      throw new Error(err);
    }
  };

  const updateCartItem = async (item) => {
    try {
      await axiosInstance.patch(
        `/api/v1/cart-items`,
        { cartItem: item },
        createConfigObj()
      );
    } catch (err) {
      throw new Error(err);
    }
  };

  const deleteCartItem = async (_id) => {
    try {
      await axiosInstance.patch(
        `/api/v1/cart-items`,
        { cartItemId: _id },
        createConfigObj()
      );
    } catch (err) {
      throw new Error(err);
    }
  };

  const cartItemsUpdateHandler = async (item) => {
    try {
      setError(null);
      // Check if item already exist in cart items
      const cartItemIndex = cartItems.findIndex(
        (cartItem) => cartItem._id === item._id
      );

      if (cartItemIndex !== -1) {
        const updatedItem = { ...item };
        updatedItem.quantity =
          cartItems[cartItemIndex].quantity + item.quantity;
        await updateCartItem(updatedItem);
      } else {
        await createCartItem(item);
      }
      fetchCartItems();
    } catch (err) {
      setError(err.response.data.message);
    }
  };

  const quantityUpdateHandler = async (_id, newQuantity) => {
    try {
      setError();
      // Find index of the particular item
      const cartItemIndex = cartItems.findIndex(
        (cartItem) => cartItem._id === _id
      );

      // Update quantity of particular item
      const updatedItem = { ...cartItems[cartItemIndex] };
      updatedItem.quantity = newQuantity;
      await updateCartItem(updatedItem);
      fetchCartItems();
    } catch (err) {
      setError(err.response.data.message);
    }
  };

  const itemDeleteHandler = async (_id) => {
    try {
      await deleteCartItem(_id);
      fetchCartItems();
    } catch (err) {
      setError(err.response.data.message);
    }
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        error,
        fetchCartItems,
        cartItemsUpdateHandler,
        quantityUpdateHandler,
        itemDeleteHandler,
      }}
    >
      {props.children}
    </CartContext.Provider>
  );
};

export default CartContextProvider;
