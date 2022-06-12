const express = require("express");
const BSON = require("bson");
const {User, Contact} = require('../model/model');

var isListener = false;

const router = express.Router();

/**
 * ** ROUTES **
 */

/**
 * Get Contact List
 */
router.get('/', async (req, res) => {
  const contacts = await read().then((contacts)=>{
    console.log(`Numero de contactos ${contacts.length}`);
    res.send(contacts);
  }).catch(err => {
    console.error("Failed to execute in:", err);
    res.status(400).send(`Failed to execute in ${err}`);
  });
});

/**
 * Add Contact
 */
router.post('/', async (req, res) => {
  if (!("firstName" in req.body) || !("lastName" in req.body)) {
    res.status(400).send("Missing first name or last name variables");
  } else {
    await save(req.body).then(()=>{
      socket.emit("contact", "new contact created");
      res.status(201).send();
    }).catch(err => {
      console.error("Failed to save contact", err);
      res.status(400).send(`Failed to execute in ${err}`);
    });
  }
});

/**
 * Update contact 
 * */ 
router.put('/', async (req, res) => {
  if (!("firstName" in req.body) || !("lastName" in req.body) || !("_id" in req.body)) {
    res.status(400).send("Missing firstName, lastName or id variables");
  } else {
    await update(req.body).then(()=>{
      socket.emit("contact", "contact updated");
      res.status(200).send();
    }).catch(err => {
      console.error("Failed to update contact", err);
      res.status(503).send(err);
    });
  }
});

/**
 * Delete Contact
 */
router.delete('/', async (req, res) => {
  if (!("_id" in req.body)) {
    res.status(400).send("Missing id variable");
  } else {
    await remove(req.body).then(() =>{
      socket.emit("contact", "contact deleted");
      res.status(204).send();
    }).catch(err => {
      console.error("Failed to delete contact", err);
      res.status(503).send(err);
    });
  }
});

/**
 * ** AUXILIAR FUNCTIONS **
 */

/**
 * Function to open a Realm and stores it globally
 * @returns An instance of Realm (anonymous or of the user logged in)
 */
 async function openRealm() {
  if (app.currentUser == null) {
    throw 'User not validated';
  } else {
    /**
     * TODO: - Open a Realm
     * To open a partition based realm we need to: 
     * 1) Create a `config` object with:
     *  - Object Schema
     *  - Sync object with `user` and `partitionValue`
     * 2) Open a realm with `Realm.open(config)` surrounded by a `try-catch` block
     * 3) Return the opened Realm if succeed
     * https://www.mongodb.com/docs/realm/sdk/node/examples/open-and-close-a-realm/#open-a-partition-based-synced-realm
     */
    // Create a config object for the Schema `Contact` and `User`
    // We are going to use the logged user
    // And the partition value would be the `id` of the user which can be accessed through `app.currentUser.id` 
    const config = {
      schema: [Contact, User],
      sync: {
        user: app.currentUser,
        partitionValue: app.currentUser.id,
      },
    };
    try {
      return await Realm.open(config);
    } catch (err) {
      console.log("failed to open realm", err.message);
      throw err.message;
    }
  }
}

/**
 * Function to read the list of Contacts for a certain user partition
 * @returns {List<Contact>} List of Contacts
 */
 async function read() {
  console.log("READ");
  const realm = await openRealm();
  /**
   * TODO: - Read objects in a Realm
   * To read objects we need to: 
   * 1) Open a the Schema on the Realm
   * 2) Sort the objects based on a criteria
   * 3) Return the objects
   * https://www.mongodb.com/docs/realm/sdk/node/examples/read-and-write-data/#filter-queries
   * https://www.mongodb.com/docs/realm/sdk/node/examples/read-and-write-data/#sort-query-results
   * https://www.mongodb.com/docs/realm/sdk/node/examples/react-to-changes/#register-a-realm-change-listener
   */
  const contacts = realm.objects('Contact').sorted('firstName');
  if (!isListener) {
    contacts.addListener(listener)
    isListener = true;
  }
  return contacts;
};

