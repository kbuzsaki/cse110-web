/**
 * UserController
 *
 * @description :: Server-side logic for managing Users
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
  create: function(req, res) {
    var data = req.params.all();
    var crypto = require('crypto');

    data.hash = crypto.randomBytes(20).toString('hex');
    console.log(data.hash);
    User.create(data, function created (err, user) {
      if (err) return res.negotiate(err);
      res.status(201);
      res.json(user);
    });
  }
};

