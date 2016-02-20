'use strict';
(function() {
  var Gallery = function() {
    this.element = document.querySelector('.gallery-overlay');
    this._closeButtton = document.querySelector('.gallery-overlay-close');
    this.photo = document.querySelector('.gallery-overlay-image');
    this._onPhotoClick = this._onPhotoClick.bind(this);
    this._onKeyDown = this._onKeyDown.bind(this);
    this._onCloseClick = this._onCloseClick.bind(this);
  };
  // показ галереи
  Gallery.prototype.show = function() {
    this.element.classList.remove('invisible');
    this._closeButtton.addEventListener('click', this._onCloseClick);
    this.photo.addEventListener('click', this._onPhotoClick);
    window.addEventListener('keydown', this._onKeyDown);
  };

  // убирание галереи
  Gallery.prototype.hide = function() {
    this.element.classList.add('invisible');
    this._closeButtton.removeEventListener('click', this._onCloseClick);
    this.photo.removeEventListener('click', this._onPhotoClick);
    window.removeEventListener('keydown', this._onKeyDown);
  };

  Gallery.prototype._onCloseClick = function() {
    this.hide();
  };

  Gallery.prototype._onPhotoClick = function() {
    console.log('Click!');
  };

  Gallery.prototype._onKeyDown = function(evt) {
    if (evt.keyCode === 27) {
      this.hide();
    }
  };

  window.Gallery = Gallery;
})();
