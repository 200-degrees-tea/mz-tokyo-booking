'use strict';
(function () {
  var MIN_NUM_ROOMS = 1;
  var MAX_NUM_ROOMS = 5;
  var MIN_PRICE = 10;
  var MAX_PRICE = 100;
  var MIN_GUESTS = 1;
  var MAX_GUESTS = 10;
  var MIN_MAP_WIDTH = 0;
  var MAX_MAP_WIDTH = 1200;
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

  var mapElement = document.querySelector('.map');
  var mapPinsElement = document.querySelector('.map__pins');
  var filterElementContainer = document.querySelector('.map__filters-container');
  var pinElementTemplate = document.querySelector('#pin').content.querySelector('.map__pin');
  var cardElementTemplate = document.querySelector('#card').content.querySelector('.map__card');


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
    return arr.sort(function () {
      return Math.random() - 0.5;
    });
  }

  function getListingsObject(avatarNumber, title, type, checkin, checkout, featuresArray, photosArray) {
    var positionX = getRandomNumberInRange(MIN_MAP_WIDTH, MAX_MAP_WIDTH);
    var positionY = getRandomNumberInRange(MIN_MAP_HEIGHT, MAX_MAP_HEIGHT);

    return {
      author: {
        avatar: 'img/avatars/user0' + avatarNumber + '.png'
      },
      offer: {
        title: title,
        address: '"' + positionX + ', ' + positionY + '"',
        price: getRandomNumberInRange(MIN_PRICE, MAX_PRICE),
        type: type[getRandomNumberInRange(0, type.length)],
        rooms: getRandomNumberInRange(MIN_NUM_ROOMS, MAX_NUM_ROOMS),
        guests: getRandomNumberInRange(MIN_GUESTS, MAX_GUESTS),
        checkin: checkin[getRandomNumberInRange(0, checkin.length)],
        checkout: checkout[getRandomNumberInRange(0, checkout.length)],
        features: getSortedRandomStringsArray(featuresArray),
        description: '',
        photos: getRandomStringsArray(photosArray),
      },
      location: {
        x: positionX,
        y: positionY
      }
    };
  }

  function generatePins(container, listingsArray) {
    var pinDocFrag = document.createDocumentFragment();
    for (var i = 0; i < listingsArray.length; i++) {
      var newPinElement = container.cloneNode(true);
      var newImgElement = newPinElement.querySelector('img');
      newPinElement.style.left = listingsArray[i].location.x + 'px';
      newPinElement.style.top = listingsArray[i].location.y + 'px';
      newImgElement.src = listingsArray[i].author.avatar;
      newImgElement.alt = listingsArray[i].offer.title;
      pinDocFrag.appendChild(newPinElement);
    }

    return pinDocFrag;
  }

  function renderPins(data, container) {
    container.appendChild(data);
  }

  function generateCard(data, template) {
    var newCardElement = template.cloneNode(true);
    var photosElementContainer = newCardElement.querySelector('.popup__photos');
    var featuresElementContainer = newCardElement.querySelector('.popup__features');
    featuresElementContainer.innerHTML = '';

    newCardElement.querySelector('.popup__title').textContent = data.offer.title;
    newCardElement.querySelector('.popup__text--address').textContent = data.offer.address;
    newCardElement.querySelector('.popup__text--price').textContent = data.offer.price + ' £/night';
    newCardElement.querySelector('.popup__type').textContent = data.offer.type.charAt(0).toUpperCase() + data.offer.type.slice(1);
    newCardElement.querySelector('.popup__text--capacity').textContent = data.offer.rooms + ' rooms for ' + data.offer.guests;
    newCardElement.querySelector('.popup__text--time').textContent = 'Checking after ' + data.offer.checkin + ', checkout before ' + data.offer.checkout;
    newCardElement.querySelector('.popup__description').innerHTML = data.offer.description;
    newCardElement.querySelector('.popup__avatar').src = data.author.avatar;

    data.offer.features.forEach(function (feature) {
      var newLiElement = document.createElement('li');
      newLiElement.classList.add('popup__feature', 'popup__feature--' + feature);
      featuresElementContainer.appendChild(newLiElement);
    });

    var imgElement = newCardElement.querySelector('.popup__photo').cloneNode(true);
    photosElementContainer.innerHTML = '';
    data.offer.photos.forEach(function (elem) {
      var newImgElement = imgElement.cloneNode(true);
      newImgElement.src = elem;
      photosElementContainer.appendChild(newImgElement);
    });


    return newCardElement;
  }

  function renderCard(data, elementContainer) {
    elementContainer.insertBefore(data, elementContainer.firstElementChild);
  }

  mapElement.classList.remove('map--faded');
  var nearbyLisitings = [];

  for (var i = 0; i < ADS_AMOUNT; i++) {
    nearbyLisitings.push(getListingsObject(i + 1, TITLES[i], PROPERTY_TYPES, CHECKIN_TIMES, CHECKOUT_TIMES, FEATURES, PHOTOS));
  }

  renderPins(generatePins(pinElementTemplate, nearbyLisitings), mapPinsElement);
  renderCard(generateCard(nearbyLisitings[0], cardElementTemplate), filterElementContainer);
}());
