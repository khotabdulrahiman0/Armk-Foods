import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { url, currency } from '../../assets/assets';
import { toast } from 'react-toastify';
import 'bootstrap/dist/css/bootstrap.min.css';
import './List.css'; 

const List = () => {
  const [list, setList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(4);
  const [totalItems, setTotalItems] = useState(0);

  const fetchList = async () => {
    try {
      const response = await axios.get(`${url}/api/food/list`);
      if (response.data.success) {
        setList(response.data.data);
        setTotalItems(response.data.data.length);
      } else {
        toast.error("Error fetching list");
      }
    } catch (error) {
      toast.error("Error fetching list");
    }
  };

  const removeFood = async (foodId) => {
    try {
      const response = await axios.post(`${url}/api/food/remove`, {
        id: foodId
      });
      await fetchList();
      if (response.data.success) {
        toast.success(response.data.message);
      } else {
        toast.error("Error removing food");
      }
    } catch (error) {
      toast.error("Error removing food");
    }
  };

  useEffect(() => {
    fetchList();
  }, []);

  // Pagination calculations
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = list.slice(indexOfFirstItem, indexOfLastItem);

  // Page change handlers
  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handlePageSizeChange = (event) => {
    setItemsPerPage(Number(event.target.value));
    setCurrentPage(1); 
  };

  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold">All Foods List</h2>
        <div className="d-flex align-items-center gap-2">
          <label htmlFor="pageSize" className="me-2">Items per page:</label>
          <select
            id="pageSize"
            className="form-select form-select-sm w-auto"
            value={itemsPerPage}
            onChange={handlePageSizeChange}
          >
            {Array.from({ length: 8 }, (_, index) => index + 3).map((value) => (
              <option key={value} value={value}>
                {value}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="table-responsive shadow-sm rounded">
        <table className="table table-bordered table-striped table-hover">
          <thead className="bg-primary text-white">
            <tr>
              <th className="text-center">Image</th>
              <th>Name</th>
              <th>Category</th>
              <th>Price</th>
              <th className="text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.map((item, index) => (
              <tr key={index}>
                <td className="text-center">
                  <img
                    src={`${url}/images/${item.image}`}
                    alt={item.name}
                    className="img-thumbnail rounded"
                    style={{ width: '80px', height: '80px', objectFit: 'cover' }}
                  />
                </td>
                <td className="align-middle">{item.name}</td>
                <td className="align-middle">{item.category}</td>
                <td className="align-middle">{currency}{item.price}</td>
                <td className="text-center align-middle">
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => removeFood(item._id)}
                    aria-label="Remove food"
                  >
                    <i className="fas fa-trash"></i> Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="d-flex justify-content-between align-items-center mt-4">
        <div className="text-muted">
          Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, totalItems)} of {totalItems} items
        </div>
        <div className="d-flex gap-2">
          <button
            className="btn btn-outline-primary"
            onClick={handlePrevPage}
            disabled={currentPage === 1}
          >
            <i className="fas fa-chevron-left"></i>
          </button>
          <span className="btn btn-outline-secondary">
            Page {currentPage} of {totalPages}
          </span>
          <button
            className="btn btn-outline-primary"
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
          >
            <i className="fas fa-chevron-right"></i>
          </button>
        </div>
      </div>
    </div>
  );
};

export default List;
