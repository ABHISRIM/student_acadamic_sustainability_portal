# Academic Sustainability Portal - Full Stack Setup

A complete full-stack application for tracking, reporting, and managing sustainability issues in academic institutions.

## 📋 Project Structure

```
AcademicSustainabilityPortal/
├── AcademicSustainabilityPortal/    # React Frontend
│   ├── public/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Login.js
│   │   │   ├── Dashboard.js
│   │   │   ├── Issues.js
│   │   │   └── Profile.js
│   │   ├── Services/
│   │   │   └── authService.js
│   │   ├── styles/
│   │   │   ├── Login.css
│   │   │   ├── Dashboard.css
│   │   │   ├── Issues.css
│   │   │   └── Profile.css
│   │   ├── App.js
│   │   └── index.js
│   ├── package.json
│   └── .env
├── models/                          # Database Models
│   ├── Issue.js
│   └── User.js
├── server.js                        # Express Backend
├── package.json                     # Backend Dependencies
├── .env                            # Environment Variables
└── README.md
```

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- MongoDB (running locally on port 27017)

### 1. Backend Setup

```bash
# From root directory
cd C:\Users\ABHISRI\Desktop\AcademicSustainabilityPortal

# Install backend dependencies
npm install

# Start MongoDB (if not already running)
# Windows: Use MongoDB Compass or run mongod from installation folder

# Start the backend server
npm start

# Server will run on http://localhost:5000
```

### 2. Frontend Setup

```bash
# From root directory
cd AcademicSustainabilityPortal

# Install frontend dependencies
npm install

# Start the React development server
npm start

# Frontend will open on http://localhost:3000
```

## 🔐 Authentication

**Demo Mode (No Real Database Required)**
- Any email format: `user@example.com`
- Any password (minimum 6 characters)
- Sign in or sign up with any credentials
- Session stored in localStorage

## 📝 Features

### 1. **Login Page** 
- Split-screen design with gradient background
- Sign in / Sign up toggle
- Email and password validation
- localStorage-based authentication

### 2. **Dashboard**
- Welcome banner with user greeting
- 4 key metrics (Energy, Waste, Carbon, Contributors)
- 4 sustainability focus areas with progress bars
- Quick action buttons
- Recent issues list with status badges

### 3. **Issue Reporter**
- Form to report sustainability issues
- Fields: Title, Description, Category, Location, Priority
- Filter by status (All, Pending, In Progress, Resolved)
- Delete issues
- Validation for required fields

### 4. **User Profile**
- View and edit profile information
- Avatar with user initial
- Change password functionality
- Tab-based interface for Profile and Security

### 5. **API Endpoints**

#### Issues
```
GET    /api/issues                 # Get all issues
GET    /api/issues/:id            # Get issue by ID
POST   /api/issues                # Create new issue
PUT    /api/issues/:id            # Update issue
DELETE /api/issues/:id            # Delete issue
PATCH  /api/issues/:id/status     # Update issue status
POST   /api/issues/:id/comments   # Add comment
```

#### Dashboard
```
GET /api/dashboard/metrics        # Get sustainability metrics
GET /api/dashboard/focus-areas    # Get focus areas
```

#### Users
```
GET    /api/users/:id             # Get user by ID
PUT    /api/users/:id             # Update user profile
```

## 🎨 Design Features

- **Dark Theme**: Purple/violet gradient background (#8b5cf6, #a855f7)
- **Responsive Design**: Mobile-first approach with breakpoints at 1024px, 768px
- **Smooth Animations**: Hover effects, transitions, and transforms
- **Accessible UI**: Button states, form validation, status badges

## 📦 Dependencies

### Backend
- express: ^4.18.2
- mongoose: ^7.5.0
- cors: ^2.8.5
- dotenv: ^16.3.1
- bcryptjs: ^2.4.3 (for future password hashing)
- jwt-simple: ^0.5.6 (for future JWT auth)

### Frontend
- react: ^18.2.0
- react-dom: ^18.2.0
- react-router-dom: ^6.20.0
- axios: ^1.6.2
- react-scripts: 5.0.1

## 🔧 Configuration

### Backend (.env)
```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/sustainabilityDB
NODE_ENV=development
```

### Frontend (.env)
```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_ENV=development
```

## 🗄️ Database Schema

### Issue Model
- title (String, required)
- description (String, required)
- category (Energy, Waste, Transportation, Water, Buildings, Other)
- location (String, required)
- priority (Low, Medium, High, Critical)
- status (Pending, In Progress, Resolved)
- reportedBy (String)
- comments (Array with author, text, date)
- timestamps (createdAt, updatedAt)

### User Model
- name (String, required)
- email (String, unique, required)
- password (String, required)
- phone (String, optional)
- institution (String, optional)
- role (user, admin)
- isActive (Boolean)
- timestamps (createdAt, updatedAt)

## 🚨 Troubleshooting

### MongoDB Connection Error
```
Error: connect ECONNREFUSED 127.0.0.1:27017
```
**Solution**: Make sure MongoDB is running on your system

### Port Already in Use
```
Error: listen EADDRINUSE: address already in use :::5000
```
**Solution**: Change PORT in .env or kill the process using the port

### npm install fails
```
Solution: Delete node_modules and package-lock.json, then run npm install again
```

### React app won't load
```
Make sure you're running from the AcademicSustainabilityPortal directory
Check that npm start is running in the frontend terminal
```

## 📱 Responsive Breakpoints

- **Desktop**: Full width with multi-column layouts
- **Tablet (1024px)**: Adjusted columns and spacing
- **Mobile (768px)**: Single column layouts, stacked elements

## 🎯 Next Steps

1. Replace demo authentication with real JWT tokens
2. Add password hashing with bcryptjs
3. Implement file upload functionality
4. Add email notifications
5. Create admin dashboard
6. Add data export features
7. Implement real-time updates with WebSockets

## 📄 License

ISC

## 👤 Author

Academic Sustainability Portal Team

---

**Happy Coding!** 🎉
