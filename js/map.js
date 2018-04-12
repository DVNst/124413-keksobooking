'use strict';

var PIN_AMOUNT = 8;
var PIN_TITLE = ['Большая уютная квартира', 'Маленькая неуютная квартира', 'Огромный прекрасный дворец', 'Маленький ужасный дворец', 'Красивый гостевой домик', 'Некрасивый негостеприимный домик', 'Уютное бунгало далеко от моря', 'Неуютное бунгало по колено в воде'];
var PIN_TYPE = ['palace', 'flat', 'house', 'bungalo'];
var PIN_TYPE_TEXT = {
  'palace': 'Дворец',
  'flat': 'Квартира',
  'house': 'Дом',
  'bungalo': 'Бунгало'};
var PIN_CHECKIN = ['12:00', '13:00', '14:00'];
var PIN_CHECKOUT = ['12:00', '13:00', '14:00'];
var PIN_FEATURES = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
var PIN_PHOTOS = ['http://o0.github.io/assets/images/tokyo/hotel1.jpg', 'http://o0.github.io/assets/images/tokyo/hotel2.jpg', 'http://o0.github.io/assets/images/tokyo/hotel3.jpg'];

var PIN_WIDTH = 50;
var PIN_HEIGHT = 70;

var LOCATION_X_BEGIN = 300;
var LOCATION_X_END = 900;
var LOCATION_Y_BEGIN = 150;
var LOCATION_Y_END = 500;
var OFFER_PRICE_MIN = 1000;
var OFFER_PRICE_MAX = 1000000;
var OFFER_ROOMS_MIN = 1;
var OFFER_ROOMS_MAX = 5;
var OFFER_QUEST_MIN = 1;
var OFFER_QUEST_MAX = 10;

document.querySelector('.map').classList.remove('map--faded');

var getRandom = function (max, min) {
  min = (!min) ? 0 : min; // если min не задан, то генерируем от 0
  return Math.round(Math.random() * (max - min) + min);
};

var getRandomArrayElement = function (arr) {
  return arr[getRandom(arr.length - 1)];
};

var getMixArray = function (arr) {
  // возвращает массив с перемешенными элементами
  for (i = arr.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var temp = arr[i];
    arr[i] = arr[j];
    arr[j] = temp;
  }

  return arr;
};

var getSequenceIndex = function (lengthSequence) {
  // возвращает массив чисел, по порядку от 0 до lengthSequence - 1

  // формируем массив чисел, по порядку от 0 до lengthSequence
  var arraySequence = [];
  for (var i = 0; i < lengthSequence; i++) {
    arraySequence[i] = i;
  }

  return arraySequence;
};

