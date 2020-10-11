module.exports = (sequelize, Sequelize) => {
    const Token = sequelize.define("tokens", {
      email: {
        type: Sequelize.STRING
      },
      token: {
        type: Sequelize.STRING
      }
    });
  
    return Token;
  };