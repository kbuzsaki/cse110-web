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
/*    this.members = this.members.map(function(member) {
        return member.id;
      })
      this.polls = this.polls.map(function(poll) {
        return poll.id;
      })
  		return this;*/
      return flatten(this);
  	}
  }

};

function flatten (object) {
    var flat = {
      //arr : []
    };
    for (var property in object) {
       if (object.hasOwnProperty(property) && property.constructor == Array) {  // Map the collection to its id
        object.property = property.map(function(items){
           return items.id;
        })
        //flat.arr = flat.arr.concat(object.property); // Concate the properties
        //flat[property] = object[property];
      }
      flat[property] = object[property];
        //console.log("flat.property: " + property);
    }
  return flat;
}