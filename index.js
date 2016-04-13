var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var fs = require('fs-extra');

var bodyParser = require('body-parser');

var ip = 'localhost';
var port = 3000;


var login = function(username){
  fs.copy('data/sample.db', 'sessions/' + username + '.db' , function(err){
    if (err) return console.error(err);
  });
}

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

app.get('/style.css', function(req, res){
  res.sendFile(__dirname + '/style.css');
});

app.get('/:user', function(req, res){
  res.sendFile(__dirname + '/lesson.html');
});
app.use(bodyParser.urlencoded({extended: true}));
app.post('/', function(req, res){
  console.log("req:" + req.body);
  if(req.body.username !== ""){
    login(req.body.username);
    res.redirect('/' + req.body.username);
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
  "port": port

}
