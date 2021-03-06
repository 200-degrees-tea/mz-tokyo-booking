'use strict';
window.card = (function () {
  var cardElementTemplate = document.querySelector('#card').content.querySelector('.map__card');

  return {
    generateCard: function (data) {
      var offer = data.offer;
      var newCardElement = cardElementTemplate.cloneNode(true);
      var imgElement = newCardElement.querySelector('.popup__photo').cloneNode(true);
      var photosElementContainer = newCardElement.querySelector('.popup__photos');
      var featuresElementContainer = newCardElement.querySelector('.popup__features');
      featuresElementContainer.innerHTML = '';
      photosElementContainer.innerHTML = '';

      newCardElement.querySelector('.popup__title').textContent = offer.title;
      newCardElement.querySelector('.popup__text--address').textContent = offer.address;
      newCardElement.querySelector('.popup__text--price').textContent = offer.price + ' \u00A5/night';
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
  };
}());
