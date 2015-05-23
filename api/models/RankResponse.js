/**
* RankResponse.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/



module.exports = {
  schema: true,
  attributes: {
    responder: {
      model :'user',
      required: true
    },
    content: {
      model:'RankContent',
      required: true
    },
    choices: {
      type: 'string',
      required: true
    },
    question: {
      model: 'question',
      required: true
    },
    toJSON: function() {
      this.choices = this.choices.split("\n");
      return this;
    }
  }
};

