	'use strict';
(function() {
	// основной контейнер
  var container = document.querySelector('.pictures');
  var filters = document.querySelector('.filters');
  var activeFilter = 'filter-popular';
  filters.classList.add('hidden');
  var template = document.querySelector('#picture-template');
  var filteredPictures = [];
  var loadedPictures;
  var currentPage = 0;
  var PAGE_SIZE = 12;
// обработчик скролла
  window.addEventListener('scroll', function() {
    clearTimeout(scrollTimeout);
    var scrollTimeout = setTimeout(function() {
      var picturesCoordinates = container.getBoundingClientRect();
      var viewport = window.innerHeight;
      if (picturesCoordinates.bottom <= viewport) {
        if (currentPage < Math.ceil(filteredPictures.length / PAGE_SIZE)) {
          drawPictures(++currentPage);
        }
      }
    }, 100);
  });

  getPictures();
  // обработка данных
  function drawPictures(pageNumber, replace) {
    if (replace) {
      container.innerHTML = '';
    }
    var newPictureFragment = document.createDocumentFragment();
    var from = pageNumber * PAGE_SIZE;
    var to = from + PAGE_SIZE;
    var picturesPerPage = filteredPictures.slice(from, to);

    picturesPerPage.forEach(function(picture) {
      var element = getPicturesFromTemplate(picture, template);
      newPictureFragment.appendChild(element);
    });
    container.appendChild(newPictureFragment);
  }

  filters.classList.remove('hidden');
// загрузка фото по AJAX
  function getPictures() {
    var xhr = new XMLHttpRequest();
    xhr.timeout = 10000;
    xhr.open('GET', 'https://o0.github.io/assets/json/pictures.json');

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
      drawPictures(currentPage);
      setActiveFilter(activeFilter, true);
    };
    xhr.send();
  }

// обработка фильтров
  function setActiveFilter(id, force) {
    if (activeFilter === id && !force) {
      return;
    }
    filteredPictures = loadedPictures.slice(0);

    switch (id) {

      case 'filter-popular' :
        break;

      case 'filter-new' :
        filteredPictures = filteredPictures.filter(function(element) {
        var twoWeeksAgo = new Date() - 14 * 24 * 60 * 60 * 1000;
        return Date.parse(element.date) > twoWeeksAgo;
      }).sort(function(a, b) {
        return Date.parse(b.date) - Date.parse(a.date);
      });
        break;

      case 'filter-discussed' :
        filteredPictures = filteredPictures.sort(function(a, b) {
          return b.comments - a.comments;
        });
        break;
    }
    currentPage = 0;
    drawPictures(0, true);
  // проверяем есть ли еще место дял картинок
    if (container.getBoundingClientRect().bottom <= window.innerHeight) {
      drawPictures(currentPage++);
    }
    activeFilter = id;
  }
// делегирование события переключения фильтров
  filters.addEventListener('click', function(evt) {
    var clickedElement = evt.target;
    if (clickedElement.classList.contains('filters-radio')) {
      setActiveFilter(clickedElement.id);
    }
  });

// обработка шаблона
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




