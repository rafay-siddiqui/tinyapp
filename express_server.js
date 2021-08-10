const {
  app,
  PORT,
  urlDatabase,
  users,
  bcrypt,
  currentDate,
} = require('./server_config');

const {
  uniqueStringGenerator,
  emailLookup,
  getUserURLs,
} = require('./helpers');

//
// URLs Index Page [GET /, GET /URLS]
//
app.get('/', (req, res) => {
  if (req.session.user_id) {
    res.redirect('/urls');
  } else {
    res.redirect('/login');
  }
});

app.get('/urls', (req, res) => {
  const userID = req.session.user_id;
  const templateVars = {
    user: users[userID],
    urls: getUserURLs(userID, urlDatabase),
    userID,
    //passing in the urlDatabase to refer to date, clicks, and unique visitor properties
    urlDatabase,
  };
  if (!userID) {
    res.status(401);
  }
  res.render('urls_index', templateVars);
});

//
// New URL Creation [GET URLS/NEW, POST /URLS]
//
app.get('/urls/new', (req, res) => {
  const templateVars = {
    user: users[req.session.user_id],
  };
  if (req.session.user_id) {
    res.render('urls_new', templateVars);
  } else {
    //http error message 401 is in response but browser redirects to /login
    res.status(401);
    res.redirect('/login');
  }
});

app.post('/urls', (req, res) => {
  const newUrl = uniqueStringGenerator(urlDatabase);
  if (req.session.user_id) {
    //adding object properties for tracking date, clicks, and unique visitors
    urlDatabase[newUrl] = {
      longURL: req.body.longURL,
      userID: req.session.user_id,
      created: `${currentDate.getMonth() + 1}/${currentDate.getDate()}/${currentDate.getFullYear()}`,
      clicks: 0,
      visitors: [],
    };
    console.log(urlDatabase);
    res.redirect(`/urls/${newUrl}`);
  } else {
    return res.status(401).send("Error 401: Unauthorized Client Access, Please Log In\n");
  }
});

//
//ShortURL Info Page [GET /URLS/:ID]
//
app.get('/urls/:id', (req, res) => {
  if (!urlDatabase[req.params.id]) {
    return res.status(404).send("Error 404: Short URL Not Found");
  }
  const templateVars = {
    user: users[req.session.user_id],
    id: req.params.id,
    longURL: urlDatabase[req.params.id].longURL,
    urlDatabase,
  };
  res.render('urls_show', templateVars);
});

//
//Update URL Page [PUT /URLS/:ID]
//
app.put('/urls/:id', (req, res) => {
  const user = req.session.user_id;
  if (getUserURLs(user, urlDatabase)[req.params.id]) {
    urlDatabase[req.params.id].longURL = req.body.longURL;
    res.redirect('/urls');
  } else {
    return res.status(401).send("Error 403: Unauthorized Access to Edit Selected URL\n");
  }
});

//
//Delete URL Page [DELETE /URLS/:ID/DELETE]
//
app.delete('/urls/:id', (req, res) => {
  const user = req.session.user_id;
  //checking if a shortURL exists in a user's URLs
  if (getUserURLs(user, urlDatabase)[req.params.id]) {
    delete urlDatabase[req.params.id];
    res.redirect('/urls');
  } else {
    return res.status(401).send("Error 403: Unauthorized Access to Edit Selected URL\n");
  }
});

//
// Short URL Redirection [GET /U/:ID]
//
app.get('/u/:id', (req, res) => {
  if (!urlDatabase[req.params.id]) {
    return res.status(404).send("Error 404: Short URL Not Found");
  }
  const longURL = urlDatabase[req.params.id].longURL;
  urlDatabase[req.params.id].clicks += 1;
  if (users[req.session.user_id] && !(urlDatabase[req.params.id].visitors).includes(users[req.session.user_id].email)) {
    (urlDatabase[req.params.id].visitors).push(users[req.session.user_id].email);
  }
  res.redirect(longURL);
});

//
// Log in, log out, and registration [GET /LOGIN, POST /LOGIN, POST /LOGOUT, GET /REGISTER, POST /REGISTER]
//
app.get('/login', (req, res) => {
  if (users[req.session.user_id]) {
    return res.redirect('/urls');
  }
  const templateVars = {
    user: users[req.session.user_id],
  };
  res.render('login', templateVars);
});

app.post('/login', (req, res) => {
  if (!emailLookup(req.body.email, users)) {
    return res.status(403).send("Error 403: No Account With Given Email");
  }
  let user = emailLookup(req.body.email, users);
  if (!bcrypt.compareSync(req.body.password, users[user].password)) {
    return res.status(403).send("Error 403: Incorrect Password");
  }
  req.session.user_id = user;
  res.redirect('/urls');
});

app.post('/logout', (req, res) => {
  req.session.user_id = null;
  res.redirect('/urls');
});

app.get('/register', (req, res) => {
  if (users[req.session.user_id]) {
    return res.redirect('/urls');
  }
  const templateVars = {
    user: users[req.session.user_id],
  };
  res.render('register', templateVars);
});

app.post('/register', (req, res) => {
  const newUser = uniqueStringGenerator(urlDatabase);
  if (!req.body.email || !req.body.password) {
    return res.status(400).send("Error 400: Empty Email or Password");
  } else if (emailLookup(req.body.email, users)) {
    return res.status(400).send("Error 400: Email already registered");
  }
  users[newUser] = {
    id: newUser,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 10),
  };
  req.session.user_id = newUser;
  res.redirect('/urls');
});

//
//Server listens for client requests
//
app.listen(PORT, () => {
  console.log(`Example app is listening on ${PORT}!`);
});