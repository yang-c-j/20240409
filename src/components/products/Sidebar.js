import { useRef, useState, useContext } from "react";
import { IoAlertCircleOutline } from "react-icons/io5";
import { ItemsContext } from "../../store/itemsContext";

const Sidebar = ({ onFilterByCategory, onFilterByPrice, onRangeReset }) => {
  const [error, setError] = useState(null);
  const itemsCtx = useContext(ItemsContext);
  const categoryArray = itemsCtx.items.map((item) => item.category);
  const categoryUniqueArray = [...new Set(categoryArray)];

  const minimumPriceRef = useRef();
  const maximumPriceRef = useRef();

  const formSubmitHandler = (e) => {
    e.preventDefault();
    const enteredMinPrice = minimumPriceRef.current.value.trim();
    const enteredMaxPrice = maximumPriceRef.current.value.trim();

    // case 1: Either of the fields empty
    if (enteredMinPrice === "" || enteredMaxPrice === "") {
      setError("Either fields can't be empty.");
      return;
    }

    // case 2: Minimum or maximum value less than 0
    if (+enteredMinPrice < 0 || +enteredMaxPrice < 0) {
      setError("Either values can't be less than 0.");
      return;
    }

    // case 3: Either of the fields is a decimal value
    if (
      !Number.isInteger(+enteredMinPrice) ||
      !Number.isInteger(+enteredMaxPrice)
    ) {
      setError("Either values can't be a decimal value");
      return;
    }

    // case 4: Range is 0 or less than 0
    if (
      +enteredMaxPrice - +enteredMinPrice === 0 ||
      +enteredMaxPrice - +enteredMinPrice < 0
    ) {
      setError("Range should be greater than 0");
      return;
    }
    setError(null);
    onFilterByPrice(enteredMinPrice, enteredMaxPrice);
  };

  const rangeResetHandler = () => {
    minimumPriceRef.current.value = "";
    maximumPriceRef.current.value = "";
    onRangeReset();
  };

  return (
    <>
      <div className="filters-container">
        <div className="category-filter-container">
          <ul className="category-list">
            <h3 className="title">Category</h3>
            {categoryUniqueArray.map((category) => (
              <li key={category} className="category-item">
                <input
                  type="checkbox"
                  id={category}
                  className="input-checkbox"
                  name="category"
                  value={category}
                  onChange={onFilterByCategory}
                />
                <label htmlFor={category} className="label-checkbox">
                  {category}
                </label>
              </li>
            ))}
          </ul>
        </div>
        <div className="price-filter-container">
          <h3 className="title">Price Range</h3>
          <form className="form-price-limit" onSubmit={formSubmitHandler}>
            <div className="price-limit-container">
              <span>$</span>
              <input type="number" placeholder="Min" ref={minimumPriceRef} />
            </div>
            <span>-</span>
            <div className="price-limit-container">
              <span>$</span>
              <input type="number" placeholder="Max" ref={maximumPriceRef} />
            </div>
            <button type="submit" className="btn-range">
              Go
            </button>
          </form>
          {error && (
            <p className="alert alert-danger">
              <IoAlertCircleOutline className="alert-icon" />
              <span>{error}</span>
            </p>
          )}
          <button
            type="button"
            className="btn-range-reset"
            onClick={rangeResetHandler}
          >
            Reset range
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
