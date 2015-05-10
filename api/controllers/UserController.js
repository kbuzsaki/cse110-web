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
    var user = {};
    var getUser = function(done) {
      var query = User.findOne(id).populate('groups');
      query.exec(function (err, u) {
        if (err) {
          done(true);
          return res.serverError(err);
        }
        if(!u){
          done(true);
          return res.notFound('User with `id` not found.');
        }
        user = u;
        done();
      });
    };

    var respond = function(done) {
      res.ok(user);
      done();
    }

    async.series([
        getUser,
        respond
    ]);
  }
};

