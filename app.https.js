const https = require('https');
const fs = require('fs');
const express = require("express");
const pool = require('./database')
const mysql = require('mysql2/promise');

const app = express();
const cors = require("cors");

const fileUpload = require('express-fileupload')
app.use(fileUpload())

const listEndpoints = require('express-list-endpoints');
const bodyParser = require("body-parser");

app.use(express.json());
app.use(
  cors({
    origin: 'https://www.ntsendan.com',
  })
);


app.use('/public/uploads', express.static('public/uploads'));
app.use(bodyParser.urlencoded({ extended: true, limit: "50mb" }));
app.use(bodyParser.json({ limit: '10mb' }));
// config
if (process.env.NODE_ENV !== "PRODUCTION") {
  require("dotenv").config({
    path: "./config/.env",
  });
}


const connectDatabase = async () => {
  try {
    const connection = await mysql.createConnection({
      host: "127.0.0.1",
      port: 3306,
      user: "ntsendan_db",
      password: "XN5KFw5hiqsefiIf",
      database: "ntsendan",
    });

    console.log('Connected to the database!');
    return connection;
  } catch (error) {
    console.error('Error connecting to the database:', error);
    process.exit(1);
  }
};
connectDatabase()
// simple route
app.get("/", (req, res) => {
  console.log(req.body);
  res.json({ message: "Welcome to bezkoder application." });
});
// import routes

const userRoutes = require('./controllers/userController');
const postRoutes = require('./controllers/postController');
const categoryRoutes = require('./controllers/categoryController');
const imageRoutes = require('./controllers/imageController');
const staffRoutes = require('./controllers/staffController');
const messageRoutes = require('./controllers/messageController');

app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/staff', staffRoutes);
app.use('/api/messages', messageRoutes);

app.use((error, req, res, next) => {
  res.status(error.status || 500).json({ message: error.message });
});
//console.log(listEndpoints(app));

// it's for ErrorHandling
//app.use(ErrorHandler);


// create server
  const options = { 
  key: fs.readFileSync('/etc/ssl/ntsendan_com-key.pem'),
  cert: fs.readFileSync('/etc/ssl/ntsendan_com.pem'),
};
const server = https.createServer(options, app);
server.listen(process.env.PORT, process.env.IPAddress,  () => {
  console.log(
    `Server is running on https://${process.env.IPAddress}:${process.env.PORT}`
  );
});

// unhandled promise rejection
process.on("unhandledRejection", (err) => {
  console.log(`Shutting down the server for ${err.message}`);
  console.log(`shutting down the server for unhandle promise rejection`);

  server.close(() => {
    process.exit(1);
  });
});

module.exports = app;
