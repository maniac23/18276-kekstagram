	'use strict';
(function() {
	// основной контейнер
  var container = document.querySelector('.pictures');
  var filters = document.querySelector('.filters');
  var loadedPictures;
  filters.classList.add('hidden');
  var template = document.querySelector('#picture-template');

  getPictures();
  // обработка данных
  function drawPictures(pictures) {
    container.innerHTML = '';
    var newPictureFragment = document.createDocumentFragment();

    pictures.forEach(function(picture) {
      var element = getPicturesFromTemplate(picture, template);
      newPictureFragment.appendChild(element);
    });
    container.appendChild(newPictureFragment);
  }

///обработка шаблона
  filters.classList.remove('hidden');
// загрузка фото по AJAX
  function getPictures() {
    var xhr = new XMLHttpRequest();
    xhr.timeout = 10000;
    xhr.open('GET', 'http://o0.github.io/assets/json/pictures.json');

    xhr.onloadstart = function() {
      container.classList.add('pictures-loading');
    };
    xhr.onerror = function() {
      container.classList.add('pictures-failure');
    };
    xhr.ontimeout = function() {
      container.classList.add('pictures-failure');
    };
    xhr.onload = function(e) {
      container.classList.remove('pictures-loading');
      var rawData = e.target.response;
      loadedPictures = JSON.parse(rawData);
      drawPictures(loadedPictures);
    };
    xhr.send();
  }

// обработка фильтров
  filters.onchange = function(e) {
    e.preventDefault();
    var filter = filters.filter.value;

    switch (filter) {

      case 'popular' :
        drawPictures(loadedPictures);
        break;

      case 'new' :
        var newList = loadedPictures.slice(0);
        var filteredList = newList.filter(function(element) {
          var twoWeeksAgo = new Date() - 14 * 24 * 60 * 60 * 1000;
          return Date.parse(element.date) > twoWeeksAgo;
        }).sort(function(a, b) {
          return Date.parse(b.date) - Date.parse(a.date);
        });
        drawPictures(filteredList);
        break;

      case 'discussed' :
        var discussedList = loadedPictures.slice(0);
        discussedList.sort(function(a, b) {
          return b.comments - a.comments;
        });
        drawPictures(discussedList);
        break;
    }
  };

  function getPicturesFromTemplate(data, templateElement) {
    var pictureElement;
    var image = new Image('182', '182');
    var imageLoadTimeout;
    if ('content' in templateElement) {
      pictureElement = templateElement.content.children[0].cloneNode(true);
    } else {
      pictureElement = templateElement.children[0].cloneNode(true);
    }
    pictureElement.querySelector('.picture-likes').textContent = data.likes;
    pictureElement.querySelector('.picture-comments').textContent = data.comments;
    image.src = data.url;
    var replaceImg = pictureElement.querySelector('img');
			// успешная загрузка картинки
    image.onload = function() {
      clearTimeout(imageLoadTimeout);
      pictureElement.replaceChild(image, replaceImg);

    };
			// ошибка при загрузке
    image.onerror = function() {
      pictureElement.classList.add('picture-load-failure');
    };
			// ошибка по истечению таймаута
    var IMAGE_TIMEOUT = 10000;

    imageLoadTimeout = setTimeout(function() {
      image.src = '';
      pictureElement.classList.add('picture-load-failure');
    }, IMAGE_TIMEOUT);

    return pictureElement;
  }
})();




