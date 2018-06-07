const db = require("../models");

exports.getGoods = function(req, res){
    db.Goods.find()
        .then(function(goods){
            res.json(goods);
        })
        .catch(function(err){
            res.send(err);
        });
};

exports.createGood = function(req,res){
    db.Goods.create(req.body)
        .then(function(newGood){
            console.log(newGood);
            res.status(201).json(newGood);
        })
        .catch(function(err){
            res.send(err);
        });
};

exports.getGood = function(req, res){
    db.Goods.findById(req.params.goodId)
        .then(function(foundGood){
            res.json(foundGood);
        })
        .catch(function(err){
            res.send(err);
        });
};

exports.updateGood = function(req, res){
    db.Goods.findOneAndUpdate({_id: req.params.goodId}, req.body, {new: true})
        .then(function(newGood){
            res.json(newGood);
        })
        .catch(function(err){
            res.send(err);
        });
};

exports.deleteGood = function(req, res){
    db.Goods.remove({_id: req.params.goodId})
        .then(function(){
            res.json({message: "We deleted it!"});
        })
        .catch(function(err){
            res.send(err);
        });
};

module.exports = exports;
