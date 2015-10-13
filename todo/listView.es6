// the main view function for the app
const h = require('../bondo.es6').h;

const events = require('events');

let ee = new events.EventEmitter();

module.exports = function (el, user) {
  return h('ul#todoList', {
      style: {
        background: 'teal',
        border: '.1em dashed red'
      }
    },
    [
      h('todo-item', [
        h('todo-checkbox')
      ]),
      h('todo-add', {
        'ev-click': function (ev) {
          ee.emit('addTodoItem');
          console.dir(ev);
        },
        style: {
          background: 'red'
        }
      }, "Add Item")
    ]
  );
};
