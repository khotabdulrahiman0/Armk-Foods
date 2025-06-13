# 🍽️ Food Delivery Web Application

A full-stack Food Delivery website for a single restaurant, built using the **MERN stack** (MongoDB, Express, React, Node.js). Supports real-time order placement, payment options, and admin management.

## 🚀 Features

- User registration and login (JWT-based)
- Browse food items by category
- Add to cart and update quantity
- Place orders with:
  - Cash on Delivery (COD)
  - Stripe Payment Gateway
- Order status tracking
- Email notifications on order confirmation
- Admin dashboard to:
  - View and update orders
  - Manage food items (add/edit/delete)
- Mobile-responsive UI with Bootstrap

## 🧰 Tech Stack

- **Frontend:** React.js, Axios, Bootstrap
- **Backend:** Node.js, Express.js, MongoDB
- **Authentication:** JWT, bcrypt
- **Payments:** Stripe
- **Others:** Nodemailer, Cloudinary, MongoDB Atlas

## 📷 Screenshots

_Add screenshots of homepage, cart, checkout, admin panel, etc._

## 📁 Folder Structure

Frontend/ # React frontend
Backend/ # Express backend
├── models/
├── routes/
├── controllers/
├── middleware/

## 🛠️ Installation

### 1. Clone the repository


git clone https://github.com/your-username/food-delivery-app.git
cd food-delivery-app

2. Backend Setup
cd server
npm install
# Add .env file with required keys
npm run dev

3. Frontend Setup
cd ../client
npm install
npm start

🔐 Environment Variables
Create a .env file in the backend/ folder:

MONGO_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
STRIPE_SECRET_KEY=your_stripe_key
EMAIL=your_email
EMAIL_PASSWORD=your_email_password
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

🙋‍♂️ Author
Abdul Rahiman Khot
LinkedIn • GitHub
