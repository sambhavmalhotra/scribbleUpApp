(function(){
    var postServiceModule = angular.module('postServiceModule', []);
    var postService = function($http) {

        var API_PREFIX = "http://localhost:7070";

        this.findPostsByUser = function(request) {
            return $http.post(API_PREFIX + "/postReads/findPostsByUser", request);
        };

        this.createPost = function(request) {
            return $http.post(API_PREFIX + "/postWrites/createPost", request);
        };
    };

    postServiceModule.service('postService', postService);
    postService.$inject =['$http'];
})();