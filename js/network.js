'use strict';
window.network = (function () {
  return {
    receive: function (onLoad, onError, errBtnHandler) {
      var receiveDataUrl = 'https://js.dump.academy/keksobooking/data';
      var xhr = new XMLHttpRequest();

      function xhrReceiveHandler(event) {
        if (event.target.status === 200) {
          onLoad(event.target.responseText);
        } else {
          onError(event.target.status, errBtnHandler);
        }
      }

      function xhrErrorHandler(event) {
        onError(event.target.status, errBtnHandler);
      }

      function xhrTimeoutHandler(event) {
        onError(event.target.status, errBtnHandler);
      }

      xhr.addEventListener('load', xhrReceiveHandler);
      xhr.addEventListener('error', xhrErrorHandler);
      xhr.addEventListener('timeout', xhrTimeoutHandler);

      xhr.timeout = 2000;
      xhr.open('GET', receiveDataUrl);
      xhr.send();
    },

    send: function (data, onSuccess, onError, errBtnHandler) {
      var sendUrl = 'https://js.dump.academy/keksobooking';
      var xhr = new XMLHttpRequest();
      xhr.open('POST', sendUrl);

      function xhrSendHandler(event) {
        if (xhr.status >= 200 && xhr.status < 400) {
          onSuccess();

        } else {
          onError(event.target.status, errBtnHandler);
        }
      }

      function xhrErrorHandler(event) {
        onError(event.target.status, errBtnHandler);
      }

      xhr.addEventListener('load', xhrSendHandler);
      xhr.addEventListener('error', xhrErrorHandler);
      xhr.send(data);
    }
  };
}());
