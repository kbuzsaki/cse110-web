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