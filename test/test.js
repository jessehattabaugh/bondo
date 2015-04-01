var test = require('tape');
var bondo = require('../index.js');
require('object.observe');

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

test('expressions work', function (t) {
  t.plan(1);
  var model = {foo: 'baz', bar: 'bam'};
  var el = bondo('templateThree', model);
  t.equal(el.querySelector('input').value, 'bazbam');
});