'use strict';
window.pin = (function () {
  var pinElementTemplate = document.querySelector('#pin').content.querySelector('.map__pin');

  return {
    generatePin: function (nearbyLisiting, pinIndexNum) {
      var newPinElement = pinElementTemplate.cloneNode(true);
      var newImgElement = newPinElement.querySelector('img');
      newPinElement.style.left = nearbyLisiting.location.x + 'px';
      newPinElement.style.top = nearbyLisiting.location.y + 'px';
      newPinElement.setAttribute('data-index', pinIndexNum);
      newImgElement.src = nearbyLisiting.author.avatar;
      newImgElement.alt = nearbyLisiting.offer.title;
      return newPinElement;
    }
  };
}());
