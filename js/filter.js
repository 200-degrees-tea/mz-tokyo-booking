'use strict';
window.filter = (function () {
  var filterContainer = document.querySelector('.map__filters-container');
  var filterTypeElement = filterContainer.querySelector('#housing-type');
  var filterPriceElement = filterContainer.querySelector('#housing-price');
  var filterRoomsElement = filterContainer.querySelector('#housing-rooms');
  var filterGuestsElement = filterContainer.querySelector('#housing-guests');
  var filterFeaturesElement = filterContainer.querySelector('#housing-features');
  var housingFeaturesCheckboxes = document.querySelector('#housing-features').querySelectorAll('.map__checkbox');

  var type;
  var price;
  var rooms;
  var guests;
  var featuresArray = [];
  var returnProperty = {
    'middle': function (propertyPrice) {
      return (propertyPrice >= 10000 && propertyPrice <= 50000);
    },
    'low': function (propertyPrice) {
      return propertyPrice < 10000;
    },
    'high': function (propertyPrice) {
      return propertyPrice > 50000;
    },
  };

  function isCorrectType(ad) {
    return type === 'any' || ad.offer.type === type;
  }

  function isCorrectPrice(ad) {
    return price === 'any' || returnProperty[price](ad.offer.price);
  }

  function isCorrectRooms(ad) {
    return rooms === 'any' || String(ad.offer.rooms) === rooms;
  }

  function isCorrectGuest(ad) {
    return guests === 'any' || String(ad.offer.guests) === guests;
  }

  function areCorrectFeatures(ad) {
    return featuresArray.length === 0 ||
      featuresArray.every(function (elem) {
        return ad.offer.features.indexOf(elem) >= 0;
      });
  }

  function filterAds(data) {
    var unfilteredData = data.slice();
    type = filterTypeElement.value;
    price = filterPriceElement.value;
    rooms = filterRoomsElement.value;
    guests = filterGuestsElement.value;
    featuresArray = [];

    Array.prototype.forEach.call(housingFeaturesCheckboxes, function (elem) {
      if (elem.checked) {
        featuresArray.push(elem.value);
      }
    });

    var result = unfilteredData.filter(function (listing) {
      return isCorrectType(listing) && isCorrectPrice(listing) && isCorrectRooms(listing) && isCorrectGuest(listing) && areCorrectFeatures(listing);
    });
    return result;
  }

  function resetFilters() {
    filterTypeElement.value = 'any';
    filterPriceElement.value = 'any';
    filterRoomsElement.value = 'any';
    filterGuestsElement.value = 'any';
    Array.prototype.forEach.call(housingFeaturesCheckboxes, function (elem) {
      if (elem.checked) {
        elem.checked = false;
      }
    });
  }

  filterTypeElement.addEventListener('change', window.debounce(window.map.applyFilter));
  filterPriceElement.addEventListener('change', window.debounce(window.map.applyFilter));
  filterRoomsElement.addEventListener('change', window.debounce(window.map.applyFilter));
  filterGuestsElement.addEventListener('change', window.debounce(window.map.applyFilter));
  filterFeaturesElement.addEventListener('change', window.debounce(window.map.applyFilter));

  return {
    filterAds: filterAds,
    resetFilters: resetFilters
  };
}());
