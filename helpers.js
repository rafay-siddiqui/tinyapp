//Random string generation and uniqueness check
const generateRandomString = () => {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let randomString = '';
  for (let i = 0; i < 6; i++) {
    randomString += chars[Math.floor(Math.random() * 62)];
  }
  return (randomString);
};

const uniqueStringGenerator = (database) => {
  const newUrl = generateRandomString();
  if (!database[newUrl]) {
    return newUrl;
  } else {
    uniqueStringGenerator(database);
  }
};

const emailLookup = (email, database) => {
  for (let user in database) {
    if (database[user].email === email) {
      return user;
    }
  }
  return undefined;
};

const getUserURLs = (user, database) => {
  let shortURLs = {};
  for (let link in database) {
    if (user === database[link].userID)
      shortURLs[link] = database[link].longURL;
  }
  if (shortURLs === {}) {
    return undefined;
  } else {
    return shortURLs;
  }
};

module.exports = {
  uniqueStringGenerator,
  emailLookup,
  getUserURLs,
};