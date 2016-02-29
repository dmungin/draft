(function() {
    require('../services/currentDraftService');
    require('../services/tabService');
    require('../services/draftService');
    /* Picks Controller - Used to display picked players as draft is happening */
    angular.module('draftApp').controller('PicksController', PicksController);
    PicksController.$inject = ['$interval', 'currentDraftService', 'tabService', 'draftService'];

    function PicksController($interval, currentDraftService, tabService, draftService) {
        var vm = this;
        vm.currentDraft = currentDraftService.getCurrentWrapper();
        $interval(function() {
            if(typeof vm.currentDraft.draft !== 'undefined' && tabService.getActiveTab() == 'livePicks') {
                draftService.getDraft(vm.currentDraft.draft._id).then(
                    function(answer) {
                        vm.currentDraft.draft = answer.data.draft;
                    }
               );
            }
        }, 5000);
    }
})();