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

var getRandomlocations = function (amount, xMin, xMax, Ymin, Ymax) {
  var newArr = [];
  for (var i = 0; i < amount; i++) {
    newArr[i] = [];
    newArr[i][0] = getRandom(xMax, xMin);
    newArr[i][1] = getRandom(Ymax, Ymin);
  }

  return newArr;
};

var getRandomSequenceIndex = function (lengthSequence) {
  // возвращает случайную последовательность индексов от 0 до (lengthSequence - 1)

  // формируем массив чисел, по порядку от 0 до lengthSequence
  var arraySequence = [];
  for (var i = 0; i < lengthSequence; i++) {
    arraySequence[i] = i;
  }

  // мешаем по алгоритму Фишера-Йейса (Fisher-Yates)
  for (i = arraySequence.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var temp = arraySequence[i];
    arraySequence[i] = arraySequence[j];
    arraySequence[j] = temp;
  }

  return arraySequence;
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
// создаем массив со случайными координатами (адресами)
var locationsArray = getRandomlocations(PIN_AMOUNT, LOCATION_X_BEGIN, LOCATION_X_END, LOCATION_Y_BEGIN, LOCATION_Y_END);
// индексы, в случайном порядке, для картинок аватарок
var pinAvatarIndex = getRandomSequenceIndex(PIN_AMOUNT);
// индексы, в случайном порядке, для массива с заголовками объявлений
var pinTitleIndex = getRandomSequenceIndex(PIN_TITLE.length);

var getPinItem = function (i) {
  return {
    'author': {
      'avatar': 'img/avatars/user0' + (pinAvatarIndex[i] + 1) + '.png'
    },
    'location': {
      'x': locationsArray[i][0],
      'y': locationsArray[i][1]
    },
    'offer': {
      'title': PIN_TITLE[pinTitleIndex[i]],
      'address': (locationsArray[i][0] + ', ' + locationsArray[i][1]),
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

var Template = document.querySelector('template').content;
var mapPinTemplate = Template.querySelector('.map__pin');
var mapCardTemplate = Template.querySelector('.map__card');

var renderMapPins = function (arr) {
  var fragment = document.createDocumentFragment();
  for (i = 0; i < arr.length; i++) {
    var newElement = mapPinTemplate.cloneNode(true);

    var picture = newElement.querySelector('img');
    picture.src = arr[i].author.avatar;
    picture.alt = arr[i].offer.title;

    // newElement.offsetWidth и newElement.offsetHeight возвращают почему-то 0
    newElement.style.left = arr[i].location.x - PIN_WIDTH / 2 + 'px';
    newElement.style.top = arr[i].location.y - PIN_HEIGHT + 'px';

    fragment.appendChild(newElement);
  }

  return fragment;
};

var mapPins = document.querySelector('.map__pins');
mapPins.appendChild(renderMapPins(pinsList));

var renderPopupMapCard = function (arr) {
  var fragment = document.createDocumentFragment();
  var newElement = mapCardTemplate.cloneNode(true);

  newElement.querySelector('.popup__title').textContent = arr[0].offer.title;
  newElement.querySelector('.popup__text--address').textContent = arr[0].offer.address;
  newElement.querySelector('.popup__text--price').textContent = arr[0].offer.price + '₽/ночь';
  newElement.querySelector('.popup__type').textContent = PIN_TYPE_TEXT[arr[0].offer.type];
  newElement.querySelector('.popup__text--capacity').textContent = arr[0].offer.rooms + ' комнаты для ' + arr[0].offer.guests + ' гостей';
  newElement.querySelector('.popup__text--time').textContent = 'Заезд после ' + arr[0].offer.checkin + ', выезд до ' + arr[0].offer.checkout;

  // ПРИЕМУЩЕСТВА (УДОБСТВА):
  var PopupFeatures = newElement.querySelector('.popup__features');
  // удаляем все li из заготовки
  while (PopupFeatures.firstChild) {
    PopupFeatures.removeChild(PopupFeatures.firstChild);
  }
  // создаем и добавляем новые li с нужными классами
  for (i = 0; i < arr[0].offer.features.length; i++) {
    var PopupFeatureItem = document.createElement('li');
    PopupFeatureItem.classList.add('popup__feature');
    PopupFeatureItem.classList.add('popup__feature--' + arr[0].offer.features[i]);
    PopupFeatures.appendChild(PopupFeatureItem);
  }

  newElement.querySelector('.popup__description').textContent = arr[0].offer.description;

  // ФОТОГРАФИИ:
  var popupPhotos = newElement.querySelector('.popup__photos');
  // копируем селектор img
  var popupPhotoPicture = popupPhotos.querySelector('img');
  // удаляем всe img из заготовки
  while (popupPhotos.firstChild) {
    popupPhotos.removeChild(popupPhotos.firstChild);
  }
  // создаем и добавляем новые img с нужным src
  for (i = 0; i < arr[0].offer.photos.length; i++) {
    var popupPhotoPictureItem = popupPhotoPicture.cloneNode();
    popupPhotoPictureItem.src = arr[0].offer.photos[i];
    popupPhotos.appendChild(popupPhotoPictureItem);
  }

  // АВАТАРКА:
  var popupAvatar = newElement.querySelector('.popup__avatar');
  popupAvatar.src = arr[0].author.avatar;

  fragment.appendChild(newElement);
  return fragment;
};

var map = document.querySelector('.map');
map.appendChild(renderPopupMapCard(pinsList));
