(function() {
    'use strict'
    angular.module('draftApp').factory('scrollService', scrollService);
    scrollService.$inject = ['$anchorScroll', '$location'];

    function scrollService($anchorScroll, $location) {
        function goToTop() {
            $location.hash('top');
            $anchorScroll();
            $location.hash('');
        }
        return  {
            goToTop: goToTop
        };
    }
})();

