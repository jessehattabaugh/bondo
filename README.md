# ponies

My little framework for registering CustomElements that use Virtual-DOM.

## intallation

```shell
$npm install ponies
```

## usage

```es6
const register = require('ponies').register;
const h = require('ponies').h;

register({
  render() {
    h('my-little-component', [
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
<my-little-component you="Jesse"></my-little-component>
```

Whenever the element's attributes change the render function gets called again and the element's DOM gets patched with changes.

## 'register(definition)'

This function creates a subclass of HTMLElement, appends all the properties of the definition object to it