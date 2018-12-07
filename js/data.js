'use strict';
window.data = (function () {
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

  return {
    ADS_AMOUNT: ADS_AMOUNT,
    MIN_MAP_WIDTH: MIN_MAP_WIDTH,
    MAX_MAP_WIDTH: MAX_MAP_WIDTH,
    MIN_MAP_HEIGHT: MIN_MAP_HEIGHT,
    MAX_MAP_HEIGHT: MAX_MAP_HEIGHT,

    getListingsObject: function (index) {
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
    },
  };
}());
