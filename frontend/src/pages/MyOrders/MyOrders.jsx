import { useContext, useEffect, useState } from 'react';
import './MyOrders.css';
import axios from 'axios';
import { StoreContext } from '../../Context/StoreContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBoxOpen, faCircle, faTimes } from '@fortawesome/free-solid-svg-icons';
import { toast } from 'react-toastify';

const MyOrders = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancelLoading, setCancelLoading] = useState(null);
  const { url, token, currency } = useContext(StoreContext);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await axios.post(`${url}/api/order/userorders`, {}, { headers: { token } });
      setData(response.data.data);
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast.error('Error fetching orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchOrders();
    }
  }, [token]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Delivered':
        return 'green';
      case 'Out for delivery':
        return 'orange';
      case 'Food Processing':
        return 'red';
      case 'Cancelled':
        return 'gray';
      default:
        return 'gray';
    }
  };

  const cancelOrder = async (orderId) => {
    setCancelLoading(orderId);
    try {
      const response = await axios.post(`${url}/api/order/cancel`, { orderId }, { headers: { token } });
      if (response.data.success) {
        toast.success('Order cancelled successfully');
        fetchOrders();
      } else {
        toast.error('Failed to cancel the order');
      }
    } catch (error) {
      console.error('Error cancelling order:', error);
      toast.error('Error cancelling the order');
    } finally {
      setCancelLoading(null);
    }
  };

  if (loading) {
    return (
      <div className="my-orders">
        <h2>My Orders</h2>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className='my-orders'>
      <h2>My Orders</h2>
      <div className="order-list">
        {data.length === 0 ? (
          <p>No orders found.</p>
        ) : (
          data.map((order, index) => (
            <div key={index} className='order-card'>
              <div className="order-header">
                <FontAwesomeIcon icon={faBoxOpen} className="order-icon" />
                <div className="order-details">
                  <p className="order-items">
                    {order.items.map((item, index) => (
                      index === order.items.length - 1
                        ? `${item.name} x ${item.quantity}`
                        : `${item.name} x ${item.quantity}, `
                    ))}
                  </p>
                  <p className="order-amount">{currency}{order.amount}.00</p>
                </div>
              </div>
              <p className="order-meta">
                Items: {order.items.length} | Order Date: 
                <span className="order-date">{new Date(order.date).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}</span>
              </p>
              <div className="order-status">
                <FontAwesomeIcon 
                  icon={faCircle} 
                  className="status-icon" 
                  style={{ color: getStatusColor(order.status) }} 
                /> 
                <b>{order.status}</b>
              </div>
              {order.status !== 'Delivered' && order.status !== 'Cancelled' && (
                <button 
                  className="btn btn-danger cancel-button" 
                  onClick={() => cancelOrder(order._id)}
                  disabled={cancelLoading === order._id}
                >
                  {cancelLoading === order._id ? (
                    <div className="spinner-border text-light" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                  ) : (
                    <>
                      <FontAwesomeIcon icon={faTimes} /> Cancel Order
                    </>
                  )}
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default MyOrders;
