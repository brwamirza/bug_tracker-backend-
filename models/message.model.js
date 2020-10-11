module.exports = (sequelize, Sequelize) => {
    const Message = sequelize.define("messages", {
      commenter: {
        type: Sequelize.STRING,
      },
      message: {
        type: Sequelize.STRING,
      }
    });
  
    return Message;
  };