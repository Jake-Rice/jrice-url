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

app.get('/new/:url*', function(req, res) {
    var ts=Date.now();
    var s=req.url.slice(5);
    if (!validateURL(s)) res.send("Error: Invalid URL");
    else {
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
    }
});

app.get('/:url', function (req, res) {
    var shortid=req.params.url;
    sites.findOne({id:parseInt(shortid)}, function(err, d){
        if (err) throw err;
        res.redirect("http://"+d['site']);
    });
});

function validateURL(url) {
    // Checks to see if it is an actual url
    // Regex from https://gist.github.com/dperini/729294
    var regex = /^(?:(?:https?|ftp):\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,}))\.?)(?::\d{2,5})?(?:[/?#]\S*)?$/i;
    return regex.test(url);
}