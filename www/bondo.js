(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

module.exports = function (element, model) {
  var walk = require("dom-walk");
  var id = typeof element == "string" ? element : element.localName;
  var template = document.querySelector("#" + id);
  var node = document.importNode(template.content || template, true);
  var observed = {}; // {modelPropertyKey: [attrName: [domNode,...],...],...}

  // walk the DOM searching for attributes that contain {{keys}}
  walk(node, function (n) {
    if (n.attributes) {
      for (var i = 0, j = n.attributes.length; i < j; i++) {
        var a = n.attributes[i];
        var match = a.value.match(/\{\{(.*)\}\}/);
        if (match) {
          // this attribute has a {{key}}
          var key = match[1];

          // perform the
          bond(n, a.name, key);

          // store the attribute to update it when the model changes
          var attrArray = observed[key] || (observed[key] = []);
          var nodeArray = attrArray[a.name] || (attrArray[a.name] = []);
          nodeArray.push(n);
        }
      }
    } else {}
  });

  // observe the model for changes and update any attributes that are bound
  node.observer = Object.observe(model, function (changes) {
    console.log("change");
    var key = changes[0].name;
    if (observed[key]) {
      // the changed property is bound
      for (var attr in observed[key]) {
        for (var _node in observed[key][attr]) {
          bond(observed[key][attr][_node], attr, key);
        }
      }
    }
  });

  function bond(node, attr, key) {
    node[attr] = typeof model[key] === "function" ? model[key].bind(model) : model[key];
    // todo: handle embedded {{fields}} instead of replacing whole value of attribute
  }

  return node;
};

// todo: handle textNodes too

},{"dom-walk":2}],2:[function(require,module,exports){
var slice = Array.prototype.slice

module.exports = iterativelyWalk

function iterativelyWalk(nodes, cb) {
    if (!('length' in nodes)) {
        nodes = [nodes]
    }
    
    nodes = slice.call(nodes)

    while(nodes.length) {
        var node = nodes.shift(),
            ret = cb(node)

        if (ret) {
            return ret
        }

        if (node.childNodes && node.childNodes.length) {
            nodes = slice.call(node.childNodes).concat(nodes)
        }
    }
}

},{}]},{},[1]);
