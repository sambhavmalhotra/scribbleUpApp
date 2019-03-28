"use strict";
angular
    .module('utilServiceModule', [])
    .service('utilService',[function() {
        var msg = {
            data: "",
            type: ""
        };

        this.setMessage = function(message) {
            msg.data = message;
        };

        this.setMessage = function(message, type) {
            msg.data = message;
            msg.type = type;
        };

        this.getMessage = function() {
            return msg;
        };

        this.showMessageBox = function($scope, messageType, messageBody) {
            $scope.messageBody = {};
            if(messageType === "success") {
                $scope.alertClass = "alert alert-success";
            } else if(messageType === "error") {
                $scope.alertClass = "alert alert-danger";
            } else if(messageType === "warning") {
                $scope.alertClass = "alert alert-warning";
            }
            $scope.messageBody = messageBody;
        };
    }]);