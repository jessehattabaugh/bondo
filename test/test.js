var test = require('tape');
var bondo = require('../index.js');

test('binds model properties to attributes', function (t) {
    t.plan(1);
    var el = bondo('testOne', {username: 'jesse'});
    t.equal(el.querySelector('input').value, 'jesse');
});