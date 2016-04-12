var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var ip = 'localhost';
var port = 3000;
module.exports = {
  "app": app,
  "http": http,
  "io": io,
  "ip": ip,
  "port": port

}

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
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
