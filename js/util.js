'use strict';
window.util = (function () {
  var ESC_KEY = 27;

  return {
    isEscEvent: function (event, callback) {
      if (event.keyCode === ESC_KEY) {
        callback();
      }
    }
  };
}());
