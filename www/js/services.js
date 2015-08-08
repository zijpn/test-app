angular.module('starter.services', ['firebase'])

// AngularFire Service
//  $firebaseArray : synchronized collections
.factory('Chats', function($firebaseArray) {
  var chatsRef = new Firebase('https://test-app-ionic.firebaseio.com/chats');
  return $firebaseArray(chatsRef);
})

// Twitch.tv
.factory('TwitchTV', function($http, $q) {
  // interface
  var result = {
    getTopGames: getTopGames
  }
  return result;

  // implementation
  function getTopGames() {
    var def = $q.defer();
    $http.jsonp('https://api.twitch.tv/kraken/games/top?callback=JSON_CALLBACK')
      .then(function(res) {
        def.resolve(res.data.top);
      });
    return def.promise;
  }
});
