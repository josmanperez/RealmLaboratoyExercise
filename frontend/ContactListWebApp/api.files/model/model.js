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
    age: 'string?'
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
