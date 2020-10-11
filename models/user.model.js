module.exports = (sequelize, Sequelize) => {
    const User = sequelize.define("users", {
      username: {
        type: Sequelize.STRING
      },
      email: {
        type: Sequelize.STRING
      },
      password: {
        type: Sequelize.STRING
      },
      role: {
        type: Sequelize.STRING
      },
      isMember: {
        type: Sequelize.STRING
      },
      joinedUser: {
        type: Sequelize.STRING
      },
      verified: {
        type: Sequelize.STRING
      }
    });
  
    return User;
  };