// FoodDisplay.jsx
import { useContext } from 'react';
import FoodItem from '../FoodItem/FoodItem';
import { StoreContext } from '../../Context/StoreContext';
import './FoodDisplay.css'; // Add custom CSS file for card size

const FoodDisplay = ({ category }) => {
  const { food_list } = useContext(StoreContext);

  return (
    <div className='container' id='food-display'>
      <h2 className='text-center my-4'>Best Dishes Near You</h2>
      <div className='row'>
        {food_list.map((item) => {
          if (category === "All" || category === item.category) {
            return (
              <div className='col-md-4 mb-4' key={item._id}>
                <FoodItem 
                  image={item.image} 
                  name={item.name} 
                  desc={item.description} 
                  price={item.price} 
                  id={item._id} 
                />
              </div>
            );
          }
        })}
      </div>
    </div>
  );
};

export default FoodDisplay;
