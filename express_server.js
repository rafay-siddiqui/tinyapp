const {
  app,
  PORT,
  urlDatabase,
  users,
  uniqueStringGenerator,
  emailLookup,
  getUserURLs,

} = require('./server_config');

// /url page render and root page redirection
app.get("/", (req, res) => {
  res.redirect("/urls");
});

app.get("/urls", (req, res) => {
  const userID = req.cookies.user_id;
  const templateVars = {
    user: users[userID],
    urls: getUserURLs(userID),
    userID,
  };
  if (userID) {
  res.render('urls_index', templateVars);
  } else {
    res.status(401).send("Error 401: Unauthorized Client Acces\n")
  }
});

//Create new URL form submission and redirection to shortURL page
app.post('/urls', (req, res) => {
  const newUrl = uniqueStringGenerator();
  if (req.cookies.user_id) {
    urlDatabase[newUrl] = {
      longURL: req.body.longURL,
      userID: req.cookies.user_id,
    };
    res.redirect(`/urls/${newUrl}`);
  } else {
    return res.status(401).send("Error 401: Unauthorized Client Access\n");
  }
});

app.get('/urls/new', (req, res) => {
  const templateVars = {
    user: users[req.cookies.user_id],
  };
  if (req.cookies.user_id) {
    res.render('urls_new', templateVars);
  } else {
    res.redirect('/login');
  }
});

//Short URL Page
app.get('/urls/:shortURL', (req, res) => {
  const templateVars = {
    user: users[req.cookies.user_id],
    shortURL: req.params.shortURL,
    longURL: urlDatabase[req.params.shortURL].longURL,
  };
  res.render('urls_show', templateVars);
});

//Update URL
app.post('/urls/:id', (req, res) => {
  urlDatabase[req.params.id].longURL = req.body.longURL;
  res.redirect('/urls');
});

//Delete URL
app.post('/urls/:shortURL/delete', (req, res) => {
  delete urlDatabase[req.params.shortURL];
  res.redirect('/urls');
});

//Short URL Redirection
app.get("/u/:shortURL", (req, res) => {
  if (!urlDatabase[req.params.shortURL]) {
    return res.status(404).send("Error 404: Short URL Not Found");
  }
  const longURL = urlDatabase[req.params.shortURL].longURL;
  res.redirect(longURL);
});

//Email Log in GET and POST cookie handling
app.get('/login', (req, res) => {
  const templateVars = {
    user: users[req.cookies.user_id],
  };
  res.render('login', templateVars);
});

app.post('/login', (req, res) => {
  if (!emailLookup(req.body.email)) {
    return res.status(403).send("Error 403: No Account With Given Email");
  }
  let user = emailLookup(req.body.email);
  if (req.body.password !== users[user].password) {
    console.log("given:", req.body.password, "actual:", users[user].password);
    return res.status(403).send("Error 403: Incorrect Password");
  }
  res.cookie('user_id', user);
  res.redirect('/urls');
});

//Email Log out POST cookie clearing
app.post('/logout', (req, res) => {
  res.clearCookie("user_id");
  res.redirect('/urls');
});

//Registration page
app.get('/register', (req, res) => {
  const templateVars = {
    user: users[req.cookies.user_id],
  };
  res.render('register', templateVars);
});

//Store New User
app.post('/register', (req, res) => {
  const newUser = uniqueStringGenerator();
  if (!req.body.email || !req.body.password) {
    return res.status(400).send("Error 400: Empty Email or Password");
  } else if (emailLookup(req.body.email)) {
    return res.status(400).send("Error 400: Email already registered");
  }
  users[newUser] = {
    id: newUser,
    email: req.body.email,
    password: req.body.password,
  };
  res.cookie('user_id', newUser);
  res.redirect('/urls');
});

//Server listens for client requests
app.listen(PORT, () => {
  console.log(`Example app is listening on ${PORT}!`);
});