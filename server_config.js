//This module contains configuration of libraries and port as well as the database templates for this application
const cookieSession = require('cookie-session');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const methodOverride = require('method-override');
const PORT = 8080;

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieSession({
  name: 'session',
  keys: ["tiniestApp", "anotherKey"],
}));
app.use(methodOverride('_method'));

let currentDate = new Date();

//Object storing all the shortened urls
const urlDatabase = {
  b6UTxQ: {
    longURL: "https://www.tsn.ca",
    userID: "aJ48lW",
    created: `${currentDate.getMonth() + 1}/${currentDate.getDate()}/${currentDate.getFullYear()}`,
    clicks: 0,
    visitors: []
  },
  i3BoGr: {
    longURL: "https://www.google.ca",
    userID: "aJ48lW",
    created: `${currentDate.getMonth() + 1}/${currentDate.getDate()}/${currentDate.getFullYear()}`,
    clicks: 0,
    visitors: []
  },
  thePed: {
    longURL: "https://www.pedicel.ca",
    userID: "theRaf",
    created: `${currentDate.getMonth() + 1}/${currentDate.getDate()}/${currentDate.getFullYear()}`,
    clicks: 0,
    visitors: []
  },
};

//Object storing all the users' ids, emails, and passwords
const users = {
  "userRandomID": {
    id: "userRandomID",
    email: "user@example.com",
    password: bcrypt.hashSync("purple-monkey-dinosaur", 10),
  },
  "aJ48lW": {
    id: "aJ48lW",
    email: "user2@example.com",
    password: bcrypt.hashSync("dishwasher-funk", 10),
  },
  "theRaf": {
    id: "theRaf",
    email: "rafays.siddiqui@gmail.com",
    password: bcrypt.hashSync("wasd", 10),
  }
};


module.exports = {
  app,
  PORT,
  urlDatabase,
  users,
  bcrypt,
  currentDate,
};