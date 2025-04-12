import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar/Navbar';
import Sidebar from './components/Sidebar/Sidebar';
import { Navigate, Route, Routes } from 'react-router-dom';
import Add from './pages/Add/Add';
import List from './pages/List/List';
import Orders from './pages/Orders/Orders';
import AdminHome from './pages/AdminHome';
import PrivateRoute from './components/PrivateRoute/PrivateRoute'; 
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Report from './pages/Report/Report';

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token); 
  }, []);

  return (
    <div className='app'>
      <ToastContainer />
      <Navbar setIsLoggedIn={setIsLoggedIn} />
      <hr />
      <div className="app-content">
        <Sidebar isLoggedIn={isLoggedIn} />
        <Routes>
          <Route path="/" element={<AdminHome />} />
          <Route element={<PrivateRoute isLoggedIn={isLoggedIn} />}>
            <Route path="/add" element={<Add />} />
            <Route path="/list" element={<List />} />
            <Route path="/orders" element={<Orders />} />
            <Route path='/reports' element={<Report/>} />
          </Route>
          <Route path="*" element={<Navigate to="/" />} /> 
        </Routes>
      </div>
    </div>
  );
}

export default App;
