# 🍽️ Restaurant Worker Management System

A comprehensive MERN stack application for managing restaurant workers with modern UI and advanced features.

## 📋 Project Overview

This system manages restaurant workers with CRUD operations, search, sorting, filtering, and analytics while implementing collection concepts, functional programming, and design patterns.

## 🎯 Syllabus Coverage

### ✅ Unit I – Collections Framework I
- **ArrayList** → Worker list storage
- **Iterator** → Traverse workers
- **Generics** → Type-safe operations

### ✅ Unit II – Collections Framework II
- **Set** → Unique roles management
- **Map** → Role-based grouping
- **Comparator** → Salary-based sorting
- **Streams** → Worker filtering

### ✅ Unit III – Server Side Programming
- **MongoDB** → Database operations
- **Regex** → Input validation
- **REST APIs** → Backend services

### ✅ Unit IV – Lambda & Annotations
- **Lambda/Arrow Functions** → Functional programming
- **Higher-order functions** → Data processing

### ✅ Unit V – Design Patterns
- **Singleton** → Database connection
- **Factory** → Worker creation
- **MVC** → Project structure
- **Iterator** → List traversal
- **Strategy** → Analytics calculations

## 🛠️ Tech Stack

### Backend
- **Node.js** + **Express.js** - Server framework
- **MongoDB** + **Mongoose** - Database
- **JWT** - Authentication
- **CORS** - Cross-origin requests

### Frontend
- **React 18** - UI framework
- **React Router** - Navigation
- **TailwindCSS** - Styling
- **Lucide React** - Icons
- **Recharts** - Data visualization
- **Axios** - HTTP client

## 🚀 Features

### Core Features
- ✅ Add/Edit/Delete workers
- ✅ Search workers by name/role
- ✅ Filter by role
- ✅ Sort by name/salary
- ✅ Role-based management
- ✅ Shift scheduling
- ✅ Salary tracking

### Advanced Features
- 📊 Analytics dashboard
- 📈 Data visualization
- 🔍 Advanced search
- 📋 Role distribution
- 💰 Salary analysis
- 🏆 Top performers

### UI/UX Features
- 🎨 Modern, responsive design
- 📱 Mobile-friendly
- ⚡ Fast interactions
- 🎯 Intuitive navigation
- 📊 Interactive charts

## 📁 Project Structure

```
restaurant-worker-management/
├── server/                 # Backend
│   ├── controllers/        # Route controllers
│   ├── models/            # Database models
│   ├── routes/            # API routes
│   └── index.js           # Server entry
├── client/                # Frontend
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── context/       # React context
│   │   └── App.js         # Main app
│   └── package.json
├── package.json           # Root dependencies
└── README.md
```

## 🛠️ Installation & Setup

### Prerequisites
- Node.js (v16+)
- MongoDB (local or Atlas)
- Git

### Steps

1. **Clone the repository**
```bash
git clone <repository-url>
cd restaurant-worker-management
```

2. **Install dependencies**
```bash
npm run install-all
```

3. **Setup environment variables**
```bash
# Create .env file in root
MONGO_URI=mongodb://localhost:27017/restaurant_workers
JWT_SECRET=your_jwt_secret_key_here
PORT=5000
```

4. **Start MongoDB**
```bash
# For local MongoDB
mongod

# Or use MongoDB Atlas
# Update MONGO_URI in .env
```

5. **Run the application**
```bash
# Development mode (both frontend and backend)
npm run dev

# Or separately:
npm run server  # Backend on port 5000
npm run client  # Frontend on port 3000
```

## 📊 API Endpoints

### Workers
- `GET /api/workers` - Get all workers
- `POST /api/workers` - Add worker
- `PUT /api/workers/:id` - Update worker
- `DELETE /api/workers/:id` - Delete worker
- `GET /api/workers/search?query=` - Search workers
- `GET /api/workers/role/:role` - Filter by role
- `GET /api/workers/sort?sortBy=&order=` - Sort workers

### Analytics
- `GET /api/analytics/dashboard` - Dashboard analytics
- `GET /api/analytics/top-performers` - Top performers

## 🎨 UI Features

