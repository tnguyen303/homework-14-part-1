const express = require("express");
const app = express();
//http package lets you run server without Express, socket.io requires more control that is provided with this package
const server = require("http").createServer(app);
const io = require("socket.io")(server);
const mongoose = require("mongoose");
const PORT = process.env.PORT || 3000;
const db = require("./models");
const bodyParser = require("body-parser");

// Sets up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

// parse application/json
app.use(bodyParser.json());

// Connect to the Mongo DB through mlab
// mongoose.connect(
//   // process.env.MONGODB_URI ||
//   "mongodb://user:123456a@ds121203.mlab.com:21203/heroku_zr357z2k",
//   { useNewUrlParser: true }
// );

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