//Configuration of libraries and port
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser')
const PORT = 8080;

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());


const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

//Random string generation and uniqueness check
function generateRandomString() {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let randomString = '';
  for (let i=0; i < 6; i++) {
    randomString += chars[Math.floor(Math.random()*62)]
  };
  return(randomString);
};

const uniqueStringCheck = () => {
  const newUrl = generateRandomString();
  if (!urlDatabase[newUrl]) {
    return newUrl;
  } else {
    uniqueStringCheck();
  }
};

// /url page render and root page redirection
app.get("/", (req, res) => {
  res.redirect("/urls")
});

app.get("/urls", (req, res) => {
  const templateVars = { 
    username: req.cookies["username"],
    urls: urlDatabase 
  };
  res.render('urls_index', templateVars);
});

//Create URL form submission and redirection to shortURL page
app.post('/urls',(req, res) => {
  const newUrl = uniqueStringCheck();
  urlDatabase[newUrl] = req.body.longURL;
  res.redirect(`/urls/${newUrl}`);
});

app.get('/urls/new', (req, res) => {
  const templateVars = {
    username: req.cookies["username"],
  };
  res.render('urls_new', templateVars);
})

//Short URL Page
app.get('/urls/:shortURL', (req, res) => {
  const templateVars = {
    username: req.cookies["username"], 
    shortURL: req.params.shortURL, 
    longURL: urlDatabase[req.params.shortURL]
  };
  res.render('urls_show', templateVars);
});

//Update URL
app.post('/urls/:id', (req, res) => {
  urlDatabase[req.params.id] = req.body.longURL
  res.redirect('/urls');
});

//Short URL Redirection
app.get("/u/:shortURL", (req, res) => {
  const longURL = urlDatabase[req.params.shortURL]
  res.redirect(longURL);
});

app.post('/urls/:shortURL/delete', (req, res) => {
  delete urlDatabase[req.params.shortURL];
  res.redirect('/urls');
});

//Username Log in POST cookie handling
app.post('/login',(req, res) => {
  res.cookie("username", req.body.username)
  res.redirect('/urls');
})

//Username Log out POST cookie clearing
app.post('/logout', (req, res) => {
  res.clearCookie("username");
  res.redirect('/urls');
});

//Server listens for client requests
app.listen(PORT, () => {
  console.log(`Example app is listening on ${PORT}!`);
});