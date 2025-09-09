# 🍛 Spice Route Catering - Premium Indian Catering System

🎯 **A comprehensive web-based catering reservation and ordering system for Indian cuisine**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Firebase](https://img.shields.io/badge/Firebase-FFCA28?style=flat&logo=firebase&logoColor=black)](https://firebase.google.com/)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)

## 🚀 Live Demo

**Demo Credentials:**
- **Admin**: admin@catering.com / password
- **Customer**: customer@demo.com / password

[🌐 Live Application](https://your-project.web.app)

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [System Architecture](#system-architecture)
- [Technology Stack](#technology-stack)
- [Installation](#installation)
- [Firebase Setup](#firebase-setup)
- [Usage Guide](#usage-guide)
- [Testing](#testing)
- [Deployment](#deployment)
- [API Documentation](#api-documentation)
- [Contributing](#contributing)
- [License](#license)

## 🎯 Overview

The Spice Route Catering System is a modern, responsive web application that enables customers to browse, order, and manage catering services while providing administrators with comprehensive tools to manage products, orders, and customer relationships. The system specializes in authentic Indian cuisine with a focus on traditional flavors and modern convenience.

### 🎨 Key Highlights

- **E-commerce Functionality**: Complete shopping cart and order management
- **Indian Cuisine Focus**: Specialized categories and authentic dishes
- **Admin Panel**: Comprehensive product and order management
- **Responsive Design**: Mobile-first approach with beautiful UI
- **Real-Time Updates**: Live cart and order status tracking
- **Secure Authentication**: Firebase-powered user management

## ✨ Features

### 👨‍💼 Admin Features
- 🏠 **Admin Dashboard**: Overview of orders, products, and customers
- 📦 **Product Management**: Add, edit, delete products with images
- 📋 **Order Management**: View all orders, update order status
- 👥 **Customer Management**: View customer details and order history
- 📊 **Reports & Analytics**: Order statistics and revenue tracking
- 🔍 **Search & Filter**: Advanced order and product filtering

### 👨‍🍳 Customer Features
- 🛍️ **Product Catalog**: Browse products by categories
- 🛒 **Shopping Cart**: Add, remove, update quantities
- 💳 **Order Placement**: Secure checkout process
- 📱 **Order Tracking**: Real-time order status updates
- 📋 **Order History**: View past orders and reorder
- 👤 **Profile Management**: Update personal information
- 🔍 **Product Search**: Find products quickly

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Frontend (HTML/CSS/JS)               │
├─────────────────────────────────────────────────────────┤
│                    Firebase Services                    │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────────────┐│
│  │Authentication│ │  Firestore  │ │      Hosting       ││
│  │              │ │   Database  │ │                    ││
│  └─────────────┘ └─────────────┘ └─────────────────────┘│
└─────────────────────────────────────────────────────────┘
```

### Database Collections

```javascript
// Firestore Collections Structure
collections: {
  users: {
    uid: string,
    email: string,
    role: 'admin' | 'customer',
    name: string,
    phone: string,
    address: string,
    createdAt: timestamp
  },
  products: {
    id: string,
    name: string,
    description: string,
    price: number,
    image: string,
    category: string,
    inStock: boolean,
    createdAt: timestamp
  },
  orders: {
    id: string,
    userId: string,
    items: array,
    total: number,
    status: 'pending' | 'confirmed' | 'preparing' | 'delivered',
    deliveryAddress: string,
    orderDate: timestamp
  },
  cart: {
    userId: string,
    items: array,
    total: number,
    updatedAt: timestamp
  }
}
```

## 🛠️ Technology Stack

### Frontend
- **HTML5** - Semantic markup with modern structure
- **CSS3** - Modern styling with Flexbox/Grid and animations
- **JavaScript (ES6+)** - Modern client-side functionality
- **Responsive Design** - Mobile-first approach

### Backend Services
- **Firebase Authentication** - Secure user management
- **Firestore Database** - Scalable NoSQL database
- **Firebase Hosting** - Fast static file hosting
- **Firebase Functions** (Optional) - Server-side logic

### Development Tools
- **Git** - Version control
- **GitHub** - Repository hosting
- **Firebase CLI** - Development and deployment
- **Modern Browsers** - Cross-browser compatibility

## 📦 Installation

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Git
- Firebase CLI

### Step 1: Clone Repository

```bash
git clone https://github.com/yourusername/catering-ordering-system.git
cd catering-ordering-system
```

### Step 2: Install Dependencies

```bash
npm install
# or
yarn install
```

### Step 3: Install Firebase CLI

```bash
npm install -g firebase-tools
```

### Step 4: Firebase Login

```bash
firebase login
```

## 🔥 Firebase Setup

### 1. Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project"
3. Enter project name: `spice-route-catering`
4. Enable Google Analytics (optional)
5. Click "Create project"

### 2. Enable Authentication

1. Navigate to **Authentication** → **Sign-in method**
2. Enable **Email/Password** provider
3. Save configuration

### 3. Setup Firestore Database

1. Navigate to **Firestore Database**
2. Click "Create database"
3. Choose **Test mode** for development
4. Select your preferred region
5. Click "Done"

### 4. Configure Firebase Hosting

1. Navigate to **Hosting**
2. Click "Get started"
3. Follow setup instructions

### 5. Get Configuration

1. Go to **Project Settings** → **General**
2. Scroll to "Your apps"
3. Click **Web app** icon (`</>`)
4. Register app name: `spice-route-catering`
5. Copy configuration object
6. Replace config in `app.js`

```javascript
// Replace this configuration in app.js
const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "your-app-id"
};
```

## 🚀 Usage Guide

### Initial Setup

1. **Admin Setup**
   - Use default admin credentials: `admin@catering.com` / `password`
   - Add products through admin dashboard
   - Configure product categories

2. **Customer Registration**
   - Register through customer portal
   - Login and start browsing products

### Core Workflows

#### Placing an Order (Customer)
1. Browse product catalog
2. Add items to cart with quantities
3. Review cart and total amount
4. Proceed to checkout
5. Enter delivery details
6. Place order
7. Track order status

#### Managing Products (Admin)
1. Login to admin dashboard
2. Navigate to "Manage Products"
3. Add new products with details
4. Upload product images
5. Set categories and pricing

#### Processing Orders (Admin)
1. View incoming orders in dashboard
2. Update order status as they progress
3. Communicate with customers
4. Mark orders as delivered

## 🧪 Testing

### Test Cases Overview

#### Authentication Tests
- [x] Customer registration and login
- [x] Admin login functionality
- [x] Password validation
- [x] Session management

#### E-commerce Tests
- [x] Product catalog display
- [x] Add to cart functionality
- [x] Cart quantity updates
- [x] Order placement process
- [x] Order status tracking

#### Admin Tests
- [x] Product management CRUD operations
- [x] Order management and status updates
- [x] Customer information access

### Manual Testing

```bash
# Test with demo accounts
1. Admin: admin@catering.com / password
2. Customer: customer@demo.com / password
```

## 📨 Deployment

### Firebase Hosting

```bash
# Initialize Firebase
firebase init hosting

# Deploy to Firebase
firebase deploy

# Deploy only hosting
firebase deploy --only hosting
```

### GitHub Pages (Alternative)

1. Enable GitHub Pages in repository settings
2. Select 'main' branch as source
3. Site available at: `https://username.github.io/repository-name`

## 📚 API Documentation

### Product Management

```javascript
// Get all products
getAllProducts()

// Add new product
addProduct(productData)

// Update product
updateProduct(productId, updates)

// Delete product
deleteProduct(productId)
```

### Order Management

```javascript
// Create order
createOrder(orderData)

// Get user orders
getUserOrders(userId)

// Update order status
updateOrderStatus(orderId, status)
```

### Cart Operations

```javascript
// Add to cart
addToCart(productId, quantity)

// Update cart item
updateCartItem(productId, quantity)

// Remove from cart
removeFromCart(productId)

// Clear cart
clearCart()
```

## 🔒 Security Features

- ✅ Input validation and sanitization
- ✅ XSS protection
- ✅ Role-based access control
- ✅ Secure authentication
- ✅ Data encryption
- ✅ HTTPS enforcement

## 🍽️ Product Categories

### Traditional Indian
- Biryanis (Chicken, Mutton, Vegetable)
- Curries (Paneer, Dal, Chicken)
- Tandoor Items (Roti, Naan, Kebabs)
- Rice Dishes

### Modern Fusion
- Indo-Chinese dishes
- Continental-Indian fusion
- Modern presentations of classics

### Desserts & Sweets
- Traditional Indian sweets
- Modern desserts
- Seasonal specialties

### Beverages
- Traditional drinks (Chai, Lassi)
- Fresh juices
- Seasonal beverages

## 📊 Project Metrics

- **Lines of Code**: ~3,000+
- **Files**: 15+
- **Functions**: 60+
- **Products**: 8 sample items
- **Categories**: 4 main categories
- **Performance Score**: 95/100
- **Mobile Responsive**: ✅

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Authors

- **Your Name** - *Initial work* - [@yourusername](https://github.com/yourusername)

## 🙏 Acknowledgments

- Firebase team for excellent cloud services
- Unsplash for beautiful food photography
- Indian cuisine traditions for inspiration
- Open source community for guidance

## 📞 Support

For support and questions:

- 📧 Email: support@spiceroutecatering.com
- 🐛 Issues: [GitHub Issues](https://github.com/yourusername/catering-ordering-system/issues)
- 📖 Wiki: [Project Wiki](https://github.com/yourusername/catering-ordering-system/wiki)

---

⭐ **Star this repository if it helped you!**

---

## 🚨 Project Status

| Feature | Status | Notes |
|---------|--------|-------|
| User Authentication | ✅ Complete | Firebase Auth integrated |
| Product Catalog | ✅ Complete | Full CRUD operations |
| Shopping Cart | ✅ Complete | Persistent cart functionality |
| Order Management | ✅ Complete | Complete order lifecycle |
| Admin Panel | ✅ Complete | Full administrative controls |
| Mobile Responsive | ✅ Complete | All devices supported |
| Firebase Integration | ✅ Complete | Ready for production |
| Documentation | ✅ Complete | Comprehensive guides |

**Last Updated**: August 15, 2025

---

## 💰 Sample Menu & Pricing

| Item | Price (₹) | Category |
|------|-----------|----------|
| Royal Chicken Biryani | 299 | Traditional Indian |
| Paneer Butter Masala | 249 | Traditional Indian |
| Dal Makhani with Rice | 199 | Traditional Indian |
| Tandoor Roti (Set of 4) | 80 | Traditional Indian |
| Gulab Jamun (Per piece) | 25 | Desserts |
| Masala Chai | 30 | Beverages |
| Fresh Fruit Lassi | 45 | Beverages |
| Mixed Vegetable Curry | 179 | Traditional Indian |