var getRandomSequenceIndex = function (amount) {
  return getMixArray(getMixArray(getSequenceIndex(amount)));
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

// индексы, в случайном порядке, для картинок аватарок
var pinAvatarIndex = getRandomSequenceIndex(PIN_AMOUNT);
// индексы, в случайном порядке, для массива с заголовками объявлений
var pinTitleIndex = getRandomSequenceIndex(PIN_TITLE.length);

var getPinItem = function (i) {
  var locationX = getRandom(LOCATION_X_END, LOCATION_X_BEGIN);
  var locationY = getRandom(LOCATION_Y_END, LOCATION_Y_BEGIN);
  return {
    'author': {
      'avatar': 'img/avatars/user0' + (pinAvatarIndex[i] + 1) + '.png'
    },
    'location': {
      'x': locationX,
      'y': locationY
    },
    'offer': {
      'title': PIN_TITLE[pinTitleIndex[i]],
      'address': (locationX + ', ' + locationY),
      'price': getRandom(OFFER_PRICE_MAX, OFFER_PRICE_MIN),
      'type': getRandomArrayElement(PIN_TYPE),
      'rooms': getRandom(OFFER_ROOMS_MAX, OFFER_ROOMS_MIN),
      'guests': getRandom(OFFER_QUEST_MAX, OFFER_QUEST_MIN),
      'checkin': getRandomArrayElement(PIN_CHECKIN),
      'checkout': getRandomArrayElement(PIN_CHECKOUT),
      'features': getRandomArrayElements(PIN_FEATURES),
      'description': '',
      'photos': getRandomArrayElements(PIN_PHOTOS, PIN_PHOTOS.length)
    }
  };
};

var pinsList = [];
for (var i = 0; i < PIN_AMOUNT; i++) {
  pinsList.push(getPinItem(i));
}

var template = document.querySelector('template').content;
var mapPinTemplate = template.querySelector('.map__pin');
var mapCardTemplate = template.querySelector('.map__card');

var renderMapPin = function (obj) {
  var newElement = mapPinTemplate.cloneNode(true);

  var picture = newElement.querySelector('img');
  picture.src = obj.author.avatar;
  picture.alt = obj.offer.title;

  newElement.style.left = obj.location.x - PIN_WIDTH / 2 + 'px';
  newElement.style.top = obj.location.y - PIN_HEIGHT + 'px';

  return newElement;
};

var renderMapPins = function (arr) {
  var fragment = document.createDocumentFragment();
  for (i = 0; i < arr.length; i++) {
    fragment.appendChild(renderMapPin(arr[i]));
  }

  return fragment;
};

var mapPins = document.querySelector('.map__pins');
mapPins.appendChild(renderMapPins(pinsList));

var renderPopupMapCard = function (obj) {
  var fragment = document.createDocumentFragment();
  var newElement = mapCardTemplate.cloneNode(true);

  newElement.querySelector('.popup__title').textContent = obj.offer.title;
  newElement.querySelector('.popup__text--address').textContent = obj.offer.address;
  newElement.querySelector('.popup__text--price').textContent = obj.offer.price + '₽/ночь';
  newElement.querySelector('.popup__type').textContent = PIN_TYPE_TEXT[obj.offer.type];
  newElement.querySelector('.popup__text--capacity').textContent = obj.offer.rooms + ' комнаты для ' + obj.offer.guests + ' гостей';
  newElement.querySelector('.popup__text--time').textContent = 'Заезд после ' + obj.offer.checkin + ', выезд до ' + obj.offer.checkout;

  // ПРИЕМУЩЕСТВА (УДОБСТВА):
  var popupFeatures = newElement.querySelector('.popup__features');
  // удаляем все li из заготовки
  while (popupFeatures.firstChild) {
    popupFeatures.removeChild(popupFeatures.firstChild);
  }
  // создаем и добавляем новые li с нужными классами
  for (i = 0; i < obj.offer.features.length; i++) {
    var popupFeatureItem = document.createElement('li');
    popupFeatureItem.classList.add('popup__feature');
    popupFeatureItem.classList.add('popup__feature--' + obj.offer.features[i]);
    popupFeatures.appendChild(popupFeatureItem);
  }

  newElement.querySelector('.popup__description').textContent = obj.offer.description;

  // ФОТОГРАФИИ:
  var popupPhotos = newElement.querySelector('.popup__photos');
  // копируем селектор img
  var popupPhotoPicture = popupPhotos.querySelector('img');
  // удаляем всe img из заготовки
  while (popupPhotos.firstChild) {
    popupPhotos.removeChild(popupPhotos.firstChild);
  }
  // создаем и добавляем новые img с нужным src
  for (i = 0; i < obj.offer.photos.length; i++) {
    var popupPhotoPictureItem = popupPhotoPicture.cloneNode();
    popupPhotoPictureItem.src = obj.offer.photos[i];
    popupPhotos.appendChild(popupPhotoPictureItem);
  }

  // АВАТАРКА:
  var popupAvatar = newElement.querySelector('.popup__avatar');
  popupAvatar.src = obj.author.avatar;

  fragment.appendChild(newElement);
  return fragment;
};

var map = document.querySelector('.map');
map.appendChild(renderPopupMapCard(pinsList[0]));
