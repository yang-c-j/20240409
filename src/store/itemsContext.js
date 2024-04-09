import { createContext, useState, useCallback } from "react";
import axiosInstance from "../axios/axiosInstance";
import { createConfigObj } from "../helper";

export const ItemsContext = createContext({
  isLoading: true,
  items: [],
  error: null,
  setError: () => {},
  fetchItems: () => {},
  stockUpdateHandler: () => {},
});

const ItemsContextProvider = (props) => {
  const [isLoading, setIsLoading] = useState(true);
  const [items, setItems] = useState([]);
  const [error, setError] = useState(null);

  const fetchItems = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const res = await axiosInstance.get("/api/v1/items", createConfigObj());
      const fetchedItems = res.data.data.items;
      setItems(fetchedItems);
    } catch (err) {
      setError(err.response.data.message);
    }
    setIsLoading(false);
  }, []);

  const updateItem = async (productId, item) => {
    try {
      await axiosInstance.put(
        `/api/v1/items/${productId}`,
        item,
        createConfigObj()
      );
    } catch (err) {
      throw new Error(err.message);
    }
  };

  const stockUpdateHandler = async (productId, quantity) => {
    try {
      let productItems = structuredClone(items);
      //  Find index of item, change available stock
      const index = productItems.findIndex((item) => item._id === productId);
      const updatedItem = productItems[index];
      updatedItem.availableStock = updatedItem.availableStock - quantity;
      await updateItem(productId, updatedItem);
      fetchItems();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <ItemsContext.Provider
      value={{
        isLoading,
        items,
        error,
        setError,
        fetchItems,
        stockUpdateHandler,
      }}
    >
      {props.children}
    </ItemsContext.Provider>
  );
};

export default ItemsContextProvider;
