'use strict';

const bondo = require('../bondo.es6');

const app = bondo('todo-list', require('./listView.es6'));

const events = require('events');
let ee = new events.EventEmitter();

ee.on('addTodoItem', ev => console.dir(ev));

console.info('Todo Initialized');