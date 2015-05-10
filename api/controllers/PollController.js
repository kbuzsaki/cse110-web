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

    console.log(req.body);
    var validateGroup = function(done){
      if (!data.group){
        Group.create({name:"Group for: "+data.name}, function(err, group){
          if (err) return res.negotiate(err);
          console.log("Group not specified, new group: " + group.id);
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

    var createPoll = function(done){
      data.hash = crypto.randomBytes(20).toString('hex');
      data.questions.forEach( function(question){
        question.content = 2222222222;
      });
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

