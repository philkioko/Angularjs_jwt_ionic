angular.module("starter")

.controller('AppCtrl', function($scope, $state, $ionicPopup, AuthService, AUTH_EVENTS) {
  $scope.username = AuthService.username();
 
  $scope.$on(AUTH_EVENTS.notAuthorized, function(event) {
    var alertPopup = $ionicPopup.alert({
      title: 'Unauthorized!',
      template: 'You are not allowed to access this resource.'
    });
  });
 
  $scope.$on(AUTH_EVENTS.notAuthenticated, function(event) {
    AuthService.logout();
    $state.go('login');
    var alertPopup = $ionicPopup.alert({
      title: 'Session Lost!',
      template: 'Sorry, You have to login again.'
    });
  });
 
  $scope.setCurrentUsername = function(authenticated) {
    $scope.username = authenticated;
  };
})
.controller('LoginCtrl', function($scope,$http,$state, $ionicPopup, AuthService) {
  $scope.data ={};
  $scope.login = function(data) {
	    AuthService.login(data).then(function(authenticated) {
	      $state.go('main.dash', {}, {reload: true});
	      $scope.setCurrentUsername(authenticated);
	    }, function(err) {
	      var alertPopup = $ionicPopup.alert({
	        title: 'Login failed!',
	        template: 'Please check your credentials!'
	      });
	    });
  };
})

.controller('DashCtrl', function($scope, $state, $http, $ionicPopup, AuthService) {

  $scope.logout = function() {
  	  	 AuthService.logout();
         $state.go('login');
  };
 
  $scope.performValideRequest = function() {
    $http.get('http://localhost:8000/api/Users').success(function(data) {
                $scope.userz = data;
                console.log(data);
            })
	  	 		.catch(function(error) {
                // $scope.error = error.status;
                console.log(error);
            });
  };
 
  $scope.performUnauthorizedRequest = function() {
  	console.log("hello");
    // $http.get('http://localhost:8100/notauthorized').then(
    //   function(result) {
    //     // No result here..
    //   }, function(err) {
    //     $scope.response = err;
    //   });
  };
 
  $scope.performInvalidRequest = function() {
  	console.log("hello");
    // $http.get('http://localhost:8100/notauthenticated').then(
    //   function(result) {
    //     // No result here..
    //   }, function(err) {
    //     $scope.response = err;
    //   });
  };
});