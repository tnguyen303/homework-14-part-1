const db = require("../models");

module.exports = function(app) {
  app.get("/api/todolist", function(req, res) {
    db.Todo.findAll({})
      .then(function(list) {
        res.json(list);
      })
      .catch(function(err) {
        res.json(err);
      });
  });

  app.post("/api/todolist", function(req, res) {
    db.Todo.create(req.body)
      .then(function(data) {
        res.json(data);
      })
      .catch(function(err) {
        res.json(err);
      });
  });

  app.put("/api/todolist/:taskQuery", function(req, res) {
    db.Todo.update(
      { done: true },
      {
        where: {
          id: req.params.taskQuery
        }
      }
    ).then(function(data) {
        res.json(data);
      })
      .catch(function(err) {
        res.json(err);
      });
  });

  app.delete("/api/todolist/:taskQuery", function(req, res) {
    db.Todo.destroy({
      where: {
        id: req.params.taskQuery
      }
    })
      .then(function() {
        res.json({ success: true });
      })
      .catch(function(err) {
        res.json({ success: false });
      });
  });
};
