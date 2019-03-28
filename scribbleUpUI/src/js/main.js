'use strict';
// Declare app level module which depends on views, and components
define([
        'jquery',
        'angular',
        "./components/loginSignup.html", //001
        "./components/home.html", //002
        'angular-route',
        'angular-cookies',
        'angular-sanitize',
        'ui-bootstrap4',
        'font-awesome/css/font-awesome.css',
        "bootstrap/dist/css/bootstrap.css",
        "bootstrap/dist/js/bootstrap.min.js",
        'angular-promise-tracker',
        './components/loginSignup.js',
        './components/home.js',
        './services/userService.js',
        './services/postService.js',
        './services/utilService.js',
        './services/userPersistenceFactory.js',
        '../css/app.css'
    ], function(
        jquery,
        angular,
        loginSignUpTemplate, //001
        homeTemplate) {

        angular.module("scribbleupApp",[
            'ngRoute',
            'ngCookies',
            'ngSanitize',
            'ui.bootstrap',
            'ajoslin.promise-tracker',
            'loginSignupModule',
            'homeModule',
            'userServiceModule',
            'postServiceModule',
            'utilServiceModule',
            'userPersistenceFactoryModule'
            ])
            .config([
                '$routeProvider',
                function($routeProvider) {
                    $routeProvider.when("/", {
                        templateUrl: loginSignUpTemplate
                    }).when("/home", {
                        templateUrl: homeTemplate
                    }).otherwise({
                        redirectTo:'/'
                    })
                }
            ])
    }
);
