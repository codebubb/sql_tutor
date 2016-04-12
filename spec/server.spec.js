var server =  require('../index.js');
var request = require('request');
//var fake_client = require('socket.io-client');

describe("when server is running",function () {
  it("should serve an index page", function(done){
      request.get('http://localhost:3000/', function(error, response, body){
        expect(response.statusCode).toEqual(200);
        done();
      });
  });
});
  //
  // it("should listen for connections", function () {
  //   expect(server.io).toBeDefined();
  // });
  // describe("when listening for messages", function(){
  //   var socket;
  //
  //   beforeEach(function(done){
  //     socket = fake_client.connect('http://' + server.ip + ":" + server.port, {'transports' : ['websocket'], 'reconnection delay' : 0, 'reopen delay' : 0, 'force new connection' : true});
  //
  //    socket.on('connect', function(){
  //      console.log("Fake_Client:::Connect");
  //      done();
  //    });
  //   });
  //
  //   afterEach(function(done){
  //     if(socket.connected){
  //       console.log("Fake_Client:::Disconnect");
  //       socket.disconnect();
  //     }
  //     done();
  //   });
  //
  //   it("should receive messages on socket", function(){
  //     console.log("Testing for clients");
  //    expect(server.io.sockets.clients()).toBeTruthy();
  //    expect(server.io.of('/').clients().length).toBeEqual(1);
  //   });
  // });

//});
