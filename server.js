var express = require('express');
var app = express();
var mongo = require('mongodb');
require('dotenv').config({
    silent: true
});

var database;

mongo.MongoClient.connect(process.env.MONGODB_URI || 'mongodb://0.0.0.0:27017/jrice-url', function(err, db) {
    if (err) console.log(err);
    else console.log('Successfully connected to MongoDB');
    database=db;
    
    app.listen(process.env.PORT || 8080);
});

app.get('/', function(req, res) {
    res.type('text/plain');
    res.send('i am a beautiful butterfly');
});
