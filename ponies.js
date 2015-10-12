'use strict';

const h = Pony.h = require('virtual-dom/h');
const diff = require('virtual-dom/diff');
const patch = require('virtual-dom/patch');
const virtualize = require('vdom-parser');

module.exports = Pony;
  
function Pony(mixin) {
  
  if (typeof mixin !== 'object') {
    throw new Error("First argument must be an object");
  }
      
  if (!mixin.render || typeof mixin.render !== 'function') {
    throw new Error("Ponies must have a render function");
  }
  
  if (!mixin.name || !mixin.name.match(/\w-\w/)) {
    throw new Error("name must contain a dash");
  }
  
  class CustomElement extends HTMLElement {
    _update() {
      let vdom = this.render();
      
      if (!Object.getPrototypeOf(h()).isPrototypeOf(vdom)) {
        //throw new Error("Render function must return a vdom tree");
      }
      
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
  
  Object.assign(CustomElement.prototype, mixin);
  
  document.registerElement(mixin.name, CustomElement);
}
