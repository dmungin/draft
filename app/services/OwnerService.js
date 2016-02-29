(function() {
    'use strict';
    angular.module('draftApp').factory('ownerService', ownerService);
    ownerService.$inject = ['$http'];

    function ownerService($http) {
        function getOwners(leagueName) {
            return $http.post('/getOwners', {league: leagueName});
        }
        function saveOwners(owners) {
            return $http.post('/saveOwners', {owners: owners});
        }
        return  {
            getOwners: getOwners,
            saveOwners: saveOwners
        };
    }
})();

