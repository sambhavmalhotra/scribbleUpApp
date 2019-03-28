angular
    .module('homeModule', [])
    .controller('homeController', [
        '$scope', 'userPersistenceFactory', '$location', 'postService', 'utilService', '$timeout',
        function ($scope, userPersistenceFactory, $location, postService, utilService, $timeout) {
            $scope.userDetails = userPersistenceFactory.getCookieData();
            $scope.showMessage = false;
            $scope.openImage = false;
            $scope.showLoader = false;
            $scope.showPosts = true;

            function redirectToHomePage() {
                $location.path('/').replace();
            }

            if(!$scope.userDetails.name || !$scope.userDetails.email) {
                redirectToHomePage();
            }

            $('#postsTabs a').click(function (e) {
                e.preventDefault();
                $(this).tab('show')
            });

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
            };

            $scope.showOpenImage = function() {
                $scope.openImage = true;
            };

            $scope.hideOpenImage = function() {
                $scope.openImage = false;
            };

            function createEmptyPostContent() {
                $scope.postContent = {
                    heading: "",
                    description: ""
                };
            }

            function loadPosts() {
                openShowLoader();
                var request = {
                    email: $scope.userDetails.email
                };
                postService.findPostsByUser(request).then(onLoadSuccess, onLoadError);
            }

            function onLoadSuccess(response) {
                if(response.data.length === 0) {
                    $scope.showPosts = false;
                } else {
                    $scope.showPosts = true;
                    var data = angular.copy(response.data);
                    angular.forEach(data, function(val) {
                        val.content = "data:image/" + val.format + ";base64," + val.content;
                    });
                    $scope.postsList = angular.copy(data);
                }
                closeShowLoader();
            }

            function onLoadError(error) {
                utilService.setMessage(error.data.message, "error");
                $scope.userDetails = userPersistenceFactory.clearCookieData();
                closeShowLoader();
                redirectToHomePage();
            }

            $scope.logout = function() {
                userPersistenceFactory.clearCookieData();
                utilService.setMessage("You have been logged out successfully.", "success");
                redirectToHomePage();
            };

            $scope.savePost = function(type) {
                openShowLoader();
                var request = {
                    heading: $scope.postContent.heading,
                    email: $scope.userDetails.email,
                    postContentType: type
                };
                if(type === 'TEXT') {
                    request["description"] = $scope.postContent.description;
                    postService.createPost(request).then(onPostCreateSuccess, onError);
                } else if(type === 'IMAGE') {
                    var inputElement = document.getElementById("fileInput").files[0];
                    if (inputElement) {
                        var fileReader = new FileReader();
                        $timeout(function() {
                            fileReader.onloadend = function(e) {
                                request["content"] = e.target.result;
                                request["fileName"] = inputElement.name;
                                $scope.postContent["fileUploadError"] = null;
                                var fileFormat = request.fileName.split('.').pop();
                                fileFormat = fileFormat.toLowerCase();
                                if (fileFormat === "jpg" || fileFormat === "png" || fileFormat === "jpeg" || fileFormat === "tif" || fileFormat === "tiff" || fileFormat === "gif" || fileFormat === "giff" || fileFormat === "bmp") {
                                    request.fileName.format = fileFormat;
                                } else {
                                    $scope.postContent.fileUploadError = "Extensions allowed: jpg, jpeg, png, tif, tiff, gif, giff, bmp";
                                }
                                var content = request.content;
                                content = content.replace(/^data:image\/[a-z]+;base64,/, "");
                                request.content = content;
                                request["format"] = fileFormat;
                                postService.createPost(request).then(onPostCreateSuccess, onError);
                            };
                            fileReader.readAsDataURL(inputElement);
                        }, 200);
                    } else {
                        $scope.postContent.fileUploadError = "File is required";
                    }
                }
            };

            function clearFile() {
                angular.element("input[type='file']").val(null);
            }

            function onPostCreateSuccess(response) {
                createEmptyPostContent();
                clearFile();
                loadPosts();
            }

            function onError(error) {
                closeShowLoader();
                if(error.data.message.indexOf("User not found") > -1) {
                    utilService.setMessage(error.data.message, "error");
                    redirectToHomePage();
                } else {
                    var msg = {
                        data: [error.data.message]
                    };
                    utilService.showMessageBox($scope, "error", msg);
                    $scope.openMessageBox();
                }
            }

            $scope.fileChanged = function(file) {
                $scope.postContent.fileUploadError = null;
                if (file.files.length !== 0) {
                    var fileFormat = file.files[0].name.split('.').pop();
                    if (fileFormat === "jpg" || fileFormat === "png" || fileFormat === "jpeg" || fileFormat === "tif" || fileFormat === "tiff" || fileFormat === "gif" || fileFormat === "giff" || fileFormat === "bmp") {
                        $scope.postContent.format = fileFormat;
                        $scope.postContent.contentFileName = file.files[0].name;
                    } else {
                        $scope.postContent.fileUploadError = "Extensions allowed: jpg, jpeg, png, tif, tiff, gif, giff, bmp";
                    }
                }
                $scope.$apply();
            };

            $scope.magnifyImage = function(key) {
                var texter = _.findWhere($scope.postsList, {
                    id: key
                });
                $scope.selectedPostImage = texter.content;
                $scope.showOpenImage();
            };

            createEmptyPostContent();
            loadPosts();
        }
    ]);