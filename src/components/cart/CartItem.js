import { useContext, useState } from "react";
import { RiDeleteBinLine } from "react-icons/ri";
import { CartContext } from "../../store/cartContext";
import { IoAlertCircleOutline } from "react-icons/io5";
import { ItemsContext } from "../../store/itemsContext";
import { URL } from "../../helper";

const CartItem = ({
  _id,
  thumbnail,
  title,
  description,
  price,
  quantity,
  stock,
}) => {
  const { quantityUpdateHandler, itemDeleteHandler } = useContext(CartContext);
  const itemsCtx = useContext(ItemsContext);
  const [error, setError] = useState(null);

  const quantityValidateHandler = async (enteredQuantity) => {
    // If proposed quantity greater than stock
    if (enteredQuantity > stock) {
      setError(`Available stock: ${stock}`);
      return;
    }

    setError(null);
    quantityUpdateHandler(_id, enteredQuantity);

    // Entered quantity can be more or less than quantity
    // If less, available stock should increase, changeInQuantity will be -ve
    // If more, available stock should decrease, changeInQuantity will be +ve
    const changeInQuantity = enteredQuantity - quantity;
    itemsCtx.stockUpdateHandler(_id, changeInQuantity);
  };

  const cartItemDeleteHandler = async () => {
    itemsCtx.stockUpdateHandler(_id, -quantity);
    itemDeleteHandler(_id);
  };

  // Price for selected no. of units
  const updatedPrice = price * quantity;

  return (
    <article className="cart-item">
      <div className="product-img-container">
        <img src={`${URL}${thumbnail}`} alt={title} className="product-img" />
      </div>
      <div className="product-info">
        <h3 className="product-title">{title}</h3>
        <p className="product-description">{description}</p>
      </div>
      <form className="quantity-control-container">
        <button
          type="button"
          className="btn-decrement"
          disabled={quantity <= 1 ? true : false}
          onClick={() => quantityValidateHandler(quantity - 1)}
        >
          -
        </button>
        <input
          type="number"
          className="input-quantity"
          value={quantity}
          min="1"
          max={stock}
          onChange={(e) => {
            const enteredQuantity = Number(e.target.value);
            quantityValidateHandler(enteredQuantity);
          }}
        />
        <button
          type="button"
          className="btn-increment"
          disabled={quantity === stock ? true : false}
          onClick={() => quantityValidateHandler(quantity + 1)}
        >
          +
        </button>
        {error && (
          <p className="alert alert-danger">
            <IoAlertCircleOutline className="alert-icon" />
            <span>{error}</span>
          </p>
        )}
      </form>
      <div className="product-price-container">
        <p className="product-price">
          <span>$</span>
          {updatedPrice}
        </p>
      </div>
      <button className="btn-delete" onClick={cartItemDeleteHandler}>
        <RiDeleteBinLine className="delete-icon" />
      </button>
    </article>
  );
};

export default CartItem;
