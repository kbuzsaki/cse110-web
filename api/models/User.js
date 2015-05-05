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
      var json = {
        id: this.id,
        name: this.name,
        hash: this.hash,
        avatar: this.avatar,
        groups: this.groups.map(function(group) {
          return group.id;
        })
      };
      console.log(this.groups);
      return json;
    }
  }
};

