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
        if (err || !q) {
          if (err) res.serverError(err);
          if (!q) {
            res.status(410);
            res.json("Question with that ID was not found");
          }
          return done(true);
        }
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

  //TODO NEED TO ENSURE THE REQUESTS ARE PROCESSED IN ORDER
  addResponse : function (req, res){
    var data = req.param('response', {});
    var id = data.question;
    var user = data.responder;  //User will the owner of a response
    var createNewResponse = true;
    var response = {};

    //TODO bustout?
    var question = {};
    var getQuestion = function(done) {

      Question.findOne(id, function(err, q){
        //If any errorys return a messages, might need in next query too?
        if (err || !q) {
          if (err) res.serverError(err);
          if (!q) {
            res.status(410);
            res.json("Question with that ID was not found");
          }
          return done(true);
        }
        question = q;
        done();
      })
    };

    //We need to searcn the respone based on id of responder

    var hasResponded = function(done){
      var ContentModel = req._sails.models[question.type + "response"];
      var query = ContentModel.findOne().where({responder:user, content: question.content});
      query.exec( function(err, resp){
        if(err) return res.serverError(err);
        if(!resp) {
          console.log("User HAs not  ALREADY RESPONDED!!!");
          return done();
        }
        else {
          createNewResponse = false;
          resp.choices = data.choices.join("\n");
          response = resp;
          console.log("Updating response...");
          resp.save(done);
        }
      });
    };

    var createResponse = function(done) {
      var ContentModel = req._sails.models[question.type + "response"];
      //If the responder has not responded, create
      if(createNewResponse)
      {
        data.content = question.content;
        if (data.choices){
          data.choices = data.choices.join("\n");
        }
        console.log("Creating response...");
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
       done();
      /*ContentModel.update({},data).exec( function(err, resp){
            console.log('testingu');
            if (err){
              res.negotiate(err);
              return done(true);
            }
            response = resp;
            done();
        });*/
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
  }, /* end addResponse */
  getResponse : function (req, res){
    var rid = req.param('rid');
    var qid = req.param('qid');

    var question = {};
    var getQuestion = function(done) {

      Question.findOne(qid, function(err, q){
        //If any errorys return a messages, might need in next query too?
        if (err || !q) {
          if (err) res.serverError(err);
          if (!q) {
            res.status(410);
            res.json("Question with that ID was not found");
          }
          return done(true);
        }
        question = q;
        done();
      })
    };

    var response = {};
    var getQuestionResponse = function(done) {
      var ContentModel = req._sails.models[question.type + "response"];
      ContentModel.findOne(rid, function(err, r){
        //If any errorys return a messages, might need in next query too?
        if (err || !r) {
          if (err) res.serverError(err);
          if (!r) {
            res.status(410);
            res.json("Response with that ID was not found");
          }
          return done(true);
        }
        response = r;
        done();
      })
    };

    var respond = function(done) {
      res.status(200);
      res.json(response);
      done();
    }

    async.series([
      getQuestion,
      getQuestionResponse,
      respond
    ]);
  } /* end getResponse */
}; /* end exports */

