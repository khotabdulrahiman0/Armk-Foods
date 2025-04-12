import React from 'react';
import { NavLink } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const Sidebar = ({ isLoggedIn }) => {
  return (
    <div className="d-flex flex-column bg-light p-3" style={{ height: '100vh', width: '250px' }}>
      <div className="nav flex-column">
        {isLoggedIn ? (
          <>
            <NavLink 
              to="/add" 
              className={({ isActive }) => `nav-link d-flex align-items-center my-2 ${isActive ? 'active' : ''}`} 
            >
              <i className="fas fa-plus-circle" style={{ fontSize: '24px', marginRight: '10px' }}></i>
              <span>Add Items</span>
            </NavLink>
            <NavLink 
              to="/list" 
              className={({ isActive }) => `nav-link d-flex align-items-center my-2 ${isActive ? 'active' : ''}`} 
            >
              <i className="fas fa-list" style={{ fontSize: '24px', marginRight: '10px' }}></i>
              <span>List Items</span>
            </NavLink>
            <NavLink 
              to="/orders" 
              className={({ isActive }) => `nav-link d-flex align-items-center my-2 ${isActive ? 'active' : ''}`} 
            >
              <i className="fas fa-clipboard-list" style={{ fontSize: '24px', marginRight: '10px' }}></i>
              <span>Orders</span>
            </NavLink>
            <NavLink 
              to="/reports" 
              className={({ isActive }) => `nav-link d-flex align-items-center my-2 ${isActive ? 'active' : ''}`} 
            >
              <i className="fas fa-chart-line" style={{ fontSize: '24px', marginRight: '10px' }}></i>
              <span>Reports</span>
            </NavLink>
          </>
        ) : (
          <p className="text-danger">Please log in to access admin features.</p>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
