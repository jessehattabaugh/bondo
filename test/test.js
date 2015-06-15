const bondo = require('../index.js');
const h = bondo.h;

const test = require('tape');
//const trigger = require('trigger-event');
const event = require('dom-events');

// 1
test("Exports virtual hypserscript on h property", function (t) {
  
  t.plan(1);
  t.equal(bondo.h('div').tagName, 'DIV');
  // todo: maybe use instance of instead?
});

// 2
test("Replaces a Custom Element's DOM with a VDOM", function (t) {
  t.plan(2);
  bondo('el-two', function () {
    return h('div#new-two', "New Two");
  });
  t.equal(document.getElementById('old-two'), null);
  t.equal(document.getElementById('new-two').tagName, 'DIV');
});

// 3
test("View functions can use attributes of element to render", function (t) {
  t.plan(1);
  bondo('el-three', function (el) {
    return h('div#id-three', el.attributes['att-three'].value);
  });
  t.equal(document.getElementById('id-three').innerText, 'val-three');
});

// 4
test("Mutations on the element's attributes will trigger a render", function (t) {
  t.plan(1);
  bondo('el-four', function (el) {
    return h('div#fourInner', el.attributes.foo.value);
  });
  document.getElementById('four').setAttribute('foo', 'baz');
  // todo: if dom update takes too long this timeout interval might not work
  setTimeout(function () {
    t.equal(document.getElementById('fourInner').innerText, 'baz');
  }, 1000);
});

// 5
test("event delegation works", function (t) {
  t.plan(1);
  function clickFive() {
    t.pass('handler triggered');
  }
  function viewFive(el) {
    return h('button#fiveButton', {'ev-click': clickFive}, "five button");
  }
  bondo('el-five', viewFive);
  // manually trigger the click event
  document.getElementById('fiveButton').dispatchEvent(new MouseEvent('click'));
});

// 6
test("view function receives ...rest arguments", function (t) {
  t.plan(1);
  bondo('el-six', function (el, a) {
    return h('#six', a.foo);
  }, {foo: 'bar'});
  t.equal(document.getElementById('six').innerHTML, 'bar');
});

// 7
test("example from README.md", function (t) {
  t.plan(2);
  function view(el, actions) {
    return h('main', [
      h('h1#helloSeven', 'Hello ' + el.getAttribute('you') || 'World'),
      h('input#inputSeven', {'ev-keyup': actions.userInput.bind(el)})
    ]);
  }
  bondo('my-widget', view, {
    userInput: function (ev) {
      this.setAttribute('you', ev.target.value);
    }
  });
  let hello = document.getElementById('helloSeven');
  t.equal(hello.textContent, 'Hello Jesse');
  // change the value of the input and trigger a keyup
  let input = document.getElementById('inputSeven');
  input.value = 'a';
  event.emit(input, 'keyup');
  setTimeout(function () {
    t.equal(hello.textContent, 'Hello a');
  }, 1000);
});