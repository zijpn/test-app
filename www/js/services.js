angular.module('starter.services', ['firebase'])

// AngularFire Service
//  $firebaseArray : synchronized collections
.factory('Chats', function($firebaseArray) {
  var chatsRef = new Firebase('https://test-app-ionic.firebaseio.com/chats');
  return $firebaseArray(chatsRef);
})

// Twitch.tv
.factory('TwitchTV', function($http, $q, $sce) {
  // interface
  var result = {
    getTopGames: getTopGames,
    getGameStreams: getGameStreams,
    getStreamUrl: getStreamUrl,
    getStreamUrlHLS: getStreamUrlHLS
  };
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

  function getGameStreams(game) {
    var def = $q.defer();
    $http.jsonp('https://api.twitch.tv/kraken/streams?game=' + encodeURIComponent(game) + '&callback=JSON_CALLBACK')
      .then(function(res) {
        def.resolve(res.data.streams);
      });
    return def.promise;
  }

  function getStreamUrl(stream) {
    // Strict Contextual Escaping
    // https://docs.angularjs.org/api/ng/service/$sce
    var url = "http://www.twitch.tv/" + stream + "/embed";
    return $sce.trustAsResourceUrl(url);
  }

  function getStreamUrlHLS(stream) {
    var url = "http://www.twitch.tv/" + stream + "/hls";
    return $sce.trustAsResourceUrl(url);
  }

});
