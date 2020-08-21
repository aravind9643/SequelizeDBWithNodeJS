const { Sequelize } = require("sequelize");
const { getToken } = require("./token-maker");
const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: "./db.sqlite"
});

sequelize
  .authenticate()
  .then(() => {
    console.log("Connection has been established successfully.");
  })
  .catch(err => {
    console.error("Unable to connect to the database:", err);
  });

const UserData = sequelize.define("usersdata", {
  // attributes
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  firstName: {
    type: Sequelize.STRING,
    allowNull: false
  },
  lastName: {
    type: Sequelize.STRING
    // allowNull defaults to true
  },
  fatherName: {
    type: Sequelize.STRING
  },
  userId: {
    type: Sequelize.INTEGER,
    allowNull: false,
    onUpdate: "cascade",
    onDelete: "cascade",
    references: { model: "users", key: "id" }
  }
});

var UserSchema = sequelize.define("user", {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  email: {
    type: Sequelize.STRING,
    unique: true,
    allowNull: false
  },
  username: {
    type: Sequelize.STRING,
    unique: true,
    allowNull: false
  },
  password: {
    unique: false,
    type: Sequelize.STRING,
    allowNull: false
  },
  gender: {
    type: Sequelize.STRING,
    allowNull: false
  },
  dob: {
    type: Sequelize.DATE,
    allowNull: false
  },
  user_token: {
    type: Sequelize.STRING,
    allowNull: false,
    defaultValue: getToken(25)
  },
  isVerified: {
    type: Sequelize.BOOLEAN,
    defaultValue: false
  }
});

const tokenSchema = sequelize.define("token", {
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: Sequelize.INTEGER
  },
  userId: {
    type: Sequelize.INTEGER,
    allowNull: false,
    onUpdate: "cascade",
    onDelete: "cascade",
    references: { model: "users", key: "id" }
  },
  token: {
    type: Sequelize.STRING,
    allowNull: false
  }
});

function getUserId(token) {
  return new Promise((resolve, reject) => {
    UserSchema.findOne({ where: { user_token: token } })
      .map(el => el.get({ plain: true }))
      .then(resp => {
        resolve(resp.id);
      })
      .catch(err => reject(err));
  });
}

function syncModel(model) {
  model.sync({ force: true }).then(() => {
    console.log("Table Created Successfully");
  });
}

// syncModel(sequelize);

module.exports = { UserSchema, tokenSchema, UserData, getUserId };
