/**
 * Created by ApurvaPatel on 10/17/15.
 */
var express = require('express');
var app = express();
var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
var http = require('http');

var usernames = {};
app.get('/', function(req, res){
    res.sendFile(__dirname + '/index.html');
});

var io = require('socket.io').listen(app.listen(3002));
console.log('Listen to 3002');

var post_data = {
    'endpoint_name' : 607,
};

var post_options = {
    host: 'ec2-54-187-14-30.us-west-2.compute.amazonaws.com',
    port: '8080',
    path: '/SmartHome_IOT/rest/',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    }
};

// Set up the request
var post_req = http.request(post_options, function(res) {
    res.setEncoding('utf8');
    res.on('data', function (chunk) {
        console.log('Response: ' + chunk);
    });
});

// post the data
post_req.write(JSON.stringify(post_data));
post_req.end();

io.sockets.on('connection', function (socket) {

    socket.on('adduser', function (username) {

        console.log(username);

        MongoClient.connect("mongodb://***:***@ds041144.mongolab.com:41144/clientdb", function(err, db) {
            if(!err) {
                console.log("We are connected");

                var collection = db.collection('boot_info');
                collection.insert(username);

            }
        });

    });

});
