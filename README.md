# BookSwap Marketplace - Backend

A Node.js/Express.js REST API for the BookSwap Marketplace application that allows users to trade, share, and discover books.

## 🚀 Features

- **User Authentication**: JWT-based authentication with bcrypt password hashing
- **Book Management**: CRUD operations for books with image uploads
- **Request System**: Book request functionality with status tracking
- **File Upload**: Multer-based image upload for book covers
- **Data Validation**: Express-validator for input validation
- **Database**: MongoDB with Mongoose ODM

## 📋 Prerequisites

- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas)
- npm or yarn

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd "Used book app/backend"
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   - Create a `.env` file in the backend directory
   - Add the following variables:
   ```env
   MONGODB_URI=mongodb://localhost:27017/bookswap
   JWT_SECRET=your-super-secret-jwt-key
   PORT=5000
   ```

4. **Database Setup**
   - **Option 1: Local MongoDB**
     - Install MongoDB locally
     - Start MongoDB service
     - Default connection string: `mongodb://localhost:27017/bookswap`
   
   - **Option 2: MongoDB Atlas (Cloud)**
     - Create a free account at [MongoDB Atlas](https://www.mongodb.com/atlas)
     - Create a cluster and get connection string
     - Update `MONGODB_URI` in `.env` file

5. **Start the server**
   ```bash
   npm start
   # or for development
   npm run dev
   ```

## 📁 Project Structure

```
backend/
├── controllers/          # Route controllers
│   ├── authController.js
│   ├── bookController.js
│   └── requestController.js
├── middleware/           # Custom middleware
│   ├── auth.js          # JWT authentication
│   └── upload.js        # File upload handling
├── models/              # Mongoose schemas
│   ├── User.js
│   ├── Book.js
│   └── BookRequest.js
├── routes/              # API routes
│   ├── auth.js
│   ├── books.js
│   └── requests.js
├── uploads/             # Uploaded images (auto-created)
├── server.js            # Main server file
├── package.json
└── .env                 # Environment variables
```

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile (protected)

### Books
- `GET /api/books` - Get all books
- `GET /api/books/search` - Search books
- `GET /api/books/:id` - Get book by ID
- `POST /api/books` - Create new book (protected)
- `GET /api/books/my` - Get user's books (protected)
- `PUT /api/books/:id` - Update book (protected)
- `DELETE /api/books/:id` - Delete book (protected)

### Requests
- `POST /api/requests` - Create book request (protected)
- `GET /api/requests/received` - Get received requests (protected)
- `GET /api/requests/sent` - Get sent requests (protected)
- `PUT /api/requests/:id` - Update request status (protected)

## 🔐 Authentication

The API uses JWT (JSON Web Tokens) for authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## 📝 Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `MONGODB_URI` | MongoDB connection string | `mongodb://localhost:27017/bookswap` |
| `JWT_SECRET` | Secret key for JWT signing | `your-super-secret-key` |
| `PORT` | Server port | `5000` |

## 🧪 Testing

Test the API endpoints using tools like Postman or curl:

```bash
# Test health endpoint
curl http://localhost:5000/api/health

# Register a new user
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe","email":"john@example.com","password":"password123"}'
```

## 🚨 Troubleshooting

### MongoDB Connection Issues
- Ensure MongoDB is running locally or Atlas cluster is accessible
- Check connection string in `.env` file
- Verify network connectivity

### Port Already in Use
- Change the `PORT` in `.env` file
- Or kill the process using the port: `npx kill-port 5000`

### File Upload Issues
- Ensure `uploads/` directory exists
- Check file size limits (currently 5MB)
- Verify file type restrictions (images only)

## 📦 Dependencies

- **express**: Web framework
- **mongoose**: MongoDB object modeling
- **jsonwebtoken**: JWT authentication
- **bcryptjs**: Password hashing
- **multer**: File upload handling
- **express-validator**: Input validation
- **cors**: Cross-origin resource sharing
- **dotenv**: Environment variable loading

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📄 License

This project is licensed under the MIT License.
