const { getUserId } = require("./database");

function insert(model, obj) {
  return new Promise((resolve, reject) => {
    model
      .create(obj)
      .map(el => el.get({ plain: true }))
      .then(resp => {
        resolve(resp);
      })
      .catch(err => {
        reject(err);
      });
  });
}

function insertUserData(model, obj, token) {
  return new Promise((resolve, reject) => {
    getUserId(token).then(userId => {
      obj.userId = userId;
      model
        .create(obj)
        .then(resp => {
          resolve(resp);
        })
        .catch(err => {
          reject(err);
        });
    });
  });
}

function getAllUserData(model, token, options = {}) {
  return new Promise((resolve, reject) => {
    getUserId(token).then(userId => {
      options.where = { userId: userId };
      options.attributes = { exclude: ["userId"] };
      model
        .findAll(options)
        .then(resp => {
          resolve(resp);
        })
        .catch(err => {
          reject(err);
        });
    });
  });
}

function getAll(model, options = {}) {
  return new Promise((resolve, reject) => {
    model
      .findAll(options)
      .then(resp => {
        resolve(successBody(resp));
      })
      .catch(err => {
        reject(err);
      });
  });
}

function updateById(model, id, obj) {
  return new Promise((resolve, reject) => {
    model
      .update(obj, { where: { id: id } })
      .then(resp => {
        resolve("User updated with Id: " + id);
      })
      .catch(err => {
        reject(err);
      });
  });
}

function deleteById(model, id) {
  return new Promise((resolve, reject) => {
    model
      .destroy({ where: { id: id } })
      .then(() => {
        resolve();
      })
      .catch(err => {
        reject(err);
      });
  });
}

function getBySearch(model, searchObj) {
  return new Promise((resolve, reject) => {
    model
      .findOne({ where: searchObj })
      .map(el => el.get({ plain: true }))
      .then(user => {
        resolve(user);
      })
      .catch(err => {
        reject(err);
      });
  });
}

function findOrCreate(model, searchObj, obj) {
  return new Promise((resolve, reject) => {
    model
      .findOrCreate({
        where: searchObj,
        defaults: obj
      })
      .map(el => el.get({ plain: true }))
      .spread((resultObj, created) => {
        let tempObj = {
          obj: resultObj,
          created: created
        };
        resolve(tempObj);
      })
      .catch(err => {
        reject(err);
      });
  });
}

function successBody(sobj) {
  let obj = {
    status: "success",
    data: sobj
  };
  return obj;
}

module.exports = {
  insert,
  deleteById,
  updateById,
  getBySearch,
  getAll,
  findOrCreate,
  insertUserData,
  getAllUserData
};
