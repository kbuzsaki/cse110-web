/**
* AccessCode.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {
    user: {
      model: 'user',
      required: true
    },
    poll: {
      model: 'poll',
      required: true
    },
    code: {
      type: 'string',
      required: true,
      unique: true
    }
  },
  beforeValidate: function(values, done){
    values.code = gg.generateCode();
    done();
  }
};

