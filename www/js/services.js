angular.module('starter.services', ['firebase'])

.factory('Chats', ['$firebaseArray', function($firebaseArray) {
  var chatsRef = new Firebase('https://test-app-ionic.firebaseio.com/chats');
  return $firebaseArray(chatsRef);
}]);

