/**
* Question.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  schema: true,
  attributes: {
    poll: {
      model: 'poll',
      required: true
    },
    type: {
      type: 'string',
      required: true
    },
    title: {
      type: 'string',
      required: true
    },
    content: {
      type: 'integer',
      required: true
    },
    toJSON: function() {
      return this;
    }
  },
  beforeValidate: function(values, done){
    console.log('Creating question content...');
    var ContentModel = sails.models[values.type + "content"];
    //TODO might break later
    values.content.options = _.unique(values.content.options).join("\n");
    values.content.question = -1;
    ContentModel.create(values.content, function(err, content) {
      //TODO actually handle errors
      if (err) console.log('uhh content got messed up...?');
      values.content = content.id;
      done();
    });
  },
  afterCreate: function(question, done){
    var ContentModel = sails.models[question.type + "content"];
    var contentQuery = ContentModel.findOne(question.content);
    contentQuery.exec(function (err, content) {
      //Replace the content id with the actual content and render the json
      content.question = question.id;
      content.save(done);
    })
  }
};
