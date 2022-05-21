const express = require("express");
const BSON = require('bson');
require('dotenv').config();
const { User, Contact } = require('../model/model');
const contacts = require('./contacts.js');

const router = express.Router();

/**
 * ** ROUTES **
 */

/**
 * GET IF USER IS CONNECCTED
 */
router.get("/connected", async (req, res) => {
  console.log("Is user connected?");
  if (app.currentUser == null) {
    console.log("no user connected");
    res.status(404).send("Not user connected");
  } else {
    openRealm().then((realm) => {
      const user = realm.objectForPrimaryKey("User", BSON.ObjectId(app.currentUser.id));
      console.log(`user ${user.name} is connected`);
      res.status(200).send(user);
    }).catch(err => {
      console.log(`Error opening the realm ${err.message}`);
      res.status(503).send(err.message);
    });
  }
});

/**
 * Route to log in
 */
router.post("/signin", async (req, res) => {
  if (!("email" in req.body) || !("pass" in req.body)) {
    res.status(400).send("Missing email/pass");
  } else {
    try {
      const user = await emailSignIn(req.body);
      res.status(200).send(`User id: ${user.id} logged in`);
    } catch (error) {
      console.error(error);
      res.status(400).send(`${error.message}`);
    }
  }
});

/**
 * Register with email and password
 * @param {} req - The request 
 * @param {} res - The response to send back
 */
router.post("/register", async (req, res) => {
  if (!("email" in req.body) || !("pass" in req.body)) {
    res.status(400).send("Missing email/pass");
  } else {
    /**
     * To register a new user with email and password, we need to
     * 1) Call `registerUser` with email and password
     * 2) If success, call `emailSignIn` to log in with the new created user
     * https://www.mongodb.com/docs/realm/sdk/node/examples/manage-email-password-users/#register-a-new-user-account
     */
    registerUser(req.body.email, req.body.pass)
      .then(() => {
        emailSignIn(req.body)
          .then(user => {
            res.status(200).send(`User id: ${user.id} logged in`);
          })
          .catch(err => {
            console.log(err);
            res.status(400).send(`Error: ${err.message}`);
          })
      })
      .catch(error => {
        console.log(error);
        res.status(400).send(`Error: ${error}`);
      });
  }
});

/**
 * Logout
 */
router.post("/logout", async (req, res) => {
  const success = await logOut();
  if (success) {
    res.status(200).send();
  } else {
    res.status(400).send("Can not log out the user");
  }
});

/**
 * ** AUXILIAR FUNCTIONS **
 */

/**
 * Register a user with email/password. The authentication mechanism is already activated in the Realm Application
 * https://www.mongodb.com/docs/realm/sdk/node/examples/manage-email-password-users/#register-a-new-user-account
 * @param {String} email 
 * @param {String} password 
 */
async function registerUser(email, password) {
  throw new Error('RegisterUser not yet implemented');
  try {
    // 1. Call `emailPasswordAuth.registerUser` with the parameters email/password. Be aware that this methods need 
    // to `await` because it is an asynchronous operation
  } catch (err) {
    throw err;
  }
}

/**
 * Log in with email/password
 * @param {Object} body Object with the username and password 
 * @returns {User} the user object
 */
async function emailSignIn(body) {
  console.log("Email/Pass SigIn");
  /**
   * TODO: - Authenticate a user
   * To authenticate a user with email/password we need to:
   * 1) Create a `Credentials` Object.
   * 2) Call `emailPassword` method in Realm.Credentials with `body.email` and `body.pass`
   * 3) Return the user if success 
   * https://www.mongodb.com/docs/realm/sdk/node/examples/authenticate-users/#email-password-user
   */
  throw new Error('LogIn not implemented');
  // 1. Create a Credentials object with `emailPassword`
  try {
    // 2. Use the `logIn` method with the previous credentials object created and assign it to a user
    // 3. Return the user
  } catch (err) {
    throw err
  }
}

/**
 * Function to open a Realm and stores it globally
 * @returns An instance of Realm (anonymous or of the user logged in)
 * TODO: - Open a Realm
 * https://www.mongodb.com/docs/realm/sdk/node/quick-start/#open-a-realm
 */
async function openRealm() {
  console.log(`open a Realm for user with partition: ${app.currentUser.id}`);
  throw new Error('Open Realm not implemented');
  // 1. Create a config object
  const config = {
  // 1. The schema is going to be `Contacts` and `User`
  // 2. For the sync property:
  //    1. The user is the current user 
  //    2. The partition value is the `id` of the `currentUser`
  };
  try {
    // 2. `await` and `open` the config created. 
  } catch (err) {
    console.log("failed to open realm", err.message);
    throw err.message;
  }
}

/**
 * Log out function
 * @returns {boolean} whether the user logged out with success
 */
async function logOut() {
  console.log("LogOut");
  if (app.currentUser != null) {
    if (contacts !== undefined) {
      await contacts.clearListener();
      await app.currentUser.logOut();
      return true;
    } else {
      return false
    }
  } else {
    return false;
  }
}

module.exports = router;