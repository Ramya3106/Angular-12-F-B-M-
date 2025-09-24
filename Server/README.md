# CRUD Backend Server with MongoDB

## Prerequisites

- MongoDB installed and running locally
- Node.js installed

## Setup Instructions

1. Install dependencies:
```bash
npm install
```

2. Make sure MongoDB is running:
```bash
mongod
```

3. Start the server:
```bash
npm start
```

Or for development with auto-restart:
```bash
npm run dev
```

The server will run on http://localhost:3000

## Environment Variables

Update `.env` file if needed:
- `MONGODB_URI`: MongoDB connection string (default: mongodb://localhost:27017/crudapp)
- `PORT`: Server port (default: 3000)

## API Endpoints

- GET `/api/users` - Get all users
- GET `/api/users/:id` - Get user by ID
- POST `/api/users` - Create new user
- PUT `/api/users/:id` - Update user
- DELETE `/api/users/:id` - Delete user

## Database

The application uses MongoDB with Mongoose ODM. User data is stored in the `users` collection.