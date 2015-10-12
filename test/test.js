'use strict';

const test = require('tape');
const p = require('../ponies.js');
const h = p.h;

// polyfills
require('document-register-element');

// one
test("Exports the right stuff", function (t) {
  t.plan(2);
  t.equal(typeof p, 'function');
  t.equal(p.h('div').tagName, 'DIV');
});

// two 
test("Throws exceptions on invalid arguments", function (t) {
  t.plan(7);
  t.throws(function () {
    p();
  }, "no argument");
  t.throws(function () {
    p({});
  }, "no render property");
  t.throws(function () {
    p({render: 'string'});
  }, "render property not a function");
  t.throws(function () {
    p({render() {return 'string';}});
  }, "render function doesn't return a vtree");
  t.throws(function () {
    p({render() {return h();}});
  }, "must have a name");
  t.throws(function () {
    p({render() {return h('aaaaaaaaaa');}});
  }, "tagName must contain a dash");
  t.doesNotThrow(function () {
    p({render() {return h('pony-two-d');}});
  }, "acceptable arguments don't throw an error");
});

// three
test("Replaces a Custom Element's DOM with a VDOM", function (t) {
  t.plan(3);
  t.equal(document.getElementById('old-three').tagName, 'DIV');
  p({
    render() {
      return h('pony-three', [
        h('#new-three')
      ]);
    }
  });
  t.equal(document.getElementById('old-three'), null);
  t.equal(document.getElementById('new-three').tagName, 'DIV');
});

// four
test("Created callback is executed", function (t) {
  t.plan(1);
  p({
    render() {
      return h('pony-four');
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
  p({
    render() {
      let valFive = this.attributes['att-five'] ? this.attributes['att-five'].value: 'no val';
      return h('pony-five', [
        h('div#id-five', valFive)
      ]);
    }
  });
  t.equal(document.getElementById('id-five').innerText, 'val-five');
});