import React, { useContext } from 'react';
import { StoreContext } from '../../Context/StoreContext';
import 'bootstrap/dist/css/bootstrap.min.css';
import './ExploreMenu.css';

const ExploreMenu = ({ category, setCategory }) => {
  const { menu_list } = useContext(StoreContext);

  if (!menu_list) {
    return <div className='text-center my-5'>Loading menu...</div>;
  }

  if (menu_list.length === 0) {
    return <div className='text-center my-5'>No menu items available.</div>;
  }

  return (
    <div className='container my-5'>
      <h1 className='text-center mb-4'>Explore Our Menu</h1>
      <p className='text-center mb-4'>
        Choose from a diverse menu featuring a delectable array of dishes. Our mission is to satisfy your cravings and elevate your dining experience, one delicious meal at a time.
      </p>
      <div className='d-flex justify-content-center flex-wrap'>
        {menu_list.map((item, index) => (
          <div
            key={index}
            className={`menu-item mx-3 ${category === item.menu_name ? 'active' : ''}`}
            onClick={() => setCategory(prev => prev === item.menu_name ? 'All' : item.menu_name)}
          >
            <div className={`card border-0 shadow-sm ${category === item.menu_name ? 'active-card' : ''}`}>
              <img src={item.menu_image} className='card-img-top' alt={item.menu_name} />
              <div className='card-body text-center'>
                <p className='card-text'>{item.menu_name}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
      <hr />
    </div>
  );
};

export default ExploreMenu;
