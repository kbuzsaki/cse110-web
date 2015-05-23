exports.flatten = function(obj) {
  _.forEach(obj, function (property,key) {
    if (property.constructor === Array){
      obj[key] = property.map(function(item) {
          return item.id;
      })
    }else{
      if (property.id) obj[key] = property.id;
    }
  });
  return obj;
}


exports.generateCode = function() {
  var word = require('./words.js')
  
  var animalIndex = Math.floor(Math.random() * (word.animals.length));
  var adjectiveIndex = Math.floor(Math.random() * (word.adjectives.length));

  return(word.adjectives[adjectiveIndex] + word.animals[animalIndex]);

}
