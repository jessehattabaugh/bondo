const bondo = require('../index.js');
require('object.observe');

const test = require('tape');

// 1
test("Exports virtual hypserscript on h property", function (t) {
  t.plan(1);
  let h = bondo.h;
  //console.dir(h('div'));
  t.equal(h('div').tagName, 'DIV');
});

// 2
test("Replaces a Custom Element's DOM with a VDOM", function (t) {
  t.plan(2);
  let h = bondo.h;
  bondo('el-two', function () {
    return h('div#new-two', "New Two");
  });
  //console.dir(document.getElementById('old-two'));
  //console.dir(document.getElementById('new-two'));
  t.equal(document.getElementById('old-two'), null);
  t.equal(document.getElementById('new-two').tagName, 'DIV');
});

/*
var test = require('tape');
test('binds model properties to attributes', function (t) {
  t.plan(1);
  var el = bondo('testOne', {username: 'user1'});
  t.equal(el.querySelector('input').value, 'user1');
});

test('when model properties change, attributes change', function (t) {
  t.plan(2);
  var model = {username: 'user2'};
  var el = bondo('testTwo', model);
  t.equal(el.querySelector('input').value, 'user2');
  model.username = 'user3';
  setTimeout(function () {
    t.equal(el.querySelector('input').value, 'user3');
  }, 0); 
});
*/