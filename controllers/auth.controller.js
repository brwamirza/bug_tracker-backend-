const db = require("../models");
const config = require("../config/auth.config");
const User = db.user;
const Token = db.token;
var nodemailer = require('nodemailer');

const Op = db.Sequelize.Op;

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

exports.signup = (req, res) => {
  // Save User to Database
  User.create({
    username: req.body.username,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 8),
    role: req.body.role,
    isMember: "false",
    verified: req.body.verified
  })
    .then(user => {
      var token = jwt.sign({ id: user.id }, config.secret, {
        expiresIn: 86400 // 24 hours
      });
      Token.create({
        email: req.body.email,
        token: token
      }).then(() => {
        var transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
              user: 'mirzabrwa@gmail.com',
              pass: 'IAMbrwa98'
          }
      });
        transporter.sendMail({
            from: 'mirzabrwa@gmail.com',
            to: user.email,
            subject: 'Verify Email',
            // text: `http://${req.get('host')}/confirm/${token}`,
            html: "Hello,<br> Please Click on the link to verify your email.<br><a href=" + `https://${req.get('host')}/confirm/${token}` + ">Click here to verify</a>"
        });
      }).then(() => {
        res.status(200).send({
          id: user.id,
          username: user.username,
          email: user.email,
          roles: user.role.toString().toUpperCase(),
          accessToken: token
      });
      });
    })
    .catch(err => {
      res.status(500).send({ message: err.message });
    });
};

exports.verifyEmail = (req,res) => {
  const token = req.params.token;
  const verified = "true";
  Token.findOne({
    where: {
      token: token
    }
  }).then(token => {
    User.update({verified: verified }, {
      where: { 
        email: token.email 
      }
    })
      .then(num => {
        if (num == 1) {
          res.send({
            message: "User was updated successfully."
          });
        } else {
          res.send({
            message: `Cannot update User with this email. Maybe user was not found or req.body is empty!`
          });
        }
      })
      .catch(err => {
        res.status(500).send({
          message: "Error updating user with this email"
        });
      });
  })
  .catch(err => {
    res.status(500).send({
      message: "Error updating user with this email"
    });
  });
};

exports.signin = (req, res) => {
  User.findOne({
    where: {
      email: req.body.email
    }
  })
    .then(user => {
      if (!user) {
        return res.status(404).send({ message: "User Not found." });
      }
      if (user.verified === "false") {
        return res.status(404).send({ message: "Please verify your email to sign in" });
      }

      var passwordIsValid = bcrypt.compareSync(
        req.body.password,
        user.password
      );

      if (!passwordIsValid) {
        return res.status(401).send({
          accessToken: null,
          message: "Invalid Password!"
        });
      }

      var token = jwt.sign({ id: user.id }, config.secret, {
        expiresIn: 86400 // 24 hours
      });

        res.status(200).send({
          id: user.id,
          username: user.username,
          email: user.email,
          roles: user.role.toString().toUpperCase(),
          accessToken: token
      });
    })
    .catch(err => {
      res.status(500).send({ message: err.message });
    });
};