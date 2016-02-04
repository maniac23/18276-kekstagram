	'use strict';
  /* global pictures : true */
(function() {
	// основной контейнер
  var container = document.querySelector('.pictures');
  var filters = document.querySelector('.filters');
  filters.classList.add('hidden');
  var template = document.querySelector('#picture-template');
	// обработка данных
  pictures.forEach(function(picture) {
    var element = getPicturesFromTemplate(picture, template);
    container.appendChild(element);
  });
///обработка шаблона
  filters.classList.remove('hidden');

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




