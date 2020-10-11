const config = require("../config/db.config.js");

const Sequelize = require("sequelize");
const sequelize = new Sequelize(
  config.DB,
  config.USER,
  config.PASSWORD,
  {
    host: config.HOST,
    dialect: config.dialect,
    operatorsAliases: false,

    pool: {
      max: config.pool.max,
      min: config.pool.min,
      acquire: config.pool.acquire,
      idle: config.pool.idle
    }
  }
);

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.user = require("../models/user.model.js")(sequelize, Sequelize);
db.project = require("../models/project.model.js")(sequelize, Sequelize);
db.ticket = require("../models/ticket.model.js")(sequelize, Sequelize);
db.message = require("../models/message.model.js")(sequelize, Sequelize);
db.token = require("../models/token.model.js")(sequelize, Sequelize);

db.user.belongsToMany(db.project, {
  through: "user_projects",
  foreignKey: "userId",
  otherKey: "projectId"
});

db.project.belongsToMany(db.user, {
  through: "user_projects",
  foreignKey: "projectId",
  otherKey: "userId"
});

db.user.belongsToMany(db.user, {
  through: "following",
  as:"followers",
  foreignKey: "followingId",
  otherKey: "followerId"
});

db.user.belongsToMany(db.user, {
  through: "following",
  as:"followings",
  foreignKey: "followerId",
  otherKey: "followingId"
});

db.user.hasMany(db.user);

db.ticket.belongsToMany(db.project, {
  through: "project_tickets",
  foreignKey: "tickettId",
  otherKey: "projectId"
});

db.project.belongsToMany(db.ticket, {
  through: "project_tickets",
  foreignKey: "projectId",
  otherKey: "ticketId"
});

db.ticket.belongsToMany(db.user, {
  through: "user_tickets",
  foreignKey: "ticketId",
  otherKey: "userId"
});

db.user.belongsToMany(db.ticket, {
  through: "user_tickets",
  foreignKey: "userId",
  otherKey: "ticketId"
});

db.ticket.belongsToMany(db.message, {
  through: "ticket_messages",
  foreignKey: "ticketId",
  otherKey: "messageId"
});

db.message.belongsToMany(db.ticket, {
  through: "ticket_messages",
  foreignKey: "messageId",
  otherKey: "ticketId"
});

module.exports = db;