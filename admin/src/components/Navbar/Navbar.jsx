import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import './Navbar.css'; // Optional for custom styles
import 'bootstrap/dist/css/bootstrap.min.css';

const Navbar = ({ setIsLoggedIn }) => {
  const [data, setData] = useState({ email: "", password: "" });
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const navigate = useNavigate(); // Initialize useNavigate

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
    }
  }, [setIsLoggedIn]);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:4000/api/admin/login', data);
      if (response.data.success) {
        localStorage.setItem("token", response.data.token);
        setIsLoggedIn(true);
        setShowAdminLogin(false);
        toast.success("Login successful!");
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    toast.success("Logout successful!", {
      icon: false, 
    });
    
    navigate('/'); 
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container-fluid">
        <span className="navbar-brand mb-0 h1">Fast Foods - Admin Panel</span>
        <div className="d-flex align-items-center">
          {showAdminLogin ? (
            <form className="d-flex" onSubmit={handleLogin}>
              <input
                type="email"
                placeholder="Email"
                required
                className="form-control me-2"
                value={data.email}
                onChange={e => setData({ ...data, email: e.target.value })}
              />
              <input
                type="password"
                placeholder="Password"
                required
                className="form-control me-2"
                value={data.password}
                onChange={e => setData({ ...data, password: e.target.value })}
              />
              <button type="submit" className="btn btn-primary me-2">Login</button>
              <button type="button" className="btn btn-secondary" onClick={() => setShowAdminLogin(false)}>Cancel</button>
            </form>
          ) : (
            <>
              {localStorage.getItem("token") ? (
                <button className="btn btn-danger" onClick={handleLogout}>Logout</button>
              ) : (
                <button className="btn btn-primary" onClick={() => setShowAdminLogin(true)}>Login</button>
              )}
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
