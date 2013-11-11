var cloneObj = function(obj) {
  var newObj = (obj instanceof Array) ? [] : {};
  for (i in obj) {
    if (i == 'cloneObj') continue;
    if (obj[i] && typeof obj[i] == "object") {
      newObj[i] = cloneObj(obj[i]);
    } else newObj[i] = obj[i]
  } return newObj;
};