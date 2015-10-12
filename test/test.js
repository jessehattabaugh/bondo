'use strict';

const test = require('tape');
const ponies = require('../ponies.js');
const h = ponies.h;

// polyfills
require('document-register-element');

// one
test("Exports the right stuff", function (t) {
  t.plan(2);
  t.equal(typeof ponies, 'function');
  t.equal(ponies.h('div').tagName, 'DIV');
});

// two 
test("Throws exceptions on invalid arguments", function (t) {
  t.plan(7);
  t.throws(function () {
    ponies();
  }, "no argument");
  t.throws(function () {
    ponies({name: 'pony-two-a'});
  }, "no render property");
  t.throws(function () {
    ponies({name: 'pony-two-b', render: 'string'});
  }, "render property not a function");
  t.throws(function () {
    ponies({name: 'pony-two-c', render() {return 'string';}});
  }, "render function doesn't return a vtree");
  t.throws(function () {
    ponies({render() {return h();}});
  }, "must have a name");
  t.throws(function () {
    ponies({name: 'aaaaaaaaaa', render() {return h('aaaaaaaaaa');}});
  }, "name must contain a dash");
  t.doesNotThrow(function () {
    ponies({name: 'pony-two-d', render() {return h('pony-two-d');}});
  }, "acceptable arguments don't throw an error");
});

// three
test("Replaces a Custom Element's DOM with a VDOM", function (t) {
  t.plan(3);
  t.equal(document.getElementById('old-three').tagName, 'DIV');
  ponies({
    name: 'pony-three',
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
  ponies({
    name: 'pony-four',
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
  ponies({
    name: 'pony-five',
    render() {
      console.debug(this);
      return h('pony-five', [
        h('div#id-five', this.attributes['att-five'].value)
      ]);
    }
  });
  t.equal(document.getElementById('id-five').innerText, 'val-five');
});