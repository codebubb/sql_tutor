var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var fs = require('fs-extra');

var bodyParser = require('body-parser');
var exphbs = require('express-handlebars');

var ip = 'localhost';
var port = 3000;

var users = {};

app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');


var login = function(username, callback){
  // Async login
  var sessionid = make_sessionid(6);
  users[sessionid] = {"name": username};
  fs.copy('data/sample.db', 'sessions/' + sessionid + '_' + username + '.db', function(err){
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

app.get('/style.css', function(req, res){
  res.sendFile(__dirname + '/style.css');
});

app.get('/:lessonid/:sessionid', function(req, res){
  var data = {
    "lesson": 1,
    "user": users[req.params.sessionid]
  }
  res.render('lesson', data);
});

app.use(bodyParser.urlencoded({extended: true}));
app.post('/', function(req, res){
  console.log("req:" + req.body);
  if(req.body.username !== ""){
    login(req.body.username, function(sessionid){
      res.redirect('/lesson1/' + sessionid);
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
