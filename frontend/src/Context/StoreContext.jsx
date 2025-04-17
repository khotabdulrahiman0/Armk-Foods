import { createContext, useEffect, useState } from "react";
import axios from "axios";
import { menu_list } from "../assets/assets"; // Assuming this is a static list

export const StoreContext = createContext(null);

const StoreContextProvider = (props) => {
  const url = "https://armk-foods-backend.onrender.com";
  const [food_list, setFoodList] = useState([]); // This will be fetched from the server
  const [cartItems, setCartItems] = useState({});
  const [token, setToken] = useState("");
  const currency = "₹";
  const deliveryCharge = 40;

  // Add an item to the cart
  const addToCart = async (itemId) => {
    setCartItems((prev) => {
      const newCartItems = { ...prev, [itemId]: (prev[itemId] || 0) + 1 };
      if (token) {
        axios
          .post(
            `${url}/api/cart/add`,
            { itemId },
            { headers: { token } }
          )
          .catch((error) => console.error("Failed to add to cart", error));
      }
      return newCartItems;
    });
  };

  // Remove an item from the cart
  const removeFromCart = async (itemId) => {
    setCartItems((prev) => {
      const newCartItems = { ...prev };
      if (newCartItems[itemId] > 1) {
        newCartItems[itemId] -= 1;
      } else {
        delete newCartItems[itemId];
      }
      if (token) {
        axios
          .post(
            `${url}/api/cart/remove`,
            { itemId },
            { headers: { token } }
          )
          .catch((error) => console.error("Failed to remove from cart", error));
      }
      return newCartItems;
    });
  };

  // Calculate total amount in the cart
  const getTotalCartAmount = () => {
    let totalAmount = 0;
    for (const item in cartItems) {
      try {
        if (cartItems[item] > 0) {
          const itemInfo = food_list.find((product) => product._id === item);
          if (itemInfo) {
            totalAmount += itemInfo.price * cartItems[item];
          }
        }
      } catch (error) {
        console.error("Error calculating total cart amount", error);
      }
    }
    return totalAmount;
  };

  // Fetch the food list from the server
  const fetchFoodList = async () => {
    try {
      const response = await axios.get(`${url}/api/food/list`);
      setFoodList(response.data.data || []);
    } catch (error) {
      console.error("Failed to fetch food list", error);
    }
  };

  // Load cart data from the server
  const loadCartData = async (token) => {
    try {
      const response = await axios.post(
        `${url}/api/cart/get`,
        {},
        { headers: { token } }
      );
      setCartItems(response.data.cartData || {});
    } catch (error) {
      console.error("Failed to load cart data", error);
    }
  };

  // Calculate total number of items in the cart
  const getTotalCartItems = () => {
    return Object.values(cartItems).reduce((total, quantity) => total + quantity, 0);
  };

  // Load data on component mount
  useEffect(() => {
    const loadData = async () => {
      try {
        await fetchFoodList();
        const storedToken = localStorage.getItem("token");
        if (storedToken) {
          setToken(storedToken);
          await loadCartData(storedToken);
        }
      } catch (error) {
        console.error("Failed to load initial data", error);
      }
    };
    loadData();
  }, []);

  const contextValue = {
    url,
    food_list,
    menu_list, // Static list used in the component
    cartItems,
    addToCart,
    removeFromCart,
    getTotalCartAmount,
    getTotalCartItems,
    token,
    setToken,
    currency,
    deliveryCharge,
    loadCartData, // Ensure this is available in context
  };

  return (
    <StoreContext.Provider value={contextValue}>
      {props.children}
    </StoreContext.Provider>
  );
};

export default StoreContextProvider;
