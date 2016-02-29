(function() {
    require('../services/tabService');
    require('../services/constantsService');
    /* Keepers Controller - If keepers are used, they can be added or updated here.  */
    angular.module('draftApp').controller('KeepersController', KeepersController);
    KeepersController.$inject = ['$scope', '$http', 'tabService', 'constantsService'];

    function KeepersController($scope, $http, tabService, constantsService) {
        var vm = this;
        tabService.setTabs('keeperEdit');
        vm.ROSTER_SPOTS = constantsService.getRosterSpots();
        vm.newKeepers = [];
        //Functions
        vm.addKeeper = addKeeper;
        vm.saveKeeper = saveKeeper;
        vm.removeKeeper = removeKeeper;
        vm.removeNewKeeper = removeNewKeeper;

        function addKeeper(player) {
            player.ownerID = vm.currentOwner._id;
            player.leagueID = $scope.dc.currentDraft._id;
            player.isKeeper = true;
            vm.newKeepers.push(player);
            vm.playerFilter = "";
        }
        function saveKeeper(keeper) {
            var saveKeeper = $http.post('/savePick', {newPick: keeper});
            saveKeeper.success(function(data, status, headers, config) {
                vm.newKeepers.splice(vm.newKeepers.indexOf(keeper), 1);
                $scope.dc.currentDraft.pickList[keeper.pick] = data.pick;
                //Update owners on client side to add new player to their team
                $scope.dc.owners.forEach(function(owner, index, array) {
                    if(owner._id === vm.currentOwner._id) {
                        var position = Object.keys(data.ownerUpdate)[0].split('.');
                        if(position.length === 2)
                            $scope.dc.owners[index][position[0]][position[1]] = data.pick;
                        else
                            $scope.dc.owners[index][position[0]] = data.pick;
                    }
                });
                //Update player list to add pick number to this player
                $scope.dc.currentDraft.players.every(function(p, index, arr){
                    if(p.nameTeam === keeper.nameTeam) {
                        p.pick = keeper.pick;
                        return false;
                    }
                    else return true;
                });
                //Save draft changes to pickList.
                var updateDraft = $http.post('/updateDraft', {draftID: $scope.dc.currentDraft._id, updatedPick: $scope.dc.currentDraft.pickList[keeper.pick], currentPick: $scope.dc.currentDraft.currentPick});
                updateDraft.success(function(data, status, headers, config) {
                    console.log('Draft Updated - Keeper Added');
                });
                updateDraft.error(function(data, status, headers, config) {
                    console.log('Status: '+status);
                });
            });
            saveKeeper.error(function(data, status, headers, config) {
                console.log('Status: '+status);
            });
        }
        function removeKeeper(keeper) {
            var removeKeeper = $http.post('/removePick', {oldPick: keeper});
            removeKeeper.success(function(data, status, headers, config) {
                $scope.dc.currentDraft.pickList[keeper.pick] = {"pick": keeper.pick};
                //Update owners on client side to remove player from team
                $scope.dc.owners.forEach(function(owner, index, array) {
                    if(owner._id === vm.currentOwner._id) {
                        var position = Object.keys(data.ownerUpdate)[0].split('.');
                        if(position.length === 2)
                            $scope.dc.owners[index][position[0]][position[1]] = {};
                        else
                            $scope.dc.owners[index][position[0]] = {};
                    }
                });
                //Update player list reset keepers pick to 0
                $scope.dc.currentDraft.players.every(function(p, index, arr){
                    if(p.nameTeam === keeper.nameTeam) {
                        p.pick = 0;
                        return false;
                    }
                    else return true;
                });
                //Save draft changes to pickList.
                var updateDraft = $http.post('/updateDraft', {draftID: $scope.dc.currentDraft._id, updatedPick: $scope.dc.currentDraft.pickList[keeper.pick], currentPick: $scope.dc.currentDraft.currentPick});
                updateDraft.success(function(data, status, headers, config) {
                    console.log('Draft Updated - Keeper Removed');
                });
                updateDraft.error(function(data, status, headers, config) {
                    console.log('Status: '+status);
                });

            });
            removeKeeper.error(function(data, status, headers, config) {
                console.log('Status: '+status);
            });
        }
        function removeNewKeeper(keeper) {
            vm.newKeepers.splice(vm.newKeepers.indexOf(keeper), 1);
        };
    }
})();