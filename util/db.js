var mongo = require('mongodb');
var Server = mongo.Server,
    Db = mongo.Db,
    BSON = mongo.BSONPure;

var server = new Server('localhost', 27017, {auto_reconnect: true});
var db = new Db('wpomonitordb', server, { safe: true });
db.open(function(err, db) {
    console.log('Connecting to MonboDB: %s', db.databaseName);
    if (err) {
        console.trace(err);
        process.exit(1);
    }
});

module.exports.open = function (col) {
    db.collection(col, {strict:true}, function(err, collection) {
        if (err) {
            console.log("The '%s' collection doesn't exist. Creating it with sample data...", col);
        }
    });
    return db;
};
