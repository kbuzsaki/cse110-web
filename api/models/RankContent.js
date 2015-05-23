/**
* RankContent.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {
  schema: true,
  attributes: {
    options: {
      type: 'string',
    },
    question: {
      model: 'question',
      required: true
    },
    responses: {
      collection: 'RankResponse',
      via: 'content'
    },
    toJSON: function() {
      //var data = gg.flatten(this);
      data = this;
      data.options = this.options.split("\n");
      return data;
    }
  }
};

