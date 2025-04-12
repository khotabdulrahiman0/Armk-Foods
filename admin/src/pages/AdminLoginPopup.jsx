import React, { useEffect } from 'react';
import { toast } from 'react-toastify';
import 'bootstrap/dist/css/bootstrap.min.css';
// import './LoginPopup.css'; // Ensure you have this for custom styles

const AdminLoginPopup = ({ setShowAdminLogin, data, setData, handleLogin }) => {
  useEffect(() => {
    // Optionally handle transitions or other effects
  }, []);

  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setData(prevData => ({ ...prevData, [name]: value }));
  };

  return (
    <div className="login-popup-overlay">
      <div className="login-popup container p-4 rounded shadow-lg">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="mb-0">Login</h2>
          <button type="button" className="btn-close" onClick={() => setShowAdminLogin(false)}></button>
        </div>
        <form onSubmit={handleLogin}>
          <div className="mb-3">
            <input
              name="email"
              onChange={onChangeHandler}
              value={data.email}
              type="email"
              className="form-control"
              placeholder="Your email"
              required
            />
          </div>
          <div className="mb-4">
            <input
              name="password"
              onChange={onChangeHandler}
              value={data.password}
              type="password"
              className="form-control"
              placeholder="Password"
              required
            />
          </div>
          <button type="submit" className="btn btn-primary w-100 mb-3">Login</button>
        </form>
      </div>
    </div>
  );
};

export default AdminLoginPopup;
