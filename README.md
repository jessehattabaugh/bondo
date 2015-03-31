# Bondo
Declarative data binding for DOM Nodes using Object.observe().

*Should* work in browsers that have [Object.observe](http://caniuse.com/#feat=object-observe). To support other browsers use a [polyfill](https://www.npmjs.com/package/object.observe)!

## Usage

[![NPM](https://nodei.co/npm/bondo.png)](https://www.npmjs.com/package/bondo)

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

var model = {
  username: 'Friend',
  greet: function () {
    alert('Hello ' + this.username);
  }
};

document.body.appendChild(bondo('myTemplate', model));
```

### Custom Elements

Works great with [Custom Elements](https://w3c.github.io/webcomponents/spec/custom/)! There's a [polyfill](https://www.npmjs.com/package/document-register-element) for those too y'know?

```html
<my-login></my-login>

<template id="my-login">
  <button hidden="{{isLoggedIn}}" onclick="{{login}}">Login</button>
  <a hidden="{{!isLoggedIn}}" href="profile/{{username}}">{{username}}</span>
</template>
```

```js
document.registerElement('my-login', {
  prototype: Object.create(HTMLElement.prototype, {
    createdCallback: {
      value: function () {
        this.appendChild(bondo(this, {
          showLoginButton: false,
          login: function () {
            this.isLoggedIn = true;
            this.username = 'jesse';
          }
        }));
      }
    }
  })
})
```

[![browser support](https://ci.testling.com/jessehattabaugh/bondo.png)](https://ci.testling.com/jessehattabaugh/bondo)

## Todo

* You know, tests and all that due dilligence stuff
* Support fields in textNodes: `<span>{{field}}</span>`
* Interpolate values instead of replacing them entirely: `<input value="Mr. {{Username}}">`
* Maybe use MutationObservers to two-way bind certain attributes instead of making you register eventhandler attributes
* Handle boolean attributes: `checked="checked"`
* Observe objects nested in models?: `{{user.name.first}}`
* Maybe iterate over arrays and objects? `each={{collection}}`
* Expressions? `hidden="{{!loggedIn}}"`

## License

Artistic License 2.0, see [LICENSE.md](http://github.com/jessehattabaugh/bondo/blob/master/LICENSE.md) for details.
