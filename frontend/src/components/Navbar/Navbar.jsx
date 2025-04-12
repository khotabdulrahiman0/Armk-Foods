import React, { useContext, useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { StoreContext } from '../../Context/StoreContext';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import './Navbar.css';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faBasketShopping, faUser, faBagShopping, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';

const Navbar = ({ setShowLogin }) => {
  const [menu, setMenu] = useState("home");
  const [searchTerm, setSearchTerm] = useState("");
  const { getTotalCartItems, token, setToken } = useContext(StoreContext);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const path = location.pathname;
    setMenu(path === '/' ? "home" : path === '/cart' ? "cart" : path === '/myorders' ? "orders" : "home");
  }, [location]);

  const logout = () => {
    localStorage.removeItem("token");
    setToken("");
    navigate('/');
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      try {
        const response = await axios.get(`http://localhost:4000/api/food/search?name=${searchTerm}`);
        const searchResults = response.data.data;
        navigate("/search-results", { state: { searchResults } });
      } catch (error) {
        console.log("Error while searching: ", error);
      }
    }
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm py-3">
      <div className="container">
        <Link to="/" className={`navbar-brand fw-bold ${menu === "home" ? "active" : ""}`} onClick={() => setMenu("home")}>
          Armk Foods
        </Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link to="/" className={`nav-link ${menu === "home" ? "active" : ""}`} onClick={() => setMenu("home")}>
                Home
              </Link>
            </li>
            <li className="nav-item">
              <a href="#explore-menu" className={`nav-link ${menu === "menu" ? "active" : ""}`} onClick={() => setMenu("menu")}>
                Menu
              </a>
            </li>
            <li className="nav-item">
              <a href="#footer" className={`nav-link ${menu === "contact" ? "active" : ""}`} onClick={() => setMenu("contact")}>
                Contact Us
              </a>
            </li>
          </ul>
          <form className="d-flex ms-auto search-form" onSubmit={handleSearch}>
            <div className="input-group">
              <input
                className="form-control border-end-0 rounded-start"
                type="search"
                placeholder="Search for food..."
                aria-label="Search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ width: '250px' }}
              />
              <span className="input-group-text bg-white border-start-0">
                <FontAwesomeIcon icon={faSearch} />
              </span>
            </div>
            <button className="btn btn-primary ms-2" type="submit" style={{ borderRadius: '20px' }}>Search</button>
          </form>
          <div className="d-flex align-items-center ms-3">
            <Link to='/cart' className='nav-link position-relative'>
              <FontAwesomeIcon icon={faBasketShopping} className="navbar-icon" />
              {getTotalCartItems() > 0 && (
                <div className="cart-count position-absolute d-flex align-items-center justify-content-center">
                  {getTotalCartItems()}
                </div>
              )}
            </Link>
            {!token ? (
              <button className="btn btn-outline-primary ms-3" onClick={() => setShowLogin(true)} style={{ borderRadius: '20px', fontWeight: 'bold' }}>Sign In</button>
            ) : (
              <div className='navbar-profile ms-3 position-relative'>
                <FontAwesomeIcon icon={faUser} className="navbar-icon" />
                <ul className='navbar-profile-dropdown list-unstyled position-absolute'>
                  <li className="dropdown-item" onClick={() => navigate('/myorders')}>
                    <FontAwesomeIcon icon={faBagShopping} className="navbar-icon me-2" />
                    Orders
                  </li>
                  <li className="dropdown-item" onClick={logout}>
                    <FontAwesomeIcon icon={faSignOutAlt} className="navbar-icon me-2" />
                    Logout
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
