angular.module('starter.controllers', [])

.controller('DashCtrl', function($scope) {})

.controller('ChatsCtrl', function($scope, Chats) {
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  $scope.chats = Chats;

  $scope.remove = function(chat) {
    var ref = new Firebase('https://test-app-ionic.firebaseio.com/chats/' + chat.$id);
    ref.remove();
  };
})

.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
  var chatId = $stateParams.chatId;
  var chat = null;
  for (var i = 0; i < Chats.length; i++) {
    if (Chats[i].$id === chatId) {
      chat = Chats[i];
      break;
    }
  }
  $scope.chat = chat;
})

.controller('AccountCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
});
