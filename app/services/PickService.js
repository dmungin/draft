(function() {
    'use strict'
    require('../services/currentDraftService');
    angular.module('draftApp').factory('pickService', pickService);
    pickService.$inject = ['currentDraftService'];
    function pickService(currentDraftService) {
        var currentDraft = currentDraftService.getCurrentWrapper();
        function pickPlayer(player) {
            player.ownerID = currentDraft.onTheClockTeam._id;
            player.leagueID = currentDraft._id;
            player.isKeeper = false;
            player.pick = currentDraft.currentPick;
            player.spot = getPickSpot(player);
            var saveData = {
                newPick: player
            };
            var pickPlayer = $http.post('/savePick', saveData);
            pickPlayer.success(function(data, status, headers, config) {
                currentDraftService.updatePickedPlayers(player.pick, data.pick);
                currentDraftService.updateOwnerRoster(data.ownerUpdate, data.pick, player.nameTeam);
                currentDraftService.goToNextPick();
                //Update draft changes to pickList and currentPick
                var updateData = {
                    draftID: currentDraft._id,
                    updatedPick: currentDraft.pickList[player.pick],
                    currentPick: currentDraft.currentPick
                };
                var updateDraft = $http.post('/updateDraft', updateData);
                updateDraft.success(function(data, status, headers, config) {

                });
                updateDraft.error(function(data, status, headers, config) {
                    console.log('Status: '+status);
                });
            });
            pickPlayer.error(function(data, status, headers, config) {
                console.log('Status: '+status);
            });
        }
        function removeLastPick() {
            currentDraftService.goToPreviousPick();
            var player = currentDraft.pickList[currentDraft.currentPick];
            var updateData = {
                draftID: currentDraft._id,
                currentPick: currentDraft.currentPick
            };
            if(!player.isKeeper && player.nameTeam) {
                var removePick = $http.post('/removePick', {oldPick: player});
                removePick.success(function(data, status, headers, config) {
                    currentDraftService.updatePickedPlayers(player.pick, {"pick": player.pick});
                    currentDraftService.updateOwnerRoster(data.ownerUpdate, {}, player.nameTeam);
                    //Save draft changes to pickList
                    var updateDraft = $http.post('/updateDraft', updateData);
                    updateDraft.success(function(data, status, headers, config) {

                    });
                    updateDraft.error(function(data, status, headers, config) {
                        console.log('Status: '+status);
                    });
                });
                removePick.error(function(data, status, headers, config) {
                    console.log('Status: '+status);
                });
            } else {
                var updateDraft = $http.post('/updateDraft', updateData);
                updateDraft.success(function(data, status, headers, config) {

                });
                updateDraft.error(function(data, status, headers, config) {
                    console.log('Status: '+status);
                });
            }
        }
        function getPickSpot(player) {
            var spot = '';
            if(player.position === 'RB' || player.position === 'WR') {
                if(!currentDraft.onTheClockTeam[player.position][0].nameTeam) spot = player.position+"1";
                else if(!currentDraft.onTheClockTeam[player.position][1].nameTeam) spot = player.position+"2";
                else if(!currentDraft.onTheClockTeam['FLEX'].nameTeam) spot = 'FLEX';
            }else {
                if(!currentDraft.onTheClockTeam[player.position].nameTeam) spot = player.position;
            }
            if(spot === '') {
                currentDraft.onTheClockTeam.BE.every(function(be, index, arr){
                    if(!be.nameTeam) {
                        spot = 'BE'+(index+1);
                        return false;
                    }
                    else return true;
                });

            }
            return spot;
        }
        function getPickEligibility(player) {
            var returnClass = "pick_eligible",
                benchFull = true;
            currentDraft.onTheClockTeam.BE.forEach(function(value) {
                if(!value.nameTeam) {
                    benchFull = false;
                }
            });
            if(benchFull) {
                if(player.position === 'WR' || player.position === 'RB') {
                    if(currentDraft.onTheClockTeam[player.position][0].nameTeam &&
                        currentDraft.onTheClockTeam[player.position][1].nameTeam) {
                        returnClass = "pick_ineligible";
                    }
                }
                //TODO:: FIX THIS TE NEED TO BE TESTED SEPARATELY?
                else if((player.position === 'WR' || player.position === 'RB' || player.position === 'TE') &&
                    currentDraft.onTheClockTeam['FLEX'].nameTeam) {
                    returnClass = "pick_ineligible";
                }
                else if(currentDraft.onTheClockTeam[player.position].nameTeam) {
                    returnClass = "pick_ineligible";
                }
            }
            return returnClass;
        }
        return  {
            pickPlayer: pickPlayer,
            removeLastPick: removeLastPick,
            getPickEligibility: getPickEligibility
        };
    }
})();