### Pages
1. **Dashboard** - Overview with stats and quick actions
2. **Workers List** - Manage all workers with filters
3. **Add Worker** - Form with validation
4. **Edit Worker** - Update existing worker
5. **Analytics** - Charts and insights

### Components
- Modern card-based layout
- Responsive navigation
- Interactive data tables
- Form validation with regex
- Real-time search
- Sort and filter functionality
- Data visualization charts

## 🔍 Design Patterns Implementation

### Singleton Pattern
```javascript
class DatabaseConnection {
  constructor() {
    if (!DatabaseConnection.instance) {
      this.connect();
      DatabaseConnection.instance = this;
    }
    return DatabaseConnection.instance;
  }
}
```

### Factory Pattern
```javascript
class WorkerFactory {
  static createWorker(data) {
    return new Worker({
      name: data.name,
      role: data.role,
      salary: data.salary,
      shift: data.shift,
      phone: data.phone
    });
  }
}
```

### Iterator Pattern
```javascript
class WorkerIterator {
  constructor(workers) {
    this.workers = workers;
    this.index = 0;
  }
  
  hasNext() {
    return this.index < this.workers.length;
  }
  
  next() {
    return this.hasNext() ? this.workers[this.index++] : null;
  }
}
```

### Strategy Pattern
```javascript
class AnalyticsStrategy {
  calculate(workers) {
    throw new Error('Strategy method must be implemented');
  }
}

class SalaryAnalytics extends AnalyticsStrategy {
  calculate(workers) {
    // Salary calculation logic
  }
}
```

## 📚 Collection Concepts

### List (ArrayList)
```javascript
const workers = await Worker.find(); // Dynamic array
```

### Set (HashSet)
```javascript
const uniqueRoles = new Set(workers.map(w => w.role));
```

### Map (HashMap)
```javascript
const workersByRole = workers.reduce((map, worker) => {
  if (!map[worker.role]) map[worker.role] = [];
  map[worker.role].push(worker);
  return map;
}, {});
```

### Iterator
```javascript
const iterator = new WorkerIterator(workers);
while (iterator.hasNext()) {
  const worker = iterator.next();
  console.log(worker.name);
}
```

### Lambda/Arrow Functions
```javascript
// Filter workers (Streams concept)
const activeWorkers = workers.filter(w => w.status === 'Active');

// Sort workers (Comparator)
const sortedWorkers = workers.sort((a, b) => b.salary - a.salary);

// Calculate average (Reduce)
const avgSalary = workers.reduce((sum, w) => sum + w.salary, 0) / workers.length;
```

## 🧪 Testing

### Test Cases Covered
- ✅ Add worker functionality
- ✅ Update worker details
- ✅ Delete worker
- ✅ Search workers
- ✅ Filter by role
- ✅ Sort operations
- ✅ Form validation
- ✅ API responses
- ✅ Database operations

## 📱 Screenshots

### Dashboard
- Overview statistics
- Quick actions
- Recent workers table

### Worker Management
- Worker cards with details
- Search and filter options
- Edit and delete actions

### Analytics
- Role distribution charts
- Salary analysis
- Top performers table

## 🎯 Viva Preparation

### Key Points
1. **"This project manages restaurant workers using CRUD operations, sorting, and filtering while applying collection concepts, functional programming, and design patterns in a MERN stack environment."**

2. **Design Patterns Used:**
   - Singleton for database connection
   - Factory for worker creation
   - MVC for project structure
   - Iterator for list traversal
   - Strategy for analytics

3. **Collection Concepts:**
   - List for worker storage
   - Set for unique roles
   - Map for role-based grouping
   - Iterator for traversal
   - Comparator for sorting

## 🚀 Future Enhancements

- [ ] Authentication system
- [ ] Attendance tracking
- [ ] Payroll management
- [ ] Performance reviews
- [ ] Export to PDF/Excel
- [ ] Mobile app
- [ ] Real-time notifications
- [ ] Advanced reporting

## 📝 License

This project is licensed under the MIT License.

## 👥 Author

Student Project - Restaurant Worker Management System

---

**🎓 Perfect for academic projects covering full-stack development and data structures concepts!**
