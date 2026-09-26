import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { Server } from 'socket.io';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import reportRoutes from './routes/reportRoutes.js';
import adminRoutes from './routes/adminRoutes.js';

// Connect to database
connectDB();

// Origin validator for Express and Socket.io
const isOriginAllowed = (origin) => {
  if (!origin) return true; // Allow non-browser requests (health checks, curl, etc.)
  if (origin === 'http://localhost:5173' || origin === 'http://127.0.0.1:5173') return true;
  if (process.env.FRONTEND_URL && origin === process.env.FRONTEND_URL) return true;
  if (/^https:\/\/.*\.vercel\.app$/.test(origin)) return true; // Allow any Vercel domain & preview deployment
  if (process.env.NODE_ENV !== 'production') return true;
  return false;
};

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    credentials: true,
  }
});

// Middleware
app.use(cors({
  origin: true,
  credentials: true,
}));

// Request logger for cloud debugging
app.use((req, res, next) => {
  console.log(`📡 [${new Date().toISOString()}] ${req.method} ${req.originalUrl} | Origin: ${req.headers.origin || 'no-origin'}`);
  next();
});

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/admin', adminRoutes);

// Basic route
app.get('/', (req, res) => {
  res.json({ message: 'CIMA Backend API' });
});

// Socket.io
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Make io available in routes
app.set('io', io);

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});