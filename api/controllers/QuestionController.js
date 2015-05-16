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
        //TODO fix done
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
      var contentQuery = ContentModel.findOne().where({question: id}).populate('responses');
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
  }, /* end findOne */
  addResponse : function (req, res){
    var id = req.param('id');
    var data = req.param('response', {});
    var user = data.responder.id;  //User will the owner of a response
    var createNewResponse = true;

    //TODO bustout?
    var question = {};
    var getQuestion = function(done) {

      Question.findOne(id, function(err, q){
        //If any errorys return a messages, might need in next query too?
        //TODO fix done
        if (err) return res.serverError(err);
        if(!question) return res.notFound('Question with `id` not found.');
        question = q;
        done();
      })
    };

    //We need to searcn the respone based on id of responder

    var hasResponded = function(done){
      var ContentModel = req._sails.models[question.type + "response"];

      ContentModel.findOne({responder:user}, function(err, responder){
        if(responder) createNewResponse = false;
        done();
      });
    }

    var response = {};
    var createResponse = function(done) {
      var ContentModel = req._sails.models[question.type + "response"];
      data.content = question.content;
      if (data.choices){
        data.choices = data.choices.join("\n");
      }
      //If the responder has not responded, create
      if(createNewResponse)
      {
        ContentModel.create(data, function(err, resp){
            if (err){
              res.negotiate(err);
              return done(true);
            }
            response = resp;
            done();
        });
     }
     else //Update the current response of responder
     {
      ContentModel.update(data, function(err, resp){
            if (err){
              res.negotiate(err);
              return done(true);
            }
            response = resp;
            done();
        });
     }

    };

    var respond = function(done) {
      res.status(201);
      res.json(response);
      done();
    }

    async.series([
      getQuestion,
      hasResponded,
      createResponse,
      respond
    ]);
  }
}; /* end exports */

