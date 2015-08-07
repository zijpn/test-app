angular.module('starter.services', ['firebase'])

// AngularFire Service
//  $firebaseArray : synchronized collections
.factory('Chats', function($firebaseArray) {
  var chatsRef = new Firebase('https://test-app-ionic.firebaseio.com/chats');
  return $firebaseArray(chatsRef);
});
