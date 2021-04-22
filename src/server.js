require("rootpath")();
const express = require("express");
const app = express();
const cors = require("cors");
const path = require("path")
const bodyParser = require("body-parser");
const errorHandler = require("./middleware/error-handler");
const exphbs = require('express-handlebars');
const port = process.env.PORT || 8080;
app.engine("handlebars", exphbs());
app.set("view engine", "handlebars");
app.set("views", __dirname + "/views");
app.use(express.static(__dirname + '/static'));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

// api routes
app.use("/users", require("./users/users.controller"));
app.use("/staffs", require("./staffs/staffs.controller"));

// global error handler
app.use(errorHandler);

// html
app.use(express.static(path.join(__dirname, "web")));

// start server
app.listen(port, () => {
  console.log(`E-BookStore app listening at http://localhost:${port}`);
});
