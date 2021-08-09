//Configuration of libraries and port
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser')
const PORT = 8080;

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());


//Object storing all the shortened urls
const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

//Object storing all the users' ids, emails, and passwords
const users = { 
  "userRandomID": {
    id: "userRandomID", 
    email: "user@example.com", 
    password: "purple-monkey-dinosaur"
  },
 "user2RandomID": {
    id: "user2RandomID", 
    email: "user2@example.com", 
    password: "dishwasher-funk"
  },
  "theRaf": {
    id: "theRaf", 
    email: "rafays.siddiqui@gmail.com", 
    password: "wasd"
  }
}

//Random string generation and uniqueness check
function generateRandomString() {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let randomString = '';
  for (let i=0; i < 6; i++) {
    randomString += chars[Math.floor(Math.random()*62)]
  };
  return(randomString);
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

module.exports = {
express,
app,
bodyParser,
cookieParser,
PORT,
urlDatabase,
users,
generateRandomString,
uniqueStringGenerator,
emailExists,
emailLookup,

};