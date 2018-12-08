'use strict';
window.map = (function () {
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
    var generatedPinElements = window.pin.generatePins();

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

    if (newXPosition < window.data.MIN_MAP_WIDTH) {
      mapPinsMainElement.style.left = window.data.MIN_MAP_WIDTH + 'px';
    } else if (newXPosition > window.data.MAX_MAP_WIDTH) {
      mapPinsMainElement.style.left = window.data.MAX_MAP_WIDTH + 'px';
    } else {
      mapPinsMainElement.style.left = newXPosition + 'px';
    }

    if (newYPosition < window.data.MIN_MAP_HEIGHT) {
      mapPinsMainElement.style.top = window.data.MIN_MAP_HEIGHT + 'px';
    } else if (newYPosition > window.data.MAX_MAP_HEIGHT) {
      mapPinsMainElement.style.top = window.data.MAX_MAP_HEIGHT + 'px';
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

  mapPinsMainElement.addEventListener('mousedown', mouseDownHandler);
  mapElement.addEventListener('mouseup', window.pin.pinsHandler);

  return {
    mapElement: mapElement,
  };
}());
