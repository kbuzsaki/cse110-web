/**
* User.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  schema: true,
  attributes: {
    hash: {
      type: 'string',
      required: true,
      unique: true
    },
    name: {
      type: 'string',
      required: true
    },
    avatar: {
      type: 'string'
    },
    groups: {
      collection: 'Group',
      via:'members'
    },
    toJSON: function(){
      this.groups = this.groups.map(function(group) {
          return group.id;
      })
      return this;
    }
  }
};

