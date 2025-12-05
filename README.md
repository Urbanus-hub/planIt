# PlanIt - Event Planning & Vendor Marketplace Platform

[![Next.js](https://img.shields.io/badge/Next.js-16.0.0-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-20+-green)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-brightgreen)](https://www.mongodb.com/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

PlanIt is a comprehensive event planning and vendor marketplace platform that connects event organizers with verified service providers across Kenya. Whether you're planning a wedding, corporate event, birthday party, or any special occasion, PlanIt makes it easy to find, book, and manage professional vendors all in one place.

## 🌟 Key Features

### For Clients
- **Browse Verified Vendors** - Access 500+ verified professionals across multiple categories
- **Smart Search & Filters** - Find vendors by category, location, rating, and budget
- **Real Reviews & Ratings** - Read authentic feedback from verified customers
- **Secure Booking System** - Book services with secure payments and instant confirmation
- **Event Management Dashboard** - Track all your bookings and communicate with vendors
- **Message Vendors** - Direct in-app messaging with service providers
- **Mobile Responsive** - Seamless experience across all devices

### For Vendors
- **Professional Profiles** - Showcase your services with galleries and portfolios
- **Booking Management** - Accept, decline, and manage bookings efficiently
- **Real-time Notifications** - Get instant alerts for new bookings and messages
- **Analytics Dashboard** - Track performance, revenue, and customer engagement
- **Service Listings** - Create and manage multiple service packages
- **Client Communication** - Built-in messaging system for client interactions
- **Commission-based Pricing** - Free to list, pay only when you get bookings

### For Administrators
- **Vendor Verification** - Review and approve vendor applications
- **Platform Analytics** - Monitor platform performance and user activity
- **User Management** - Manage clients, vendors, and permissions
- **Content Moderation** - Review and moderate listings and reviews
- **Revenue Tracking** - Monitor commissions and platform revenue

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 16.0.0 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Animations**: Framer Motion, GSAP
- **State Management**: React Context API
- **Form Handling**: React Hook Form
- **HTTP Client**: Axios
- **Authentication**: JWT with httpOnly cookies

### Backend
- **Runtime**: Node.js 20+
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT & bcrypt
- **Email Service**: Nodemailer (Gmail SMTP)
- **Validation**: express-validator
- **Security**: Helmet, CORS, express-mongo-sanitize
- **File Upload**: Multer (for image uploads)

### DevOps & Tools
- **Version Control**: Git & GitHub
- **Package Manager**: npm
- **Code Quality**: ESLint, Prettier
- **API Testing**: Postman
- **Deployment**: Render (Backend), Vercel (Frontend)

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- Node.js 20.x or higher
- npm 9.x or higher
- MongoDB Atlas account (or local MongoDB instance)
- Gmail account (for email notifications)
- Git

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/Urbanus-hub/planIt.git
cd planIt
```

### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Configure your .env file with the following variables:
# NODE_ENV=development
# PORT=5000
# MONGODB_URI=your_mongodb_connection_string
# JWT_SECRET=your_jwt_secret_key
# JWT_EXPIRE=7d
# COOKIE_EXPIRE=7
# EMAIL_USER=your_gmail@gmail.com
# EMAIL_PASS=your_gmail_app_password
# CLIENT_URL=http://localhost:3000

# Start development server
npm run dev
```

The backend server will start on `http://localhost:5000`

### 3. Frontend Setup

```bash
# Navigate to frontend directory (from project root)
cd frontend

# Install dependencies
npm install

# Create environment file
cp .env.example .env.local

# Configure your .env.local file:
# NEXT_PUBLIC_API_URL=http://localhost:5000

# Start development server
npm run dev
```

The frontend application will start on `http://localhost:3000`

## 📁 Project Structure

```
planIt/
├── backend/                 # Backend API server
│   ├── configs/            # Configuration files
│   ├── controllers/        # Route controllers
│   ├── middlewares/        # Custom middleware
│   ├── models/            # Mongoose models
│   ├── routes/            # API routes
│   ├── types/             # TypeScript types
│   ├── utils/             # Utility functions
│   └── server.ts          # Entry point
├── frontend/               # Next.js frontend
│   ├── app/               # App router pages
│   │   ├── (auth)/        # Authentication pages
│   │   ├── (dashboards)/  # Dashboard pages
│   │   └── (home)/        # Landing page
│   ├── components/        # React components
│   │   ├── layout/        # Layout components
│   │   └── ui/            # UI components
│   ├── contexts/          # React contexts
│   ├── hooks/             # Custom hooks
│   ├── lib/               # Utilities & API client
│   └── public/            # Static assets
└── README.md              # Project documentation
```

## 🔐 Authentication Flow

PlanIt uses a secure JWT-based authentication system with email verification:

1. **Registration**:
   - User signs up with email and password
   - OTP sent to email for verification
   - User enters OTP to verify account
   - JWT token issued upon successful verification

2. **Login**:
   - User logs in with credentials
   - System checks if email is verified
   - Unverified users redirected to OTP page
   - JWT token stored in httpOnly cookie

3. **Password Reset**:
   - User requests password reset
   - Reset link sent to email with token
   - User sets new password via secure link
   - Token expires after 10 minutes

## 🎨 User Roles

PlanIt supports three user roles with distinct permissions:

- **Client**: Browse vendors, make bookings, leave reviews
- **Vendor**: Create service listings, manage bookings, communicate with clients
- **Admin**: Manage platform, verify vendors, monitor activity

## 📧 Email Notifications

PlanIt sends automated emails for:
- Email verification (OTP)
- Welcome messages
- Password reset links
- Booking confirmations
- Booking status updates
- New messages from vendors/clients

## 🔒 Security Features

- Password hashing with bcrypt
- JWT authentication with httpOnly cookies
- MongoDB sanitization against NoSQL injection
- XSS protection with Helmet
- CORS configuration
- Rate limiting on sensitive routes
- Input validation and sanitization
- Secure password reset with time-limited tokens

## 🌐 API Documentation

For detailed API documentation, see [API_DOCUMENTATION.md](backend/API_DOCUMENTATION.md)

Base URL (Development): `http://localhost:5000/api/v1`

### Quick API Reference

#### Authentication
- `POST /auth/register` - Register new user
- `POST /auth/login` - Login user
- `POST /auth/verify-otp` - Verify email with OTP
- `POST /auth/resend-otp` - Resend OTP
- `POST /auth/forgot-password` - Request password reset
- `POST /auth/reset-password/:token` - Reset password
- `GET /auth/logout` - Logout user
- `GET /auth/me` - Get current user

#### Services
- `GET /services` - Get all services
- `POST /services` - Create service (Vendor only)
- `GET /services/:id` - Get service by ID
- `PUT /services/:id` - Update service (Vendor only)
- `DELETE /services/:id` - Delete service (Vendor only)

#### Bookings
- `GET /bookings` - Get user bookings
- `POST /bookings` - Create booking
- `GET /bookings/:id` - Get booking details
- `PUT /bookings/:id` - Update booking status
- `DELETE /bookings/:id` - Cancel booking

## 🎨 UI/UX Features

- Modern, clean design with green brand colors
- Dark mode support
- Smooth animations with GSAP and Framer Motion
- Responsive design for all screen sizes
- Accessible components (ARIA labels, keyboard navigation)
- Toast notifications for user feedback
- Loading states and skeleton screens
- Optimized images with Next.js Image component

## 🚢 Deployment

### Backend Deployment (Render)

1. Push code to GitHub
2. Create new Web Service on Render
3. Connect GitHub repository
4. Configure:
   - Root Directory: `backend`
   - Build Command: `npm install && npm run build`
   - Start Command: `npm start`
5. Add environment variables
6. Deploy

### Frontend Deployment (Vercel)

1. Push code to GitHub
2. Import project in Vercel
3. Configure:
   - Root Directory: `frontend`
   - Framework: Next.js
4. Add environment variables
5. Deploy

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Authors

- **Urbanus** - *Initial work* - [Urbanus-hub](https://github.com/Urbanus-hub)

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- shadcn for the beautiful UI components
- MongoDB for the database
- Render & Vercel for hosting

## 📞 Support

For support, email support@planit.com or join our Slack channel.

## 🗺️ Roadmap

- [ ] Payment gateway integration (M-Pesa, Stripe)
- [ ] Advanced analytics for vendors
- [ ] Mobile app (React Native)
- [ ] AI-powered vendor recommendations
- [ ] Multi-language support
- [ ] Video consultation feature
- [ ] Calendar integration
- [ ] Social media sharing

---

**Made with ❤️ in Kenya**
