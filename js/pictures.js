	'use strict';
  /* global pictures : true */
(function() {
	// основной контейнер
  var container = document.querySelector('.pictures');
  var filters = document.querySelector('.filters');
	// обработка данных
  pictures.forEach(function(picture) {
    var element = getPicturesFromTemplate(picture);
    container.appendChild(element);
  });
///обработка шаблона
  function getPicturesFromTemplate(data) {
    var template = document.querySelector('#picture-template');
    var pictureElement;
    var image = new Image('182', '182');
    var imageLoadTimeout;


    if ('content' in template) {
      pictureElement = template.content.children[0].cloneNode(true);
    } else {
      pictureElement = template.children[0].cloneNode(true);
    }
    pictureElement.querySelector('.picture-likes').textContent = data.likes;
    pictureElement.querySelector('.picture-comments').textContent = data.comments;
    image.src = data.url;
    var replaceImg = pictureElement.querySelector('img');
			// успешная загрузка картинки
    image.onload = function() {
      clearTimeout(imageLoadTimeout);
      pictureElement.replaceChild(image, replaceImg);
      filters.classList.remove('hidden');
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




