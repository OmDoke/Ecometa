Ecometa: A Waste Management Initiative

Introduction

Ecometa is a web-based platform designed to promote sustainable waste management by connecting individuals and businesses with recyclers. It functions as an online marketplace where users can buy, sell, and recycle e-waste and scrap materials. The platform ensures responsible waste disposal while encouraging a circular economy.

Tech Stack

Frontend: React.js (Axios for API calls, React Router for navigation)

Backend: Spring Boot (Spring MVC, Spring Data JPA, REST API)

Database: MySQL

Features

User Authentication & Role-Based Access: Signup/Login with different roles (Admin, Recycler Buyer, Recycler Seller)

Product Listing: Users can add e-waste products for sale

Recycler Management: Recyclers can register and list their services

Region-Based Product Filtering: Buyers see only products available in their region

Order Processing: Buyers can purchase products, and sellers can track sales

Admin Dashboard: View recycler details, seller details, and process orders

Logout Functionality: Secure user session management

Installation & Setup

Prerequisites

Node.js (for frontend)

Java JDK 17+ (for Spring Boot backend)

MySQL Server (for database storage)

Maven (for backend dependency management)

Steps to Run the Project

1. Clone the Repository

 git clone https://github.com/your-repo/ecometa.git
 cd ecometa

2. Set Up the Backend (Spring Boot)

 cd backend
 mvn clean install
 mvn spring-boot:run

Make sure MySQL is running, and update the application.properties file with your database credentials.

3. Set Up the Frontend (React.js)

 cd frontend
 npm install
 npm start

Database Schema

Tables Used

User Table (Stores user details)

Product Table (Stores product listings)

Recycler Details Table (Stores recycler shop information)

API Endpoints

User Management

POST /api/auth/signup → Register a new user

POST /api/auth/login → Authenticate user and generate token

Product Management

GET /api/products → Fetch all products

POST /api/products → Add a new product (Seller only)

GET /api/products/{region} → Get products based on region

Order & Recycling Management

POST /api/orders → Place an order

GET /api/orders/{userId} → Get order history

POST /api/recycle → Mark an item for recycling

Future Enhancements

Payment Integration (Razorpay/Stripe)

Live Chat Support for buyers and recyclers

AI-based Waste Categorization

Contributors

Onkar Doke (Backend & Database Design)

Ankit Dovkar (Backend Developer)

Aditya Patil (Frontend Developer)

Swanand Nene (Frontend Developer)

License



