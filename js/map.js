'use strict';
window.map = (function () {
  var MIN_MAP_WIDTH = 0;
  var MAX_MAP_WIDTH = 1150;
  var MIN_MAP_HEIGHT = 130;
  var MAX_MAP_HEIGHT = 630;
  var mapElement = document.querySelector('.map');
  var mapPinsElement = document.querySelector('.map__pins');
  var adFormContainer = document.querySelector('.ad-form');
  var mapPinsMainElement = mapPinsElement.querySelector('.map__pin--main');
  var dragged = false;
  var startCords = {
    x: 0,
    y: 0
  };

  function mouseUpHandler(event) {
    event.preventDefault();
    var generatedPinElements = document.createDocumentFragment();

    for (var i = 0; i < window.data.nearbyLisitings.length; i++) {
      var pinData = window.data.nearbyLisitings[i];
      var newPin = window.pin.generatePin(pinData, i);
      generatedPinElements.appendChild(newPin);
    }

    window.form.updateAddress();
    mapPinsElement.appendChild(generatedPinElements);
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

    mapElement.classList.remove('map--faded');
    adFormContainer.classList.remove('ad-form--disabled');
    window.form.enableFormInputs();
  }

  function clickPreventDefaultHandler(event) {
    event.preventDefault();
    mapPinsMainElement.removeEventListener('click', clickPreventDefaultHandler);
  }

  function closeCardHandler(event) {
    removeCard();
    event.currentTarget.removeEventListener('click', closeCardHandler);
  }

  function escPressCloseCardHandler(event) {
    if (event.keyCode === 27) {
      document.querySelector('.popup__close').removeEventListener('click', closeCardHandler);
      removeCard();
    }
  }

  function showCard(button) {
    var elementIndex = +button.dataset.index;
    var listing = window.data.nearbyLisitings[elementIndex];
    var card = window.card.generateCard(listing);

    mapElement.appendChild(card);
    card.querySelector('.popup__close').addEventListener('click', closeCardHandler);
    document.addEventListener('keydown', escPressCloseCardHandler);
    button.classList.add('map__pin--active');
  }

  function removeCard() {
    var cardElement = mapElement.querySelector('.map__card');
    if (cardElement) {
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

  mapPinsMainElement.addEventListener('mousedown', mouseDownHandler);
  mapElement.addEventListener('mouseup', pinsHandler);
}());
