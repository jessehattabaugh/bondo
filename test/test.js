'use strict';
const test = require('tape');
const bondo = require('../bondo');
const h = bondo.h;

// one
test("Exports the right stuff", function (t) {
  t.plan(2);
  t.equal(typeof bondo, 'function');
  t.equal(h('div').tagName, 'DIV');
});

// two 
test("Throws exceptions on invalid arguments", function (t) {
  t.plan(7);
  t.throws(function () {
    bondo();
  }, "no arguments");
  t.throws(function () {
    bondo({});
  }, "no render property");
  t.throws(function () {
    bondo({render: 'string'});
  }, "render property not a function");
  t.throws(function () {
    bondo({render() {return 'string';}});
  }, "render function doesn't return a vnode");
  t.throws(function () {
    bondo({render() {return h();}});
  }, "must have a name");
  t.throws(function () {
    bondo({render() {return h('aaaaaaaaaa');}});
  }, "tagName must contain a dash");
  t.doesNotThrow(function () {
    bondo({render() {return h('el-two-d');}});
  }, "acceptable arguments don't throw an error");
});

// three
test("Replaces a Custom Element's DOM with a VDOM", function (t) {
  t.plan(3);
  t.equal(document.getElementById('id-three-old').tagName, 'DIV');
  bondo({
    render() {
      return h('el-three', [
        h('#id-three-new')
      ]);
    }
  });
  t.equal(document.getElementById('id-three-old'), null);
  t.equal(document.getElementById('id-three-new').tagName, 'DIV');
});

// four
test("Created callback is executed", function (t) {
  t.plan(1);
  bondo({
    render() {
      return h('el-four');
    },
    created() {
      t.pass("callback called");
    }
  });
  t.timeoutAfter(1000);
});

// five
test("Render function can use attributes of element to render", function (t) {
  t.plan(1);
  bondo({
    render() {
      let textFive = this.attributes['att-five'] ? this.attributes['att-five'].value: 'val-null';
      return h('el-five', [
        h('#id-five', textFive)
      ]);
    }
  });
  t.equal(document.getElementById('id-five').innerText, 'val-five');
});

// six
test("Mutations of the element's attributes will trigger a render", function (t) {
  t.plan(1);
  bondo({
    render() {
      
      let textSix = this.attributes['att-six'] ? this.attributes['att-six'].value : 'val-null';
      return h('el-six#id-six', [
        h('#id-six-child', textSix)
      ]);
    }
  });
  document.getElementById('id-six').setAttribute('att-six', 'val-six');
  // todo: if dom update takes too long this timeout interval might not work
  setTimeout(function () {
    t.equal(document.getElementById('id-six-child').innerText, 'val-six');
  }, 1000);
});

/*
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

// 8

test("passing objects to attributes", function (t) {
  t.plan(1);
  let obj = {a:'a'};
  bondo('el-eight', function (el, a) {
    return h('#eight', a.obj);
  }, {foo: obj});
  t.equal(document.getElementById('eight').innerHTML, 'bar');
});
*/
