const express = require('express');
const fs = require('fs');
const qs = require('querystring');
const path = require('path');
const sanitizeHtml = require('sanitize-html');
const bodyParser = require('body-parser');
const compression = require('compression')
const template = require('./lib/template');
const topicRouter = require('./routes/topic');
const app = express();
const port = 3000;

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(compression());

app.get('*', function(request, response, next) {
  fs.readdir('./data', function(error, filelist) {
    request.list = filelist;
    next();
  });
});

app.use('/topic', topicRouter);

app.get('/', function(request, response) {
  var title = 'Welcome';
  var description = 'Hello, Node.js';
  var list = template.list(request.list);
  var html = template.HTML(title, list,
    `
    <h2>${title}</h2>${description}<br>
    <img src="/img/coding.jpg" width="300px">
    `,
    `<a href="/topic/create">create</a>`
  );
  response.send(html);
});



app.use(function(request, response, next) {
  response.status(404).send("Sorry cant find that!");
})

app.use(function(err, request, response, next) {
  console.log(err.stack);
  response.status(500).send("Somthing broke!");
})

app.listen(port, function() {
  console.log(`Example app listening at http://localhost:${port}`)
});
