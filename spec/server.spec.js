var server =  require('../index.js');
var request = require('request');
var fake_client = require('socket.io-client');

describe("when server is running",function () {
  it("should serve an index page", function(done){
      request.get('http://' + server.ip + ':' + server.port, function(error, response, body){
        expect(error).toBeFalsy();
        expect(response.statusCode).toEqual(200);
        done();
      });
  });

  it("should serve an admin page", function(done){
      request.get('http://' + server.ip + ':' + server.port + '/admin', function(error, response, body){
        expect(error).toBeFalsy();
        expect(response.statusCode).toEqual(200);
        done();
      });
  });

  it("should serve a user page", function(done){
      request.get('http://' + server.ip + ':' + server.port + '/test-user', function(error, response, body){
        expect(error).toBeFalsy();
        expect(response.statusCode).toEqual(200);
        done();
      });
  });

  it("should copy a database file when the user logs in", function(){
    server.login('test-user');
    expect(server.fs.stat('sessions/test-user.db', function(err, stats){
      expect(err).toBeFalsy();
      expect(stats).toBeTruthy();
    }));
  });

  it("should listen for connections", function () {
    expect(server.io).toBeDefined();
  });


  describe("when listening for messages", function(){
    var client_socket;
    beforeEach(function(){
      server.io.on('connection', function(){});
    });

    it("should receive messages", function(done){
      server.io.on('connection', function(socket){
        socket.on('test test', function(msg){
          expect(msg).toBe('test');
          done();
        });
      });
      client_socket = fake_client.connect('http://localhost:3000', {forceNew: true});
      client_socket.emit('test test', 'test');
    });



});
});
