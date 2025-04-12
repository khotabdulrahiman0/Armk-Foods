import { useContext, useEffect, useState } from 'react';
import './PlaceOrder.css';
import { StoreContext } from '../../Context/StoreContext';
import { assets } from '../../assets/assets';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';

const PlaceOrder = () => {
    const [payment, setPayment] = useState("cod");
    const [data, setData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        street: "",
        city: "Dapoli",
        state: "maharashtra",
        zipcode: "415712",
        country: "India",
        phone: ""
    });
    const [loading, setLoading] = useState(false); 

    const { getTotalCartAmount, token, food_list, cartItems, url, setCartItems, currency, deliveryCharge } = useContext(StoreContext);

    const navigate = useNavigate();

    const onChangeHandler = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setData(data => ({ ...data, [name]: value }));
    };

    const placeOrder = async (e) => {
        e.preventDefault();
        setLoading(true); // Set loading to true when the order starts processing
        let orderItems = [];
        food_list.map((item) => {
            if (cartItems[item._id] > 0) {
                let itemInfo = item;
                itemInfo["quantity"] = cartItems[item._id];
                orderItems.push(itemInfo);
            }
        });
        
        let orderData = {
            address: data,
            items: orderItems,
            amount: getTotalCartAmount() + deliveryCharge,
        };

        try {
            let response;
            if (payment === "stripe") {
                response = await axios.post(url + "/api/order/place", orderData, { headers: { token } });
                if (response.data.success) {
                    const { session_url } = response.data;
                    window.location.replace(session_url);
                }
            } else {
                response = await axios.post(url + "/api/order/placecod", orderData, { headers: { token } });
                if (response.data.success) {
                    navigate("/myorders");
                    toast.success(response.data.message);
                    setCartItems({});
                }
            }

            if (!response.data.success) {
                toast.error("Something Went Wrong");
            }
        } catch (error) {
            toast.error("Something Went Wrong");
        } finally {
            setLoading(false); // Set loading to false when the order process finishes
        }
    };

    useEffect(() => {
        if (!token) {
            toast.error("To place an order, sign in first");
            navigate('/cart');
        } else if (getTotalCartAmount() === 0) {
            navigate('/cart');
        }
    }, [token]);

    return (
        <form onSubmit={placeOrder} className='place-order'>
            <div className="place-order-left">
                <p className='title'>Delivery Information</p>
                <div className="multi-field">
                    <input type="text" name='firstName' onChange={onChangeHandler} value={data.firstName} placeholder='First name' required />
                    <input type="text" name='lastName' onChange={onChangeHandler} value={data.lastName} placeholder='Last name' required />
                </div>
                <input type="email" name='email' onChange={onChangeHandler} value={data.email} placeholder='Email address' required />
                <input type="text" name='street' onChange={onChangeHandler} value={data.street} placeholder='Street' required />
                <div className="multi-field">
                <input type="text" name='city' value="Dapoli" readOnly placeholder='City' required /> 
                <input type="text" name='state' value="Maharashtra" readOnly placeholder='State' required /> {/* State fixed to Maharashtra */}
                </div>
                <div className="multi-field">
                <input type="text" name='zipcode' value="415712" readOnly placeholder='Zip code' required /> {/* Zip code fixed to 415712 */}
                <input type="text" name='country' value="India" readOnly placeholder='Country' required /> {/* Country fixed to India */}
                </div>
                <input type="text" name='phone' onChange={onChangeHandler} value={data.phone} placeholder='Phone' required />
            </div>
            <div className="place-order-right">
                <div className="cart-total">
                    <h2>Cart Totals</h2>
                    <div>
                        <div className="cart-total-details"><p>Subtotal</p><p>{currency}{getTotalCartAmount()}</p></div>
                        <hr />
                        <div className="cart-total-details"><p>Delivery Fee</p><p>{currency}{getTotalCartAmount() === 0 ? 0 : deliveryCharge}</p></div>
                        <hr />
                        <div className="cart-total-details"><b>Total</b><b>{currency}{getTotalCartAmount() === 0 ? 0 : getTotalCartAmount() + deliveryCharge}</b></div>
                    </div>
                </div>
                <div className="payment">
                    <h2>Payment Method</h2>
                    <div onClick={() => setPayment("cod")} className="payment-option">
                        <img src={payment === "cod" ? assets.checked : assets.un_checked} alt="" />
                        <p>COD ( Cash on delivery )</p>
                    </div>
                    <div onClick={() => setPayment("stripe")} className="payment-option">
                        <img src={payment === "stripe" ? assets.checked : assets.un_checked} alt="" />
                        <p>Stripe ( Credit / Debit )</p>
                    </div>
                </div>
                {/* Loading spinner or disabled button while placing order */}
                <button className='place-order-submit' type='submit' disabled={loading}>
                    {loading ? (
                        <div className="spinner-border text-light" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                    ) : (
                        payment === "cod" ? "Place Order" : "Proceed To Payment"
                    )}
                </button>
            </div>
        </form>
    )
}

export default PlaceOrder;
