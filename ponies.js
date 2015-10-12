'use strict';

const h = register.h = require('virtual-dom/h');
const diff = require('virtual-dom/diff');
const patch = require('virtual-dom/patch');
const virtualize = require('vdom-parser');

module.exports = register;
  
function register(def) {
  /* def = { 
    render() { return vtree },
    is (string): the tagName of an HTML element to inherit from, defaults to 'div'
    created() { called after the element is created }
    attached() { called after the element is attached to the dom }
    changed(attrName, oldVal, newVal) { called after the element's attributes have changed }
    detached() { called after the element is detached }
  } */
  
  if (typeof def !== 'object') {
    throw new Error("Definition must be an object");
  }  
  if (!def.render || typeof def.render !== 'function') {
    throw new Error("Definition object must have a render method");
  }
  
  // Create a blank element to extend
  let el = document.createElement(def.is ? def.is : 'div');
  
  // Get the tagName of the vnode returned from render() 
  // since we are doing this before an element is instantiated we bind to a blank element
  let vdom = def.render.call(el);
  if (!Object.getPrototypeOf(h()).isPrototypeOf(vdom)) {
    throw new Error("Render function must return a vdom node");
  }
  let tagName = vdom.tagName;
  console.log(tagName);
  if (tagName.indexOf('-') === -1) {
    throw new Error("The tagName of the root vnode returned by render() must contain a dash");
  }
  
  class CustomElement extends Object.getPrototypeOf(el).constructor {
    _update() {
      let newVdom = def.render.call(this);
      patch(this, diff(this._vdom, newVdom));
      this._vdom = newVdom;
      console.info(tagName + " updated");
    }
    createdCallback() {
      this._vdom = virtualize(this);
      this._update();
      if (def.created) def.created.call(this);
      console.info(tagName + " created");
    }
    attachedCallback() {
      if (def.attached) def.attached.call(this);
      console.info(tagName + " attached");
    }
    attributeChangedCallback(attrName, oldVal, newVal) {
      this._update();
      if (def.changed) def.changed.call(this, attrName, oldVal, newVal);
      console.info(tagName + " changed");
    }
    detachedCallback() {
      if (def.detached) def.detached.call(this);
      console.info(tagName + " detached");
    }
  };
  
  document.registerElement(tagName, CustomElement);
}
