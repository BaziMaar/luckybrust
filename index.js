const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const path = require('path');
const mongoose = require('mongoose');
const fs=require('fs');
require('dotenv').config();
const cors=require('cors');
const app = express();
const expressServer = http.createServer(app);
const io = socketIO(expressServer);
app.use(cors({ origin: '*' }));
// Serve HTML file for testing
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/index.html'));
});

const MONGODB_USERNAME = encodeURIComponent(process.env.MONGODB_USERNAME);
const MONGODB_PASSWORD = encodeURIComponent(process.env.MONGODB_PASSWORD);
const MONGODB_DBNAME = process.env.MONGODB_DBNAME;

// Check if the MongoDB URI is defined
if (!MONGODB_USERNAME || !MONGODB_PASSWORD || !MONGODB_DBNAME) {
  console.error('MongoDB connection details are incomplete. Please check your environment variables.');
  process.exit(1); // Exit the application if MongoDB URI is not defined
}

const MONGODB_URI = `mongodb+srv://${MONGODB_USERNAME}:${MONGODB_PASSWORD}@cluster0.zwwed4z.mongodb.net/${MONGODB_DBNAME}?retryWrites=true&w=majority`;

mongoose.connect(MONGODB_URI,{useUnifiedTopology: true, useNewUrlParser: true })
.then(console.log("mongodb connected successfully...."))
.catch(err =>console.log(err));

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
});

const walletRoute=require('./routes/walletRoute')
const userRoutes = require('./routes/userRoute');
const luckyRoute = require('./routes/luckyRoute');
app.use('/user', userRoutes);
app.use('/wallet',walletRoute);
app.use('/lucky',luckyRoute(io));
const EXPRESS_PORT = 3000;
expressServer.listen(EXPRESS_PORT, () => {
});

// Start Socket.IO on port 4000
const SOCKET_IO_PORT = 4000;
io.listen(SOCKET_IO_PORT);