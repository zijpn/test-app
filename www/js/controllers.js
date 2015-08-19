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
  };

  $scope.logout = function() {
    Auth.$unauth();
  };
})

.controller('GamesCtrl', function($scope, TwitchTV) {
  var limit = 10;
  $scope.loaded = 0;
  $scope.more = false;
  $scope.loadMore = function() {
    TwitchTV.getTopGames($scope.loaded, limit)
      .then(function(games) {
        $scope.topGames.push.apply($scope.topGames, games.top);
        $scope.total = games._total;
        $scope.loaded = Math.min($scope.loaded + limit, $scope.total);
        $scope.more = $scope.loaded < $scope.total;
      })
      .finally(function() {
        // stop spinner
        $scope.$broadcast('scroll.infiniteScrollComplete');
      });
  };
  $scope.doRefresh = function() {
    TwitchTV.getTopGames(0, limit)
      .then(function(games) {
        $scope.topGames = games.top;
        $scope.total = games._total;
        $scope.loaded = Math.min(limit, $scope.total);
        $scope.more = $scope.loaded < $scope.total;
      })
      .finally(function() {
        // Stop the ion-refresher from spinning
        $scope.$broadcast('scroll.refreshComplete');
      });
  };
  // call refresh function
  $scope.doRefresh();
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

  $scope.chats = Chats.data.reverse();

  Auth.$onAuth(function(authData) {
    $scope.auth = authData;
  });

  $scope.remove = function(chat) {
    var ref = new Firebase(Chats.url + chat.$id);
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

.controller('ChatPostCtrl', function($scope, $state, $stateParams, Chats) {
  var auth = $stateParams.auth.github;
  $scope.avatar = auth.cachedUserProfile.avatar_url;
  $scope.post = function(form) {
    if (auth && form.msg) {
      var chatmsg = {
        name: auth.displayName || auth.username,
        face: $scope.avatar,
        text: form.msg.$viewValue,
        time: new Date().getTime()
      };
      // push to firebase
      Chats.ref.push(chatmsg);
    }
    // go back to message overview
    $state.go('tab.chat');
  };
})

.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
  var chatId = $stateParams.chatId;
  var chat = null;
  var chats = Chats.data;
  for (var i = 0; i < chats.length; i++) {
    if (chats[i].$id === chatId) {
      chat = chats[i];
      break;
    }
  }
  $scope.chat = chat;
});
