angular
    .module('loginSignupModule', [])
    .controller('loginSignupController', [
        '$scope', 'userService', '$window', '$location', 'userPersistenceFactory', 'utilService',
        function ($scope, userService, $window, $location, userPersistenceFactory, utilService) {

            $scope.showLoginBox = false;
            $scope.showSignUpBox = true;
            $scope.showMessage = false;
            $scope.showLoader = false;

            function openShowLoader() {
                $scope.showLoader = true;
            }

            function closeShowLoader() {
                $scope.showLoader = false;
            }

            $scope.closeMessageBox = function() {
                $scope.showMessage = false;
            };

            $scope.openMessageBox = function() {
                $scope.showMessage = true;
                $window.scrollTo(0,0);
            };

            $scope.msg = utilService.getMessage();

            if($scope.msg.data !== "") {
                var msg = {
                    data: [$scope.msg.data]
                };
                utilService.showMessageBox($scope, $scope.msg.type, msg);
                $scope.openMessageBox();
                utilService.setMessage("", "");
            }

            $scope.userDetails = userPersistenceFactory.getCookieData();

            function redirectToHomePage() {
                $location.path("/home");
            }

            if($scope.userDetails.name && $scope.userDetails.email) {
                redirectToHomePage();
            }

            function createEmptyDetails() {
                $scope.loginDetails = {
                    email: "",
                    password: ""
                };
                $scope.signUpDetails = {
                    name: "",
                    email: "",
                    password: "",
                    confirmPassword: "",
                    userType: "USER"
                };
            }

            $scope.openSignUp = function() {
                $scope.showSignUpBox = true;
                $scope.closeMessageBox();
            };

            $scope.closeSignUp = function() {
                $scope.showSignUpBox = false;
                $scope.closeMessageBox();
            };

            $scope.openLogin = function() {
                $scope.showLoginBox = true;
            };

            $scope.closeLogin = function() {
                $scope.showLoginBox = false;
            };

            $scope.showLogin = function() {
                if($scope.showSignUpBox) {
                    $scope.closeSignUp();
                }
                createEmptyDetails();
                $scope.openLogin();
            };

            $scope.showSignUp = function() {
                if($scope.showLoginBox) {
                    $scope.closeLogin();
                }
                createEmptyDetails();
                $scope.openSignUp();
            };

            $scope.login = function() {
                openShowLoader();
                $scope.closeMessageBox();
                userService.authorizeLogin($scope.loginDetails).then(onLoginSuccess, onError);
            };

            $scope.signUp = function() {
                $scope.closeMessageBox();
                if($scope.signUpDetails.password !== $scope.signUpDetails.confirmPassword) {
                    var msg = {
                        data: ["Passwords do not match."]
                    };
                    utilService.showMessageBox($scope, "error", msg);
                    $scope.openMessageBox();
                } else {
                    userService.registerUser($scope.signUpDetails).then(onRegisterSuccess, onError);
                }
            };

            function onLoginSuccess(response) {
                userPersistenceFactory.setCookieData(response.data);
                createEmptyDetails();
                closeShowLoader();
                $location.path("/home");
            }

            function onRegisterSuccess(response) {
                var details = {
                    name: $scope.signUpDetails.name,
                    email: $scope.signUpDetails.email,
                    userType: $scope.signUpDetails.userType
                };
                userPersistenceFactory.setCookieData(details);
                createEmptyDetails();
                closeShowLoader();
                $location.path("/home");
            }

            function onError(error) {
                var msg = {
                    data: [error.data.message]
                };
                utilService.showMessageBox($scope, "error", msg);
                if(error.data.message.indexOf("User already exists") > -1) {
                    var email = $scope.signUpDetails.email;
                    $scope.showLogin();
                    $scope.loginDetails.email = email;
                }
                $scope.openMessageBox();
                closeShowLoader();
            }

            createEmptyDetails();
        }
    ]);