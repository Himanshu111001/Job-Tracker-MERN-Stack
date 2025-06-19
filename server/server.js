const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const morgan = require('morgan');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');

// Load environment variables
dotenv.config();

// Import routes
const authRoutes = require('./routes/auth');
const jobRoutes = require('./routes/jobs');
const userRoutes = require('./routes/users');
const notificationRoutes = require('./routes/notifications');

// App initialization
const app = express();
const server = http.createServer(app);

// Socket.io setup
// Helper function to handle multiple origins
const getAllowedOrigins = () => {
  // Default origins - local development and Vercel deployment
  const defaultOrigins = [
    'http://localhost:3000', 
    'https://job-tracker-mern-stack.vercel.app',
    'https://jobtrack-app.vercel.app'
  ];
  
  // If CLIENT_URL is set, add it to the origins list
  const clientUrl = process.env.CLIENT_URL;
  if (clientUrl && !defaultOrigins.includes(clientUrl)) {
    defaultOrigins.push(clientUrl);
  }
  
  return defaultOrigins;
};

const allowedOrigins = getAllowedOrigins();

const io = socketIo(server, {
  cors: {
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);
      
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        console.log(`Socket.io blocking origin: ${origin}`);
        return callback(new Error(`Origin ${origin} not allowed by CORS`));
      }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
  }
});

// Middleware
app.use(express.json());
app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      console.log(`Express blocking origin: ${origin}`);
      return callback(new Error(`Origin ${origin} not allowed by CORS`));
    }
  },
  credentials: true
}));

// Health check endpoint for Render
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Logging in development mode
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Share socket instance with routes
app.use((req, res, next) => {
  req.io = io;
  next();
});

// Mount routes
app.use('/api/auth', authRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/users', userRoutes);
app.use('/api/notifications', notificationRoutes);

// Socket connection handler
io.on('connection', (socket) => {
  console.log('A user connected', socket.id);
  
  socket.on('joinRoom', (userId) => {
    socket.join(userId);
    console.log(`User ${userId} joined their room`);
  });
  
  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/job-tracker', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected successfully'))
.catch(err => console.error('MongoDB connection error:', err));

// Handle production setup
if (process.env.NODE_ENV === 'production') {
  // For API-only deployment on Render
  app.get('/', (req, res) => {
    res.json({ 
      message: 'JobTrack API Server', 
      status: 'running',
      version: '1.0.0',
      documentation: 'See API documentation for available endpoints'
    });
  });

  // Handle all non-api routes by sending API status
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api')) {
      return next();
    }
    res.status(404).json({ success: false, error: 'Not found. This is a backend API server only.' });
  });
}

// Error handler middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.statusCode || 500).json({
    success: false,
    error: err.message || 'Server Error'
  });
});

// Start the server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
