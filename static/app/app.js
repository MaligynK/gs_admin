app = angular.module('admin', ['ui.bootstrap', 'ngRoute', 'ngResource', 'ui.router']);

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
	}
]);



app.config(function($stateProvider, $routeProvider){

    $stateProvider
        .state('current_games', {
            url: '/current_games',		
            views: {
                '': {
                    templateUrl: "static/app/templates/current_games.html",
                    controller: ['$scope', '$http', '$rootScope', 'dataService',
                        function ($scope, $http, $rootScope, dataService) {

                            $http.jsonp('http://gs' + dataService.data.server + '.1chess.org/gs_admin/games.get/?callback=JSON_CALLBACK').success(function (data) {
                                $scope.current_games = data.items;
                                if($scope.current_games.length > 100){
                                    $scope.games = $scope.current_games.slice(0,100);
                                } else {
                                    $scope.games = $scope.current_games;
                                }
                                $scope.page = 1;
                            }).error(function (err) {
                                console.log('error',err);
                            });

                            $scope.getPage = function (page){
                                page = $scope.page + page;
                                if (page > 0 && $scope.current_games.length > (page * 100 - 100)){
                                    $scope.games = $scope.current_games.slice(page * 100 - 101, page * 100);
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
                    templateUrl: "static/app/templates/current_games.html",
                    controller: ['$scope', '$http', '$q',
                        function($scope, $http, $q) {

						
							
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

