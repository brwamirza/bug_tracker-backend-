const jwt = require("jsonwebtoken");
const config = require("../config/auth.config.js");
const db = require("../models");
const User = db.user;

verifyToken = (req, res, next) => {
  let token = req.headers["x-access-token"];

  if (!token) {
    return res.status(403).send({
      message: "No token provided!"
    });
  }

  jwt.verify(token, config.secret, (err, decoded) => {
    if (err) {
      return res.status(401).send({
        message: "Unauthorized!"
      });
    }
    req.userId = decoded.id;
    next();
  });
};

//to know if user is admin or not
isSubmitter = (req, res, next) => {
  User.findByPk(req.userId).then(user => {
        if (user.role === "submitter") {
          next();
          return;
        }

      res.status(403).send({
        message: "Require submitter Role!"
      });
      return;
  });
};

//to know if user is admin or not
isAdmin = (req, res, next) => {
  User.findByPk(req.userId).then(user => {
        if (user.role === "admin") {
          next();
          return;
        }

      res.status(403).send({
        message: "Require Admin Role!"
      });
      return;
  });
};

//to know if user is moderator or not
isDeveloper = (req, res, next) => {
  User.findByPk(req.userId).then(user => {
        if (user.role === "developer") {
          next();
          return;
        }

      res.status(403).send({
        message: "Require developer Role!"
      });
  });
};

//to know if user is moderator or not
isProjectManager = (req, res, next) => {
  User.findByPk(req.userId).then(user => {
        if (user.role === "project-manager") {
          next();
          return;
        }

      res.status(403).send({
        message: "Require project-manager Role!"
      });
  });
};

//to know if user is moderator or admin 
isProjectManagerOrAdmin = (req, res, next) => {
  User.findByPk(req.userId).then(user => {
        if (user.role === "projectManager") {
          next();
          return;
        }

        if (user.role === "admin") {
          next();
          return;
        }

      res.status(403).send({
        message: "Require project-manager or Admin Role!"
      });
  });
};

const authJwt = {
  verifyToken: verifyToken,
  isSubmitter: isSubmitter,
  isAdmin: isAdmin,
  isDeveloper: isDeveloper,
  isProjectManager: isProjectManager,
  isProjectManagerOrAdmin: isProjectManagerOrAdmin
};
module.exports = authJwt;