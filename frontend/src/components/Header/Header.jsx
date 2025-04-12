// Header.jsx
import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Header.css';

const Header = () => {
    return (
        <header className="header">
            <div className="header-contents">
                <h2>Discover Your Next Favorite Meal</h2>
                <p>Explore our extensive menu filled with a variety of mouthwatering dishes. At Armk Foods, we are committed to delivering top-notch quality and flavor to enhance your dining experience.</p>
                <a href="#food-display" className="btn btn-light">Explore Foods</a>
            </div>
        </header>
    );
};

export default Header;
