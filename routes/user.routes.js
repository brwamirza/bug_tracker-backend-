const { authJwt } = require("../middlewares");
const controller = require("../controllers/user.controller");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.get(
    "/api/test/submitter", 
    [authJwt.verifyToken,authJwt.isSubmitter],
    controller.submitter
    );

  app.get(
    "/api/test/developer",
    [authJwt.verifyToken],
    controller.developerBoard
  );

  app.get(
    "/api/test/projectmanager",
    [authJwt.verifyToken, authJwt.isProjectManager],
    controller.projectManagerBoard
  );

  app.get(
    "/api/test/admin",
    [authJwt.verifyToken, authJwt.isAdmin],
    controller.adminBoard
  );

  app.post(
    "/api/joinUser",
    controller.joinUser
  );

  app.post(
    "/api/getAllMembers",
    controller.getAllMembers
  );

  app.put(
    "/api/updateUser",
    controller.updateUser
  );

  app.post(
    "/api/getAllMembersAsManager",
    controller.getAllMembersAsManager
  );
};