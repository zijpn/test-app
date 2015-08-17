angular.module('starter.filters', [])

.filter('proto', function() {
  return function(input, p) {
    var protocol = p ? p + ':' : '';
    return input.replace(/.*?:/, protocol);
  };
});

