angular.module('starter.services', ['firebase'])

.factory('Chats', function($firebaseArray) {
  var chatUrl = 'https://test-app-ionic.firebaseio.com/chats/';
  var chatRef = new Firebase(chatUrl);
  return {
    url: chatUrl,
    ref: chatRef,
    // $firebaseArray: synchronized collections (AngularFire)
    data: $firebaseArray(chatRef)
  };
})

// Twitch.tv
.factory('TwitchTV', function($http, $q, $sce) {
  var apiBaseUrl = 'https://api.twitch.tv/kraken/';
  // interface
  var result = {
    getTopGames: getTopGames,
    getGameStreams: getGameStreams,
    getStreamUrl: getStreamUrl,
    getStreamUrlHLS: getStreamUrlHLS
  };
  return result;

  // implementation
  function getTopGames(offset, limit) {
    // https://github.com/justintv/Twitch-API/blob/master/v3_resources/games.md#get-gamestop
    var def = $q.defer();
    $http.jsonp(apiBaseUrl + 'games/top?limit='+ limit +'&offset='+ offset +'&callback=JSON_CALLBACK')
      .then(function(res) {
        def.resolve(res.data);
      });
    return def.promise;
  }

  function getGameStreams(game) {
    var def = $q.defer();
    $http.jsonp(apiBaseUrl + 'streams?game=' + encodeURIComponent(game) + '&callback=JSON_CALLBACK')
      .then(function(res) {
        def.resolve(res.data.streams);
      });
    return def.promise;
  }

  function getStreamUrl(stream) {
    var url = "http://www.twitch.tv/" + stream + "/embed";
    // Strict Contextual Escaping
    // https://docs.angularjs.org/api/ng/service/$sce
    return $sce.trustAsResourceUrl(url);
  }

  function getStreamUrlHLS(stream) {
    var url = "http://www.twitch.tv/" + stream + "/hls";
    return $sce.trustAsResourceUrl(url);
  }

});
