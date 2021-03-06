'use strict';

const Promise = require('bluebird');
const User = require('../model/user');
const createError = require('http-errors');

module.exports = exports = {};

exports.createUser = function(req, res) {

  let tempPassword = req.body.password;
  req.body.password = null;
  delete req.body.password;

  let newUser = new User(req.body);

  return newUser.generatePasswordHash(tempPassword)
  .then(user => user.save())
  .then(user => user.generateToken())
  .catch(err => res.status(err.status).send(err.message));
};

exports.fetchUser = function(res, auth) {
  if(!auth) return Promise.reject(createError(401, 'auth required'));

  return User.findOne({username: auth.username})
  .then(user => user.comparePasswordHash(auth.password))
  .then(user => user.generateToken())
  .catch(err => res.status(err.status).send(err.message));

};

exports.deleteUser = function(req,res, id) {
  User.findByIdAndRemove(id)
  .then(() => res.status(204).send())
  .catch(err => res.send(err.message));
};
