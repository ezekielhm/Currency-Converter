const express = require('express');
const bodyParser = require('body-parser');
const app = express();


app.use(bodyParser.json());

app.use(express.static(__dirname + '/view'));
 
var routes = require('./routes');

app.use('/',routes);

app.listen(3000);

console.log('Server Running on Port 3000');
