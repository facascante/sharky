var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
var Schema = mongoose.Schema;


var app = express();


app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

var connection = mongoose.createConnection('mongodb://localhost/myapp');

var UserSchema = {
    "name": {
        type: String,
        required: true
    },
    "password": {
        type: String,
        required: true
    }
};

var user = connection.model('User',new Schema(UserSchema,{collection: 'User',versionKey: false}));

var db = {
    User : user
};

var emitter = require('../sharky.js');
require('../plugins/plugin.db.mongo.js')(emitter,db);

// you can call to find, create, update, delete, create bulk, update bulk from here

emitter.invokeHook('db::find',
{	
    "table" : "User",
    "content" : {
        "name" : "sharky"
    }
},
function(err,consumer){
    if(err){
        console.log(err);
    }
    else{
        console.log(consumer);
    }
});
