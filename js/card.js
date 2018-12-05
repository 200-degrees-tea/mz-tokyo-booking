'use strict';
window.card = (function () {
  var cardElementTemplate = document.querySelector('#card').content.querySelector('.map__card');
  var mapElement = document.querySelector('.map');

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

  // function showCard(button) {
  //   var elementIndex = +button.dataset.index;
  //   var listing = nearbyLisitings[elementIndex];
  //   var card = generateCard(listing);

  //   mapElement.appendChild(card);
  //   card.querySelector('.popup__close').addEventListener('click', closeCardHandler);
  //   button.classList.add('map__pin--active');
  // }

  // function removeCard() {
  //   var cardElement = mapElement.querySelector('.map__card');
  //   if (cardElement) {
  //     cardElement.parentNode.removeChild(cardElement);
  //     mapElement.querySelector('.map__pin--active').classList.remove('map__pin--active');
  //   }
  // }
  
  function closeCardHandler(event) {
    window.card.removeCard();
    event.currentTarget.removeEventListener('click', closeCardHandler);
  }

  return {
    showCard: function (button) {
      var elementIndex = +button.dataset.index;
      var listing = window.map.nearbyLisitings[elementIndex];
      var card = generateCard(listing);

      mapElement.appendChild(card);
      card.querySelector('.popup__close').addEventListener('click', closeCardHandler);
      button.classList.add('map__pin--active');
    },

    removeCard: function () {
      var cardElement = mapElement.querySelector('.map__card');
      if (cardElement) {
        cardElement.parentNode.removeChild(cardElement);
        mapElement.querySelector('.map__pin--active').classList.remove('map__pin--active');
      }
    }
  };
}());
