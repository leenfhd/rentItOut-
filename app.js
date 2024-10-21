const express = require('express');
const bodyParser = require('body-parser');
const rentalRoutes = require('./routes/rentals'); // Adjust the path as necessary
const notificationRoutes = require('./routes/notifications');
const app = express();
// const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());


app.use('/api/rentals', rentalRoutes);
app.use('/api/notifications', notificationRoutes);

const port = 3000;
const host = '192.168.88.9';  // Your machine's IP address

const server = app.listen(port, host, () => {
    console.log(`App listening at http://${host}:${port}/`);
});

// Set up Socket.IO
const io = require('socket.io')(server, {
    pingTimeout: 60000,
    cors: {
        origin: `http://${host}:${port}`,  // Allow connections from the same IP and port
        methods: ["GET", "POST"],
        credentials: true
    }
});