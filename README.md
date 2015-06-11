# Bondo
Bind an object to a VDOM.

## Usage

```html
<template id="myTemplate">
  <input value="{{username}}">
  <button onclick="{{greet}}">
    Greet
  </button>
</template>
```

```js
var bondo = require('bondo');
var h = bondo.h;

var actions = {
  changedUsername: function (e) {
    state.username = e.target.value;
  },
  login: function() {
    state.loggedIn = true;
  }
};

function view(model, actions) {
  return h('main', [
    h('h1', 'Hello ' + model.attributes.username.value || 'World'),
    h('input', {onchange: actions.changedUsername}),
    h('button', {onclick: actions.login}, "Login")
  ]);
}

document.body.appendChild(bondo(element, view, actions));
```

### Components

```js
bondo.component('my-login', render, state, actions);
```

Then use it as a standard [Custom Element](https://w3c.github.io/webcomponents/spec/custom/). 

```html
<my-login></my-login>
```

[![browser support](https://ci.testling.com/jessehattabaugh/bondo.png)](https://ci.testling.com/jessehattabaugh/bondo)

## Todo

* ~~You know, tests and all that due dilligence stuff~~
* Support fields in textNodes: `<span>{{field}}</span>`
* Interpolate values instead of replacing them entirely: `<input value="Mr. {{Username}}">`
* Maybe use MutationObservers to two-way bind certain attributes instead of making you register eventhandler attributes
* Handle boolean attributes: `checked="checked"`
* Observe objects nested in models?: `{{user.name.first}}`
* Maybe iterate over arrays and objects? `each={{collection}}`
* Expressions? `hidden="{{!loggedIn}}"`
* 

## ChangeLog

6/2/2015

2.0 Trying something else. 

So I started looking into how Knockout and Angular interpret their expressions and discovered that Knockout basically evals() them in the context of the ViewModel. That seems less than safe somehow. Also parsing handlebars is a whole ball of wax in and of itself. 

[![NPM](https://nodei.co/npm/bondo.png)](https://www.npmjs.com/package/bondo)

## License

Artistic License 2.0, see [LICENSE.md](http://github.com/jessehattabaugh/bondo/blob/master/LICENSE.md) for details.
