'use strict';

const h = register.h = require('virtual-dom/h');
const diff = require('virtual-dom/diff');
const patch = require('virtual-dom/patch');
const virtualize = require('vdom-parser');

// polyfill document.registerElement() because few browsers have it yet
// http://caniuse.com/#search=registerElement
require('document-register-element');

module.exports = register;

function register(def) {
  /* def = { 
    render() { return vtree },
    is (string): the tagName of an HTML element to inherit from, defaults to 'div',
    created() { called after the element is created },
    attached() { called after the element is attached to the dom },
    changed(attrName, oldVal, newVal) { called after the element's attributes have changed },
    detached() { called after the element is detached },
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
  
  // Check for a dash in the tagname
  let tagName = vdom.tagName;
  if (tagName.indexOf('-') === -1) {
    throw new Error("The tagName of the root vnode returned by render() must contain a dash");
  }
  
  class CustomElement extends Object.getPrototypeOf(el).constructor {
    
    update() {
      let newVdom = this.render();
      patch(this, diff(this._vdom, newVdom));
      this._vdom = newVdom;
      console.info(tagName + " updated");
    }
    
    // CustomElement lifecycle callbacks
    // http://www.html5rocks.com/en/tutorials/webcomponents/customelements/#lifecycle
    createdCallback() {
      this._vdom = virtualize(this);
      this.update();
      if (this.created) this.created();
      console.info(tagName + " created");
    }
    
    attachedCallback() {
      if (this.attached) this.attached();
      console.info(tagName + " attached");
    }
    
    attributeChangedCallback(attrName, oldVal, newVal) {
      this.update();
      if (this.changed) this.changed(attrName, oldVal, newVal);
      console.info(tagName + " changed");
    }
    
    detachedCallback() {
      if (this.detached) this.detached();
      console.info(tagName + " detached");
    }
  };
  
  // mixin the definition object
  Object.assign(CustomElement.prototype, def);
  
  document.registerElement(tagName, CustomElement);
}
