const db = require("../models");
const config = require("../config/auth.config");
const User = db.user;
const Project = db.project;
const Ticket = db.ticket;
const Message = db.message;

const Op = db.Sequelize.Op;

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");
const { project } = require("../models");


// adding a ticket to db
exports.addTicket = (req, res) => {
  // Save ticket to Database
  Ticket.create({
    title: req.body.title,
    description: req.body.description,
    project: req.body.project,
    developer: req.body.developer,
    priority: req.body.priority,
    status: req.body.status,
    type: req.body.type,
    submitter: req.body.submitter
  })
    .then(ticket => {
        Project.findOne({
            where: {
                name: req.body.project
            }
        }).then(project => {
            project.addTickets(ticket).then(() => {
              User.findAll({
                where: {
                  username : {
                    [Op.or]: [req.body.developer,project.manager]
                  }
                }
              }).then(users => {
                  ticket.addUsers(users).then(() => {
                    User.findAll({
                      where: {
                        email: [project.email, req.body.submitter]
                      }
                    }).then(users => {
                      ticket.addUsers(users).then(() => {
                        res.send({ message: "ticket was added successfully!" });
                      });
                    });
                  });
              }).catch(err => {
                res.status(500).send({ message: err.message });
              });
            });
        });
    })
    .catch(err => {
      res.status(500).send({ message: err.message });
    });
};

// getting all project
exports.getAllTickets = (req,res) => {
 User.findOne({
   where: {
     email: req.body.email
   }
  }).then(user => {
    user.getTickets().then(tickets => {
      res.json(tickets);
    })
   }).catch(err => {
      res.status(500).send({ message: err.message });
  });
};

// getting all project with users
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

// getting one ticket
exports.getOneTicket = (req, res) => {
  const id = req.params.id;

  Ticket.findOne({
    where: {
      id:id
    }
  }) 
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message: "Error retrieving Ticket with id=" + id
      });
    });
};

// add message and assign it to a ticket
exports.addMessage = (req, res) => {
  Message.create({
    commenter: req.body.commenter,
    message: req.body.message
  }) 
    .then(message => {
      Ticket.findOne({
        where: {
          id: req.body.id
        }
      })
        .then(ticket => {
          ticket.addMessages(message).then(() => {
            res.send({ message: "message was added successfully!" });
          })
        })
    })
    .catch(err => {
      res.status(500).send({ message: err.message });
    });
};

// getting all message
exports.getAllMessages = (req, res) => {
  Ticket.findOne({
    where: {
      id: req.body.id
    }
  }) 
    .then(ticket => {
      ticket.getMessages().then(messages => {
        res.send(messages);
      });
    })
    .catch(err => {
      res.status(500).send({
        message: "Error retrieving Ticket with id=" + id
      });
    });
};

//assining new users to ticket
exports.assignDeveloper = (req,res) => {
  Ticket.findOne({
    where:{
      id: req.body.ticketId
    }
  }).then( ticket => {
      User.findOne({
        where: {
          username : req.body.oldDeveloper
        }
      }).then( oldDeveloper => {
        ticket.removeUsers(oldDeveloper)
      }).then( () => {
          User.findOne({
            where: {
              username : req.body.newDeveloper
            }
          }).then( newDeveloper => {
            ticket.addUsers(newDeveloper);
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

// Update a Ticket by the id in the request
exports.update = (req, res) => {
  const id = req.params.id;

  Ticket.update(req.body, {
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "Ticket was updated successfully."
        });
      } else {
        res.send({
          message: `Cannot update Ticket with id=${id}. Maybe Ticket was not found or req.body is empty!`
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
          message: "Ticket was deleted successfully!"
        });
      } else {
        res.send({
          message: `Cannot delete Ticket with id=${id}. Maybe Ticket was not found!`
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