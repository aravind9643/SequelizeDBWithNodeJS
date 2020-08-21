const { UserSchema, tokenSchema } = require("./database");
const {
  getAll,
  getBySearch,
  updateById,
  deleteById,
  insert,
  findOrCreate
} = require("./queries");
const bcrypt = require("bcrypt");
const { getToken } = require("./token-maker");
const { sendVerificationEmail } = require("./email-service");

const registerUser = (req, res) => {
  if (
    req.body.email &&
    req.body.username &&
    req.body.password &&
    req.body.passwordConf &&
    req.body.gender &&
    req.body.dob
  ) {
    if (req.body.password !== req.body.passwordConf) {
      res.send({
        status: "error",
        error: "passwords not matched"
      });
    }
    encryptPassword(req.body.password).then(hash => {
      let userData = {
        email: req.body.email,
        username: req.body.username,
        dob: req.body.dob,
        gender: req.body.gender,
        password: hash
      };
      findOrCreate(UserSchema, { email: userData.email }, userData)
        .then(userResp => {
          if (!userResp.created) {
            return res
              .status(409)
              .json("User with email address already exists");
          } else {
            return insert(tokenSchema, {
              userId: userResp.obj.id,
              token: getToken(15)
            })
              .then(tokenResp => {
                // sendVerificationEmail(userData.email, tokenResp.token);
                return res
                  .status(200)
                  .json(`${userData.email} account created successfully`);
              })
              .catch(error => {
                return res.status(500).json(error);
              });
          }
        })
        .catch(error => {
          return res.status(500).json(error);
        });
    });
  } else {
    res.send({ status: "error", error: "Please enter all the fields" });
  }
};

const verifyEmail = (req, res) => {
  getBySearch(UserSchema, { email: req.query.email }).then(userResp => {
    if (userResp.isVerified) {
      return res.status(202).json(`Email Already Verified`);
    } else {
      return getBySearch(tokenSchema, { token: req.query.token }).then(
        tokenResp => {
          if (tokenResp) {
            updateById(UserSchema, userResp.id, { isVerified: true })
              .then(updatedResp => {
                return res
                  .status(403)
                  .json(`User with ${userResp.email} has been verified`);
              })
              .catch(reason => {
                return res.status(403).json(`Verification failed`);
              });
          }
        }
      );
    }
  });
};

const authenticateUser = (req, res) => {
  if (!req.body.email || !req.body.password) {
    return res.send("please enter all the fields");
  }
  getBySearch(UserSchema, { email: req.body.email })
    .then(resp => {
      if (!resp) {
        return res.send({
          status: "error",
          message: "email not found"
        });
      } else {
        bcrypt.compare(req.body.password, resp.password, function(err, result) {
          if (result === true && !resp.isVerified) {
            return res.send({ status: "error", message: "Email not verified" });
          }
          if (result === true) {
            req.session.user_token = resp.user_token;
            return res.send({
              status: "success",
              message: "authencation successful",
              user_token: resp.user_token
            });
          } else {
            return res.send({
              status: "error",
              message: "authencation failed",
              reason: "password not matched"
            });
          }
        });
      }
    })
    .catch(err => {
      return res.send(err);
    });
};

const getRegisterUsers = (req, res) => {
  let options = {
    attributes: { exclude: ["id", "password", "user_token", "isVerified"] }
  };
  getAll(UserSchema).then(resp => {
    res.send(resp);
  });
};

function encryptPassword(password) {
  return new Promise((resolve, reject) => {
    bcrypt.hash(password, 10, function(err, hash) {
      resolve(hash);
    });
  });
}

module.exports = {
  registerUser,
  authenticateUser,
  getRegisterUsers,
  verifyEmail
};
