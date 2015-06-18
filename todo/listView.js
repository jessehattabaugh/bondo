// the main view function for the app
const h = require('../index').h;

const events = require('events');

let ee = new events.EventEmitter();

module.exports = function (el, user) {
  return h('ul#todoList', {
      style: {
        'background': 'teal',
        'border': '.1em dashed red'
      }
    },
    [
      h('todo-item', [
        h('todo-checkbox')
      ]),
      h('todo-add', {
        'ev-click': ev => ee.emit('addTodoItem'),
        style: {
          'background': 'red'
        }
      }, "Add Item")
    ]
  );
};
