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
      request.get('http://' + server.ip + ':' + server.port + '/lesson1/xYzAbC', function(error, response, body){
        expect(error).toBeFalsy();
        expect(response.statusCode).toEqual(200);
        done();
      });
  });

  describe("when a user submits the form", function(){
    var sessionid;
    beforeEach(function(done){
      // Set the sessionid for the other tests
      setTimeout(function(){
        server.login('testuser', function(sid){
          sessionid = sid;
          done();
        });
      }, 1);
    });

    it("should copy a database file", function(done){
      expect(sessionid.length).toBe(6);
      server.fs.stat('sessions/' + sessionid + '_testuser.db', function(err, stats){
        expect(err).toBeFalsy();
        expect(stats).toBeTruthy();
        done();
      });
    });

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
