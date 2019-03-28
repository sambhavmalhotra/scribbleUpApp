angular
    .module('userPersistenceFactoryModule', [])
    .factory('userPersistenceFactory', ["$rootScope", "$cookies",
        function ($rootScope, $cookies) {
            return {
                setCookieData: function (userDetails) {
                    $cookies.put("scribbleName", userDetails.name);
                    $cookies.put("scribbleEmail", userDetails.email);
                },
                getCookieData: function () {
                    var request = {
                        name: $cookies.get("scribbleName"),
                        email: $cookies.get("scribbleEmail")
                    };
                    return request;
                },
                clearCookieData: function () {
                    $cookies.remove("scribbleName");
                    $cookies.remove("scribbleEmail");
                }
            }
        }
    ]);