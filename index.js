"use strict";

let h = bondo.h = require('virtual-dom/h');
let diff = require('virtual-dom/diff');
let patch = require('virtual-dom/patch');
let createElement = require('virtual-dom/create-element');
let delegator = require("dom-delegator");

// start dom-delegator to look for ev-* attributes
let d = delegator();

module.exports = bondo;
  
function bondo(name, view, ...others) {
  
  let constructor = document.registerElement(name, {
    prototype: Object.create(HTMLElement.prototype, {
      _update: {
        value: function () {
          let newTree = view(this, ...others);
          patch(this._root, diff(this._tree, newTree));
          this._tree = newTree;
        }
      },
      createdCallback: {
        value: function () {
          
          // empty the element
          while (this.firstChild) {
            this.removeChild(this.firstChild);
          }
          
          // render the view for the first time and put it in the custom element
          this._tree = view(this, ...others);
          this._root = createElement(this._tree);
          this.appendChild(this._root);
          
          // update the vtree whenever the attributes change
          this._observer = new MutationObserver(function(mutations) {
            this._update();
          }.bind(this));
          this._observer.observe(this, { attributes: true });
        }
      },
      detachedCallback: {
        value: function () {
          this._observer.disconnect();
        }
      }
    })
  });
  
  return constructor;
}
