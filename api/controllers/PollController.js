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
              return done(true);
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
      PollHelper.findOneDeep(poll.id,
      function finish(err, results){
        if (err) res.serverError(err);
        else res.json(results.map);
        done();
      });
    };

    async.series([
        validateGroup,
        createPoll,
        respond
    ]);
  },/* end create */

  findOne: function(req, res) {
    PollHelper.findOneDeep(req.param('id'),
    function finish(err, results){
      if (err) {return res.serverError(err);}
      return res.json(results.map);
    });
  }
};

