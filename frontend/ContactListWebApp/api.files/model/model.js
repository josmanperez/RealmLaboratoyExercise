/**
 * Contact class:
 * Represent a Schema in Realm App
 */
const Contact = {
  name: 'Contact',
  properties: {
    _id: 'objectId',
    _partition: 'string',
    firstName: 'string?',
    lastName: 'string?',
    // TODO: Add `age` as optional `int`
    //age: 'int?'
  },
  primaryKey: '_id',
};

/**
 * User class:
 * Represent a Schema in Realm App
 */
const User = {
  name: 'User',
  properties: {
    _id: 'objectId',
    _partition: 'string',
    name: 'string',
    email: 'string?'
  },
  primaryKey: '_id',
};

module.exports = {User, Contact}
