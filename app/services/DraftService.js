(function() {
    'use strict';
    angular.module('draftApp').factory('draftService', draftService);
    draftService.$inject = ['$http'];

    function draftService($http) {
        function getDrafts() {
           return $http.get('/getDrafts');
        }
        function getDraft(draftID) {
            return $http.get('/getDraft', {params: {currentDraftID: draftID}});
        }
        function addDraft(newDraft) {
            return $http.post('/addDraft', {draft: newDraft});
        }
        return  {
            getDrafts: getDrafts,
            getDraft: getDraft,
            addDraft: addDraft
        };
    }
})();

