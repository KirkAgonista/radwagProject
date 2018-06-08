const db = require("../models"),
  jwt = require("jwt-simple"),
  config = require('../config/database'),
  bcrypt = require('bcrypt');

//register the user
exports.registerUser = function(req, res) {
  if (!req.body.username || !req.body.password || !req.body.email) {
    res.json({success: false, msg: `Please pass username and password.`});
  } else {
    let newUser = new db.User({
      username: req.body.username,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      position: req.body.position,
      email: req.body.email,
      password: req.body.password,
    });
    //set administrator
    if(req.body.adminCode === config.adminPassword){
      newUser.isAdmin = true;
    }
    // save the user
    newUser.save(function(err) {
      if (err) {
        return res.json({success: false, msg: 'Username already exists.'});
      }
      res.json({success: true, msg: 'Successful created new user.'});
    });
  }
};

//login the user
exports.loginUser = function(req, res) {
  db.User.findOne({
    username: req.body.username
  }, function(err, user) {
    if (err) throw err;
    if (!user) {
      res.send({success: false, msg: 'Authentication failed. User not found.'});
    } else {
      console.log(user);
      // check if password matches
      user.comparePassword(req.body.password, function (err, isMatch) {
        if (isMatch && !err) {
          // if user is found and password is right create a token
          let token = jwt.encode(user, config.secret);
          // return the information including token as JSON
          res.json({
            success: true,
            token: 'JWT ' + token,
            id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            position: user.position,
            email: user.email,
            isAdmin: user.isAdmin,
          });
        } else {
          res.send({success: false, msg: 'Authentication failed. Wrong password.'});
        }
      });
    }
  });
};

//get all users data
exports.getUsers = function(req, res){
  db.User.find()
    .then(function(users){
      res.json(users);
    })
    .catch(function(err){
      res.send(err);
    });
};

//get user data
exports.getUser = function(req, res){
  db.User.findById(req.params.userId)
    .then(function(foundUser){
      res.json(foundUser);
    })
    .catch(function(err){
      res.send(err);
    });
};

//change user data
exports.updateUser = function(req, res){
  let newUser = {
    username: req.body.username,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    position: req.body.position,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10)),
  };
  if(req.body.adminCode === config.adminPassword){
    newUser.isAdmin = true;
  }
  db.User.findOneAndUpdate({_id: req.params.userId}, newUser, {new: true})
    .then(function(user){
      res.json(user);
    })
    .catch(function(err){
      res.send(err);
    });
};

exports.deleteUser = function(req, res){
  db.User.remove({_id: req.params.userId})
    .then(function(){
      res.json({message: "We deleted it!"});
    })
    .catch(function(err){
      res.send(err);
    });
};

module.exports = exports;
