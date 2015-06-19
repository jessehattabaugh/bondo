# Bondo

This is just a little glue between [Custom Elements](https://w3c.github.io/webcomponents/spec/custom/) and [Virtual-DOM](https://github.com/Matt-Esch/virtual-dom) using [Mutation Observers](https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver) to trigger DOM patches.

## Usage

```es6
let bondo = require('bondo');
let h = bondo.h;

function view(el, actions) {
  return h('main', [
    h('h1#helloSeven', 'Hello ' + el.getAttribute('you') || 'World'),
    h('input#inputSeven', {
      'ev-keyup': actions.myEventHandler.bind(el)
    })
  ]);
}
bondo('my-widget', view, {
  myEventHandler: function (ev) {
    this.setAttribute('you', ev.target.value);
  }
});
```

Then use it as a standard Custom Element.

```html5
<my-widget you="Jesse"></my-widget>
```

The first argument passed to the view function is the actual DOM element so it's attributes can be used when rendering the VDOM. The element's attributes will be observed and any changes will automatically trigger an update of the VDOM.

Subsequent arguments to the view function are any arguments passed to bondo() following the view function. These are optional. 

```js
bondo('example-widget', function view(el, model, intents, actions, whatever) {
  // inject as many things as you need to render your vdom
}, actions, intents, model, whatever)

```

It's simple, it works, [there're tests](https://github.com/jessehattabaugh/bondo/blob/master/test/test.js)! Is it useful for building applications? I don't know, [you tell me](https://github.com/jessehattabaugh/bondo/issues)!

## Todo

- Test if nesting works
- Create a TodoMVC app
- Think of a way to prerender on the server
- Try to pass in complex values
- Maybe do something with the existing children instead of throwing them away

## Credits

- [Matt Esch - virtual-dom](https://github.com/Matt-Esch/virtual-dom)
- [Raynos (Jake Verbaten) - dom-delegator](https://github.com/Raynos/dom-delegator)
- [Andrea Giammarchi - document.registerElement polyfill](https://github.com/WebReflection/document-register-element)
- [Graeme Yeates - MutationObserver polyfill](https://github.com/megawac/MutationObserver.js)

## License

Artistic License 2.0, see [LICENSE.md](http://github.com/jessehattabaugh/bondo/blob/master/LICENSE.md) for details.

[![NPM](https://nodei.co/npm/bondo.png)](https://www.npmjs.com/package/bondo)
