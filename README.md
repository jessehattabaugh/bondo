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
  <a hidden="{{isUsernameHidden}}">{{username}}</span>
</template>
```

```js
document.registerElement('my-login', {
  prototype: Object.create(HTMLElement.prototype, {
    createdCallback: {
      value: function () {
        this.appendChild(bondo(this, {
          isUsernameHidden: 'hidden',
          loginHidden: ''
          login: function () {
            this.loginHidden = 'hidden';
            this.isUsernameHidden: '';
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




## License

Artistic License 2.0, see [LICENSE.md](http://github.com/jessehattabaugh/bondo/blob/master/LICENSE.md) for details.
