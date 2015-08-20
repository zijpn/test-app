angular.module("starter",["ionic","starter.controllers","starter.services","starter.filters","starter.auth"]).run(function($ionicPlatform){$ionicPlatform.ready(function(){window.cordova&&window.cordova.plugins&&window.cordova.plugins.Keyboard&&(cordova.plugins.Keyboard.hideKeyboardAccessoryBar(!0),cordova.plugins.Keyboard.disableScroll(!0)),window.StatusBar&&StatusBar.styleLightContent()})}).config(function($stateProvider,$urlRouterProvider){$stateProvider.state("tab",{url:"/tab","abstract":!0,templateUrl:"templates/tabs.html"}).state("tab.games",{url:"/games",views:{"tab-games":{templateUrl:"templates/tab-games.html",controller:"GamesCtrl"}}}).state("tab.game-detail",{url:"/games/:game",views:{"tab-games":{templateUrl:"templates/game-detail.html",controller:"GameDetailCtrl"}}}).state("tab.game-view",{url:"/games/:game/:stream",views:{"tab-games":{templateUrl:"templates/game-view.html",controller:"GameViewCtrl"}}}).state("tab.chat",{url:"/chat",views:{"tab-chat":{templateUrl:"templates/tab-chat.html",controller:"ChatCtrl"}}}).state("tab.chat-detail",{url:"/chat/:chatId",views:{"tab-chat":{templateUrl:"templates/chat-detail.html",controller:"ChatDetailCtrl"}}}).state("tab.chat-post",{url:"/chat/post",params:{auth:null},views:{"tab-chat":{templateUrl:"templates/chat-post.html",controller:"ChatPostCtrl"}}}).state("tab.login",{url:"/login",views:{"tab-login":{templateUrl:"templates/tab-login.html",controller:"AuthCtrl"}}}).state("tab.about",{url:"/about",views:{"tab-about":{templateUrl:"templates/tab-about.html"}}}),$urlRouterProvider.otherwise("/tab/games")}),angular.module("starter.controllers",[]).controller("AuthCtrl",function($scope,Auth){Auth.$onAuth(function(authData){$scope.authData=authData,$scope.title=authData?authData.github.displayName:"Login"}),$scope.login=function(provider){Auth.$authWithOAuthPopup(provider)["catch"](function(error){console.error(error)})},$scope.logout=function(){Auth.$unauth()}}).controller("GamesCtrl",function($scope,TwitchTV){var limit=20,first=!0;$scope.loaded=0,$scope.total=0,$scope.more=!1,$scope.loadMore=function(){return first?(first=!1,void $scope.$broadcast("scroll.infiniteScrollComplete")):void TwitchTV.getTopGames($scope.loaded,limit).then(function(games){games._total&&($scope.topGames.push.apply($scope.topGames,games.top),$scope.total=games._total,$scope.loaded=Math.min($scope.loaded+limit,$scope.total),$scope.more=$scope.loaded<$scope.total)})["finally"](function(){$scope.$broadcast("scroll.infiniteScrollComplete")})},$scope.doRefresh=function(){TwitchTV.getTopGames(0,limit).then(function(games){$scope.topGames=games.top,$scope.total=games._total,$scope.loaded=Math.min(limit,$scope.total),$scope.more=$scope.loaded<$scope.total})["finally"](function(){$scope.$broadcast("scroll.refreshComplete")})},$scope.doRefresh()}).controller("GameDetailCtrl",function($scope,$stateParams,TwitchTV){$scope.game=$stateParams.game,TwitchTV.getGameStreams($scope.game).then(function(streams){$scope.streams=streams})}).controller("GameViewCtrl",function($scope,$stateParams,TwitchTV){$scope.game=$stateParams.game,$scope.stream=$stateParams.stream,$scope.url=TwitchTV.getStreamUrl($scope.stream)}).controller("ChatCtrl",function($scope,$ionicPopup,$state,Chats,Auth){$scope.chats=Chats.data.reverse(),Auth.$onAuth(function(authData){$scope.auth=authData}),$scope.remove=function(chat){var ref=new Firebase(Chats.url+chat.$id);ref.remove()},$scope.add=function(){if($scope.auth)$state.go("tab.chat-post",{auth:$scope.auth});else{$ionicPopup.alert({title:"You need to login first"})}}}).controller("ChatPostCtrl",function($scope,$state,$stateParams,Chats){var auth=$stateParams.auth.github;$scope.avatar=auth.cachedUserProfile.avatar_url,$scope.post=function(form){if(auth&&form.msg){var chatmsg={name:auth.displayName||auth.username,face:$scope.avatar,text:form.msg.$viewValue,time:(new Date).getTime()};Chats.ref.push(chatmsg)}$state.go("tab.chat")}}).controller("ChatDetailCtrl",function($scope,$stateParams,Chats){for(var chatId=$stateParams.chatId,chat=null,chats=Chats.data,i=0;i<chats.length;i++)if(chats[i].$id===chatId){chat=chats[i];break}$scope.chat=chat}),angular.module("starter.services",["firebase"]).factory("Chats",function($firebaseArray){var chatUrl="https://test-app-ionic.firebaseio.com/chats/",chatRef=new Firebase(chatUrl);return{url:chatUrl,ref:chatRef,data:$firebaseArray(chatRef)}}).factory("TwitchTV",function($http,$q,$sce){function getTopGames(offset,limit){var def=$q.defer();return $http.jsonp(apiBaseUrl+"games/top?limit="+limit+"&offset="+offset+"&callback=JSON_CALLBACK").then(function(res){def.resolve(res.data)}),def.promise}function getGameStreams(game){var def=$q.defer();return $http.jsonp(apiBaseUrl+"streams?game="+encodeURIComponent(game)+"&callback=JSON_CALLBACK").then(function(res){def.resolve(res.data.streams)}),def.promise}function getStreamUrl(stream){var url="http://www.twitch.tv/"+stream+"/embed";return $sce.trustAsResourceUrl(url)}function getStreamUrlHLS(stream){var url="http://www.twitch.tv/"+stream+"/hls";return $sce.trustAsResourceUrl(url)}var apiBaseUrl="https://api.twitch.tv/kraken/",result={getTopGames:getTopGames,getGameStreams:getGameStreams,getStreamUrl:getStreamUrl,getStreamUrlHLS:getStreamUrlHLS};return result}),angular.module("starter.filters",[]).filter("proto",function(){return function(input,p){var protocol=p?p+":":"";return input.replace(/.*?:/,protocol)}}),angular.module("starter.auth",["firebase"]).factory("Auth",function($firebaseAuth){var ref=new Firebase("https://test-app-ionic.firebaseio.com");return $firebaseAuth(ref)});