/* Live Controller - Used for live drafting. Displays a list of players, updates owner teams after each pick and keeps track of the current pick */
(function() {
    require('../services/tabService');
    require('../services/constantsService');
    require('../services/pickService');
    require('../services/currentDraftService');
    require('../filters/currentRoundFilter');
    angular.module('draftApp').controller('LiveController', LiveController);
    LiveController.$inject = ['constantsService', 'tabService', 'pickService', 'currentDraftService'];

    function LiveController(constantsService, tabService, pickService, currentDraftService) {
        var vm = this;

        tabService.setTabs('draft');
        vm.currentDraft = currentDraftService.getCurrentWrapper();
        vm.toggleAll = true;
        vm.qbShow = true;
        vm.rbShow = true;
        vm.wrShow = true;
        vm.teShow = true;
        vm.flexShow = true;
        vm.defShow = true;
        vm.kShow = true;
        vm.showPicked = true;
        vm.pickTimer = 0;
        vm.manualPlayer = new Player();
        vm.TEAM_LIST = constantsService.getTeams();
        //Functions
        vm.startTimer = startTimer;
        vm.stopTimer = stopTimer;
        vm.addManualPick = addManualPick;
        vm.pickPlayer = pickPlayer;
        vm.removePick = removePick;
        vm.getPickEligibility = getPickEligibility;

        function startTimer() {
            vm.$broadcast('timer-start');
            vm.timerRunning = true;
        }
        function stopTimer(){
            vm.$broadcast('timer-stop');
            vm.timerRunning = false;
        }
        function addManualPick() {
            if(!vm.manualEntry) {
                vm.manualPlayer = new Player();
                vm.manualEntry = true;
            }
            else {
                vm.manualEntry = false;
            }
        }

        function pickPlayer(player) {
            vm.manualEntry = false;
            pickService.pickPlayer(player);
            vm.stopTimer();
            vm.startTimer();
        }
        function removePick() {
            pickService.removeLastPick();
            vm.stopTimer();
            vm.startTimer();
        }
        function getPickEligibility(player) {
            return pickService.getPickEligibility(player);
        }
        /* Player Class for adding players picked that are not in the top 200 */
        function Player() {
            return {
                rank: "",
                name: "",
                team: "",
                nameTeam: "",
                bye: "",
                position: "",
                positionRank: "",
                ADP: "",
                vsADP: "",
                depth: "",
                points: "",
                pick: 0
            }
        }
    }
})();