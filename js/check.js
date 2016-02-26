'use strict';
define(function() {
 /**
  * Функция для перемножения элементов двух массивов
  */
  var multyplyArrays = function(a, b) {
    var result = 0;

    for (var i = 0, l = a.length; i < l; i++) {
      result += a[i] * b[i];
    }

    return result;
  };
 /**
  * Функция для суммирования элементов массива
  */
  var sumArrays = function(a) {
    var sum = 0;
    for (var i = 0; i < a.length; i++) {
      sum += a[i];
    }
    return sum;
  };
  /**
   * Функция генерирует сообщенние  о загруженном фото  в зависимости
   * от его расширения
   * @paran {*} a - параметр типа фото
   * @param  {*=} b -  параметр типа фото
   * @returns {string} -  сообщение о формате загруженного фото
  */
  var getMessage = function(a, b) { // функция для подсчета статистики по разным типам изображений
    if (typeof (a) === 'boolean') {
      if (a) {
        return 'Переданное GIF-изображение анимировано и содержит ' + b + ' кадров';
      } else {
        return 'Переданное GIF-изображение не анимировано';
      }
    } else if (typeof (a) === 'number') {
      return 'Переданное SVG-изображение содержит ' + a + ' объектов и ' + b * 4 + ' аттрибутов';
    } else if (typeof (a) === 'object') {
      if (typeof (b) === 'object') {
        return 'Общая площадь артефактов сжатия: ' + multyplyArrays(a, b) + ' пикселей';
      } else {
        return 'Количество красных точек во всех строчках изображения: ' + sumArrays(a, b);
      }
    }
  };
});

