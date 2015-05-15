/**
 * PollController
 *
 * @description :: Server-side logic for managing polls
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {

  create: function(req, res) {
    var data = req.param('poll', {});
    var userID = data.creator;
    var crypto = require('crypto');

    var validateGroup = function(done){
      if (!data.group){
        Group.create({name:"Group for: "+data.name}, function(err, group){
          if (err) return res.negotiate(err);
          console.log("Group not specified, new group: " + group.id + " Adding: " + data.creator);
          group.members.add(userID);
          group.save(function(err, group) {
            if(err){
              console.log(userID+" broken");
              res.negotiate(err);
              done(true);
            }
            data.group = group;
            done();
          });
        });
      } else {
        //TODO check if group is valid
        done();
      }
    };

    var poll = {};
    var createPoll = function(done){
      data.hash = crypto.randomBytes(20).toString('hex');
      Poll.create(data, function created (err, p) {
        if (err) return res.negotiate(err);
        console.log("Poll created: " + data.hash);
        console.log(p);
        poll = p;
        done();
      });
    };

    var respond = function(done){
      var query = Poll.findOne(poll.id).populate('questions');
      query.exec(function(err, poll){
        //console.log(poll);
        res.status(201);
        res.json(poll);
        done();
      });
    };

    async.series([
        validateGroup,
        createPoll,
        respond
    ]);
  },/* end create */

  findOne: function(req, res){
    var query = Poll.findOne(req.param('id')).populate('questions');
    query.exec(function(err, poll){
      if (err) return res.serverError(err);
      if(!poll) return res.notFound('Poll with `id` not found.');
      res.ok(poll);
    });
  }
};

