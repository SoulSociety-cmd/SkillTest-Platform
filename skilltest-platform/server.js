require('dotenv').config();
const http = require('http');
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');
const { Server } = require('socket.io');
const portfinder = require("portfinder"); // ✅ thêm dòng này
const { authLimiter, apiLimiter } = require('./middleware/rateLimit');

// Models
const User = require('./models/User');
const Test = require('./models/Test');
const Submission = require('./models/Submission');
const Match = require('./models/Match');

const app = express();

// ===== Middleware =====
app.use(helmet());
app.use(morgan('combined'));
app.use(cors({
  origin: process.env.FRONTEND_URL || "*",
  credentials: true
}));

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static('uploads'));

app.use('/api/auth', authLimiter);
app.use('/api', apiLimiter);

// ===== MongoDB =====
if (!process.env.MONGO_URI) {
  console.error('❌ Missing MONGO_URI environment variable');
  process.exit(1);
}

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => {
    console.error('❌ MongoDB connection error:', err.message);
    process.exit(1);
  });

// ===== Routes =====
app.get('/api/health', (req, res) => {
  res.json({
    message: 'SkillTest Platform API ready!',
    timestamp: new Date()
  });
});

app.use('/api/auth', require('./routes/auth'));
app.use('/api/tests', require('./routes/tests'));
app.use('/api/submissions', require('./routes/submissions'));
app.use('/api/users', require('./routes/users'));
app.use('/api/companies', require('./routes/companies'));
app.use('/api/matches', require('./routes/matches'));

// ===== Serve Frontend (Vite build) =====
const clientPath = path.join(__dirname, 'client', 'dist');
app.use(express.static(clientPath));

app.get('*', (req, res) => {
  res.sendFile(path.join(clientPath, 'index.html'));
});

// ===== Socket.IO =====
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "*",
    methods: ["GET", "POST"],
    credentials: true
  }
});

// Attach io
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
    await Match.collection.createIndex(
      { company: 1, student: 1 },
      { unique: true }
    );

    console.log('✅ MongoDB indexes optimized');
  } catch (error) {
    console.error('Index creation error:', error.message);
  }
});

// ===== Start Server =====
const DEFAULT_PORT = process.env.PORT || 5000;

portfinder.getPortPromise({ port: DEFAULT_PORT })
  .then((port) => {
    server.listen(port, () => {
      console.log(`🚀 Server running on port ${port}`);
      console.log(`📡 Socket.IO ready`);
    });
  })
  .catch((err) => {
    console.error("❌ Cannot find available port:", err);
  });