import React, { useContext } from 'react';
import './Cart.css';
import { StoreContext } from '../../Context/StoreContext';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';

const Cart = () => {
  const {
    cartItems,
    food_list,
    removeFromCart,
    getTotalCartAmount,
    url,
    currency,
    deliveryCharge,
    loading
  } = useContext(StoreContext);
  const navigate = useNavigate();

  if (loading) return <div className="loading">Loading...</div>;

  const cartItemsList = food_list.filter(item => cartItems[item._id] > 0);

  return (
    <div className='cart'>
      <h1 className="cart-title">Your Cart</h1>
      {cartItemsList.length === 0 ? (
        <div className="cart-empty">Your cart is empty</div>
      ) : (
        <>
          <div className="cart-items">
            {cartItemsList.map((item) => (
              <div key={item._id} className='cart-item'>
                <img src={`${url}/images/${item.image}`} alt={item.name} className='cart-item-image' />
                <div className="cart-item-details">
                  <h3>{item.name}</h3>
                  <p className="cart-item-price">{currency}{item.price}</p>
                  <div className="cart-item-quantity">
                    <span>Qty: {cartItems[item._id]}</span>
                  </div>
                  <p className="cart-item-total">{currency}{item.price * cartItems[item._id]}</p>
                </div>
                <button className='cart-item-remove' onClick={() => removeFromCart(item._id)}>
                  <FontAwesomeIcon icon={faTrash} />
                </button>
              </div>
            ))}
          </div>
          <div className="cart-summary">
            <h2>Order Summary</h2>
            <div className="cart-total-details">
              <p>Subtotal</p>
              <p>{currency}{getTotalCartAmount()}</p>
            </div>
            <div className="cart-total-details">
              <p>Delivery Fee</p>
              <p>{currency}{getTotalCartAmount() === 0 ? 0 : deliveryCharge}</p>
            </div>
            <div className="cart-total-details total">
              <b>Total</b>
              <b>{currency}{getTotalCartAmount() === 0 ? 0 : getTotalCartAmount() + deliveryCharge}</b>
            </div>
            <button className="btn btn-checkout" onClick={() => navigate('/order')}>Proceed to Checkout</button>
          </div>
        </>
      )}
    </div>
  );
}

export default Cart;