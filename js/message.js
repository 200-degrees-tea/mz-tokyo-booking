'use strict';
window.message = (function () {
  var successTemplate = document.querySelector('#success').content.querySelector('.success');
  var errorTemplate = document.querySelector('#error').content.querySelector('.error');
  var messageContainer = document.querySelector('body');
  var successMessageElement = null;

  function removeMessage() {
    if (successMessageElement) {
      successMessageElement.removeEventListener('click', successMsgHandler);
      document.removeEventListener('keydown', escButtonHandler);
      successMessageElement.parentElement.removeChild(successMessageElement);
      successMessageElement = null;
    }
  }

  function successMsgHandler(event) {
    event.target.removeEventListener('click', successMsgHandler);
    document.removeEventListener('keydown', escButtonHandler);
    removeMessage();
  }

  function escButtonHandler(event) {
    window.util.isEscEvent(event, removeMessage);
  }

  return {
    errorMessage: function (error, errBtnCallback) {
      var errorMessageElement = errorTemplate.cloneNode(true);
      var errorButtonElement = errorMessageElement.querySelector('.error__button');
      var errorText = errorMessageElement.querySelector('.error__message');

      errorText.innerText = 'Sending error: ' + error;
      errorButtonElement.addEventListener('click', errBtnCallback);
      messageContainer.appendChild(errorMessageElement);

      setTimeout(function () {
        if (errorButtonElement) {
          errorButtonElement.removeEventListener('click', errBtnCallback);
          messageContainer.removeChild(errorMessageElement);
        }
      }, 5000);
    },

    successMessage: function () {
      successMessageElement = successTemplate.cloneNode(true);
      successMessageElement.addEventListener('click', successMsgHandler);
      messageContainer.appendChild(successMessageElement);
      document.addEventListener('keydown', escButtonHandler);
    }
  };
}());
