const Router = require("express").Router();

const Validation = require("../helpers/validationHelper");
const UserHelper = require("../helpers/userHelper");
const GeneralHelper = require("../helpers/generalHelper");

const fileName = "server/api/user.js";

const dataBase = "assets/db.json";

// User List
const list = async (request, reply) => {
  try {
    Validation.userListValidation(request.query);

    const { username } = request.query;
    const response = await UserHelper.getUserList({ username });

    return reply.send(response);
  } catch (error) {
    console.log([fileName, "list", "ERROR"], { info: `${error}` });
    return reply.send(GeneralHelper.errorResponse(error));
  }
};

// Post User
const create = async (request, reply) => {
  try {
    // Check if user already exists
    const data = await UserHelper.createNewUser(request.body);
    return reply.send(data);
  } catch (error) {
    console.log([fileName, "create", "ERROR"], { info: `Error in creating a new user ${error}` });
    return reply.send(GeneralHelper.errorResponse(error));
  }
};

//  Delete User
const remove = async (request, reply) => {
  try {
      const { id } = request.query;
      const response = await UserHelper.deleteUser({ id });
      return reply.send(response);
  } catch (err) {
      return reply.send(GeneralHelper.errorResponse(err));
  }
}

//  Update User
const update =   async (request, reply) => {
  try {
    let body = request.body;
    delete body.id;
    const { id } = request.params;
    
    const updatedData = await UserHelper.updateUser(id, body);
    return reply.code(201).send(updatedData);
  } catch (err) {
    return reply.status(400).send(GeneralHelper.errorResponse(err,"Bad Request"));
  }
}


Router.get("/list", list);
Router.post("/post", create);
Router.delete("/delete", remove);
Router.patch("/update", update);

module.exports = Router;
