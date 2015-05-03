'use strict';

angular.module('oriApp')
  .controller('WelcomeCtrl', function ($scope, $state) {

        // Animation of page init
        var tl = new TimelineMax();
        tl
            .set('#ori-logo', {opacity: 0})
            .to('#ori-logo', 2, {opacity:1})
            .to('#ori-logo', 0.5, {height:'170px', top:'120px'}, 2)
            .call(function() {
                $state.go('menu');
            });

  });
