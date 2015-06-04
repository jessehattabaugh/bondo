"use strict";

let h = bondo.h = require('virtual-dom/h');
let diff = require('virtual-dom/diff');
let patch = require('virtual-dom/patch');
let createElement = require('virtual-dom/create-element');

module.exports = bondo;
  
function bondo(name, view, ...other) {
  // name is the name of the element that will be registered 
  // model is a DOM node that will be replaced with the vdom tree returned by the view
  // the model node will be passed as the first argument to the view function
  // view is a function that returns a vdom tree
  // view takes at least one object which represents the model node
  // view gets called whenever the attributes of the model node change 
  // ...other are any other values that will be applied as arguments to the view function after the model  
  
  let constructor = document.registerElement(name, {
    prototype: Object.create(HTMLElement.prototype, {
      createdCallback: {
        value: function () {
          console.dir(this);
          let oldChildren = [];
          while (this.firstChild) {
            oldChildren.push(this.firstChild);
            this.removeChild(this.firstChild);
          }
          this.appendChild(createElement(view(this)));
          /*
          // 1: Create a function that declares what the DOM should look like
          function render(count)  {
              return h('div', {
                  style: {
                      textAlign: 'center',
                      lineHeight: (100 + count) + 'px',
                      border: '1px solid red',
                      width: (100 + count) + 'px',
                      height: (100 + count) + 'px'
                  }
              }, [String(count)]);
          }

          // 2: Initialise the document
          var count = 0;      // We need some app data. Here we just store a count.

          var tree = render(count);               // We need an initial tree
          var rootNode = createElement(tree);     // Create an initial root DOM node ...
          document.body.appendChild(rootNode);    // ... and it should be in the document
          
          // 3: Wire up the update logic
          setInterval(function () {
                count++;

                var newTree = render(count);
                var patches = diff(tree, newTree);
                rootNode = patch(rootNode, patches);
                tree = newTree;
          }, 1000);
          */
        }
      }
    })
  });
  
  return constructor;
}

/*
module.exports = function (element, model) {
  let walk = require('dom-walk');
  let id = (typeof element == 'string') ? element : element.localName;
  let template = document.querySelector(`#${id}`);
  let node = document.importNode(template.content || template, true);
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
    console.log('change');
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
*/