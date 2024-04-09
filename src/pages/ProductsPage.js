import Header from "../components/products/Header";
import ProductsList from "../components/products/ProductsList";
import Sidebar from "../components/products/Sidebar";
import { useState, useContext, useEffect } from "react";
import { ItemsContext } from "../store/itemsContext";
import Error from "../components/products/Error";

const ProductsPage = () => {
  const { isLoading, error, fetchItems } = useContext(ItemsContext);
  const [categories, setCategories] = useState([]);
  const [minMaxPrice, setMinMaxPrice] = useState({
    minimumPrice: null,
    maximumPrice: null,
    isRangeSet: false,
  });
  const [searchString, setSearchString] = useState("");

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const filterByCategoryHandler = (e) => {
    if (e.target.checked) {
      setCategories((categories) => [...categories, e.target.value]);
    } else {
      setCategories((categories) => {
        return categories.filter((category) => category !== e.target.value);
      });
    }
  };

  const filterByPriceHandler = (enteredMinPrice, enteredMaxPrice) => {
    setMinMaxPrice({
      minimumPrice: enteredMinPrice,
      maximumPrice: enteredMaxPrice,
      isRangeSet: true,
    });
  };

  const rangeResetHandler = () => {
    setMinMaxPrice({
      minimumPrice: null,
      maximumPrice: null,
      isRangeSet: false,
    });
  };

  const itemsSearchHandler = (enteredString) => {
    setSearchString(enteredString);
  };

  let content = <div className="loading"></div>;

  if (!isLoading && error) {
    content = <Error error={error} />;
  }

  if (!isLoading && !error) {
    content = (
      <>
        <header className="header">
          <div className="main-header-container">
            <Header onSearch={itemsSearchHandler} />
          </div>
        </header>
        <main>
          <div className="main-container">
            <Sidebar
              onFilterByCategory={filterByCategoryHandler}
              onFilterByPrice={filterByPriceHandler}
              onRangeReset={rangeResetHandler}
            />
            <ProductsList
              categories={categories}
              minMaxPrice={minMaxPrice}
              searchString={searchString}
            />
          </div>
        </main>
      </>
    );
  }

  return content;
};

export default ProductsPage;
