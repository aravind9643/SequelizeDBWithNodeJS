const {
  getAll,
  getBySearch,
  updateById,
  deleteById,
  insert
} = require("./queries");
const { User } = require("./database");

const insertUser = (req, res) => {
  insert(User, req.body).then(resp => {
    res.status(201).send(resp);
  });
};

const getAllUsers = (req, res) => {
  getAll(User).then(resp => {
    res.send(resp);
  });
};

const getUserById = (req, res) => {
  getBySearch(User, { id: req.query.id }).then(resp => {
    res.send(resp);
  });
};

const updateUserId = (req, res) => {
  updateById(User, req.query.id, req.body).then(resp => {
    res.send(resp);
  });
};

const deleteUser = (req, res) => {
  deleteById(User, req.query.id).then(resp => {
    res.send(resp);
  });
};

module.exports = {
  insertUser,
  getAllUsers,
  getUserById,
  updateUserId,
  deleteUser
};
