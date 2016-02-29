(function() {
    require('../services/tabService');
    require('../services/currentDraftService');
    require('../services/ownerService');
    require('../services/scrollService');
    /* Edit Owner Controller - After a new draft is added this controller can be used to update owner and team names  */
    angular.module('draftApp').controller('EditOwnersController', EditOwnersController);
    EditOwnersController.$inject = ['currentDraftService', 'scrollService', 'tabService', 'ownerService', '$timeout'];

    function EditOwnersController(currentDraftService, scrollService, tabService, ownerService, $timeout) {
        var vm = this;
        tabService.setTabs('ownerEdit');
        vm.currentDraft = currentDraftService.getCurrentWrapper();
        //Functions
        vm.saveOwners = saveOwners;
        vm.importOwners = importOwners;
        vm.revertOwners = revertOwners;
        resetMessages();
        function saveOwners() {
            resetMessages();
            scrollService.goToTop();
            ownerService.saveOwners(vm.currentDraft.owners).then(
                function() {
                    toastMessage('update');
                },
                function(data, status) {
                    toastMessage('fail');
                    console.log('Status: '+status);
                }
            );
        }
        function importOwners() {
            resetMessages();
            ownerService.getOwners(vm.otherDraft.leagueName).then(
                function(data) {
                    data.data.owners.forEach(function(owner, index) {
                        if(index < vm.currentDraft.owners.length ) {
                            vm.currentDraft.owners[index].ownerName = owner.ownerName;
                            vm.currentDraft.owners[index].nickname = owner.nickname;
                        }
                    });
                    toastMessage('import');
                },
                function() {
                    toastMessage('fail');
                }
            );
        }
        function toastMessage(message) {
            switch(message) {
                case 'update':
                    vm.updateSuccess = true;
                    break;
                case 'revert':
                    vm.revertSuccess = true;
                    break;
                case 'import':
                    vm.importSuccess = true;
                    break;
                case 'fail':
                    vm.updateFailure = true;
            }
            $timeout(function() {
               resetMessages();
            }, 5000);
        }
        function revertOwners() {
            resetMessages();
            scrollService.goToTop();
            ownerService.getOwners(vm.currentDraft.draft.leagueName).then(
                function(data) {
                    vm.currentDraft.owners = data.data.owners;
                    toastMessage('revert');
                },
                function(data, status) {
                    toastMessage('fail');
                    console.log('Status: '+status);
                }
            );
        }
        function resetMessages() {
            vm.revertSuccess = false;
            vm.updateSuccess = false;
            vm.importSuccess = false;
            vm.updateFailure = false;
        }
    }
})();