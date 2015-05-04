/**
* ChoiceContent.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {
  schema: true,
  attributes: {
    allow_multiple: {
      type: 'boolean'
    },
    allow_custom: {
      type: 'boolean'
    },
    options: {
      type: 'string',
    },
    poll: {
      model: 'poll'
    }
    /*responses: {
      collection: 'ChoiceResponse',
      via: 'question'
    }*/
  }
};

