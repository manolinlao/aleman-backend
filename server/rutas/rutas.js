const express = require('express');
const app = express();

app.use(require('./usuario'));
app.use(require('./login'));
app.use(require('./palabra'));
app.use(require('./verbo'));

module.exports = app;
