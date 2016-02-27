'use strict';
define(function() {
  /**
   * Наследует объет child от parent
   * @param {function} child - конструктор потомок
   * @param {function} parent - конструктор предок
   */
  function inherit(child, parent) {
    /**
     * Пустой конструктор
     * @constuctor
     */
    var EmptyConstructor = function() {};
    EmptyConstructor.prototype = parent.prototype;
    child.prototype = new EmptyConstructor();
  }
  return inherit;
});
