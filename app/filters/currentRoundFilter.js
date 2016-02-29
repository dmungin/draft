angular.module('draftApp').filter('currentRound', function() {
    return function(input) {
        if(parseInt(input) == input) return input;
        else return parseInt(input)+1
    }
});