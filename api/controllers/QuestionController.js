/**
 * QuestionController
 *
 * @description :: Server-side logic for managing questions
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {

  //Find and return a single question & its content
  findOne: function(req, res){
    //Get the id from the request (the url)
    var id = req.param('id');

    var question = {};
    var getQuestion = function(done) {
      Question.findOne(id, function(err, q){
        //If any errorys return a messages, might need in next query too?
        if (err) return res.serverError(err);
        if(!question) return res.notFound('Question with `id` not found.');
        question = q;
        done();
      })
    };

    var getContent = function(done) {
      //Get the model class needed to query the content using the question type
      var ContentModel = req._sails.models[question.type + "content"];
      //Generate and execute the query to get the content
      var contentQuery = ContentModel.findOne(question.content);
      contentQuery.exec(function (err, content) {
        //Replace the content id with the actual content and render the json
        question.content = content;
        res.ok(question);
        done();
      })
    };

    async.series([
        getQuestion,
        getContent
    ]);
  } /* end findOne */
}; /* end exports */

