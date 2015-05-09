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
    User.create(data, function created (err, user) {
      if (err) return res.negotiate(err);
      console.log("User created: " + data.hash);
      res.status(201);
      res.json(user);
    });
  },

  findOne: function(req, res) {
    var id = req.param('id');
    //Generate the query based on the ID
    var query = User.findOne(id);
    query.exec(function (err, user) {
      if (err) return res.serverError(err);
      if(!user) return res.notFound('User with `id` not found.');
      res.ok(user);
    });
  }
};

