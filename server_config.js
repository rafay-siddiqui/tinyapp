//Configuration of libraries and port
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const PORT = 8080;

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());


//Object storing all the shortened urls
const urlDatabase = {
  b6UTxQ: {
    longURL: "https://www.tsn.ca",
    userID: "aJ48lW"
  },
  i3BoGr: {
    longURL: "https://www.google.ca",
    userID: "aJ48lW"
  },
  thePed: {
    longURL: "https://www.pedicel.ca",
    userID: "theRaf"
  },
};

//Object storing all the users' ids, emails, and passwords
const users = {
  "userRandomID": {
    id: "userRandomID",
    email: "user@example.com",
    password: "purple-monkey-dinosaur"
  },
  "aJ48lW": {
    id: "aJ48lW",
    email: "user2@example.com",
    password: "dishwasher-funk"
  },
  "theRaf": {
    id: "theRaf",
    email: "rafays.siddiqui@gmail.com",
    password: "wasd"
  }
};

//Random string generation and uniqueness check
const generateRandomString = () => {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let randomString = '';
  for (let i = 0; i < 6; i++) {
    randomString += chars[Math.floor(Math.random() * 62)];
  }
  return (randomString);
};

const uniqueStringGenerator = () => {
  const newUrl = generateRandomString();
  if (!urlDatabase[newUrl]) {
    return newUrl;
  } else {
    uniqueStringGenerator();
  }
};

const emailLookup = (email) => {
  for (let user in users) {
    if (users[user].email === email) {
      return user;
    }
  }
  return undefined;
};

const getUserURLs = (user) => {
  let shortURLs = {};
  for (let link in urlDatabase) {
    if (user === urlDatabase[link].userID)
      shortURLs[link] = urlDatabase[link].longURL;
  }
  return shortURLs;
};

//console.log(!urlDatabase["thePed"]);

module.exports = {
  app,
  PORT,
  urlDatabase,
  users,
  uniqueStringGenerator,
  emailLookup,
  getUserURLs,

};