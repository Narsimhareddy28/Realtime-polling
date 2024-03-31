const connectToMongo = require('./db');
const express = require('express');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');
const pollRoutes = require('./routes/polls');
const Comments = require('./routes/comments');


const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: '*', // Adjust this to your frontend URL
    methods: ['GET', 'POST'],
    credentials: true
  }
});
const port = process.env.PORT || 5000;
connectToMongo();
app.use(cors());
app.use(express.json());
app.use('/api/polls', pollRoutes(io));
app.use('/api/comments', Comments(io));

io.on('connection', (socket) => {
  console.log('A user connected');
  
  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});


// Available Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/studentauth', require('./routes/studentauth'));
app.use('/api/polls', require('./routes/polls'));
app.use('/api/pollResponses', require('./routes/pollResponses'));

server.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});

app.get('/done', (req, res) => {
  res.send('You are ready to go!');
});