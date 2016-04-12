var server =  require('../index.js');
var request = require('request');
var fake_client = require('socket.io-client');

describe("when server is running",function () {
  it("should serve an index page", function(done){
      request.get('http://localhost:3000/', function(error, response, body){
        expect(response.statusCode).toEqual(200);
        done();
      });
  });
  
  it("should listen for connections", function () {
    expect(server.io).toBeDefined();
  });


  describe("when listening for messages", function(){
    var socket;
  
    beforeEach(function(done){
      expect(Object.keys(server.io.sockets.connected).length).toBe(0);
      socket = fake_client.connect('http://' + server.ip + ":" + server.port, {'transports' : ['websocket'], 'reconnection delay' : 20, 'reopen delay' : 0, 'forceNew' : true});
  
     socket.on('connect', function(){
       console.log("Fake_Client:::Connect");
       done();
     });
     socket.on('disconnect', function(){
      
     });
    });
  
    afterEach(function(done){
      if(socket.connected){
        
        socket.disconnect();

        console.log("Fake_Client:::Disconnect");
        done();
        
        expect(socket.connected).toEqual(false);
        
      }

      
    });
  
    it("should receive messages on socket", function(done){
     expect(Object.keys(server.io.sockets.connected).length).toBe(1);
     done();
    });
  });

});
