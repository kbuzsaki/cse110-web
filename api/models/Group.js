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

    toJSON: function(){
    	var json = {
    		id: this.id,
    		name: this.name,
    		members: this.members.map(function(member) {
    			return member.id;
    		})
    	};
  		return json;
  	}
  }


};