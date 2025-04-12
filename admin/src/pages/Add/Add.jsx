import { useState } from 'react';
import './Add.css';
import { url } from '../../assets/assets'; // No need for assets.upload_area
import axios from 'axios';
import { toast } from 'react-toastify';
import 'bootstrap/dist/css/bootstrap.min.css';

const Add = () => {
    const [data, setData] = useState({
        name: "",
        description: "",
        price: "",
        category: "Salad",
        image: null // Store image in the data state
    });

    const onSubmitHandler = async (event) => {
        event.preventDefault();

        if (!data.image) {
            toast.error('Image not selected');
            return null;
        }

        const formData = new FormData();
        formData.append("name", data.name);
        formData.append("description", data.description);
        formData.append("price", Number(data.price));
        formData.append("category", data.category);
        formData.append("image", data.image);
        
        try {
            const response = await axios.post(`${url}/api/food/add`, formData);
            if (response.data.success) {
                toast.success(response.data.message);
                setData({
                    name: "",
                    description: "",
                    price: "",
                    category: data.category,
                    image: null
                });
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            toast.error('An error occurred while adding the product.');
        }
    };

    const onChangeHandler = (event) => {
        const { name, value, files } = event.target;
        if (name === "image") {
            setData(data => ({ ...data, image: files[0] }));
        } else {
            setData(data => ({ ...data, [name]: value }));
        }
    };

    return (
        <div className="container mt-5">
            <form className="card p-4 shadow-sm" onSubmit={onSubmitHandler}>
                <div className="mb-3">
                    <label className="form-label" htmlFor="image">Upload Image</label>
                    <input
                        type="file"
                        accept="image/*"
                        id="image"
                        name="image"
                        onChange={onChangeHandler}
                        className="form-control"
                        required
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label" htmlFor="name">Product Name</label>
                    <input
                        id="name"
                        name="name"
                        onChange={onChangeHandler}
                        value={data.name}
                        type="text"
                        className="form-control"
                        placeholder="Type here"
                        required
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label" htmlFor="description">Product Description</label>
                    <textarea
                        id="description"
                        name="description"
                        onChange={onChangeHandler}
                        value={data.description}
                        className="form-control"
                        rows={6}
                        placeholder="Write content here"
                        required
                    />
                </div>
                <div className="row mb-4">
                    <div className="col-md-6 mb-3 mb-md-0">
                        <label className="form-label" htmlFor="category">Product Category</label>
                        <select
                            id="category"
                            name="category"
                            onChange={onChangeHandler}
                            value={data.category}
                            className="form-select"
                        >
                            <option value="Salad">Salad</option>
                            <option value="Rolls">Rolls</option>
                            <option value="Deserts">Deserts</option>
                            <option value="Sandwich">Sandwich</option>
                            <option value="Cake">Cake</option>
                            <option value="Pure Veg">Pure Veg</option>
                            <option value="Pasta">Pasta</option>
                            <option value="Noodles">Noodles</option>
                            <option value="Non-Veg">Non-Veg</option>
                            <option value="Pizza">Pizza</option>
                            <option value="Burger">Burger</option>
                            <option value="Soup">Soup</option>
                            <option value="Beverages">Beverages</option>
                            <option value="Main Course">Main Course</option>
                        </select>
                    </div>
                    <div className="col-md-6">
                        <label className="form-label" htmlFor="price">Product Price</label>
                        <input
                            id="price"
                            name="price"
                            onChange={onChangeHandler}
                            value={data.price}
                            type="number"
                            className="form-control"
                            placeholder="Enter price"
                            required
                        />
                    </div>
                </div>
                <button type="submit" className="btn btn-primary w-100">ADD</button>
            </form>
        </div>
    );
};

export default Add;
