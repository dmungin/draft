(function() {
    'use strict';
    require('../services/tabService');
    require('../services/draftService');
    require('../services/currentDraftService');
    require('../services/ownerService');
    require('../services/playerService');
    /* Wrapper controller - used to get a list of drafts, and set the current draft to be used on all views */
    angular.module('draftApp').controller('DraftController', DraftController);
    DraftController.$inject = ['currentDraftService' , 'tabService', 'draftService', 'ownerService', 'playerService'];

    function DraftController(currentDraftService, tabService, draftService, ownerService, playerService) {
        var vm = this;
        //If user directly loads url without having selected a draft, go to main page
        if(typeof vm.currentDraft === "undefined" || typeof vm.currentDraft.draft === "undefined") {
            tabService.clearViews();
        }
        vm.currentDraft = currentDraftService.getCurrentWrapper();
        //Functions
        vm.refreshDrafts = refreshDrafts;
        vm.setTabs = setTabs;
        vm.initializeSelectedDraft = initializeSelectedDraft;
        vm.refreshDrafts();
        function refreshDrafts() {
            draftService.getDrafts().then(
                function(answer) {
                    vm.drafts = answer.data.drafts;
                }
            );
        }
        function setTabs(view) {
            vm.tabs = tabService.setTabs(view);
        }
        /* After user selects the a draft, retrieve the owners in that draft, set whose pick it is,
        * refresh the view and update the player list if necessary */
        function initializeSelectedDraft(selectedDraft) {
            currentDraftService.setCurrentDraft(selectedDraft);
            ownerService.getOwners(selectedDraft.leagueName).then(
                function(answer) {
                    currentDraftService.setCurrentOwners(answer.data.owners);
                    vm.tabs = tabService.resetView();
                }
            );
            playerService.getPlayers(selectedDraft).then(
                function(playerData) {
                    vm.currentDraft.draft.players = playerData.players;
                    vm.currentDraft.draft.playerUpdateTime = playerData.playerUpdateTime;
                }
            );
        }
    }
})();