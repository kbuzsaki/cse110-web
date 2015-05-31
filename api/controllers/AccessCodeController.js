/**
 * AccessCodeController
 *
 * @description :: Server-side logic for managing Accesscodes
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
  create: function(req, res) {
    var userID = req.param('user');
    var pollID = req.param('poll');
    var create = function(done, results){
      AccessCode.create({user:userID, poll:pollID},
      function (err, code){
        if (err && err['invalidAttributes']['code']){
          console.log('code not unique.... retrying');
          create(done, results);
        } else done(err, code);
      });
    };
    var respond = function(err, results){
      if (err) {return res.json(err);}
      return res.json(results.end);
    };

    async.auto({
      end: create
    }, respond);
  },
  getPoll: function(req, res) {
    var code = req.param('code', "");
    var user = req.param('user');
    var query = AccessCode.findOne({code:code});

    var getCode = function(done){
      AccessCode.findOne({code:code}, done);
    };
    var joinGroup = function(done, results){
      Group.findOne(results.poll.poll.group).exec(function(err, group){
        if (err) return done(err);
        if (!user) return done(err);
        group.members.add(user);
        group.save(function(err, group) {
          if(err){
            return done(err);
          }
          done();
        });
      });
    };
    var getPoll = function(done, results){
      if (!results.code) {return done("Invalid code", results)}
      PollHelper.findOneDeep(results.code.poll, done);
    };
    var respond = function(err, results){
      if (err) {return res.json(err);}
      return res.json(results.poll.map);
    };

    async.auto({
      code: getCode,
      poll: ["code", getPoll],
      fin: ["poll", joinGroup]
    }, respond);
  }
};

