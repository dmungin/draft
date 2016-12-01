(function() {
    'use strict';
    require('../services/tabService');
    require('../services/draftService');
    require('../services/currentDraftService');
    /* Add Draft Controller - Used to add new drafts  */
    angular.module('draftApp').controller('AddDraftController', AddDraftController);
    AddDraftController.$inject = ['tabService', 'draftService', 'currentDraftService'];

    function AddDraftController(tabService, draftService, currentDraftService) {
        var vm = this;
        tabService.setTabs("none");
        vm.currentDraft = currentDraftService.getCurrentWrapper();
        vm.addDraft = addDraft;
        currentDraftService.clearCurrentDraft();
        vm.newDraft = {
            size: 10,
            leagueName: "Default Name",
            isPPR: false,
            flex: {
                RB: true,
                WR: true,
                TE: true
            }
        };
        function addDraft() {
            vm.addSuccess = false;
            vm.addFailure = false;
            draftService.addDraft(vm.newDraft).then(
                function(answer) {
                    vm.addSuccess = true;
                    $scope.dc.refreshDrafts();
                    $scope.dc.currentDraft = answer.data.draft;
                    $scope.dc.initializeSelectedDraft();
                    vm.newDraft = {};
                },
                function(reason) {
                    vm.addFailure = true;
                    console.log('Status: '+reason);
                }
            );
        }
    }
})();