/**
 * gaab - dead simple ua ab testing
 *   Docs: https://github.com/tomfuertes/gaab
 *   Demo: http://run.gaab.today
 */

/*global ga:false, domready:false*/

window.gaab = function (name, dimension, experiments) {
  'use strict';

  // functions passed to ga are executed once the lib is loaded
  ga(function (tracker) {

    // First we bucket the visitor
    var clientId = tracker.get('clientId'); // https://developers.google.com/analytics/devguides/ollection/analyticsjs/domains#getClientId
    var randomBasedOnCookie = (parseFloat(clientId, 10) % 100) / 100;
    var experiment = experiments[Math.floor(randomBasedOnCookie * experiments.length)];

    // Then we set the GA Dimension
    ga('set', 'dimension' + dimension, name + ': ' + experiment.variation);

    // then we run valid tests on domready
    for (var key in experiment) {
      if (key !== 'variation' && experiment.hasOwnProperty(key))
        domready(testGenerator(key, experiment[key]));
    }

    /*jshint latedef:false*/
    // this gets hoisted
    function testGenerator(selector, txtOrFunction) {
      return function () {
        if (typeof txtOrFunction === 'function') txtOrFunction(selector);
        else if (typeof jQuery !== 'undefined') jQuery(selector).html(txtOrFunction);
        else document.querySelectorAll(selector).innerHTML = txtOrFunction;
      };
    }

  });

};
