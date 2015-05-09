/**
 * PollController
 *
 * @description :: Server-side logic for managing polls
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {

  create: function(req, res) {
    var data = req.param('poll', {});
    var userID = req.param('id', {});
    var crypto = require('crypto');

    var validateGroup = function(done){
      if (!data.group){
        Group.create({name:"Group for: "+data.name}, function(err, group){
          if (err) return res.negotiate(err);
          console.log("Group not specified, new group: " + group.id);
          data.group = group;
          done();
        });
      } else {
        //TODO check if group is valid
        done();
      }
    };

    var createPoll = function(done){
      data.hash = crypto.randomBytes(20).toString('hex');
      Poll.create(data, function created (err, poll) {
        if (err) return res.negotiate(err);
        console.log("Poll created: " + data.hash);
        console.log(poll);
        res.status(201);
        res.json(poll);
      });
      done();
    };

    async.series([
        validateGroup,
        createPoll
    ]);
  }/* end create */
};

