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
    toJSON: function(){
      var json = {
        id: this.id,
        poll: this.poll.id,
        type: this.type,
        title: this.title,
        content: this.content
      };

      /*if (this.type == "choice") {
        json.content = ChoiceContent.findOne(this.content, function(err, content) {
          json.content = content;
        });
      }*/

      return json;
    }
  }
};