/**
 * Function to save a new Contact in the private Realm of the user
 * @param {JSON Object with the properties of the Contact} body 
 * - TODO: Add `age` as `parseInt`: parseInt(body.age) || -1;
 */
 async function save(body) {
  console.log("SAVE");
  const realm = await openRealm();
  const age = parseInt(body.age) || -1;
  /**
   * TODO: - Create a contact
   * To create a contact we need to: 
   * 1) In a `write` transaction create a new object in the opened realm
   * 2) Add the properties of the new object inside the create
   * https://www.mongodb.com/docs/realm/sdk/node/examples/read-and-write-data/#create-a-new-object
   */
  realm.write(() => {
    realm.create('Contact',{
      _id: new BSON.ObjectID(),
      _partition: "12345", //app.currentUser.id,
      firstName: body.firstName,
      lastName: body.lastName,
      age: (age != -1) ? age : null
    });
  });
};

/**
 * Function to update a Contact
 * @param {Object} body the Contact Object to be updated 
 * @returns {Contact} the new updated Contact
 * - TODO: Add `age` as `parseInt`: parseInt(body.age) || -1;
 */
async function update(body) {
  console.log("UPDATE");
  const realm = await openRealm();
  let id = new BSON.ObjectID(body._id);
  const age = parseInt(body.age) || -1;
  /**
   * TODO: - Update a contact
   * To update a contact we need to: 
   * 1) Get the contact object we want to update by using `objectForPrimaryKey` and the `id`
   * 2) Modifying the desired properties in a `write` operation
   * 3) Return the updated contact
   * https://www.mongodb.com/docs/realm/sdk/node/examples/read-and-write-data/#update-an-object
   */
  const updatedContact = realm.write(() => {
    const contact = realm.objectForPrimaryKey('Contact',id)
    contact.firstName = body.firstName
    contact.lastName = body.lastName
    if (age != -1) {
      contact.age = age
    }
  });
  return updatedContact;
}

/**
 * Function to delete a Contact
 * @param {string} body the id of the contact to be deleted 
 */
 async function remove(body) {
  console.log("DETELE");
  const realm = await openRealm();
  let id = new BSON.ObjectID(body._id);
  /**
   * TODO: - Delete a contact
   * To delete a contact we need to: 
   * 1) Get the contact object we want to delete by using `objectForPrimaryKey` and the `id`
   * 2) Delete the contact object in a `write` transaction
   * https://www.mongodb.com/docs/realm/sdk/node/examples/read-and-write-data/#delete-an-object
   */
  realm.write(() => {
    const contact = realm.objectForPrimaryKey('Contact',id)
    realm.delete(contact)
  });
}

/**
 * Function to clear the listener when the user logout
 */
var clearListener = async function() {
  console.log('clear listener');
  try {
    const realm = await openRealm();
    const contacts = realm.objects("Contact").sorted("firstName");
    contacts.removeListener(listener);
    isListener = false; 
  } catch (error) {
    console.log(error.message)
  }
} 

/**
 * The listener for changes
 * @param {contacts} contacts 
 * @param {*} changes 
 */
function listener(contacts, changes) {
  changes.insertions.forEach((index) => {
    console.log(`insert index: ${index}`);
    let contact = contacts[index];
    console.log("new contact: " + JSON.stringify(contact));
    socket.emit("add:contact", {
      contact: contact,
      message: "New contact added"
    });
  });
  changes.modifications.forEach((index) => {
    console.log(`update index: ${index}`);
    let contact = contacts[index];
    console.log("updated contact: " + JSON.stringify(contact));
    socket.emit("update:contact", {
      contact: contact,
      message: "Contact updated"
    });
  });
  changes.deletions.forEach((index) => {
    console.log(`deletion index: ${index}`);
    socket.emit("delete:contact", {
      contact: null,
      message: "Contact deleted"
    });
  });
}

module.exports = {
  router: router,
  clearListener: clearListener
}