module.exports = (sequelize, Sequelize) => {
    const Project = sequelize.define("projects", {
      name: {
        type: Sequelize.STRING,
      },
      description: {
        type: Sequelize.STRING,
      },
      email: {
        type: Sequelize.STRING,
      },
      manager: {
        type: Sequelize.STRING,
      },
      developer: {
        type: Sequelize.STRING,
      },
      submitter: {
        type: Sequelize.STRING,
      }
    });
  
    return Project;
  };