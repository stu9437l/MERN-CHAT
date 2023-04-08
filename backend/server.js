const express = require("express");
const app = express();
const dotenv = require("dotenv");
const DBConnection = require("../backend/config/db");
const ErrorHandling = require("./middleware/errorHandling");
dotenv.config();
const router = require("./routes/index");
const bodyParser = require("body-parser");
const path = require("path");

//parse the req data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//for static files

app.use(express.static(path.join(__dirname, "public")));

// application level middlewares
app.use(router);
app.use(ErrorHandling);

//database connection
DBConnection();

//server listen
const PORT = 3001;
app.listen(PORT, () => {
  console.log("server is running on port:" + PORT);
});
