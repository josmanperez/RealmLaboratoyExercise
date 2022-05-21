exports = async function createNewUser({user}) {
  
  console.log(JSON.stringify(user));
  const dbName = context.values.get('db_name');
  const users = context.services.get('mongodb-atlas').db(dbName).collection("User");
  const email = user.data.email == undefined ? "" : user.data.email;
  const name = user.data.name == undefined ? "" : user.data.name;

  return users.insertOne({
    _id: BSON.ObjectId(user.id),
    _partition: user.id,
    email: email,
    name: name
  });
};