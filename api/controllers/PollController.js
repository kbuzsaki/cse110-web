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
    var query = Poll.findOne(req.param('id'));
    query.exec(function(err, poll){
      if (err) return res.serverError(err);
      if(!poll) return res.notFound('Poll with `id` not found.');
      res.ok(poll);
    });
  },
  findOne: function(req, res) {
    async.auto({
      //Query the poll and return the results as results.poll
      poll: function(done) {
        Poll
          .findOne(req.param('id'))
          .populate('questions')
          .exec(done);
      },
      //Generate the queries to get all of the content for each of the polls
      //questions
      queries: ['poll', function(done, results) {
        var poll = results.poll.toObject();
        //Group the poll's questions into groups by their question type
        var contents = _.groupBy(poll.questions, 'type');
        console.log(contents);
        var queries = {};
        //for every type of content, generate a query to get the contents for
        //that type for all of the questions of that type. This queries has
        //contains function that can be executed in an async construct
        _.forEach(contents, function (questions, type){
          var ContentModel = req._sails.models[type + "content"];
          queries[type]  = function (done){
            ContentModel
              .find({question: _.pluck(questions, 'id')})
              .populate('responses')
              .exec(done);
          };
        });
        return done(null, queries);
      }],
      //After all the queries have been generated, run the queries and move on
      //to the next step once all the queries have been completed
      runQueries: ['queries', function(done, results) {
        async.auto(results.queries, done);
      }],
      //Now that the poll, question, and all content for the questions has been
      //queried and loaded we need to map the content to their respective
      //question. The results of the content queries are already sorted by type
      //just need to indexBy id to make getting the correct content for a
      //question easy.
      map : ['runQueries', function(done, results) {
        var poll = results.poll.toObject();
        var contents = results.runQueries;
        //for every type of content found, index those results by their id
        _.forEach(contents, function (content, type){
          contents[type] = _.indexBy(contents[type], 'id');
        });
        //use the question's type and content id to get the content and link it
        //up to it's question, creating the final poll object to be returned
        poll.questions = poll.questions.map( function(question) {
          question.content = contents[question.type][question.content];
          return question;
        });
        return done(null, poll);
      }]

    },
    //All async threads are done, time to return the results if no error :)
    function finish(err, results){
      if (err) {return res.serverError(err);}
      return res.json(results.map);
    });
  }
};

