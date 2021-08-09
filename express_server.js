const { 
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

} = require('./server_config');

// /url page render and root page redirection
app.get("/", (req, res) => {
  res.redirect("/urls")
});

app.get("/urls", (req, res) => {
  const templateVars = { 
    user: users[req.cookies.user_id],
    urls: urlDatabase 
  };
  res.render('urls_index', templateVars);
});

//Create URL form submission and redirection to shortURL page
app.post('/urls',(req, res) => {
  const newUrl = uniqueStringGenerator();
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
  res.clearCookie("user_id");
  res.redirect('/urls');
});

//Registration page
app.get('/register', (req, res) => {
  res.render('register');
});

//Store New User
app.post('/register', (req, res) => {
  const new_user = uniqueStringGenerator();
  if (!req.body.email || !req.body.password) {
    return res.status(400).send("Error 400: Bad Request");
  }
  console.log(emailExists(req.body.email));
  users[new_user] = {
    id: new_user,
    email: req.body.email,
    password: req.body.password,
  }
  res.cookie('user_id', new_user);
  res.redirect('/urls');
  console.log(users);
});

//Server listens for client requests
app.listen(PORT, () => {
  console.log(`Example app is listening on ${PORT}!`);
});