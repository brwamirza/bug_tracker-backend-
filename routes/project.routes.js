const controller = require("../controllers/project.controller");

module.exports = function(app) {
    app.use(function(req, res, next) {
      res.header(
        "Access-Control-Allow-Headers",
        "x-access-token, Origin, Content-Type, Accept"
      );
      next();
    });
  
    //adding a single project
    app.post(
      "/api/project/add",
      controller.addProject
    );

    //getting all projects
    app.post(
      "/api/project/all",
      controller.getAllProject
    );

    //deleting a single project
    app.delete(
      "/api/project/:id",
      controller.delete
    );

     // Update a Tutorial with id
    app.put("/api/project/:id",
    controller.update
    );

    //getting a single project
    app.get("/api/project/:id",
    controller.findOne
    );

     //getting a single project
     app.post("/api/project/allUsers",
     controller.getAllProjectsWithUsers
     );

     app.post("/api/project/assignUsers",
     controller.assignUsers
     );

     app.post("/api/project/getUsers",
     controller.getUsers
     );

     app.post("/api/project/Tickets",
     controller.getTickets
     );
  
  };