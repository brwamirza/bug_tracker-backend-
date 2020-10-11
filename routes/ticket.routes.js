const controller = require("../controllers/ticket.controller");

module.exports = function(app) {
    app.use(function(req, res, next) {
      res.header(
        "Access-Control-Allow-Headers",
        "x-access-token, Origin, Content-Type, Accept"
      );
      next();
    });
  
    //adding a single ticket
    app.post(
      "/api/ticket/add",
      controller.addTicket
    );

    //getting all tickets
    app.post(
      "/api/ticket/all",
      controller.getAllTickets
    );

    // //deleting a single ticket
    // app.delete(
    //   "/api/ticket/:id",
    //   controller.delete
    // );

     // Update a Ticket with id
    app.put("/api/ticket/:id",
    controller.update
    );

    //getting a single ticket
    app.get("/api/ticket/:id",
    controller.getOneTicket
    );

    app.post("/api/ticket/addMessage",
    controller.addMessage
    );

    app.post("/api/ticket/messages",
    controller.getAllMessages
    );

    app.post("/api/ticket/assignDeveloper",
    controller.assignDeveloper
    );
  
  };