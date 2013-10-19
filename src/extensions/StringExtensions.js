/**
 *  a shim for .net styled string formating.
 *  @url http://stackoverflow.com/questions/610406/javascript-equivalent-to-printf-string-format/4673436#4673436
 */
String.prototype.format = function() {
  var args = arguments;
  return this.replace(/{(\d+)}/g, function(match, number) {
    return typeof args[number] != 'undefined'
      ? args[number]
      : match
    ;
  });
};

String.concat = function() {
    var str = '';
    for (i = 0; i < arguments.length; i++)
        str = str.concat (arguments[i]);
    return str;
};
