(function() {
    'use strict';
    angular.module('draftApp').factory('playerService', playerService);
    playerService.$inject = ['$http', '$q'];

    function playerService($http, $q) {
        var deferObject;
        /* Gets players from server if they haven't been updated in the last day, or have never been retrieved.
        * If they are up to date then the pick numbers are synced to the existing list with no server call */
        function getPlayers(currentDraft) {
            var playerPromise;
            //If players have not been updated in the last day then get the players list from the server
            if(typeof currentDraft.playerUpdateTime !== "undefined") {
                var testDate = new Date(currentDraft.playerUpdateTime);
                testDate.setDate(testDate.getDate()+1);
                if(testDate < new Date()) {
                    playerPromise = getPlayersFromServer(currentDraft._id);
                } else {
                    //Create promise from existing player list and update time to be consistent
                    playerPromise = $q.when({data :{players : currentDraft.players, playerUpdateTime: currentDraft.playerUpdateTime}});
                }
            } else {
                playerPromise = getPlayersFromServer(currentDraft._id);
            }
            deferObject = deferObject || $q.defer();
            playerPromise.then(
                function(answer) {
                    answer.players = syncPicked(answer.data.players, currentDraft.pickList);
                    answer.playerUpdateTime = answer.data.playerUpdateTime;
                    deferObject.resolve(answer);
                },
                function(reason) {
                    deferObject.reject(reason);
                }
            );
            return deferObject.promise;
        }
        function getPlayersFromServer(currentDraftID) {
            return $http.get('/getPlayers', {params: {currentDraftID: currentDraftID}});
        }
        /* When the player list is updated, check whether each player has been picked.
         * If they have, set the player's pick number */
        function syncPicked(newPlayers, pickList) {
            newPlayers.forEach(function(player, pl_index, pl_arr) {
                pickList.forEach(function(picked, pi_index, pi_arr) {
                    if(picked && player.nameTeam === picked.nameTeam) {
                        player.pick = picked.pick;
                    }
                    else {
                        return true;
                    }
                });
            });
            return newPlayers;
        }
        return  {
            getPlayers: getPlayers
        };
    }
})();

