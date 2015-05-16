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
