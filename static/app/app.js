app = angular.module('admin', ['ui.bootstrap', 'ngRoute', 'ngResource', 'ui.router', 'ngTouch']);

app.config(function($httpProvider){
    $httpProvider.defaults.xsrfCookieName = "csrftoken";
    $httpProvider.defaults.xsrfHeaderName = "X-CSRFToken";
});


app.service('dataService', [
        '$log',
        function ($log) {
            this.data = {};
        }
])



app.controller('CommonController', ['$scope', 'dataService',
	function ($scope, dataService){
        $scope.data = {};
        $scope.data.server = 5001;
        dataService.data = $scope.data;

        dataService.status = {
                        0:  'Ход белых',
                        1:  'Ход черных',
                        11: 'Победа белых',
                        12: 'Победа белых - время истекло',
                        13: 'Победа белых - оппонент сдался',
                        21: 'Победа черных',
                        22: 'Победа черных - время истекло',
                        23: 'Победа черных - оппонент сдался',
                        30: 'Ничья',
                        31: 'Пат',
                        32: 'Правило 50 ходов',
                        33: 'Правило трех повторений',
                        34: 'Недостаточно фигур, чтобы поставить мат',
                        40: 'Белые отменили игру',
                        41: 'Черные отменили игру',
                        42: 'Игра отменена - время истекло',
                        50: 'Ожидание противника'
        };


	}
]);



app.config(function($stateProvider, $routeProvider){

    $stateProvider
        .state('current_games', {
            url: '/current_games',		
            views: {
                '': {
                    templateUrl: "static/app/templates/current_games.html",
                    controller: ['$scope', '$http', 'dataService', '$log',
                        function ($scope, $http, dataService, $log) {
                            $scope.status = dataService.status;
                            $scope.server = dataService.data.server;
                            $http.jsonp('http://gs' + $scope.server + '.1chess.org/gs_admin/games.get/?callback=JSON_CALLBACK').success(function (data) {
                                $scope.games = data.items;
                                $scope.page = 0;
                            }).error(function (err) {
                                $log.info('error',err);
                            });

                            $scope.getPage = function (page){
                                page = $scope.page + page;
                                if (page >= 0 && $scope.games.length > (page * 100)){
                                    $scope.page = page;
                                }
                            }

                        }
                    ]
                }
            }
        })
        .state('archive_games', {
            url: '/archive_games',
			views: {
                '': {
                    templateUrl: "static/app/templates/archive_games.html",
                    controller: ['$scope', '$http', '$q', 'dataService', '$log',
                        function($scope, $http, $q, dataService, $log) {

                            $scope.status = dataService.status;

                            $http.jsonp('http://gs' + dataService.data.server + '.1chess.org/gs_admin/archive_games.get/?callback=JSON_CALLBACK').success(function (data) {
                                $scope.games = data.items;
                                $scope.page = 0;
                            }).error(function (err) {
                                $log.info('error',err);
                            });

                            $scope.getPage = function (page){
                                page = $scope.page + page;
                                if (page >= 0 && $scope.games.length > (page * 100)){
                                    $scope.page = page;
                                }
                            }
							
                        }
                    ]
                }
            }
        })

        .state('last_turns', {
            url: '/last_turns',
			views: {
                '': {
                    templateUrl: "static/app/templates/last_turns.html",
                    controller: ['$scope', '$http', '$q', 'dataService', '$log',
                        function($scope, $http, $q, dataService, $log) {
                            $scope.server = dataService.data.server;
                            $scope.time = new Date();
                            $http.jsonp('http://gs' + $scope.server + '.1chess.org/gs_admin/turns.get/?callback=JSON_CALLBACK').success(function (data) {
                                $scope.turns = data.items;
                            }).error(function (err) {
                                $log.info('error',err);
                            });
                            $scope.searchID = function(id){
                                $scope.search = id;
                            }
                        }
                    ]
                }
            }
        })


        .state('users', {
            url: '/users',
            views: {
                '': {
                    templateUrl: "static/app/templates/users.html",
                    controller: ['$scope', '$http', '$q', '$stateParams',
                        function($scope, $http, $q, $stateParams) {



                        }
                    ]
                }
            }
        })

});

