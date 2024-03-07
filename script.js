'use strict';

const app = function () {
  const game = {};
  
  function init() {
    console.log('init ready');
  }
  return {
    init: init
  }
}();
