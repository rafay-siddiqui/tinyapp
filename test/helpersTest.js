const { assert } = require('chai');

const { emailLookup, getUserURLs } = require('../helpers.js');

const testUsers = {
  "userRandomID": {
    id: "userRandomID",
    email: "user@example.com",
    password: "purple-monkey-dinosaur"
  },
  "user2RandomID": {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk"
  }
};

describe('getUserByEmail', function() {
  it('should return a user with valid email', function() {
    const user = emailLookup("user@example.com", testUsers)
    const expectedOutput = "userRandomID";
    assert.equal(user, expectedOutput);
  });
  it('should return undefined for a non-existent email', function() {
    const user = emailLookup("user6@example.com", testUsers)
    const expectedOutput = undefined;
    assert.equal(user, expectedOutput);
  });
});

const testDatabase = {
  b6UTxQ: {
    longURL: "https://www.tsn.ca",
    userID: "aJ48lW"
  },
  i3BoGr: {
    longURL: "https://www.google.ca",
    userID: "theRaf"
  },
  thePed: {
    longURL: "https://www.pedicel.ca",
    userID: "theRaf"
  },
};

describe('getUserURLs', function() {
  it('should return an object containing all the short URLs containing the user', function() {
    const urls = getUserURLs("theRaf", testDatabase);
    const expectedOutput = { i3BoGr: 'https://www.google.ca', thePed: 'https://www.pedicel.ca' };
    assert.deepEqual(urls, expectedOutput);
  });
  it('should return undefined if there are no URLs associated with the user', function() {
    const urls = getUserURLs("noOne", testDatabase);
    const expectedOutput = {};
    assert.deepEqual(urls, expectedOutput);
  });
});