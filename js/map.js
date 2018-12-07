'use strict';
window.map = (function () {
  var mapElement = document.querySelector('.map');
  var mapPinsElement = document.querySelector('.map__pins');
  var pinElementTemplate = document.querySelector('#pin').content.querySelector('.map__pin');

  var adFormContainer = document.querySelector('.ad-form');
  var mapPinsMainElement = mapPinsElement.querySelector('.map__pin--main');
  var dragged = false;
  var startCords = {
    x: 0,
    y: 0
  };

  function generatePins() {
    var pinDocFrag = document.createDocumentFragment();
    for (var i = 0; i < nearbyLisitings.length; i++) {
      var newPinElement = pinElementTemplate.cloneNode(true);
      var newImgElement = newPinElement.querySelector('img');
      newPinElement.style.left = nearbyLisitings[i].location.x + 'px';
      newPinElement.style.top = nearbyLisitings[i].location.y + 'px';
      newPinElement.setAttribute('data-index', i);
      newImgElement.src = nearbyLisitings[i].author.avatar;
      newImgElement.alt = nearbyLisitings[i].offer.title;
      pinDocFrag.appendChild(newPinElement);
    }

    return pinDocFrag;
  }

  function mouseUpHandler(event) {
    event.preventDefault();
    var generatedPinElements = generatePins();

    window.form.updateAddress();
    mapPinsElement.appendChild(generatedPinElements);
    window.form.checkGuestsField();

    document.removeEventListener('mouseup', mouseUpHandler);
    document.removeEventListener('mousemove', mouseMoveHandler);

    if (dragged) {
      mapPinsMainElement.addEventListener('click', clickPreventDefaultHandler);
    }
  }

  function pinsHandler(event) {
    var target = event.target;

    while (target !== mapElement) {
      if (target.tagName === 'BUTTON' && target.hasAttribute('data-index')) {
        window.card.removeCard();
        window.card.showCard(target);
        return;
      }
      target = target.parentNode;
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

  var nearbyLisitings = [];
  for (var i = 0; i < window.data.ADS_AMOUNT; i++) {
    var newListing = window.data.getListingsObject(i);
    nearbyLisitings.push(newListing);
  }

  mapElement.addEventListener('mouseup', pinsHandler);

  return {
    nearbyLisitings: nearbyLisitings
  };
}());
