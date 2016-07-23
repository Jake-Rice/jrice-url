var express = require('express');
var app = express();
var mongo = require('mongodb');
require('dotenv').config({
    silent: true
});

var sites;

mongo.MongoClient.connect(process.env.MONGODB_URI || 'mongodb://0.0.0.0:27017/jrice-url', function(err, db) {
    if (err) console.log(err);
    else console.log('Successfully connected to MongoDB');
    sites=db.collection('sites');
    
    app.listen(process.env.PORT || 8080);
});

app.get('/new/:url', function(req, res) {
    var ts=Date.now();
    var s=req.params.url;
    
    sites.insert({id:ts, site:s},function(e,d){
        if (e) throw e;
        sites.find({id:ts}, function(err, cursor){
            if (err) throw err;
            cursor.next(function(e1, s){
                if (e1) throw e1;
                var jsonout={"original url": s['site'], "new url": s['id']};
                res.send(jsonout);
            });
        });
    });
});

app.get('/:url', function (req, res) {
    var shortid=req.params.url;
    sites.findOne({id:parseInt(shortid)}, function(err, d){
        if (err) throw err;
        res.redirect("http://"+d['site']);
    });
});