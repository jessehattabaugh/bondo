'use strict';

const bondo = require('../index');

const app = bondo(
  'todo-list', 
  require('./listView'),
  require('./listUser')
);

console.info('todo.js');