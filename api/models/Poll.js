/**
* Poll.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  schema: true,
  attributes: {
    group : {
      model:'group',
      required: true
    },
    creator : {
      model:'user',
      required: true
    },
    name: {
      type: 'string',
      required: true
    },
    hash: {
      type: 'string',
      required: true
      //TODO UNIQUE
    },
    questions: {
      collection: 'question',
      via: 'poll'
    },
    toJSON: function(){
      return this;
    }
  }
};
