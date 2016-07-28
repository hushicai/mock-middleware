
var connect = require('connect');
var app = connect();
var serveIndex = require('serve-index');
var serveStatic = require('serve-static');
var mock = require('../');
var path = require('path');
var mockDir = path.resolve(__dirname, './mock');
var root = path.resolve(__dirname, './public');

app.use(mock(mockDir));
app.use(serveStatic(root));
app.use(serveIndex(root));

app.listen(3000, function () {
  console.log('listening at 3000...');
});
