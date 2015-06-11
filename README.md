# Bondo
A nano framework for Web Components. Mainly just a little glue between Custom Elements and Virtual-DOM using Mutation Observers to trigger DOM patches.

## Usage

```js
let bondo = require('bondo');
let h = bondo.h;

function view(el, actions) {
  return h('main', [
    h('h1', 'Hello ' + el.getAttribute('you') || 'World'),
    h('input', {ev-change: actions.changedYou})
  ]);
}

let actions = {
  changedYou: function (ev) {
    ev.target.setAttribute('you') = e.target.value;
  }
};

bondo.component('my-widget', view, actions);
```

Then use it as a standard [Custom Element](https://w3c.github.io/webcomponents/spec/custom/). 

```html
<my-widget you="Jesse"></my-widget>
```

## Change Log

6/11/2015

2.0 Trying something new. 

The first version of Bondo was more of a data-binding tool in the style of Knockout or Angular. It took a plain object to use as a ViewModel, parsed a `&lt;template&gt;` for `{{handlebars}}` fields, and replaced them with values from the ViewModel. Then it used `Object.observe()` to watch for changes and update the appropriate parts of the DOM. It worked, but the template `{{fields}}` could only be identifiers for property names on the ViewModel. That means no `{{firstName + ' ' + lastName}}` or `{{!loggedIn}}`.

So, I started looking into how other declarative data-binding libraries allow for expressions. I discovered that Knockout basically evaluates them using `new Function()` which is dangerous (there's even [a custom binding provider](http://brianmhunt.github.io/articles/knockout-plus-content-security-policy) to fix this). Angular on the other hand has it's own [`$eval()`](https://docs.angularjs.org/api/ng/type/$rootScope.Scope#$eval) function that interprets a subset of Javascript expressions which makes Angular expressions safe, but subtley different from JS](https://docs.angularjs.org/guide/expression#angular-expressions-vs-javascript-expressions). Both of these options seemed insane.

Then I read about virtual-dom. Just like React, it lets you create a lightweight virtual DOM tree and then diff/path it against what's in the actual DOM. Since you build these trees using regular Javascript, it's no trouble at all to evaluate expressions!

So I set about rebuilding Bondo using the VDOM. This time, instead of using a `<template>` you pass in a function that returns a hyperscript vtree. This function recieves the element where the VDOM will be eventually rendered as it's first argument. This is so that attributes of the custom element can be used tp pass params into the view. This way I don't have to have a separate ViewModel object. Instead of using `Object.observe()` I use a MutationObserver to observe the element. If any of it's attributes change, I call the view function again, and patch the innerDOM of the element.

It works, there's tests! Is it useful for building applications? I don't know, you tell me!

[![NPM](https://nodei.co/npm/bondo.png)](https://www.npmjs.com/package/bondo)

## License

Artistic License 2.0, see [LICENSE.md](http://github.com/jessehattabaugh/bondo/blob/master/LICENSE.md) for details.
