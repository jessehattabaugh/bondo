# Release Notes

##v3.1 - Planning

In the last version I decided to patch the custom element's entire dom node with the output of the render function. The motivation for this change was mostly to avoid requiring `render()` to have a single child node [the way React does](https://facebook.github.io/react/docs/component-specs.html#render). I find that awkward because say you have a <my-list> element. You want:

```html
<my-list>
  <my-item></my-item>
  ...
</my-list>
```

not:

```html
<my-list>
  <div>
    <my-item></my-item>
    ...
  </div>
</my-list>
```

The other benefit I got was eliminating the need for a separate "tagName" declaration, either as an argument:

```js
bondo('my-list', {render(){...}});
```

or a property of the definition object:

```js
bondo({tagName: 'my-list', render() {...}});
```

I could just intuit the name of the custom element from the name of the root element returned by `render()` like so:

```js
bondo({render(){return h('my-list')}});
```

However, it then occurred to me that this would allow users to modify the attributes of the root node, which would cause an infinite loop. Additionally, patching the user defined customElement node would blow away any user supplied attributes of the node. In other words, it's a total footgun. 

I felt like the aesthetics outweighed the potential problems, and who knows maybe the extra power would come in handy somehow. But then I started building an actual app with Bondo, and I realized something. It's kind of redundant to have to manually register all my components. It would be a lot easier to just point bondo at a directory of commonJS modules and tell it to register them all. And if I did that, I'd likely want to name the files after the custom elements they define. And if I'm doing that, then why not intuit the tagName from the filenames?

So, here's the plan; the return value of `render()` is going to represent the *children* of the customNode again, not the node itself. I still won't require a single child node, by accepting an array of vnodes as a return value. I'll have to figure out how to handle this at patch time. Then I'll take the tagName from a property on the def object like in the example above. However, if bondo is called with a single string argument, I'll assume that this is a directory of CommonJS modules, and I'll loop over it requiring all the files inside and using their filenames as tagName.

This API seems better for building actual apps, eliminates the footgun, and still avoids the awkwardness of React. Now I just have to do it :-)

##v3.0.1 - Babel 6

Babel 6 just came out, and I've been fussing with it else where so I decided to upgrade it here too. 

##v3 - Definition Object 

I've been using React at work and I'm getting more accustomed to the whole single object argument pattern. Also, I've realized how important it is to be able to hook into the lifecycle events for initializing third-party libraries and stuff. 

So, I changed the signature of the main function to accept a definition object with a required `render()` property. This function must return a VirtualNode. Unlike the `view()` argument from v2.0, the root of the vtree must include the root node of the Custom Element. This is because the `tagName` property of the returned node will be used as the name of the Custom Element when it's registered. A side-effect of this is that the `render()` function now has the ability to change the element itself (React can't do that). For this reason, setting the attributes of the Custom Element from within the render function is discouraged because it would likely trigger an update, possibly leading to an infinite loop.

Another major change is that all of the properties of the definition object are assigned to the prototype of the Custom Element. This includes `render()`. Because of that it was unecessary to pass the element as an argument since it will be available as `this`. The main reason for this change though was to allow the user to provide custom lifecycle callback functions. For this I decided to abbreviate the standard Custom Element lifecycle `*Callback()` function names. So `created()`, `attached()`, `changed()`, and `detached()` will be called after Bondo is done handling these callbacks itself. I might consider aliasing these if it becomes necessary. 

A couple implementation improvements I made along the way; [removed the MutationObserver dependency](https://github.com/jessehattabaugh/bondo/commit/d85eb084c5c08f47e5c14dbb859e08e9e3a97130#diff-d27b868d70024763b7b8eb1cf1648096L43), and [used ES6 classes to create the Custom Element prototype](https://github.com/jessehattabaugh/bondo/compare/october15?expand=1#diff-168726dbe96b3ce427e7fedce31bb0bcR43). Not sure how I missed this back in v2.0, but Custom Elements already had an `attributeChangedCallback()` which works just fine. Saves me a polyfill! The classes are just a cleaner way to subclass the HTMLElement. I got the idea from [this guy](http://h3manth.com/new/blog/2015/custom-elements-with-es6/).

Oh and one more thing; when a custom element is first created I don't hollow it out by destroying it's child nodes. I make a virtual-dom copy of them using `vdom-parser` and then call render and diff against that. Hopefully that's more efficient, but honestly I didn't do any profiling to test it. 

### Caveats

I'm pretty sure that `render()` is going to blow away any and all attributes that aren't set by `render()`. This means if the user of the componenet gives it any classes or such, they'll be lost. I know that's bad. I haven't decided what to do about that. Ideally, attributes present at creation would be preserved, but would still be able to be overridden by `render()`.

##v2.0 - Trying something new. 

The first version of Bondo was more of a data-binding tool in the style of Knockout or Angular. It took a plain object to use as a ViewModel, parsed a `<template>` for `{{handlebars}}` fields, and replaced them with values from the ViewModel. Then it used `Object.observe()` to watch for changes and update the appropriate parts of the DOM. It worked, but the template `{{fields}}` could only be identifiers for property names on the ViewModel. That means no `{{firstName + ' ' + lastName}}` or `{{!loggedIn}}`.

So, I started looking into how other declarative data-binding libraries allow for expressions. I discovered that Knockout basically evaluates them using `new Function()` which is dangerous (there's even [a custom binding provider](http://brianmhunt.github.io/articles/knockout-plus-content-security-policy) to fix this). Angular on the other hand has it's own [`$eval()`](https://docs.angularjs.org/api/ng/type/$rootScope.Scope#$eval) function that interprets a subset of Javascript expressions which makes Angular expressions safe, but [subtley different from JS](https://docs.angularjs.org/guide/expression#angular-expressions-vs-javascript-expressions). Both of these options seemed insane.

Then I read about virtual-dom. Just like React, it lets you create a lightweight virtual DOM tree and then diff/patch it against what's in the actual DOM. Since you build these trees using regular Javascript, it's no trouble at all to evaluate expressions!

So I set about rebuilding Bondo using the VDOM. This time, instead of using a `<template>` you pass in a function that returns a hyperscript vtree. This function recieves the element where the VDOM will eventually be rendered as it's first argument. This is so that attributes of the custom element can be used to pass params into the view. Instead of using `Object.observe()` to observe a separate ViewModel object I just use a MutationObserver to observe the custom element. If any of it's attributes change, I call the view function again, and patch the innerDOM of the element.

I know manipulating attributes on a DOM element isn't the coolest thing since functional reactive sliced bread, but it might be the simplest way for third parties to use your web components. At least that's the theory. There's probably a lot of things you can't do with strings, but I'll worry about that later.
