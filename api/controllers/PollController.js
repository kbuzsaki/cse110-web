/**
 * PollController
 *
 * @description :: Server-side logic for managing polls
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
  create: function(req, res) {
    var data = req.params.all();
    var crypto = require('crypto');

    data.hash = crypto.randomBytes(20).toString('hex');
    Poll.create(data, function created (err, poll) {
      if (err) return res.negotiate(err);
      console.log("Poll created: " + data.hash);
      res.status(201);
      res.json(poll);
    });
  }
};

