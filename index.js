var express = require('express');
var app = express()
var http = require('http').Server(app);
var io = require('socket.io')(http);
var fs = require('fs-extra');
var sqlite3 = require('sqlite3');
var async = require('async');

var bodyParser = require('body-parser');
var exphbs = require('express-handlebars');

var ip = 'localhost';
var port = 3000;

var users = {};
var sourcedb = 'sample.db'

app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.use(express.static('public'));

var login = function(username, callback){
  // Async login
  var sessionid = make_sessionid(6);
  var dbfile = 'sessions/' + sessionid + '_' + username + '.db';
  users[sessionid] = {"name": username, "dbfile": dbfile};
  fs.copy('data/' + sourcedb, dbfile, function(err){
    callback(err || sessionid);
  });
}

function make_sessionid(length){
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
    for( var i=0; i < length; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    return text;
}

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});


app.get('/:sessionid', function(req, res){
  var data = {
    "user": users[req.params.sessionid]
  }
  res.render('lesson', data);
});

var get_results = function(statements, callback){
  var db = new sqlite3.Database('data/sample.db');
  db.serialize(function() {
    async.concat(statements, function(stmt, callback){
      db.all(stmt, function(err, rows) {
      if(err){
        var errmsg = "" + err;
        var rtnerr = {}
        rtnerr["errmsg"] = errmsg;
        rtnerr["errno"] = errmsg["errno"];
        rtnerr["code"] = errmsg["code"];
        callback(null, new Array(new Array(rtnerr)));
      } else{
        callback(null, new Array(rows));
      }
    });
  }, function(err, results){
      callback(results);
    })
});
}

app.post('/:sessionid/execute', function(req, res){
  var query = req.body.query;
  get_results(query, function(results){
    res.json(results);
  });


});

app.post('/', function(req, res){
  if(req.body.username !== ""){
    login(req.body.username, function(sessionid){
      res.redirect('/' + sessionid);
    });
  }
});

app.get('/admin', function(req, res){
  res.sendFile(__dirname + '/admin.html');
});



io.on('connection', function(socket){
  // Listening for user input....
  console.log("Server:::User connected.")
  //console.log("User logged in at: " + socket.handshake.headers.referer);

  socket.on('query display', function(msg){
    console.log(msg);
    io.emit('query display', msg);
  });

  socket.on('query execute', function(msg){
    console.log(msg);
  });

});

http.listen(port, ip, function(){
  console.log('listening on ' + ip + ':' + port);
});

module.exports = {
  "app": app,
  "http": http,
  "login": login,
  "fs": fs,
  "io": io,
  "ip": ip,
  "port": port,
  "users": users

}
