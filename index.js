"use strict";

module.exports = function (element, model) {
  let walk = require('dom-walk');
  let id = (typeof element == 'string') ? element : element.localName;
  let template = document.querySelector(`#${id}`);
  let node = document.importNode(template.content, true);
  let observed = {}; // {modelPropertyKey: [attrName: [domNode,...],...],...}
  
  // walk the DOM searching for attributes that contain {{keys}}
  walk(node, function (n) {
    if (n.attributes) {
      for (let i = 0, j = n.attributes.length; i < j; i++) {
        let a = n.attributes[i];
        let match = a.value.match(/\{\{(.*)\}\}/);
        if (match) { // this attribute has a {{key}}
          let key = match[1];
          
          // perform the 
          bond(n, a.name, key);
        
          // store the attribute to update it when the model changes
          let attrArray = observed[key] || (observed[key] = []);
          let nodeArray = attrArray[a.name] || (attrArray[a.name] = []);
          nodeArray.push(n);
        }
      }
    }
    else {
      // todo: handle textNodes too
    }
  });
  
  // observe the model for changes and update any attributes that are bound
  node.observer = Object.observe(model, function (changes) {
    let key = changes[0].name;
    if (observed[key]) { // the changed property is bound
      for (let attr in observed[key]) {
        for (let node in observed[key][attr]) {
          bond(observed[key][attr][node], attr, key);
        }
      }
    }
  });
  
  function bond(node, attr, key) {
    node[attr] = (typeof model[key] === 'function') ? model[key].bind(model): model[key];
    // todo: handle embedded {{fields}} instead of replacing whole value of attribute
  }
  
  return node;
};
