<div align="center">

# ✨ Bablu Resin Arts — Premium E-Commerce Platform

### Handcrafted Resin Jewelry & Art — Made with Love 💛

[![Live Website](https://img.shields.io/badge/🌐_Live_Website-babluresinarts.in-c4985a?style=for-the-badge&labelColor=1b1b1b)](https://www.babluresinarts.in)
[![Vercel](https://img.shields.io/badge/Deployed_on-Vercel-000000?style=for-the-badge&logo=vercel)](https://vercel.com)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=white)](https://react.dev)
[![Firebase](https://img.shields.io/badge/Firebase-Firestore-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)](https://firebase.google.com)

---

*A fully functional, production-grade e-commerce website built for a real small business  **Bablu Resin Arts**  specializing in handcrafted resin jewelry, keychains, hair accessories, and personalized gifts.*

</div>

---

## 🎯 About The Project

**Bablu Resin Arts** is a real Indian small business that creates beautiful handmade resin products. This platform was built to give them a premium online storefront with a complete shopping experience — from product browsing to secure checkout with Razorpay payments.

> 🛒 **181+ Products** · 🎨 **8 Categories** · 💳 **Razorpay Payments** · 📦 **Order Tracking** · 👑 **Admin Dashboard**

---

## ⚡ Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 19, React Router v7, Vite 8 |
| **Styling** | Vanilla CSS with custom design system (CSS Variables, Glassmorphism, Micro-animations) |
| **Database** | Firebase Firestore (Real-time NoSQL) |
| **Authentication** | Firebase Auth (Email/Password + Google Sign-In) |
| **Payments** | Razorpay Payment Gateway (UPI, Cards, Wallets, NetBanking) |
| **Backend (Serverless)** | Vercel Serverless Functions (Node.js) |
| **Deployment** | Vercel (Auto-deploy from GitHub) |
| **Icons** | Lucide React |
| **Fonts** | Google Fonts — Great Vibes, Cormorant Garamond, Jost, Playfair Display |

---

## 🌟 Key Features

### 🛍️ Customer Experience
- **Beautiful Storefront** — Luxury-inspired UI with warm gold tones, elegant typography, and smooth animations
- **Product Catalog** — 181+ products across 8 categories with filtering and search
- **Product Detail Pages** — High-res image galleries, pricing, stock status, and related products
- **Smart Cart** — Slide-out cart drawer with quantity controls and real-time price updates
- **Wishlist** — Save favorite products with persistent local storage
- **Multi-step Checkout** — Shopify-inspired 3-step checkout flow (Information → Shipping → Payment)
- **Coupon System** — Apply discount codes (SAVE10, WELCOME20, FIRSTORDER) at checkout
- **Auto Location** — GPS-based address auto-fill using OpenStreetMap reverse geocoding
- **Dynamic Delivery Pricing** — PIN code based delivery charges (Free above ₹1500, Local ₹30, Standard ₹80)
- **Razorpay Integration** — Secure payment gateway supporting UPI, Credit/Debit Cards, Wallets, and NetBanking
- **Order Confirmation** — Beautiful post-purchase confirmation page with order summary
- **Order History** — Customers can view all past orders with status tracking
- **Order Tracking** — Real-time order status tracker with visual progress bar

### 👑 Admin Dashboard
- **Product Management** — Add, edit, delete, and toggle stock status for all products
- **Sequential Product IDs** — Clean `#1`, `#2`, `#3` numbering system (Firestore Transactions)
- **Sequential Order IDs** — Professional 6-digit padded order numbers (`#000001`, `#000002`)
- **Order Management** — View all orders, update status (Paid → Processing → Shipped → Delivered)
- **Customer Messages** — Read contact form submissions from customers
- **Newsletter Subscribers** — View all email subscribers
- **Database Seeding** — One-click database reset with 181 default products
- **Inline Price Editing** — Edit product prices directly from the table

### 🔐 Authentication
- **Email/Password** — Register and login with email
- **Google Sign-In** — One-click Google OAuth authentication
- **User Profiles** — View and manage profile information
- **Role-based Access** — Admin-only dashboard protected by route guards

### 📱 Responsive Design
- **Mobile-first** — Fully responsive across all devices
- **Hamburger Navigation** — Slide-out mobile menu with smooth transitions
- **Touch-friendly** — Optimized tap targets and swipe interactions

---

## 📁 Project Structure

```
bablu-resin-arts-ecommerce/
├── api/                          # Vercel Serverless Functions
│   ├── create-order.js           # Razorpay order creation endpoint
│   └── verify-payment.js         # Payment signature verification
├── public/                       # Static assets
├── src/
│   ├── components/               # Reusable UI Components
│   │   ├── Header/               # Navigation bar with announcement slider
│   │   ├── Hero/                 # Homepage hero banner
│   │   ├── ProductCard/          # Product card with wishlist toggle
│   │   ├── ProductGrid/          # Responsive product grid layout
│   │   ├── ProductCarousel/      # Horizontal product scroll carousel
│   │   ├── CartDrawer/           # Slide-out shopping cart
│   │   ├── FilterSidebar/        # Category filter sidebar
│   │   ├── FeaturedCategories/   # Homepage category showcase
│   │   ├── Gallery/              # Image gallery section
│   │   ├── Reviews/              # Customer testimonials
│   │   ├── Footer/               # Site footer with newsletter
│   │   ├── WhatsAppButton/       # Floating WhatsApp chat button
│   │   └── ...                   # More components
│   ├── context/                  # React Context Providers
│   │   ├── ShopContext.jsx       # Products, cart, wishlist state
│   │   └── AuthContext.jsx       # Authentication state
│   ├── firebase/                 # Firebase configuration
│   │   └── config.js             # Firestore & Auth initialization
│   ├── data/                     # Static data
│   │   └── products.json         # Default 181 products seed data
│   ├── pages/                    # Route-level page components
│   │   ├── Home.jsx              # Landing page
│   │   ├── Shop.jsx              # All products page
│   │   ├── CategoryPage.jsx      # Filtered category view
│   │   ├── ProductDetail.jsx     # Single product page
│   │   ├── Cart.jsx              # Shopping cart page
│   │   ├── Checkout.jsx          # Multi-step checkout
│   │   ├── OrderConfirmation.jsx # Post-purchase confirmation
│   │   ├── Orders.jsx            # Order history
│   │   ├── TrackOrder.jsx        # Order tracking
│   │   ├── Profile.jsx           # User profile
│   │   ├── Login.jsx             # Sign in page
│   │   ├── Signup.jsx            # Register page
│   │   ├── Contact.jsx           # Contact form
│   │   ├── AdminDashboard.jsx    # Admin panel
│   │   └── ...                   # Legal pages, search, etc.
│   ├── index.css                 # Global design system & CSS variables
│   ├── App.jsx                   # Root component with routing
│   └── main.jsx                  # Entry point
├── vercel.json                   # Vercel deployment configuration
├── vite.config.js                # Vite build configuration
├── package.json                  # Dependencies & scripts
└── .env                          # Environment variables (not committed)
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** v18+
- **npm** v9+
- A **Firebase** project with Firestore & Authentication enabled
- A **Razorpay** account (for payment processing)

### 1. Clone the Repository

```bash
git clone https://github.com/ChanduInjumalla/bablu-resin-arts-ecommerce.git
cd bablu-resin-arts-ecommerce
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Variables

Create a `.env` file in the root directory:

```env
# Firebase Configuration
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id

# Razorpay
VITE_RAZORPAY_KEY_ID=rzp_live_xxxxxxxxxx
RAZORPAY_KEY_ID=rzp_live_xxxxxxxxxx
RAZORPAY_KEY_SECRET=your_razorpay_secret
```

### 4. Run Locally

```bash
npm run dev:frontend
```

The app will open at `http://localhost:5173`

---

## 🔥 Firebase Setup

1. Create a project at [Firebase Console](https://console.firebase.google.com)
2. Enable **Firestore Database** (Start in test mode)
3. Enable **Authentication** → Email/Password + Google Sign-In
4. Copy your config values into the `.env` file
5. On first load, the app will automatically seed 181 products into your Firestore

### Firestore Collections

| Collection | Purpose |
|---|---|
| `products` | Product catalog (181+ items) |
| `orders` | Customer orders with 6-digit IDs |
| `messages` | Contact form submissions |
| `subscribers` | Newsletter email subscribers |
| `metadata` | Sequential counters for products & orders |

---

## 💳 Razorpay Setup

1. Create an account at [Razorpay Dashboard](https://dashboard.razorpay.com)
2. Generate API Keys (Settings → API Keys)
3. Add keys to `.env` and Vercel Environment Variables
4. The checkout supports: **UPI, Credit/Debit Cards, Wallets, NetBanking**

---

## 🌐 Deployment (Vercel)

This project is configured for zero-config deployment on Vercel:

1. Push your code to GitHub
2. Import the repository on [Vercel](https://vercel.com)
3. Set **Framework Preset** to **Vite**
4. Add all `.env` variables to Vercel → Settings → Environment Variables
5. Deploy! 🚀

The `api/` directory is automatically deployed as Vercel Serverless Functions.

---

## 📸 Screenshots

| Homepage | Product Page | Checkout |
|---|---|---|
| Luxury hero banner with animated categories | Detailed product view with image gallery | Shopify-style 3-step checkout |

| Admin Dashboard | Order Management | Mobile View |
|---|---|---|
| Full product CRUD with inline editing | Sequential order IDs with status updates | Fully responsive mobile experience |

---

## 🎨 Design Philosophy

- **Luxury-first aesthetic** — Inspired by premium jewelry brands like Tiffany & Co. and Cartier
- **Warm gold palette** — `#c4985a` primary, `#1b1b1b` dark, `#faf9f7` cream backgrounds
- **Typography hierarchy** — Great Vibes (logo), Cormorant Garamond (headings), Jost (body)
- **Micro-animations** — Subtle hover effects, smooth transitions, and fade-in animations
- **Glassmorphism** — Semi-transparent header with backdrop blur

---

## 👨‍💻 Author

**Chandu Injumalla**

- GitHub: [@ChanduInjumalla](https://github.com/ChanduInjumalla)

---

## 📄 License

This project is built for **Bablu Resin Arts** — a real small business. All product images and business content are property of Bablu Resin Arts.

---

<div align="center">

**Made with ❤️ for Bablu Resin Arts**

*Handcrafted with code, just like our jewelry is handcrafted with resin* ✨

</div>
