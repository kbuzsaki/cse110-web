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
    var code = req.param('code');
    var query = AccessCode.findOne({code:code});

    var getCode = function(done, results){
      AccessCode.findOne({code:code}, done);
    };
    var getPoll = function(done, results){
      PollHelper.findOneDeep(req.param('id'),
      function finish(err, results){
        if (err) {return res.serverError(err);}
        return res.json(results.map);
      });
    };

    async.series([
      getCode,
      getPoll
    ]);
  }
};

