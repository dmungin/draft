(function() {
    require('../services/currentDraftService');
    require('../services/ownerService');
    require('../services/tabService');
    require('../filters/currentRoundFilter');
    /* View Draft Controller - Used to display the selected draft's information such as owner list player list */
    angular.module('draftApp').controller('ViewDraftController', ViewDraftController);
    ViewDraftController.$inject = ['$interval', 'currentDraftService', 'ownerService', 'tabService'];

    function ViewDraftController($interval, currentDraftService, ownerService, tabService) {
        var vm = this;
        vm.OWNERS_TEXT = "Owners!";
        vm.currentDraft = currentDraftService.getCurrentWrapper();
        $interval(function() {
            if(vm.currentDraft.draft && tabService.getActiveTab() == 'teamView') {
                ownerService.getOwners(vm.currentDraft.draft.leagueName).then(
                    function(data) {
                        currentDraftService.setCurrentOwners(data.data.owners);
                    }
                );
            }
        }, 5000);
    }
})();