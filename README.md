# bondo
Declarative data binding for DOM Nodes using Object.observe()

$npm install bondo

html
'''
<template id="myTemplate">
  <input value="{{username}}">
  <button onclick="{{greet}}">
    Greet
  </button>
</template>
'''

javascript
'''
var bondo = require('bondo');

var model = {
  username: 'Friend',
  greet: function () {
    alert('Hello ' + this.username);
  }
};

document.body.appendChild(bondo('myTemplate', model));
'''

Works great with Custom Elements!

Works in browsers that have Object.observe. To support other browsers use a polyfill!