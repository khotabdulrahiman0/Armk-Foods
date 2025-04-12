import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArchive, faBox, faClipboardCheck, faGift, faMoneyBill, faShoppingBasket } from '@fortawesome/free-solid-svg-icons'; // Import the money bill icon
import axios from 'axios';
import './Report.css'; // Import custom CSS for additional styles

const Report = () => {
  const [totalDelivered, setTotalDelivered] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReportData = async () => {
      try {
        const response = await axios.get('http://localhost:4000/api/order/report', {
          headers: {
            'Content-Type': 'application/json',
            // Add authorization header if needed
            // 'Authorization': `Bearer ${yourToken}`,
          },
        });

        if (response.data.success) {
          setTotalDelivered(response.data.data.totalItems);
          setTotalAmount(response.data.data.totalAmount);
        } else {
          throw new Error(response.data.message);
        }
      } catch (err) {
        setError(err.message || 'Error fetching report data');
      } finally {
        setLoading(false);
      }
    };

    fetchReportData();
  }, []);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger text-center" role="alert">
        {error}
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <h3 className="mb-4 text-center report-title">Report Summary</h3>
      <div className="card report-card shadow-sm border-0 rounded">
        <div className="card-body">
          <div className="row">
            <div className="col-md-6 mb-3">
              <div className="d-flex align-items-center report-item p-3 rounded">
                <FontAwesomeIcon icon={faClipboardCheck} className="report-icon me-3" />
                <div>
                  <h5 className="fw-bold">Total Orders Successfully Delivered:</h5>
                  <p className="h2">{totalDelivered}</p>
                </div>
              </div>
            </div>
            <div className="col-md-6 mb-3">
              <div className="d-flex align-items-center report-item p-3 rounded">
                <FontAwesomeIcon icon={faMoneyBill} className="report-icon me-3" /> {/* Money icon added */}
                <div>
                  <h5 className="fw-bold">Total Amount Received:</h5>
                  <p className="h2">₹{totalAmount.toFixed(2)}</p> {/* Use INR symbol here */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Report;
