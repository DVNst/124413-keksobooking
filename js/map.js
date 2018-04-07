'use strict';

var PIN_AVATAR = [1, 2, 3, 4, 5, 6, 7, 8];
var PIN_TITLE = ['Большая уютная квартира', 'Маленькая неуютная квартира', 'Огромный прекрасный дворец', 'Маленький ужасный дворец', 'Красивый гостевой домик', 'Некрасивый негостеприимный домик', 'Уютное бунгало далеко от моря', 'Неуютное бунгало по колено в воде'];
var PIN_TYPE = ['palace', 'flat', 'house', 'bungalo'];
var PIN_CHECKIN = ['12:00', '13:00', '14:00'];
var PIN_CHECKOUT = ['12:00', '13:00', '14:00'];
var PIN_FEATURES = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
var PIN_PHOTOS = ['http://o0.github.io/assets/images/tokyo/hotel1.jpg', 'http://o0.github.io/assets/images/tokyo/hotel2.jpg', 'http://o0.github.io/assets/images/tokyo/hotel3.jpg'];

document.querySelector('.map').classList.remove('map--faded');

var getRandom = function (max, min) {
  min = (!min) ? 0 : min; // если min не задон, то генерируем от 0
  return Math.round(Math.random() * (max - min) + min);
};

var getRandomArrayElement = function (arr) {
  return arr[getRandom(arr.length - 1)];
};

var getArrayElement = function (arr) {
  var arrIndex = getRandom(arr.length - 1);
  var arrElemet = arr[arrIndex];
  arr.splice(arrIndex, 1);
  return arrElemet;
};

var getRandomArrayElements = function (arr, amountElements) {
  // возвращает массив элементов в случайном порядке
  // либо, если amountElements (количество элементов) не задан, возвращает случайное количество элементов
  if (!amountElements) {
    amountElements = getRandom(arr.length, 1); // кол-во элементов в новом маcсиве

    if (amountElements === arr.length) {
      return arr;
    }
  }

  var newArr = [];
  for (var i = 0; i < amountElements; i++) {
    var arrIndex = getRandom(arr.length - 1 - i);
    var arrElemet = arr[arrIndex];

    arr[arrIndex] = arr[arr.length - 1 - i]; // меняем местами с последним - i
    arr[arr.length - 1 - i] = arrElemet;

    newArr.push(arrElemet);
  }

  return newArr;
};

var getPinItem = function () {
  var pinItem = {
    'author': {
      'avatar': 'img/avatars/user0' + getArrayElement(PIN_AVATAR) + '.png'
    },
    'location': {
      'x': getRandom(900, 300),
      'y': getRandom(500, 150)
    },
    'offer': {
      'title': getArrayElement(PIN_TITLE),
      'address': '',
      'price': getRandom(1000000, 1000),
      'type': getRandomArrayElement(PIN_TYPE),
      'rooms': getRandom(5, 1),
      'guests': getRandom(10, 1),
      'checkin': getRandomArrayElement(PIN_CHECKIN),
      'checkout': getRandomArrayElement(PIN_CHECKOUT),
      'features': getRandomArrayElements(PIN_FEATURES),
      'description': '',
      'photos': getRandomArrayElements(PIN_PHOTOS, PIN_PHOTOS.length)
    }
  };
  return pinItem;
};

var pinsList = [];
for (var i = 0; i < 8; i++) {
  pinsList.push(getPinItem());
  pinsList[i].offer.address = pinsList[i].location.x + ', ' + pinsList[i].location.y;
}

var fragment = document.createDocumentFragment();
for (i = 0; i < pinsList.length; i++) {
  var newElement = document.querySelector('template').content.querySelector('.map__pin').cloneNode(true);

  var picture = newElement.querySelector('img');
  picture.src = pinsList[i].author.avatar;
  picture.alt = pinsList[i].offer.title;

  newElement.setAttribute('style', 'left:' + (pinsList[i].location.x - picture.width / 2) + 'px; top:' + (pinsList[i].location.y - picture.height) + 'px;');

  fragment.appendChild(newElement);
}

var mapPins = document.querySelector('.map__pins');
mapPins.appendChild(fragment);

newElement = document.querySelector('template').content.querySelector('.map__card').cloneNode(true);
newElement.querySelector('.popup__title').textContent = pinsList[1].offer.title;
newElement.querySelector('.popup__text--address').textContent = pinsList[1].offer.address;
newElement.querySelector('.popup__text--price').textContent = pinsList[1].offer.price + '₽/ночь';
newElement.querySelector('.popup__type').textContent = pinsList[1].offer.type;
// flat = Квартира, bungalo = Бунгало, house = Дом, palace = Цворец

newElement.querySelector('.popup__text--capacity').textContent = pinsList[1].offer.rooms + ' комнаты для ' + pinsList[1].offer.guests + ' гостей';
newElement.querySelector('.popup__text--time').textContent = 'Заезд после ' + pinsList[1].offer.checkin + ', выезд до ' + pinsList[1].offer.checkout;

// var features = newElement.querySelector('.popup__features');
// var featuresItem = features.querySelectorAll('.popup__feature');

// console.log(features);
// console.log(featuresItem);
// for (var i = 0; i < featuresItem.length; i++) {
// console.log(featuresItem[i]);
// features.removeChild(featuresItem[i]);
// console.log(pinsList[1].offer.features[i]);
// }
// console.log(featuresItem[0]);
//
// for (var i = 0; i < pinsList[1].offer.features.length; i++) {
//   console.log(pinsList[1].offer.features[i]);
//   features.appendChild(pinsList[1].offer.features[i]);
// }

// console.log(newElement);
// console.log(features);
