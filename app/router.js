(function() {
    // configure our routes
    angular.module('draftApp').config(configRouts);
    configRouts.$inject = ['$routeProvider'];

    function configRouts($routeProvider) {
        $routeProvider
            .when('/viewdraft', {
                templateUrl : 'templates/viewdraft.html',
                controller  : 'ViewDraftController',
                controllerAs : 'vm'
            })
            // route for the add draft page
            .when('/adddraft', {
                templateUrl : 'templates/adddraft.html',
                controller  : 'AddDraftController',
                controllerAs: 'am'
            })
            // route for the edit owners page
            .when('/editowners', {
                templateUrl : 'templates/editowners.html',
                controller  : 'EditOwnersController',
                controllerAs: 'em'
            })
            // route for the live draft page
            .when('/draft', {
                templateUrl : 'templates/draft.html',
                controller  : 'LiveController',
                controllerAs: 'lm'
            })
            // route for the keepers page
            .when('/keepers', {
                templateUrl : 'templates/keepers.html',
                controller  : 'KeepersController',
                controllerAs: 'km'
            })
            // route for the picks view page
            .when('/livePicks', {
                templateUrl : 'templates/picks.html',
                controller  : 'PicksController',
                controllerAs: 'pm'
            // route for default page
            }).otherwise({
                redirectTo : 'adddraft'
            });
    }
})();