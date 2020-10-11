module.exports = {
    HOST: "us-cdbr-east-02.cleardb.com",
    USER: "b8d1d2a273e837",
    PASSWORD: "ecf60988",
    DB: "heroku_25c2716a422a2f0",
    dialect: "mysql",
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  };