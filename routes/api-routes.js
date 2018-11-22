const mongoose = require("mongoose");
const db = require("../models/Todolist");

module.exports = function(app) {
  app.get("/api/todolist", function(req, res) {
    db.find({})
      .then(function(list) {
        res.json(list);
      })
      .catch(function(err) {
        res.json(err);
      });
  });

  app.post("/api/todolist", function(req, res) {
    new db(req.body)
      .save()
      .then(function(data) {
        res.json(data);
      })
      .catch(function(err) {
        res.json(err);
      });
  });

  app.put('/api/todolist/:taskQuery', function(req,res){
    db.findOneAndUpdate({_id: req.params.taskQuery}, {$set: {done: true}}).then(function(data){
      res.json(data);
    })
    .catch(function(err){
      res.json(err);
    })
  });

  app.delete("/api/todolist/:taskQuery", function(req, res) {
    db.remove({ _id: req.params.taskQuery })
      .then(function() {
        res.json(db);
      })
      .catch(function(err) {
        res.json(err);
      });
  });
};
