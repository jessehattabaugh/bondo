# Bondo

This is just a little glue between [Custom Elements](https://w3c.github.io/webcomponents/spec/custom/) and [Virtual-DOM](https://github.com/Matt-Esch/virtual-dom).

## Usage

```es6
const bondo = require('bondo');
const h = bondo.h;

register({
  render() {
    h('hello-component', [
      h('h1', 'Hello ' + this.getAttribute('you') || 'World'),
      h('input', {
        onkeyup: ev => this.setAttribute('you', ev.target.value)
      })
    ])
  }
});
```

Then use it like you would any other HTML element.

```html
<hello-component you="Jesse"></hello-component>
```

Whenever the element's attributes change the render function gets called again and the element's DOM gets patched with changes.

It's simple, it works, [there're tests](https://github.com/jessehattabaugh/bondo/blob/master/test/test.js)! Is it useful for building applications? I don't know, [you tell me](https://github.com/jessehattabaugh/bondo/issues)!

## Todo

- [x] Provide hooks into the CustomElement lifecycle events
- [] Test if nesting works
- [] Create a TodoMVC app
- [] Think of a way to prerender on the server
- [] Try to pass in complex values
- [x] Maybe do something with the existing children instead of throwing them away
- [] Get a better name, vdom-elements, Ponents, Ponies, maybe see if substack will give me "Pony"

## Credits

- [Matt Esch - virtual-dom](https://github.com/Matt-Esch/virtual-dom)
- [Raynos (Jake Verbaten) - dom-delegator](https://github.com/Raynos/dom-delegator)
- [Andrea Giammarchi - document.registerElement polyfill](https://github.com/WebReflection/document-register-element)

## License

Artistic License 2.0, see [LICENSE.md](http://github.com/jessehattabaugh/bondo/blob/master/LICENSE.md) for details.

[![NPM](https://nodei.co/npm/bondo.png)](https://www.npmjs.com/package/bondo)
