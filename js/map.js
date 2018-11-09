'use strict';
(function () {
  var MIN_NUM_ROOMS = 1;
  var MAX_NUM_ROOMS = 5;
  var MIN_PRICE = 10;
  var MAX_PRICE = 100;
  var MIN_GUESTS = 1;
  var MAX_GUESTS = 10;
  var MIN_MAP_WIDTH = 50;
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
  var PIN_HIGHT = 62 + 22;
  var HALF_PIN_WIDTH = 31 + 5;

  var mapElement = document.querySelector('.map');
  var mapPinsElement = document.querySelector('.map__pins');
  var pinElementTemplate = document.querySelector('#pin').content.querySelector('.map__pin');
  var cardElementTemplate = document.querySelector('#card').content.querySelector('.map__card');

  var adFormContainer = document.querySelector('.ad-form');
  var formAddressInput = adFormContainer.querySelector('#address');
  var mapPinsMainElement = mapPinsElement.querySelector('.map__pin--main');

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

  function updateAddress(position) {
    formAddressInput.value = position.top + ', ' + position.left;
  }

  function getPinLocation(element) {
    return {
      top: element.offsetTop + PIN_HIGHT,
      left: element.offsetLeft + HALF_PIN_WIDTH
    };
  }

  function setFormInputsState(enable) {
    var fieldsetArray = adFormContainer.querySelectorAll('fieldset');
    fieldsetArray.forEach(function (elem) {
      elem.disabled = !enable;
    });
  }

  function enableFormInputs() {
    setFormInputsState(true);
  }

  function disableFormInputs() {
    setFormInputsState(false);
  }

  function mouseUpHandler(event) {
    var currentTarget = event.currentTarget;
    var generatedPinElements = generatePins();
    var pinLocation = getPinLocation(currentTarget);

    mapElement.classList.remove('map--faded');
    adFormContainer.classList.remove('ad-form--disabled');
    enableFormInputs();
    updateAddress(pinLocation);
    mapPinsElement.appendChild(generatedPinElements);
    currentTarget.removeEventListener('mouseup', mouseUpHandler);
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

  disableFormInputs();

  mapPinsMainElement.addEventListener('mouseup', mouseUpHandler);

  var nearbyLisitings = [];
  for (var i = 0; i < ADS_AMOUNT; i++) {
    var newListing = getListingsObject(i);
    nearbyLisitings.push(newListing);
  }

  mapElement.addEventListener('mouseup', pinsHandler);
}());
