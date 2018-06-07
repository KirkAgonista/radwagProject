const db = require("../models");

exports.getContractors = function(req, res){
  db.Contractors.find()
    .then(function(contractors){
      res.json(contractors);
    })
    .catch(function(err){
      res.send(err);
    });
};

exports.createContractor = function(req,res){
  db.Contractors.create(req.body)
    .then(function(newContractor){
      console.log(newContractor);
      res.status(201).json(newContractor);
    })
    .catch(function(err){
      res.send(err);
    });
};

exports.getContractor = function(req, res){
  db.Contractors.findById(req.params.contractorId)
    .then(function(foundContractor){
      res.json(foundContractor);
    })
    .catch(function(err){
      res.send(err);
    });
};

exports.updateContractor = function(req, res){
  db.Contractors.findOneAndUpdate({_id: req.params.contractorId}, req.body, {new: true})
    .then(function(newContractor){
      res.json(newContractor);
    })
    .catch(function(err){
      res.send(err);
    });
};

exports.deleteContractor = function(req, res){
  db.Contractors.remove({_id: req.params.contractorId})
    .then(function(){
      res.json({message: "We deleted it!"});
    })
    .catch(function(err){
      res.send(err);
    });
};

module.exports = exports;
