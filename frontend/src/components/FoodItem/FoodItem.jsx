// FoodItem.jsx
import { useContext, useState } from 'react';
import './FoodItem.css';
import { assets } from '../../assets/assets';
import { StoreContext } from '../../Context/StoreContext';

const FoodItem = ({ image, name, price, desc, id }) => {
    const [itemCount, setItemCount] = useState(0);
    const { cartItems, addToCart, removeFromCart, url, currency } = useContext(StoreContext);

    return (
        <div className='card food-item shadow-sm mb-4 d-flex flex-column'>
            <div className='position-relative food-item-img-container'>
                <img 
                    className='card-img-top food-item-image' 
                    src={url + "/images/" + image} 
                    alt={name} 
                />
                {!cartItems[id] ? (
                    <button 
                        className='position-absolute add-icon btn btn-success rounded-circle p-2' 
                        onClick={() => addToCart(id)}
                    >
                        +
                    </button>
                ) : (
                    <div className='food-item-counter d-flex justify-content-between align-items-center position-absolute'>
                        <button 
                            className='remove-icon btn btn-danger' 
                            onClick={() => removeFromCart(id)}
                        >
                            -
                        </button>
                        <p className='mb-0 px-2'>{cartItems[id]}</p>
                        <button 
                            className='add-icon btn btn-success' 
                            onClick={() => addToCart(id)}
                        >
                            +
                        </button>
                    </div>
                )}
            </div>
            <div className='card-body d-flex flex-column'>
                <div className='d-flex justify-content-between align-items-center mb-2'>
                    <h5 className='card-title mb-0 text-truncate' title={name}>{name}</h5> 
                    <img src={assets.rating_starts} alt="Rating" style={{ width: '60px' }} />
                </div>
                <p className='card-text text-muted food-item-desc mb-2 text-truncate' title={desc}>{desc}</p>
                <div className='d-flex justify-content-between align-items-center'>
                    <span className='food-item-price h5 mb-0 text-primary'>{currency}{price}</span>
                    {!cartItems[id] && (
                        <button className='btn btn-outline-primary btn-sm' onClick={() => addToCart(id)}>
                            Add to Cart
                        </button>
                    )}
                </div>  
            </div>
        </div>
    );
};

export default FoodItem;
