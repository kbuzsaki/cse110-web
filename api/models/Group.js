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

function flatten (object) {
    var flat = {};
    for (var property in object) {
       if (object.hasOwnProperty(property) && property.constructor == Array) {
        object.property = property.map(function(items){ // Map the collection to its id
           return items.id;
        })
      }
      flat[property] = object[property];
    }
  return flat;
}
