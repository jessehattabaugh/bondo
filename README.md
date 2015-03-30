# Bondo
Declarative data binding for DOM Nodes using Object.observe()

*Should* work in browsers that have Object.observe. To support other browsers use a [polyfill](https://www.npmjs.com/package/object.observe)!

Works great with Custom Elements! There's a [polyfill](https://www.npmjs.com/package/document-register-element) for those too y'know?

## Installation
$npm install bondo

## Usage

### html
```
<template id="myTemplate">
  <input value="{{username}}">
  <button onclick="{{greet}}">
    Greet
  </button>
</template>
```

### javascript
```
var bondo = require('bondo');

var model = {
  username: 'Friend',
  greet: function () {
    alert('Hello ' + this.username);
  }
};

document.body.appendChild(bondo('myTemplate', model));
```