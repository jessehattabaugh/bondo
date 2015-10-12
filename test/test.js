'use strict';

const test = require('tape');
const ponies = require('../ponies.js');
const h = ponies.h;

// polyfills
require('document-register-element');

// one
test("Exports the right stuff", function (t) {
  t.plan(2);
  t.equal(typeof ponies.register, 'function');
  t.equal(typeof ponies.h, 'function');
  //t.equal(typeof ponies.Pony, 'class');
});

// two
test("Replaces a Custom Element's DOM with a VDOM", function (t) {
  t.plan(3);
  t.equal(document.getElementById('old-two').tagName, 'DIV');
  ponies.register(function () {
    return h('pony-two', [
      h('#new-two')
    ]);
  });
  t.equal(document.getElementById('old-two'), null);
  t.equal(document.getElementById('new-two').tagName, 'DIV');
});

// three
test("Created callback is executed", function (t) {
  t.plan(1);
  ponies.register(function () {
    return h('pony-three');
  }, {
    created: function () {
      console.dir(this);
      t.pass("callback called");
    }
  });
  t.timeoutAfter(1000);
});