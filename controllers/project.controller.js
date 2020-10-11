const db = require("../models");
const config = require("../config/auth.config");
const User = db.user;
const Project = db.project;

const Op = db.Sequelize.Op;

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");
const { project } = require("../models");


// adding a project to db
exports.addProject = (req, res) => {
  // Save Project to Database
  Project.create({
    name: req.body.name,
    description: req.body.description,
    email: req.body.email
  })
    .then(project => {
        if (req.body.email) {
        User.findOne({
            where: {
                email: req.body.email
            }
        }).then(user => {
            user.addProjects(project).then(() => {
            res.send({ message: "Project was added successfully!" });
            });
        });
        }
    })
    .catch(err => {
      res.status(500).send({ message: err.message });
    });
};

exports.getAllProject = (req,res) => {
  User.findOne({
    where: {
      email: req.body.email
    }
   }).then(user => {
     user.getProjects().then(projects => {
       res.json(projects);
     });
    })
    .catch(err => {
     res.status(500).send({ message: err.message });
   });
 };

// getting all project
exports.getAllProjectsWithUsers = (req,res) => {
  Project.findAll({
    where: {
      email: req.body.email
    },include: User
   }).then(project => {
     res.json(project)
    })
 
    .catch(err => {
     res.status(500).send({ message: err.message });
   });
 };

exports.getUsers = (req, res) => {
  Project.findOne({
    where: {
      id: req.body.id
    }
  }) 
    .then(project => {
      project.getUsers().then(users => {
        res.json(users);
      })
    })
    .catch(err => {
      res.status(500).send({
        message: "Error retrieving Project with id=" + req.body.id
      });
    });
};

exports.getTickets = (req, res) => {
  Project.findOne({
    where: {
      id: req.body.id
    }
  }) 
    .then(project => {
      project.getTickets().then(tickets => {
        res.json(tickets);
      })
    })
    .catch(err => {
      res.status(500).send({
        message: "Error retrieving tickets for Project with id=" + req.body.id
      });
    });
};

// getting one project
exports.findOne = (req, res) => {
  const id = req.params.id;

  Project.findOne({
    where: {
      id:id
    },include: User
  }) 
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message: "Error retrieving Project with id=" + id
      });
    });
};

//assining new users to project
exports.assignUsers = (req,res) => {
  project.findOne({
    where:{
      id: req.body.projectId
    }
  }).then( project => {
      User.findAll({
        where: {
          id : {
            [Op.or]: req.body.oldUsers
          }
        }
      }).then( oldUsers => {
        project.removeUsers(oldUsers)
      }).then( () => {
          User.findAll({
            where: {
              id : {
                [Op.or]: req.body.newUsers
              }
            }
          }).then( newUsers => {
            project.addUsers(newUsers);
          }).then( () => {
            res.send({
              message: "users assigned successfully."
            });
          });
      });
  }).catch(err => {
    res.status(500).send({ message: err.message });
  });
}

// Update a Tutorial by the id in the request
exports.update = (req, res) => {
  const id = req.params.id;

  Project.update(req.body, {
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "Project was updated successfully."
        });
      } else {
        res.send({
          message: `Cannot update Project with id=${id}. Maybe Tutorial was not found or req.body is empty!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error updating Project with id=" + id
      });
    });
};

// Delete a Tutorial with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;

  Project.destroy({
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "Project was deleted successfully!"
        });
      } else {
        res.send({
          message: `Cannot delete Project with id=${id}. Maybe Tutorial was not found!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Could not delete Project with id=" + id
      });
    });
};

// Delete all Tutorials from the database.
exports.deleteAll = (req, res) => {
  
};