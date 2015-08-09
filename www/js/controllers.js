angular.module('starter.controllers', [])

.controller('AuthCtrl', function($scope, Auth) {
  Auth.$onAuth(function(authData) {
    $scope.authData = authData;
    $scope.title = authData ? authData.github.displayName : "Login";
  });

  $scope.login = function(provider) {
    Auth.$authWithOAuthPopup(provider).catch(function(error) {
      console.error(error);
    });
  }

  $scope.logout = function() {
    Auth.$unauth();
  }
})

.controller('GamesCtrl', function($scope, TwitchTV) {
  TwitchTV.getTopGames().then(function(games) {
    $scope.topGames = games;
  });
})

.controller('GameDetailCtrl', function($scope, $stateParams, TwitchTV) {
  $scope.game = $stateParams.game;
  TwitchTV.getGameStreams($scope.game).then(function(streams) {
    $scope.streams = streams;
  });
})

.controller('GameViewCtrl', function($scope, $stateParams, TwitchTV) {
  $scope.game = $stateParams.game;
  $scope.stream = $stateParams.stream;
  $scope.url = TwitchTV.getStreamUrl($scope.stream);
})

.controller('ChatCtrl', function($scope, $ionicPopup, $state, Chats, Auth) {
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  $scope.chats = Chats.reverse();

  Auth.$onAuth(function(authData) {
    $scope.auth = authData;
  });

  $scope.remove = function(chat) {
    var ref = new Firebase('https://test-app-ionic.firebaseio.com/chats/' + chat.$id);
    ref.remove();
  };

  $scope.add = function() {
    if (!$scope.auth) {
      var popup = $ionicPopup.alert({
        title: 'You need to login first'
      });
      return;
    }
    // change view and pass auth object to it
    $state.go('tab.chat-post', { auth: $scope.auth });
  };
})

.controller('ChatPostCtrl', function($scope, $state, $stateParams) {
  $scope.auth = $stateParams.auth;
  $scope.post = function(form) {
    if ($scope.auth && form.msg) {
      var chatmsg = {
        name: $scope.auth.github.displayName,
        face: $scope.auth.github.cachedUserProfile.avatar_url,
        text: form.msg.$viewValue,
        time: new Date().getTime()
      };
      // add it to firebase
      var ref = new Firebase('https://test-app-ionic.firebaseio.com/chats/');
      ref.push(chatmsg);
      // go back to message overview
      $state.go('tab.chat');
    }
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
});
