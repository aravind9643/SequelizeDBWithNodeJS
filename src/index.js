const { app } = require("./express");
// const {
//   getAllUsers,
//   getUserById,
//   insertUser,
//   deleteUser,
//   updateUserId
// } = require("./users");
const {
  registerUser,
  authenticateUser,
  getRegisterUsers,
  verifyEmail
} = require("./registration");

const { insertData, getAllData } = require("./user-details");

// app.post("/createUser", insertUser);

// app.get("/allUsers", getAllUsers);

// app.get("/getUser", getUserById);

// app.put("/updateUser", updateUserId);

// app.delete("/deleteuser", deleteUser);

app.post("/register", registerUser);

app.post("/login", authenticateUser);

app.get("/registerUsers", getRegisterUsers);

app.get("/verification", verifyEmail);

app.post("/inserData", insertData);

app.get("/getAllData", getAllData);
