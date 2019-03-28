(function(){
    var userServiceModule = angular.module('userServiceModule', []);
    var userService = function($http) {

        var API_PREFIX = "http://localhost:7070";

        this.authorizeLogin = function(request) {
            return $http.post(API_PREFIX + "/userReads/authorizeLogin", request);
        };

        this.registerUser = function(request) {
            return $http.post(API_PREFIX + "/userWrites/registerUser", request);
        };
    };

    userServiceModule.service('userService', userService);
    userService.$inject =['$http'];
})();