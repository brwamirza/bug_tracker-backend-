const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();

// var corsOptions = {
//   origin: "http://localhost:8080"
// };

app.use(cors());

// parse requests of content-type - application/json
app.use(bodyParser.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// routes
require('./routes/auth.routes')(app);
require('./routes/user.routes')(app);
require('./routes/project.routes')(app);
require('./routes/ticket.routes')(app);

const db = require("./models");

db.sequelize.sync().then(() => {
  console.log('Drop and Resync Db');
});

app.get("/", (req, res) => {
  res.json({ message: "Welcome to brwa application." });
});

// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});