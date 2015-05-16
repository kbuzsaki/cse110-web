/**
* Group.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  schema: true,
  attributes: {
    name: {
      type: 'string',
      required: true
    },
    members: {
      collection: 'User',
      via: 'groups',
      dominant: true
    },
    polls: {
      collection: 'Poll',
      via: 'group',
    },

    toJSON: function(){
  		return gg.flatten(this);
  	}
  }

};
