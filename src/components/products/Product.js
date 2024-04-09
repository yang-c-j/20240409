import { useState, useContext } from "react";
import { AiFillStar } from "react-icons/ai";
import { CartContext } from "../../store/cartContext";
import { IoAlertCircleOutline } from "react-icons/io5";
import { URL } from "../../helper";

const Product = ({
  _id,
  thumbnail,
  title,
  rating,
  price,
  category,
  description,
  stock,
  availableStock,
  onOrder,
}) => {
  const cartCtx = useContext(CartContext);
  const [enteredQuantity, setEnteredQuantity] = useState(1);
  const [readMore, setReadMore] = useState(false);
  const [error, setError] = useState(null);

  const quantityValidateHandler = (quantity) => {
    // If proposed quantity greater than stock
    if (quantity > availableStock) {
      setError(`Available stock: ${availableStock}`);
      return;
    }
    setError(null);
    setEnteredQuantity(quantity);
  };

  const formSubmitHandler = async (e) => {
    e.preventDefault();
    if (enteredQuantity <= 0) {
      setError("Enter a valid quantity");
      return;
    }

    await onOrder(_id, enteredQuantity);

    cartCtx.cartItemsUpdateHandler({
      _id,
      thumbnail,
      title,
      description,
      price,
      quantity: enteredQuantity,
      stock,
    });

    setEnteredQuantity(1);
  };

  // Rating fixed to 2 decimal places
  const ratingCorrected = rating.toFixed(1);

  let descriptionTrimmed;
  if (!readMore) {
    if (description.length > 50) {
      descriptionTrimmed = `${description.slice(0, 50)}...`;
    } else {
      descriptionTrimmed = description;
    }
  } else {
    descriptionTrimmed = description;
  }

  return (
    <article className="product-card">
      <div className="product-img-rating-container">
        <img src={`${URL}${thumbnail}`} alt={title} className="product-img" />
        <p className="product-rating">
          <AiFillStar className="rating-icon" />
          <span>{ratingCorrected}</span>
        </p>
      </div>
      <div className="product-info">
        <div className="product-title-price-container">
          <h3 className="product-title">{title}</h3>
          <p className="product-price">
            <span>$</span>
            {price}
            <span>/unit</span>
          </p>
        </div>
        <div className="product-category-container">
          <p className="product-category">
            Category: <span>{category}</span>
          </p>
        </div>
        <p className="product-description">
          {descriptionTrimmed}
          {description.length > 50 && (
            <button
              type="button"
              className="btn-read-more"
              onClick={() => {
                setReadMore((readMore) => !readMore);
              }}
            >
              {readMore ? "Show less" : "Read more"}
            </button>
          )}
        </p>
      </div>
      <div className="product-cta">
        <form className="form-quantity" onSubmit={formSubmitHandler}>
          {error && (
            <p className="alert alert-danger">
              <IoAlertCircleOutline className="alert-icon" />
              <span>{error}</span>
            </p>
          )}
          <div className="quantity-control-container">
            <button
              type="button"
              className="btn-decrement"
              onClick={() => quantityValidateHandler(enteredQuantity - 1)}
              disabled={enteredQuantity <= 1 ? true : false}
            >
              -
            </button>
            <input
              type="number"
              className="input-quantity"
              value={enteredQuantity}
              onChange={(e) => {
                quantityValidateHandler(Number(e.target.value));
              }}
              min="1"
              max={availableStock}
            />
            <button
              type="button"
              className="btn-increment"
              onClick={() => quantityValidateHandler(enteredQuantity + 1)}
              disabled={enteredQuantity === availableStock ? true : false}
            >
              +
            </button>
          </div>
          <button
            type="submit"
            className="btn btn-add-to-cart"
            disabled={availableStock === 0 ? true : false}
          >
            Add to cart
          </button>
        </form>
      </div>
    </article>
  );
};

export default Product;
