module.exports = (sequelize, Sequelize) => {
    const Ticket = sequelize.define("tickets", {
      title: {
        type: Sequelize.STRING,
      },
      description: {
        type: Sequelize.STRING,
      },
      project: {
        type: Sequelize.STRING,
      },
      submitter: {
        type: Sequelize.STRING,
      },
      developer: {
        type: Sequelize.STRING,
      },
      priority: {
        type: Sequelize.STRING,
      },
      status: {
        type: Sequelize.STRING,
      },
      type: {
        type: Sequelize.STRING,
      }
    });
  
    return Ticket;
  };