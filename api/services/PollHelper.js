exports.findOneDeep = function(id, callback) {
  async.auto({
    //Query the poll and return the results as results.poll
    poll: function(done) {
      Poll
        .findOne(id)
        .populate('questions')
        .exec(done);
      },
    //Generate the queries to get all of the content for each of the polls
    //questions
    queries: ['poll', function(done, results) {
      if (!results.poll) {return done("Poll not found!", null)};
      var poll = results.poll.toObject();
      //Group the poll's questions into groups by their question type
      var contents = _.groupBy(poll.questions, 'type');
      var queries = {};
      //for every type of content, generate a query to get the contents for
      //that type for all of the questions of that type. This queries has
      //contains function that can be executed in an async construct
      _.forEach(contents, function (questions, type){
        var ContentModel = sails.models[type + "content"];
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
      poll.questions = _.map( poll.questions, function(question) {
        question['content'] = contents[question.type][question.content];
        return question;
      });
      return done(null, poll);
    }]
  }, callback );
}
