import { useEffect, useState } from 'react';
import './Orders.css';
import { toast } from 'react-toastify';
import axios from 'axios';
import { url, currency } from '../../assets/assets';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBox } from '@fortawesome/free-solid-svg-icons'; // Import the box icon
import 'bootstrap/dist/css/bootstrap.min.css';

const Order = () => {
  const [orders, setOrders] = useState([]);
  const [loadingOrderId, setLoadingOrderId] = useState(null);
  const [loading, setLoading] = useState(true); // Add loading state

  const fetchAllOrders = async () => {
    try {
      const response = await axios.get(`${url}/api/order/list`);
      if (response.data.success) {
        setOrders(response.data.data.reverse());
      } else {
        toast.error('Error fetching orders');
      }
    } catch (error) {
      toast.error('An error occurred while fetching orders');
    } finally {
      setLoading(false); // Set loading to false after fetching
    }
  };

  const statusHandler = async (event, orderId) => {
    setLoadingOrderId(orderId);
    try {
      const response = await axios.post(`${url}/api/order/status`, {
        orderId,
        status: event.target.value,
      });
      if (response.data.success) {
        await fetchAllOrders();
        toast.success('Order status updated successfully');
      }
    } catch (error) {
      toast.error('An error occurred while updating order status');
    } finally {
      setLoadingOrderId(null);
    }
  };

  useEffect(() => {
    fetchAllOrders();
  }, []);

  if (loading) {
    // Show loading spinner while fetching orders
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <h3 className="mb-4 text-center">Order Management</h3>
      <div className="row g-4">
        {orders.map((order, index) => (
          <div key={index} className="col-sm-12 col-md-6 col-lg-4">
            <div className="card h-100 shadow-sm">
              <div className="card-body d-flex flex-column">
                <div className="d-flex align-items-start mb-3">
                  <FontAwesomeIcon icon={faBox} className="me-3" style={{ fontSize: '50px' }} />
                  <div>
                    <h6 className="card-title mb-1">
                      {order.items.map((item, idx) => (
                        <span key={idx}>
                          {item.name} x {item.quantity}
                          {idx < order.items.length - 1 && ', '}
                        </span>
                      ))}
                    </h6>
                    <p className="text-muted mb-1">{order.address.firstName} {order.address.lastName}</p>
                    <p className="small text-muted mb-0">{order.address.street}, {order.address.city}, {order.address.state}, {order.address.country} - {order.address.zipcode}</p>
                    <p className="small text-muted mb-0">Phone: {order.address.phone}</p>
                    <p className="small text-muted mb-0">Email: {order.address.email}</p> {/* Added email here */}
                    <p className="small text-muted mb-0">
                      Order Date: {new Date(order.date).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}
                    </p>
                  </div>
                </div>
                <div className="d-flex justify-content-between mb-3">
                  <span className="badge bg-primary">Items: {order.items.length}</span>
                  <span className="badge bg-success">{currency}{order.amount}</span>
                </div>
                <div className="mb-3">
                  <span className="badge bg-info">Payment Type: {order.paymentType}</span>
                </div>

                <div className="position-relative">
                  <select
                    onChange={(e) => statusHandler(e, order._id)}
                    value={order.status}
                    className="form-select mt-auto"
                    aria-label="Order Status"
                    disabled={order.status === 'Delivered' || order.status === 'Cancelled' || loadingOrderId === order._id} 
                  >
                    <option value="Food Processing">Food Processing</option>
                    <option value="Out for delivery">Out for delivery</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>

                  {loadingOrderId === order._id && (
                    <div className="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center">
                      <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                      </div>
                    </div>
                  )}
                </div>

                {(order.status === 'Delivered' || order.status === 'Cancelled') && (
                  <p className="mt-2 text-danger text-center">
                    Order {order.status === 'Delivered' ? 'delivered' : 'cancelled'} 
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Order;
