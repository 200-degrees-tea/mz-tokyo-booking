'use strict';
(function () {
  var MIN_NUM_ROOMS = 1;
  var MAX_NUM_ROOMS = 5;
  var MIN_PRICE = 10;
  var MAX_PRICE = 100;
  var MIN_GUESTS = 1;
  var MAX_GUESTS = 10;
  var MIN_MAP_WIDTH = 0;
  var MAX_MAP_WIDTH = 1150;
  var MIN_MAP_HEIGHT = 130;
  var MAX_MAP_HEIGHT = 630;
  var ADS_AMOUNT = 8;
  var TITLES = [
    'Big cosy flat',
    'Small uncosy flat',
    'Huge beautiful palace',
    'Small horrible palace',
    'Beautiful guest house',
    'Ugly inhospitable house',
    'Cosy bungalow far from the sea',
    'Uncosy bungalow in water up to your knees'
  ];
  var PROPERTY_TYPES = ['palace', 'flat', 'house', 'bungalow'];
  var CHECKIN_TIMES = ['12:00', '13:00', '14:00'];
  var CHECKOUT_TIMES = ['12:00', '13:00', '14:00'];
  var FEATURES = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
  var PHOTOS = [
    'http://o0.github.io/assets/images/tokyo/hotel1.jpg',
    'http://o0.github.io/assets/images/tokyo/hotel2.jpg',
    'http://o0.github.io/assets/images/tokyo/hotel3.jpg'
  ];
  // var PIN_HIGHT = 62 + 22;
  // var HALF_PIN_WIDTH = 31 + 5;

  // var BUNGALO_MIN_PRICE = 0;
  // var FLAT_MIN_PRICE = 10;
  // var HOUSE_MIN_PRICE = 50;
  // var PALACE_MIN_PRICE = 100;

  var mapElement = document.querySelector('.map');
  var mapPinsElement = document.querySelector('.map__pins');
  var pinElementTemplate = document.querySelector('#pin').content.querySelector('.map__pin');
  var cardElementTemplate = document.querySelector('#card').content.querySelector('.map__card');

  var adFormContainer = document.querySelector('.ad-form');
  // var formAddressInput = adFormContainer.querySelector('#address');
  var mapPinsMainElement = mapPinsElement.querySelector('.map__pin--main');
  // var priceElement = adFormContainer.querySelector('#price');
  // var propertyTypeElement = adFormContainer.querySelector('#type');
  // var checkinElement = adFormContainer.querySelector('#timein');
  // var checkoutElement = adFormContainer.querySelector('#timeout');
  // var capacityElement = adFormContainer.querySelector('#capacity');
  // var roomsElement = adFormContainer.querySelector('#room_number');

  var dragged = false;
  var startCords = {
    x: 0,
    y: 0
  };

  function getRandomNumberInRange(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
  }

  function getSortedRandomStringsArray(arr) {
    return arr.reduce(function (result, elem) {
      if (Math.random() - 0.5 > 0) {
        result.push(elem);
      }
      return result;
    }, []);
  }

  function getRandomStringsArray(arr) {
    var arrCopy = arr.slice();
    return arrCopy.sort(function () {
      return Math.random() - 0.5;
    });
  }

  function getListingsObject(index) {
    var positionX = getRandomNumberInRange(MIN_MAP_WIDTH, MAX_MAP_WIDTH);
    var positionY = getRandomNumberInRange(MIN_MAP_HEIGHT, MAX_MAP_HEIGHT);

    return {
      author: {
        avatar: 'img/avatars/user0' + (index + 1) + '.png'
      },
      offer: {
        title: TITLES[index],
        address: '"' + positionX + ', ' + positionY + '"',
        price: getRandomNumberInRange(MIN_PRICE, MAX_PRICE),
        type: PROPERTY_TYPES[getRandomNumberInRange(0, PROPERTY_TYPES.length)],
        rooms: getRandomNumberInRange(MIN_NUM_ROOMS, MAX_NUM_ROOMS),
        guests: getRandomNumberInRange(MIN_GUESTS, MAX_GUESTS),
        checkin: CHECKIN_TIMES[getRandomNumberInRange(0, CHECKIN_TIMES.length)],
        checkout: CHECKOUT_TIMES[getRandomNumberInRange(0, CHECKOUT_TIMES.length)],
        features: getSortedRandomStringsArray(FEATURES),
        description: '',
        photos: getRandomStringsArray(PHOTOS),
      },
      location: {
        x: positionX,
        y: positionY
      }
    };
  }

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

  function generateCard(data) {
    var offer = data.offer;
    var newCardElement = cardElementTemplate.cloneNode(true);
    var imgElement = newCardElement.querySelector('.popup__photo').cloneNode(true);
    var photosElementContainer = newCardElement.querySelector('.popup__photos');
    var featuresElementContainer = newCardElement.querySelector('.popup__features');
    featuresElementContainer.innerHTML = '';
    photosElementContainer.innerHTML = '';

    newCardElement.querySelector('.popup__title').textContent = offer.title;
    newCardElement.querySelector('.popup__text--address').textContent = offer.address;
    newCardElement.querySelector('.popup__text--price').textContent = offer.price + ' £/night';
    newCardElement.querySelector('.popup__type').textContent = offer.type.charAt(0).toUpperCase() + offer.type.slice(1);
    newCardElement.querySelector('.popup__text--capacity').textContent = offer.rooms + ' rooms for ' + offer.guests;
    newCardElement.querySelector('.popup__text--time').textContent = 'Checking after ' + offer.checkin + ', checkout before ' + offer.checkout;
    newCardElement.querySelector('.popup__description').innerHTML = offer.description;
    newCardElement.querySelector('.popup__avatar').src = data.author.avatar;

    offer.features.forEach(function (feature) {
      var newLiElement = document.createElement('li');
      newLiElement.classList.add('popup__feature', 'popup__feature--' + feature);
      featuresElementContainer.appendChild(newLiElement);
    });

    offer.photos.forEach(function (elem) {
      var newImgElement = imgElement.cloneNode(true);
      newImgElement.src = elem;
      photosElementContainer.appendChild(newImgElement);
    });

    return newCardElement;
  }

  // function updateAddress() {
  //   var top = mapPinsMainElement.offsetTop + PIN_HIGHT;
  //   var left = mapPinsMainElement.offsetLeft + HALF_PIN_WIDTH;

  //   formAddressInput.value = top + ', ' + left;
  // }

  // function setFormInputsState(enable) {
  //   var fieldsetArray = adFormContainer.querySelectorAll('fieldset');
  //   fieldsetArray.forEach(function (elem) {
  //     elem.disabled = !enable;
  //   });
  // }

  // function enableFormInputs() {
  //   setFormInputsState(true);
  // }

  // function disableFormInputs() {
  //   setFormInputsState(false);
  // }

  // function checkGuestsField() {
  //   var guests = +capacityElement.value;
  //   var numberOfRooms = +roomsElement.value;

  //   if (numberOfRooms === 1 && guests !== 1) {
  //     capacityElement.setCustomValidity('Too many guests for one room');
  //   } else if (numberOfRooms === 2 && guests > 2) {
  //     capacityElement.setCustomValidity('Too many guests for two rooms');
  //   } else if (numberOfRooms === 3 && guests > 3) {
  //     capacityElement.setCustomValidity('Too many guests for three rooms');
  //   } else if (numberOfRooms === 100 && guests > 0) {
  //     capacityElement.setCustomValidity('Not for guests');
  //   } else {
  //     capacityElement.setCustomValidity('');
  //   }
  // }

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

  function showCard(button) {
    var elementIndex = +button.dataset.index;
    var listing = nearbyLisitings[elementIndex];
    var card = generateCard(listing);

    mapElement.appendChild(card);
    card.querySelector('.popup__close').addEventListener('click', closeCardHandler);
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

  function closeCardHandler(event) {
    removeCard();
    event.currentTarget.removeEventListener('click', closeCardHandler);
  }

  // function typeFieldHandler(event) {
  //   switch (event.currentTarget.value) {
  //     case ('bungalo'):
  //       priceElement.min = BUNGALO_MIN_PRICE;
  //       priceElement.placeholder = BUNGALO_MIN_PRICE;
  //       break;
  //     case ('flat'):
  //       priceElement.min = FLAT_MIN_PRICE;
  //       priceElement.placeholder = FLAT_MIN_PRICE;
  //       break;
  //     case ('house'):
  //       priceElement.min = HOUSE_MIN_PRICE;
  //       priceElement.placeholder = HOUSE_MIN_PRICE;
  //       break;
  //     case ('palace'):
  //       priceElement.min = PALACE_MIN_PRICE;
  //       priceElement.placeholder = PALACE_MIN_PRICE;
  //       break;
  //   }
  // }

  // function checkinHandler(event) {
  //   var checkinTime = event.currentTarget.value;
  //   checkoutElement.value = checkinTime;
  // }

  // function checkoutHandler(event) {
  //   var checkoutTime = event.currentTarget.value;
  //   checkinElement.value = checkoutTime;
  // }

  // function guestsHandler() {
  //   checkGuestsField();
  // }

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

  window.form.disableFormInputs();

  mapPinsMainElement.addEventListener('mousedown', mouseDownHandler);

  var nearbyLisitings = [];
  for (var i = 0; i < ADS_AMOUNT; i++) {
    var newListing = getListingsObject(i);
    nearbyLisitings.push(newListing);
  }

  mapElement.addEventListener('mouseup', pinsHandler);
  // propertyTypeElement.addEventListener('change', typeFieldHandler);
  // checkinElement.addEventListener('change', checkinHandler);
  // checkoutElement.addEventListener('change', checkoutHandler);
  // roomsElement.addEventListener('change', guestsHandler);
  // capacityElement.addEventListener('change', guestsHandler);
}());
