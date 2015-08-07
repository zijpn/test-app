angular.module('starter.auth', ['firebase'])

// AngularFire Service
//  $firebaseAuth : authentication, user management, routing
.factory('Auth', function($firebaseAuth) {
  var ref = new Firebase('https://test-app-ionic.firebaseio.com');
  return $firebaseAuth(ref);
});
