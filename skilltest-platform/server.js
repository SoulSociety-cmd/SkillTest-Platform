require('dotenv').config();
const http = require('http');
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const helmet = require('helmet');
const morgan = require('morgan');
const { Server } = require('socket.io');
const { authLimiter, apiLimiter } = require('./middleware/rateLimit');

const User = require('./models/User');
const Test = require('./models/Test');
const Submission = require('./models/Submission');
const Match = require('./models/Match');

const app = express();

app.use(helmet());
app.use(morgan('combined'));
app.use(cors({ origin: process.env.FRONTEND_URL || "*", credentials: true }));
app.use('/api/auth', authLimiter);
app.use('/api', apiLimiter);
app.use(express.json({ limit: '50mb' })); // Increased for code
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static('uploads'));

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

app.get('/api/health', (req, res) => {
  res.json({ 
    message: 'SkillTest Platform API with TEST ENGINE ready!', 
    timestamp: new Date(),
    features: ['Docker Sandbox', 'AI Grading (GPT-4)', 'Real-time Socket']
  });
});

app.use('/api/auth', require('./routes/ auth'));
app.use('/api/tests', require('./routes/tests'));
app.use('/api/submissions', require('./routes/submissions'));
app.use('/api/users', require('./routes/users'));
app.use('/api/companies', require('./routes/companies'));
app.use('/api/matches', require('./routes/matches'));

const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: process.env.FRONTEND_URL || "*", methods: ["GET", "POST"], credentials: true }
});

// Attach io to all requests
app.use((req, res, next) => { 
  req.io = io; 
  next(); 
});

io.on('connection', (socket) => {
  console.log('👤 User connected:', socket.id);
  
  socket.on('join-grading', (submissionId) => {
    socket.join(`grading-${submissionId}`);
    console.log(`📡 Joined grading room: grading-${submissionId}`);
  });
  
  socket.on('ping', () => socket.emit('pong'));
  socket.on('disconnect', () => {
    console.log('👋 User disconnected:', socket.id);
  });
});

mongoose.connection.on('connected', async () => {
  try {
    await User.collection.createIndex({ email: 1 }, { unique: true });
    await Test.collection.createIndex({ company: 1, isActive: 1 });
    await Submission.collection.createIndex({ 
      student: 1, 
      test: 1,
      status: 1 
    });
    await Match.collection.createIndex({ company: 1, student: 1 }, { unique: true });
    console.log('✅ MongoDB indexes optimized');
  } catch (error) {
    console.error('Index creation error:', error.message);
  }
});

let PORT = process.env.PORT || 5000;

function startServer(port) {
  server.listen(port)
    .on('listening', () => {
      console.log(`🚀 TEST ENGINE Server running on http://localhost:${port}`);
      console.log(`📡 Socket.IO ready for real-time grading`);
      console.log(`🧪 Sandbox ready: POST /api/submissions/code`);
    })
    .on('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        console.warn(`⚠️ Port ${port} in use, trying ${port + 1}...`);
        startServer(port + 1);
      } else {
        console.error(err);
        process.exit(1);
      }
    });
}

startServer(PORT);

