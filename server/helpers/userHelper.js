const _ = require("lodash");
const fs = require("fs");

const dataBase = "assets/db.json";

// User List
const getUserList = async (dataObject) => {
  const { username } = dataObject;

  let pokemon = JSON.parse(fs.readFileSync(dataBase));

  if (!_.isEmpty(username)) {
    pokemon = _.filter(pokemon, (item) => item.username.toLowerCase() === username.toLowerCase());
  }

  return Promise.resolve(pokemon);
};

// create new user
const createNewUser = (userData) => {
  try {
    let pokemon = JSON.parse(fs.readFileSync(dataBase));
    pokemon.push(userData);
    fs.writeFileSync(dataBase, JSON.stringify(pokemon));
    return Promise.resolve(pokemon);
  } catch (error) {
    console.log(error);
  }
};

// delete user
const deleteUser = (id) => {
  try {
    console.log(id.id);
    let users = JSON.parse(fs.readFileSync(dataBase)).filter((user) => user.id !== id.id);
    fs.writeFileSync(dataBase, JSON.stringify(users));
    return Promise.resolve(users);
  } catch (error) {
    console.log(`Error deleting user: ${error}`);
  }
};

module.exports = {
  getUserList,
  createNewUser,
  deleteUser,
};
