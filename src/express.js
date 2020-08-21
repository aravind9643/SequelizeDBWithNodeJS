const express = require("express");
const bodyParser = require("body-parser");
var cookieParser = require("cookie-parser");
var session = require("express-session");

var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  session({
    resave: true,
    saveUninitialized: true,
    secret: "secret@session",
    cookie: { maxAge: 60000 }
  })
);
app.listen(3000);

// app.get('/', (req, res) => {
//     req.headers.user_token
// })

module.exports = { app };
