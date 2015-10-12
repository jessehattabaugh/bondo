'use strict';

const h = exports.h = require('virtual-dom/h');
const diff = require('virtual-dom/diff');
const patch = require('virtual-dom/patch');
const createElement = require('virtual-dom/create-element');
const virtualize = require('vdom-parser');

exports.register = function (render, mixin) {
  
  // todo: throw error if name doesn't contain a dash
  
  class CustomElement extends HTMLElement {
    _update() {
      let vdom = render();
      patch(this, diff(this._vdom, vdom));
      this._vdom = vdom;
      console.info(name + " updated");
    }
    createdCallback() {
      this._vdom = virtualize(this);
      this._update();
      console.info(name + " created");
      if (this.created) this.created();
    }
    attachedCallback() {
      console.info(name + " attached");
      if (this.attached) this.attached();
    }
    attributeChangedCallback(attrName, oldVal, newVal) {
      this._update();
      console.info(name + " changed");
      if (this.changed) this.changed();
    }
    detachedCallback() {
      console.info(name + " detached");
      if (this.detached) this.detached();
    }
  };
  
  if (mixin) {
    Object.assign(CustomElement.prototype, mixin)
  }
  
  let vdom = render();
  document.registerElement(vdom.tagName, CustomElement);
}

