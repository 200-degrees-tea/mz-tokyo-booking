'use strict';
window.form = (function () {
  var PIN_HIGHT = 62 + 22;
  var HALF_PIN_WIDTH = 31 + 5;

  var BUNGALO_MIN_PRICE = 0;
  var FLAT_MIN_PRICE = 10;
  var HOUSE_MIN_PRICE = 50;
  var PALACE_MIN_PRICE = 100;

  var mapPinsMainElement = document.querySelector('.map__pin--main');
  var adFormContainer = document.querySelector('.ad-form');

  var formAddressInput = adFormContainer.querySelector('#address');
  var priceElement = adFormContainer.querySelector('#price');
  var propertyTypeElement = adFormContainer.querySelector('#type');
  var checkinElement = adFormContainer.querySelector('#timein');
  var checkoutElement = adFormContainer.querySelector('#timeout');
  var capacityElement = adFormContainer.querySelector('#capacity');
  var roomsElement = adFormContainer.querySelector('#room_number');

  function setFormInputsState(enable) {
    var fieldsetArray = adFormContainer.querySelectorAll('fieldset');
    fieldsetArray.forEach(function (elem) {
      elem.disabled = !enable;
    });
  }

  function typeFieldHandler(event) {
    switch (event.currentTarget.value) {
      case ('bungalo'):
        priceElement.min = BUNGALO_MIN_PRICE;
        priceElement.placeholder = BUNGALO_MIN_PRICE;
        break;
      case ('flat'):
        priceElement.min = FLAT_MIN_PRICE;
        priceElement.placeholder = FLAT_MIN_PRICE;
        break;
      case ('house'):
        priceElement.min = HOUSE_MIN_PRICE;
        priceElement.placeholder = HOUSE_MIN_PRICE;
        break;
      case ('palace'):
        priceElement.min = PALACE_MIN_PRICE;
        priceElement.placeholder = PALACE_MIN_PRICE;
        break;
    }
  }

  function checkinHandler(event) {
    var checkinTime = event.currentTarget.value;
    checkoutElement.value = checkinTime;
  }

  function checkoutHandler(event) {
    var checkoutTime = event.currentTarget.value;
    checkinElement.value = checkoutTime;
  }

  function guestsHandler() {
    window.form.checkGuestsField();
  }

  function disableFormInputs() {
    setFormInputsState(false);
  }

  propertyTypeElement.addEventListener('change', typeFieldHandler);
  checkinElement.addEventListener('change', checkinHandler);
  checkoutElement.addEventListener('change', checkoutHandler);
  roomsElement.addEventListener('change', guestsHandler);
  capacityElement.addEventListener('change', guestsHandler);

  disableFormInputs();

  return {
    updateAddress: function () {
      var top = mapPinsMainElement.offsetTop + PIN_HIGHT;
      var left = mapPinsMainElement.offsetLeft + HALF_PIN_WIDTH;
      formAddressInput.value = top + ', ' + left;
    },

    enableFormInputs: function () {
      setFormInputsState(true);
    },

    checkGuestsField: function () {
      var guests = +capacityElement.value;
      var numberOfRooms = +roomsElement.value;

      if (numberOfRooms === 1 && guests !== 1) {
        capacityElement.setCustomValidity('Too many guests for one room');
      } else if (numberOfRooms === 2 && guests > 2) {
        capacityElement.setCustomValidity('Too many guests for two rooms');
      } else if (numberOfRooms === 3 && guests > 3) {
        capacityElement.setCustomValidity('Too many guests for three rooms');
      } else if (numberOfRooms === 100 && guests > 0) {
        capacityElement.setCustomValidity('Not for guests');
      } else {
        capacityElement.setCustomValidity('');
      }
    }
  };
}());
