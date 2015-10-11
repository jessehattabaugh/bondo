'use strict';
console.log("hello 2 world");

// polyfills
require('document-register-element');

var h = bondo.h = require('virtual-dom/h');
var diff = require('virtual-dom/diff');
var patch = require('virtual-dom/patch');
var createElement = require('virtual-dom/create-element');

// start dom-delegator to look for ev-* attributes
var delegator = require("dom-delegator");
var d = delegator();

module.exports = bondo;

function bondo(name, view) {
  for (var _len = arguments.length, others = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
    others[_key - 2] = arguments[_key];
  }

  var constructor = document.registerElement(name, {
    prototype: Object.create(HTMLElement.prototype, {
      _update: {
        value: function value() {
          var newTree = view.apply(undefined, [this].concat(others));
          patch(this._root, diff(this._tree, newTree));
          this._tree = newTree;
        }
      },
      createdCallback: {
        value: function value() {

          // empty the element
          while (this.firstChild) {
            this.removeChild(this.firstChild);
          }

          // render the view for the first time and put it in the custom element
          this._tree = view.apply(undefined, [this].concat(others));
          this._root = createElement(this._tree);
          this.appendChild(this._root);
        }
      },
      attributeChangedCallback: {
        value: function value() {
          this._update();
        }
      },
      detachedCallback: {
        value: function value() {
          this._observer.disconnect();
        }
      }
    })
  });

  return constructor;
}
