import express from 'express';
import { WebSocketServer } from 'ws';
import cors from 'cors';
import mongoose from 'mongoose';
import http from 'http'; // <-- Import the http module is crucial
import authRoutes from './routes/auth.js';  

const PORT = 8080;
// IMPORTANT: Add your actual MongoDB connection string here
const MONGO_URI = "mongodb://localhost:27017/";

// --- MongoDB Connection ---
mongoose.connect(MONGO_URI)
    .then(() => console.log('✅ MongoDB connected successfully.'))
    .catch(err => console.error('❌ MongoDB connection error:', err));

// --- Express App Setup ---
const app = express();
app.use(cors());
app.use(express.json());

// --- API Routes ---
app.use('/api/auth', authRoutes);

// --- Create an HTTP server from the Express app ---
const server = http.createServer(app);

// --- WebSocket Server Setup ---
const wss = new WebSocketServer({ server }); // Attach WebSocket server to the HTTP server

wss.on('connection', (ws) => {
  console.log('🔗 Frontend client connected to WebSocket');
  ws.on('close', () => console.log('🔌 Frontend client disconnected'));
});

// N8N Endpoint
app.post('/api/notify', (req, res) => {
  const messageFromN8N = req.body;
  console.log('📩 Received message from N8N:', JSON.stringify(messageFromN8N, null, 2));
  wss.clients.forEach((client) => {
    if (client.readyState === client.OPEN) client.send(JSON.stringify(messageFromN8N));
  });
  res.status(200).json({ status: 'Message broadcasted' });
});

// --- Start the main server ---
server.listen(PORT, () => {
  console.log(`🚀 Sylvi Server (HTTP + WebSocket) is live on http://localhost:${PORT}`);
});

