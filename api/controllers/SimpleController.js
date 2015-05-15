/**
 * SimpleController
 *
 * @description :: Server-side logic for managing Simples
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
  index: function (req, res){
    var id = req.param('id');

    var data = {};
    var queryUser = function(done) {
      User.findOne(id)
      .populate('groups')
      .exec(function(err,user) {
        data.user = user;
        done();
      })
    };
    var queryPolls = function (done) {
      Poll.find()
      .where({creator:id})
      .exec(function(err,polls) {
        data.polls = polls;
        done();
      })
    };

    var respond = function(done){
      res.view('simple', data);
      done();
    }

    async.series([
        queryUser,
        queryPolls,
        respond
    ]);
  },

  poll: function (req, res) {
    var id = req.param('id');
    var data = {};
    var queryPoll = function (done) {
      Poll.findOne(id)
      .populate('questions')
      .exec( function( err, poll ) {
        data.poll = poll;
        done();
      })
    }
    var respond = function(done){
      res.view('poll', data);
      done();
    }
    async.series([
        queryPoll,
        respond
    ])
  }
};

