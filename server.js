// URL shortener microservice

var express = require('express');
var MongoClient = require('mongodb').MongoClient;

var app = express();

var port = process.env.PORT || 8080;

app.get("/", function (req, res) {
   
   res.send("url shortener");
});

var re = new RegExp("^/new/https?://\\w+\\.\\w+$");

app.get(re, function (req, res) {
    var fullUrl = req.url;
    var indexOfSlash = fullUrl.indexOf("http");
    var originalUrl = fullUrl.substr(indexOfSlash);
    
    var randomNum = Math.floor((Math.random() * 9000) + 1000);
    // console.log(req.headers.host);
    // console.log(req.headers.host.substr(0, req.headers.host.length - 3));
    var shortUrl = "http://" + req.headers.host.substr + "/" + randomNum;
    
    var bothUrls = {original_url: originalUrl, short_url: shortUrl};
    MongoClient.connect('mongodb://localhost:27017/data', function(err, db) {
        if (err) throw err;
        
        var urlCollection = db.collection('urlCollection');
          
        urlCollection.insert(bothUrls, function(err, data) {
            if (err) throw err;
            console.log(data);
            db.close();
            });
    });
    
    res.send(JSON.stringify(bothUrls));
  
});

var re2 = new RegExp ("^/\\d{4}$");

app.get(re2, function (req, res) {
    
    var shortUrl = "http://" + req.headers.host.substr + req.url;
    // console.log(shortUrl);
    var originalUrl;
    MongoClient.connect('mongodb://localhost:27017/data', function(err, db) {
        if (err) throw err;
        
        var urlCollection = db.collection('urlCollection');
        
        
        var resultArry = urlCollection.find({
            short_url: shortUrl
        }).toArray(function(err, doc) {
            if (err) throw err;
            // console.log(doc);
            
            var originalUrl = doc[0].original_url;
            db.close();
            res.redirect(originalUrl);
        });
      
    });
});

app.get('*', function(req, res){
  
  res.send(JSON.stringify( {error: "URL invalid"}));
});

app.listen(port, function () {
  console.log('App is running on port ' + port);
});