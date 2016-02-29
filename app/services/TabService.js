(function() {
    'use strict'
    angular.module('draftApp').factory('tabService', tabService);
    tabService.$inject = ['$location'];
    function tabService($location) {
        var activeTab = 'home',
            tabs = {
            ownerView : 'inactive',
            teamView : 'inactive',
            ownerEdit : 'inactive',
            keeperEdit : 'inactive',
            draft : 'inactive',
            livePicks : 'inactive'
        };
        function setTabs(view) {
            tabs = {
                ownerView : 'inactive',
                teamView : 'inactive',
                ownerEdit : 'inactive',
                keeperEdit : 'inactive',
                draft : 'inactive',
                livePicks : 'inactive'
            };
            tabs[view] = 'active';
            activeTab = view;
            return tabs;
        }
        function getActiveTab() {
            return activeTab;
        }
        function resetView() {
            $location.path( "/viewdraft" );
            return setTabs('ownerView');
        }
        function clearViews() {
            $location.path( "/" );
        }
        return  {
            setTabs: setTabs,
            resetView: resetView,
            clearViews: clearViews,
            getActiveTab: getActiveTab
        };
    }
})();

