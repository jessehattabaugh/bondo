module.exports = function (element, model) {
  let walk = require('dom-walk');
  let template = document.querySelector(`#${element.localName}`);
  let node = document.importNode(template.content, true);
  let observed = {}; // {modelPropertyKey: [attrName: [domNode,...],...],...}
  
  // walk the dom searching for attributes that contain {{keys}}
  walk(node, function (n) {
    if (n.attributes) {
      for (let i = 0, j = n.attributes.length; i < j; i++) {
        let a = n.attributes[i];
        let match = a.value.match(/\{\{(.*)\}\}/);
        if (match) { // this attribute has a {{key}}
          let key = match[1];
          
          // replace the attribute's value with the model.key
          bond(n, a.name, key);
        
          // store the attribute to update it when the model changes
          let attrArray = observed[key] || (observed[key] = []);
          let nodeArray = attrArray[a.name] || (attrArray[a.name] = []);
          nodeArray.push(n);
        }
      }
    }
    else {
      // todo: handle textNodes
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
    console.dir(arguments);
    node[attr] = (typeof model[key] === 'function') ? model[key].bind(model): model[key];
  }
  
  return node;
};
