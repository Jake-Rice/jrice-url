var express = require('express');
var app = express();
var mongo = require('mongodb');

mongo.MongoClient.connect(process.env.MONGOLAB_URI || 'mongodb://0.0.0.0:27017/jrice-url', function(err, db) {
    if (err) throw err;
    else console.log('Successfully connected to MongoDB');
    
    app.get('/', function(req, res) {
      res.type('text/plain');
      res.send('i am a beautiful butterfly');
    });
    
    app.listen(process.env.PORT || 8080);
});

