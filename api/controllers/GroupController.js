/**
 * GroupController
 *
 * @description :: Server-side logic for managing Groups
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
  groupsForUser : function(req, res){
    var userID = req.param('user');
    var getUser = function (done) {
      User.findOne(userID).populate('groups').exec(done);
    };
    var getGroups = function (done, results) {
      var user = gg.flatten(results.user);
      Group.find()
        .where({id: user.groups})
        .populate('members')
        .populate('polls')
        .exec(done);
    };
    var respond = function finish(err, results){
      var user = results.user;
      user.groups = results.groups;
      if (err) {return res.serverError(err);}
      return res.json(user);
    };

    async.auto({
      user: getUser,
      groups: ['user', getGroups]
    }, respond);
  }
};

