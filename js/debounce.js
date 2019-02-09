'use strict';
(function () {
  var DEBOUNCE_INTERVAL = 500;

  window.debounce = function (fun, time) {
    var lastTimeout = null;

    return function () {
      var args = arguments;

      if (lastTimeout) {
        window.clearTimeout(lastTimeout);
      }

      lastTimeout = window.setTimeout(function () {
        fun.apply(null, args);
      }, time || DEBOUNCE_INTERVAL);

    };
  };
}());
