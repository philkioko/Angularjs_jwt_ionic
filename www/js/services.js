angular.module('starter')
 
.service('AuthService', function($q,$http,$auth, USER_ROLES) {
  var LOCAL_TOKEN_KEY = 'user';
  var username = '';
  var isAuthenticated = false;
  var role = '';
  var authToken;
 
  function loadUserCredentials() {
    var token = window.localStorage.getItem(LOCAL_TOKEN_KEY);
    var tokenrole=window.localStorage.getItem('role');
    if (token,tokenrole) {
      useCredentials(token,tokenrole);
    }
  }
 
  function storeUserCredentials(token,tokenrole) {
    window.localStorage.setItem(LOCAL_TOKEN_KEY, token,tokenrole);
    window.localStorage.setItem('role',tokenrole);
    useCredentials(token,tokenrole);
  }
 
  function useCredentials(token,tokenrole) {
    username = token;
    role =tokenrole;
    isAuthenticated = true;
    authToken = token;
 
    if (role == '2') {
      role = USER_ROLES.admin
    }
    if (role == '3') {
      role = USER_ROLES.public
    }
  }
 
  function destroyUserCredentials() {
    authToken = undefined;
    username = '';
    isAuthenticated = false;
    window.localStorage.removeItem(LOCAL_TOKEN_KEY);
    window.localStorage.removeItem('role');
    $auth.logout();
  }
 
  var login = function(data) {
    return $q(function(resolve, reject) {
      $auth.login(data).then(function() {

            return $http.get('http://localhost:8000/api/user');
              // Handle errors
         }, function(error) {
           reject('Login Failed.');
            console.log(error);
            return false;
          }).then(function(response) {
             var token=response.data.user.firstname;
             var tokenrole=response.data.role.role_id;
           //        // Set the stringified user data into local storage
           // localStorage.setItem('user', user);
           storeUserCredentials(name + token,tokenrole);
           resolve(token);
            console.log(token);
            console.log(tokenrole);

       });
    });
  };
 
  var logout = function() {
    destroyUserCredentials();
  };
 
  var isAuthorized = function(authorizedRoles) {
    if (!angular.isArray(authorizedRoles)) {
      authorizedRoles = [authorizedRoles];
    }
    return (isAuthenticated && authorizedRoles.indexOf(role) !== -1);
  };
 
  loadUserCredentials();
 
  return {
    login: login,
    logout: logout,
    isAuthorized: isAuthorized,
    isAuthenticated: function() {return isAuthenticated;},
    username: function() {return username;},
    role: function() {return role;}
  };
})
.factory('AuthInterceptor', function ($rootScope, $q, AUTH_EVENTS) {
  return {
    responseError: function (response) {
      $rootScope.$broadcast({
        401: AUTH_EVENTS.notAuthenticated,
        403: AUTH_EVENTS.notAuthorized
      }[response.status], response);
      return $q.reject(response);
    }
  };
})
 
.config(function ($httpProvider) {
  $httpProvider.interceptors.push('AuthInterceptor');
});