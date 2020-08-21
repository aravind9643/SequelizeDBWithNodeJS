const { getAllUserData, insertUserData } = require("./queries");
const { UserData } = require("./database");

const insertData = (req, res) => {
  // if (!req.headers.user_token) {
  //     return res.send({ status: 'error', message: 'user_token required' });
  // }
  let token = req.session.user_token;
  insertUserData(UserData, req.body, token).then(userData => {
    return res.send({ status: "success", data: userData });
  });
};

const getAllData = (req, res) => {
  // if (!req.headers.user_token) {
  //     return res.send({ status: 'error', message: 'user_token required' });
  // }
  let token = req.session.user_token;
  getAllUserData(UserData, token).then(userData => {
    return res.send({ status: "success", data: userData });
  });
};

module.exports = { insertData, getAllData };
