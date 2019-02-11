'use strict';
window.map = (function () {
  var MIN_MAP_WIDTH = 0;
  var MAX_MAP_WIDTH = 1150;
  var MIN_MAP_HEIGHT = 130;
  var MAX_MAP_HEIGHT = 630;
  var MAP_PIN_TOP = 375;
  var MAP_PIN_LEFT = 570;
  var MAX_PIN_ON_THE_MAP = 4;
  var mapElement = document.querySelector('.map');
  var mapPinsElement = document.querySelector('.map__pins');
  var adFormContainer = document.querySelector('.ad-form');
  var mapPinsMainElement = mapPinsElement.querySelector('.map__pin--main');
  var dragged = false;
  var startCords = {
    x: 0,
    y: 0
  };
  var isPageActive = false;
  var data = [];
  var filteredData = [];

  function translateData(receivedData) {
    receivedData[0].offer.title = 'Cozy nest for newlyweds';
    receivedData[0].offer.description = 'Gorgeous townhouse in downtown Tokyo. Suitable for both tourists and businessmen. The house is fully equipped and has a fresh renovation.';
    receivedData[1].offer.title = 'Small apartment near the park';
    receivedData[1].offer.description = 'Small clean apartment on the edge of the park. Without the Internet and registration.';
    receivedData[2].offer.title = 'A bench in the park';
    receivedData[2].offer.description = 'Great bench in the middle of the park. Suitable for people who like to sleep in the fresh air.';
    receivedData[3].offer.title = 'Imperial Palace in downtown Tokyo';
    receivedData[3].offer.description = 'Wonderful palace in the old city center. Only for those who can afford the palace.';
    receivedData[4].offer.title = 'Sweetest attic';
    receivedData[4].offer.description = 'Small apartment in the attic. For the most demanding.';
    receivedData[5].offer.title = 'Coffee lovers hangout';
    receivedData[5].offer.description = 'We have all! Coffee, internet and more coffee';
    receivedData[6].offer.title = 'Clear hut';
    receivedData[6].offer.description = 'We have all nishtyak here. Stall around the corner. shops open for 24 hours. Come on! Internet connection not provided!';
    receivedData[7].offer.title = 'Apartment in the center';
    receivedData[7].offer.description = 'It is beautiful, light and cozy. It can accommodate 5 people. Coffee and cookies provided for free.';
    receivedData[8].offer.title = 'Quiet apartment near the subway';
    receivedData[8].offer.description = 'Apartment on the first floor. Neighbors are quiet. For anyone who can not stand the hustle and bustle.';
    receivedData[9].offer.title = 'Cute nest for Anime fans';
    receivedData[9].offer.description = 'Enjoy your time nad please do not disturb others.';
    return receivedData;
  }

  function reciveErrBtnHandler(event) {
    window.network.receive(receiveDataHandler, window.message.errorMessage, reciveErrBtnHandler);
    var errorElement = document.querySelector('.error');
    event.target.removeEventListener('click', reciveErrBtnHandler);
    document.querySelector('body').removeChild(errorElement);
  }

  function renderPins(receivedData) {
    var generatedPinElements = document.createDocumentFragment();

    receivedData.forEach(function (pinData, index) {
      if (index > MAX_PIN_ON_THE_MAP) {
        return;
      }
      var newPin = window.pin.generatePin(pinData, index);
      generatedPinElements.appendChild(newPin);
    });

    mapPinsElement.appendChild(generatedPinElements);
  }

  function receiveDataHandler(responseData) {
    var jsonData = JSON.parse(responseData);
    data = translateData(jsonData);
    renderPins(data);
  }

  function applyFilter() {
    filteredData = window.filter.filterAds(data);
    removeCard();
    removePins();
    renderPins(filteredData);
  }

  function mouseUpHandler(event) {
    event.preventDefault();

    window.form.updateAddress();
    window.form.checkGuestsField();

    document.removeEventListener('mouseup', mouseUpHandler);
    document.removeEventListener('mousemove', mouseMoveHandler);

    if (dragged) {
      mapPinsMainElement.addEventListener('click', clickPreventDefaultHandler);
    }
  }

  function mouseMoveHandler(event) {
    event.preventDefault();
    dragged = true;
    var shift = {
      x: startCords.x - event.clientX,
      y: startCords.y - event.clientY
    };
    var newXPosition = mapPinsMainElement.offsetLeft - shift.x;
    var newYPosition = mapPinsMainElement.offsetTop - shift.y;

    startCords = {
      x: event.clientX,
      y: event.clientY
    };

    if (newXPosition < MIN_MAP_WIDTH) {
      mapPinsMainElement.style.left = MIN_MAP_WIDTH + 'px';
    } else if (newXPosition > MAX_MAP_WIDTH) {
      mapPinsMainElement.style.left = MAX_MAP_WIDTH + 'px';
    } else {
      mapPinsMainElement.style.left = newXPosition + 'px';
    }

    if (newYPosition < MIN_MAP_HEIGHT) {
      mapPinsMainElement.style.top = MIN_MAP_HEIGHT + 'px';
    } else if (newYPosition > MAX_MAP_HEIGHT) {
      mapPinsMainElement.style.top = MAX_MAP_HEIGHT + 'px';
    } else {
      mapPinsMainElement.style.top = newYPosition + 'px';
    }

    window.form.updateAddress();
  }

  function mouseDownHandler(event) {
    event.preventDefault();

    startCords = {
      x: event.clientX,
      y: event.clientY
    };

    document.addEventListener('mousemove', mouseMoveHandler);
    document.addEventListener('mouseup', mouseUpHandler);

    if (!isPageActive) {
      isPageActive = true;
      window.network.receive(receiveDataHandler, window.message.errorMessage, reciveErrBtnHandler);
      mapElement.classList.remove('map--faded');
      adFormContainer.classList.remove('ad-form--disabled');
      window.form.enableFormInputs();
    }
  }

  function clickPreventDefaultHandler(event) {
    event.preventDefault();
    mapPinsMainElement.removeEventListener('click', clickPreventDefaultHandler);
  }

  function escPressCloseCardHandler(event) {
    window.util.isEscEvent(event, removeCard);
  }

  function closeCardHandler(event) {
    removeCard();
    event.currentTarget.removeEventListener('click', closeCardHandler);
    document.removeEventListener('keydown', escPressCloseCardHandler);
  }

  function showCard(button) {
    var elementIndex = +button.dataset.index;
    var listing = filteredData[elementIndex] || data[elementIndex];
    var card = window.card.generateCard(listing);

    mapElement.appendChild(card);
    card.querySelector('.popup__close').addEventListener('click', closeCardHandler);
    document.addEventListener('keydown', escPressCloseCardHandler);
    button.classList.add('map__pin--active');
  }

  function removeCard() {
    var cardElement = mapElement.querySelector('.map__card');
    if (cardElement) {
      document.querySelector('.popup__close').removeEventListener('click', closeCardHandler);
      document.removeEventListener('keydown', escPressCloseCardHandler);
      cardElement.parentNode.removeChild(cardElement);
      mapElement.querySelector('.map__pin--active').classList.remove('map__pin--active');
    }
  }

  function pinsHandler(event) {
    var target = event.target;

    while (target !== mapElement) {
      if (target.tagName === 'BUTTON' && target.hasAttribute('data-index')) {
        removeCard();
        showCard(target);
        return;
      }
      target = target.parentNode;
    }
  }

  function removePins() {
    var mapPins = document.querySelectorAll('.map__pin:not(.map__pin--main)');
    if (mapPins.length > 0) {
      Array.prototype.forEach.call(mapPins, function (elem) {
        elem.parentElement.removeChild(elem);
      });
    }
  }

  function resetMap() {
    dragged = false;
    startCords = {
      x: 0,
      y: 0
    };
    isPageActive = false;

    mapPinsMainElement.style.top = MAP_PIN_TOP + 'px';
    mapPinsMainElement.style.left = MAP_PIN_LEFT + 'px';
    mapElement.classList.add('map--faded');
    adFormContainer.classList.add('ad-form--disabled');

    window.filter.resetFilters();
    removeCard();
    removePins();
  }

  mapPinsMainElement.style.left = MAP_PIN_LEFT + 'px';
  mapPinsMainElement.style.top = MAP_PIN_TOP + 'px';
  mapPinsMainElement.addEventListener('mousedown', mouseDownHandler);
  mapElement.addEventListener('mouseup', pinsHandler);

  return {
    resetMap: resetMap,
    applyFilter: applyFilter
  };
}());
