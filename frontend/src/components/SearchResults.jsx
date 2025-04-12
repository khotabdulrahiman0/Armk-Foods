import React from 'react';
import { useLocation } from 'react-router-dom';
import FoodItem from '../components/FoodItem/FoodItem'; // Import the FoodItem component
// import './SearchResults.css'; // Optional: Create a CSS file for styling.

const SearchResults = () => {
  const location = useLocation();
  const searchResults = location.state?.searchResults || [];  // Get search results from the state passed during navigation

  return (
    <div className="container mt-4">
      <h2>Search Results</h2>
      {searchResults.length > 0 ? (
        <div className="row">
          {searchResults.map((food) => (
            <div key={food._id} className="col-md-4">
              <FoodItem
                image={food.image}
                name={food.name}
                price={food.price}
                desc={food.description}
                id={food._id}
              />
            </div>
          ))}
        </div>
      ) : (
        <p>No food items found</p>
      )}
    </div>
  );
};

export default SearchResults;
