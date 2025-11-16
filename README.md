# CIMA - Community Issue Mapping App (Kenya)

A modern full-stack web application for citizens to report local community problems such as potholes, waste management issues, unsafe areas, water supply problems, and electricity outages. The app visualizes issues on an interactive map and provides a professional dashboard for tracking and managing reports.

## 🌐 Live Demo

[View Live Application](https://communityissuemap.vercel.com)

## Features

- **Interactive Map**: Visualize all reported issues on an OpenStreetMap-powered map with custom markers
- **Issue Reporting**: Easy-to-use form for submitting community issues with location detection
- **Dashboard**: Professional dashboard with statistics, filters, and detailed issue tracking
- **Category-Based Reporting**: Quick access to report issues by category (Roads & Infrastructure, Water & Sanitation, Waste Management, Safety & Security, Electricity & Lighting, Health & Environment, Public Services)
- **Real-Time Filtering**: Filter issues by category, county, and status
- **Admin Panel**: Complete admin dashboard for managing users and reports
- **User Authentication**: Secure login/registration with JWT tokens
- **Email Notifications**: Automated email verification and notifications
- **Real-Time Updates**: Socket.io integration for live updates
- **Responsive Design**: Beautiful, modern interface that works on all devices

## Technology Stack

### Frontend
- **React 18** with Vite
- **TailwindCSS** for styling
- **React Router DOM** for routing
- **Leaflet & React-Leaflet** (OpenStreetMap) for maps
- **Axios** for HTTP requests
- **Lucide React** for icons
- **Framer Motion** for animations
- **React Hot Toast** for notifications

### Backend
- **Node.js** with Express.js
- **MongoDB** with Mongoose ODM
- **JWT** for authentication
- **bcryptjs** for password hashing
- **Socket.io** for real-time features
- **SendGrid** for email services
- **Nodemailer** for email sending

## Installation & Setup

### Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

### Quick Start

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd cima
   ```

2. **Install dependencies for both client and server**
   ```bash
   # Install server dependencies
   cd server
   npm install

   # Install client dependencies
   cd ../client
   npm install
   ```

3. **Environment Setup**

   **Server (.env in server/):**
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/cima
   JWT_SECRET=your_jwt_secret_here
   SENDGRID_API_KEY=your_sendgrid_api_key
   EMAIL_FROM=your_email@example.com
   CLIENT_URL=http://localhost:5173
   ```

   **Client (.env in client/):**
   ```env
   VITE_API_BASE=http://localhost:5000
   ```

4. **Start the application**
   ```bash
   # Terminal 1: Start the backend server
   cd server
   npm run dev

   # Terminal 2: Start the frontend
   cd ../client
   npm run dev
   ```

The app will be available at:
- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:5000`

## Available Scripts

### Client
- `npm run dev` - Start the development server
- `npm run build` - Build for production
- `npm run preview` - Preview the production build
- `npm run lint` - Run ESLint

### Server
- `npm run dev` - Start development server with nodemon
- `npm start` - Start production server

## API Documentation

### Base URL
`http://localhost:5000/api`

### Authentication Endpoints
- `POST /auth/register` - User registration
- `POST /auth/login` - User login
- `POST /auth/forgot-password` - Request password reset
- `POST /auth/reset-password` - Reset password
- `GET /auth/verify-email` - Verify email

### Report Endpoints
- `GET /reports` - Fetch all reports
- `POST /reports` - Create new report
- `DELETE /reports/:id` - Delete report (admin only)

### Admin Endpoints
- `GET /admin/users` - Get all users (admin only)
- `PATCH /admin/users/:id/promote` - Promote user to admin (admin only)

## Project Structure

```
cima/
├── client/                 # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── contexts/      # React contexts
│   │   ├── utils/         # Utility functions
│   │   └── assets/        # Static assets
│   ├── package.json
│   └── README.md
├── server/                 # Node.js backend
│   ├── config/            # Database configuration
│   ├── controllers/       # Route controllers
│   ├── middleware/        # Custom middleware
│   ├── models/           # MongoDB models
│   ├── routes/           # API routes
│   ├── server.js         # Main server file
│   └── package.json
├── .gitignore
├── render.yaml           # Deployment configuration
└── README.md            # This file
```

## Database Models

### User Model
- name: String
- email: String (unique)
- password: String (hashed)
- role: String (user/admin)
- preferences: Object
- emailVerified: Boolean

### Report Model
- title: String
- category: String
- description: String
- location: Object (county, ward, address, coordinates)
- status: String (New/In Progress/Resolved)
- createdBy: ObjectId (User reference)
- imageUrl: String
- createdAt: Date

## Design Theme

- **Primary Color**: #16A34A (Green)
- **Accent**: White and gray neutrals
- **Font**: System fonts (Inter/Poppins fallback)

## Key Features Explanation

### Location Detection
Users can click "Detect" to automatically populate latitude/longitude using the browser's geolocation API.

### Map Integration
- Default center: Nairobi, Kenya
- Markers show issue details in popups
- Clicking an issue in the list focuses the map on that marker

### Filters
- Category filter: All, Roads & Infrastructure, Water & Sanitation, Waste Management, Safety & Security, Electricity & Lighting, Health & Environment, Public Services
- County dropdown: All 47 Kenyan counties included
- Status filter: All, New, In Progress, Resolved

### Real-Time Features
- Live updates when new reports are submitted
- Socket.io integration for instant notifications

### Admin Features
- User management (view, promote to admin)
- Report management (view, delete)
- Dashboard statistics

## Deployment

### Frontend (Vercel)
The client is configured for deployment on Vercel with the included `vercel.json`.

### Backend (Render)
The server includes `render.yaml` for easy deployment on Render.com.

## Development Notes

1. The app uses ES6 modules (`"type": "module"` in package.json)
2. Image upload is handled via base64 encoding (can be upgraded to Cloudinary)
3. Email verification requires SendGrid API key
4. MongoDB connection string should be set in production

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Author

**Joshua Nuru**

- [LinkedIn](https://linkedin.com/in/joshua-nuru)
- [Instagram](https://instagram.com/_just_call.me_nuru_)
- [Twitter](https://twitter.com/nurujoshua496)
- [GitHub](https://github.com/montelnurujosh)

## License

MIT License - feel free to use this project for educational or commercial purposes.

## Contributing

Contributions are welcome! Please follow standard React and Node.js best practices.

## Contact

For questions or support, please open an issue in the repository or contact the author.