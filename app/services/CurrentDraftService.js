
angular.module('draftApp').factory('currentDraftService', currentDraftService);
function currentDraftService() {
    var currentDraft = {};
    function getCurrentWrapper() {
        return currentDraft;
    }
    function setCurrentDraft(draft) {
        currentDraft.draft = draft;
    }
    function setCurrentOwners(owners) {
        currentDraft.owners = owners;
        updateOnClockOwner();
    }
    function clearCurrentDraft() {
        currentDraft.draft = undefined;
        currentDraft.owners = undefined;
    }
    function updatePickedPlayers(pick, player, nameTeam) {
        //Update pick list to add picked player or reset pick number to default value when removing
        currentDraft.draft.pickList[pick] = player;
        //When removingPick pick number should be set to 0 in players list
        if(typeof player.ownerID === 'undefined') {
            pick = 0;
        }
        //Update player list to add pick number to player
        currentDraft.draft.players.every(function(p, index, arr){
            if(p.nameTeam === nameTeam) {
                p.pick = pick;
                return false;
            }
            else return true;
        });
    }
    function updateOwnerRoster(ownerUpdate, player) {
        //Update owner on client side to add player to team
        currentDraft.owners.forEach(function(owner, index, array) {
            if(owner._id === player.ownerID) {
                var position = Object.keys(ownerUpdate)[0].split('.');
                if(position.length === 2)
                    currentDraft.owners[index][position[0]][position[1]] = player;
                else
                    currentDraft.owners[index][position[0]] = player;
            }
        });
    }
    function goToNextPick() {
        var pick = currentDraft.draft.currentPick+1;
        //Go forwards in picks until non-keeper pick is found
        while(currentDraft.draft.pickList[pick].isKeeper) {
            pick++;
        }
        currentDraft.draft.currentPick = pick;
        updateOnClockOwner();
    }
    function goToPreviousPick() {
        var pick = currentDraft.draft.currentPick;
        //Go backwards in picks until non-keeper pick is found
        do {
            pick--;
        } while(currentDraft.draft.pickList[pick].isKeeper && pick !== 1);
        currentDraft.draft.currentPick = pick;
        updateOnClockOwner();
    }
    function updateOnClockOwner() {
        var onTheClockOwner,
            currentRound = parseInt(currentDraft.draft.currentPick/currentDraft.owners.length),
            currentPick	= currentDraft.draft.currentPick % currentDraft.owners.length || currentDraft.owners.length;
        if(currentDraft.draft.currentPick % currentDraft.owners.length) currentRound++;
        currentDraft.owners.every(function(owner, index, arr) {
            if((currentRound % 2 !== 0 && parseInt(owner.draftPosition) === currentPick) ||
                (currentRound % 2 === 0 && currentDraft.owners.length - parseInt(owner.draftPosition)+1 === currentPick)) {
                onTheClockOwner = owner;
                return false;
            }
            else return true;
        });
        currentDraft.draft.onTheClockTeam = onTheClockOwner;
    }
    return  {
        getCurrentWrapper: getCurrentWrapper,
        setCurrentDraft: setCurrentDraft,
        setCurrentOwners: setCurrentOwners,
        goToNextPick: goToNextPick,
        goToPreviousPick: goToPreviousPick,
        updatePickedPlayers: updatePickedPlayers,
        updateOwnerRoster: updateOwnerRoster,
        clearCurrentDraft: clearCurrentDraft
    };
}

