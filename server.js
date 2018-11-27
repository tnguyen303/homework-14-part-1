const express = require("express");
const app = express();
//http package lets you run server without Express, socket.io requires more control that is provided with this package
const server = require("http").createServer(app);
const io = require("socket.io")(server);
const mongoose = require("mongoose");
const PORT = process.env.PORT || 3000;
const db = require("./models");
const bodyParser = require("body-parser");
const { Client } = require('pg');

// Sets up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

// parse application/json
app.use(bodyParser.json());

require("./sockets/todolist-sockets")(io);
require("./routes/html-routes")(app);
require("./routes/api-routes")(app);

server.listen(PORT, function() {
  console.log(`Server listening on PORT ${PORT}`);
});

// Starts the server to begin listening
db.sequelize.sync({ force: true }).then(function() {
  app.listen(PORT, function() {
    console.log("App listening on PORT " + PORT);
  });
});

const client = new Client({
  connectionString: "postgres://nawejhzthcupab:514297fa0de16a12e47c4f58e7b1fb5831237317b12849844499e81d537b4381@ec2-23-21-201-12.compute-1.amazonaws.com:5432/dbfm99geb942eu" 
  // ||
  // "dbname=dbfm99geb942eu host=ec2-23-21-201-12.compute-1.amazonaws.com port=5432 user=nawejhzthcupab password=514297fa0de16a12e47c4f58e7b1fb5831237317b12849844499e81d537b4381 sslmode=require"
  ,
  ssl: true,
});

client.connect();

client.query('SELECT table_schema,table_name FROM information_schema.tables;', (err, res) => {
  if (err) throw err;
  for (let row of res.rows) {
    console.log(JSON.stringify(row));
  }
  client.end();
});