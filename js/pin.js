'use strict';
window.pin = (function () {
  var pinElementTemplate = document.querySelector('#pin').content.querySelector('.map__pin');

  return {
    generatePins: function () {
      var pinDocFrag = document.createDocumentFragment();
      for (var i = 0; i < window.data.nearbyLisitings.length; i++) {
        var newPinElement = pinElementTemplate.cloneNode(true);
        var newImgElement = newPinElement.querySelector('img');
        newPinElement.style.left = window.data.nearbyLisitings[i].location.x + 'px';
        newPinElement.style.top = window.data.nearbyLisitings[i].location.y + 'px';
        newPinElement.setAttribute('data-index', i);
        newImgElement.src = window.data.nearbyLisitings[i].author.avatar;
        newImgElement.alt = window.data.nearbyLisitings[i].offer.title;
        pinDocFrag.appendChild(newPinElement);
      }
      return pinDocFrag;
    },

    pinsHandler: function (event) {
      var target = event.target;

      while (target !== window.map.mapElement) {
        if (target.tagName === 'BUTTON' && target.hasAttribute('data-index')) {
          window.card.removeCard();
          window.card.showCard(target);
          return;
        }
        target = target.parentNode;
      }
    }
  };
}());
