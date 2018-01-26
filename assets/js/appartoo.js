var app = angular.module('Marsupilami', ['ngResource', 'angular-oauth2']);
app.controller('Marsupilami', function ($scope, $resource) {
    $scope.loading = false;

    $scope.removeFriend = function (id) {
        var token = "Bearer " + $scope.token;
        var url = "http://localhost/appartoo-back/web/app_dev.php/remove";
        var postaction = $resource(url, null, {
            'get': {
                method: 'GET',
                headers: {
                    'Authorization': token
                },
                params: {'id': id}
            }
        });
        postaction.get({
            'id': id
        },
        function (data) {
            $scope.getuser();
        },
                function (error) {
                });
    };

    $scope.addFriend = function (id) {
        var token = "Bearer " + $scope.token;
        var url = "http://localhost/appartoo-back/web/app_dev.php/add";
        var postaction = $resource(url, null, {
            'get': {
                method: 'GET',
                headers: {
                    'Authorization': token
                },
                params: {'id': id}
            }
        });
        postaction.get({
            'id': id
        },
        function (data) {
            $scope.getuser();
        },
                function (error) {
                });
    };

    $scope.invit = function () {
        var token = "Bearer " + $scope.token;
        var url = "http://localhost/appartoo-back/web/app_dev.php/invit";
        var postaction = $resource(url, null, {
            'get': {
                method: 'GET',
                headers: {
                    'Authorization': token
                },
                params: '$scope.keyword'
            }
        });
        postaction.get({
            'email': $scope.invitation
        },
        function (data) {
            alert(data.message)
            $scope.getuser();

        },
                function (error) {
                });

    };


    $scope.token = '';

    $scope.login = function (id)
    {
        var url = "http://localhost/appartoo-back/web/app_dev.php/login";
        $scope.data = $scope.userlogin;
        var postaction = $resource(url, null,
                {
                    'post': {method: 'POST'}
                });
        postaction.post(null, $scope.data,
                function (data) {
                    var tokenn = data.token;
                    $scope.token = data.token;
                    if (data.token)
                    {
                        $scope.showLoginForm = false;
                        $scope.showRegisterForm = false;
                    }
                    $scope.getuser(data.token);
                },
                function (error) {
                });
    };


    $scope.register = function (id)
    {
        var url = "http://localhost/appartoo-back/web/app_dev.php/register";
        formData = JSON.stringify($scope.registerUser);
        var postaction = $resource(url, null,
                {
                    'post': {method: 'POST'}
                });
        postaction.post(null, formData,
                function (data) {
                    if (data.msg == "The user has been created successfully")
                        alert("Votre nouveau compte a été créé avec succès ! Nous sommes heureux de vous accueillir ")
                    var tokenn = data.token;
                    $scope.token = data.token;
                    if (data.token)
                    {
                        $scope.showLoginForm = false;
                        $scope.showRegisterForm = false;
                    }

                    $scope.getuser(data.token);
                },
                function (error) {
                });


    };

    $scope.search = function (token) {
        var token = "Bearer " + $scope.token;
        var url = "http://localhost/appartoo-back/web/app_dev.php/search";
        var postaction = $resource(url, null, {
            'get': {
                method: 'GET',
                headers: {
                    'Authorization': token
                },
                params: '$scope.keyword'
            }
        });
        postaction.get({
            'keyword': $scope.keyword
        },
        function (data) {
            if (data.users)
                $scope.searchFriends = data.users;
        },
                function (error) {
                });
    };

    $scope.editUser = {};

    $scope.getuser = function (token) {
        var token = "Bearer " + $scope.token;
        var url = "http://localhost/appartoo-back/web/app_dev.php/list";
        var postaction = $resource(url, null, {
            'get': {
                method: 'GET',
                headers: {
                    'Authorization': token
                },
                params: '$scope.keyword'
            }
        });
        postaction.get({
            'keyword': $scope.keyword
        },
        function (data) {
            $scope.users = data.users;
            $scope.user = data.user;


            $scope.editUser.username = $scope.user.username;
            $scope.editUser.age = $scope.user.age;
            $scope.editUser.race = $scope.user.race;
            $scope.editUser.nourriture = $scope.user.nourriture;
            $scope.editUser.famille = $scope.user.famille;
            $scope.editUser.email = $scope.user.email;
            $scope.editUser.current_password = $scope.user.username;

            $scope.friends = data.user.friends;
        },
                function (error) {
                });
    };

    $scope.updateUser = function (id)
    {
        var token = "Bearer " + $scope.token;
        var url = "http://localhost/appartoo-back/web/app_dev.php/profile/" + $scope.user.id;
        formData = JSON.stringify($scope.editUser);
        var postaction = $resource(url, null, {
            'put': {
                method: 'PUT',
                headers: {
                    'Authorization': token
                },
                params: formData
            }
        });
        postaction.put(
                formData
                ,
                function (data) {
                    $scope.getuser();
                },
                function (error) {
                });
    };
});

app.config(function ($interpolateProvider) {
    $interpolateProvider.startSymbol('{[{').endSymbol('}]}');
});

app.run(['OAuth', function (OAuth) {
        OAuth.configure({
            baseUrl: 'http://localhost/appartoo-back/web/app_dev.php/login',
            clientId: '1_3bcbxd9e24g0gk4swg0kwgcwg4o8k8g4g888kwc44gcc0gwwk4',
            clientSecret: '4ok2x70rlfokc8g0wws8c8kwcokw80k44sg48goc0ok4w0so0k'
        });
    }]);