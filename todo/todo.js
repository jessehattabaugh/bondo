'use strict';

const bondo = require('bondo');

const app = bondo(
  'todo-list', 
  require('./listView'),
  require('./listUser')
);