var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('data/sample.db');

db.serialize(function() {

  db.each("SELECT name AS name FROM users", function(err, row) {
        console.log(row.name);
    });

});
