# Project Workflow - Restaurant Worker Management System

Follow these steps to set up and run the project correctly without errors.

## 1. Prerequisites
- Node.js installed
- MongoDB running locally (default: `mongodb://localhost:27017/restaurant_management`)

## 2. Environment Configuration
Ensure your `.env` file in the root directory has the following settings:
```env
MONGO_URI=mongodb://localhost:27017/restaurant_management
JWT_SECRET=your_jwt_secret_key_here
PORT=5000
```

## 3. Installation
Install all dependencies for both the backend and frontend:
```bash
npm run install-all
```

## 4. Database Initialization (Seeding)
Seed the database with 100 sample workers using the fixed script:
```bash
npm run seed
```

## 5. Running the Application
Start both the backend server and the frontend client concurrently:
```bash
npm run dev
```

### Accessing the App:
- **Frontend**: [http://localhost:3000](http://localhost:3000)
- **Backend API**: [http://localhost:5000/api](http://localhost:5000/api)

## 6. Key Features
- **Admin Login**: Access management dashboard.
- **Worker Management**: Add, Edit, Delete, and Upload images.
- **Analytics**: Visualize staff distribution and salary data.
- **Reputation**: Calculate scores based on performance and ratings.

---
**Note**: The project has been rectified to fix duplicate function errors and naming mismatches in the image system.
