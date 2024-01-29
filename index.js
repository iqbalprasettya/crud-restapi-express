const express = require("express");
const dotenv = require("dotenv");
const Boom = require("boom");
const fs = require("fs");

const app = express();
const Port = process.env.NODEJS_PORT || 3000;

// connect db.json
let dataBase = "assets/db.json";

// Import Routes
const User = require("./server/api/user");


dotenv.config();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Handling Invalid Input
app.use((error, req, res, next) => {
  if (error) {
    console.log(["API Request", "Invalid input", "ERROR"], { info: error });
    res.statusCode = 400;
    // Log Transaction
    const timeDiff = process.hrtime(req.startTime);
    const timeTaken = Math.round((timeDiff[0] * 1e9 + timeDiff[1]) / 1e6);
    const logData = {
      method: req.method,
      url: req.originalUrl || req.url,
      status: res.statusCode,
      timeTaken,
    };
    console.log(["API Request", "Invalid input", "info"], logData);
    return res.status(400).json(Boom.badRequest().output.payload);
  }

  next();
});

app.use((req, res, next) => {
  const oldSend = res.send;
  res.send = async (data) => {
    res.send = oldSend; // set function back to avoid the 'double-send'
    const statusCode = (data.output && data.output.statusCode) || res.statusCode;
    let bodyResponse = data;

    if (statusCode !== 200 && data.isBoom) {
      bodyResponse = data.output.payload;
    }

    const response = {
      statusCode,
      bodyResponse,
    };

    // Log Transaction
    const timeDiff = process.hrtime(req.startTime);
    const timeTaken = Math.round((timeDiff[0] * 1e9 + timeDiff[1]) / 1e6);
    const logData = {
      method: req.method,
      url: req.originalUrl || req.url,
      status: res.statusCode,
      timeTaken,
    };

    console.log(["API Request", "info"], logData);
    return res.status(response.statusCode).send(response.bodyResponse); // just call as normal with data
  };

  next();
});

// List Data - GET Method
// app.get("/user/list", (req, res) => {
//   const users = getUserData();
//   res.send(users);
// });

// Create Data - POST Method
// app.post("/user/add", (req, res) => {
//   // get the existing user data
//   const users = getUserData();
//   const userData = req.body;

//   // IF Data Null
//   if (userData.fullname == null || userData.username == null || userData.password == null) {
//     return res.status(400).send(Boom.badRequest("Missing parameter"));
//   }
//   // IF username is already
//   else if (users.some((u) => u.username === userData.username)) {
//     return res.status(409).send(Boom.conflict(`Username ${userData.username} has been used.`));
//   }

//   // Add the userData
//   users.push(userData);

//   // Save the new userData
//   saveUserData(users);
//   // Send Response
//   res.send("The account was created successfully.");
// });

// Update Data - PATCH Method
// app.patch("/user/update/:id", (req, res) => {
//   // Get the id from params and body
//   const paramID = parseInt(req.params.id);

//   // Get the userData
//   const userData = req.body;

//   // get the exist UserData
//   const existUsers = getUserData()

//   // IF id exist or not
//   if (!paramID) {
//     return res.status(400).send(Boom.badRequest("Invalid ID"));
//   }

//   // Filter the userData
//   const updateUser = existUsers.filter((e) => e.id !== paramID);
//   updateUser.push({ ...userData, id: paramID });

//   // save userData
//   saveUserData(updateUser);

//   // Send Response
//   res.status(201).send(updateUser);

// });

// read the user data from json file
const saveUserData = (data) => {
  fs.writeFileSync(dataBase, JSON.stringify(data));
};

//get the user data from json file
const getUserData = () => {
  return JSON.parse(fs.readFileSync(dataBase));
};

app.get("/", function (req, res) {
  res.send("Hello World!");
});

// Route middlewares
app.use("/user", User);

app.listen(Port, () => {
  console.log(["Info"], `Server started on port ${Port}`);
});
