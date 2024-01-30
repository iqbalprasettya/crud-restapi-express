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
const deleteUser = (dataObject) => {
  const { id } = dataObject;
  try {
    let userData = JSON.parse(fs.readFileSync("./assets/db.json"));
    userData = _.reject(userData, { id: Number(id) });
    fs.writeFileSync("./assets/db.json", JSON.stringify(userData));
    return getUserList({}); //return the updated list of users
  } catch (err) {
    throw err;
  }
};
// Update Data User
// const update =   async (request, reply) => {
//   try {
//     let body = request.body;
//     delete body.id;
//     const { id } = request.params;
    
//     const updatedData = await UserHelper.updateUser(id, body);
//     return reply.code(201).send(updatedData);
//   } catch (err) {
//     return reply.status(400).send(GeneralHelper.errorResponse(err,"Bad Request"));
//   }
// }
const updateUser  =  (id , body ) => {  
  if (!Number(id)) {
    throw "Invalid ID";
  } else if(!body || typeof body !== 'object'){
    throw "No Body Provided or it is not an object" ;
  }else{
    return new Promise((reslove, reject)=>{
      setTimeout(()=>{
        reslove(_.findWhere(users, {id : id}));
      },500)
    })
  }
}


//     fs.writeFileSync("./assets/db.json", JSON.stringify(userDelete));
//     return Promise.resolve(userDelete);
//   } catch (error) {
//     console.log(error);
//   }
// };

module.exports = {
  getUserList,
  createNewUser,
  deleteUser,
  updateUser,
};
